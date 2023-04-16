/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
 * =============================================================================
 */
import { util } from '@tensorflow/tfjs-core';
/**
 * The StringNGramsOp class creates ngrams from ragged string data.
 * The constructor contains all attributes related to the operation such as
 * padding widths and strings, and the compute function can be used to
 * compute the ngrams for different ragged tensor inputs.
 */
class StringNGramsOp {
    constructor(separator, nGramWidths, leftPad, rightPad, padWidth, preserveShortSequences) {
        this.separator = util.encodeString(separator);
        this.nGramWidths = nGramWidths;
        this.leftPad = util.encodeString(leftPad);
        this.rightPad = util.encodeString(rightPad);
        this.padWidth = padWidth;
        this.preserveShort = preserveShortSequences;
    }
    getPadWidth(nGramWidth) {
        // Ngrams can be padded with either a fixed pad width or a dynamic pad
        // width depending on the 'padWidth' arg, but in no case should the padding
        // ever be wider than 'nGramWidth' - 1.
        return Math.min(this.padWidth < 0 ? nGramWidth - 1 : this.padWidth, nGramWidth - 1);
    }
    getNumNGrams(length, nGramWidth) {
        const padWidth = this.getPadWidth(nGramWidth);
        return Math.max(0, ((length + 2 * padWidth) - nGramWidth) + 1);
    }
    createNGrams(data, splitIndex, output, outputStartIndex, numNGrams, nGramWidth) {
        for (let nGramIndex = 0; nGramIndex < numNGrams; ++nGramIndex) {
            const padWidth = this.getPadWidth(nGramWidth);
            const leftPadding = Math.max(0, padWidth - nGramIndex);
            const rightPadding = Math.max(0, padWidth - (numNGrams - (nGramIndex + 1)));
            const numTokens = nGramWidth - (leftPadding + rightPadding);
            const dataStartIndex = splitIndex + (leftPadding > 0 ? 0 : nGramIndex - padWidth);
            // Calculate the total expected size of the nGram so we can reserve the
            // correct amount of space in the string.
            let nGramSize = 0;
            // Size of the left padding.
            nGramSize += leftPadding * this.leftPad.length;
            // Size of the tokens.
            for (let n = 0; n < numTokens; ++n) {
                nGramSize += data[dataStartIndex + n].length;
            }
            // Size of the right padding.
            nGramSize += rightPadding * this.rightPad.length;
            // Size of the separators.
            const numSeparators = leftPadding + rightPadding + numTokens - 1;
            nGramSize += numSeparators * this.separator.length;
            // Build the nGram.
            output[outputStartIndex + nGramIndex] = new Uint8Array(nGramSize);
            const nGram = output[outputStartIndex + nGramIndex];
            let nextNGramIndex = 0;
            const appendToNGram = (str) => str.forEach((value) => nGram[nextNGramIndex++] = value);
            for (let n = 0; n < leftPadding; ++n) {
                appendToNGram(this.leftPad);
                appendToNGram(this.separator);
            }
            // Only output first numTokens - 1 pairs of data and separator
            for (let n = 0; n < numTokens - 1; ++n) {
                appendToNGram(data[dataStartIndex + n]);
                appendToNGram(this.separator);
            }
            // Handle case when there are no tokens or no right padding as these
            // can result in consecutive separators.
            if (numTokens > 0) {
                // If we have tokens, then output last and then pair each separator
                // with the right padding that follows, to ensure nGram ends either with
                // the token or with the right pad.
                appendToNGram(data[dataStartIndex + numTokens - 1]);
                for (let n = 0; n < rightPadding; ++n) {
                    appendToNGram(this.separator);
                    appendToNGram(this.rightPad);
                }
            }
            else {
                // If we don't have tokens, then the last item inserted into the nGram
                // has been the separator from the left padding loop above. Hence,
                // output right pad and separator and make sure to finish with a
                // padding, not a separator.
                for (let n = 0; n < rightPadding - 1; ++n) {
                    appendToNGram(this.rightPad);
                    appendToNGram(this.separator);
                }
                appendToNGram(this.rightPad);
            }
        }
    }
    // Data and splits together form the definition of the ragged tensor,
    // where data is 1 dimensional and contains the values of the tensor
    // and splits denotes the indices at which each row starts.
    compute(data, splits) {
        // Validate that the splits are valid indices into data, only if there are
        // splits specified.
        const inputDataSize = data.length;
        const splitsSize = splits.length;
        if (splitsSize > 0) {
            let prevSplit = splits[0];
            if (prevSplit !== 0) {
                throw new Error(`First split value must be 0, got ${prevSplit}`);
            }
            for (let i = 1; i < splitsSize; ++i) {
                let validSplits = splits[i] >= prevSplit;
                validSplits = validSplits && (splits[i] <= inputDataSize);
                if (!validSplits) {
                    throw new Error(`Invalid split value ${splits[i]}, must be in [${prevSplit}, ${inputDataSize}]`);
                }
                prevSplit = splits[i];
            }
            if (prevSplit !== inputDataSize) {
                throw new Error(`Last split value must be data size. Expected ${inputDataSize}, got ${prevSplit}`);
            }
        }
        const numBatchItems = splitsSize - 1;
        const nGramsSplits = util.getArrayFromDType('int32', splitsSize);
        // If there is no data or size, return an empty ragged tensor.
        if (inputDataSize === 0 || splitsSize === 0) {
            const empty = new Array(inputDataSize);
            for (let i = 0; i <= numBatchItems; ++i) {
                nGramsSplits[i] = 0;
            }
            return [empty, nGramsSplits];
        }
        nGramsSplits[0] = 0;
        for (let i = 1; i <= numBatchItems; ++i) {
            const length = splits[i] - splits[i - 1];
            let numNGrams = 0;
            this.nGramWidths.forEach((nGramWidth) => {
                numNGrams += this.getNumNGrams(length, nGramWidth);
            });
            if (this.preserveShort && length > 0 && numNGrams === 0) {
                numNGrams = 1;
            }
            nGramsSplits[i] = nGramsSplits[i - 1] + numNGrams;
        }
        const nGrams = new Array(nGramsSplits[numBatchItems]);
        for (let i = 0; i < numBatchItems; ++i) {
            const splitIndex = splits[i];
            let outputStartIdx = nGramsSplits[i];
            this.nGramWidths.forEach((nGramWidth) => {
                const length = splits[i + 1] - splits[i];
                const numNGrams = this.getNumNGrams(length, nGramWidth);
                this.createNGrams(data, splitIndex, nGrams, outputStartIdx, numNGrams, nGramWidth);
                outputStartIdx += numNGrams;
            });
            // If we're preserving short sequences, check to see if no sequence was
            // generated by comparing the current output start idx to the original
            // one (nGramSplitsdata). If no ngrams were generated, then they will
            // be equal (since we increment outputStartIdx by numNGrams every
            // time we create a set of ngrams.)
            if (this.preserveShort && outputStartIdx === nGramsSplits[i]) {
                const dataLength = splits[i + 1] - splits[i];
                // One legitimate reason to not have any ngrams when this.preserveShort
                // is true is if the sequence itself is empty. In that case, move on.
                if (dataLength === 0) {
                    continue;
                }
                // We don't have to worry about dynamic padding sizes here: if padding
                // was dynamic, every sequence would have had sufficient padding to
                // generate at least one nGram.
                const nGramWidth = dataLength + 2 * this.padWidth;
                const numNGrams = 1;
                this.createNGrams(data, splitIndex, nGrams, outputStartIdx, numNGrams, nGramWidth);
            }
        }
        return [nGrams, nGramsSplits];
    }
}
export function stringNGramsImpl(data, dataSplits, separator, nGramWidths, leftPad, rightPad, padWidth, preserveShortSequences) {
    return new StringNGramsOp(separator, nGramWidths, leftPad, rightPad, padWidth, preserveShortSequences)
        .compute(data, dataSplits);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RyaW5nTkdyYW1zX2ltcGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWJhY2tlbmQtY3B1L3NyYy9rZXJuZWxzL1N0cmluZ05HcmFtc19pbXBsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUzQzs7Ozs7R0FLRztBQUNILE1BQU0sY0FBYztJQVFsQixZQUNJLFNBQWlCLEVBQUUsV0FBcUIsRUFBRSxPQUFlLEVBQ3pELFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxzQkFBK0I7UUFDckUsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLGFBQWEsR0FBRyxzQkFBc0IsQ0FBQztJQUM5QyxDQUFDO0lBRU8sV0FBVyxDQUFDLFVBQWtCO1FBQ3BDLHNFQUFzRTtRQUN0RSwyRUFBMkU7UUFDM0UsdUNBQXVDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FDWCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVPLFlBQVksQ0FBQyxNQUFjLEVBQUUsVUFBa0I7UUFDckQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFTyxZQUFZLENBQ2hCLElBQWtCLEVBQUUsVUFBa0IsRUFBRSxNQUFvQixFQUM1RCxnQkFBd0IsRUFBRSxTQUFpQixFQUFFLFVBQWtCO1FBQ2pFLEtBQUssSUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFLFVBQVUsR0FBRyxTQUFTLEVBQUUsRUFBRSxVQUFVLEVBQUU7WUFDN0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5QyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFDdkQsTUFBTSxZQUFZLEdBQ2QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsUUFBUSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRCxNQUFNLFNBQVMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFDNUQsTUFBTSxjQUFjLEdBQ2hCLFVBQVUsR0FBRyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxDQUFDO1lBRS9ELHVFQUF1RTtZQUN2RSx5Q0FBeUM7WUFDekMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLDRCQUE0QjtZQUM1QixTQUFTLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQy9DLHNCQUFzQjtZQUN0QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUNsQyxTQUFTLElBQUksSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7YUFDOUM7WUFDRCw2QkFBNkI7WUFDN0IsU0FBUyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUNqRCwwQkFBMEI7WUFDMUIsTUFBTSxhQUFhLEdBQUcsV0FBVyxHQUFHLFlBQVksR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQ2pFLFNBQVMsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7WUFFbkQsbUJBQW1CO1lBQ25CLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNsRSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFFcEQsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sYUFBYSxHQUFHLENBQUMsR0FBZSxFQUFFLEVBQUUsQ0FDdEMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFFNUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDcEMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDNUIsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUMvQjtZQUNELDhEQUE4RDtZQUM5RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDdEMsYUFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUMvQjtZQUNELG9FQUFvRTtZQUNwRSx3Q0FBd0M7WUFDeEMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxFQUFFO2dCQUNqQixtRUFBbUU7Z0JBQ25FLHdFQUF3RTtnQkFDeEUsbUNBQW1DO2dCQUNuQyxhQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksRUFBRSxFQUFFLENBQUMsRUFBRTtvQkFDckMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDOUIsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDOUI7YUFDRjtpQkFBTTtnQkFDTCxzRUFBc0U7Z0JBQ3RFLGtFQUFrRTtnQkFDbEUsZ0VBQWdFO2dCQUNoRSw0QkFBNEI7Z0JBQzVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO29CQUN6QyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUM3QixhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUMvQjtnQkFDRCxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzlCO1NBQ0Y7SUFDSCxDQUFDO0lBRUQscUVBQXFFO0lBQ3JFLG9FQUFvRTtJQUNwRSwyREFBMkQ7SUFDcEQsT0FBTyxDQUFDLElBQWtCLEVBQUUsTUFBa0I7UUFFbkQsMEVBQTBFO1FBQzFFLG9CQUFvQjtRQUNwQixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ2xDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDakMsSUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFO1lBQ2xCLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLFNBQVMsS0FBSyxDQUFDLEVBQUU7Z0JBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLFNBQVMsRUFBRSxDQUFDLENBQUM7YUFDbEU7WUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUNuQyxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDO2dCQUN6QyxXQUFXLEdBQUcsV0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDO2dCQUMxRCxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixNQUFNLENBQUMsQ0FBQyxDQUFDLGlCQUM1QyxTQUFTLEtBQUssYUFBYSxHQUFHLENBQUMsQ0FBQztpQkFDckM7Z0JBQ0QsU0FBUyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN2QjtZQUNELElBQUksU0FBUyxLQUFLLGFBQWEsRUFBRTtnQkFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFDWixhQUFhLFNBQVMsU0FBUyxFQUFFLENBQUMsQ0FBQzthQUN4QztTQUNGO1FBRUQsTUFBTSxhQUFhLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2pFLDhEQUE4RDtRQUM5RCxJQUFJLGFBQWEsS0FBSyxDQUFDLElBQUksVUFBVSxLQUFLLENBQUMsRUFBRTtZQUMzQyxNQUFNLEtBQUssR0FBaUIsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDckQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLGFBQWEsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDdkMsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNyQjtZQUNELE9BQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDOUI7UUFFRCxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxhQUFhLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDdkMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0JBQ3RDLFNBQVMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNyRCxDQUFDLENBQUMsQ0FBQztZQUNILElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLFNBQVMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3ZELFNBQVMsR0FBRyxDQUFDLENBQUM7YUFDZjtZQUNELFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztTQUNuRDtRQUVELE1BQU0sTUFBTSxHQUFpQixJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUVwRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3RDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLGNBQWMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFDdEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUN4RCxJQUFJLENBQUMsWUFBWSxDQUNiLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ3JFLGNBQWMsSUFBSSxTQUFTLENBQUM7WUFDOUIsQ0FBQyxDQUFDLENBQUM7WUFDSCx1RUFBdUU7WUFDdkUsc0VBQXNFO1lBQ3RFLHFFQUFxRTtZQUNyRSxpRUFBaUU7WUFDakUsbUNBQW1DO1lBQ25DLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxjQUFjLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUM1RCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0MsdUVBQXVFO2dCQUN2RSxxRUFBcUU7Z0JBQ3JFLElBQUksVUFBVSxLQUFLLENBQUMsRUFBRTtvQkFDcEIsU0FBUztpQkFDVjtnQkFDRCxzRUFBc0U7Z0JBQ3RFLG1FQUFtRTtnQkFDbkUsK0JBQStCO2dCQUMvQixNQUFNLFVBQVUsR0FBRyxVQUFVLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ2xELE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLFlBQVksQ0FDYixJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2FBQ3RFO1NBQ0Y7UUFDRCxPQUFPLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDRjtBQUVELE1BQU0sVUFBVSxnQkFBZ0IsQ0FDNUIsSUFBa0IsRUFBRSxVQUFzQixFQUFFLFNBQWlCLEVBQzdELFdBQXFCLEVBQUUsT0FBZSxFQUFFLFFBQWdCLEVBQUUsUUFBZ0IsRUFDMUUsc0JBQStCO0lBQ2pDLE9BQU8sSUFBSSxjQUFjLENBQ2QsU0FBUyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFDbkQsc0JBQXNCLENBQUM7U0FDN0IsT0FBTyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNqQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge3V0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5cbi8qKlxuICogVGhlIFN0cmluZ05HcmFtc09wIGNsYXNzIGNyZWF0ZXMgbmdyYW1zIGZyb20gcmFnZ2VkIHN0cmluZyBkYXRhLlxuICogVGhlIGNvbnN0cnVjdG9yIGNvbnRhaW5zIGFsbCBhdHRyaWJ1dGVzIHJlbGF0ZWQgdG8gdGhlIG9wZXJhdGlvbiBzdWNoIGFzXG4gKiBwYWRkaW5nIHdpZHRocyBhbmQgc3RyaW5ncywgYW5kIHRoZSBjb21wdXRlIGZ1bmN0aW9uIGNhbiBiZSB1c2VkIHRvXG4gKiBjb21wdXRlIHRoZSBuZ3JhbXMgZm9yIGRpZmZlcmVudCByYWdnZWQgdGVuc29yIGlucHV0cy5cbiAqL1xuY2xhc3MgU3RyaW5nTkdyYW1zT3Age1xuICBwcml2YXRlIHNlcGFyYXRvcjogVWludDhBcnJheTtcbiAgcHJpdmF0ZSBuR3JhbVdpZHRoczogbnVtYmVyW107XG4gIHByaXZhdGUgcGFkV2lkdGg6IG51bWJlcjtcbiAgcHJpdmF0ZSBsZWZ0UGFkOiBVaW50OEFycmF5O1xuICBwcml2YXRlIHJpZ2h0UGFkOiBVaW50OEFycmF5O1xuICBwcml2YXRlIHByZXNlcnZlU2hvcnQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBzZXBhcmF0b3I6IHN0cmluZywgbkdyYW1XaWR0aHM6IG51bWJlcltdLCBsZWZ0UGFkOiBzdHJpbmcsXG4gICAgICByaWdodFBhZDogc3RyaW5nLCBwYWRXaWR0aDogbnVtYmVyLCBwcmVzZXJ2ZVNob3J0U2VxdWVuY2VzOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXBhcmF0b3IgPSB1dGlsLmVuY29kZVN0cmluZyhzZXBhcmF0b3IpO1xuICAgIHRoaXMubkdyYW1XaWR0aHMgPSBuR3JhbVdpZHRocztcbiAgICB0aGlzLmxlZnRQYWQgPSB1dGlsLmVuY29kZVN0cmluZyhsZWZ0UGFkKTtcbiAgICB0aGlzLnJpZ2h0UGFkID0gdXRpbC5lbmNvZGVTdHJpbmcocmlnaHRQYWQpO1xuICAgIHRoaXMucGFkV2lkdGggPSBwYWRXaWR0aDtcbiAgICB0aGlzLnByZXNlcnZlU2hvcnQgPSBwcmVzZXJ2ZVNob3J0U2VxdWVuY2VzO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQYWRXaWR0aChuR3JhbVdpZHRoOiBudW1iZXIpIHtcbiAgICAvLyBOZ3JhbXMgY2FuIGJlIHBhZGRlZCB3aXRoIGVpdGhlciBhIGZpeGVkIHBhZCB3aWR0aCBvciBhIGR5bmFtaWMgcGFkXG4gICAgLy8gd2lkdGggZGVwZW5kaW5nIG9uIHRoZSAncGFkV2lkdGgnIGFyZywgYnV0IGluIG5vIGNhc2Ugc2hvdWxkIHRoZSBwYWRkaW5nXG4gICAgLy8gZXZlciBiZSB3aWRlciB0aGFuICduR3JhbVdpZHRoJyAtIDEuXG4gICAgcmV0dXJuIE1hdGgubWluKFxuICAgICAgICB0aGlzLnBhZFdpZHRoIDwgMCA/IG5HcmFtV2lkdGggLSAxIDogdGhpcy5wYWRXaWR0aCwgbkdyYW1XaWR0aCAtIDEpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXROdW1OR3JhbXMobGVuZ3RoOiBudW1iZXIsIG5HcmFtV2lkdGg6IG51bWJlcikge1xuICAgIGNvbnN0IHBhZFdpZHRoID0gdGhpcy5nZXRQYWRXaWR0aChuR3JhbVdpZHRoKTtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgKChsZW5ndGggKyAyICogcGFkV2lkdGgpIC0gbkdyYW1XaWR0aCkgKyAxKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlTkdyYW1zKFxuICAgICAgZGF0YTogVWludDhBcnJheVtdLCBzcGxpdEluZGV4OiBudW1iZXIsIG91dHB1dDogVWludDhBcnJheVtdLFxuICAgICAgb3V0cHV0U3RhcnRJbmRleDogbnVtYmVyLCBudW1OR3JhbXM6IG51bWJlciwgbkdyYW1XaWR0aDogbnVtYmVyKSB7XG4gICAgZm9yIChsZXQgbkdyYW1JbmRleCA9IDA7IG5HcmFtSW5kZXggPCBudW1OR3JhbXM7ICsrbkdyYW1JbmRleCkge1xuICAgICAgY29uc3QgcGFkV2lkdGggPSB0aGlzLmdldFBhZFdpZHRoKG5HcmFtV2lkdGgpO1xuICAgICAgY29uc3QgbGVmdFBhZGRpbmcgPSBNYXRoLm1heCgwLCBwYWRXaWR0aCAtIG5HcmFtSW5kZXgpO1xuICAgICAgY29uc3QgcmlnaHRQYWRkaW5nID1cbiAgICAgICAgICBNYXRoLm1heCgwLCBwYWRXaWR0aCAtIChudW1OR3JhbXMgLSAobkdyYW1JbmRleCArIDEpKSk7XG4gICAgICBjb25zdCBudW1Ub2tlbnMgPSBuR3JhbVdpZHRoIC0gKGxlZnRQYWRkaW5nICsgcmlnaHRQYWRkaW5nKTtcbiAgICAgIGNvbnN0IGRhdGFTdGFydEluZGV4ID1cbiAgICAgICAgICBzcGxpdEluZGV4ICsgKGxlZnRQYWRkaW5nID4gMCA/IDAgOiBuR3JhbUluZGV4IC0gcGFkV2lkdGgpO1xuXG4gICAgICAvLyBDYWxjdWxhdGUgdGhlIHRvdGFsIGV4cGVjdGVkIHNpemUgb2YgdGhlIG5HcmFtIHNvIHdlIGNhbiByZXNlcnZlIHRoZVxuICAgICAgLy8gY29ycmVjdCBhbW91bnQgb2Ygc3BhY2UgaW4gdGhlIHN0cmluZy5cbiAgICAgIGxldCBuR3JhbVNpemUgPSAwO1xuICAgICAgLy8gU2l6ZSBvZiB0aGUgbGVmdCBwYWRkaW5nLlxuICAgICAgbkdyYW1TaXplICs9IGxlZnRQYWRkaW5nICogdGhpcy5sZWZ0UGFkLmxlbmd0aDtcbiAgICAgIC8vIFNpemUgb2YgdGhlIHRva2Vucy5cbiAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgbnVtVG9rZW5zOyArK24pIHtcbiAgICAgICAgbkdyYW1TaXplICs9IGRhdGFbZGF0YVN0YXJ0SW5kZXggKyBuXS5sZW5ndGg7XG4gICAgICB9XG4gICAgICAvLyBTaXplIG9mIHRoZSByaWdodCBwYWRkaW5nLlxuICAgICAgbkdyYW1TaXplICs9IHJpZ2h0UGFkZGluZyAqIHRoaXMucmlnaHRQYWQubGVuZ3RoO1xuICAgICAgLy8gU2l6ZSBvZiB0aGUgc2VwYXJhdG9ycy5cbiAgICAgIGNvbnN0IG51bVNlcGFyYXRvcnMgPSBsZWZ0UGFkZGluZyArIHJpZ2h0UGFkZGluZyArIG51bVRva2VucyAtIDE7XG4gICAgICBuR3JhbVNpemUgKz0gbnVtU2VwYXJhdG9ycyAqIHRoaXMuc2VwYXJhdG9yLmxlbmd0aDtcblxuICAgICAgLy8gQnVpbGQgdGhlIG5HcmFtLlxuICAgICAgb3V0cHV0W291dHB1dFN0YXJ0SW5kZXggKyBuR3JhbUluZGV4XSA9IG5ldyBVaW50OEFycmF5KG5HcmFtU2l6ZSk7XG4gICAgICBjb25zdCBuR3JhbSA9IG91dHB1dFtvdXRwdXRTdGFydEluZGV4ICsgbkdyYW1JbmRleF07XG5cbiAgICAgIGxldCBuZXh0TkdyYW1JbmRleCA9IDA7XG4gICAgICBjb25zdCBhcHBlbmRUb05HcmFtID0gKHN0cjogVWludDhBcnJheSkgPT5cbiAgICAgICAgICBzdHIuZm9yRWFjaCgodmFsdWUpID0+IG5HcmFtW25leHROR3JhbUluZGV4KytdID0gdmFsdWUpO1xuXG4gICAgICBmb3IgKGxldCBuID0gMDsgbiA8IGxlZnRQYWRkaW5nOyArK24pIHtcbiAgICAgICAgYXBwZW5kVG9OR3JhbSh0aGlzLmxlZnRQYWQpO1xuICAgICAgICBhcHBlbmRUb05HcmFtKHRoaXMuc2VwYXJhdG9yKTtcbiAgICAgIH1cbiAgICAgIC8vIE9ubHkgb3V0cHV0IGZpcnN0IG51bVRva2VucyAtIDEgcGFpcnMgb2YgZGF0YSBhbmQgc2VwYXJhdG9yXG4gICAgICBmb3IgKGxldCBuID0gMDsgbiA8IG51bVRva2VucyAtIDE7ICsrbikge1xuICAgICAgICBhcHBlbmRUb05HcmFtKGRhdGFbZGF0YVN0YXJ0SW5kZXggKyBuXSk7XG4gICAgICAgIGFwcGVuZFRvTkdyYW0odGhpcy5zZXBhcmF0b3IpO1xuICAgICAgfVxuICAgICAgLy8gSGFuZGxlIGNhc2Ugd2hlbiB0aGVyZSBhcmUgbm8gdG9rZW5zIG9yIG5vIHJpZ2h0IHBhZGRpbmcgYXMgdGhlc2VcbiAgICAgIC8vIGNhbiByZXN1bHQgaW4gY29uc2VjdXRpdmUgc2VwYXJhdG9ycy5cbiAgICAgIGlmIChudW1Ub2tlbnMgPiAwKSB7XG4gICAgICAgIC8vIElmIHdlIGhhdmUgdG9rZW5zLCB0aGVuIG91dHB1dCBsYXN0IGFuZCB0aGVuIHBhaXIgZWFjaCBzZXBhcmF0b3JcbiAgICAgICAgLy8gd2l0aCB0aGUgcmlnaHQgcGFkZGluZyB0aGF0IGZvbGxvd3MsIHRvIGVuc3VyZSBuR3JhbSBlbmRzIGVpdGhlciB3aXRoXG4gICAgICAgIC8vIHRoZSB0b2tlbiBvciB3aXRoIHRoZSByaWdodCBwYWQuXG4gICAgICAgIGFwcGVuZFRvTkdyYW0oZGF0YVtkYXRhU3RhcnRJbmRleCArIG51bVRva2VucyAtIDFdKTtcbiAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCByaWdodFBhZGRpbmc7ICsrbikge1xuICAgICAgICAgIGFwcGVuZFRvTkdyYW0odGhpcy5zZXBhcmF0b3IpO1xuICAgICAgICAgIGFwcGVuZFRvTkdyYW0odGhpcy5yaWdodFBhZCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgdG9rZW5zLCB0aGVuIHRoZSBsYXN0IGl0ZW0gaW5zZXJ0ZWQgaW50byB0aGUgbkdyYW1cbiAgICAgICAgLy8gaGFzIGJlZW4gdGhlIHNlcGFyYXRvciBmcm9tIHRoZSBsZWZ0IHBhZGRpbmcgbG9vcCBhYm92ZS4gSGVuY2UsXG4gICAgICAgIC8vIG91dHB1dCByaWdodCBwYWQgYW5kIHNlcGFyYXRvciBhbmQgbWFrZSBzdXJlIHRvIGZpbmlzaCB3aXRoIGFcbiAgICAgICAgLy8gcGFkZGluZywgbm90IGEgc2VwYXJhdG9yLlxuICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHJpZ2h0UGFkZGluZyAtIDE7ICsrbikge1xuICAgICAgICAgIGFwcGVuZFRvTkdyYW0odGhpcy5yaWdodFBhZCk7XG4gICAgICAgICAgYXBwZW5kVG9OR3JhbSh0aGlzLnNlcGFyYXRvcik7XG4gICAgICAgIH1cbiAgICAgICAgYXBwZW5kVG9OR3JhbSh0aGlzLnJpZ2h0UGFkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBEYXRhIGFuZCBzcGxpdHMgdG9nZXRoZXIgZm9ybSB0aGUgZGVmaW5pdGlvbiBvZiB0aGUgcmFnZ2VkIHRlbnNvcixcbiAgLy8gd2hlcmUgZGF0YSBpcyAxIGRpbWVuc2lvbmFsIGFuZCBjb250YWlucyB0aGUgdmFsdWVzIG9mIHRoZSB0ZW5zb3JcbiAgLy8gYW5kIHNwbGl0cyBkZW5vdGVzIHRoZSBpbmRpY2VzIGF0IHdoaWNoIGVhY2ggcm93IHN0YXJ0cy5cbiAgcHVibGljIGNvbXB1dGUoZGF0YTogVWludDhBcnJheVtdLCBzcGxpdHM6IEludDMyQXJyYXkpOlxuICAgICAgW1VpbnQ4QXJyYXlbXSwgSW50MzJBcnJheV0ge1xuICAgIC8vIFZhbGlkYXRlIHRoYXQgdGhlIHNwbGl0cyBhcmUgdmFsaWQgaW5kaWNlcyBpbnRvIGRhdGEsIG9ubHkgaWYgdGhlcmUgYXJlXG4gICAgLy8gc3BsaXRzIHNwZWNpZmllZC5cbiAgICBjb25zdCBpbnB1dERhdGFTaXplID0gZGF0YS5sZW5ndGg7XG4gICAgY29uc3Qgc3BsaXRzU2l6ZSA9IHNwbGl0cy5sZW5ndGg7XG4gICAgaWYgKHNwbGl0c1NpemUgPiAwKSB7XG4gICAgICBsZXQgcHJldlNwbGl0ID0gc3BsaXRzWzBdO1xuICAgICAgaWYgKHByZXZTcGxpdCAhPT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZpcnN0IHNwbGl0IHZhbHVlIG11c3QgYmUgMCwgZ290ICR7cHJldlNwbGl0fWApO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzcGxpdHNTaXplOyArK2kpIHtcbiAgICAgICAgbGV0IHZhbGlkU3BsaXRzID0gc3BsaXRzW2ldID49IHByZXZTcGxpdDtcbiAgICAgICAgdmFsaWRTcGxpdHMgPSB2YWxpZFNwbGl0cyAmJiAoc3BsaXRzW2ldIDw9IGlucHV0RGF0YVNpemUpO1xuICAgICAgICBpZiAoIXZhbGlkU3BsaXRzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHNwbGl0IHZhbHVlICR7c3BsaXRzW2ldfSwgbXVzdCBiZSBpbiBbJHtcbiAgICAgICAgICAgICAgcHJldlNwbGl0fSwgJHtpbnB1dERhdGFTaXplfV1gKTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2U3BsaXQgPSBzcGxpdHNbaV07XG4gICAgICB9XG4gICAgICBpZiAocHJldlNwbGl0ICE9PSBpbnB1dERhdGFTaXplKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTGFzdCBzcGxpdCB2YWx1ZSBtdXN0IGJlIGRhdGEgc2l6ZS4gRXhwZWN0ZWQgJHtcbiAgICAgICAgICAgIGlucHV0RGF0YVNpemV9LCBnb3QgJHtwcmV2U3BsaXR9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbnVtQmF0Y2hJdGVtcyA9IHNwbGl0c1NpemUgLSAxO1xuICAgIGNvbnN0IG5HcmFtc1NwbGl0cyA9IHV0aWwuZ2V0QXJyYXlGcm9tRFR5cGUoJ2ludDMyJywgc3BsaXRzU2l6ZSk7XG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gZGF0YSBvciBzaXplLCByZXR1cm4gYW4gZW1wdHkgcmFnZ2VkIHRlbnNvci5cbiAgICBpZiAoaW5wdXREYXRhU2l6ZSA9PT0gMCB8fCBzcGxpdHNTaXplID09PSAwKSB7XG4gICAgICBjb25zdCBlbXB0eTogVWludDhBcnJheVtdID0gbmV3IEFycmF5KGlucHV0RGF0YVNpemUpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gbnVtQmF0Y2hJdGVtczsgKytpKSB7XG4gICAgICAgIG5HcmFtc1NwbGl0c1tpXSA9IDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gW2VtcHR5LCBuR3JhbXNTcGxpdHNdO1xuICAgIH1cblxuICAgIG5HcmFtc1NwbGl0c1swXSA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gbnVtQmF0Y2hJdGVtczsgKytpKSB7XG4gICAgICBjb25zdCBsZW5ndGggPSBzcGxpdHNbaV0gLSBzcGxpdHNbaSAtIDFdO1xuICAgICAgbGV0IG51bU5HcmFtcyA9IDA7XG4gICAgICB0aGlzLm5HcmFtV2lkdGhzLmZvckVhY2goKG5HcmFtV2lkdGgpID0+IHtcbiAgICAgICAgbnVtTkdyYW1zICs9IHRoaXMuZ2V0TnVtTkdyYW1zKGxlbmd0aCwgbkdyYW1XaWR0aCk7XG4gICAgICB9KTtcbiAgICAgIGlmICh0aGlzLnByZXNlcnZlU2hvcnQgJiYgbGVuZ3RoID4gMCAmJiBudW1OR3JhbXMgPT09IDApIHtcbiAgICAgICAgbnVtTkdyYW1zID0gMTtcbiAgICAgIH1cbiAgICAgIG5HcmFtc1NwbGl0c1tpXSA9IG5HcmFtc1NwbGl0c1tpIC0gMV0gKyBudW1OR3JhbXM7XG4gICAgfVxuXG4gICAgY29uc3QgbkdyYW1zOiBVaW50OEFycmF5W10gPSBuZXcgQXJyYXkobkdyYW1zU3BsaXRzW251bUJhdGNoSXRlbXNdKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQmF0Y2hJdGVtczsgKytpKSB7XG4gICAgICBjb25zdCBzcGxpdEluZGV4ID0gc3BsaXRzW2ldO1xuICAgICAgbGV0IG91dHB1dFN0YXJ0SWR4ID0gbkdyYW1zU3BsaXRzW2ldO1xuICAgICAgdGhpcy5uR3JhbVdpZHRocy5mb3JFYWNoKChuR3JhbVdpZHRoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHNwbGl0c1tpICsgMV0gLSBzcGxpdHNbaV07XG4gICAgICAgIGNvbnN0IG51bU5HcmFtcyA9IHRoaXMuZ2V0TnVtTkdyYW1zKGxlbmd0aCwgbkdyYW1XaWR0aCk7XG4gICAgICAgIHRoaXMuY3JlYXRlTkdyYW1zKFxuICAgICAgICAgICAgZGF0YSwgc3BsaXRJbmRleCwgbkdyYW1zLCBvdXRwdXRTdGFydElkeCwgbnVtTkdyYW1zLCBuR3JhbVdpZHRoKTtcbiAgICAgICAgb3V0cHV0U3RhcnRJZHggKz0gbnVtTkdyYW1zO1xuICAgICAgfSk7XG4gICAgICAvLyBJZiB3ZSdyZSBwcmVzZXJ2aW5nIHNob3J0IHNlcXVlbmNlcywgY2hlY2sgdG8gc2VlIGlmIG5vIHNlcXVlbmNlIHdhc1xuICAgICAgLy8gZ2VuZXJhdGVkIGJ5IGNvbXBhcmluZyB0aGUgY3VycmVudCBvdXRwdXQgc3RhcnQgaWR4IHRvIHRoZSBvcmlnaW5hbFxuICAgICAgLy8gb25lIChuR3JhbVNwbGl0c2RhdGEpLiBJZiBubyBuZ3JhbXMgd2VyZSBnZW5lcmF0ZWQsIHRoZW4gdGhleSB3aWxsXG4gICAgICAvLyBiZSBlcXVhbCAoc2luY2Ugd2UgaW5jcmVtZW50IG91dHB1dFN0YXJ0SWR4IGJ5IG51bU5HcmFtcyBldmVyeVxuICAgICAgLy8gdGltZSB3ZSBjcmVhdGUgYSBzZXQgb2YgbmdyYW1zLilcbiAgICAgIGlmICh0aGlzLnByZXNlcnZlU2hvcnQgJiYgb3V0cHV0U3RhcnRJZHggPT09IG5HcmFtc1NwbGl0c1tpXSkge1xuICAgICAgICBjb25zdCBkYXRhTGVuZ3RoID0gc3BsaXRzW2kgKyAxXSAtIHNwbGl0c1tpXTtcbiAgICAgICAgLy8gT25lIGxlZ2l0aW1hdGUgcmVhc29uIHRvIG5vdCBoYXZlIGFueSBuZ3JhbXMgd2hlbiB0aGlzLnByZXNlcnZlU2hvcnRcbiAgICAgICAgLy8gaXMgdHJ1ZSBpcyBpZiB0aGUgc2VxdWVuY2UgaXRzZWxmIGlzIGVtcHR5LiBJbiB0aGF0IGNhc2UsIG1vdmUgb24uXG4gICAgICAgIGlmIChkYXRhTGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2UgZG9uJ3QgaGF2ZSB0byB3b3JyeSBhYm91dCBkeW5hbWljIHBhZGRpbmcgc2l6ZXMgaGVyZTogaWYgcGFkZGluZ1xuICAgICAgICAvLyB3YXMgZHluYW1pYywgZXZlcnkgc2VxdWVuY2Ugd291bGQgaGF2ZSBoYWQgc3VmZmljaWVudCBwYWRkaW5nIHRvXG4gICAgICAgIC8vIGdlbmVyYXRlIGF0IGxlYXN0IG9uZSBuR3JhbS5cbiAgICAgICAgY29uc3QgbkdyYW1XaWR0aCA9IGRhdGFMZW5ndGggKyAyICogdGhpcy5wYWRXaWR0aDtcbiAgICAgICAgY29uc3QgbnVtTkdyYW1zID0gMTtcbiAgICAgICAgdGhpcy5jcmVhdGVOR3JhbXMoXG4gICAgICAgICAgICBkYXRhLCBzcGxpdEluZGV4LCBuR3JhbXMsIG91dHB1dFN0YXJ0SWR4LCBudW1OR3JhbXMsIG5HcmFtV2lkdGgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gW25HcmFtcywgbkdyYW1zU3BsaXRzXTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nTkdyYW1zSW1wbChcbiAgICBkYXRhOiBVaW50OEFycmF5W10sIGRhdGFTcGxpdHM6IEludDMyQXJyYXksIHNlcGFyYXRvcjogc3RyaW5nLFxuICAgIG5HcmFtV2lkdGhzOiBudW1iZXJbXSwgbGVmdFBhZDogc3RyaW5nLCByaWdodFBhZDogc3RyaW5nLCBwYWRXaWR0aDogbnVtYmVyLFxuICAgIHByZXNlcnZlU2hvcnRTZXF1ZW5jZXM6IGJvb2xlYW4pOiBbVWludDhBcnJheVtdLCBJbnQzMkFycmF5XSB7XG4gIHJldHVybiBuZXcgU3RyaW5nTkdyYW1zT3AoXG4gICAgICAgICAgICAgc2VwYXJhdG9yLCBuR3JhbVdpZHRocywgbGVmdFBhZCwgcmlnaHRQYWQsIHBhZFdpZHRoLFxuICAgICAgICAgICAgIHByZXNlcnZlU2hvcnRTZXF1ZW5jZXMpXG4gICAgICAuY29tcHV0ZShkYXRhLCBkYXRhU3BsaXRzKTtcbn1cbiJdfQ==