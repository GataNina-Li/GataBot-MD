/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
import { browser, cast, env, expandDims, image, reshape, tensor1d, tensor2d, tidy, util } from '@tensorflow/tfjs-core';
import { LazyIterator } from './lazy_iterator';
/**
 * Provide a stream of image tensors from webcam video stream. Only works in
 * browser environment.
 */
export class WebcamIterator extends LazyIterator {
    constructor(webcamVideoElement, webcamConfig) {
        super();
        this.webcamVideoElement = webcamVideoElement;
        this.webcamConfig = webcamConfig;
        this.isClosed = true;
        this.resize = false;
        if (this.needToResize()) {
            this.resize = true;
            this.cropSize =
                [this.webcamConfig.resizeHeight, this.webcamConfig.resizeWidth];
            this.cropBoxInd = tensor1d([0], 'int32');
            if (this.webcamConfig.centerCrop) {
                // Calculate the box based on resizing shape.
                const widthCroppingRatio = this.webcamConfig.resizeWidth * 1.0 / this.webcamVideoElement.width;
                const heightCroppingRatio = this.webcamConfig.resizeHeight * 1.0 /
                    this.webcamVideoElement.height;
                const widthCropStart = (1 - widthCroppingRatio) / 2;
                const heightCropStart = (1 - heightCroppingRatio) / 2;
                const widthCropEnd = widthCropStart + widthCroppingRatio;
                const heightCropEnd = heightCroppingRatio + heightCropStart;
                this.cropBox = tensor2d([heightCropStart, widthCropStart, heightCropEnd, widthCropEnd], [1, 4]);
            }
            else {
                this.cropBox = tensor2d([0, 0, 1, 1], [1, 4]);
            }
        }
    }
    summary() {
        return `webcam`;
    }
    // Construct a WebcamIterator and start it's video stream.
    static async create(webcamVideoElement, webcamConfig = {}) {
        if (!env().get('IS_BROWSER')) {
            throw new Error('tf.data.webcam is only supported in browser environment.');
        }
        if (!webcamVideoElement) {
            // If webcam video element is not provided, create a hidden video element
            // with provided width and height.
            webcamVideoElement = document.createElement('video');
            if (!webcamConfig.resizeWidth || !webcamConfig.resizeHeight) {
                throw new Error('Please provide webcam video element, or resizeWidth and ' +
                    'resizeHeight to create a hidden video element.');
            }
            webcamVideoElement.width = webcamConfig.resizeWidth;
            webcamVideoElement.height = webcamConfig.resizeHeight;
        }
        const webcamIterator = new WebcamIterator(webcamVideoElement, webcamConfig);
        // Call async function to initialize the video stream.
        await webcamIterator.start();
        return webcamIterator;
    }
    // Async function to start video stream.
    async start() {
        if (this.webcamConfig.facingMode) {
            util.assert((this.webcamConfig.facingMode === 'user') ||
                (this.webcamConfig.facingMode === 'environment'), () => `Invalid webcam facing mode: ${this.webcamConfig.facingMode}. ` +
                `Please provide 'user' or 'environment'`);
        }
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: this.webcamConfig.deviceId,
                    facingMode: this.webcamConfig.facingMode ?
                        this.webcamConfig.facingMode :
                        'user',
                    width: this.webcamVideoElement.width,
                    height: this.webcamVideoElement.height
                }
            });
        }
        catch (e) {
            // Modify the error message but leave the stack trace intact
            e.message = `Error thrown while initializing video stream: ${e.message}`;
            throw e;
        }
        if (!this.stream) {
            throw new Error('Could not obtain video from webcam.');
        }
        // Older browsers may not have srcObject
        try {
            this.webcamVideoElement.srcObject = this.stream;
        }
        catch (error) {
            console.log(error);
            this.webcamVideoElement.src = window.URL.createObjectURL(this.stream);
        }
        // Start the webcam video stream
        this.webcamVideoElement.play();
        this.isClosed = false;
        return new Promise(resolve => {
            // Add event listener to make sure the webcam has been fully initialized.
            this.webcamVideoElement.onloadedmetadata = () => {
                resolve();
            };
        });
    }
    async next() {
        if (this.isClosed) {
            return { value: null, done: true };
        }
        let img;
        try {
            img = browser.fromPixels(this.webcamVideoElement);
        }
        catch (e) {
            throw new Error(`Error thrown converting video to pixels: ${JSON.stringify(e)}`);
        }
        if (this.resize) {
            try {
                return { value: this.cropAndResizeFrame(img), done: false };
            }
            catch (e) {
                throw new Error(`Error thrown cropping the video: ${e.message}`);
            }
            finally {
                img.dispose();
            }
        }
        else {
            return { value: img, done: false };
        }
    }
    needToResize() {
        // If resizeWidth and resizeHeight are provided, and different from the
        // width and height of original HTMLVideoElement, then resizing and cropping
        // is required.
        if (this.webcamConfig.resizeWidth && this.webcamConfig.resizeHeight &&
            (this.webcamVideoElement.width !== this.webcamConfig.resizeWidth ||
                this.webcamVideoElement.height !== this.webcamConfig.resizeHeight)) {
            return true;
        }
        return false;
    }
    // Cropping and resizing each frame based on config
    cropAndResizeFrame(img) {
        return tidy(() => {
            const expandedImage = expandDims(cast(img, 'float32'), (0));
            let resizedImage;
            resizedImage = image.cropAndResize(expandedImage, this.cropBox, this.cropBoxInd, this.cropSize, 'bilinear');
            // Extract image from batch cropping.
            const shape = resizedImage.shape;
            return reshape(resizedImage, shape.slice(1));
        });
    }
    // Capture one frame from the video stream, and extract the value from
    // iterator.next() result.
    async capture() {
        return (await this.next()).value;
    }
    // Stop the video stream and pause webcam iterator.
    stop() {
        const tracks = this.stream.getTracks();
        tracks.forEach(track => track.stop());
        try {
            this.webcamVideoElement.srcObject = null;
        }
        catch (error) {
            console.log(error);
            this.webcamVideoElement.src = null;
        }
        this.isClosed = true;
    }
    // Override toArray() function to prevent collecting.
    toArray() {
        throw new Error('Can not convert infinite video stream to array.');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViY2FtX2l0ZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1kYXRhL3NyYy9pdGVyYXRvcnMvd2ViY2FtX2l0ZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBRUgsT0FBTyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBWSxRQUFRLEVBQWdDLElBQUksRUFBRSxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUU3SixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFN0M7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLGNBQWUsU0FBUSxZQUFzQjtJQVF4RCxZQUN1QixrQkFBb0MsRUFDcEMsWUFBMEI7UUFDL0MsS0FBSyxFQUFFLENBQUM7UUFGYSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQWtCO1FBQ3BDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBVHpDLGFBQVEsR0FBRyxJQUFJLENBQUM7UUFFaEIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQVNyQixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRTtZQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNuQixJQUFJLENBQUMsUUFBUTtnQkFDVCxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN6QyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFO2dCQUNoQyw2Q0FBNkM7Z0JBQzdDLE1BQU0sa0JBQWtCLEdBQ3BCLElBQUksQ0FBQyxZQUFZLENB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QUMsQ0FBQztZQUNuQixJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztTQUNwQztRQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxxREFBcUQ7SUFDckQsT0FBTztRQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztJQUNyRSxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge2Jyb3dzZXIsIGNhc3QsIGVudiwgZXhwYW5kRGltcywgaW1hZ2UsIHJlc2hhcGUsIHRlbnNvcjFkLCBUZW5zb3IxRCwgdGVuc29yMmQsIFRlbnNvcjJELCBUZW5zb3IzRCwgVGVuc29yNEQsIHRpZHksIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5pbXBvcnQge1dlYmNhbUNvbmZpZ30gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtMYXp5SXRlcmF0b3J9IGZyb20gJy4vbGF6eV9pdGVyYXRvcic7XG5cbi8qKlxuICogUHJvdmlkZSBhIHN0cmVhbSBvZiBpbWFnZSB0ZW5zb3JzIGZyb20gd2ViY2FtIHZpZGVvIHN0cmVhbS4gT25seSB3b3JrcyBpblxuICogYnJvd3NlciBlbnZpcm9ubWVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIFdlYmNhbUl0ZXJhdG9yIGV4dGVuZHMgTGF6eUl0ZXJhdG9yPFRlbnNvcjNEPiB7XG4gIHByaXZhdGUgaXNDbG9zZWQgPSB0cnVlO1xuICBwcml2YXRlIHN0cmVhbTogTWVkaWFTdHJlYW07XG4gIHByaXZhdGUgcmVzaXplID0gZmFsc2U7XG4gIHByaXZhdGUgY3JvcFNpemU6IFtudW1iZXIsIG51bWJlcl07XG4gIHByaXZhdGUgY3JvcEJveDogVGVuc29yMkQ7XG4gIHByaXZhdGUgY3JvcEJveEluZDogVGVuc29yMUQ7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICAgIHByb3RlY3RlZCByZWFkb25seSB3ZWJjYW1WaWRlb0VsZW1lbnQ6IEhUTUxWaWRlb0VsZW1lbnQsXG4gICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgd2ViY2FtQ29uZmlnOiBXZWJjYW1Db25maWcpIHtcbiAgICBzdXBlcigpO1xuICAgIGlmICh0aGlzLm5lZWRUb1Jlc2l6ZSgpKSB7XG4gICAgICB0aGlzLnJlc2l6ZSA9IHRydWU7XG4gICAgICB0aGlzLmNyb3BTaXplID1cbiAgICAgICAgICBbdGhpcy53ZWJjYW1Db25maWcucmVzaXplSGVpZ2h0LCB0aGlzLndlYmNhbUNvbmZpZy5yZXNpemVXaWR0aF07XG4gICAgICB0aGlzLmNyb3BCb3hJbmQgPSB0ZW5zb3IxZChbMF0sICdpbnQzMicpO1xuICAgICAgaWYgKHRoaXMud2ViY2FtQ29uZmlnLmNlbnRlckNyb3ApIHtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBib3ggYmFzZWQgb24gcmVzaXppbmcgc2hhcGUuXG4gICAgICAgIGNvbnN0IHdpZHRoQ3JvcHBpbmdSYXRpbyA9XG4gICAgICAgICAgICB0aGlzLndlYmNhbUNvbmZpZy5yZXNpemVXaWR0aCAqIDEuMCAvIHRoaXMud2ViY2FtVmlkZW9FbGVtZW50LndpZHRoO1xuICAgICAgICBjb25zdCBoZWlnaHRDcm9wcGluZ1JhdGlvID0gdGhpcy53ZWJjYW1Db25maWcucmVzaXplSGVpZ2h0ICogMS4wIC9cbiAgICAgICAgICAgIHRoaXMud2ViY2FtVmlkZW9FbGVtZW50LmhlaWdodDtcbiAgICAgICAgY29uc3Qgd2lkdGhDcm9wU3RhcnQgPSAoMSAtIHdpZHRoQ3JvcHBpbmdSYXRpbykgLyAyO1xuICAgICAgICBjb25zdCBoZWlnaHRDcm9wU3RhcnQgPSAoMSAtIGhlaWdodENyb3BwaW5nUmF0aW8pIC8gMjtcbiAgICAgICAgY29uc3Qgd2lkdGhDcm9wRW5kID0gd2lkdGhDcm9wU3RhcnQgKyB3aWR0aENyb3BwaW5nUmF0aW87XG4gICAgICAgIGNvbnN0IGhlaWdodENyb3BFbmQgPSBoZWlnaHRDcm9wcGluZ1JhdGlvICsgaGVpZ2h0Q3JvcFN0YXJ0O1xuICAgICAgICB0aGlzLmNyb3BCb3ggPSB0ZW5zb3IyZChcbiAgICAgICAgICAgIFtoZWlnaHRDcm9wU3RhcnQsIHdpZHRoQ3JvcFN0YXJ0LCBoZWlnaHRDcm9wRW5kLCB3aWR0aENyb3BFbmRdLFxuICAgICAgICAgICAgWzEsIDRdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY3JvcEJveCA9IHRlbnNvcjJkKFswLCAwLCAxLCAxXSwgWzEsIDRdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdW1tYXJ5KCkge1xuICAgIHJldHVybiBgd2ViY2FtYDtcbiAgfVxuXG4gIC8vIENvbnN0cnVjdCBhIFdlYmNhbUl0ZXJhdG9yIGFuZCBzdGFydCBpdCdzIHZpZGVvIHN0cmVhbS5cbiAgc3RhdGljIGFzeW5jIGNyZWF0ZShcbiAgICAgIHdlYmNhbVZpZGVvRWxlbWVudD86IEhUTUxWaWRlb0VsZW1lbnQsIHdlYmNhbUNvbmZpZzogV2ViY2FtQ29uZmlnID0ge30pIHtcbiAgICBpZiAoIWVudigpLmdldCgnSVNfQlJPV1NFUicpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ3RmLmRhdGEud2ViY2FtIGlzIG9ubHkgc3VwcG9ydGVkIGluIGJyb3dzZXIgZW52aXJvbm1lbnQuJyk7XG4gICAgfVxuXG4gICAgaWYgKCF3ZWJjYW1WaWRlb0VsZW1lbnQpIHtcbiAgICAgIC8vIElmIHdlYmNhbSB2aWRlbyBlbGVtZW50IGlzIG5vdCBwcm92aWRlZCwgY3JlYXRlIGEgaGlkZGVuIHZpZGVvIGVsZW1lbnRcbiAgICAgIC8vIHdpdGggcHJvdmlkZWQgd2lkdGggYW5kIGhlaWdodC5cbiAgICAgIHdlYmNhbVZpZGVvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgICBpZiAoIXdlYmNhbUNvbmZpZy5yZXNpemVXaWR0aCB8fCAhd2ViY2FtQ29uZmlnLnJlc2l6ZUhlaWdodCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnUGxlYXNlIHByb3ZpZGUgd2ViY2FtIHZpZGVvIGVsZW1lbnQsIG9yIHJlc2l6ZVdpZHRoIGFuZCAnICtcbiAgICAgICAgICAgICdyZXNpemVIZWlnaHQgdG8gY3JlYXRlIGEgaGlkZGVuIHZpZGVvIGVsZW1lbnQuJyk7XG4gICAgICB9XG4gICAgICB3ZWJjYW1WaWRlb0VsZW1lbnQud2lkdGggPSB3ZWJjYW1Db25maWcucmVzaXplV2lkdGg7XG4gICAgICB3ZWJjYW1WaWRlb0VsZW1lbnQuaGVpZ2h0ID0gd2ViY2FtQ29uZmlnLnJlc2l6ZUhlaWdodDtcbiAgICB9XG4gICAgY29uc3Qgd2ViY2FtSXRlcmF0b3IgPSBuZXcgV2ViY2FtSXRlcmF0b3Iod2ViY2FtVmlkZW9FbGVtZW50LCB3ZWJjYW1Db25maWcpO1xuXG4gICAgLy8gQ2FsbCBhc3luYyBmdW5jdGlvbiB0byBpbml0aWFsaXplIHRoZSB2aWRlbyBzdHJlYW0uXG4gICAgYXdhaXQgd2ViY2FtSXRlcmF0b3Iuc3RhcnQoKTtcblxuICAgIHJldHVybiB3ZWJjYW1JdGVyYXRvcjtcbiAgfVxuXG4gIC8vIEFzeW5jIGZ1bmN0aW9uIHRvIHN0YXJ0IHZpZGVvIHN0cmVhbS5cbiAgYXN5bmMgc3RhcnQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMud2ViY2FtQ29uZmlnLmZhY2luZ01vZGUpIHtcbiAgICAgIHV0aWwuYXNzZXJ0KFxuICAgICAgICAgICh0aGlzLndlYmNhbUNvbmZpZy5mYWNpbmdNb2RlID09PSAndXNlcicpIHx8XG4gICAgICAgICAgICAgICh0aGlzLndlYmNhbUNvbmZpZy5mYWNpbmdNb2RlID09PSAnZW52aXJvbm1lbnQnKSxcbiAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgICBgSW52YWxpZCB3ZWJjYW0gZmFjaW5nIG1vZGU6ICR7dGhpcy53ZWJjYW1Db25maWcuZmFjaW5nTW9kZX0uIGAgK1xuICAgICAgICAgICAgICBgUGxlYXNlIHByb3ZpZGUgJ3VzZXInIG9yICdlbnZpcm9ubWVudCdgKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5zdHJlYW0gPSBhd2FpdCBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSh7XG4gICAgICAgIHZpZGVvOiB7XG4gICAgICAgICAgZGV2aWNlSWQ6IHRoaXMud2ViY2FtQ29uZmlnLmRldmljZUlkLFxuICAgICAgICAgIGZhY2luZ01vZGU6IHRoaXMud2ViY2FtQ29uZmlnLmZhY2luZ01vZGUgP1xuICAgICAgICAgICAgICB0aGlzLndlYmNhbUNvbmZpZy5mYWNpbmdNb2RlIDpcbiAgICAgICAgICAgICAgJ3VzZXInLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLndlYmNhbVZpZGVvRWxlbWVudC53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMud2ViY2FtVmlkZW9FbGVtZW50LmhlaWdodFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBNb2RpZnkgdGhlIGVycm9yIG1lc3NhZ2UgYnV0IGxlYXZlIHRoZSBzdGFjayB0cmFjZSBpbnRhY3RcbiAgICAgIGUubWVzc2FnZSA9IGBFcnJvciB0aHJvd24gd2hpbGUgaW5pdGlhbGl6aW5nIHZpZGVvIHN0cmVhbTogJHtlLm1lc3NhZ2V9YDtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0cmVhbSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3Qgb2J0YWluIHZpZGVvIGZyb20gd2ViY2FtLicpO1xuICAgIH1cblxuICAgIC8vIE9sZGVyIGJyb3dzZXJzIG1heSBub3QgaGF2ZSBzcmNPYmplY3RcbiAgICB0cnkge1xuICAgICAgdGhpcy53ZWJjYW1WaWRlb0VsZW1lbnQuc3JjT2JqZWN0ID0gdGhpcy5zdHJlYW07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIHRoaXMud2ViY2FtVmlkZW9FbGVtZW50LnNyYyA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKHRoaXMuc3RyZWFtKTtcbiAgICB9XG4gICAgLy8gU3RhcnQgdGhlIHdlYmNhbSB2aWRlbyBzdHJlYW1cbiAgICB0aGlzLndlYmNhbVZpZGVvRWxlbWVudC5wbGF5KCk7XG5cbiAgICB0aGlzLmlzQ2xvc2VkID0gZmFsc2U7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4ocmVzb2x2ZSA9PiB7XG4gICAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXIgdG8gbWFrZSBzdXJlIHRoZSB3ZWJjYW0gaGFzIGJlZW4gZnVsbHkgaW5pdGlhbGl6ZWQuXG4gICAgICB0aGlzLndlYmNhbVZpZGVvRWxlbWVudC5vbmxvYWRlZG1ldGFkYXRhID0gKCkgPT4ge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgbmV4dCgpOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PFRlbnNvcjNEPj4ge1xuICAgIGlmICh0aGlzLmlzQ2xvc2VkKSB7XG4gICAgICByZXR1cm4ge3ZhbHVlOiBudWxsLCBkb25lOiB0cnVlfTtcbiAgICB9XG5cbiAgICBsZXQgaW1nO1xuICAgIHRyeSB7XG4gICAgICBpbWcgPSBicm93c2VyLmZyb21QaXhlbHModGhpcy53ZWJjYW1WaWRlb0VsZW1lbnQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgRXJyb3IgdGhyb3duIGNvbnZlcnRpbmcgdmlkZW8gdG8gcGl4ZWxzOiAke0pTT04uc3RyaW5naWZ5KGUpfWApO1xuICAgIH1cbiAgICBpZiAodGhpcy5yZXNpemUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB7dmFsdWU6IHRoaXMuY3JvcEFuZFJlc2l6ZUZyYW1lKGltZyksIGRvbmU6IGZhbHNlfTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciB0aHJvd24gY3JvcHBpbmcgdGhlIHZpZGVvOiAke2UubWVzc2FnZX1gKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGltZy5kaXNwb3NlKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7dmFsdWU6IGltZywgZG9uZTogZmFsc2V9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbmVlZFRvUmVzaXplKCkge1xuICAgIC8vIElmIHJlc2l6ZVdpZHRoIGFuZCByZXNpemVIZWlnaHQgYXJlIHByb3ZpZGVkLCBhbmQgZGlmZmVyZW50IGZyb20gdGhlXG4gICAgLy8gd2lkdGggYW5kIGhlaWdodCBvZiBvcmlnaW5hbCBIVE1MVmlkZW9FbGVtZW50LCB0aGVuIHJlc2l6aW5nIGFuZCBjcm9wcGluZ1xuICAgIC8vIGlzIHJlcXVpcmVkLlxuICAgIGlmICh0aGlzLndlYmNhbUNvbmZpZy5yZXNpemVXaWR0aCAmJiB0aGlzLndlYmNhbUNvbmZpZy5yZXNpemVIZWlnaHQgJiZcbiAgICAgICAgKHRoaXMud2ViY2FtVmlkZW9FbGVtZW50LndpZHRoICE9PSB0aGlzLndlYmNhbUNvbmZpZy5yZXNpemVXaWR0aCB8fFxuICAgICAgICAgdGhpcy53ZWJjYW1WaWRlb0VsZW1lbnQuaGVpZ2h0ICE9PSB0aGlzLndlYmNhbUNvbmZpZy5yZXNpemVIZWlnaHQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gQ3JvcHBpbmcgYW5kIHJlc2l6aW5nIGVhY2ggZnJhbWUgYmFzZWQgb24gY29uZmlnXG4gIGNyb3BBbmRSZXNpemVGcmFtZShpbWc6IFRlbnNvcjNEKTogVGVuc29yM0Qge1xuICAgIHJldHVybiB0aWR5KCgpID0+IHtcbiAgICAgIGNvbnN0IGV4cGFuZGVkSW1hZ2U6IFRlbnNvcjREID0gZXhwYW5kRGltcyhjYXN0KGltZywgJ2Zsb2F0MzInKSwgKDApKTtcbiAgICAgIGxldCByZXNpemVkSW1hZ2U7XG4gICAgICByZXNpemVkSW1hZ2UgPSBpbWFnZS5jcm9wQW5kUmVzaXplKFxuICAgICAgICAgIGV4cGFuZGVkSW1hZ2UsIHRoaXMuY3JvcEJveCwgdGhpcy5jcm9wQm94SW5kLCB0aGlzLmNyb3BTaXplLFxuICAgICAgICAgICdiaWxpbmVhcicpO1xuICAgICAgLy8gRXh0cmFjdCBpbWFnZSBmcm9tIGJhdGNoIGNyb3BwaW5nLlxuICAgICAgY29uc3Qgc2hhcGUgPSByZXNpemVkSW1hZ2Uuc2hhcGU7XG4gICAgICByZXR1cm4gcmVzaGFwZShyZXNpemVkSW1hZ2UsIHNoYXBlLnNsaWNlKDEpIGFzIFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBDYXB0dXJlIG9uZSBmcmFtZSBmcm9tIHRoZSB2aWRlbyBzdHJlYW0sIGFuZCBleHRyYWN0IHRoZSB2YWx1ZSBmcm9tXG4gIC8vIGl0ZXJhdG9yLm5leHQoKSByZXN1bHQuXG4gIGFzeW5jIGNhcHR1cmUoKTogUHJvbWlzZTxUZW5zb3IzRD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5uZXh0KCkpLnZhbHVlO1xuICB9XG5cbiAgLy8gU3RvcCB0aGUgdmlkZW8gc3RyZWFtIGFuZCBwYXVzZSB3ZWJjYW0gaXRlcmF0b3IuXG4gIHN0b3AoKTogdm9pZCB7XG4gICAgY29uc3QgdHJhY2tzID0gdGhpcy5zdHJlYW0uZ2V0VHJhY2tzKCk7XG5cbiAgICB0cmFja3MuZm9yRWFjaCh0cmFjayA9PiB0cmFjay5zdG9wKCkpO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMud2ViY2FtVmlkZW9FbGVtZW50LnNyY09iamVjdCA9IG51bGw7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIHRoaXMud2ViY2FtVmlkZW9FbGVtZW50LnNyYyA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMuaXNDbG9zZWQgPSB0cnVlO1xuICB9XG5cbiAgLy8gT3ZlcnJpZGUgdG9BcnJheSgpIGZ1bmN0aW9uIHRvIHByZXZlbnQgY29sbGVjdGluZy5cbiAgdG9BcnJheSgpOiBQcm9taXNlPFRlbnNvcjNEW10+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgY29udmVydCBpbmZpbml0ZSB2aWRlbyBzdHJlYW0gdG8gYXJyYXkuJyk7XG4gIH1cbn1cbiJdfQ==