"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeIntoCompressedBase64 = exports.decodeFromCompressedBase64 = exports.decompress = void 0;
/*
 * This is a TypeScript port of the original Java version, which was written by
 * Gil Tene as described in
 * https://github.com/HdrHistogram/HdrHistogram
 * and released to the public domain, as explained at
 * http://creativecommons.org/publicdomain/zero/1.0/
 */
const JsHistogram_1 = require("./JsHistogram");
const ByteBuffer_1 = require("./ByteBuffer");
const wasm_1 = require("./wasm");
// @ts-ignore
const base64 = require("base64-js");
const JsHistogram_encoding_1 = require("./JsHistogram.encoding");
const V2CompressedEncodingCookieBase = 0x1c849304;
const compressedEncodingCookie = V2CompressedEncodingCookieBase | 0x10; // LSBit of wordsize byte indicates TLZE Encoding
function decompress(data) {
    const buffer = new ByteBuffer_1.default(data);
    const initialTargetPosition = buffer.position;
    const cookie = buffer.getInt32();
    if ((cookie & ~0xf0) !== V2CompressedEncodingCookieBase) {
        throw new Error("Encoding not supported, only V2 is supported");
    }
    const lengthOfCompressedContents = buffer.getInt32();
    const uncompressedBuffer = JsHistogram_encoding_1.inflate(buffer.data.slice(initialTargetPosition + 8, initialTargetPosition + 8 + lengthOfCompressedContents));
    return uncompressedBuffer;
}
exports.decompress = decompress;
exports.decodeFromCompressedBase64 = (base64String, bitBucketSize = 32, useWebAssembly = false, minBarForHighestTrackableValue = 0) => {
    const data = base64.toByteArray(base64String.trim());
    const uncompressedData = decompress(data);
    if (useWebAssembly) {
        return wasm_1.WasmHistogram.decode(uncompressedData, bitBucketSize, minBarForHighestTrackableValue);
    }
    return JsHistogram_1.JsHistogram.decode(uncompressedData, bitBucketSize, minBarForHighestTrackableValue);
};
function encodeWasmIntoCompressedBase64(compressionLevel) {
    const compressionOptions = compressionLevel
        ? { level: compressionLevel }
        : {};
    const self = this;
    const targetBuffer = ByteBuffer_1.default.allocate();
    targetBuffer.putInt32(compressedEncodingCookie);
    const uncompressedData = self.encode();
    const compressedData = JsHistogram_encoding_1.deflate(uncompressedData, compressionOptions);
    targetBuffer.putInt32(compressedData.byteLength);
    targetBuffer.putArray(compressedData);
    return base64.fromByteArray(targetBuffer.data);
}
wasm_1.WasmHistogram.prototype.encodeIntoCompressedBase64 = encodeWasmIntoCompressedBase64;
exports.encodeIntoCompressedBase64 = (histogram, compressionLevel) => {
    if (histogram instanceof wasm_1.WasmHistogram) {
        return histogram.encodeIntoCompressedBase64(compressionLevel);
    }
    if (histogram instanceof JsHistogram_1.JsHistogram) {
        return histogram.encodeIntoCompressedBase64(compressionLevel);
    }
    throw new Error("Unsupported Histogram implementation");
};
//# sourceMappingURL=encoding.js.map