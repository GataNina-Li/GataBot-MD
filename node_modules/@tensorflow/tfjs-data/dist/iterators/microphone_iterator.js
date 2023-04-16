/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * =============================================================================
 */
import { env, tensor, util } from '@tensorflow/tfjs-core';
import { LazyIterator } from './lazy_iterator';
/**
 * Provide a stream of tensors from microphone audio stream. The tensors are
 * representing audio data as frequency-domain spectrogram generated with
 * browser's native FFT. Tensors representing time-domain waveform is available
 * based on configuration. Only works in browser environment.
 */
export class MicrophoneIterator extends LazyIterator {
    constructor(microphoneConfig) {
        super();
        this.microphoneConfig = microphoneConfig;
        this.isClosed = false;
        this.fftSize = microphoneConfig.fftSize || 1024;
        const fftSizeLog2 = Math.log2(this.fftSize);
        if (this.fftSize < 0 || fftSizeLog2 < 4 || fftSizeLog2 > 14 ||
            !Number.isInteger(fftSizeLog2)) {
            throw new Error(`Invalid fftSize: it must be a power of 2 between ` +
                `2 to 4 and 2 to 14, but got ${this.fftSize}`);
        }
        this.numFrames = microphoneConfig.numFramesPerSpectrogram || 43;
        this.sampleRateHz = microphoneConfig.sampleRateHz;
        this.columnTruncateLength =
            microphoneConfig.columnTruncateLength || this.fftSize;
        this.audioTrackConstraints = microphoneConfig.audioTrackConstraints;
        this.smoothingTimeConstant = microphoneConfig.smoothingTimeConstant || 0;
        this.includeSpectrogram =
            microphoneConfig.includeSpectrogram === false ? false : true;
        this.includeWaveform =
            microphoneConfig.includeWaveform === true ? true : false;
        if (!this.includeSpectrogram && !this.includeWaveform) {
            throw new Error('Both includeSpectrogram and includeWaveform are false. ' +
                'At least one type of data should be returned.');
        }
    }
    summary() {
        return `microphone`;
    }
    // Construct a MicrophoneIterator and start the audio stream.
    static async create(microphoneConfig = {}) {
        if (!env().get('IS_BROWSER')) {
            throw new Error('microphone API is only supported in browser environment.');
        }
        const microphoneIterator = new MicrophoneIterator(microphoneConfig);
        // Call async function start() to initialize the audio stream.
        await microphoneIterator.start();
        return microphoneIterator;
    }
    // Start the audio stream and FFT.
    async start() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: this.audioTrackConstraints == null ? true :
                    this.audioTrackConstraints,
                video: false
            });
        }
        catch (e) {
            throw new Error(`Error thrown while initializing video stream: ${e.message}`);
        }
        if (!this.stream) {
            throw new Error('Could not obtain audio from microphone.');
        }
        const ctxConstructor = 
        // tslint:disable-next-line:no-any
        window.AudioContext || window.webkitAudioContext;
        this.audioContext = new ctxConstructor();
        if (!this.sampleRateHz) {
            // If sample rate is not provided, use the available sample rate on
            // device.
            this.sampleRateHz = this.audioContext.sampleRate;
        }
        else if (this.audioContext.sampleRate !== this.sampleRateHz) {
            throw new Error(`Mismatch in sampling rate: ` +
                `Expected: ${this.sampleRateHz}; ` +
                `Actual: ${this.audioContext.sampleRate}`);
        }
        const streamSource = this.audioContext.createMediaStreamSource(this.stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = this.fftSize * 2;
        this.analyser.smoothingTimeConstant = this.smoothingTimeConstant;
        streamSource.connect(this.analyser);
        this.freqData = new Float32Array(this.fftSize);
        this.timeData = new Float32Array(this.fftSize);
        return;
    }
    async next() {
        if (this.isClosed) {
            return { value: null, done: true };
        }
        let spectrogramTensor;
        let waveformTensor;
        const audioDataQueue = await this.getAudioData();
        if (this.includeSpectrogram) {
            const freqData = this.flattenQueue(audioDataQueue.freqDataQueue);
            spectrogramTensor = this.getTensorFromAudioDataArray(freqData, [this.numFrames, this.columnTruncateLength, 1]);
        }
        if (this.includeWaveform) {
            const timeData = this.flattenQueue(audioDataQueue.timeDataQueue);
            waveformTensor = this.getTensorFromAudioDataArray(timeData, [this.numFrames * this.fftSize, 1]);
        }
        return {
            value: { 'spectrogram': spectrogramTensor, 'waveform': waveformTensor },
            done: false
        };
    }
    // Capture one result from the audio stream, and extract the value from
    // iterator.next() result.
    async capture() {
        return (await this.next()).value;
    }
    async getAudioData() {
        const freqDataQueue = [];
        const timeDataQueue = [];
        let currentFrames = 0;
        return new Promise(resolve => {
            const intervalID = setInterval(() => {
                if (this.includeSpectrogram) {
                    this.analyser.getFloatFrequencyData(this.freqData);
                    // If the audio stream is initializing, return empty queue.
                    if (this.freqData[0] === -Infinity) {
                        resolve({ freqDataQueue, timeDataQueue });
                    }
                    freqDataQueue.push(this.freqData.slice(0, this.columnTruncateLength));
                }
                if (this.includeWaveform) {
                    this.analyser.getFloatTimeDomainData(this.timeData);
                    timeDataQueue.push(this.timeData.slice());
                }
                // Clean interval and return when all frames have been collected
                if (++currentFrames === this.numFrames) {
                    clearInterval(intervalID);
                    resolve({ freqDataQueue, timeDataQueue });
                }
            }, this.fftSize / this.sampleRateHz * 1e3);
        });
    }
    // Stop the audio stream and pause the iterator.
    stop() {
        if (!this.isClosed) {
            this.isClosed = true;
            this.analyser.disconnect();
            this.audioContext.close();
            if (this.stream != null && this.stream.getTracks().length > 0) {
                this.stream.getTracks()[0].stop();
            }
        }
    }
    // Override toArray() function to prevent collecting.
    toArray() {
        throw new Error('Can not convert infinite audio stream to array.');
    }
    // Return audio sampling rate in Hz
    getSampleRate() {
        return this.sampleRateHz;
    }
    flattenQueue(queue) {
        const frameSize = queue[0].length;
        const freqData = new Float32Array(queue.length * frameSize);
        queue.forEach((data, i) => freqData.set(data, i * frameSize));
        return freqData;
    }
    getTensorFromAudioDataArray(freqData, shape) {
        const vals = new Float32Array(util.sizeFromShape(shape));
        // If the data is less than the output shape, the rest is padded with zeros.
        vals.set(freqData, vals.length - freqData.length);
        return tensor(vals, shape);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWljcm9waG9uZV9pdGVyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtZGF0YS9zcmMvaXRlcmF0b3JzL21pY3JvcGhvbmVfaXRlcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFFSCxPQUFPLEVBQUMsR0FBRyxFQUFVLE1BQU0sRUFBdUMsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFckcsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRTdDOzs7OztHQUtHO0FBQ0gsTUFBTSxPQUFPLGtCQUFtQixTQUFRLFlBQTZCO0lBZ0JuRSxZQUF1QyxnQkFBa0M7UUFDdkUsS0FBSyxFQUFFLENBQUM7UUFENkIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQWZqRSxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBaUJ2QixJQUFJLENBQUMsT0FBTyxHQUFHLGdCQUFnQixDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUM7UUFDaEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxXQUFXLEdBQUcsQ0FBQyxJQUFJLFdBQVcsR0FBRyxFQUFFO1lBQ3ZELENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUNsQyxNQUFNLElBQUksS0FBSyxDQUNYLG1EQUFtRDtnQkFDbkQsK0JBQStCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ3BEO1FBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyx1QkFBdUIsSUFBSSxFQUFFLENBQUM7UUFDaEUsSUFBSSxDQUFDLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7UUFDbEQsSUFBSSxDQUFDLG9CQUFv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QztJQUVPLFlBQVksQ0FBQyxLQUFxQjtRQUN4QyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ2xDLE1BQU0sUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUM7UUFDNUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzlELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFTywyQkFBMkIsQ0FBQyxRQUFzQixFQUFFLEtBQWU7UUFFekUsTUFBTSxJQUFJLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pELDRFQUE0RTtRQUM1RSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtlbnYsIFRlbnNvciwgdGVuc29yLCBUZW5zb3IyRCwgVGVuc29yM0QsIFRlbnNvckNvbnRhaW5lciwgdXRpbH0gZnJvbSAnQHRlbnNvcmZsb3cvdGZqcy1jb3JlJztcbmltcG9ydCB7TWljcm9waG9uZUNvbmZpZ30gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtMYXp5SXRlcmF0b3J9IGZyb20gJy4vbGF6eV9pdGVyYXRvcic7XG5cbi8qKlxuICogUHJvdmlkZSBhIHN0cmVhbSBvZiB0ZW5zb3JzIGZyb20gbWljcm9waG9uZSBhdWRpbyBzdHJlYW0uIFRoZSB0ZW5zb3JzIGFyZVxuICogcmVwcmVzZW50aW5nIGF1ZGlvIGRhdGEgYXMgZnJlcXVlbmN5LWRvbWFpbiBzcGVjdHJvZ3JhbSBnZW5lcmF0ZWQgd2l0aFxuICogYnJvd3NlcidzIG5hdGl2ZSBGRlQuIFRlbnNvcnMgcmVwcmVzZW50aW5nIHRpbWUtZG9tYWluIHdhdmVmb3JtIGlzIGF2YWlsYWJsZVxuICogYmFzZWQgb24gY29uZmlndXJhdGlvbi4gT25seSB3b3JrcyBpbiBicm93c2VyIGVudmlyb25tZW50LlxuICovXG5leHBvcnQgY2xhc3MgTWljcm9waG9uZUl0ZXJhdG9yIGV4dGVuZHMgTGF6eUl0ZXJhdG9yPFRlbnNvckNvbnRhaW5lcj4ge1xuICBwcml2YXRlIGlzQ2xvc2VkID0gZmFsc2U7XG4gIHByaXZhdGUgc3RyZWFtOiBNZWRpYVN0cmVhbTtcbiAgcHJpdmF0ZSByZWFkb25seSBmZnRTaXplOiBudW1iZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgY29sdW1uVHJ1bmNhdGVMZW5ndGg6IG51bWJlcjtcbiAgcHJpdmF0ZSBmcmVxRGF0YTogRmxvYXQzMkFycmF5O1xuICBwcml2YXRlIHRpbWVEYXRhOiBGbG9hdDMyQXJyYXk7XG4gIHByaXZhdGUgcmVhZG9ubHkgbnVtRnJhbWVzOiBudW1iZXI7XG4gIHByaXZhdGUgYW5hbHlzZXI6IEFuYWx5c2VyTm9kZTtcbiAgcHJpdmF0ZSBhdWRpb0NvbnRleHQ6IEF1ZGlvQ29udGV4dDtcbiAgcHJpdmF0ZSBzYW1wbGVSYXRlSHo6IG51bWJlcjtcbiAgcHJpdmF0ZSByZWFkb25seSBhdWRpb1RyYWNrQ29uc3RyYWludHM6IE1lZGlhVHJhY2tDb25zdHJhaW50cztcbiAgcHJpdmF0ZSByZWFkb25seSBzbW9vdGhpbmdUaW1lQ29uc3RhbnQ6IG51bWJlcjtcbiAgcHJpdmF0ZSByZWFkb25seSBpbmNsdWRlU3BlY3Ryb2dyYW06IGJvb2xlYW47XG4gIHByaXZhdGUgcmVhZG9ubHkgaW5jbHVkZVdhdmVmb3JtOiBib29sZWFuO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IG1pY3JvcGhvbmVDb25maWc6IE1pY3JvcGhvbmVDb25maWcpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZmZ0U2l6ZSA9IG1pY3JvcGhvbmVDb25maWcuZmZ0U2l6ZSB8fCAxMDI0O1xuICAgIGNvbnN0IGZmdFNpemVMb2cyID0gTWF0aC5sb2cyKHRoaXMuZmZ0U2l6ZSk7XG4gICAgaWYgKHRoaXMuZmZ0U2l6ZSA8IDAgfHwgZmZ0U2l6ZUxvZzIgPCA0IHx8IGZmdFNpemVMb2cyID4gMTQgfHxcbiAgICAgICAgIU51bWJlci5pc0ludGVnZXIoZmZ0U2l6ZUxvZzIpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEludmFsaWQgZmZ0U2l6ZTogaXQgbXVzdCBiZSBhIHBvd2VyIG9mIDIgYmV0d2VlbiBgICtcbiAgICAgICAgICBgMiB0byA0IGFuZCAyIHRvIDE0LCBidXQgZ290ICR7dGhpcy5mZnRTaXplfWApO1xuICAgIH1cblxuICAgIHRoaXMubnVtRnJhbWVzID0gbWljcm9waG9uZUNvbmZpZy5udW1GcmFtZXNQZXJTcGVjdHJvZ3JhbSB8fCA0MztcbiAgICB0aGlzLnNhbXBsZVJhdGVIeiA9IG1pY3JvcGhvbmVDb25maWcuc2FtcGxlUmF0ZUh6O1xuICAgIHRoaXMuY29sdW1uVHJ1bmNhdGVMZW5ndGggPVxuICAgICAgICBtaWNyb3Bob25lQ29uZmlnLmNvbHVtblRydW5jYXRlTGVuZ3RoIHx8IHRoaXMuZmZ0U2l6ZTtcbiAgICB0aGlzLmF1ZGlvVHJhY2tDb25zdHJhaW50cyA9IG1pY3JvcGhvbmVDb25maWcuYXVkaW9UcmFja0NvbnN0cmFpbnRzO1xuICAgIHRoaXMuc21vb3RoaW5nVGltZUNvbnN0YW50ID0gbWljcm9waG9uZUNvbmZpZy5zbW9vdGhpbmdUaW1lQ29uc3RhbnQgfHwgMDtcblxuICAgIHRoaXMuaW5jbHVkZVNwZWN0cm9ncmFtID1cbiAgICAgICAgbWljcm9waG9uZUNvbmZpZy5pbmNsdWRlU3BlY3Ryb2dyYW0gPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlO1xuICAgIHRoaXMuaW5jbHVkZVdhdmVmb3JtID1cbiAgICAgICAgbWljcm9waG9uZUNvbmZpZy5pbmNsdWRlV2F2ZWZvcm0gPT09IHRydWUgPyB0cnVlIDogZmFsc2U7XG4gICAgaWYgKCF0aGlzLmluY2x1ZGVTcGVjdHJvZ3JhbSAmJiAhdGhpcy5pbmNsdWRlV2F2ZWZvcm0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnQm90aCBpbmNsdWRlU3BlY3Ryb2dyYW0gYW5kIGluY2x1ZGVXYXZlZm9ybSBhcmUgZmFsc2UuICcgK1xuICAgICAgICAgICdBdCBsZWFzdCBvbmUgdHlwZSBvZiBkYXRhIHNob3VsZCBiZSByZXR1cm5lZC4nKTtcbiAgICB9XG4gIH1cblxuICBzdW1tYXJ5KCkge1xuICAgIHJldHVybiBgbWljcm9waG9uZWA7XG4gIH1cblxuICAvLyBDb25zdHJ1Y3QgYSBNaWNyb3Bob25lSXRlcmF0b3IgYW5kIHN0YXJ0IHRoZSBhdWRpbyBzdHJlYW0uXG4gIHN0YXRpYyBhc3luYyBjcmVhdGUobWljcm9waG9uZUNvbmZpZzogTWljcm9waG9uZUNvbmZpZyA9IHt9KSB7XG4gICAgaWYgKCFlbnYoKS5nZXQoJ0lTX0JST1dTRVInKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdtaWNyb3Bob25lIEFQSSBpcyBvbmx5IHN1cHBvcnRlZCBpbiBicm93c2VyIGVudmlyb25tZW50LicpO1xuICAgIH1cblxuICAgIGNvbnN0IG1pY3JvcGhvbmVJdGVyYXRvciA9IG5ldyBNaWNyb3Bob25lSXRlcmF0b3IobWljcm9waG9uZUNvbmZpZyk7XG5cbiAgICAvLyBDYWxsIGFzeW5jIGZ1bmN0aW9uIHN0YXJ0KCkgdG8gaW5pdGlhbGl6ZSB0aGUgYXVkaW8gc3RyZWFtLlxuICAgIGF3YWl0IG1pY3JvcGhvbmVJdGVyYXRvci5zdGFydCgpO1xuXG4gICAgcmV0dXJuIG1pY3JvcGhvbmVJdGVyYXRvcjtcbiAgfVxuXG4gIC8vIFN0YXJ0IHRoZSBhdWRpbyBzdHJlYW0gYW5kIEZGVC5cbiAgYXN5bmMgc3RhcnQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuc3RyZWFtID0gYXdhaXQgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoe1xuICAgICAgICBhdWRpbzogdGhpcy5hdWRpb1RyYWNrQ29uc3RyYWludHMgPT0gbnVsbCA/IHRydWUgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXVkaW9UcmFja0NvbnN0cmFpbnRzLFxuICAgICAgICB2aWRlbzogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgRXJyb3IgdGhyb3duIHdoaWxlIGluaXRpYWxpemluZyB2aWRlbyBzdHJlYW06ICR7ZS5tZXNzYWdlfWApO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5zdHJlYW0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IG9idGFpbiBhdWRpbyBmcm9tIG1pY3JvcGhvbmUuJyk7XG4gICAgfVxuXG4gICAgY29uc3QgY3R4Q29uc3RydWN0b3IgPVxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgICAgICh3aW5kb3cgYXMgYW55KS5BdWRpb0NvbnRleHQgfHwgKHdpbmRvdyBhcyBhbnkpLndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgICB0aGlzLmF1ZGlvQ29udGV4dCA9IG5ldyBjdHhDb25zdHJ1Y3RvcigpO1xuXG4gICAgaWYgKCF0aGlzLnNhbXBsZVJhdGVIeikge1xuICAgICAgLy8gSWYgc2FtcGxlIHJhdGUgaXMgbm90IHByb3ZpZGVkLCB1c2UgdGhlIGF2YWlsYWJsZSBzYW1wbGUgcmF0ZSBvblxuICAgICAgLy8gZGV2aWNlLlxuICAgICAgdGhpcy5zYW1wbGVSYXRlSHogPSB0aGlzLmF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hdWRpb0NvbnRleHQuc2FtcGxlUmF0ZSAhPT0gdGhpcy5zYW1wbGVSYXRlSHopIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgTWlzbWF0Y2ggaW4gc2FtcGxpbmcgcmF0ZTogYCArXG4gICAgICAgICAgYEV4cGVjdGVkOiAke3RoaXMuc2FtcGxlUmF0ZUh6fTsgYCArXG4gICAgICAgICAgYEFjdHVhbDogJHt0aGlzLmF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHN0cmVhbVNvdXJjZSA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZU1lZGlhU3RyZWFtU291cmNlKHRoaXMuc3RyZWFtKTtcbiAgICB0aGlzLmFuYWx5c2VyID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlQW5hbHlzZXIoKTtcbiAgICB0aGlzLmFuYWx5c2VyLmZmdFNpemUgPSB0aGlzLmZmdFNpemUgKiAyO1xuICAgIHRoaXMuYW5hbHlzZXIuc21vb3RoaW5nVGltZUNvbnN0YW50ID0gdGhpcy5zbW9vdGhpbmdUaW1lQ29uc3RhbnQ7XG4gICAgc3RyZWFtU291cmNlLmNvbm5lY3QodGhpcy5hbmFseXNlcik7XG4gICAgdGhpcy5mcmVxRGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5mZnRTaXplKTtcbiAgICB0aGlzLnRpbWVEYXRhID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLmZmdFNpemUpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGFzeW5jIG5leHQoKTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxUZW5zb3JDb250YWluZXI+PiB7XG4gICAgaWYgKHRoaXMuaXNDbG9zZWQpIHtcbiAgICAgIHJldHVybiB7dmFsdWU6IG51bGwsIGRvbmU6IHRydWV9O1xuICAgIH1cblxuICAgIGxldCBzcGVjdHJvZ3JhbVRlbnNvcjogVGVuc29yO1xuICAgIGxldCB3YXZlZm9ybVRlbnNvcjogVGVuc29yO1xuXG4gICAgY29uc3QgYXVkaW9EYXRhUXVldWUgPSBhd2FpdCB0aGlzLmdldEF1ZGlvRGF0YSgpO1xuICAgIGlmICh0aGlzLmluY2x1ZGVTcGVjdHJvZ3JhbSkge1xuICAgICAgY29uc3QgZnJlcURhdGEgPSB0aGlzLmZsYXR0ZW5RdWV1ZShhdWRpb0RhdGFRdWV1ZS5mcmVxRGF0YVF1ZXVlKTtcbiAgICAgIHNwZWN0cm9ncmFtVGVuc29yID0gdGhpcy5nZXRUZW5zb3JGcm9tQXVkaW9EYXRhQXJyYXkoXG4gICAgICAgICAgZnJlcURhdGEsIFt0aGlzLm51bUZyYW1lcywgdGhpcy5jb2x1bW5UcnVuY2F0ZUxlbmd0aCwgMV0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5pbmNsdWRlV2F2ZWZvcm0pIHtcbiAgICAgIGNvbnN0IHRpbWVEYXRhID0gdGhpcy5mbGF0dGVuUXVldWUoYXVkaW9EYXRhUXVldWUudGltZURhdGFRdWV1ZSk7XG4gICAgICB3YXZlZm9ybVRlbnNvciA9IHRoaXMuZ2V0VGVuc29yRnJvbUF1ZGlvRGF0YUFycmF5KFxuICAgICAgICAgIHRpbWVEYXRhLCBbdGhpcy5udW1GcmFtZXMgKiB0aGlzLmZmdFNpemUsIDFdKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IHsnc3BlY3Ryb2dyYW0nOiBzcGVjdHJvZ3JhbVRlbnNvciwgJ3dhdmVmb3JtJzogd2F2ZWZvcm1UZW5zb3J9LFxuICAgICAgZG9uZTogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FwdHVyZSBvbmUgcmVzdWx0IGZyb20gdGhlIGF1ZGlvIHN0cmVhbSwgYW5kIGV4dHJhY3QgdGhlIHZhbHVlIGZyb21cbiAgLy8gaXRlcmF0b3IubmV4dCgpIHJlc3VsdC5cbiAgYXN5bmMgY2FwdHVyZSgpOiBQcm9taXNlPHtzcGVjdHJvZ3JhbTogVGVuc29yM0QsIHdhdmVmb3JtOiBUZW5zb3IyRH0+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMubmV4dCgpKS52YWx1ZSBhc1xuICAgICAgICB7c3BlY3Ryb2dyYW06IFRlbnNvcjNELCB3YXZlZm9ybTogVGVuc29yMkR9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBnZXRBdWRpb0RhdGEoKTpcbiAgICAgIFByb21pc2U8e2ZyZXFEYXRhUXVldWU6IEZsb2F0MzJBcnJheVtdLCB0aW1lRGF0YVF1ZXVlOiBGbG9hdDMyQXJyYXlbXX0+IHtcbiAgICBjb25zdCBmcmVxRGF0YVF1ZXVlOiBGbG9hdDMyQXJyYXlbXSA9IFtdO1xuICAgIGNvbnN0IHRpbWVEYXRhUXVldWU6IEZsb2F0MzJBcnJheVtdID0gW107XG4gICAgbGV0IGN1cnJlbnRGcmFtZXMgPSAwO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGNvbnN0IGludGVydmFsSUQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmluY2x1ZGVTcGVjdHJvZ3JhbSkge1xuICAgICAgICAgIHRoaXMuYW5hbHlzZXIuZ2V0RmxvYXRGcmVxdWVuY3lEYXRhKHRoaXMuZnJlcURhdGEpO1xuICAgICAgICAgIC8vIElmIHRoZSBhdWRpbyBzdHJlYW0gaXMgaW5pdGlhbGl6aW5nLCByZXR1cm4gZW1wdHkgcXVldWUuXG4gICAgICAgICAgaWYgKHRoaXMuZnJlcURhdGFbMF0gPT09IC1JbmZpbml0eSkge1xuICAgICAgICAgICAgcmVzb2x2ZSh7ZnJlcURhdGFRdWV1ZSwgdGltZURhdGFRdWV1ZX0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmcmVxRGF0YVF1ZXVlLnB1c2godGhpcy5mcmVxRGF0YS5zbGljZSgwLCB0aGlzLmNvbHVtblRydW5jYXRlTGVuZ3RoKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaW5jbHVkZVdhdmVmb3JtKSB7XG4gICAgICAgICAgdGhpcy5hbmFseXNlci5nZXRGbG9hdFRpbWVEb21haW5EYXRhKHRoaXMudGltZURhdGEpO1xuICAgICAgICAgIHRpbWVEYXRhUXVldWUucHVzaCh0aGlzLnRpbWVEYXRhLnNsaWNlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2xlYW4gaW50ZXJ2YWwgYW5kIHJldHVybiB3aGVuIGFsbCBmcmFtZXMgaGF2ZSBiZWVuIGNvbGxlY3RlZFxuICAgICAgICBpZiAoKytjdXJyZW50RnJhbWVzID09PSB0aGlzLm51bUZyYW1lcykge1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJRCk7XG4gICAgICAgICAgcmVzb2x2ZSh7ZnJlcURhdGFRdWV1ZSwgdGltZURhdGFRdWV1ZX0pO1xuICAgICAgICB9XG4gICAgICB9LCB0aGlzLmZmdFNpemUgLyB0aGlzLnNhbXBsZVJhdGVIeiAqIDFlMyk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBTdG9wIHRoZSBhdWRpbyBzdHJlYW0gYW5kIHBhdXNlIHRoZSBpdGVyYXRvci5cbiAgc3RvcCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNDbG9zZWQpIHtcbiAgICAgIHRoaXMuaXNDbG9zZWQgPSB0cnVlO1xuICAgICAgdGhpcy5hbmFseXNlci5kaXNjb25uZWN0KCk7XG4gICAgICB0aGlzLmF1ZGlvQ29udGV4dC5jbG9zZSgpO1xuICAgICAgaWYgKHRoaXMuc3RyZWFtICE9IG51bGwgJiYgdGhpcy5zdHJlYW0uZ2V0VHJhY2tzKCkubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLnN0cmVhbS5nZXRUcmFja3MoKVswXS5zdG9wKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gT3ZlcnJpZGUgdG9BcnJheSgpIGZ1bmN0aW9uIHRvIHByZXZlbnQgY29sbGVjdGluZy5cbiAgdG9BcnJheSgpOiBQcm9taXNlPFRlbnNvcltdPiB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gbm90IGNvbnZlcnQgaW5maW5pdGUgYXVkaW8gc3RyZWFtIHRvIGFycmF5LicpO1xuICB9XG5cbiAgLy8gUmV0dXJuIGF1ZGlvIHNhbXBsaW5nIHJhdGUgaW4gSHpcbiAgZ2V0U2FtcGxlUmF0ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnNhbXBsZVJhdGVIejtcbiAgfVxuXG4gIHByaXZhdGUgZmxhdHRlblF1ZXVlKHF1ZXVlOiBGbG9hdDMyQXJyYXlbXSk6IEZsb2F0MzJBcnJheSB7XG4gICAgY29uc3QgZnJhbWVTaXplID0gcXVldWVbMF0ubGVuZ3RoO1xuICAgIGNvbnN0IGZyZXFEYXRhID0gbmV3IEZsb2F0MzJBcnJheShxdWV1ZS5sZW5ndGggKiBmcmFtZVNpemUpO1xuICAgIHF1ZXVlLmZvckVhY2goKGRhdGEsIGkpID0+IGZyZXFEYXRhLnNldChkYXRhLCBpICogZnJhbWVTaXplKSk7XG4gICAgcmV0dXJuIGZyZXFEYXRhO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRUZW5zb3JGcm9tQXVkaW9EYXRhQXJyYXkoZnJlcURhdGE6IEZsb2F0MzJBcnJheSwgc2hhcGU6IG51bWJlcltdKTpcbiAgICAgIFRlbnNvciB7XG4gICAgY29uc3QgdmFscyA9IG5ldyBGbG9hdDMyQXJyYXkodXRpbC5zaXplRnJvbVNoYXBlKHNoYXBlKSk7XG4gICAgLy8gSWYgdGhlIGRhdGEgaXMgbGVzcyB0aGFuIHRoZSBvdXRwdXQgc2hhcGUsIHRoZSByZXN0IGlzIHBhZGRlZCB3aXRoIHplcm9zLlxuICAgIHZhbHMuc2V0KGZyZXFEYXRhLCB2YWxzLmxlbmd0aCAtIGZyZXFEYXRhLmxlbmd0aCk7XG4gICAgcmV0dXJuIHRlbnNvcih2YWxzLCBzaGFwZSk7XG4gIH1cbn1cbiJdfQ==