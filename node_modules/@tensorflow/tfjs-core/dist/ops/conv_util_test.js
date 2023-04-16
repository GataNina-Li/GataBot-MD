/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
import * as conv_util from './conv_util';
describe('conv_util computeConv2DInfo', () => {
    it('1x1 conv over 1x1 array with same pad', () => {
        const inShape = [1, 1, 1, 1];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv2DInfo(inShape, [1, 1, 1, 1], stride, dilation, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(1);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(1);
        expect(convInfo.effectiveFilterHeight).toEqual(1);
    });
    it('2x2 conv over 3x3 array with same pad', () => {
        const inShape = [1, 3, 3, 1];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, 1, 1], stride, dilation, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(2);
        expect(convInfo.effectiveFilterHeight).toEqual(2);
        // Should produce non-even padding with extra pixel at the right/bottom.
        expect(convInfo.padInfo.left).toBe(0);
        expect(convInfo.padInfo.right).toBe(1);
        expect(convInfo.padInfo.top).toBe(0);
        expect(convInfo.padInfo.bottom).toBe(1);
    });
    it('2x2 conv over 3x3 array with same pad', () => {
        const inShape = [1, 3, 3, 1];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, 1, 1], stride, dilation, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(2);
        expect(convInfo.effectiveFilterHeight).toEqual(2);
    });
    it('2x2 conv over 3x3 array with valid pad', () => {
        const inShape = [1, 3, 3, 1];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, 1, 1], stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(2);
        expect(convInfo.effectiveFilterHeight).toEqual(2);
    });
    it('3x3 conv over 5x5 array with same pad with stride 2', () => {
        const inShape = [1, 5, 5, 1];
        const stride = 2;
        const dilation = 1;
        const convInfo = conv_util.computeConv2DInfo(inShape, [3, 3, 1, 1], stride, dilation, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(3);
        expect(convInfo.effectiveFilterHeight).toEqual(3);
        expect(convInfo.padInfo.left).toBe(1);
        expect(convInfo.padInfo.right).toBe(1);
        expect(convInfo.padInfo.top).toBe(1);
        expect(convInfo.padInfo.bottom).toBe(1);
    });
    it('2x2 conv over 3x3 array with valid pad with stride 2', () => {
        const inShape = [1, 3, 3, 1];
        const stride = 2;
        const dilation = 1;
        const convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, 1, 1], stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(1);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(2);
        expect(convInfo.effectiveFilterHeight).toEqual(2);
    });
    it('2x1 conv over 3x3 array with valid pad with stride 1', () => {
        const inShape = [1, 3, 3, 1];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv2DInfo(inShape, [2, 1, 1, 1], stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(1);
        expect(convInfo.effectiveFilterHeight).toEqual(2);
    });
    it('2x1 conv over 3x3 array with valid pad with strides h=2, w=1', () => {
        const inShape = [1, 3, 3, 1];
        const strides = [2, 1];
        const dilation = 1;
        const convInfo = conv_util.computeConv2DInfo(inShape, [2, 1, 1, 1], strides, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(1);
        expect(convInfo.effectiveFilterHeight).toEqual(2);
    });
    it('1x2 conv over 3x3 array with valid pad with stride 1', () => {
        const inShape = [1, 3, 3, 1];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv2DInfo(inShape, [1, 2, 1, 1], stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(2);
        expect(convInfo.effectiveFilterHeight).toEqual(1);
    });
    it('1x2 conv over 3x3 array with valid pad with stride 1, batch=5', () => {
        const inShape = [5, 3, 3, 1];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv2DInfo(inShape, [1, 2, 1, 1], stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(5);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(2);
        expect(convInfo.effectiveFilterHeight).toEqual(1);
    });
    it('2x2 conv over 3x3 array with same pad with dilations 2', () => {
        const inShape = [1, 3, 3, 1];
        const stride = 1;
        const dilations = 2;
        const convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, 1, 1], stride, dilations, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        // pad evenly on all sides
        expect(convInfo.padInfo.left).toBe(1);
        expect(convInfo.padInfo.right).toBe(1);
        expect(convInfo.padInfo.top).toBe(1);
        expect(convInfo.padInfo.bottom).toBe(1);
        expect(convInfo.effectiveFilterWidth).toEqual(3);
        expect(convInfo.effectiveFilterHeight).toEqual(3);
    });
    it('2x1 conv over 3x3 array with same pad with dilations 2', () => {
        const inShape = [1, 3, 3, 1];
        const stride = 1;
        const dilations = 2;
        const convInfo = conv_util.computeConv2DInfo(inShape, [2, 1, 1, 1], stride, dilations, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        // pad top and bottom
        expect(convInfo.padInfo.left).toBe(0);
        expect(convInfo.padInfo.right).toBe(0);
        expect(convInfo.padInfo.top).toBe(1);
        expect(convInfo.padInfo.bottom).toBe(1);
        expect(convInfo.effectiveFilterWidth).toEqual(1);
        expect(convInfo.effectiveFilterHeight).toEqual(3);
    });
    it('3x4 conv over 8x8 array with same pad with dilations h=4 w=3', () => {
        const inShape = [1, 8, 8, 1];
        const stride = 1;
        const dilations = [4, 3];
        const convInfo = conv_util.computeConv2DInfo(inShape, [3, 4, 1, 1], stride, dilations, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(8);
        expect(convInfo.outWidth).toEqual(8);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(10);
        expect(convInfo.effectiveFilterHeight).toEqual(9);
        expect(convInfo.padInfo.left).toBe(4);
        expect(convInfo.padInfo.right).toBe(5);
        expect(convInfo.padInfo.top).toBe(4);
        expect(convInfo.padInfo.bottom).toBe(4);
    });
    it('2x1 conv over 3x3 array with valid pad with dilations 2', () => {
        const inShape = [1, 3, 3, 1];
        const stride = 1;
        const dilations = 2;
        const convInfo = conv_util.computeConv2DInfo(inShape, [2, 1, 1, 1], stride, dilations, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(1);
        expect(convInfo.effectiveFilterHeight).toEqual(3);
    });
    it('2x2 conv over 3x3 array with valid pad with dilations 2', () => {
        const inShape = [1, 3, 3, 1];
        const stride = 1;
        const dilations = 2;
        const convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, 1, 1], stride, dilations, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(1);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(3);
        expect(convInfo.effectiveFilterHeight).toEqual(3);
    });
    it('2x2 conv over 4x4 array with valid pad with dilations 2', () => {
        const inShape = [1, 4, 4, 1];
        const stride = 1;
        const dilations = 2;
        const convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, 1, 1], stride, dilations, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(3);
        expect(convInfo.effectiveFilterHeight).toEqual(3);
    });
});
describe('conv_util computeConv3DInfo', () => {
    it('1x1x1 conv over 1x1x1 array with same pad', () => {
        const inShape = [1, 1, 1, 1, 1];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv3DInfo(inShape, [1, 1, 1, 1, 1], stride, dilation, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(1);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('2x2x2 conv over 3x3x3 array with same pad', () => {
        const inShape = [1, 3, 3, 3, 1];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv3DInfo(inShape, [2, 2, 2, 1, 1], stride, dilation, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(3);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        // Should produce non-even padding with extra pixel at the back/right/bottom
        expect(convInfo.padInfo.front).toBe(0);
        expect(convInfo.padInfo.back).toBe(1);
        expect(convInfo.padInfo.left).toBe(0);
        expect(convInfo.padInfo.right).toBe(1);
        expect(convInfo.padInfo.top).toBe(0);
        expect(convInfo.padInfo.bottom).toBe(1);
    });
    it('2x2x2 conv over 3x3x3 array with same pad', () => {
        const inShape = [1, 3, 3, 3, 1];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv3DInfo(inShape, [2, 2, 2, 1, 1], stride, dilation, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(3);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('2x2x2 conv over 3x3x3 array with valid pad', () => {
        const inShape = [1, 3, 3, 3, 1];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv3DInfo(inShape, [2, 2, 2, 1, 1], stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(2);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('3x3x3 conv over 5x5x5 array with same pad with stride 2', () => {
        const inShape = [1, 5, 5, 5, 1];
        const stride = 2;
        const dilation = 1;
        const convInfo = conv_util.computeConv3DInfo(inShape, [3, 3, 3, 1, 1], stride, dilation, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(3);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.padInfo.front).toBe(1);
        expect(convInfo.padInfo.back).toBe(1);
        expect(convInfo.padInfo.left).toBe(1);
        expect(convInfo.padInfo.right).toBe(1);
        expect(convInfo.padInfo.top).toBe(1);
        expect(convInfo.padInfo.bottom).toBe(1);
    });
    it('2x2x2 conv over 3x3x3 array with valid pad with stride 2', () => {
        const inShape = [1, 3, 3, 3, 1];
        const stride = 2;
        const dilation = 1;
        const convInfo = conv_util.computeConv3DInfo(inShape, [2, 2, 2, 1, 1], stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(1);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('2x1x1 conv over 3x3x3 array with valid pad with stride 1', () => {
        const inShape = [1, 3, 3, 3, 1];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv3DInfo(inShape, [2, 1, 1, 1, 1], stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(2);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('2x1x1 conv over 3x3x3 array with valid pad with strides d=2, h=1, w=1', () => {
        const inShape = [1, 3, 3, 3, 1];
        const strides = [2, 1, 1];
        const dilation = 1;
        const convInfo = conv_util.computeConv3DInfo(inShape, [2, 1, 1, 1, 1], strides, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('1x2x2 conv over 3x3x3 array with valid pad with stride 1', () => {
        const inShape = [1, 3, 3, 3, 1];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv3DInfo(inShape, [1, 2, 2, 1, 1], stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(3);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('1x2x2 conv over 3x3x3 array with valid pad with stride 1, batch=5', () => {
        const inShape = [5, 3, 3, 3, 1];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv3DInfo(inShape, [1, 2, 2, 1, 1], stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(5);
        expect(convInfo.outDepth).toEqual(3);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('2x2x2 conv over 3x3x3 array with same pad with dilations 2', () => {
        const inShape = [1, 3, 3, 3, 1];
        const stride = 1;
        const dilations = 2;
        const convInfo = conv_util.computeConv3DInfo(inShape, [2, 2, 2, 1, 1], stride, dilations, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(3);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        // pad evenly on all sides
        expect(convInfo.padInfo.front).toBe(1);
        expect(convInfo.padInfo.back).toBe(1);
        expect(convInfo.padInfo.left).toBe(1);
        expect(convInfo.padInfo.right).toBe(1);
        expect(convInfo.padInfo.top).toBe(1);
        expect(convInfo.padInfo.bottom).toBe(1);
    });
    it('2x1x1 conv over 3x3x3 array with same pad with dilations 2', () => {
        const inShape = [1, 3, 3, 3, 1];
        const stride = 1;
        const dilations = 2;
        const convInfo = conv_util.computeConv3DInfo(inShape, [2, 1, 1, 1, 1], stride, dilations, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(3);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        // pad top and bottom
        expect(convInfo.padInfo.front).toBe(1);
        expect(convInfo.padInfo.back).toBe(1);
        expect(convInfo.padInfo.left).toBe(0);
        expect(convInfo.padInfo.right).toBe(0);
        expect(convInfo.padInfo.top).toBe(0);
        expect(convInfo.padInfo.bottom).toBe(0);
    });
    it('3x4x4 conv over 8x8 array with same pad with dilations d=4 h=3 w=3', () => {
        const inShape = [1, 8, 8, 8, 1];
        const stride = 1;
        const dilations = [4, 3, 3];
        const convInfo = conv_util.computeConv3DInfo(inShape, [3, 4, 4, 1, 1], stride, dilations, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(8);
        expect(convInfo.outHeight).toEqual(8);
        expect(convInfo.outWidth).toEqual(8);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.padInfo.front).toBe(4);
        expect(convInfo.padInfo.back).toBe(4);
        expect(convInfo.padInfo.left).toBe(4);
        expect(convInfo.padInfo.right).toBe(5);
        expect(convInfo.padInfo.top).toBe(4);
        expect(convInfo.padInfo.bottom).toBe(5);
    });
    it('2x1x1 conv over 3x3x3 array with valid pad with dilations 2', () => {
        const inShape = [1, 3, 3, 3, 1];
        const stride = 1;
        const dilations = 2;
        const convInfo = conv_util.computeConv3DInfo(inShape, [2, 1, 1, 1, 1], stride, dilations, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('2x2x2 conv over 3x3x3 array with valid pad with dilations 2', () => {
        const inShape = [1, 3, 3, 3, 1];
        const stride = 1;
        const dilations = 2;
        const convInfo = conv_util.computeConv3DInfo(inShape, [2, 2, 2, 1, 1], stride, dilations, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(1);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('2x2x2 conv over 4x4x4 array with valid pad with dilations 2', () => {
        const inShape = [1, 4, 4, 4, 1];
        const stride = 1;
        const dilations = 2;
        const convInfo = conv_util.computeConv3DInfo(inShape, [2, 2, 2, 1, 1], stride, dilations, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(2);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(1);
    });
});
describe('conv_util computeConv2DInfo with depthwise=true', () => {
    it('1x1 filter over 1x1 array with same pad', () => {
        const inChannels = 1;
        const inShape = [1, 1, 1, inChannels];
        const fSize = 1;
        const chMul = 1;
        const stride = 1;
        const dilation = 1;
        const pad = 'same';
        const convInfo = conv_util.computeConv2DInfo(inShape, [fSize, fSize, inChannels, chMul], stride, dilation, pad, null, true);
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(1);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(1);
        expect(convInfo.effectiveFilterHeight).toEqual(1);
    });
    it('2x2 filter over 3x3 array with same pad, chMul=3, depth=2', () => {
        const inChannels = 2;
        const batchSize = 1;
        const inSize = 3;
        const inShape = [batchSize, inSize, inSize, inChannels];
        const fSize = 2;
        const chMul = 3;
        const stride = 1;
        const dilation = 1;
        const pad = 'same';
        const convInfo = conv_util.computeConv2DInfo(inShape, [fSize, fSize, inChannels, chMul], stride, dilation, pad, null, true);
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(6);
        expect(convInfo.effectiveFilterWidth).toEqual(2);
        expect(convInfo.effectiveFilterHeight).toEqual(2);
    });
    it('2x2 filter over 3x3 array with valid pad, chMul=3, depth=2', () => {
        const inChannels = 2;
        const batchSize = 1;
        const inSize = 3;
        const inShape = [batchSize, inSize, inSize, inChannels];
        const fSize = 2;
        const chMul = 3;
        const stride = 1;
        const dilation = 1;
        const pad = 'valid';
        const convInfo = conv_util.computeConv2DInfo(inShape, [fSize, fSize, inChannels, chMul], stride, dilation, pad, null, true);
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(6);
        expect(convInfo.effectiveFilterWidth).toEqual(2);
        expect(convInfo.effectiveFilterHeight).toEqual(2);
    });
});
describe('conv_util computeConv3DInfo with depthwise=true', () => {
    it('1x1x1 filter over 1x1x1 array with same pad', () => {
        const inChannels = 1;
        const inShape = [1, 1, 1, 1, inChannels];
        const fSize = 1;
        const chMul = 1;
        const stride = 1;
        const dilation = 1;
        const pad = 'same';
        const convInfo = conv_util.computeConv3DInfo(inShape, [fSize, fSize, fSize, inChannels, chMul], stride, dilation, pad, true);
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(1);
        expect(convInfo.outChannels).toEqual(1);
    });
    it('2x2x2 filter over 3x3x3 array with same pad, chMul=3, depth=2', () => {
        const inChannels = 2;
        const batchSize = 1;
        const inSize = 3;
        const inShape = [batchSize, inSize, inSize, inSize, inChannels];
        const fSize = 2;
        const chMul = 3;
        const stride = 1;
        const dilation = 1;
        const pad = 'same';
        const convInfo = conv_util.computeConv3DInfo(inShape, [fSize, fSize, fSize, inChannels, chMul], stride, dilation, pad, true);
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(3);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(6);
    });
    it('2x2x2 filter over 3x3x3 array with valid pad, chMul=3, depth=2', () => {
        const inChannels = 2;
        const batchSize = 1;
        const inSize = 3;
        const inShape = [batchSize, inSize, inSize, inSize, inChannels];
        const fSize = 2;
        const chMul = 3;
        const stride = 1;
        const dilation = 1;
        const pad = 'valid';
        const convInfo = conv_util.computeConv3DInfo(inShape, [fSize, fSize, fSize, inChannels, chMul], stride, dilation, pad, true);
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(2);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(6);
    });
});
describe('conv_util computeConv2DInfo channelsFirst', () => {
    it('2x2 conv over 3x3 array with same pad', () => {
        const inDepth = 2;
        const outDepth = 4;
        const inShape = [1, inDepth, 3, 3];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, inDepth, outDepth], stride, dilation, 'same', null, false, 'channelsFirst');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(4);
        expect(convInfo.outShape).toEqual([1, 4, 3, 3]);
        expect(convInfo.effectiveFilterWidth).toEqual(2);
        expect(convInfo.effectiveFilterHeight).toEqual(2);
        // Should produce non-even padding with extra pixel at the right/bottom.
        expect(convInfo.padInfo.left).toBe(0);
        expect(convInfo.padInfo.right).toBe(1);
        expect(convInfo.padInfo.top).toBe(0);
        expect(convInfo.padInfo.bottom).toBe(1);
    });
    it('2x2 conv over 3x3 array with valid pad', () => {
        const inDepth = 6;
        const outDepth = 16;
        const inShape = [1, inDepth, 3, 3];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv2DInfo(inShape, [2, 2, inDepth, outDepth], stride, dilation, 'valid', null, false, 'channelsFirst');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(16);
        expect(convInfo.outShape).toEqual([1, 16, 2, 2]);
        expect(convInfo.effectiveFilterWidth).toEqual(2);
        expect(convInfo.effectiveFilterHeight).toEqual(2);
        // Should produce no padding.
        expect(convInfo.padInfo.left).toBe(0);
        expect(convInfo.padInfo.right).toBe(0);
        expect(convInfo.padInfo.top).toBe(0);
        expect(convInfo.padInfo.bottom).toBe(0);
    });
});
describe('conv_util computeConv3DInfo channelsFirst', () => {
    it('2x2x2 conv over 3x3x3 array with same pad', () => {
        const inDepth = 2;
        const outDepth = 4;
        const inShape = [1, inDepth, 3, 3, 3];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv3DInfo(inShape, [2, 2, 2, inDepth, outDepth], stride, dilation, 'same', false, 'channelsFirst');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(3);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(4);
        expect(convInfo.outShape).toEqual([1, 4, 3, 3, 3]);
        // Should produce non-even padding with extra pixel at the back/right/bottom
        expect(convInfo.padInfo.front).toBe(0);
        expect(convInfo.padInfo.back).toBe(1);
        expect(convInfo.padInfo.left).toBe(0);
        expect(convInfo.padInfo.right).toBe(1);
        expect(convInfo.padInfo.top).toBe(0);
        expect(convInfo.padInfo.bottom).toBe(1);
    });
    it('2x2x2 conv over 3x3x3 array with valid pad', () => {
        const inDepth = 6;
        const outDepth = 16;
        const inShape = [1, inDepth, 3, 3, 3];
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computeConv3DInfo(inShape, [2, 2, 2, inDepth, outDepth], stride, dilation, 'valid', false, 'channelsFirst');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(2);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(16);
        expect(convInfo.outShape).toEqual([1, 16, 2, 2, 2]);
        // Should produce no padding.
        expect(convInfo.padInfo.front).toBe(0);
        expect(convInfo.padInfo.back).toBe(0);
        expect(convInfo.padInfo.left).toBe(0);
        expect(convInfo.padInfo.right).toBe(0);
        expect(convInfo.padInfo.top).toBe(0);
        expect(convInfo.padInfo.bottom).toBe(0);
    });
});
describe('conv_util computeConv2DInfo roundingMode', () => {
    const inChannels = 6;
    const batchSize = 1;
    const inSize = 5;
    const inShape = [batchSize, inSize, inSize, inChannels];
    const fSize = 2;
    const chMul = 12;
    const stride = 2;
    const dilation = 1;
    const pad = 1;
    it('Default truncate the output dimension of Conv Layer', () => {
        const convInfo = conv_util.computeConv2DInfo(inShape, [fSize, fSize, inChannels, chMul], stride, dilation, pad);
        expect(convInfo.outShape).toEqual([batchSize, 3, 3, chMul]);
    });
    it('Floor the output dimension of Conv Layer', () => {
        const convInfo = conv_util.computeConv2DInfo(inShape, [fSize, fSize, inChannels, chMul], stride, dilation, pad, 'floor');
        expect(convInfo.outShape).toEqual([batchSize, 3, 3, chMul]);
    });
    it('Round the output dimension of Conv Layer', () => {
        const convInfo = conv_util.computeConv2DInfo(inShape, [fSize, fSize, inChannels, chMul], stride, dilation, pad, 'round');
        expect(convInfo.outShape).toEqual([batchSize, 4, 4, chMul]);
    });
    it('Ceil the output dimension of Conv Layer', () => {
        const convInfo = conv_util.computeConv2DInfo(inShape, [fSize, fSize, inChannels, chMul], stride, dilation, pad, 'ceil');
        expect(convInfo.outShape).toEqual([batchSize, 4, 4, chMul]);
    });
});
describe('conv_util computePoolInfo roundingMode', () => {
    const inChannels = 6;
    const batchSize = 1;
    const inSize = 5;
    const inShape = [batchSize, inSize, inSize, inChannels];
    const fSize = 2;
    const stride = 2;
    const dilation = 1;
    const pad = 1;
    it('Default truncate the output dimension of Pool Layer', () => {
        const poolInfo = conv_util.computePool2DInfo(inShape, [fSize, fSize], stride, pad, dilation, 'floor');
        expect(poolInfo.outShape).toEqual([batchSize, 3, 3, inChannels]);
    });
    it('Floor the output dimension of Pool Layer', () => {
        const poolInfo = conv_util.computePool2DInfo(inShape, [fSize, fSize], stride, pad, dilation, 'floor');
        expect(poolInfo.outShape).toEqual([batchSize, 3, 3, inChannels]);
    });
    it('Round the output dimension of Pool Layer', () => {
        const poolInfo = conv_util.computePool2DInfo(inShape, [fSize, fSize], stride, pad, dilation, 'round');
        expect(poolInfo.outShape).toEqual([batchSize, 4, 4, inChannels]);
    });
    it('Ceil the output dimension of Pool Layer', () => {
        const poolInfo = conv_util.computePool2DInfo(inShape, [fSize, fSize], stride, pad, dilation, 'ceil');
        expect(poolInfo.outShape).toEqual([batchSize, 4, 4, inChannels]);
    });
});
describe('conv_util computePool3dInfo', () => {
    it('1x1x1 pool over 1x1x1 array with valid pad', () => {
        const inShape = [1, 1, 1, 1, 1];
        const filterSize = 1;
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computePool3DInfo(inShape, filterSize, stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(1);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterDepth).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(1);
        expect(convInfo.effectiveFilterHeight).toEqual(1);
    });
    it('1x1x1 pool over 3x3x3 array with valid pad', () => {
        const inShape = [1, 3, 3, 3, 1];
        const filterSize = 1;
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computePool3DInfo(inShape, filterSize, stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(3);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterDepth).toEqual(1);
        expect(convInfo.effectiveFilterWidth).toEqual(1);
        expect(convInfo.effectiveFilterHeight).toEqual(1);
    });
    it('2x2x2 pool over 3x3x3 array with same pad', () => {
        const inShape = [1, 3, 3, 3, 1];
        const filterSize = 2;
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computePool3DInfo(inShape, filterSize, stride, dilation, 'same');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(3);
        expect(convInfo.outHeight).toEqual(3);
        expect(convInfo.outWidth).toEqual(3);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterDepth).toEqual(2);
        expect(convInfo.effectiveFilterWidth).toEqual(2);
        expect(convInfo.effectiveFilterHeight).toEqual(2);
        expect(convInfo.padInfo.top).toEqual(0);
        expect(convInfo.padInfo.bottom).toEqual(1);
        expect(convInfo.padInfo.left).toEqual(0);
        expect(convInfo.padInfo.right).toEqual(1);
        expect(convInfo.padInfo.front).toEqual(0);
        expect(convInfo.padInfo.back).toEqual(1);
        expect(convInfo.padInfo.type).toEqual('SAME');
    });
    it('2x2x2 pool over 3x3x3 array with valid pad', () => {
        const inShape = [1, 3, 3, 3, 1];
        const filterSize = 2;
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computePool3DInfo(inShape, filterSize, stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(2);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterDepth).toEqual(2);
        expect(convInfo.effectiveFilterWidth).toEqual(2);
        expect(convInfo.effectiveFilterHeight).toEqual(2);
    });
    it('2x2x2 pool over 4x4x4 array with valid pad, stride 2', () => {
        const inShape = [1, 4, 4, 4, 1];
        const filterSize = 2;
        const stride = 2;
        const dilation = 1;
        const convInfo = conv_util.computePool3DInfo(inShape, filterSize, stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(2);
        expect(convInfo.outHeight).toEqual(2);
        expect(convInfo.outWidth).toEqual(2);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterDepth).toEqual(2);
        expect(convInfo.effectiveFilterWidth).toEqual(2);
        expect(convInfo.effectiveFilterHeight).toEqual(2);
    });
    it('2x2x2 pool over 3x3x3 array with valid pad, dilation 2', () => {
        const inShape = [1, 3, 3, 3, 1];
        const filterSize = 2;
        const stride = 1;
        const dilation = 2;
        const convInfo = conv_util.computePool3DInfo(inShape, filterSize, stride, dilation, 'valid');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(1);
        expect(convInfo.outHeight).toEqual(1);
        expect(convInfo.outWidth).toEqual(1);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterDepth).toEqual(3);
        expect(convInfo.effectiveFilterWidth).toEqual(3);
        expect(convInfo.effectiveFilterHeight).toEqual(3);
    });
    it('2x2x2 pool over 3x3x3 array with pad 1, roundingMode floor', () => {
        const inShape = [1, 3, 3, 3, 1];
        const filterSize = 2;
        const stride = 1;
        const dilation = 1;
        const convInfo = conv_util.computePool3DInfo(inShape, filterSize, stride, dilation, 1, 'floor');
        expect(convInfo.batchSize).toEqual(1);
        expect(convInfo.outDepth).toEqual(4);
        expect(convInfo.outHeight).toEqual(4);
        expect(convInfo.outWidth).toEqual(4);
        expect(convInfo.outChannels).toEqual(1);
        expect(convInfo.effectiveFilterDepth).toEqual(2);
        expect(convInfo.effectiveFilterWidth).toEqual(2);
        expect(convInfo.effectiveFilterHeight).toEqual(2);
        expect(convInfo.padInfo.top).toEqual(1);
        expect(convInfo.padInfo.bottom).toEqual(1);
        expect(convInfo.padInfo.left).toEqual(1);
        expect(convInfo.padInfo.right).toEqual(1);
        expect(convInfo.padInfo.front).toEqual(1);
        expect(convInfo.padInfo.back).toEqual(1);
        expect(convInfo.padInfo.type).toEqual('NUMBER');
    });
    it('throws unknown dataFormat', () => {
        const inShape = [1, 3, 3, 3, 1];
        const filterSize = 2;
        const stride = 1;
        const dilation = 1;
        const fakeDataFormat = 'fakeFormat';
        expect(() => conv_util.computePool3DInfo(inShape, filterSize, stride, dilation, 1, 'floor', fakeDataFormat))
            .toThrowError();
    });
});
describe('conv_util convertConv2DDataFormat', () => {
    it('convert NHWC to channelsLast', () => {
        const dataFormat = 'NHWC';
        const $dataFormat = conv_util.convertConv2DDataFormat(dataFormat);
        expect($dataFormat).toEqual('channelsLast');
    });
    it('convert NCHW to channelsFirst', () => {
        const dataFormat = 'NCHW';
        const $dataFormat = conv_util.convertConv2DDataFormat(dataFormat);
        expect($dataFormat).toEqual('channelsFirst');
    });
    it('throws unknown dataFormat', () => {
        const dataFormat = 'FakeFormat';
        expect(() => conv_util.convertConv2DDataFormat(dataFormat))
            .toThrowError();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udl91dGlsX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9jb252X3V0aWxfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEtBQUssU0FBUyxNQUFNLGFBQWEsQ0FBQztBQUV6QyxRQUFRLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO0lBQzNDLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7UUFDL0MsTUFBTSxPQUFPLEdBQXFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0QsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNuQixNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsaUJBQWlCLENBQ3hDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRCxNQUFNLENB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QVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN4RCxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4QyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7UUFDbEUsTUFBTSxPQUFPLEdBQTZDLENBQUMsQ0FBQyxF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QUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLDBCQUEwQjtRQUMxQixNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0REFBNEQsRUFBRSxHQUFHLEVBQUU7UUFDcEUsTUFBTSxPQUFPLEdBQTZDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNqQixNQUFNLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDcEIsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUN4QyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxxQkFBcUI7UUFDckIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsb0VBQW9FLEVBQ3BFLEdBQUcsRUFBRTtRQUNILE1BQU0sT0FBTyxHQUNULENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNqQixNQUFNLFNBQVMsR0FBNkIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxpQkFBaUIsQ0FDeEMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDekQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFeEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFFTixFQUFFLENBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO1FBQ3JFLE1BQU0sT0FBTyxHQUE2QyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMxRSxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDakIsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxpQkFBaUIsQ0FDeEMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO1FBQ3JFLE1BQU0sT0FBTyxHQUE2QyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMxRSxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDakIsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxpQkFBaUIsQ0FDeEMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFD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Q0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO1FBQ3ZDLE1BQU0sVUFBVSxHQUFrQixNQUFNLENBQUM7UUFDekMsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO1FBQ25DLE1BQU0sVUFBVSxHQUFHLFlBQVksQ0FBQztRQUNoQyxNQUFNLENBQ0YsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLFVBQTZCLENBQUMsQ0FBQzthQUN0RSxZQUFZLEVBQUUsQ0FBQztJQUN0QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQgKiBhcyBjb252X3V0aWwgZnJvbSAnLi9jb252X3V0aWwnO1xuXG5kZXNjcmliZSgnY29udl91dGlsIGNvbXB1dGVDb252MkRJbmZvJywgKCkgPT4ge1xuICBpdCgnMXgxIGNvbnYgb3ZlciAxeDEgYXJyYXkgd2l0aCBzYW1lIHBhZCcsICgpID0+IHtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCAxLCAxLCAxXTtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjJESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgWzEsIDEsIDEsIDFdLCBzdHJpZGUsIGRpbGF0aW9uLCAnc2FtZScpO1xuICAgIGV4cGVjdChjb252SW5mby5iYXRjaFNpemUpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJXaWR0aCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVySGVpZ2h0KS50b0VxdWFsKDEpO1xuICB9KTtcblxuICBpdCgnMngyIGNvbnYgb3ZlciAzeDMgYXJyYXkgd2l0aCBzYW1lIHBhZCcsICgpID0+IHtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCAzLCAzLCAxXTtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjJESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgWzIsIDIsIDEsIDFdLCBzdHJpZGUsIGRpbGF0aW9uLCAnc2FtZScpO1xuICAgIGV4cGVjdChjb252SW5mby5iYXRjaFNpemUpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJXaWR0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVySGVpZ2h0KS50b0VxdWFsKDIpO1xuICAgIC8vIFNob3VsZCBwcm9kdWNlIG5vbi1ldmVuIHBhZGRpbmcgd2l0aCBleHRyYSBwaXhlbCBhdCB0aGUgcmlnaHQvYm90dG9tLlxuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLmxlZnQpLnRvQmUoMCk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8ucmlnaHQpLnRvQmUoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8udG9wKS50b0JlKDApO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLmJvdHRvbSkudG9CZSgxKTtcbiAgfSk7XG5cbiAgaXQoJzJ4MiBjb252IG92ZXIgM3gzIGFycmF5IHdpdGggc2FtZSBwYWQnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgMywgMywgMV07XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBkaWxhdGlvbiA9IDE7XG4gICAgY29uc3QgY29udkluZm8gPSBjb252X3V0aWwuY29tcHV0ZUNvbnYyREluZm8oXG4gICAgICAgIGluU2hhcGUsIFsyLCAyLCAxLCAxXSwgc3RyaWRlLCBkaWxhdGlvbiwgJ3NhbWUnKTtcbiAgICBleHBlY3QoY29udkluZm8uYmF0Y2hTaXplKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRIZWlnaHQpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dFdpZHRoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRDaGFubmVscykudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVyV2lkdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlckhlaWdodCkudG9FcXVhbCgyKTtcbiAgfSk7XG5cbiAgaXQoJzJ4MiBjb252IG92ZXIgM3gzIGFycmF5IHdpdGggdmFsaWQgcGFkJywgKCkgPT4ge1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDMsIDMsIDFdO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVDb252MkRJbmZvKFxuICAgICAgICBpblNoYXBlLCBbMiwgMiwgMSwgMV0sIHN0cmlkZSwgZGlsYXRpb24sICd2YWxpZCcpO1xuICAgIGV4cGVjdChjb252SW5mby5iYXRjaFNpemUpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJXaWR0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVySGVpZ2h0KS50b0VxdWFsKDIpO1xuICB9KTtcblxuICBpdCgnM3gzIGNvbnYgb3ZlciA1eDUgYXJyYXkgd2l0aCBzYW1lIHBhZCB3aXRoIHN0cmlkZSAyJywgKCkgPT4ge1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDUsIDUsIDFdO1xuICAgIGNvbnN0IHN0cmlkZSA9IDI7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVDb252MkRJbmZvKFxuICAgICAgICBpblNoYXBlLCBbMywgMywgMSwgMV0sIHN0cmlkZSwgZGlsYXRpb24sICdzYW1lJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0SGVpZ2h0KS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRXaWR0aCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0Q2hhbm5lbHMpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlcldpZHRoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJIZWlnaHQpLnRvRXF1YWwoMyk7XG5cbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5sZWZ0KS50b0JlKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnJpZ2h0KS50b0JlKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnRvcCkudG9CZSgxKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5ib3R0b20pLnRvQmUoMSk7XG4gIH0pO1xuXG4gIGl0KCcyeDIgY29udiBvdmVyIDN4MyBhcnJheSB3aXRoIHZhbGlkIHBhZCB3aXRoIHN0cmlkZSAyJywgKCkgPT4ge1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDMsIDMsIDFdO1xuICAgIGNvbnN0IHN0cmlkZSA9IDI7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVDb252MkRJbmZvKFxuICAgICAgICBpblNoYXBlLCBbMiwgMiwgMSwgMV0sIHN0cmlkZSwgZGlsYXRpb24sICd2YWxpZCcpO1xuICAgIGV4cGVjdChjb252SW5mby5iYXRjaFNpemUpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJXaWR0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVySGVpZ2h0KS50b0VxdWFsKDIpO1xuICB9KTtcblxuICBpdCgnMngxIGNvbnYgb3ZlciAzeDMgYXJyYXkgd2l0aCB2YWxpZCBwYWQgd2l0aCBzdHJpZGUgMScsICgpID0+IHtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCAzLCAzLCAxXTtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjJESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgWzIsIDEsIDEsIDFdLCBzdHJpZGUsIGRpbGF0aW9uLCAndmFsaWQnKTtcbiAgICBleHBlY3QoY29udkluZm8uYmF0Y2hTaXplKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRIZWlnaHQpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dFdpZHRoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRDaGFubmVscykudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVyV2lkdGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlckhlaWdodCkudG9FcXVhbCgyKTtcbiAgfSk7XG5cbiAgaXQoJzJ4MSBjb252IG92ZXIgM3gzIGFycmF5IHdpdGggdmFsaWQgcGFkIHdpdGggc3RyaWRlcyBoPTIsIHc9MScsICgpID0+IHtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCAzLCAzLCAxXTtcbiAgICBjb25zdCBzdHJpZGVzOiBbbnVtYmVyLCBudW1iZXJdID0gWzIsIDFdO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjJESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgWzIsIDEsIDEsIDFdLCBzdHJpZGVzLCBkaWxhdGlvbiwgJ3ZhbGlkJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0SGVpZ2h0KS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRXaWR0aCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0Q2hhbm5lbHMpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlcldpZHRoKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJIZWlnaHQpLnRvRXF1YWwoMik7XG4gIH0pO1xuXG4gIGl0KCcxeDIgY29udiBvdmVyIDN4MyBhcnJheSB3aXRoIHZhbGlkIHBhZCB3aXRoIHN0cmlkZSAxJywgKCkgPT4ge1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDMsIDMsIDFdO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVDb252MkRJbmZvKFxuICAgICAgICBpblNoYXBlLCBbMSwgMiwgMSwgMV0sIHN0cmlkZSwgZGlsYXRpb24sICd2YWxpZCcpO1xuICAgIGV4cGVjdChjb252SW5mby5iYXRjaFNpemUpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJXaWR0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVySGVpZ2h0KS50b0VxdWFsKDEpO1xuICB9KTtcblxuICBpdCgnMXgyIGNvbnYgb3ZlciAzeDMgYXJyYXkgd2l0aCB2YWxpZCBwYWQgd2l0aCBzdHJpZGUgMSwgYmF0Y2g9NScsICgpID0+IHtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFs1LCAzLCAzLCAxXTtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjJESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgWzEsIDIsIDEsIDFdLCBzdHJpZGUsIGRpbGF0aW9uLCAndmFsaWQnKTtcbiAgICBleHBlY3QoY29udkluZm8uYmF0Y2hTaXplKS50b0VxdWFsKDUpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRIZWlnaHQpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dFdpZHRoKS50b0VxdWFsKDIpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRDaGFubmVscykudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVyV2lkdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlckhlaWdodCkudG9FcXVhbCgxKTtcbiAgfSk7XG5cbiAgaXQoJzJ4MiBjb252IG92ZXIgM3gzIGFycmF5IHdpdGggc2FtZSBwYWQgd2l0aCBkaWxhdGlvbnMgMicsICgpID0+IHtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCAzLCAzLCAxXTtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9ucyA9IDI7XG4gICAgY29uc3QgY29udkluZm8gPSBjb252X3V0aWwuY29tcHV0ZUNvbnYyREluZm8oXG4gICAgICAgIGluU2hhcGUsIFsyLCAyLCAxLCAxXSwgc3RyaWRlLCBkaWxhdGlvbnMsICdzYW1lJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0SGVpZ2h0KS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRXaWR0aCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0Q2hhbm5lbHMpLnRvRXF1YWwoMSk7XG4gICAgLy8gcGFkIGV2ZW5seSBvbiBhbGwgc2lkZXNcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5sZWZ0KS50b0JlKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnJpZ2h0KS50b0JlKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnRvcCkudG9CZSgxKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5ib3R0b20pLnRvQmUoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlcldpZHRoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJIZWlnaHQpLnRvRXF1YWwoMyk7XG4gIH0pO1xuXG4gIGl0KCcyeDEgY29udiBvdmVyIDN4MyBhcnJheSB3aXRoIHNhbWUgcGFkIHdpdGggZGlsYXRpb25zIDInLCAoKSA9PiB7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgMywgMywgMV07XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBkaWxhdGlvbnMgPSAyO1xuICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVDb252MkRJbmZvKFxuICAgICAgICBpblNoYXBlLCBbMiwgMSwgMSwgMV0sIHN0cmlkZSwgZGlsYXRpb25zLCAnc2FtZScpO1xuICAgIGV4cGVjdChjb252SW5mby5iYXRjaFNpemUpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICAgIC8vIHBhZCB0b3AgYW5kIGJvdHRvbVxuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLmxlZnQpLnRvQmUoMCk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8ucmlnaHQpLnRvQmUoMCk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8udG9wKS50b0JlKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLmJvdHRvbSkudG9CZSgxKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVyV2lkdGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlckhlaWdodCkudG9FcXVhbCgzKTtcbiAgfSk7XG5cbiAgaXQoJzN4NCBjb252IG92ZXIgOHg4IGFycmF5IHdpdGggc2FtZSBwYWQgd2l0aCBkaWxhdGlvbnMgaD00IHc9MycsICgpID0+IHtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCA4LCA4LCAxXTtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9uczogW251bWJlciwgbnVtYmVyXSA9IFs0LCAzXTtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjJESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgWzMsIDQsIDEsIDFdLCBzdHJpZGUsIGRpbGF0aW9ucywgJ3NhbWUnKTtcbiAgICBleHBlY3QoY29udkluZm8uYmF0Y2hTaXplKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRIZWlnaHQpLnRvRXF1YWwoOCk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dFdpZHRoKS50b0VxdWFsKDgpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRDaGFubmVscykudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVyV2lkdGgpLnRvRXF1YWwoMTApO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJIZWlnaHQpLnRvRXF1YWwoOSk7XG5cbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5sZWZ0KS50b0JlKDQpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnJpZ2h0KS50b0JlKDUpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnRvcCkudG9CZSg0KTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5ib3R0b20pLnRvQmUoNCk7XG4gIH0pO1xuXG4gIGl0KCcyeDEgY29udiBvdmVyIDN4MyBhcnJheSB3aXRoIHZhbGlkIHBhZCB3aXRoIGRpbGF0aW9ucyAyJywgKCkgPT4ge1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDMsIDMsIDFdO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGlsYXRpb25zID0gMjtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjJESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgWzIsIDEsIDEsIDFdLCBzdHJpZGUsIGRpbGF0aW9ucywgJ3ZhbGlkJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0SGVpZ2h0KS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRXaWR0aCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0Q2hhbm5lbHMpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlcldpZHRoKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJIZWlnaHQpLnRvRXF1YWwoMyk7XG4gIH0pO1xuXG4gIGl0KCcyeDIgY29udiBvdmVyIDN4MyBhcnJheSB3aXRoIHZhbGlkIHBhZCB3aXRoIGRpbGF0aW9ucyAyJywgKCkgPT4ge1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDMsIDMsIDFdO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGlsYXRpb25zID0gMjtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjJESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgWzIsIDIsIDEsIDFdLCBzdHJpZGUsIGRpbGF0aW9ucywgJ3ZhbGlkJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0SGVpZ2h0KS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRXaWR0aCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0Q2hhbm5lbHMpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlcldpZHRoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJIZWlnaHQpLnRvRXF1YWwoMyk7XG4gIH0pO1xuXG4gIGl0KCcyeDIgY29udiBvdmVyIDR4NCBhcnJheSB3aXRoIHZhbGlkIHBhZCB3aXRoIGRpbGF0aW9ucyAyJywgKCkgPT4ge1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDQsIDQsIDFdO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGlsYXRpb25zID0gMjtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjJESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgWzIsIDIsIDEsIDFdLCBzdHJpZGUsIGRpbGF0aW9ucywgJ3ZhbGlkJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0SGVpZ2h0KS50b0VxdWFsKDIpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRXaWR0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0Q2hhbm5lbHMpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlcldpZHRoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJIZWlnaHQpLnRvRXF1YWwoMyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdjb252X3V0aWwgY29tcHV0ZUNvbnYzREluZm8nLCAoKSA9PiB7XG4gIGl0KCcxeDF4MSBjb252IG92ZXIgMXgxeDEgYXJyYXkgd2l0aCBzYW1lIHBhZCcsICgpID0+IHtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDEsIDEsIDEsIDFdO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVDb252M0RJbmZvKFxuICAgICAgICBpblNoYXBlLCBbMSwgMSwgMSwgMSwgMV0sIHN0cmlkZSwgZGlsYXRpb24sICdzYW1lJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0RGVwdGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICB9KTtcblxuICBpdCgnMngyeDIgY29udiBvdmVyIDN4M3gzIGFycmF5IHdpdGggc2FtZSBwYWQnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCAzLCAzLCAzLCAxXTtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjNESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgWzIsIDIsIDIsIDEsIDFdLCBzdHJpZGUsIGRpbGF0aW9uLCAnc2FtZScpO1xuICAgIGV4cGVjdChjb252SW5mby5iYXRjaFNpemUpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dERlcHRoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRIZWlnaHQpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dFdpZHRoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRDaGFubmVscykudG9FcXVhbCgxKTtcbiAgICAvLyBTaG91bGQgcHJvZHVjZSBub24tZXZlbiBwYWRkaW5nIHdpdGggZXh0cmEgcGl4ZWwgYXQgdGhlIGJhY2svcmlnaHQvYm90dG9tXG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8uZnJvbnQpLnRvQmUoMCk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8uYmFjaykudG9CZSgxKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5sZWZ0KS50b0JlKDApO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnJpZ2h0KS50b0JlKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnRvcCkudG9CZSgwKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5ib3R0b20pLnRvQmUoMSk7XG4gIH0pO1xuXG4gIGl0KCcyeDJ4MiBjb252IG92ZXIgM3gzeDMgYXJyYXkgd2l0aCBzYW1lIHBhZCcsICgpID0+IHtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDMsIDMsIDMsIDFdO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVDb252M0RJbmZvKFxuICAgICAgICBpblNoYXBlLCBbMiwgMiwgMiwgMSwgMV0sIHN0cmlkZSwgZGlsYXRpb24sICdzYW1lJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0RGVwdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICB9KTtcblxuICBpdCgnMngyeDIgY29udiBvdmVyIDN4M3gzIGFycmF5IHdpdGggdmFsaWQgcGFkJywgKCkgPT4ge1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgMywgMywgMywgMV07XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBkaWxhdGlvbiA9IDE7XG4gICAgY29uc3QgY29udkluZm8gPSBjb252X3V0aWwuY29tcHV0ZUNvbnYzREluZm8oXG4gICAgICAgIGluU2hhcGUsIFsyLCAyLCAyLCAxLCAxXSwgc3RyaWRlLCBkaWxhdGlvbiwgJ3ZhbGlkJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0RGVwdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICB9KTtcblxuICBpdCgnM3gzeDMgY29udiBvdmVyIDV4NXg1IGFycmF5IHdpdGggc2FtZSBwYWQgd2l0aCBzdHJpZGUgMicsICgpID0+IHtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDUsIDUsIDUsIDFdO1xuICAgIGNvbnN0IHN0cmlkZSA9IDI7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVDb252M0RJbmZvKFxuICAgICAgICBpblNoYXBlLCBbMywgMywgMywgMSwgMV0sIHN0cmlkZSwgZGlsYXRpb24sICdzYW1lJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0RGVwdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuXG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8uZnJvbnQpLnRvQmUoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8uYmFjaykudG9CZSgxKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5sZWZ0KS50b0JlKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnJpZ2h0KS50b0JlKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnRvcCkudG9CZSgxKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5ib3R0b20pLnRvQmUoMSk7XG4gIH0pO1xuXG4gIGl0KCcyeDJ4MiBjb252IG92ZXIgM3gzeDMgYXJyYXkgd2l0aCB2YWxpZCBwYWQgd2l0aCBzdHJpZGUgMicsICgpID0+IHtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDMsIDMsIDMsIDFdO1xuICAgIGNvbnN0IHN0cmlkZSA9IDI7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVDb252M0RJbmZvKFxuICAgICAgICBpblNoYXBlLCBbMiwgMiwgMiwgMSwgMV0sIHN0cmlkZSwgZGlsYXRpb24sICd2YWxpZCcpO1xuICAgIGV4cGVjdChjb252SW5mby5iYXRjaFNpemUpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dERlcHRoKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRIZWlnaHQpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dFdpZHRoKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRDaGFubmVscykudG9FcXVhbCgxKTtcbiAgfSk7XG5cbiAgaXQoJzJ4MXgxIGNvbnYgb3ZlciAzeDN4MyBhcnJheSB3aXRoIHZhbGlkIHBhZCB3aXRoIHN0cmlkZSAxJywgKCkgPT4ge1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgMywgMywgMywgMV07XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBkaWxhdGlvbiA9IDE7XG4gICAgY29uc3QgY29udkluZm8gPSBjb252X3V0aWwuY29tcHV0ZUNvbnYzREluZm8oXG4gICAgICAgIGluU2hhcGUsIFsyLCAxLCAxLCAxLCAxXSwgc3RyaWRlLCBkaWxhdGlvbiwgJ3ZhbGlkJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0RGVwdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICB9KTtcblxuICBpdCgnMngxeDEgY29udiBvdmVyIDN4M3gzIGFycmF5IHdpdGggdmFsaWQgcGFkIHdpdGggc3RyaWRlcyBkPTIsIGg9MSwgdz0xJyxcbiAgICAgKCkgPT4ge1xuICAgICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICAgICBbMSwgMywgMywgMywgMV07XG4gICAgICAgY29uc3Qgc3RyaWRlczogW251bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzIsIDEsIDFdO1xuICAgICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjNESW5mbyhcbiAgICAgICAgICAgaW5TaGFwZSwgWzIsIDEsIDEsIDEsIDFdLCBzdHJpZGVzLCBkaWxhdGlvbiwgJ3ZhbGlkJyk7XG4gICAgICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICAgICBleHBlY3QoY29udkluZm8ub3V0RGVwdGgpLnRvRXF1YWwoMSk7XG4gICAgICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgzKTtcbiAgICAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMyk7XG4gICAgICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICAgICB9KTtcblxuICBpdCgnMXgyeDIgY29udiBvdmVyIDN4M3gzIGFycmF5IHdpdGggdmFsaWQgcGFkIHdpdGggc3RyaWRlIDEnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCAzLCAzLCAzLCAxXTtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjNESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgWzEsIDIsIDIsIDEsIDFdLCBzdHJpZGUsIGRpbGF0aW9uLCAndmFsaWQnKTtcbiAgICBleHBlY3QoY29udkluZm8uYmF0Y2hTaXplKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXREZXB0aCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0SGVpZ2h0KS50b0VxdWFsKDIpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRXaWR0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0Q2hhbm5lbHMpLnRvRXF1YWwoMSk7XG4gIH0pO1xuXG4gIGl0KCcxeDJ4MiBjb252IG92ZXIgM3gzeDMgYXJyYXkgd2l0aCB2YWxpZCBwYWQgd2l0aCBzdHJpZGUgMSwgYmF0Y2g9NScsXG4gICAgICgpID0+IHtcbiAgICAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID1cbiAgICAgICAgICAgWzUsIDMsIDMsIDMsIDFdO1xuICAgICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVDb252M0RJbmZvKFxuICAgICAgICAgICBpblNoYXBlLCBbMSwgMiwgMiwgMSwgMV0sIHN0cmlkZSwgZGlsYXRpb24sICd2YWxpZCcpO1xuICAgICAgIGV4cGVjdChjb252SW5mby5iYXRjaFNpemUpLnRvRXF1YWwoNSk7XG4gICAgICAgZXhwZWN0KGNvbnZJbmZvLm91dERlcHRoKS50b0VxdWFsKDMpO1xuICAgICAgIGV4cGVjdChjb252SW5mby5vdXRIZWlnaHQpLnRvRXF1YWwoMik7XG4gICAgICAgZXhwZWN0KGNvbnZJbmZvLm91dFdpZHRoKS50b0VxdWFsKDIpO1xuICAgICAgIGV4cGVjdChjb252SW5mby5vdXRDaGFubmVscykudG9FcXVhbCgxKTtcbiAgICAgfSk7XG5cbiAgaXQoJzJ4MngyIGNvbnYgb3ZlciAzeDN4MyBhcnJheSB3aXRoIHNhbWUgcGFkIHdpdGggZGlsYXRpb25zIDInLCAoKSA9PiB7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCAzLCAzLCAzLCAxXTtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9ucyA9IDI7XG4gICAgY29uc3QgY29udkluZm8gPSBjb252X3V0aWwuY29tcHV0ZUNvbnYzREluZm8oXG4gICAgICAgIGluU2hhcGUsIFsyLCAyLCAyLCAxLCAxXSwgc3RyaWRlLCBkaWxhdGlvbnMsICdzYW1lJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0RGVwdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICAgIC8vIHBhZCBldmVubHkgb24gYWxsIHNpZGVzXG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8uZnJvbnQpLnRvQmUoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8uYmFjaykudG9CZSgxKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5sZWZ0KS50b0JlKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnJpZ2h0KS50b0JlKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnRvcCkudG9CZSgxKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5ib3R0b20pLnRvQmUoMSk7XG4gIH0pO1xuXG4gIGl0KCcyeDF4MSBjb252IG92ZXIgM3gzeDMgYXJyYXkgd2l0aCBzYW1lIHBhZCB3aXRoIGRpbGF0aW9ucyAyJywgKCkgPT4ge1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgMywgMywgMywgMV07XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBkaWxhdGlvbnMgPSAyO1xuICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVDb252M0RJbmZvKFxuICAgICAgICBpblNoYXBlLCBbMiwgMSwgMSwgMSwgMV0sIHN0cmlkZSwgZGlsYXRpb25zLCAnc2FtZScpO1xuICAgIGV4cGVjdChjb252SW5mby5iYXRjaFNpemUpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dERlcHRoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRIZWlnaHQpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dFdpZHRoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRDaGFubmVscykudG9FcXVhbCgxKTtcbiAgICAvLyBwYWQgdG9wIGFuZCBib3R0b21cbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5mcm9udCkudG9CZSgxKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5iYWNrKS50b0JlKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLmxlZnQpLnRvQmUoMCk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8ucmlnaHQpLnRvQmUoMCk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8udG9wKS50b0JlKDApO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLmJvdHRvbSkudG9CZSgwKTtcbiAgfSk7XG5cbiAgaXQoJzN4NHg0IGNvbnYgb3ZlciA4eDggYXJyYXkgd2l0aCBzYW1lIHBhZCB3aXRoIGRpbGF0aW9ucyBkPTQgaD0zIHc9MycsXG4gICAgICgpID0+IHtcbiAgICAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID1cbiAgICAgICAgICAgWzEsIDgsIDgsIDgsIDFdO1xuICAgICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgICAgY29uc3QgZGlsYXRpb25zOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbNCwgMywgM107XG4gICAgICAgY29uc3QgY29udkluZm8gPSBjb252X3V0aWwuY29tcHV0ZUNvbnYzREluZm8oXG4gICAgICAgICAgIGluU2hhcGUsIFszLCA0LCA0LCAxLCAxXSwgc3RyaWRlLCBkaWxhdGlvbnMsICdzYW1lJyk7XG4gICAgICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICAgICBleHBlY3QoY29udkluZm8ub3V0RGVwdGgpLnRvRXF1YWwoOCk7XG4gICAgICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCg4KTtcbiAgICAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoOCk7XG4gICAgICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuXG4gICAgICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8uZnJvbnQpLnRvQmUoNCk7XG4gICAgICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8uYmFjaykudG9CZSg0KTtcbiAgICAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5sZWZ0KS50b0JlKDQpO1xuICAgICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnJpZ2h0KS50b0JlKDUpO1xuICAgICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnRvcCkudG9CZSg0KTtcbiAgICAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5ib3R0b20pLnRvQmUoNSk7XG4gICAgIH0pO1xuXG4gIGl0KCcyeDF4MSBjb252IG92ZXIgM3gzeDMgYXJyYXkgd2l0aCB2YWxpZCBwYWQgd2l0aCBkaWxhdGlvbnMgMicsICgpID0+IHtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDMsIDMsIDMsIDFdO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGlsYXRpb25zID0gMjtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjNESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgWzIsIDEsIDEsIDEsIDFdLCBzdHJpZGUsIGRpbGF0aW9ucywgJ3ZhbGlkJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0RGVwdGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICB9KTtcblxuICBpdCgnMngyeDIgY29udiBvdmVyIDN4M3gzIGFycmF5IHdpdGggdmFsaWQgcGFkIHdpdGggZGlsYXRpb25zIDInLCAoKSA9PiB7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCAzLCAzLCAzLCAxXTtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9ucyA9IDI7XG4gICAgY29uc3QgY29udkluZm8gPSBjb252X3V0aWwuY29tcHV0ZUNvbnYzREluZm8oXG4gICAgICAgIGluU2hhcGUsIFsyLCAyLCAyLCAxLCAxXSwgc3RyaWRlLCBkaWxhdGlvbnMsICd2YWxpZCcpO1xuICAgIGV4cGVjdChjb252SW5mby5iYXRjaFNpemUpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dERlcHRoKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRIZWlnaHQpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dFdpZHRoKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRDaGFubmVscykudG9FcXVhbCgxKTtcbiAgfSk7XG5cbiAgaXQoJzJ4MngyIGNvbnYgb3ZlciA0eDR4NCBhcnJheSB3aXRoIHZhbGlkIHBhZCB3aXRoIGRpbGF0aW9ucyAyJywgKCkgPT4ge1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgNCwgNCwgNCwgMV07XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBkaWxhdGlvbnMgPSAyO1xuICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVDb252M0RJbmZvKFxuICAgICAgICBpblNoYXBlLCBbMiwgMiwgMiwgMSwgMV0sIHN0cmlkZSwgZGlsYXRpb25zLCAndmFsaWQnKTtcbiAgICBleHBlY3QoY29udkluZm8uYmF0Y2hTaXplKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXREZXB0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0SGVpZ2h0KS50b0VxdWFsKDIpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRXaWR0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0Q2hhbm5lbHMpLnRvRXF1YWwoMSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdjb252X3V0aWwgY29tcHV0ZUNvbnYyREluZm8gd2l0aCBkZXB0aHdpc2U9dHJ1ZScsICgpID0+IHtcbiAgaXQoJzF4MSBmaWx0ZXIgb3ZlciAxeDEgYXJyYXkgd2l0aCBzYW1lIHBhZCcsICgpID0+IHtcbiAgICBjb25zdCBpbkNoYW5uZWxzID0gMTtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCAxLCAxLCBpbkNoYW5uZWxzXTtcbiAgICBjb25zdCBmU2l6ZSA9IDE7XG4gICAgY29uc3QgY2hNdWwgPSAxO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjJESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgW2ZTaXplLCBmU2l6ZSwgaW5DaGFubmVscywgY2hNdWxdLCBzdHJpZGUsIGRpbGF0aW9uLCBwYWQsIG51bGwsXG4gICAgICAgIHRydWUpO1xuICAgIGV4cGVjdChjb252SW5mby5iYXRjaFNpemUpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJXaWR0aCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVySGVpZ2h0KS50b0VxdWFsKDEpO1xuICB9KTtcblxuICBpdCgnMngyIGZpbHRlciBvdmVyIDN4MyBhcnJheSB3aXRoIHNhbWUgcGFkLCBjaE11bD0zLCBkZXB0aD0yJywgKCkgPT4ge1xuICAgIGNvbnN0IGluQ2hhbm5lbHMgPSAyO1xuICAgIGNvbnN0IGJhdGNoU2l6ZSA9IDE7XG4gICAgY29uc3QgaW5TaXplID0gMztcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgIFtiYXRjaFNpemUsIGluU2l6ZSwgaW5TaXplLCBpbkNoYW5uZWxzXTtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3QgY2hNdWwgPSAzO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjJESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgW2ZTaXplLCBmU2l6ZSwgaW5DaGFubmVscywgY2hNdWxdLCBzdHJpZGUsIGRpbGF0aW9uLCBwYWQsIG51bGwsXG4gICAgICAgIHRydWUpO1xuICAgIGV4cGVjdChjb252SW5mby5iYXRjaFNpemUpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDYpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJXaWR0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVySGVpZ2h0KS50b0VxdWFsKDIpO1xuICB9KTtcblxuICBpdCgnMngyIGZpbHRlciBvdmVyIDN4MyBhcnJheSB3aXRoIHZhbGlkIHBhZCwgY2hNdWw9MywgZGVwdGg9MicsICgpID0+IHtcbiAgICBjb25zdCBpbkNoYW5uZWxzID0gMjtcbiAgICBjb25zdCBiYXRjaFNpemUgPSAxO1xuICAgIGNvbnN0IGluU2l6ZSA9IDM7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICBbYmF0Y2hTaXplLCBpblNpemUsIGluU2l6ZSwgaW5DaGFubmVsc107XG4gICAgY29uc3QgZlNpemUgPSAyO1xuICAgIGNvbnN0IGNoTXVsID0gMztcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBwYWQgPSAndmFsaWQnO1xuICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVDb252MkRJbmZvKFxuICAgICAgICBpblNoYXBlLCBbZlNpemUsIGZTaXplLCBpbkNoYW5uZWxzLCBjaE11bF0sIHN0cmlkZSwgZGlsYXRpb24sIHBhZCwgbnVsbCxcbiAgICAgICAgdHJ1ZSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0SGVpZ2h0KS50b0VxdWFsKDIpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRXaWR0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0Q2hhbm5lbHMpLnRvRXF1YWwoNik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlcldpZHRoKS50b0VxdWFsKDIpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJIZWlnaHQpLnRvRXF1YWwoMik7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdjb252X3V0aWwgY29tcHV0ZUNvbnYzREluZm8gd2l0aCBkZXB0aHdpc2U9dHJ1ZScsICgpID0+IHtcbiAgaXQoJzF4MXgxIGZpbHRlciBvdmVyIDF4MXgxIGFycmF5IHdpdGggc2FtZSBwYWQnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5DaGFubmVscyA9IDE7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgIFsxLCAxLCAxLCAxLCBpbkNoYW5uZWxzXTtcbiAgICBjb25zdCBmU2l6ZSA9IDE7XG4gICAgY29uc3QgY2hNdWwgPSAxO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IHBhZCA9ICdzYW1lJztcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjNESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgW2ZTaXplLCBmU2l6ZSwgZlNpemUsIGluQ2hhbm5lbHMsIGNoTXVsXSwgc3RyaWRlLCBkaWxhdGlvbixcbiAgICAgICAgcGFkLCB0cnVlKTtcbiAgICBleHBlY3QoY29udkluZm8uYmF0Y2hTaXplKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXREZXB0aCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0SGVpZ2h0KS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRXaWR0aCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0Q2hhbm5lbHMpLnRvRXF1YWwoMSk7XG4gIH0pO1xuXG4gIGl0KCcyeDJ4MiBmaWx0ZXIgb3ZlciAzeDN4MyBhcnJheSB3aXRoIHNhbWUgcGFkLCBjaE11bD0zLCBkZXB0aD0yJywgKCkgPT4ge1xuICAgIGNvbnN0IGluQ2hhbm5lbHMgPSAyO1xuICAgIGNvbnN0IGJhdGNoU2l6ZSA9IDE7XG4gICAgY29uc3QgaW5TaXplID0gMztcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID1cbiAgICAgICAgW2JhdGNoU2l6ZSwgaW5TaXplLCBpblNpemUsIGluU2l6ZSwgaW5DaGFubmVsc107XG4gICAgY29uc3QgZlNpemUgPSAyO1xuICAgIGNvbnN0IGNoTXVsID0gMztcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBwYWQgPSAnc2FtZSc7XG4gICAgY29uc3QgY29udkluZm8gPSBjb252X3V0aWwuY29tcHV0ZUNvbnYzREluZm8oXG4gICAgICAgIGluU2hhcGUsIFtmU2l6ZSwgZlNpemUsIGZTaXplLCBpbkNoYW5uZWxzLCBjaE11bF0sIHN0cmlkZSwgZGlsYXRpb24sXG4gICAgICAgIHBhZCwgdHJ1ZSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0RGVwdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDYpO1xuICB9KTtcblxuICBpdCgnMngyeDIgZmlsdGVyIG92ZXIgM3gzeDMgYXJyYXkgd2l0aCB2YWxpZCBwYWQsIGNoTXVsPTMsIGRlcHRoPTInLCAoKSA9PiB7XG4gICAgY29uc3QgaW5DaGFubmVscyA9IDI7XG4gICAgY29uc3QgYmF0Y2hTaXplID0gMTtcbiAgICBjb25zdCBpblNpemUgPSAzO1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgICBbYmF0Y2hTaXplLCBpblNpemUsIGluU2l6ZSwgaW5TaXplLCBpbkNoYW5uZWxzXTtcbiAgICBjb25zdCBmU2l6ZSA9IDI7XG4gICAgY29uc3QgY2hNdWwgPSAzO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IHBhZCA9ICd2YWxpZCc7XG4gICAgY29uc3QgY29udkluZm8gPSBjb252X3V0aWwuY29tcHV0ZUNvbnYzREluZm8oXG4gICAgICAgIGluU2hhcGUsIFtmU2l6ZSwgZlNpemUsIGZTaXplLCBpbkNoYW5uZWxzLCBjaE11bF0sIHN0cmlkZSwgZGlsYXRpb24sXG4gICAgICAgIHBhZCwgdHJ1ZSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0RGVwdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDYpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnY29udl91dGlsIGNvbXB1dGVDb252MkRJbmZvIGNoYW5uZWxzRmlyc3QnLCAoKSA9PiB7XG4gIGl0KCcyeDIgY29udiBvdmVyIDN4MyBhcnJheSB3aXRoIHNhbWUgcGFkJywgKCkgPT4ge1xuICAgIGNvbnN0IGluRGVwdGggPSAyO1xuICAgIGNvbnN0IG91dERlcHRoID0gNDtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCBpbkRlcHRoLCAzLCAzXTtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjJESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgWzIsIDIsIGluRGVwdGgsIG91dERlcHRoXSwgc3RyaWRlLCBkaWxhdGlvbiwgJ3NhbWUnLCBudWxsLFxuICAgICAgICBmYWxzZSwgJ2NoYW5uZWxzRmlyc3QnKTtcbiAgICBleHBlY3QoY29udkluZm8uYmF0Y2hTaXplKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRIZWlnaHQpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dFdpZHRoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRDaGFubmVscykudG9FcXVhbCg0KTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0U2hhcGUpLnRvRXF1YWwoWzEsIDQsIDMsIDNdKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVyV2lkdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlckhlaWdodCkudG9FcXVhbCgyKTtcbiAgICAvLyBTaG91bGQgcHJvZHVjZSBub24tZXZlbiBwYWRkaW5nIHdpdGggZXh0cmEgcGl4ZWwgYXQgdGhlIHJpZ2h0L2JvdHRvbS5cbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5sZWZ0KS50b0JlKDApO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnJpZ2h0KS50b0JlKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnRvcCkudG9CZSgwKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5ib3R0b20pLnRvQmUoMSk7XG4gIH0pO1xuXG4gIGl0KCcyeDIgY29udiBvdmVyIDN4MyBhcnJheSB3aXRoIHZhbGlkIHBhZCcsICgpID0+IHtcbiAgICBjb25zdCBpbkRlcHRoID0gNjtcbiAgICBjb25zdCBvdXREZXB0aCA9IDE2O1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIGluRGVwdGgsIDMsIDNdO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVDb252MkRJbmZvKFxuICAgICAgICBpblNoYXBlLCBbMiwgMiwgaW5EZXB0aCwgb3V0RGVwdGhdLCBzdHJpZGUsIGRpbGF0aW9uLCAndmFsaWQnLCBudWxsLFxuICAgICAgICBmYWxzZSwgJ2NoYW5uZWxzRmlyc3QnKTtcbiAgICBleHBlY3QoY29udkluZm8uYmF0Y2hTaXplKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRIZWlnaHQpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dFdpZHRoKS50b0VxdWFsKDIpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRDaGFubmVscykudG9FcXVhbCgxNik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dFNoYXBlKS50b0VxdWFsKFsxLCAxNiwgMiwgMl0pO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJXaWR0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVySGVpZ2h0KS50b0VxdWFsKDIpO1xuICAgIC8vIFNob3VsZCBwcm9kdWNlIG5vIHBhZGRpbmcuXG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8ubGVmdCkudG9CZSgwKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5yaWdodCkudG9CZSgwKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby50b3ApLnRvQmUoMCk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8uYm90dG9tKS50b0JlKDApO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnY29udl91dGlsIGNvbXB1dGVDb252M0RJbmZvIGNoYW5uZWxzRmlyc3QnLCAoKSA9PiB7XG4gIGl0KCcyeDJ4MiBjb252IG92ZXIgM3gzeDMgYXJyYXkgd2l0aCBzYW1lIHBhZCcsICgpID0+IHtcbiAgICBjb25zdCBpbkRlcHRoID0gMjtcbiAgICBjb25zdCBvdXREZXB0aCA9IDQ7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgIFsxLCBpbkRlcHRoLCAzLCAzLCAzXTtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjNESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgWzIsIDIsIDIsIGluRGVwdGgsIG91dERlcHRoXSwgc3RyaWRlLCBkaWxhdGlvbiwgJ3NhbWUnLCBmYWxzZSxcbiAgICAgICAgJ2NoYW5uZWxzRmlyc3QnKTtcbiAgICBleHBlY3QoY29udkluZm8uYmF0Y2hTaXplKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXREZXB0aCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0SGVpZ2h0KS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRXaWR0aCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0Q2hhbm5lbHMpLnRvRXF1YWwoNCk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dFNoYXBlKS50b0VxdWFsKFsxLCA0LCAzLCAzLCAzXSk7XG4gICAgLy8gU2hvdWxkIHByb2R1Y2Ugbm9uLWV2ZW4gcGFkZGluZyB3aXRoIGV4dHJhIHBpeGVsIGF0IHRoZSBiYWNrL3JpZ2h0L2JvdHRvbVxuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLmZyb250KS50b0JlKDApO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLmJhY2spLnRvQmUoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8ubGVmdCkudG9CZSgwKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5yaWdodCkudG9CZSgxKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby50b3ApLnRvQmUoMCk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8uYm90dG9tKS50b0JlKDEpO1xuICB9KTtcblxuICBpdCgnMngyeDIgY29udiBvdmVyIDN4M3gzIGFycmF5IHdpdGggdmFsaWQgcGFkJywgKCkgPT4ge1xuICAgIGNvbnN0IGluRGVwdGggPSA2O1xuICAgIGNvbnN0IG91dERlcHRoID0gMTY7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICAgIFsxLCBpbkRlcHRoLCAzLCAzLCAzXTtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjNESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgWzIsIDIsIDIsIGluRGVwdGgsIG91dERlcHRoXSwgc3RyaWRlLCBkaWxhdGlvbiwgJ3ZhbGlkJywgZmFsc2UsXG4gICAgICAgICdjaGFubmVsc0ZpcnN0Jyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0RGVwdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDE2KTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0U2hhcGUpLnRvRXF1YWwoWzEsIDE2LCAyLCAyLCAyXSk7XG4gICAgLy8gU2hvdWxkIHByb2R1Y2Ugbm8gcGFkZGluZy5cbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5mcm9udCkudG9CZSgwKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5iYWNrKS50b0JlKDApO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLmxlZnQpLnRvQmUoMCk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8ucmlnaHQpLnRvQmUoMCk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8udG9wKS50b0JlKDApO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLmJvdHRvbSkudG9CZSgwKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2NvbnZfdXRpbCBjb21wdXRlQ29udjJESW5mbyByb3VuZGluZ01vZGUnLCAoKSA9PiB7XG4gIGNvbnN0IGluQ2hhbm5lbHMgPSA2O1xuICBjb25zdCBiYXRjaFNpemUgPSAxO1xuICBjb25zdCBpblNpemUgPSA1O1xuICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9XG4gICAgICBbYmF0Y2hTaXplLCBpblNpemUsIGluU2l6ZSwgaW5DaGFubmVsc107XG4gIGNvbnN0IGZTaXplID0gMjtcbiAgY29uc3QgY2hNdWwgPSAxMjtcbiAgY29uc3Qgc3RyaWRlID0gMjtcbiAgY29uc3QgZGlsYXRpb24gPSAxO1xuICBjb25zdCBwYWQgPSAxO1xuXG4gIGl0KCdEZWZhdWx0IHRydW5jYXRlIHRoZSBvdXRwdXQgZGltZW5zaW9uIG9mIENvbnYgTGF5ZXInLCAoKSA9PiB7XG4gICAgY29uc3QgY29udkluZm8gPSBjb252X3V0aWwuY29tcHV0ZUNvbnYyREluZm8oXG4gICAgICAgIGluU2hhcGUsIFtmU2l6ZSwgZlNpemUsIGluQ2hhbm5lbHMsIGNoTXVsXSwgc3RyaWRlLCBkaWxhdGlvbiwgcGFkKTtcblxuICAgIGV4cGVjdChjb252SW5mby5vdXRTaGFwZSkudG9FcXVhbChbYmF0Y2hTaXplLCAzLCAzLCBjaE11bF0pO1xuICB9KTtcblxuICBpdCgnRmxvb3IgdGhlIG91dHB1dCBkaW1lbnNpb24gb2YgQ29udiBMYXllcicsICgpID0+IHtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjJESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgW2ZTaXplLCBmU2l6ZSwgaW5DaGFubmVscywgY2hNdWxdLCBzdHJpZGUsIGRpbGF0aW9uLCBwYWQsXG4gICAgICAgICdmbG9vcicpO1xuXG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dFNoYXBlKS50b0VxdWFsKFtiYXRjaFNpemUsIDMsIDMsIGNoTXVsXSk7XG4gIH0pO1xuXG4gIGl0KCdSb3VuZCB0aGUgb3V0cHV0IGRpbWVuc2lvbiBvZiBDb252IExheWVyJywgKCkgPT4ge1xuICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVDb252MkRJbmZvKFxuICAgICAgICBpblNoYXBlLCBbZlNpemUsIGZTaXplLCBpbkNoYW5uZWxzLCBjaE11bF0sIHN0cmlkZSwgZGlsYXRpb24sIHBhZCxcbiAgICAgICAgJ3JvdW5kJyk7XG5cbiAgICBleHBlY3QoY29udkluZm8ub3V0U2hhcGUpLnRvRXF1YWwoW2JhdGNoU2l6ZSwgNCwgNCwgY2hNdWxdKTtcbiAgfSk7XG5cbiAgaXQoJ0NlaWwgdGhlIG91dHB1dCBkaW1lbnNpb24gb2YgQ29udiBMYXllcicsICgpID0+IHtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlQ29udjJESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgW2ZTaXplLCBmU2l6ZSwgaW5DaGFubmVscywgY2hNdWxdLCBzdHJpZGUsIGRpbGF0aW9uLCBwYWQsXG4gICAgICAgICdjZWlsJyk7XG5cbiAgICBleHBlY3QoY29udkluZm8ub3V0U2hhcGUpLnRvRXF1YWwoW2JhdGNoU2l6ZSwgNCwgNCwgY2hNdWxdKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2NvbnZfdXRpbCBjb21wdXRlUG9vbEluZm8gcm91bmRpbmdNb2RlJywgKCkgPT4ge1xuICBjb25zdCBpbkNoYW5uZWxzID0gNjtcbiAgY29uc3QgYmF0Y2hTaXplID0gMTtcbiAgY29uc3QgaW5TaXplID0gNTtcbiAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPVxuICAgICAgW2JhdGNoU2l6ZSwgaW5TaXplLCBpblNpemUsIGluQ2hhbm5lbHNdO1xuICBjb25zdCBmU2l6ZSA9IDI7XG4gIGNvbnN0IHN0cmlkZSA9IDI7XG4gIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgY29uc3QgcGFkID0gMTtcblxuICBpdCgnRGVmYXVsdCB0cnVuY2F0ZSB0aGUgb3V0cHV0IGRpbWVuc2lvbiBvZiBQb29sIExheWVyJywgKCkgPT4ge1xuICAgIGNvbnN0IHBvb2xJbmZvID0gY29udl91dGlsLmNvbXB1dGVQb29sMkRJbmZvKFxuICAgICAgICBpblNoYXBlLCBbZlNpemUsIGZTaXplXSwgc3RyaWRlLCBwYWQsIGRpbGF0aW9uLCAnZmxvb3InKTtcblxuICAgIGV4cGVjdChwb29sSW5mby5vdXRTaGFwZSkudG9FcXVhbChbYmF0Y2hTaXplLCAzLCAzLCBpbkNoYW5uZWxzXSk7XG4gIH0pO1xuXG4gIGl0KCdGbG9vciB0aGUgb3V0cHV0IGRpbWVuc2lvbiBvZiBQb29sIExheWVyJywgKCkgPT4ge1xuICAgIGNvbnN0IHBvb2xJbmZvID0gY29udl91dGlsLmNvbXB1dGVQb29sMkRJbmZvKFxuICAgICAgICBpblNoYXBlLCBbZlNpemUsIGZTaXplXSwgc3RyaWRlLCBwYWQsIGRpbGF0aW9uLCAnZmxvb3InKTtcblxuICAgIGV4cGVjdChwb29sSW5mby5vdXRTaGFwZSkudG9FcXVhbChbYmF0Y2hTaXplLCAzLCAzLCBpbkNoYW5uZWxzXSk7XG4gIH0pO1xuXG4gIGl0KCdSb3VuZCB0aGUgb3V0cHV0IGRpbWVuc2lvbiBvZiBQb29sIExheWVyJywgKCkgPT4ge1xuICAgIGNvbnN0IHBvb2xJbmZvID0gY29udl91dGlsLmNvbXB1dGVQb29sMkRJbmZvKFxuICAgICAgICBpblNoYXBlLCBbZlNpemUsIGZTaXplXSwgc3RyaWRlLCBwYWQsIGRpbGF0aW9uLCAncm91bmQnKTtcblxuICAgIGV4cGVjdChwb29sSW5mby5vdXRTaGFwZSkudG9FcXVhbChbYmF0Y2hTaXplLCA0LCA0LCBpbkNoYW5uZWxzXSk7XG4gIH0pO1xuXG4gIGl0KCdDZWlsIHRoZSBvdXRwdXQgZGltZW5zaW9uIG9mIFBvb2wgTGF5ZXInLCAoKSA9PiB7XG4gICAgY29uc3QgcG9vbEluZm8gPSBjb252X3V0aWwuY29tcHV0ZVBvb2wyREluZm8oXG4gICAgICAgIGluU2hhcGUsIFtmU2l6ZSwgZlNpemVdLCBzdHJpZGUsIHBhZCwgZGlsYXRpb24sICdjZWlsJyk7XG5cbiAgICBleHBlY3QocG9vbEluZm8ub3V0U2hhcGUpLnRvRXF1YWwoW2JhdGNoU2l6ZSwgNCwgNCwgaW5DaGFubmVsc10pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnY29udl91dGlsIGNvbXB1dGVQb29sM2RJbmZvJywgKCkgPT4ge1xuICBpdCgnMXgxeDEgcG9vbCBvdmVyIDF4MXgxIGFycmF5IHdpdGggdmFsaWQgcGFkJywgKCkgPT4ge1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgMSwgMSwgMSwgMV07XG4gICAgY29uc3QgZmlsdGVyU2l6ZSA9IDE7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBkaWxhdGlvbiA9IDE7XG4gICAgY29uc3QgY29udkluZm8gPSBjb252X3V0aWwuY29tcHV0ZVBvb2wzREluZm8oXG4gICAgICAgIGluU2hhcGUsIGZpbHRlclNpemUsIHN0cmlkZSwgZGlsYXRpb24sICd2YWxpZCcpO1xuICAgIGV4cGVjdChjb252SW5mby5iYXRjaFNpemUpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dERlcHRoKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRIZWlnaHQpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dFdpZHRoKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRDaGFubmVscykudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVyRGVwdGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlcldpZHRoKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJIZWlnaHQpLnRvRXF1YWwoMSk7XG4gIH0pO1xuXG4gIGl0KCcxeDF4MSBwb29sIG92ZXIgM3gzeDMgYXJyYXkgd2l0aCB2YWxpZCBwYWQnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCAzLCAzLCAzLCAxXTtcbiAgICBjb25zdCBmaWx0ZXJTaXplID0gMTtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlUG9vbDNESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgZmlsdGVyU2l6ZSwgc3RyaWRlLCBkaWxhdGlvbiwgJ3ZhbGlkJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0RGVwdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJEZXB0aCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVyV2lkdGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlckhlaWdodCkudG9FcXVhbCgxKTtcbiAgfSk7XG5cbiAgaXQoJzJ4MngyIHBvb2wgb3ZlciAzeDN4MyBhcnJheSB3aXRoIHNhbWUgcGFkJywgKCkgPT4ge1xuICAgIGNvbnN0IGluU2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMSwgMywgMywgMywgMV07XG4gICAgY29uc3QgZmlsdGVyU2l6ZSA9IDI7XG4gICAgY29uc3Qgc3RyaWRlID0gMTtcbiAgICBjb25zdCBkaWxhdGlvbiA9IDE7XG4gICAgY29uc3QgY29udkluZm8gPSBjb252X3V0aWwuY29tcHV0ZVBvb2wzREluZm8oXG4gICAgICAgIGluU2hhcGUsIGZpbHRlclNpemUsIHN0cmlkZSwgZGlsYXRpb24sICdzYW1lJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0RGVwdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJEZXB0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVyV2lkdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlckhlaWdodCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby50b3ApLnRvRXF1YWwoMCk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8uYm90dG9tKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLmxlZnQpLnRvRXF1YWwoMCk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8ucmlnaHQpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8uZnJvbnQpLnRvRXF1YWwoMCk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8uYmFjaykudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby50eXBlKS50b0VxdWFsKCdTQU1FJyk7XG4gIH0pO1xuXG4gIGl0KCcyeDJ4MiBwb29sIG92ZXIgM3gzeDMgYXJyYXkgd2l0aCB2YWxpZCBwYWQnLCAoKSA9PiB7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCAzLCAzLCAzLCAxXTtcbiAgICBjb25zdCBmaWx0ZXJTaXplID0gMjtcbiAgICBjb25zdCBzdHJpZGUgPSAxO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlUG9vbDNESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgZmlsdGVyU2l6ZSwgc3RyaWRlLCBkaWxhdGlvbiwgJ3ZhbGlkJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0RGVwdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJEZXB0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVyV2lkdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlckhlaWdodCkudG9FcXVhbCgyKTtcbiAgfSk7XG5cbiAgaXQoJzJ4MngyIHBvb2wgb3ZlciA0eDR4NCBhcnJheSB3aXRoIHZhbGlkIHBhZCwgc3RyaWRlIDInLCAoKSA9PiB7XG4gICAgY29uc3QgaW5TaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsxLCA0LCA0LCA0LCAxXTtcbiAgICBjb25zdCBmaWx0ZXJTaXplID0gMjtcbiAgICBjb25zdCBzdHJpZGUgPSAyO1xuICAgIGNvbnN0IGRpbGF0aW9uID0gMTtcbiAgICBjb25zdCBjb252SW5mbyA9IGNvbnZfdXRpbC5jb21wdXRlUG9vbDNESW5mbyhcbiAgICAgICAgaW5TaGFwZSwgZmlsdGVyU2l6ZSwgc3RyaWRlLCBkaWxhdGlvbiwgJ3ZhbGlkJyk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmJhdGNoU2l6ZSkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0RGVwdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dEhlaWdodCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0V2lkdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLm91dENoYW5uZWxzKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJEZXB0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVyV2lkdGgpLnRvRXF1YWwoMik7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlckhlaWdodCkudG9FcXVhbCgyKTtcbiAgfSk7XG5cbiAgaXQoJzJ4MngyIHBvb2wgb3ZlciAzeDN4MyBhcnJheSB3aXRoIHZhbGlkIHBhZCwgZGlsYXRpb24gMicsICgpID0+IHtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDMsIDMsIDMsIDFdO1xuICAgIGNvbnN0IGZpbHRlclNpemUgPSAyO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGlsYXRpb24gPSAyO1xuICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVQb29sM0RJbmZvKFxuICAgICAgICBpblNoYXBlLCBmaWx0ZXJTaXplLCBzdHJpZGUsIGRpbGF0aW9uLCAndmFsaWQnKTtcbiAgICBleHBlY3QoY29udkluZm8uYmF0Y2hTaXplKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXREZXB0aCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0SGVpZ2h0KS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRXaWR0aCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0Q2hhbm5lbHMpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlckRlcHRoKS50b0VxdWFsKDMpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJXaWR0aCkudG9FcXVhbCgzKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVySGVpZ2h0KS50b0VxdWFsKDMpO1xuICB9KTtcblxuICBpdCgnMngyeDIgcG9vbCBvdmVyIDN4M3gzIGFycmF5IHdpdGggcGFkIDEsIHJvdW5kaW5nTW9kZSBmbG9vcicsICgpID0+IHtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDMsIDMsIDMsIDFdO1xuICAgIGNvbnN0IGZpbHRlclNpemUgPSAyO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVQb29sM0RJbmZvKFxuICAgICAgICBpblNoYXBlLCBmaWx0ZXJTaXplLCBzdHJpZGUsIGRpbGF0aW9uLCAxLCAnZmxvb3InKTtcbiAgICBleHBlY3QoY29udkluZm8uYmF0Y2hTaXplKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXREZXB0aCkudG9FcXVhbCg0KTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0SGVpZ2h0KS50b0VxdWFsKDQpO1xuICAgIGV4cGVjdChjb252SW5mby5vdXRXaWR0aCkudG9FcXVhbCg0KTtcbiAgICBleHBlY3QoY29udkluZm8ub3V0Q2hhbm5lbHMpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLmVmZmVjdGl2ZUZpbHRlckRlcHRoKS50b0VxdWFsKDIpO1xuICAgIGV4cGVjdChjb252SW5mby5lZmZlY3RpdmVGaWx0ZXJXaWR0aCkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoY29udkluZm8uZWZmZWN0aXZlRmlsdGVySGVpZ2h0KS50b0VxdWFsKDIpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnRvcCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5ib3R0b20pLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KGNvbnZJbmZvLnBhZEluZm8ubGVmdCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5yaWdodCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5mcm9udCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QoY29udkluZm8ucGFkSW5mby5iYWNrKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChjb252SW5mby5wYWRJbmZvLnR5cGUpLnRvRXF1YWwoJ05VTUJFUicpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIHVua25vd24gZGF0YUZvcm1hdCcsICgpID0+IHtcbiAgICBjb25zdCBpblNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzEsIDMsIDMsIDMsIDFdO1xuICAgIGNvbnN0IGZpbHRlclNpemUgPSAyO1xuICAgIGNvbnN0IHN0cmlkZSA9IDE7XG4gICAgY29uc3QgZGlsYXRpb24gPSAxO1xuICAgIGNvbnN0IGZha2VEYXRhRm9ybWF0ID0gJ2Zha2VGb3JtYXQnIGFzICdOREhXQycgfCAnTkNESFcnO1xuICAgIGV4cGVjdChcbiAgICAgICAgKCkgPT4gY29udl91dGlsLmNvbXB1dGVQb29sM0RJbmZvKFxuICAgICAgICAgICAgaW5TaGFwZSwgZmlsdGVyU2l6ZSwgc3RyaWRlLCBkaWxhdGlvbiwgMSwgJ2Zsb29yJywgZmFrZURhdGFGb3JtYXQpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdjb252X3V0aWwgY29udmVydENvbnYyRERhdGFGb3JtYXQnLCAoKSA9PiB7XG4gIGl0KCdjb252ZXJ0IE5IV0MgdG8gY2hhbm5lbHNMYXN0JywgKCkgPT4ge1xuICAgIGNvbnN0IGRhdGFGb3JtYXQ6ICdOSFdDJ3wnTkNIVycgPSAnTkhXQyc7XG4gICAgY29uc3QgJGRhdGFGb3JtYXQgPSBjb252X3V0aWwuY29udmVydENvbnYyRERhdGFGb3JtYXQoZGF0YUZvcm1hdCk7XG4gICAgZXhwZWN0KCRkYXRhRm9ybWF0KS50b0VxdWFsKCdjaGFubmVsc0xhc3QnKTtcbiAgfSk7XG5cbiAgaXQoJ2NvbnZlcnQgTkNIVyB0byBjaGFubmVsc0ZpcnN0JywgKCkgPT4ge1xuICAgIGNvbnN0IGRhdGFGb3JtYXQ6ICdOSFdDJ3wnTkNIVycgPSAnTkNIVyc7XG4gICAgY29uc3QgJGRhdGFGb3JtYXQgPSBjb252X3V0aWwuY29udmVydENvbnYyRERhdGFGb3JtYXQoZGF0YUZvcm1hdCk7XG4gICAgZXhwZWN0KCRkYXRhRm9ybWF0KS50b0VxdWFsKCdjaGFubmVsc0ZpcnN0Jyk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgdW5rbm93biBkYXRhRm9ybWF0JywgKCkgPT4ge1xuICAgIGNvbnN0IGRhdGFGb3JtYXQgPSAnRmFrZUZvcm1hdCc7XG4gICAgZXhwZWN0KFxuICAgICAgICAoKSA9PiBjb252X3V0aWwuY29udmVydENvbnYyRERhdGFGb3JtYXQoZGF0YUZvcm1hdCBhcyAnTkhXQycgfCAnTkNIVycpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xufSk7XG4iXX0=