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
// Please make sure the shaker key in makeShaderKey in gpgpu_math.ts is well
// mapped if any shader source code is changed in this file.
import { backend_util, util } from '@tensorflow/tfjs-core';
const { getBroadcastDims } = backend_util;
import { getGlslDifferences } from './glsl_version';
import * as shader_util from './shader_compiler_util';
export function makeShader(inputsInfo, outputShape, program) {
    const prefixSnippets = [];
    inputsInfo.forEach(x => {
        const size = util.sizeFromShape(x.shapeInfo.logicalShape);
        // Snippet when we decided to upload the values as uniform.
        if (x.shapeInfo.isUniform) {
            prefixSnippets.push(`uniform float ${x.name}${size > 1 ? `[${size}]` : ''};`);
        }
        else {
            prefixSnippets.push(`uniform sampler2D ${x.name};`);
            prefixSnippets.push(`uniform int offset${x.name};`);
        }
        if (program.enableShapeUniforms) {
            const { uniformShape } = getUniformInfoFromShape(program.packedInputs, x.shapeInfo.logicalShape, x.shapeInfo.texShape);
            switch (uniformShape.length) {
                case 1:
                    prefixSnippets.push(`uniform int ${x.name}Shape;`);
                    break;
                case 2:
                    prefixSnippets.push(`uniform ivec2 ${x.name}Shape;`);
                    break;
                case 3:
                    prefixSnippets.push(`uniform ivec3 ${x.name}Shape;`);
                    break;
                case 4:
                    prefixSnippets.push(`uniform ivec4 ${x.name}Shape;`);
                    break;
                default:
                    break;
            }
            prefixSnippets.push(`uniform ivec2 ${x.name}TexShape;`);
        }
    });
    if (program.enableShapeUniforms) {
        switch (outputShape.logicalShape.length) {
            case 1:
                prefixSnippets.push(`uniform int outShape;`);
                break;
            case 2:
                prefixSnippets.push(`uniform ivec2 outShape;`);
                prefixSnippets.push(`uniform int outShapeStrides;`);
                break;
            case 3:
                prefixSnippets.push(`uniform ivec3 outShape;`);
                prefixSnippets.push(`uniform ivec2 outShapeStrides;`);
                break;
            case 4:
                prefixSnippets.push(`uniform ivec4 outShape;`);
                prefixSnippets.push(`uniform ivec3 outShapeStrides;`);
                break;
            default:
                break;
        }
        prefixSnippets.push(`uniform ivec2 outTexShape;`);
    }
    if (program.customUniforms) {
        program.customUniforms.forEach((d) => {
            prefixSnippets.push(`uniform ${d.type} ${d.name}${d.arrayIndex ? `[${d.arrayIndex}]` : ''};`);
        });
    }
    const inputPrefixSnippet = prefixSnippets.join('\n');
    const inputSamplingSnippet = inputsInfo
        .map(x => getInputSamplingSnippet(x, outputShape, program.packedInputs, program.enableShapeUniforms))
        .join('\n');
    const outTexShape = outputShape.texShape;
    const glsl = getGlslDifferences();
    const floatTextureSampleSnippet = getFloatTextureSampleSnippet(glsl);
    let outputSamplingSnippet;
    let floatTextureSetOutputSnippet;
    let shaderPrefix = getShaderPrefix(glsl);
    if (outputShape.isPacked) {
        outputSamplingSnippet = getPackedOutputSamplingSnippet(outputShape.logicalShape, outTexShape, program.enableShapeUniforms);
        floatTextureSetOutputSnippet = getFloatTextureSetRGBASnippet(glsl);
    }
    else {
        outputSamplingSnippet = getOutputSamplingSnippet(outputShape.logicalShape, outTexShape, program.enableShapeUniforms);
        floatTextureSetOutputSnippet = getFloatTextureSetRSnippet(glsl);
    }
    if (program.packedInputs) {
        shaderPrefix += SHADER_PACKED_PREFIX;
    }
    const source = [
        shaderPrefix, floatTextureSampleSnippet, floatTextureSetOutputSnippet,
        inputPrefixSnippet, outputSamplingSnippet, inputSamplingSnippet,
        program.userCode
    ].join('\n');
    return source;
}
function getSamplerFromInInfo(inInfo, enableShapeUniforms = false) {
    const shape = inInfo.shapeInfo.logicalShape;
    switch (shape.length) {
        case 0:
            return getSamplerScalar(inInfo, enableShapeUniforms);
        case 1:
            return getSampler1D(inInfo, enableShapeUniforms);
        case 2:
            return getSampler2D(inInfo, enableShapeUniforms);
        case 3:
            return getSampler3D(inInfo, enableShapeUniforms);
        case 4:
            return getSampler4D(inInfo, enableShapeUniforms);
        case 5:
            return getSampler5D(inInfo);
        case 6:
            return getSampler6D(inInfo);
        default:
            throw new Error(`${shape.length}-D input sampling` +
                ` is not yet supported`);
    }
}
function getPackedSamplerFromInInfo(inInfo, enableShapeUniforms) {
    const shape = inInfo.shapeInfo.logicalShape;
    switch (shape.length) {
        case 0:
            return getPackedSamplerScalar(inInfo);
        case 1:
            return getPackedSampler1D(inInfo, enableShapeUniforms);
        case 2:
            return getPackedSampler2D(inInfo, enableShapeUniforms);
        case 3:
            return getPackedSampler3D(inInfo, enableShapeUniforms);
        default:
            return getPackedSamplerND(inInfo, enableShapeUniforms);
    }
}
function getInputSamplingSnippet(inInfo, outShapeInfo, usesPackedTextures = false, enableShapeUniforms) {
    let res = '';
    if (usesPackedTextures) {
        res += getPackedSamplerFromInInfo(inInfo, enableShapeUniforms);
    }
    else {
        res += getSamplerFromInInfo(inInfo, enableShapeUniforms);
    }
    const inShape = inInfo.shapeInfo.logicalShape;
    const outShape = outShapeInfo.logicalShape;
    if (inShape.length <= outShape.length) {
        if (usesPackedTextures) {
            res += getPackedSamplerAtOutputCoords(inInfo, outShapeInfo);
        }
        else {
            res += getSamplerAtOutputCoords(inInfo, outShapeInfo);
        }
    }
    return res;
}
function getPackedOutputSamplingSnippet(outShape, outTexShape, enableShapeUniforms) {
    switch (outShape.length) {
        case 0:
            return getOutputScalarCoords();
        case 1:
            return getOutputPacked1DCoords(outShape, outTexShape, enableShapeUniforms);
        case 2:
            return getOutputPacked2DCoords(outShape, outTexShape, enableShapeUniforms);
        case 3:
            return getOutputPacked3DCoords(outShape, outTexShape, enableShapeUniforms);
        default:
            return getOutputPackedNDCoords(outShape, outTexShape, enableShapeUniforms);
    }
}
function getOutputSamplingSnippet(outShape, outTexShape, enableShapeUniforms) {
    switch (outShape.length) {
        case 0:
            return getOutputScalarCoords();
        case 1:
            return getOutput1DCoords(outShape, outTexShape, enableShapeUniforms);
        case 2:
            return getOutput2DCoords(outShape, outTexShape, enableShapeUniforms);
        case 3:
            return getOutput3DCoords(outShape, outTexShape, enableShapeUniforms);
        case 4:
            return getOutput4DCoords(outShape, outTexShape, enableShapeUniforms);
        case 5:
            return getOutput5DCoords(outShape, outTexShape);
        case 6:
            return getOutput6DCoords(outShape, outTexShape);
        default:
            throw new Error(`${outShape.length}-D output sampling is not yet supported`);
    }
}
function getFloatTextureSampleSnippet(glsl) {
    return `
    float sampleTexture(sampler2D textureSampler, vec2 uv) {
      return ${glsl.texture2D}(textureSampler, uv).r;
    }
  `;
}
function getFloatTextureSetRSnippet(glsl) {
    return `
    void setOutput(float val) {
      ${glsl.output} = vec4(val, 0, 0, 0);
    }
  `;
}
function getFloatTextureSetRGBASnippet(glsl) {
    return `
    void setOutput(vec4 val) {
      ${glsl.output} = val;
    }
  `;
}
function getShaderPrefix(glsl) {
    const SHADER_PREFIX = `${glsl.version}
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    ${glsl.varyingFs} vec2 resultUV;
    ${glsl.defineOutput}
    const vec2 halfCR = vec2(0.5, 0.5);

    struct ivec5
    {
      int x;
      int y;
      int z;
      int w;
      int u;
    };

    struct ivec6
    {
      int x;
      int y;
      int z;
      int w;
      int u;
      int v;
    };

    uniform float NAN;
    ${glsl.defineSpecialNaN}
    ${glsl.defineSpecialInf}
    ${glsl.defineRound}

    int imod(int x, int y) {
      return x - y * (x / y);
    }

    int idiv(int a, int b, float sign) {
      int res = a / b;
      int mod = imod(a, b);
      if (sign < 0. && mod != 0) {
        res -= 1;
      }
      return res;
    }

    //Based on the work of Dave Hoskins
    //https://www.shadertoy.com/view/4djSRW
    #define HASHSCALE1 443.8975
    float random(float seed){
      vec2 p = resultUV * seed;
      vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
      p3 += dot(p3, p3.yzx + 19.19);
      return fract((p3.x + p3.y) * p3.z);
    }

    ${SAMPLE_1D_SNIPPET}
    ${SAMPLE_2D_SNIPPET}
    ${SAMPLE_3D_SNIPPET}
  `;
    return SHADER_PREFIX;
}
const SAMPLE_1D_SNIPPET = `
vec2 uvFromFlat(int texNumR, int texNumC, int index) {
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {
  int texelIndex = index / 2;
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`;
const SAMPLE_2D_SNIPPET = `
vec2 packedUVfrom2D(int texelsInLogicalRow, int texNumR,
  int texNumC, int row, int col) {
  int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`;
const SAMPLE_3D_SNIPPET = `
vec2 packedUVfrom3D(int texNumR, int texNumC,
    int texelsInBatch, int texelsInLogicalRow, int b,
    int row, int col) {
  int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`;
const SHADER_PACKED_PREFIX = `
  float getChannel(vec4 frag, vec2 innerDims) {
    vec2 modCoord = mod(innerDims, 2.);
    return modCoord.x == 0. ?
      (modCoord.y == 0. ? frag.r : frag.g) :
      (modCoord.y == 0. ? frag.b : frag.a);
  }
  float getChannel(vec4 frag, int dim) {
    float modCoord = mod(float(dim), 2.);
    return modCoord == 0. ? frag.r : frag.g;
  }
`;
function getOutputScalarCoords() {
    return `
    int getOutputCoords() {
      return 0;
    }
  `;
}
function getOutputPacked1DCoords(shape, texShape, enableShapeUniforms) {
    const packedTexShape = [Math.ceil(texShape[0] / 2), Math.ceil(texShape[1] / 2)];
    if (packedTexShape[0] === 1) {
        if (enableShapeUniforms) {
            return `
      int getOutputCoords() {
        return 2 * int(resultUV.x * ceil(float(outTexShape[1]) / 2.0));
      }
    `;
        }
        return `
      int getOutputCoords() {
        return 2 * int(resultUV.x * ${packedTexShape[1]}.0);
      }
    `;
    }
    if (packedTexShape[1] === 1) {
        if (enableShapeUniforms) {
            return `
      int getOutputCoords() {
        return 2 * int(resultUV.y * ceil(float(outTexShape[0]) / 2.0));
      }
    `;
        }
        return `
      int getOutputCoords() {
        return 2 * int(resultUV.y * ${packedTexShape[0]}.0);
      }
    `;
    }
    if (enableShapeUniforms) {
        return `
    int getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      return 2 * (resTexRC.x * packedTexShape[1] + resTexRC.y);
    }
  `;
    }
    return `
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${packedTexShape[0]}, ${packedTexShape[1]}));
      return 2 * (resTexRC.x * ${packedTexShape[1]} + resTexRC.y);
    }
  `;
}
function getOutput1DCoords(shape, texShape, enableShapeUniforms) {
    if (texShape[0] === 1) {
        if (enableShapeUniforms) {
            return `
      int getOutputCoords() {
        return int(resultUV.x * float(outTexShape[1]));
      }
    `;
        }
        return `
      int getOutputCoords() {
        return int(resultUV.x * ${texShape[1]}.0);
      }
    `;
    }
    if (texShape[1] === 1) {
        if (enableShapeUniforms) {
            return `
      int getOutputCoords() {
        return int(resultUV.y * float(outTexShape[0]));
      }
    `;
        }
        return `
      int getOutputCoords() {
        return int(resultUV.y * ${texShape[0]}.0);
      }
    `;
    }
    if (enableShapeUniforms) {
        return `
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      return resTexRC.x * outTexShape[1] + resTexRC.y;
    }
  `;
    }
    return `
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${texShape[0]}, ${texShape[1]}));
      return resTexRC.x * ${texShape[1]} + resTexRC.y;
    }
  `;
}
function getOutputPacked3DCoords(shape, texShape, enableShapeUniforms) {
    if (enableShapeUniforms) {
        return `
    ivec3 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      int texelsInLogicalRow = int(ceil(float(outShape[2]) / 2.0));
      int texelsInBatch = texelsInLogicalRow * int(ceil(float(outShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;

      int b = index / texelsInBatch;
      index -= b * texelsInBatch;

      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec3(b, r, c);
    }
  `;
    }
    const packedTexShape = [Math.ceil(texShape[0] / 2), Math.ceil(texShape[1] / 2)];
    const texelsInLogicalRow = Math.ceil(shape[2] / 2);
    const texelsInBatch = texelsInLogicalRow * Math.ceil(shape[1] / 2);
    return `
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${packedTexShape[0]}, ${packedTexShape[1]}));
      int index = resTexRC.x * ${packedTexShape[1]} + resTexRC.y;

      int b = index / ${texelsInBatch};
      index -= b * ${texelsInBatch};

      int r = 2 * (index / ${texelsInLogicalRow});
      int c = imod(index, ${texelsInLogicalRow}) * 2;

      return ivec3(b, r, c);
    }
  `;
}
function getOutput3DCoords(shape, texShape, enableShapeUniforms) {
    if (enableShapeUniforms) {
        const coordsFromIndexSnippet = shader_util.getOutputLogicalCoordinatesFromFlatIndexByUniform(['r', 'c', 'd'], shape);
        return `
  ivec3 getOutputCoords() {
    ivec2 resTexRC = ivec2(resultUV.yx *
                           vec2(outTexShape[0], outTexShape[1]));
    int index = resTexRC.x * outTexShape[1] + resTexRC.y;
    ${coordsFromIndexSnippet}
    return ivec3(r, c, d);
  }
`;
    }
    const coordsFromIndexSnippet = shader_util.getLogicalCoordinatesFromFlatIndex(['r', 'c', 'd'], shape);
    return `
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${texShape[0]}, ${texShape[1]}));
      int index = resTexRC.x * ${texShape[1]} + resTexRC.y;
      ${coordsFromIndexSnippet}
      return ivec3(r, c, d);
    }
  `;
}
function getOutputPackedNDCoords(shape, texShape, enableShapeUniforms) {
    if (enableShapeUniforms) {
        // TODO: support 5d and 6d
        return `
    ivec4 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;

      int texelsInLogicalRow = int(ceil(float(outShape[3]) / 2.0));
      int texelsInBatch = texelsInLogicalRow * int(ceil(float(outShape[2]) / 2.0));
      int texelsInBatchN = texelsInBatch * outShape[1];

      int b2 = index / texelsInBatchN;
      index -= b2 * texelsInBatchN;

      int b = index / texelsInBatch;
      index -= b * texelsInBatch;

      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec4(b2, b, r, c);
    }
  `;
    }
    const packedTexShape = [Math.ceil(texShape[0] / 2), Math.ceil(texShape[1] / 2)];
    const texelsInLogicalRow = Math.ceil(shape[shape.length - 1] / 2);
    const texelsInBatch = texelsInLogicalRow * Math.ceil(shape[shape.length - 2] / 2);
    let texelsInBatchN = texelsInBatch;
    let batches = ``;
    let coords = 'b, r, c';
    for (let b = 2; b < shape.length - 1; b++) {
        texelsInBatchN *= shape[shape.length - b - 1];
        batches = `
      int b${b} = index / ${texelsInBatchN};
      index -= b${b} * ${texelsInBatchN};
    ` + batches;
        coords = `b${b}, ` + coords;
    }
    return `
    ivec${shape.length} getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${packedTexShape[0]}, ${packedTexShape[1]}));
      int index = resTexRC.x * ${packedTexShape[1]} + resTexRC.y;

      ${batches}

      int b = index / ${texelsInBatch};
      index -= b * ${texelsInBatch};

      int r = 2 * (index / ${texelsInLogicalRow});
      int c = imod(index, ${texelsInLogicalRow}) * 2;

      return ivec${shape.length}(${coords});
    }
  `;
}
function getOutput4DCoords(shape, texShape, enableShapeUniforms) {
    if (enableShapeUniforms) {
        const coordsFromIndexSnippet = shader_util.getOutputLogicalCoordinatesFromFlatIndexByUniform(['r', 'c', 'd', 'd2'], shape);
        return `
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      ${coordsFromIndexSnippet}
      return ivec4(r, c, d, d2);
    }
  `;
    }
    const coordsFromIndexSnippet = shader_util.getLogicalCoordinatesFromFlatIndex(['r', 'c', 'd', 'd2'], shape);
    return `
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${texShape[0]}, ${texShape[1]}));
      int index = resTexRC.x * ${texShape[1]} + resTexRC.y;
      ${coordsFromIndexSnippet}
      return ivec4(r, c, d, d2);
    }
  `;
}
function getOutput5DCoords(shape, texShape) {
    const coordsFromIndexSnippet = shader_util.getLogicalCoordinatesFromFlatIndex(['r', 'c', 'd', 'd2', 'd3'], shape);
    return `
    ivec5 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx * vec2(${texShape[0]},
                             ${texShape[1]}));

      int index = resTexRC.x * ${texShape[1]} + resTexRC.y;

      ${coordsFromIndexSnippet}

      ivec5 outShape = ivec5(r, c, d, d2, d3);
      return outShape;
    }
  `;
}
function getOutput6DCoords(shape, texShape) {
    const coordsFromIndexSnippet = shader_util.getLogicalCoordinatesFromFlatIndex(['r', 'c', 'd', 'd2', 'd3', 'd4'], shape);
    return `
    ivec6 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${texShape[0]}, ${texShape[1]}));
      int index = resTexRC.x * ${texShape[1]} + resTexRC.y;

      ${coordsFromIndexSnippet}

      ivec6 result = ivec6(r, c, d, d2, d3, d4);
      return result;
    }
  `;
}
function getOutputPacked2DCoords(shape, texShape, enableShapeUniforms) {
    const packedTexShape = [Math.ceil(texShape[0] / 2), Math.ceil(texShape[1] / 2)];
    if (util.arraysEqual(shape, texShape)) {
        if (enableShapeUniforms) {
            return `
      ivec2 getOutputCoords() {
        ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
        return 2 * ivec2(resultUV.yx * vec2(packedTexShape[0], packedTexShape[1]));
      }
    `;
        }
        return `
      ivec2 getOutputCoords() {
        return 2 * ivec2(resultUV.yx * vec2(${packedTexShape[0]}, ${packedTexShape[1]}));
      }
    `;
    }
    // texels needed to accommodate a logical row
    const texelsInLogicalRow = Math.ceil(shape[1] / 2);
    /**
     * getOutputCoords
     *
     * resTexRC: The rows and columns of the texels. If you move over one
     * texel to the right in the packed texture, you are moving over one column
     * (not two).
     *
     * index: The texel index
     */
    if (enableShapeUniforms) {
        return `
    ivec2 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      int texelsInLogicalRow = int(ceil(float(outShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));

      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;
      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec2(r, c);
    }
  `;
    }
    return `
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${packedTexShape[0]}, ${packedTexShape[1]}));

      int index = resTexRC.x * ${packedTexShape[1]} + resTexRC.y;
      int r = 2 * (index / ${texelsInLogicalRow});
      int c = imod(index, ${texelsInLogicalRow}) * 2;

      return ivec2(r, c);
    }
  `;
}
function getOutput2DCoords(shape, texShape, enableShapeUniforms) {
    if (util.arraysEqual(shape, texShape)) {
        if (enableShapeUniforms) {
            return `
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(outTexShape[0], outTexShape[1]));
      }
    `;
        }
        return `
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(${texShape[0]}, ${texShape[1]}));
      }
    `;
    }
    if (shape[1] === 1) {
        if (enableShapeUniforms) {
            return `
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(index, 0);
      }
    `;
        }
        return `
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${texShape[0]}, ${texShape[1]}));
        int index = resTexRC.x * ${texShape[1]} + resTexRC.y;
        return ivec2(index, 0);
      }
    `;
    }
    if (shape[0] === 1) {
        if (enableShapeUniforms) {
            return `
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(0, index);
      }
    `;
        }
        return `
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${texShape[0]}, ${texShape[1]}));
        int index = resTexRC.x * ${texShape[1]} + resTexRC.y;
        return ivec2(0, index);
      }
    `;
    }
    if (enableShapeUniforms) {
        return `
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      int r = index / outShape[1];
      int c = index - r * outShape[1];
      return ivec2(r, c);
    }
  `;
    }
    return `
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${texShape[0]}, ${texShape[1]}));
      int index = resTexRC.x * ${texShape[1]} + resTexRC.y;
      int r = index / ${shape[1]};
      int c = index - r * ${shape[1]};
      return ivec2(r, c);
    }
  `;
}
function getFlatOffsetUniformName(texName) {
    return `offset${texName}`;
}
function getPackedSamplerScalar(inputInfo) {
    const texName = inputInfo.name;
    const funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    const glsl = getGlslDifferences();
    return `
    vec4 ${funcName}() {
      return ${glsl.texture2D}(${texName}, halfCR);
    }
  `;
}
function getSamplerScalar(inputInfo, enableShapeUniforms) {
    const texName = inputInfo.name;
    const funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    if (inputInfo.shapeInfo.isUniform) {
        return `float ${funcName}() {return ${texName};}`;
    }
    const [texNumR, texNumC] = inputInfo.shapeInfo.texShape;
    if (texNumR === 1 && texNumC === 1) {
        return `
      float ${funcName}() {
        return sampleTexture(${texName}, halfCR);
      }
    `;
    }
    const offset = getFlatOffsetUniformName(texName);
    if (enableShapeUniforms) {
        return `
    float ${funcName}() {
      vec2 uv = uvFromFlat(${texName}TexShape[0], ${texName}TexShape[1], ${offset});
      return sampleTexture(${texName}, uv);
    }
  `;
    }
    const [tNumR, tNumC] = inputInfo.shapeInfo.texShape;
    return `
    float ${funcName}() {
      vec2 uv = uvFromFlat(${tNumR}, ${tNumC}, ${offset});
      return sampleTexture(${texName}, uv);
    }
  `;
}
function getPackedSampler1D(inputInfo, enableShapeUniforms) {
    const texName = inputInfo.name;
    const funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    const texShape = inputInfo.shapeInfo.texShape;
    const glsl = getGlslDifferences();
    if (enableShapeUniforms) {
        return `
    vec4 ${funcName}(int index) {
      ivec2 packedTexShape = ivec2(ceil(float(${texName}TexShape[0]) / 2.0), ceil(float(${texName}TexShape[1]) / 2.0));
      vec2 uv = packedUVfrom1D(
        packedTexShape[0], packedTexShape[1], index);
      return ${glsl.texture2D}(${texName}, uv);
    }
  `;
    }
    const packedTexShape = [Math.ceil(texShape[0] / 2), Math.ceil(texShape[1] / 2)];
    return `
    vec4 ${funcName}(int index) {
      vec2 uv = packedUVfrom1D(
        ${packedTexShape[0]}, ${packedTexShape[1]}, index);
      return ${glsl.texture2D}(${texName}, uv);
    }
  `;
}
function getSampler1D(inputInfo, enableShapeUniforms) {
    const texName = inputInfo.name;
    const funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    if (inputInfo.shapeInfo.isUniform) {
        // Uniform arrays will be less than 65505 (no risk of float16 overflow).
        return `
      float ${funcName}(int index) {
        ${getUniformSampler(inputInfo)}
      }
    `;
    }
    const texShape = inputInfo.shapeInfo.texShape;
    const tNumR = texShape[0];
    const tNumC = texShape[1];
    if (tNumC === 1 && tNumR === 1) {
        return `
      float ${funcName}(int index) {
        return sampleTexture(${texName}, halfCR);
      }
    `;
    }
    const offset = getFlatOffsetUniformName(texName);
    if (tNumC === 1) {
        if (enableShapeUniforms) {
            return `
      float ${funcName}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${offset}) + 0.5) / float(${texName}TexShape[0]));
        return sampleTexture(${texName}, uv);
      }
    `;
        }
        return `
      float ${funcName}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${offset}) + 0.5) / ${tNumR}.0);
        return sampleTexture(${texName}, uv);
      }
    `;
    }
    if (tNumR === 1) {
        if (enableShapeUniforms) {
            return `
      float ${funcName}(int index) {
        vec2 uv = vec2((float(index + ${offset}) + 0.5) / float(${texName}TexShape[1]), 0.5);
        return sampleTexture(${texName}, uv);
      }
    `;
        }
        return `
      float ${funcName}(int index) {
        vec2 uv = vec2((float(index + ${offset}) + 0.5) / ${tNumC}.0, 0.5);
        return sampleTexture(${texName}, uv);
      }
    `;
    }
    if (enableShapeUniforms) {
        return `
    float ${funcName}(int index) {
      vec2 uv = uvFromFlat(${texName}TexShape[0], ${texName}TexShape[1], index + ${offset});
      return sampleTexture(${texName}, uv);
    }
  `;
    }
    return `
    float ${funcName}(int index) {
      vec2 uv = uvFromFlat(${tNumR}, ${tNumC}, index + ${offset});
      return sampleTexture(${texName}, uv);
    }
  `;
}
function getPackedSampler2D(inputInfo, enableShapeUniforms) {
    const shape = inputInfo.shapeInfo.logicalShape;
    const texName = inputInfo.name;
    const funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    const texShape = inputInfo.shapeInfo.texShape;
    const texNumR = texShape[0];
    const texNumC = texShape[1];
    const glsl = getGlslDifferences();
    if (texShape != null && util.arraysEqual(shape, texShape)) {
        if (enableShapeUniforms) {
            return `
      vec4 ${funcName}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${texName}TexShape[1], ${texName}TexShape[0]);

        return ${glsl.texture2D}(${texName}, uv);
      }
    `;
        }
        return `
      vec4 ${funcName}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${texNumC}.0, ${texNumR}.0);

        return ${glsl.texture2D}(${texName}, uv);
      }
    `;
    }
    if (enableShapeUniforms) {
        return `
    vec4 ${funcName}(int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${texName}TexShape[0]) / 2.0), ceil(float(${texName}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${texName}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom2D(valuesPerRow, packedTexShape[0], packedTexShape[1], row, col);
      return ${glsl.texture2D}(${texName}, uv);
    }
  `;
    }
    const packedTexShape = [Math.ceil(texShape[0] / 2), Math.ceil(texShape[1] / 2)];
    const valuesPerRow = Math.ceil(shape[1] / 2);
    return `
    vec4 ${funcName}(int row, int col) {
      vec2 uv = packedUVfrom2D(${valuesPerRow}, ${packedTexShape[0]}, ${packedTexShape[1]}, row, col);
      return ${glsl.texture2D}(${texName}, uv);
    }
  `;
}
function getSampler2D(inputInfo, enableShapeUniforms) {
    const shape = inputInfo.shapeInfo.logicalShape;
    const texName = inputInfo.name;
    const funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    const texShape = inputInfo.shapeInfo.texShape;
    if (texShape != null && util.arraysEqual(shape, texShape)) {
        if (enableShapeUniforms) {
            return `
      float ${funcName}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${texName}TexShape[1], ${texName}TexShape[0]);
        return sampleTexture(${texName}, uv);
      }
    `;
        }
        const texNumR = texShape[0];
        const texNumC = texShape[1];
        return `
    float ${funcName}(int row, int col) {
      vec2 uv = (vec2(col, row) + halfCR) / vec2(${texNumC}.0, ${texNumR}.0);
      return sampleTexture(${texName}, uv);
    }
  `;
    }
    const { newShape, keptDims } = util.squeezeShape(shape);
    const squeezedShape = newShape;
    if (squeezedShape.length < shape.length) {
        const newInputInfo = squeezeInputInfo(inputInfo, squeezedShape);
        const params = ['row', 'col'];
        return `
      ${getSamplerFromInInfo(newInputInfo, enableShapeUniforms)}
      float ${funcName}(int row, int col) {
        return ${funcName}(${getSqueezedParams(params, keptDims)});
      }
    `;
    }
    if (inputInfo.shapeInfo.isUniform) {
        // Uniform arrays will be less than 65505 (no risk of float16 overflow).
        return `
      float ${funcName}(int row, int col) {
        int index = round(dot(vec2(row, col), vec2(${shape[1]}, 1)));
        ${getUniformSampler(inputInfo)}
      }
    `;
    }
    const texNumR = texShape[0];
    const texNumC = texShape[1];
    const offset = getFlatOffsetUniformName(texName);
    if (texNumC === 1) {
        // index is used directly as physical (no risk of float16 overflow).
        if (enableShapeUniforms) {
            return `
      float ${funcName}(int row, int col) {
        float index = dot(vec3(row, col, ${offset}), vec3(${texName}Shape[1], 1, 1));
        vec2 uv = vec2(0.5, (index + 0.5) / float(${texName}TexShape[0]));
        return sampleTexture(${texName}, uv);
      }
    `;
        }
        return `
    float ${funcName}(int row, int col) {
      float index = dot(vec3(row, col, ${offset}), vec3(${shape[1]}, 1, 1));
      vec2 uv = vec2(0.5, (index + 0.5) / ${texNumR}.0);
      return sampleTexture(${texName}, uv);
    }
  `;
    }
    if (texNumR === 1) {
        // index is used directly as physical (no risk of float16 overflow).
        if (enableShapeUniforms) {
            return `
      float ${funcName}(int row, int col) {
        float index = dot(vec3(row, col, ${offset}), vec3(${texName}Shape[1], 1, 1));
        vec2 uv = vec2((index + 0.5) / float(${texName}TexShape[1]), 0.5);
        return sampleTexture(${texName}, uv);
      }
    `;
        }
        return `
    float ${funcName}(int row, int col) {
      float index = dot(vec3(row, col, ${offset}), vec3(${shape[1]}, 1, 1));
      vec2 uv = vec2((index + 0.5) / ${texNumC}.0, 0.5);
      return sampleTexture(${texName}, uv);
    }
  `;
    }
    if (enableShapeUniforms) {
        return `
      float ${funcName}(int row, int col) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${texName}Shape[1] + col + ${offset};
        vec2 uv = uvFromFlat(${texName}TexShape[0], ${texName}TexShape[1], index);
        return sampleTexture(${texName}, uv);
      }
    `;
    }
    return `
  float ${funcName}(int row, int col) {
    // Explicitly use integer operations as dot() only works on floats.
    int index = row * ${shape[1]} + col + ${offset};
    vec2 uv = uvFromFlat(${texNumR}, ${texNumC}, index);
    return sampleTexture(${texName}, uv);
  }
`;
}
function getPackedSampler3D(inputInfo, enableShapeUniforms) {
    const shape = inputInfo.shapeInfo.logicalShape;
    const texName = inputInfo.name;
    const funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    const texShape = inputInfo.shapeInfo.texShape;
    const packedTexShape = [Math.ceil(texShape[0] / 2), Math.ceil(texShape[1] / 2)];
    if (shape[0] === 1) {
        const squeezedShape = shape.slice(1);
        const keptDims = [1, 2];
        const newInputInfo = squeezeInputInfo(inputInfo, squeezedShape);
        const params = ['b', 'row', 'col'];
        return `
        ${getPackedSamplerFromInInfo(newInputInfo, enableShapeUniforms)}
        vec4 ${funcName}(int b, int row, int col) {
          return ${funcName}(${getSqueezedParams(params, keptDims)});
        }
      `;
    }
    const glsl = getGlslDifferences();
    if (enableShapeUniforms) {
        return `
    vec4 ${funcName}(int b, int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${texName}TexShape[0]) / 2.0), ceil(float(${texName}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${texName}Shape[2]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${texName}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom3D(
        packedTexShape[0], packedTexShape[1], texelsInBatch, valuesPerRow, b, row, col);
      return ${glsl.texture2D}(${texName}, uv);
    }
  `;
    }
    const texNumR = packedTexShape[0];
    const texNumC = packedTexShape[1];
    const valuesPerRow = Math.ceil(shape[2] / 2);
    const texelsInBatch = valuesPerRow * Math.ceil(shape[1] / 2);
    return `
    vec4 ${funcName}(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        ${texNumR}, ${texNumC}, ${texelsInBatch}, ${valuesPerRow}, b, row, col);
      return ${glsl.texture2D}(${texName}, uv);
    }
  `;
}
function getSampler3D(inputInfo, enableShapeUniforms) {
    const shape = inputInfo.shapeInfo.logicalShape;
    const texName = inputInfo.name;
    const funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    const stride0 = shape[1] * shape[2];
    const stride1 = shape[2];
    const { newShape, keptDims } = util.squeezeShape(shape);
    const squeezedShape = newShape;
    if (squeezedShape.length < shape.length) {
        const newInputInfo = squeezeInputInfo(inputInfo, squeezedShape);
        const params = ['row', 'col', 'depth'];
        return `
        ${getSamplerFromInInfo(newInputInfo, enableShapeUniforms)}
        float ${funcName}(int row, int col, int depth) {
          return ${funcName}(${getSqueezedParams(params, keptDims)});
        }
      `;
    }
    if (inputInfo.shapeInfo.isUniform) {
        // Uniform arrays will be less than 65505 (no risk of float16 overflow).
        return `
      float ${funcName}(int row, int col, int depth) {
        int index = round(dot(vec3(row, col, depth),
                          vec3(${stride0}, ${stride1}, 1)));
        ${getUniformSampler(inputInfo)}
      }
    `;
    }
    const texShape = inputInfo.shapeInfo.texShape;
    const texNumR = texShape[0];
    const texNumC = texShape[1];
    const flatOffset = inputInfo.shapeInfo.flatOffset;
    if (texNumC === stride0 && flatOffset == null) {
        // texC is used directly as physical (no risk of float16 overflow).
        if (enableShapeUniforms) {
            return `
      float ${funcName}(int row, int col, int depth) {
        int stride1 = ${texName}Shape[2];
        float texR = float(row);
        float texC = dot(vec2(col, depth), vec2(stride1, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${texName}TexShape[1], ${texName}TexShape[0]);
        return sampleTexture(${texName}, uv);
      }
    `;
        }
        return `
        float ${funcName}(int row, int col, int depth) {
          float texR = float(row);
          float texC = dot(vec2(col, depth), vec2(${stride1}, 1));
          vec2 uv = (vec2(texC, texR) + halfCR) /
                     vec2(${texNumC}.0, ${texNumR}.0);
          return sampleTexture(${texName}, uv);
        }
      `;
    }
    if (texNumC === stride1 && flatOffset == null) {
        // texR is used directly as physical (no risk of float16 overflow).
        if (enableShapeUniforms) {
            return `
      float ${funcName}(int row, int col, int depth) {
        float texR = dot(vec2(row, col), vec2(${texName}Shape[1], 1));
        float texC = float(depth);
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${texName}TexShape[1], ${texName}TexShape[0]);
        return sampleTexture(${texName}, uv);
      }
    `;
        }
        return `
    float ${funcName}(int row, int col, int depth) {
      float texR = dot(vec2(row, col), vec2(${shape[1]}, 1));
      float texC = float(depth);
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${texNumC}.0, ${texNumR}.0);
      return sampleTexture(${texName}, uv);
    }
  `;
    }
    const offset = getFlatOffsetUniformName(texName);
    if (enableShapeUniforms) {
        return `
    float ${funcName}(int row, int col, int depth) {
      // Explicitly use integer operations as dot() only works on floats.
      int stride0 = ${texName}Shape[1] * ${texName}Shape[2];
      int stride1 = ${texName}Shape[2];
      int index = row * stride0 + col * stride1 + depth + ${offset};
      vec2 uv = uvFromFlat(${texName}TexShape[0], ${texName}TexShape[1], index);
      return sampleTexture(${texName}, uv);
    }
    `;
    }
    return `
      float ${funcName}(int row, int col, int depth) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${stride0} + col * ${stride1} + depth + ${offset};
        vec2 uv = uvFromFlat(${texNumR}, ${texNumC}, index);
        return sampleTexture(${texName}, uv);
      }
  `;
}
function getPackedSamplerND(inputInfo, enableShapeUniforms) {
    const texName = inputInfo.name;
    const funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    const glsl = getGlslDifferences();
    if (enableShapeUniforms) {
        // TODO: support 5d and 6d
        return `
    vec4 ${funcName}(int b2, int b, int row, int col) {
      int valuesPerRow = int(ceil(float(${texName}Shape[3]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${texName}Shape[2]) / 2.0));
      int index = b * texelsInBatch + (row / 2) * valuesPerRow + (col / 2);
      texelsInBatch *= ${texName}Shape[1];
      index = b2 * texelsInBatch + index;
      ivec2 packedTexShape = ivec2(ceil(float(${texName}TexShape[0]) / 2.0), ceil(float(${texName}TexShape[1]) / 2.0));
      int texR = index / packedTexShape[1];
      int texC = index - texR * packedTexShape[1];
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(packedTexShape[1], packedTexShape[0]); return ${glsl.texture2D}(${texName}, uv);
    }
  `;
    }
    const shape = inputInfo.shapeInfo.logicalShape;
    const rank = shape.length;
    const texShape = inputInfo.shapeInfo.texShape;
    const packedTexShape = [Math.ceil(texShape[0] / 2), Math.ceil(texShape[1] / 2)];
    const texNumR = packedTexShape[0];
    const texNumC = packedTexShape[1];
    const valuesPerRow = Math.ceil(shape[rank - 1] / 2);
    let texelsInBatch = valuesPerRow * Math.ceil(shape[rank - 2] / 2);
    let params = `int b, int row, int col`;
    let index = `b * ${texelsInBatch} + (row / 2) * ${valuesPerRow} + (col / 2)`;
    for (let b = 2; b < rank - 1; b++) {
        params = `int b${b}, ` + params;
        texelsInBatch *= shape[rank - b - 1];
        index = `b${b} * ${texelsInBatch} + ` + index;
    }
    return `
    vec4 ${funcName}(${params}) {
      int index = ${index};
      int texR = index / ${texNumC};
      int texC = index - texR * ${texNumC};
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${texNumC}, ${texNumR});
      return ${glsl.texture2D}(${texName}, uv);
    }
  `;
}
function getSampler4D(inputInfo, enableShapeUniforms) {
    const shape = inputInfo.shapeInfo.logicalShape;
    const texName = inputInfo.name;
    const funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    const stride2 = shape[3];
    const stride1 = shape[2] * stride2;
    const stride0 = shape[1] * stride1;
    const { newShape, keptDims } = util.squeezeShape(shape);
    if (newShape.length < shape.length) {
        const newInputInfo = squeezeInputInfo(inputInfo, newShape);
        const params = ['row', 'col', 'depth', 'depth2'];
        return `
      ${getSamplerFromInInfo(newInputInfo, enableShapeUniforms)}
      float ${funcName}(int row, int col, int depth, int depth2) {
        return ${funcName}(${getSqueezedParams(params, keptDims)});
      }
    `;
    }
    if (inputInfo.shapeInfo.isUniform) {
        // Uniform arrays will be less than 65505 (no risk of float16 overflow).
        return `
      float ${funcName}(int row, int col, int depth, int depth2) {
        int index = round(dot(vec4(row, col, depth, depth2),
                          vec4(${stride0}, ${stride1}, ${stride2}, 1)));
        ${getUniformSampler(inputInfo)}
      }
    `;
    }
    const flatOffset = inputInfo.shapeInfo.flatOffset;
    const texShape = inputInfo.shapeInfo.texShape;
    const texNumR = texShape[0];
    const texNumC = texShape[1];
    const stride2Str = `int stride2 = ${texName}Shape[3];`;
    const stride1Str = `int stride1 = ${texName}Shape[2] * stride2;`;
    const stride0Str = `int stride0 = ${texName}Shape[1] * stride1;`;
    if (texNumC === stride0 && flatOffset == null) {
        // texC is used directly as physical (no risk of float16 overflow).
        if (enableShapeUniforms) {
            return `
      float ${funcName}(int row, int col, int depth, int depth2) {
        ${stride2Str}
        ${stride1Str}
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(stride1, stride2, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${texName}TexShape[1], ${texName}TexShape[0]);
        return sampleTexture(${texName}, uv);
      }
    `;
        }
        return `
      float ${funcName}(int row, int col, int depth, int depth2) {
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(${stride1}, ${stride2}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${texNumC}.0, ${texNumR}.0);
        return sampleTexture(${texName}, uv);
      }
    `;
    }
    if (texNumC === stride2 && flatOffset == null) {
        // texR is used directly as physical (no risk of float16 overflow).
        if (enableShapeUniforms) {
            return `
      float ${funcName}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${texName}Shape[1] * ${texName}Shape[2], ${texName}Shape[2], 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${texName}TexShape[1], ${texName}TexShape[0]);
        return sampleTexture(${texName}, uv);
      }
    `;
        }
        return `
      float ${funcName}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${shape[1] * shape[2]}, ${shape[2]}, 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${texNumC}.0, ${texNumR}.0);
        return sampleTexture(${texName}, uv);
      }
    `;
    }
    const offset = getFlatOffsetUniformName(texName);
    if (enableShapeUniforms) {
        return `
    float ${funcName}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      ${stride2Str}
      ${stride1Str}
      ${stride0Str}
      int index = row * stride0 + col * stride1 +
          depth * stride2 + depth2;
      vec2 uv = uvFromFlat(${texName}TexShape[0], ${texName}TexShape[1], index + ${offset});
      return sampleTexture(${texName}, uv);
    }
  `;
    }
    return `
    float ${funcName}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${stride0} + col * ${stride1} +
          depth * ${stride2} + depth2;
      vec2 uv = uvFromFlat(${texNumR}, ${texNumC}, index + ${offset});
      return sampleTexture(${texName}, uv);
    }
  `;
}
function getSampler5D(inputInfo) {
    const shape = inputInfo.shapeInfo.logicalShape;
    const texName = inputInfo.name;
    const funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    const stride3 = shape[4];
    const stride2 = shape[3] * stride3;
    const stride1 = shape[2] * stride2;
    const stride0 = shape[1] * stride1;
    const { newShape, keptDims } = util.squeezeShape(shape);
    if (newShape.length < shape.length) {
        const newInputInfo = squeezeInputInfo(inputInfo, newShape);
        const params = ['row', 'col', 'depth', 'depth2', 'depth3'];
        return `
      ${getSamplerFromInInfo(newInputInfo)}
      float ${funcName}(int row, int col, int depth, int depth2, int depth3) {
        return ${funcName}(${getSqueezedParams(params, keptDims)});
      }
    `;
    }
    if (inputInfo.shapeInfo.isUniform) {
        // Uniform arrays will be less than 65505 (no risk of float16 overflow).
        return `
      float ${funcName}(int row, int col, int depth, int depth2, int depth3) {
        float index = dot(
          vec4(row, col, depth, depth2),
          vec4(${stride0}, ${stride1}, ${stride2}, ${stride3})) +
          depth3;
        ${getUniformSampler(inputInfo)}
      }
    `;
    }
    const flatOffset = inputInfo.shapeInfo.flatOffset;
    const texShape = inputInfo.shapeInfo.texShape;
    const texNumR = texShape[0];
    const texNumC = texShape[1];
    if (texNumC === stride0 && flatOffset == null) {
        // texC is used directly as physical (no risk of float16 overflow).
        return `
      float ${funcName}(int row, int col, int depth, int depth2, int depth3) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
                         vec4(${stride1}, ${stride2}, ${stride3}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${texNumC}.0, ${texNumR}.0);
        return sampleTexture(${texName}, uv);
      }
    `;
    }
    if (texNumC === stride3 && flatOffset == null) {
        // texR is used directly as physical (no risk of float16 overflow).
        return `
      float ${funcName}(int row, int col, int depth, int depth2, int depth3) {
        float texR = dot(
          vec4(row, col, depth, depth2),
          vec4(${shape[1] * shape[2] * shape[3]},
               ${shape[2] * shape[3]}, ${shape[3]}, 1));
        int texC = depth3;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${texNumC}.0, ${texNumR}.0);
        return sampleTexture(${texName}, uv);
      }
    `;
    }
    const offset = getFlatOffsetUniformName(texName);
    return `
    float ${funcName}(int row, int col, int depth, int depth2, int depth3) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${stride0} + col * ${stride1} + depth * ${stride2} +
          depth2 * ${stride3} + depth3 + ${offset};
      vec2 uv = uvFromFlat(${texNumR}, ${texNumC}, index);
      return sampleTexture(${texName}, uv);
    }
  `;
}
function getSampler6D(inputInfo) {
    const shape = inputInfo.shapeInfo.logicalShape;
    const texName = inputInfo.name;
    const funcName = 'get' + texName.charAt(0).toUpperCase() + texName.slice(1);
    const { newShape, keptDims } = util.squeezeShape(shape);
    if (newShape.length < shape.length) {
        const newInputInfo = squeezeInputInfo(inputInfo, newShape);
        const params = ['row', 'col', 'depth', 'depth2', 'depth3', 'depth4'];
        return `
      ${getSamplerFromInInfo(newInputInfo)}
      float ${funcName}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        return ${funcName}(${getSqueezedParams(params, keptDims)});
      }
    `;
    }
    const stride4 = shape[5];
    const stride3 = shape[4] * stride4;
    const stride2 = shape[3] * stride3;
    const stride1 = shape[2] * stride2;
    const stride0 = shape[1] * stride1;
    if (inputInfo.shapeInfo.isUniform) {
        // Uniform arrays will be less than 65505 (no risk of float16 overflow).
        return `
      float ${funcName}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
        int index = round(dot(
          vec4(row, col, depth, depth2),
          vec4(${stride0}, ${stride1}, ${stride2}, ${stride3})) +
          dot(
            vec2(depth3, depth4),
            vec2(${stride4}, 1)));
        ${getUniformSampler(inputInfo)}
      }
    `;
    }
    const flatOffset = inputInfo.shapeInfo.flatOffset;
    const texShape = inputInfo.shapeInfo.texShape;
    const texNumR = texShape[0];
    const texNumC = texShape[1];
    if (texNumC === stride0 && flatOffset == null) {
        // texC is used directly as physical (no risk of float16 overflow).
        return `
      float ${funcName}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
          vec4(${stride1}, ${stride2}, ${stride3}, ${stride4})) +
               float(depth4);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${texNumC}.0, ${texNumR}.0);
        return sampleTexture(${texName}, uv);
      }
    `;
    }
    if (texNumC === stride4 && flatOffset == null) {
        // texR is used directly as physical (no risk of float16 overflow).
        return `
      float ${funcName}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        float texR = dot(vec4(row, col, depth, depth2),
          vec4(${shape[1] * shape[2] * shape[3] * shape[4]},
               ${shape[2] * shape[3] * shape[4]},
               ${shape[3] * shape[4]},
               ${shape[4]})) + float(depth3);
        int texC = depth4;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${texNumC}.0, ${texNumR}.0);
        return sampleTexture(${texName}, uv);
      }
    `;
    }
    const offset = getFlatOffsetUniformName(texName);
    return `
    float ${funcName}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${stride0} + col * ${stride1} + depth * ${stride2} +
          depth2 * ${stride3} + depth3 * ${stride4} + depth4 + ${offset};
      vec2 uv = uvFromFlat(${texNumR}, ${texNumC}, index);
      return sampleTexture(${texName}, uv);
    }
  `;
}
function getUniformSampler(inputInfo) {
    const texName = inputInfo.name;
    const inSize = util.sizeFromShape(inputInfo.shapeInfo.logicalShape);
    if (inSize < 2) {
        return `return ${texName};`;
    }
    return `
    for (int i = 0; i < ${inSize}; i++) {
      if (i == index) {
        return ${texName}[i];
      }
    }
  `;
}
function getPackedSamplerAtOutputCoords(inputInfo, outShapeInfo) {
    const texName = inputInfo.name;
    const texFuncSnippet = texName.charAt(0).toUpperCase() + texName.slice(1);
    const funcName = 'get' + texFuncSnippet + 'AtOutCoords';
    const inRank = inputInfo.shapeInfo.logicalShape.length;
    const outRank = outShapeInfo.logicalShape.length;
    const broadcastDims = getBroadcastDims(inputInfo.shapeInfo.logicalShape, outShapeInfo.logicalShape);
    const type = getCoordsDataType(outRank);
    const rankDiff = outRank - inRank;
    let coordsSnippet;
    const fields = ['x', 'y', 'z', 'w', 'u', 'v'];
    if (inRank === 0) {
        coordsSnippet = '';
    }
    else if (outRank < 2 && broadcastDims.length >= 1) {
        coordsSnippet = 'coords = 0;';
    }
    else {
        coordsSnippet =
            broadcastDims.map(d => `coords.${fields[d + rankDiff]} = 0;`)
                .join('\n');
    }
    let unpackedCoordsSnippet = '';
    if (outRank < 2 && inRank > 0) {
        unpackedCoordsSnippet = 'coords';
    }
    else {
        unpackedCoordsSnippet = inputInfo.shapeInfo.logicalShape
            .map((s, i) => `coords.${fields[i + rankDiff]}`)
            .join(', ');
    }
    let output = `return outputValue;`;
    const inSize = util.sizeFromShape(inputInfo.shapeInfo.logicalShape);
    const isInputScalar = inSize === 1;
    const outSize = util.sizeFromShape(outShapeInfo.logicalShape);
    const isOutputScalar = outSize === 1;
    if (inRank === 1 && !isInputScalar && !isOutputScalar) {
        output = `
      return vec4(outputValue.xy, outputValue.xy);
    `;
    }
    else if (isInputScalar && !isOutputScalar) {
        if (outRank === 1) {
            output = `
        return vec4(outputValue.x, outputValue.x, 0., 0.);
      `;
        }
        else {
            output = `
        return vec4(outputValue.x);
      `;
        }
    }
    else if (broadcastDims.length) {
        const rows = inRank - 2;
        const cols = inRank - 1;
        if (broadcastDims.indexOf(rows) > -1 && broadcastDims.indexOf(cols) > -1) {
            output = `return vec4(outputValue.x);`;
        }
        else if (broadcastDims.indexOf(rows) > -1) {
            output = `return vec4(outputValue.x, outputValue.y, ` +
                `outputValue.x, outputValue.y);`;
        }
        else if (broadcastDims.indexOf(cols) > -1) {
            output = `return vec4(outputValue.xx, outputValue.zz);`;
        }
    }
    return `
    vec4 ${funcName}() {
      ${type} coords = getOutputCoords();
      ${coordsSnippet}
      vec4 outputValue = get${texFuncSnippet}(${unpackedCoordsSnippet});
      ${output}
    }
  `;
}
function getSamplerAtOutputCoords(inputInfo, outShapeInfo) {
    const texName = inputInfo.name;
    const texFuncSnippet = texName.charAt(0).toUpperCase() + texName.slice(1);
    const funcName = 'get' + texFuncSnippet + 'AtOutCoords';
    const outTexShape = outShapeInfo.texShape;
    const inTexShape = inputInfo.shapeInfo.texShape;
    const inRank = inputInfo.shapeInfo.logicalShape.length;
    const outRank = outShapeInfo.logicalShape.length;
    if (!inputInfo.shapeInfo.isUniform && inRank === outRank &&
        inputInfo.shapeInfo.flatOffset == null &&
        util.arraysEqual(inTexShape, outTexShape)) {
        return `
      float ${funcName}() {
        return sampleTexture(${texName}, resultUV);
      }
    `;
    }
    const type = getCoordsDataType(outRank);
    const broadcastDims = getBroadcastDims(inputInfo.shapeInfo.logicalShape, outShapeInfo.logicalShape);
    const rankDiff = outRank - inRank;
    let coordsSnippet;
    const fields = ['x', 'y', 'z', 'w', 'u', 'v'];
    if (inRank === 0) {
        coordsSnippet = '';
    }
    else if (outRank < 2 && broadcastDims.length >= 1) {
        coordsSnippet = 'coords = 0;';
    }
    else {
        coordsSnippet =
            broadcastDims.map(d => `coords.${fields[d + rankDiff]} = 0;`)
                .join('\n');
    }
    let unpackedCoordsSnippet = '';
    if (outRank < 2 && inRank > 0) {
        unpackedCoordsSnippet = 'coords';
    }
    else {
        unpackedCoordsSnippet = inputInfo.shapeInfo.logicalShape
            .map((s, i) => `coords.${fields[i + rankDiff]}`)
            .join(', ');
    }
    return `
    float ${funcName}() {
      ${type} coords = getOutputCoords();
      ${coordsSnippet}
      return get${texFuncSnippet}(${unpackedCoordsSnippet});
    }
  `;
}
export function getCoordsDataType(rank) {
    if (rank <= 1) {
        return 'int';
    }
    else if (rank === 2) {
        return 'ivec2';
    }
    else if (rank === 3) {
        return 'ivec3';
    }
    else if (rank === 4) {
        return 'ivec4';
    }
    else if (rank === 5) {
        return 'ivec5';
    }
    else if (rank === 6) {
        return 'ivec6';
    }
    else {
        throw Error(`GPU for rank ${rank} is not yet supported`);
    }
}
export function getUniformInfoFromShape(isPacked, shape, texShape) {
    const { newShape, keptDims } = util.squeezeShape(shape);
    const rank = shape.length;
    const useSqueezePackedShape = isPacked && rank === 3 && shape[0] === 1;
    const squeezeShape = useSqueezePackedShape ? shape.slice(1) : newShape;
    const useSqueezeShape = (!isPacked && rank > 1 && !util.arraysEqual(shape, texShape) &&
        newShape.length < rank) ||
        useSqueezePackedShape;
    const uniformShape = useSqueezeShape ? squeezeShape : shape;
    return { useSqueezeShape, uniformShape, keptDims };
}
/** Returns a new input info (a copy) that has a squeezed logical shape. */
export function squeezeInputInfo(inInfo, squeezedShape) {
    // Deep copy.
    const newInputInfo = JSON.parse(JSON.stringify(inInfo));
    newInputInfo.shapeInfo.logicalShape = squeezedShape;
    return newInputInfo;
}
function getSqueezedParams(params, keptDims) {
    return keptDims.map(d => params[d]).join(', ');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhZGVyX2NvbXBpbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9zaGFkZXJfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsNEVBQTRFO0FBQzVFLDREQUE0RDtBQUU1RCxPQUFPLEVBQUMsWUFBWSxFQUFFLElBQUksRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3pELE1BQU0sRUFBQyxnQkFBZ0IsRUFBQyxHQUFHLFlBQVksQ0FBQztBQUN4QyxPQUFPLEVBQUMsa0JBQWtCLEVBQU8sTUFBTSxnQkFBZ0IsQ0FBQztBQUN4RCxPQUFPLEtBQUssV0FBVyxNQUFNLHdCQUF3QixDQUFDO0FBMEJ0RCxNQUFNLFVBQVUsVUFBVSxDQUN0QixVQUF1QixFQUFFLFdBQXNCLEVBQy9DLE9BQXNCO0lBQ3hCLE1BQU0sY0FBYyxHQUFhLEVBQUUsQ0FBQztJQUNwQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3JCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUUxRCwyREFBMkQ7UUFDM0QsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtZQUN6QixjQUFjLENBQUMsSUFBSSxDQUNmLGlCQUFpQixDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDL0Q7YUFBTTtZQUNMLGNBQWMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ3BELGNBQWMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FB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QUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDO1FBQzNELFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLHFCQUFxQixDQUFDO0lBQzFCLE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDNUQsT0FBTyxFQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFDLENBQUM7QUFDbkQsQ0FBQztBQUVELDJFQUEyRTtBQUMzRSxNQUFNLFVBQVUsZ0JBQWdCLENBQzVCLE1BQWlCLEVBQUUsYUFBdUI7SUFDNUMsYUFBYTtJQUNiLE1BQU0sWUFBWSxHQUFjLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ25FLFlBQVksQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLGFBQWEsQ0FBQztJQUNwRCxPQUFPLFlBQVksQ0FBQztBQUN0QixDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxNQUFnQixFQUFFLFFBQWtCO0lBQzdELE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vLyBQbGVhc2UgbWFrZSBzdXJlIHRoZSBzaGFrZXIga2V5IGluIG1ha2VTaGFkZXJLZXkgaW4gZ3BncHVfbWF0aC50cyBpcyB3ZWxsXG4vLyBtYXBwZWQgaWYgYW55IHNoYWRlciBzb3VyY2UgY29kZSBpcyBjaGFuZ2VkIGluIHRoaXMgZmlsZS5cblxuaW1wb3J0IHtiYWNrZW5kX3V0aWwsIHV0aWx9IGZyb20gJ0B0ZW5zb3JmbG93L3RmanMtY29yZSc7XG5jb25zdCB7Z2V0QnJvYWRjYXN0RGltc30gPSBiYWNrZW5kX3V0aWw7XG5pbXBvcnQge2dldEdsc2xEaWZmZXJlbmNlcywgR0xTTH0gZnJvbSAnLi9nbHNsX3ZlcnNpb24nO1xuaW1wb3J0ICogYXMgc2hhZGVyX3V0aWwgZnJvbSAnLi9zaGFkZXJfY29tcGlsZXJfdXRpbCc7XG5cbmV4cG9ydCB0eXBlIFNoYXBlSW5mbyA9IHtcbiAgbG9naWNhbFNoYXBlOiBudW1iZXJbXSxcbiAgdGV4U2hhcGU6IFtudW1iZXIsIG51bWJlcl0sXG4gIGlzVW5pZm9ybTogYm9vbGVhbixcbiAgaXNQYWNrZWQ6IGJvb2xlYW4sXG4gIGZsYXRPZmZzZXQ6IG51bWJlclxufTtcblxuZXhwb3J0IHR5cGUgSW5wdXRJbmZvID0ge1xuICBuYW1lOiBzdHJpbmcsXG4gIHNoYXBlSW5mbzogU2hhcGVJbmZvXG59O1xuXG5leHBvcnQgdHlwZSBVbmlmb3JtVHlwZSA9XG4gICAgJ2Zsb2F0J3wndmVjMid8J3ZlYzMnfCd2ZWM0J3wnaW50J3wnaXZlYzInfCdpdmVjMyd8J2l2ZWM0JztcblxuaW50ZXJmYWNlIFByb2dyYW1QYXJhbXMge1xuICB1c2VyQ29kZTogc3RyaW5nO1xuICBlbmFibGVTaGFwZVVuaWZvcm1zPzogYm9vbGVhbjtcbiAgcGFja2VkSW5wdXRzPzogYm9vbGVhbjtcbiAgY3VzdG9tVW5pZm9ybXM/OlxuICAgICAgQXJyYXk8e25hbWU6IHN0cmluZzsgYXJyYXlJbmRleD86IG51bWJlcjsgdHlwZTogVW5pZm9ybVR5cGU7fT47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlU2hhZGVyKFxuICAgIGlucHV0c0luZm86IElucHV0SW5mb1tdLCBvdXRwdXRTaGFwZTogU2hhcGVJbmZvLFxuICAgIHByb2dyYW06IFByb2dyYW1QYXJhbXMpOiBzdHJpbmcge1xuICBjb25zdCBwcmVmaXhTbmlwcGV0czogc3RyaW5nW10gPSBbXTtcbiAgaW5wdXRzSW5mby5mb3JFYWNoKHggPT4ge1xuICAgIGNvbnN0IHNpemUgPSB1dGlsLnNpemVGcm9tU2hhcGUoeC5zaGFwZUluZm8ubG9naWNhbFNoYXBlKTtcblxuICAgIC8vIFNuaXBwZXQgd2hlbiB3ZSBkZWNpZGVkIHRvIHVwbG9hZCB0aGUgdmFsdWVzIGFzIHVuaWZvcm0uXG4gICAgaWYgKHguc2hhcGVJbmZvLmlzVW5pZm9ybSkge1xuICAgICAgcHJlZml4U25pcHBldHMucHVzaChcbiAgICAgICAgICBgdW5pZm9ybSBmbG9hdCAke3gubmFtZX0ke3NpemUgPiAxID8gYFske3NpemV9XWAgOiAnJ307YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZWZpeFNuaXBwZXRzLnB1c2goYHVuaWZvcm0gc2FtcGxlcjJEICR7eC5uYW1lfTtgKTtcbiAgICAgIHByZWZpeFNuaXBwZXRzLnB1c2goYHVuaWZvcm0gaW50IG9mZnNldCR7eC5uYW1lfTtgKTtcbiAgICB9XG5cbiAgICBpZiAocHJvZ3JhbS5lbmFibGVTaGFwZVVuaWZvcm1zKSB7XG4gICAgICBjb25zdCB7dW5pZm9ybVNoYXBlfSA9IGdldFVuaWZvcm1JbmZvRnJvbVNoYXBlKFxuICAgICAgICAgIHByb2dyYW0ucGFja2VkSW5wdXRzLCB4LnNoYXBlSW5mby5sb2dpY2FsU2hhcGUsIHguc2hhcGVJbmZvLnRleFNoYXBlKTtcbiAgICAgIHN3aXRjaCAodW5pZm9ybVNoYXBlLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgcHJlZml4U25pcHBldHMucHVzaChgdW5pZm9ybSBpbnQgJHt4Lm5hbWV9U2hhcGU7YCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBwcmVmaXhTbmlwcGV0cy5wdXNoKGB1bmlmb3JtIGl2ZWMyICR7eC5uYW1lfVNoYXBlO2ApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgcHJlZml4U25pcHBldHMucHVzaChgdW5pZm9ybSBpdmVjMyAke3gubmFtZX1TaGFwZTtgKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHByZWZpeFNuaXBwZXRzLnB1c2goYHVuaWZvcm0gaXZlYzQgJHt4Lm5hbWV9U2hhcGU7YCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBwcmVmaXhTbmlwcGV0cy5wdXNoKGB1bmlmb3JtIGl2ZWMyICR7eC5uYW1lfVRleFNoYXBlO2ApO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKHByb2dyYW0uZW5hYmxlU2hhcGVVbmlmb3Jtcykge1xuICAgIHN3aXRjaCAob3V0cHV0U2hhcGUubG9naWNhbFNoYXBlLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICBwcmVmaXhTbmlwcGV0cy5wdXNoKGB1bmlmb3JtIGludCBvdXRTaGFwZTtgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHByZWZpeFNuaXBwZXRzLnB1c2goYHVuaWZvcm0gaXZlYzIgb3V0U2hhcGU7YCk7XG4gICAgICAgIHByZWZpeFNuaXBwZXRzLnB1c2goYHVuaWZvcm0gaW50IG91dFNoYXBlU3RyaWRlcztgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIHByZWZpeFNuaXBwZXRzLnB1c2goYHVuaWZvcm0gaXZlYzMgb3V0U2hhcGU7YCk7XG4gICAgICAgIHByZWZpeFNuaXBwZXRzLnB1c2goYHVuaWZvcm0gaXZlYzIgb3V0U2hhcGVTdHJpZGVzO2ApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgcHJlZml4U25pcHBldHMucHVzaChgdW5pZm9ybSBpdmVjNCBvdXRTaGFwZTtgKTtcbiAgICAgICAgcHJlZml4U25pcHBldHMucHVzaChgdW5pZm9ybSBpdmVjMyBvdXRTaGFwZVN0cmlkZXM7YCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHByZWZpeFNuaXBwZXRzLnB1c2goYHVuaWZvcm0gaXZlYzIgb3V0VGV4U2hhcGU7YCk7XG4gIH1cbiAgaWYgKHByb2dyYW0uY3VzdG9tVW5pZm9ybXMpIHtcbiAgICBwcm9ncmFtLmN1c3RvbVVuaWZvcm1zLmZvckVhY2goKGQpID0+IHtcbiAgICAgIHByZWZpeFNuaXBwZXRzLnB1c2goYHVuaWZvcm0gJHtkLnR5cGV9ICR7ZC5uYW1lfSR7XG4gICAgICAgICAgZC5hcnJheUluZGV4ID8gYFske2QuYXJyYXlJbmRleH1dYCA6ICcnfTtgKTtcbiAgICB9KTtcbiAgfVxuICBjb25zdCBpbnB1dFByZWZpeFNuaXBwZXQgPSBwcmVmaXhTbmlwcGV0cy5qb2luKCdcXG4nKTtcblxuICBjb25zdCBpbnB1dFNhbXBsaW5nU25pcHBldCA9IGlucHV0c0luZm9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPT4gZ2V0SW5wdXRTYW1wbGluZ1NuaXBwZXQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCwgb3V0cHV0U2hhcGUsIHByb2dyYW0ucGFja2VkSW5wdXRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyYW0uZW5hYmxlU2hhcGVVbmlmb3JtcykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKCdcXG4nKTtcbiAgY29uc3Qgb3V0VGV4U2hhcGUgPSBvdXRwdXRTaGFwZS50ZXhTaGFwZTtcbiAgY29uc3QgZ2xzbCA9IGdldEdsc2xEaWZmZXJlbmNlcygpO1xuICBjb25zdCBmbG9hdFRleHR1cmVTYW1wbGVTbmlwcGV0ID0gZ2V0RmxvYXRUZXh0dXJlU2FtcGxlU25pcHBldChnbHNsKTtcbiAgbGV0IG91dHB1dFNhbXBsaW5nU25pcHBldDogc3RyaW5nO1xuICBsZXQgZmxvYXRUZXh0dXJlU2V0T3V0cHV0U25pcHBldDogc3RyaW5nO1xuICBsZXQgc2hhZGVyUHJlZml4ID0gZ2V0U2hhZGVyUHJlZml4KGdsc2wpO1xuXG4gIGlmIChvdXRwdXRTaGFwZS5pc1BhY2tlZCkge1xuICAgIG91dHB1dFNhbXBsaW5nU25pcHBldCA9IGdldFBhY2tlZE91dHB1dFNhbXBsaW5nU25pcHBldChcbiAgICAgICAgb3V0cHV0U2hhcGUubG9naWNhbFNoYXBlLCBvdXRUZXhTaGFwZSwgcHJvZ3JhbS5lbmFibGVTaGFwZVVuaWZvcm1zKTtcbiAgICBmbG9hdFRleHR1cmVTZXRPdXRwdXRTbmlwcGV0ID0gZ2V0RmxvYXRUZXh0dXJlU2V0UkdCQVNuaXBwZXQoZ2xzbCk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0U2FtcGxpbmdTbmlwcGV0ID0gZ2V0T3V0cHV0U2FtcGxpbmdTbmlwcGV0KFxuICAgICAgICBvdXRwdXRTaGFwZS5sb2dpY2FsU2hhcGUsIG91dFRleFNoYXBlLCBwcm9ncmFtLmVuYWJsZVNoYXBlVW5pZm9ybXMpO1xuICAgIGZsb2F0VGV4dHVyZVNldE91dHB1dFNuaXBwZXQgPSBnZXRGbG9hdFRleHR1cmVTZXRSU25pcHBldChnbHNsKTtcbiAgfVxuXG4gIGlmIChwcm9ncmFtLnBhY2tlZElucHV0cykge1xuICAgIHNoYWRlclByZWZpeCArPSBTSEFERVJfUEFDS0VEX1BSRUZJWDtcbiAgfVxuXG4gIGNvbnN0IHNvdXJjZSA9IFtcbiAgICBzaGFkZXJQcmVmaXgsIGZsb2F0VGV4dHVyZVNhbXBsZVNuaXBwZXQsIGZsb2F0VGV4dHVyZVNldE91dHB1dFNuaXBwZXQsXG4gICAgaW5wdXRQcmVmaXhTbmlwcGV0LCBvdXRwdXRTYW1wbGluZ1NuaXBwZXQsIGlucHV0U2FtcGxpbmdTbmlwcGV0LFxuICAgIHByb2dyYW0udXNlckNvZGVcbiAgXS5qb2luKCdcXG4nKTtcbiAgcmV0dXJuIHNvdXJjZTtcbn1cblxuZnVuY3Rpb24gZ2V0U2FtcGxlckZyb21JbkluZm8oXG4gICAgaW5JbmZvOiBJbnB1dEluZm8sIGVuYWJsZVNoYXBlVW5pZm9ybXMgPSBmYWxzZSk6IHN0cmluZyB7XG4gIGNvbnN0IHNoYXBlID0gaW5JbmZvLnNoYXBlSW5mby5sb2dpY2FsU2hhcGU7XG4gIHN3aXRjaCAoc2hhcGUubGVuZ3RoKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIGdldFNhbXBsZXJTY2FsYXIoaW5JbmZvLCBlbmFibGVTaGFwZVVuaWZvcm1zKTtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gZ2V0U2FtcGxlcjFEKGluSW5mbywgZW5hYmxlU2hhcGVVbmlmb3Jtcyk7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIGdldFNhbXBsZXIyRChpbkluZm8sIGVuYWJsZVNoYXBlVW5pZm9ybXMpO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBnZXRTYW1wbGVyM0QoaW5JbmZvLCBlbmFibGVTaGFwZVVuaWZvcm1zKTtcbiAgICBjYXNlIDQ6XG4gICAgICByZXR1cm4gZ2V0U2FtcGxlcjREKGluSW5mbywgZW5hYmxlU2hhcGVVbmlmb3Jtcyk7XG4gICAgY2FzZSA1OlxuICAgICAgcmV0dXJuIGdldFNhbXBsZXI1RChpbkluZm8pO1xuICAgIGNhc2UgNjpcbiAgICAgIHJldHVybiBnZXRTYW1wbGVyNkQoaW5JbmZvKTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGAke3NoYXBlLmxlbmd0aH0tRCBpbnB1dCBzYW1wbGluZ2AgK1xuICAgICAgICAgIGAgaXMgbm90IHlldCBzdXBwb3J0ZWRgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRQYWNrZWRTYW1wbGVyRnJvbUluSW5mbyhcbiAgICBpbkluZm86IElucHV0SW5mbywgZW5hYmxlU2hhcGVVbmlmb3JtczogYm9vbGVhbik6IHN0cmluZyB7XG4gIGNvbnN0IHNoYXBlID0gaW5JbmZvLnNoYXBlSW5mby5sb2dpY2FsU2hhcGU7XG4gIHN3aXRjaCAoc2hhcGUubGVuZ3RoKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIGdldFBhY2tlZFNhbXBsZXJTY2FsYXIoaW5JbmZvKTtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gZ2V0UGFja2VkU2FtcGxlcjFEKGluSW5mbywgZW5hYmxlU2hhcGVVbmlmb3Jtcyk7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIGdldFBhY2tlZFNhbXBsZXIyRChpbkluZm8sIGVuYWJsZVNoYXBlVW5pZm9ybXMpO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBnZXRQYWNrZWRTYW1wbGVyM0QoaW5JbmZvLCBlbmFibGVTaGFwZVVuaWZvcm1zKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGdldFBhY2tlZFNhbXBsZXJORChpbkluZm8sIGVuYWJsZVNoYXBlVW5pZm9ybXMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldElucHV0U2FtcGxpbmdTbmlwcGV0KFxuICAgIGluSW5mbzogSW5wdXRJbmZvLCBvdXRTaGFwZUluZm86IFNoYXBlSW5mbywgdXNlc1BhY2tlZFRleHR1cmVzID0gZmFsc2UsXG4gICAgZW5hYmxlU2hhcGVVbmlmb3JtczogYm9vbGVhbik6IHN0cmluZyB7XG4gIGxldCByZXMgPSAnJztcbiAgaWYgKHVzZXNQYWNrZWRUZXh0dXJlcykge1xuICAgIHJlcyArPSBnZXRQYWNrZWRTYW1wbGVyRnJvbUluSW5mbyhpbkluZm8sIGVuYWJsZVNoYXBlVW5pZm9ybXMpO1xuICB9IGVsc2Uge1xuICAgIHJlcyArPSBnZXRTYW1wbGVyRnJvbUluSW5mbyhpbkluZm8sIGVuYWJsZVNoYXBlVW5pZm9ybXMpO1xuICB9XG5cbiAgY29uc3QgaW5TaGFwZSA9IGluSW5mby5zaGFwZUluZm8ubG9naWNhbFNoYXBlO1xuICBjb25zdCBvdXRTaGFwZSA9IG91dFNoYXBlSW5mby5sb2dpY2FsU2hhcGU7XG4gIGlmIChpblNoYXBlLmxlbmd0aCA8PSBvdXRTaGFwZS5sZW5ndGgpIHtcbiAgICBpZiAodXNlc1BhY2tlZFRleHR1cmVzKSB7XG4gICAgICByZXMgKz0gZ2V0UGFja2VkU2FtcGxlckF0T3V0cHV0Q29vcmRzKGluSW5mbywgb3V0U2hhcGVJbmZvKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzICs9IGdldFNhbXBsZXJBdE91dHB1dENvb3JkcyhpbkluZm8sIG91dFNoYXBlSW5mbyk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIGdldFBhY2tlZE91dHB1dFNhbXBsaW5nU25pcHBldChcbiAgICBvdXRTaGFwZTogbnVtYmVyW10sIG91dFRleFNoYXBlOiBbbnVtYmVyLCBudW1iZXJdLFxuICAgIGVuYWJsZVNoYXBlVW5pZm9ybXM6IGJvb2xlYW4pOiBzdHJpbmcge1xuICBzd2l0Y2ggKG91dFNoYXBlLmxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiBnZXRPdXRwdXRTY2FsYXJDb29yZHMoKTtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gZ2V0T3V0cHV0UGFja2VkMURDb29yZHMoXG4gICAgICAgICAgb3V0U2hhcGUgYXMgW251bWJlcl0sIG91dFRleFNoYXBlLCBlbmFibGVTaGFwZVVuaWZvcm1zKTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gZ2V0T3V0cHV0UGFja2VkMkRDb29yZHMoXG4gICAgICAgICAgb3V0U2hhcGUgYXMgW251bWJlciwgbnVtYmVyXSwgb3V0VGV4U2hhcGUsIGVuYWJsZVNoYXBlVW5pZm9ybXMpO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBnZXRPdXRwdXRQYWNrZWQzRENvb3JkcyhcbiAgICAgICAgICBvdXRTaGFwZSBhcyBbbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sIG91dFRleFNoYXBlLFxuICAgICAgICAgIGVuYWJsZVNoYXBlVW5pZm9ybXMpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZ2V0T3V0cHV0UGFja2VkTkRDb29yZHMoXG4gICAgICAgICAgb3V0U2hhcGUsIG91dFRleFNoYXBlLCBlbmFibGVTaGFwZVVuaWZvcm1zKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRPdXRwdXRTYW1wbGluZ1NuaXBwZXQoXG4gICAgb3V0U2hhcGU6IG51bWJlcltdLCBvdXRUZXhTaGFwZTogW251bWJlciwgbnVtYmVyXSxcbiAgICBlbmFibGVTaGFwZVVuaWZvcm1zOiBib29sZWFuKTogc3RyaW5nIHtcbiAgc3dpdGNoIChvdXRTaGFwZS5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gZ2V0T3V0cHV0U2NhbGFyQ29vcmRzKCk7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIGdldE91dHB1dDFEQ29vcmRzKFxuICAgICAgICAgIG91dFNoYXBlIGFzIFtudW1iZXJdLCBvdXRUZXhTaGFwZSwgZW5hYmxlU2hhcGVVbmlmb3Jtcyk7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIGdldE91dHB1dDJEQ29vcmRzKFxuICAgICAgICAgIG91dFNoYXBlIGFzIFtudW1iZXIsIG51bWJlcl0sIG91dFRleFNoYXBlLCBlbmFibGVTaGFwZVVuaWZvcm1zKTtcbiAgICBjYXNlIDM6XG4gICAgICByZXR1cm4gZ2V0T3V0cHV0M0RDb29yZHMoXG4gICAgICAgICAgb3V0U2hhcGUgYXMgW251bWJlciwgbnVtYmVyLCBudW1iZXJdLCBvdXRUZXhTaGFwZSxcbiAgICAgICAgICBlbmFibGVTaGFwZVVuaWZvcm1zKTtcbiAgICBjYXNlIDQ6XG4gICAgICByZXR1cm4gZ2V0T3V0cHV0NERDb29yZHMoXG4gICAgICAgICAgb3V0U2hhcGUgYXMgW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sIG91dFRleFNoYXBlLFxuICAgICAgICAgIGVuYWJsZVNoYXBlVW5pZm9ybXMpO1xuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiBnZXRPdXRwdXQ1RENvb3JkcyhcbiAgICAgICAgICBvdXRTaGFwZSBhcyBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdLCBvdXRUZXhTaGFwZSk7XG4gICAgY2FzZSA2OlxuICAgICAgcmV0dXJuIGdldE91dHB1dDZEQ29vcmRzKFxuICAgICAgICAgIG91dFNoYXBlIGFzIFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcbiAgICAgICAgICBvdXRUZXhTaGFwZSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgJHtvdXRTaGFwZS5sZW5ndGh9LUQgb3V0cHV0IHNhbXBsaW5nIGlzIG5vdCB5ZXQgc3VwcG9ydGVkYCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RmxvYXRUZXh0dXJlU2FtcGxlU25pcHBldChnbHNsOiBHTFNMKTogc3RyaW5nIHtcbiAgcmV0dXJuIGBcbiAgICBmbG9hdCBzYW1wbGVUZXh0dXJlKHNhbXBsZXIyRCB0ZXh0dXJlU2FtcGxlciwgdmVjMiB1dikge1xuICAgICAgcmV0dXJuICR7Z2xzbC50ZXh0dXJlMkR9KHRleHR1cmVTYW1wbGVyLCB1dikucjtcbiAgICB9XG4gIGA7XG59XG5cbmZ1bmN0aW9uIGdldEZsb2F0VGV4dHVyZVNldFJTbmlwcGV0KGdsc2w6IEdMU0wpOiBzdHJpbmcge1xuICByZXR1cm4gYFxuICAgIHZvaWQgc2V0T3V0cHV0KGZsb2F0IHZhbCkge1xuICAgICAgJHtnbHNsLm91dHB1dH0gPSB2ZWM0KHZhbCwgMCwgMCwgMCk7XG4gICAgfVxuICBgO1xufVxuXG5mdW5jdGlvbiBnZXRGbG9hdFRleHR1cmVTZXRSR0JBU25pcHBldChnbHNsOiBHTFNMKTogc3RyaW5nIHtcbiAgcmV0dXJuIGBcbiAgICB2b2lkIHNldE91dHB1dCh2ZWM0IHZhbCkge1xuICAgICAgJHtnbHNsLm91dHB1dH0gPSB2YWw7XG4gICAgfVxuICBgO1xufVxuXG5mdW5jdGlvbiBnZXRTaGFkZXJQcmVmaXgoZ2xzbDogR0xTTCk6IHN0cmluZyB7XG4gIGNvbnN0IFNIQURFUl9QUkVGSVggPSBgJHtnbHNsLnZlcnNpb259XG4gICAgcHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xuICAgIHByZWNpc2lvbiBoaWdocCBpbnQ7XG4gICAgcHJlY2lzaW9uIGhpZ2hwIHNhbXBsZXIyRDtcbiAgICAke2dsc2wudmFyeWluZ0ZzfSB2ZWMyIHJlc3VsdFVWO1xuICAgICR7Z2xzbC5kZWZpbmVPdXRwdXR9XG4gICAgY29uc3QgdmVjMiBoYWxmQ1IgPSB2ZWMyKDAuNSwgMC41KTtcblxuICAgIHN0cnVjdCBpdmVjNVxuICAgIHtcbiAgICAgIGludCB4O1xuICAgICAgaW50IHk7XG4gICAgICBpbnQgejtcbiAgICAgIGludCB3O1xuICAgICAgaW50IHU7XG4gICAgfTtcblxuICAgIHN0cnVjdCBpdmVjNlxuICAgIHtcbiAgICAgIGludCB4O1xuICAgICAgaW50IHk7XG4gICAgICBpbnQgejtcbiAgICAgIGludCB3O1xuICAgICAgaW50IHU7XG4gICAgICBpbnQgdjtcbiAgICB9O1xuXG4gICAgdW5pZm9ybSBmbG9hdCBOQU47XG4gICAgJHtnbHNsLmRlZmluZVNwZWNpYWxOYU59XG4gICAgJHtnbHNsLmRlZmluZVNwZWNpYWxJbmZ9XG4gICAgJHtnbHNsLmRlZmluZVJvdW5kfVxuXG4gICAgaW50IGltb2QoaW50IHgsIGludCB5KSB7XG4gICAgICByZXR1cm4geCAtIHkgKiAoeCAvIHkpO1xuICAgIH1cblxuICAgIGludCBpZGl2KGludCBhLCBpbnQgYiwgZmxvYXQgc2lnbikge1xuICAgICAgaW50IHJlcyA9IGEgLyBiO1xuICAgICAgaW50IG1vZCA9IGltb2QoYSwgYik7XG4gICAgICBpZiAoc2lnbiA8IDAuICYmIG1vZCAhPSAwKSB7XG4gICAgICAgIHJlcyAtPSAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICAvL0Jhc2VkIG9uIHRoZSB3b3JrIG9mIERhdmUgSG9za2luc1xuICAgIC8vaHR0cHM6Ly93d3cuc2hhZGVydG95LmNvbS92aWV3LzRkalNSV1xuICAgICNkZWZpbmUgSEFTSFNDQUxFMSA0NDMuODk3NVxuICAgIGZsb2F0IHJhbmRvbShmbG9hdCBzZWVkKXtcbiAgICAgIHZlYzIgcCA9IHJlc3VsdFVWICogc2VlZDtcbiAgICAgIHZlYzMgcDMgID0gZnJhY3QodmVjMyhwLnh5eCkgKiBIQVNIU0NBTEUxKTtcbiAgICAgIHAzICs9IGRvdChwMywgcDMueXp4ICsgMTkuMTkpO1xuICAgICAgcmV0dXJuIGZyYWN0KChwMy54ICsgcDMueSkgKiBwMy56KTtcbiAgICB9XG5cbiAgICAke1NBTVBMRV8xRF9TTklQUEVUfVxuICAgICR7U0FNUExFXzJEX1NOSVBQRVR9XG4gICAgJHtTQU1QTEVfM0RfU05JUFBFVH1cbiAgYDtcblxuICByZXR1cm4gU0hBREVSX1BSRUZJWDtcbn1cblxuY29uc3QgU0FNUExFXzFEX1NOSVBQRVQgPSBgXG52ZWMyIHV2RnJvbUZsYXQoaW50IHRleE51bVIsIGludCB0ZXhOdW1DLCBpbnQgaW5kZXgpIHtcbiAgaW50IHRleFIgPSBpbmRleCAvIHRleE51bUM7XG4gIGludCB0ZXhDID0gaW5kZXggLSB0ZXhSICogdGV4TnVtQztcbiAgcmV0dXJuICh2ZWMyKHRleEMsIHRleFIpICsgaGFsZkNSKSAvIHZlYzIodGV4TnVtQywgdGV4TnVtUik7XG59XG52ZWMyIHBhY2tlZFVWZnJvbTFEKGludCB0ZXhOdW1SLCBpbnQgdGV4TnVtQywgaW50IGluZGV4KSB7XG4gIGludCB0ZXhlbEluZGV4ID0gaW5kZXggLyAyO1xuICBpbnQgdGV4UiA9IHRleGVsSW5kZXggLyB0ZXhOdW1DO1xuICBpbnQgdGV4QyA9IHRleGVsSW5kZXggLSB0ZXhSICogdGV4TnVtQztcbiAgcmV0dXJuICh2ZWMyKHRleEMsIHRleFIpICsgaGFsZkNSKSAvIHZlYzIodGV4TnVtQywgdGV4TnVtUik7XG59XG5gO1xuXG5jb25zdCBTQU1QTEVfMkRfU05JUFBFVCA9IGBcbnZlYzIgcGFja2VkVVZmcm9tMkQoaW50IHRleGVsc0luTG9naWNhbFJvdywgaW50IHRleE51bVIsXG4gIGludCB0ZXhOdW1DLCBpbnQgcm93LCBpbnQgY29sKSB7XG4gIGludCB0ZXhlbEluZGV4ID0gKHJvdyAvIDIpICogdGV4ZWxzSW5Mb2dpY2FsUm93ICsgKGNvbCAvIDIpO1xuICBpbnQgdGV4UiA9IHRleGVsSW5kZXggLyB0ZXhOdW1DO1xuICBpbnQgdGV4QyA9IHRleGVsSW5kZXggLSB0ZXhSICogdGV4TnVtQztcbiAgcmV0dXJuICh2ZWMyKHRleEMsIHRleFIpICsgaGFsZkNSKSAvIHZlYzIodGV4TnVtQywgdGV4TnVtUik7XG59XG5gO1xuXG5jb25zdCBTQU1QTEVfM0RfU05JUFBFVCA9IGBcbnZlYzIgcGFja2VkVVZmcm9tM0QoaW50IHRleE51bVIsIGludCB0ZXhOdW1DLFxuICAgIGludCB0ZXhlbHNJbkJhdGNoLCBpbnQgdGV4ZWxzSW5Mb2dpY2FsUm93LCBpbnQgYixcbiAgICBpbnQgcm93LCBpbnQgY29sKSB7XG4gIGludCBpbmRleCA9IGIgKiB0ZXhlbHNJbkJhdGNoICsgKHJvdyAvIDIpICogdGV4ZWxzSW5Mb2dpY2FsUm93ICsgKGNvbCAvIDIpO1xuICBpbnQgdGV4UiA9IGluZGV4IC8gdGV4TnVtQztcbiAgaW50IHRleEMgPSBpbmRleCAtIHRleFIgKiB0ZXhOdW1DO1xuICByZXR1cm4gKHZlYzIodGV4QywgdGV4UikgKyBoYWxmQ1IpIC8gdmVjMih0ZXhOdW1DLCB0ZXhOdW1SKTtcbn1cbmA7XG5cbmNvbnN0IFNIQURFUl9QQUNLRURfUFJFRklYID0gYFxuICBmbG9hdCBnZXRDaGFubmVsKHZlYzQgZnJhZywgdmVjMiBpbm5lckRpbXMpIHtcbiAgICB2ZWMyIG1vZENvb3JkID0gbW9kKGlubmVyRGltcywgMi4pO1xuICAgIHJldHVybiBtb2RDb29yZC54ID09IDAuID9cbiAgICAgIChtb2RDb29yZC55ID09IDAuID8gZnJhZy5yIDogZnJhZy5nKSA6XG4gICAgICAobW9kQ29vcmQueSA9PSAwLiA/IGZyYWcuYiA6IGZyYWcuYSk7XG4gIH1cbiAgZmxvYXQgZ2V0Q2hhbm5lbCh2ZWM0IGZyYWcsIGludCBkaW0pIHtcbiAgICBmbG9hdCBtb2RDb29yZCA9IG1vZChmbG9hdChkaW0pLCAyLik7XG4gICAgcmV0dXJuIG1vZENvb3JkID09IDAuID8gZnJhZy5yIDogZnJhZy5nO1xuICB9XG5gO1xuXG5mdW5jdGlvbiBnZXRPdXRwdXRTY2FsYXJDb29yZHMoKSB7XG4gIHJldHVybiBgXG4gICAgaW50IGdldE91dHB1dENvb3JkcygpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgYDtcbn1cblxuZnVuY3Rpb24gZ2V0T3V0cHV0UGFja2VkMURDb29yZHMoXG4gICAgc2hhcGU6IFtudW1iZXJdLCB0ZXhTaGFwZTogW251bWJlciwgbnVtYmVyXSxcbiAgICBlbmFibGVTaGFwZVVuaWZvcm1zOiBib29sZWFuKTogc3RyaW5nIHtcbiAgY29uc3QgcGFja2VkVGV4U2hhcGUgPVxuICAgICAgW01hdGguY2VpbCh0ZXhTaGFwZVswXSAvIDIpLCBNYXRoLmNlaWwodGV4U2hhcGVbMV0gLyAyKV07XG4gIGlmIChwYWNrZWRUZXhTaGFwZVswXSA9PT0gMSkge1xuICAgIGlmIChlbmFibGVTaGFwZVVuaWZvcm1zKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgaW50IGdldE91dHB1dENvb3JkcygpIHtcbiAgICAgICAgcmV0dXJuIDIgKiBpbnQocmVzdWx0VVYueCAqIGNlaWwoZmxvYXQob3V0VGV4U2hhcGVbMV0pIC8gMi4wKSk7XG4gICAgICB9XG4gICAgYDtcbiAgICB9XG5cbiAgICByZXR1cm4gYFxuICAgICAgaW50IGdldE91dHB1dENvb3JkcygpIHtcbiAgICAgICAgcmV0dXJuIDIgKiBpbnQocmVzdWx0VVYueCAqICR7cGFja2VkVGV4U2hhcGVbMV19LjApO1xuICAgICAgfVxuICAgIGA7XG4gIH1cblxuICBpZiAocGFja2VkVGV4U2hhcGVbMV0gPT09IDEpIHtcbiAgICBpZiAoZW5hYmxlU2hhcGVVbmlmb3Jtcykge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIGludCBnZXRPdXRwdXRDb29yZHMoKSB7XG4gICAgICAgIHJldHVybiAyICogaW50KHJlc3VsdFVWLnkgKiBjZWlsKGZsb2F0KG91dFRleFNoYXBlWzBdKSAvIDIuMCkpO1xuICAgICAgfVxuICAgIGA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGBcbiAgICAgIGludCBnZXRPdXRwdXRDb29yZHMoKSB7XG4gICAgICAgIHJldHVybiAyICogaW50KHJlc3VsdFVWLnkgKiAke3BhY2tlZFRleFNoYXBlWzBdfS4wKTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG5cbiAgaWYgKGVuYWJsZVNoYXBlVW5pZm9ybXMpIHtcbiAgICByZXR1cm4gYFxuICAgIGludCBnZXRPdXRwdXRDb29yZHMoKSB7XG4gICAgICBpdmVjMiBwYWNrZWRUZXhTaGFwZSA9IGl2ZWMyKGNlaWwoZmxvYXQob3V0VGV4U2hhcGVbMF0pIC8gMi4wKSwgY2VpbChmbG9hdChvdXRUZXhTaGFwZVsxXSkgLyAyLjApKTtcbiAgICAgIGl2ZWMyIHJlc1RleFJDID0gaXZlYzIocmVzdWx0VVYueXggKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZWMyKHBhY2tlZFRleFNoYXBlWzBdLCBwYWNrZWRUZXhTaGFwZVsxXSkpO1xuICAgICAgcmV0dXJuIDIgKiAocmVzVGV4UkMueCAqIHBhY2tlZFRleFNoYXBlWzFdICsgcmVzVGV4UkMueSk7XG4gICAgfVxuICBgO1xuICB9XG5cbiAgcmV0dXJuIGBcbiAgICBpbnQgZ2V0T3V0cHV0Q29vcmRzKCkge1xuICAgICAgaXZlYzIgcmVzVGV4UkMgPSBpdmVjMihyZXN1bHRVVi55eCAqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlYzIoJHtwYWNrZWRUZXhTaGFwZVswXX0sICR7cGFja2VkVGV4U2hhcGVbMV19KSk7XG4gICAgICByZXR1cm4gMiAqIChyZXNUZXhSQy54ICogJHtwYWNrZWRUZXhTaGFwZVsxXX0gKyByZXNUZXhSQy55KTtcbiAgICB9XG4gIGA7XG59XG5cbmZ1bmN0aW9uIGdldE91dHB1dDFEQ29vcmRzKFxuICAgIHNoYXBlOiBbbnVtYmVyXSwgdGV4U2hhcGU6IFtudW1iZXIsIG51bWJlcl0sXG4gICAgZW5hYmxlU2hhcGVVbmlmb3JtczogYm9vbGVhbik6IHN0cmluZyB7XG4gIGlmICh0ZXhTaGFwZVswXSA9PT0gMSkge1xuICAgIGlmIChlbmFibGVTaGFwZVVuaWZvcm1zKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgaW50IGdldE91dHB1dENvb3JkcygpIHtcbiAgICAgICAgcmV0dXJuIGludChyZXN1bHRVVi54ICogZmxvYXQob3V0VGV4U2hhcGVbMV0pKTtcbiAgICAgIH1cbiAgICBgO1xuICAgIH1cbiAgICByZXR1cm4gYFxuICAgICAgaW50IGdldE91dHB1dENvb3JkcygpIHtcbiAgICAgICAgcmV0dXJuIGludChyZXN1bHRVVi54ICogJHt0ZXhTaGFwZVsxXX0uMCk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxuICBpZiAodGV4U2hhcGVbMV0gPT09IDEpIHtcbiAgICBpZiAoZW5hYmxlU2hhcGVVbmlmb3Jtcykge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIGludCBnZXRPdXRwdXRDb29yZHMoKSB7XG4gICAgICAgIHJldHVybiBpbnQocmVzdWx0VVYueSAqIGZsb2F0KG91dFRleFNoYXBlWzBdKSk7XG4gICAgICB9XG4gICAgYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcbiAgICAgIGludCBnZXRPdXRwdXRDb29yZHMoKSB7XG4gICAgICAgIHJldHVybiBpbnQocmVzdWx0VVYueSAqICR7dGV4U2hhcGVbMF19LjApO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbiAgaWYgKGVuYWJsZVNoYXBlVW5pZm9ybXMpIHtcbiAgICByZXR1cm4gYFxuICAgIGludCBnZXRPdXRwdXRDb29yZHMoKSB7XG4gICAgICBpdmVjMiByZXNUZXhSQyA9IGl2ZWMyKHJlc3VsdFVWLnl4ICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVjMihvdXRUZXhTaGFwZVswXSwgb3V0VGV4U2hhcGVbMV0pKTtcbiAgICAgIHJldHVybiByZXNUZXhSQy54ICogb3V0VGV4U2hhcGVbMV0gKyByZXNUZXhSQy55O1xuICAgIH1cbiAgYDtcbiAgfVxuICByZXR1cm4gYFxuICAgIGludCBnZXRPdXRwdXRDb29yZHMoKSB7XG4gICAgICBpdmVjMiByZXNUZXhSQyA9IGl2ZWMyKHJlc3VsdFVWLnl4ICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVjMigke3RleFNoYXBlWzBdfSwgJHt0ZXhTaGFwZVsxXX0pKTtcbiAgICAgIHJldHVybiByZXNUZXhSQy54ICogJHt0ZXhTaGFwZVsxXX0gKyByZXNUZXhSQy55O1xuICAgIH1cbiAgYDtcbn1cblxuZnVuY3Rpb24gZ2V0T3V0cHV0UGFja2VkM0RDb29yZHMoXG4gICAgc2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSwgdGV4U2hhcGU6IFtudW1iZXIsIG51bWJlcl0sXG4gICAgZW5hYmxlU2hhcGVVbmlmb3JtczogYm9vbGVhbik6IHN0cmluZyB7XG4gIGlmIChlbmFibGVTaGFwZVVuaWZvcm1zKSB7XG4gICAgcmV0dXJuIGBcbiAgICBpdmVjMyBnZXRPdXRwdXRDb29yZHMoKSB7XG4gICAgICBpdmVjMiBwYWNrZWRUZXhTaGFwZSA9IGl2ZWMyKGNlaWwoZmxvYXQob3V0VGV4U2hhcGVbMF0pIC8gMi4wKSwgY2VpbChmbG9hdChvdXRUZXhTaGFwZVsxXSkgLyAyLjApKTtcbiAgICAgIGludCB0ZXhlbHNJbkxvZ2ljYWxSb3cgPSBpbnQoY2VpbChmbG9hdChvdXRTaGFwZVsyXSkgLyAyLjApKTtcbiAgICAgIGludCB0ZXhlbHNJbkJhdGNoID0gdGV4ZWxzSW5Mb2dpY2FsUm93ICogaW50KGNlaWwoZmxvYXQob3V0U2hhcGVbMV0pIC8gMi4wKSk7XG4gICAgICBpdmVjMiByZXNUZXhSQyA9IGl2ZWMyKHJlc3VsdFVWLnl4ICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVjMihwYWNrZWRUZXhTaGFwZVswXSwgcGFja2VkVGV4U2hhcGVbMV0pKTtcbiAgICAgIGludCBpbmRleCA9IHJlc1RleFJDLnggKiBwYWNrZWRUZXhTaGFwZVsxXSArIHJlc1RleFJDLnk7XG5cbiAgICAgIGludCBiID0gaW5kZXggLyB0ZXhlbHNJbkJhdGNoO1xuICAgICAgaW5kZXggLT0gYiAqIHRleGVsc0luQmF0Y2g7XG5cbiAgICAgIGludCByID0gMiAqIChpbmRleCAvIHRleGVsc0luTG9naWNhbFJvdyk7XG4gICAgICBpbnQgYyA9IGltb2QoaW5kZXgsIHRleGVsc0luTG9naWNhbFJvdykgKiAyO1xuXG4gICAgICByZXR1cm4gaXZlYzMoYiwgciwgYyk7XG4gICAgfVxuICBgO1xuICB9XG5cbiAgY29uc3QgcGFja2VkVGV4U2hhcGUgPVxuICAgICAgW01hdGguY2VpbCh0ZXhTaGFwZVswXSAvIDIpLCBNYXRoLmNlaWwodGV4U2hhcGVbMV0gLyAyKV07XG4gIGNvbnN0IHRleGVsc0luTG9naWNhbFJvdyA9IE1hdGguY2VpbChzaGFwZVsyXSAvIDIpO1xuICBjb25zdCB0ZXhlbHNJbkJhdGNoID0gdGV4ZWxzSW5Mb2dpY2FsUm93ICogTWF0aC5jZWlsKHNoYXBlWzFdIC8gMik7XG5cbiAgcmV0dXJuIGBcbiAgICBpdmVjMyBnZXRPdXRwdXRDb29yZHMoKSB7XG4gICAgICBpdmVjMiByZXNUZXhSQyA9IGl2ZWMyKHJlc3VsdFVWLnl4ICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVjMigke3BhY2tlZFRleFNoYXBlWzBdfSwgJHtwYWNrZWRUZXhTaGFwZVsxXX0pKTtcbiAgICAgIGludCBpbmRleCA9IHJlc1RleFJDLnggKiAke3BhY2tlZFRleFNoYXBlWzFdfSArIHJlc1RleFJDLnk7XG5cbiAgICAgIGludCBiID0gaW5kZXggLyAke3RleGVsc0luQmF0Y2h9O1xuICAgICAgaW5kZXggLT0gYiAqICR7dGV4ZWxzSW5CYXRjaH07XG5cbiAgICAgIGludCByID0gMiAqIChpbmRleCAvICR7dGV4ZWxzSW5Mb2dpY2FsUm93fSk7XG4gICAgICBpbnQgYyA9IGltb2QoaW5kZXgsICR7dGV4ZWxzSW5Mb2dpY2FsUm93fSkgKiAyO1xuXG4gICAgICByZXR1cm4gaXZlYzMoYiwgciwgYyk7XG4gICAgfVxuICBgO1xufVxuXG5mdW5jdGlvbiBnZXRPdXRwdXQzRENvb3JkcyhcbiAgICBzaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdLCB0ZXhTaGFwZTogW251bWJlciwgbnVtYmVyXSxcbiAgICBlbmFibGVTaGFwZVVuaWZvcm1zOiBib29sZWFuKTogc3RyaW5nIHtcbiAgaWYgKGVuYWJsZVNoYXBlVW5pZm9ybXMpIHtcbiAgICBjb25zdCBjb29yZHNGcm9tSW5kZXhTbmlwcGV0ID1cbiAgICAgICAgc2hhZGVyX3V0aWwuZ2V0T3V0cHV0TG9naWNhbENvb3JkaW5hdGVzRnJvbUZsYXRJbmRleEJ5VW5pZm9ybShcbiAgICAgICAgICAgIFsncicsICdjJywgJ2QnXSwgc2hhcGUpO1xuXG4gICAgcmV0dXJuIGBcbiAgaXZlYzMgZ2V0T3V0cHV0Q29vcmRzKCkge1xuICAgIGl2ZWMyIHJlc1RleFJDID0gaXZlYzIocmVzdWx0VVYueXggKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVjMihvdXRUZXhTaGFwZVswXSwgb3V0VGV4U2hhcGVbMV0pKTtcbiAgICBpbnQgaW5kZXggPSByZXNUZXhSQy54ICogb3V0VGV4U2hhcGVbMV0gKyByZXNUZXhSQy55O1xuICAgICR7Y29vcmRzRnJvbUluZGV4U25pcHBldH1cbiAgICByZXR1cm4gaXZlYzMociwgYywgZCk7XG4gIH1cbmA7XG4gIH1cbiAgY29uc3QgY29vcmRzRnJvbUluZGV4U25pcHBldCA9XG4gICAgICBzaGFkZXJfdXRpbC5nZXRMb2dpY2FsQ29vcmRpbmF0ZXNGcm9tRmxhdEluZGV4KFsncicsICdjJywgJ2QnXSwgc2hhcGUpO1xuXG4gIHJldHVybiBgXG4gICAgaXZlYzMgZ2V0T3V0cHV0Q29vcmRzKCkge1xuICAgICAgaXZlYzIgcmVzVGV4UkMgPSBpdmVjMihyZXN1bHRVVi55eCAqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlYzIoJHt0ZXhTaGFwZVswXX0sICR7dGV4U2hhcGVbMV19KSk7XG4gICAgICBpbnQgaW5kZXggPSByZXNUZXhSQy54ICogJHt0ZXhTaGFwZVsxXX0gKyByZXNUZXhSQy55O1xuICAgICAgJHtjb29yZHNGcm9tSW5kZXhTbmlwcGV0fVxuICAgICAgcmV0dXJuIGl2ZWMzKHIsIGMsIGQpO1xuICAgIH1cbiAgYDtcbn1cblxuZnVuY3Rpb24gZ2V0T3V0cHV0UGFja2VkTkRDb29yZHMoXG4gICAgc2hhcGU6IG51bWJlcltdLCB0ZXhTaGFwZTogW251bWJlciwgbnVtYmVyXSxcbiAgICBlbmFibGVTaGFwZVVuaWZvcm1zOiBib29sZWFuKTogc3RyaW5nIHtcbiAgaWYgKGVuYWJsZVNoYXBlVW5pZm9ybXMpIHtcbiAgICAvLyBUT0RPOiBzdXBwb3J0IDVkIGFuZCA2ZFxuICAgIHJldHVybiBgXG4gICAgaXZlYzQgZ2V0T3V0cHV0Q29vcmRzKCkge1xuICAgICAgaXZlYzIgcGFja2VkVGV4U2hhcGUgPSBpdmVjMihjZWlsKGZsb2F0KG91dFRleFNoYXBlWzBdKSAvIDIuMCksIGNlaWwoZmxvYXQob3V0VGV4U2hhcGVbMV0pIC8gMi4wKSk7XG4gICAgICBpdmVjMiByZXNUZXhSQyA9IGl2ZWMyKHJlc3VsdFVWLnl4ICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVjMihwYWNrZWRUZXhTaGFwZVswXSwgcGFja2VkVGV4U2hhcGVbMV0pKTtcbiAgICAgIGludCBpbmRleCA9IHJlc1RleFJDLnggKiBwYWNrZWRUZXhTaGFwZVsxXSArIHJlc1RleFJDLnk7XG5cbiAgICAgIGludCB0ZXhlbHNJbkxvZ2ljYWxSb3cgPSBpbnQoY2VpbChmbG9hdChvdXRTaGFwZVszXSkgLyAyLjApKTtcbiAgICAgIGludCB0ZXhlbHNJbkJhdGNoID0gdGV4ZWxzSW5Mb2dpY2FsUm93ICogaW50KGNlaWwoZmxvYXQob3V0U2hhcGVbMl0pIC8gMi4wKSk7XG4gICAgICBpbnQgdGV4ZWxzSW5CYXRjaE4gPSB0ZXhlbHNJbkJhdGNoICogb3V0U2hhcGVbMV07XG5cbiAgICAgIGludCBiMiA9IGluZGV4IC8gdGV4ZWxzSW5CYXRjaE47XG4gICAgICBpbmRleCAtPSBiMiAqIHRleGVsc0luQmF0Y2hOO1xuXG4gICAgICBpbnQgYiA9IGluZGV4IC8gdGV4ZWxzSW5CYXRjaDtcbiAgICAgIGluZGV4IC09IGIgKiB0ZXhlbHNJbkJhdGNoO1xuXG4gICAgICBpbnQgciA9IDIgKiAoaW5kZXggLyB0ZXhlbHNJbkxvZ2ljYWxSb3cpO1xuICAgICAgaW50IGMgPSBpbW9kKGluZGV4LCB0ZXhlbHNJbkxvZ2ljYWxSb3cpICogMjtcblxuICAgICAgcmV0dXJuIGl2ZWM0KGIyLCBiLCByLCBjKTtcbiAgICB9XG4gIGA7XG4gIH1cbiAgY29uc3QgcGFja2VkVGV4U2hhcGUgPVxuICAgICAgW01hdGguY2VpbCh0ZXhTaGFwZVswXSAvIDIpLCBNYXRoLmNlaWwodGV4U2hhcGVbMV0gLyAyKV07XG5cbiAgY29uc3QgdGV4ZWxzSW5Mb2dpY2FsUm93ID0gTWF0aC5jZWlsKHNoYXBlW3NoYXBlLmxlbmd0aCAtIDFdIC8gMik7XG4gIGNvbnN0IHRleGVsc0luQmF0Y2ggPVxuICAgICAgdGV4ZWxzSW5Mb2dpY2FsUm93ICogTWF0aC5jZWlsKHNoYXBlW3NoYXBlLmxlbmd0aCAtIDJdIC8gMik7XG4gIGxldCB0ZXhlbHNJbkJhdGNoTiA9IHRleGVsc0luQmF0Y2g7XG4gIGxldCBiYXRjaGVzID0gYGA7XG4gIGxldCBjb29yZHMgPSAnYiwgciwgYyc7XG5cbiAgZm9yIChsZXQgYiA9IDI7IGIgPCBzaGFwZS5sZW5ndGggLSAxOyBiKyspIHtcbiAgICB0ZXhlbHNJbkJhdGNoTiAqPSBzaGFwZVtzaGFwZS5sZW5ndGggLSBiIC0gMV07XG4gICAgYmF0Y2hlcyA9IGBcbiAgICAgIGludCBiJHtifSA9IGluZGV4IC8gJHt0ZXhlbHNJbkJhdGNoTn07XG4gICAgICBpbmRleCAtPSBiJHtifSAqICR7dGV4ZWxzSW5CYXRjaE59O1xuICAgIGAgKyBiYXRjaGVzO1xuICAgIGNvb3JkcyA9IGBiJHtifSwgYCArIGNvb3JkcztcbiAgfVxuXG4gIHJldHVybiBgXG4gICAgaXZlYyR7c2hhcGUubGVuZ3RofSBnZXRPdXRwdXRDb29yZHMoKSB7XG4gICAgICBpdmVjMiByZXNUZXhSQyA9IGl2ZWMyKHJlc3VsdFVWLnl4ICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVjMigke3BhY2tlZFRleFNoYXBlWzBdfSwgJHtwYWNrZWRUZXhTaGFwZVsxXX0pKTtcbiAgICAgIGludCBpbmRleCA9IHJlc1RleFJDLnggKiAke3BhY2tlZFRleFNoYXBlWzFdfSArIHJlc1RleFJDLnk7XG5cbiAgICAgICR7YmF0Y2hlc31cblxuICAgICAgaW50IGIgPSBpbmRleCAvICR7dGV4ZWxzSW5CYXRjaH07XG4gICAgICBpbmRleCAtPSBiICogJHt0ZXhlbHNJbkJhdGNofTtcblxuICAgICAgaW50IHIgPSAyICogKGluZGV4IC8gJHt0ZXhlbHNJbkxvZ2ljYWxSb3d9KTtcbiAgICAgIGludCBjID0gaW1vZChpbmRleCwgJHt0ZXhlbHNJbkxvZ2ljYWxSb3d9KSAqIDI7XG5cbiAgICAgIHJldHVybiBpdmVjJHtzaGFwZS5sZW5ndGh9KCR7Y29vcmRzfSk7XG4gICAgfVxuICBgO1xufVxuXG5mdW5jdGlvbiBnZXRPdXRwdXQ0RENvb3JkcyhcbiAgICBzaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sIHRleFNoYXBlOiBbbnVtYmVyLCBudW1iZXJdLFxuICAgIGVuYWJsZVNoYXBlVW5pZm9ybXM6IGJvb2xlYW4pOiBzdHJpbmcge1xuICBpZiAoZW5hYmxlU2hhcGVVbmlmb3Jtcykge1xuICAgIGNvbnN0IGNvb3Jkc0Zyb21JbmRleFNuaXBwZXQgPVxuICAgICAgICBzaGFkZXJfdXRpbC5nZXRPdXRwdXRMb2dpY2FsQ29vcmRpbmF0ZXNGcm9tRmxhdEluZGV4QnlVbmlmb3JtKFxuICAgICAgICAgICAgWydyJywgJ2MnLCAnZCcsICdkMiddLCBzaGFwZSk7XG5cbiAgICByZXR1cm4gYFxuICAgIGl2ZWM0IGdldE91dHB1dENvb3JkcygpIHtcbiAgICAgIGl2ZWMyIHJlc1RleFJDID0gaXZlYzIocmVzdWx0VVYueXggKlxuICAgICAgICB2ZWMyKG91dFRleFNoYXBlWzBdLCBvdXRUZXhTaGFwZVsxXSkpO1xuICAgICAgaW50IGluZGV4ID0gcmVzVGV4UkMueCAqIG91dFRleFNoYXBlWzFdICsgcmVzVGV4UkMueTtcbiAgICAgICR7Y29vcmRzRnJvbUluZGV4U25pcHBldH1cbiAgICAgIHJldHVybiBpdmVjNChyLCBjLCBkLCBkMik7XG4gICAgfVxuICBgO1xuICB9XG4gIGNvbnN0IGNvb3Jkc0Zyb21JbmRleFNuaXBwZXQgPSBzaGFkZXJfdXRpbC5nZXRMb2dpY2FsQ29vcmRpbmF0ZXNGcm9tRmxhdEluZGV4KFxuICAgICAgWydyJywgJ2MnLCAnZCcsICdkMiddLCBzaGFwZSk7XG5cbiAgcmV0dXJuIGBcbiAgICBpdmVjNCBnZXRPdXRwdXRDb29yZHMoKSB7XG4gICAgICBpdmVjMiByZXNUZXhSQyA9IGl2ZWMyKHJlc3VsdFVWLnl4ICpcbiAgICAgICAgdmVjMigke3RleFNoYXBlWzBdfSwgJHt0ZXhTaGFwZVsxXX0pKTtcbiAgICAgIGludCBpbmRleCA9IHJlc1RleFJDLnggKiAke3RleFNoYXBlWzFdfSArIHJlc1RleFJDLnk7XG4gICAgICAke2Nvb3Jkc0Zyb21JbmRleFNuaXBwZXR9XG4gICAgICByZXR1cm4gaXZlYzQociwgYywgZCwgZDIpO1xuICAgIH1cbiAgYDtcbn1cblxuZnVuY3Rpb24gZ2V0T3V0cHV0NURDb29yZHMoXG4gICAgc2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sXG4gICAgdGV4U2hhcGU6IFtudW1iZXIsIG51bWJlcl0pOiBzdHJpbmcge1xuICBjb25zdCBjb29yZHNGcm9tSW5kZXhTbmlwcGV0ID0gc2hhZGVyX3V0aWwuZ2V0TG9naWNhbENvb3JkaW5hdGVzRnJvbUZsYXRJbmRleChcbiAgICAgIFsncicsICdjJywgJ2QnLCAnZDInLCAnZDMnXSwgc2hhcGUpO1xuXG4gIHJldHVybiBgXG4gICAgaXZlYzUgZ2V0T3V0cHV0Q29vcmRzKCkge1xuICAgICAgaXZlYzIgcmVzVGV4UkMgPSBpdmVjMihyZXN1bHRVVi55eCAqIHZlYzIoJHt0ZXhTaGFwZVswXX0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7dGV4U2hhcGVbMV19KSk7XG5cbiAgICAgIGludCBpbmRleCA9IHJlc1RleFJDLnggKiAke3RleFNoYXBlWzFdfSArIHJlc1RleFJDLnk7XG5cbiAgICAgICR7Y29vcmRzRnJvbUluZGV4U25pcHBldH1cblxuICAgICAgaXZlYzUgb3V0U2hhcGUgPSBpdmVjNShyLCBjLCBkLCBkMiwgZDMpO1xuICAgICAgcmV0dXJuIG91dFNoYXBlO1xuICAgIH1cbiAgYDtcbn1cblxuZnVuY3Rpb24gZ2V0T3V0cHV0NkRDb29yZHMoXG4gICAgc2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcbiAgICB0ZXhTaGFwZTogW251bWJlciwgbnVtYmVyXSk6IHN0cmluZyB7XG4gIGNvbnN0IGNvb3Jkc0Zyb21JbmRleFNuaXBwZXQgPSBzaGFkZXJfdXRpbC5nZXRMb2dpY2FsQ29vcmRpbmF0ZXNGcm9tRmxhdEluZGV4KFxuICAgICAgWydyJywgJ2MnLCAnZCcsICdkMicsICdkMycsICdkNCddLCBzaGFwZSk7XG5cbiAgcmV0dXJuIGBcbiAgICBpdmVjNiBnZXRPdXRwdXRDb29yZHMoKSB7XG4gICAgICBpdmVjMiByZXNUZXhSQyA9IGl2ZWMyKHJlc3VsdFVWLnl4ICpcbiAgICAgICAgdmVjMigke3RleFNoYXBlWzBdfSwgJHt0ZXhTaGFwZVsxXX0pKTtcbiAgICAgIGludCBpbmRleCA9IHJlc1RleFJDLnggKiAke3RleFNoYXBlWzFdfSArIHJlc1RleFJDLnk7XG5cbiAgICAgICR7Y29vcmRzRnJvbUluZGV4U25pcHBldH1cblxuICAgICAgaXZlYzYgcmVzdWx0ID0gaXZlYzYociwgYywgZCwgZDIsIGQzLCBkNCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgYDtcbn1cblxuZnVuY3Rpb24gZ2V0T3V0cHV0UGFja2VkMkRDb29yZHMoXG4gICAgc2hhcGU6IFtudW1iZXIsIG51bWJlcl0sIHRleFNoYXBlOiBbbnVtYmVyLCBudW1iZXJdLFxuICAgIGVuYWJsZVNoYXBlVW5pZm9ybXM6IGJvb2xlYW4pOiBzdHJpbmcge1xuICBjb25zdCBwYWNrZWRUZXhTaGFwZSA9XG4gICAgICBbTWF0aC5jZWlsKHRleFNoYXBlWzBdIC8gMiksIE1hdGguY2VpbCh0ZXhTaGFwZVsxXSAvIDIpXTtcbiAgaWYgKHV0aWwuYXJyYXlzRXF1YWwoc2hhcGUsIHRleFNoYXBlKSkge1xuICAgIGlmIChlbmFibGVTaGFwZVVuaWZvcm1zKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgaXZlYzIgZ2V0T3V0cHV0Q29vcmRzKCkge1xuICAgICAgICBpdmVjMiBwYWNrZWRUZXhTaGFwZSA9IGl2ZWMyKGNlaWwoZmxvYXQob3V0VGV4U2hhcGVbMF0pIC8gMi4wKSwgY2VpbChmbG9hdChvdXRUZXhTaGFwZVsxXSkgLyAyLjApKTtcbiAgICAgICAgcmV0dXJuIDIgKiBpdmVjMihyZXN1bHRVVi55eCAqIHZlYzIocGFja2VkVGV4U2hhcGVbMF0sIHBhY2tlZFRleFNoYXBlWzFdKSk7XG4gICAgICB9XG4gICAgYDtcbiAgICB9XG5cbiAgICByZXR1cm4gYFxuICAgICAgaXZlYzIgZ2V0T3V0cHV0Q29vcmRzKCkge1xuICAgICAgICByZXR1cm4gMiAqIGl2ZWMyKHJlc3VsdFVWLnl4ICogdmVjMigke3BhY2tlZFRleFNoYXBlWzBdfSwgJHtcbiAgICAgICAgcGFja2VkVGV4U2hhcGVbMV19KSk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxuXG4gIC8vIHRleGVscyBuZWVkZWQgdG8gYWNjb21tb2RhdGUgYSBsb2dpY2FsIHJvd1xuICBjb25zdCB0ZXhlbHNJbkxvZ2ljYWxSb3cgPSBNYXRoLmNlaWwoc2hhcGVbMV0gLyAyKTtcblxuICAvKipcbiAgICogZ2V0T3V0cHV0Q29vcmRzXG4gICAqXG4gICAqIHJlc1RleFJDOiBUaGUgcm93cyBhbmQgY29sdW1ucyBvZiB0aGUgdGV4ZWxzLiBJZiB5b3UgbW92ZSBvdmVyIG9uZVxuICAgKiB0ZXhlbCB0byB0aGUgcmlnaHQgaW4gdGhlIHBhY2tlZCB0ZXh0dXJlLCB5b3UgYXJlIG1vdmluZyBvdmVyIG9uZSBjb2x1bW5cbiAgICogKG5vdCB0d28pLlxuICAgKlxuICAgKiBpbmRleDogVGhlIHRleGVsIGluZGV4XG4gICAqL1xuICBpZiAoZW5hYmxlU2hhcGVVbmlmb3Jtcykge1xuICAgIHJldHVybiBgXG4gICAgaXZlYzIgZ2V0T3V0cHV0Q29vcmRzKCkge1xuICAgICAgaXZlYzIgcGFja2VkVGV4U2hhcGUgPSBpdmVjMihjZWlsKGZsb2F0KG91dFRleFNoYXBlWzBdKSAvIDIuMCksIGNlaWwoZmxvYXQob3V0VGV4U2hhcGVbMV0pIC8gMi4wKSk7XG4gICAgICBpbnQgdGV4ZWxzSW5Mb2dpY2FsUm93ID0gaW50KGNlaWwoZmxvYXQob3V0U2hhcGVbMV0pIC8gMi4wKSk7XG4gICAgICBpdmVjMiByZXNUZXhSQyA9IGl2ZWMyKHJlc3VsdFVWLnl4ICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVjMihwYWNrZWRUZXhTaGFwZVswXSwgcGFja2VkVGV4U2hhcGVbMV0pKTtcblxuICAgICAgaW50IGluZGV4ID0gcmVzVGV4UkMueCAqIHBhY2tlZFRleFNoYXBlWzFdICsgcmVzVGV4UkMueTtcbiAgICAgIGludCByID0gMiAqIChpbmRleCAvIHRleGVsc0luTG9naWNhbFJvdyk7XG4gICAgICBpbnQgYyA9IGltb2QoaW5kZXgsIHRleGVsc0luTG9naWNhbFJvdykgKiAyO1xuXG4gICAgICByZXR1cm4gaXZlYzIociwgYyk7XG4gICAgfVxuICBgO1xuICB9XG5cbiAgcmV0dXJuIGBcbiAgICBpdmVjMiBnZXRPdXRwdXRDb29yZHMoKSB7XG4gICAgICBpdmVjMiByZXNUZXhSQyA9IGl2ZWMyKHJlc3VsdFVWLnl4ICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVjMigke3BhY2tlZFRleFNoYXBlWzBdfSwgJHtwYWNrZWRUZXhTaGFwZVsxXX0pKTtcblxuICAgICAgaW50IGluZGV4ID0gcmVzVGV4UkMueCAqICR7cGFja2VkVGV4U2hhcGVbMV19ICsgcmVzVGV4UkMueTtcbiAgICAgIGludCByID0gMiAqIChpbmRleCAvICR7dGV4ZWxzSW5Mb2dpY2FsUm93fSk7XG4gICAgICBpbnQgYyA9IGltb2QoaW5kZXgsICR7dGV4ZWxzSW5Mb2dpY2FsUm93fSkgKiAyO1xuXG4gICAgICByZXR1cm4gaXZlYzIociwgYyk7XG4gICAgfVxuICBgO1xufVxuXG5mdW5jdGlvbiBnZXRPdXRwdXQyRENvb3JkcyhcbiAgICBzaGFwZTogW251bWJlciwgbnVtYmVyXSwgdGV4U2hhcGU6IFtudW1iZXIsIG51bWJlcl0sXG4gICAgZW5hYmxlU2hhcGVVbmlmb3JtczogYm9vbGVhbik6IHN0cmluZyB7XG4gIGlmICh1dGlsLmFycmF5c0VxdWFsKHNoYXBlLCB0ZXhTaGFwZSkpIHtcbiAgICBpZiAoZW5hYmxlU2hhcGVVbmlmb3Jtcykge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIGl2ZWMyIGdldE91dHB1dENvb3JkcygpIHtcbiAgICAgICAgcmV0dXJuIGl2ZWMyKHJlc3VsdFVWLnl4ICogdmVjMihvdXRUZXhTaGFwZVswXSwgb3V0VGV4U2hhcGVbMV0pKTtcbiAgICAgIH1cbiAgICBgO1xuICAgIH1cbiAgICByZXR1cm4gYFxuICAgICAgaXZlYzIgZ2V0T3V0cHV0Q29vcmRzKCkge1xuICAgICAgICByZXR1cm4gaXZlYzIocmVzdWx0VVYueXggKiB2ZWMyKCR7dGV4U2hhcGVbMF19LCAke3RleFNoYXBlWzFdfSkpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbiAgaWYgKHNoYXBlWzFdID09PSAxKSB7XG4gICAgaWYgKGVuYWJsZVNoYXBlVW5pZm9ybXMpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICBpdmVjMiBnZXRPdXRwdXRDb29yZHMoKSB7XG4gICAgICAgIGl2ZWMyIHJlc1RleFJDID0gaXZlYzIocmVzdWx0VVYueXggKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlYzIob3V0VGV4U2hhcGVbMF0sIG91dFRleFNoYXBlWzFdKSk7XG4gICAgICAgIGludCBpbmRleCA9IHJlc1RleFJDLnggKiBvdXRUZXhTaGFwZVsxXSArIHJlc1RleFJDLnk7XG4gICAgICAgIHJldHVybiBpdmVjMihpbmRleCwgMCk7XG4gICAgICB9XG4gICAgYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcbiAgICAgIGl2ZWMyIGdldE91dHB1dENvb3JkcygpIHtcbiAgICAgICAgaXZlYzIgcmVzVGV4UkMgPSBpdmVjMihyZXN1bHRVVi55eCAqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVjMigke3RleFNoYXBlWzBdfSwgJHt0ZXhTaGFwZVsxXX0pKTtcbiAgICAgICAgaW50IGluZGV4ID0gcmVzVGV4UkMueCAqICR7dGV4U2hhcGVbMV19ICsgcmVzVGV4UkMueTtcbiAgICAgICAgcmV0dXJuIGl2ZWMyKGluZGV4LCAwKTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG4gIGlmIChzaGFwZVswXSA9PT0gMSkge1xuICAgIGlmIChlbmFibGVTaGFwZVVuaWZvcm1zKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgaXZlYzIgZ2V0T3V0cHV0Q29vcmRzKCkge1xuICAgICAgICBpdmVjMiByZXNUZXhSQyA9IGl2ZWMyKHJlc3VsdFVWLnl4ICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZWMyKG91dFRleFNoYXBlWzBdLCBvdXRUZXhTaGFwZVsxXSkpO1xuICAgICAgICBpbnQgaW5kZXggPSByZXNUZXhSQy54ICogb3V0VGV4U2hhcGVbMV0gKyByZXNUZXhSQy55O1xuICAgICAgICByZXR1cm4gaXZlYzIoMCwgaW5kZXgpO1xuICAgICAgfVxuICAgIGA7XG4gICAgfVxuICAgIHJldHVybiBgXG4gICAgICBpdmVjMiBnZXRPdXRwdXRDb29yZHMoKSB7XG4gICAgICAgIGl2ZWMyIHJlc1RleFJDID0gaXZlYzIocmVzdWx0VVYueXggKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlYzIoJHt0ZXhTaGFwZVswXX0sICR7dGV4U2hhcGVbMV19KSk7XG4gICAgICAgIGludCBpbmRleCA9IHJlc1RleFJDLnggKiAke3RleFNoYXBlWzFdfSArIHJlc1RleFJDLnk7XG4gICAgICAgIHJldHVybiBpdmVjMigwLCBpbmRleCk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxuICBpZiAoZW5hYmxlU2hhcGVVbmlmb3Jtcykge1xuICAgIHJldHVybiBgXG4gICAgaXZlYzIgZ2V0T3V0cHV0Q29vcmRzKCkge1xuICAgICAgaXZlYzIgcmVzVGV4UkMgPSBpdmVjMihyZXN1bHRVVi55eCAqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlYzIob3V0VGV4U2hhcGVbMF0sIG91dFRleFNoYXBlWzFdKSk7XG4gICAgICBpbnQgaW5kZXggPSByZXNUZXhSQy54ICogb3V0VGV4U2hhcGVbMV0gKyByZXNUZXhSQy55O1xuICAgICAgaW50IHIgPSBpbmRleCAvIG91dFNoYXBlWzFdO1xuICAgICAgaW50IGMgPSBpbmRleCAtIHIgKiBvdXRTaGFwZVsxXTtcbiAgICAgIHJldHVybiBpdmVjMihyLCBjKTtcbiAgICB9XG4gIGA7XG4gIH1cbiAgcmV0dXJuIGBcbiAgICBpdmVjMiBnZXRPdXRwdXRDb29yZHMoKSB7XG4gICAgICBpdmVjMiByZXNUZXhSQyA9IGl2ZWMyKHJlc3VsdFVWLnl4ICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVjMigke3RleFNoYXBlWzBdfSwgJHt0ZXhTaGFwZVsxXX0pKTtcbiAgICAgIGludCBpbmRleCA9IHJlc1RleFJDLnggKiAke3RleFNoYXBlWzFdfSArIHJlc1RleFJDLnk7XG4gICAgICBpbnQgciA9IGluZGV4IC8gJHtzaGFwZVsxXX07XG4gICAgICBpbnQgYyA9IGluZGV4IC0gciAqICR7c2hhcGVbMV19O1xuICAgICAgcmV0dXJuIGl2ZWMyKHIsIGMpO1xuICAgIH1cbiAgYDtcbn1cblxuZnVuY3Rpb24gZ2V0RmxhdE9mZnNldFVuaWZvcm1OYW1lKHRleE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBgb2Zmc2V0JHt0ZXhOYW1lfWA7XG59XG5cbmZ1bmN0aW9uIGdldFBhY2tlZFNhbXBsZXJTY2FsYXIoaW5wdXRJbmZvOiBJbnB1dEluZm8pOiBzdHJpbmcge1xuICBjb25zdCB0ZXhOYW1lID0gaW5wdXRJbmZvLm5hbWU7XG4gIGNvbnN0IGZ1bmNOYW1lID0gJ2dldCcgKyB0ZXhOYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGV4TmFtZS5zbGljZSgxKTtcbiAgY29uc3QgZ2xzbCA9IGdldEdsc2xEaWZmZXJlbmNlcygpO1xuICByZXR1cm4gYFxuICAgIHZlYzQgJHtmdW5jTmFtZX0oKSB7XG4gICAgICByZXR1cm4gJHtnbHNsLnRleHR1cmUyRH0oJHt0ZXhOYW1lfSwgaGFsZkNSKTtcbiAgICB9XG4gIGA7XG59XG5cbmZ1bmN0aW9uIGdldFNhbXBsZXJTY2FsYXIoXG4gICAgaW5wdXRJbmZvOiBJbnB1dEluZm8sIGVuYWJsZVNoYXBlVW5pZm9ybXM6IGJvb2xlYW4pOiBzdHJpbmcge1xuICBjb25zdCB0ZXhOYW1lID0gaW5wdXRJbmZvLm5hbWU7XG4gIGNvbnN0IGZ1bmNOYW1lID0gJ2dldCcgKyB0ZXhOYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGV4TmFtZS5zbGljZSgxKTtcbiAgaWYgKGlucHV0SW5mby5zaGFwZUluZm8uaXNVbmlmb3JtKSB7XG4gICAgcmV0dXJuIGBmbG9hdCAke2Z1bmNOYW1lfSgpIHtyZXR1cm4gJHt0ZXhOYW1lfTt9YDtcbiAgfVxuICBjb25zdCBbdGV4TnVtUiwgdGV4TnVtQ10gPSBpbnB1dEluZm8uc2hhcGVJbmZvLnRleFNoYXBlO1xuICBpZiAodGV4TnVtUiA9PT0gMSAmJiB0ZXhOdW1DID09PSAxKSB7XG4gICAgcmV0dXJuIGBcbiAgICAgIGZsb2F0ICR7ZnVuY05hbWV9KCkge1xuICAgICAgICByZXR1cm4gc2FtcGxlVGV4dHVyZSgke3RleE5hbWV9LCBoYWxmQ1IpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cblxuICBjb25zdCBvZmZzZXQgPSBnZXRGbGF0T2Zmc2V0VW5pZm9ybU5hbWUodGV4TmFtZSk7XG4gIGlmIChlbmFibGVTaGFwZVVuaWZvcm1zKSB7XG4gICAgcmV0dXJuIGBcbiAgICBmbG9hdCAke2Z1bmNOYW1lfSgpIHtcbiAgICAgIHZlYzIgdXYgPSB1dkZyb21GbGF0KCR7dGV4TmFtZX1UZXhTaGFwZVswXSwgJHt0ZXhOYW1lfVRleFNoYXBlWzFdLCAke1xuICAgICAgICBvZmZzZXR9KTtcbiAgICAgIHJldHVybiBzYW1wbGVUZXh0dXJlKCR7dGV4TmFtZX0sIHV2KTtcbiAgICB9XG4gIGA7XG4gIH1cblxuICBjb25zdCBbdE51bVIsIHROdW1DXSA9IGlucHV0SW5mby5zaGFwZUluZm8udGV4U2hhcGU7XG4gIHJldHVybiBgXG4gICAgZmxvYXQgJHtmdW5jTmFtZX0oKSB7XG4gICAgICB2ZWMyIHV2ID0gdXZGcm9tRmxhdCgke3ROdW1SfSwgJHt0TnVtQ30sICR7b2Zmc2V0fSk7XG4gICAgICByZXR1cm4gc2FtcGxlVGV4dHVyZSgke3RleE5hbWV9LCB1dik7XG4gICAgfVxuICBgO1xufVxuXG5mdW5jdGlvbiBnZXRQYWNrZWRTYW1wbGVyMUQoXG4gICAgaW5wdXRJbmZvOiBJbnB1dEluZm8sIGVuYWJsZVNoYXBlVW5pZm9ybXM6IGJvb2xlYW4pOiBzdHJpbmcge1xuICBjb25zdCB0ZXhOYW1lID0gaW5wdXRJbmZvLm5hbWU7XG4gIGNvbnN0IGZ1bmNOYW1lID0gJ2dldCcgKyB0ZXhOYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGV4TmFtZS5zbGljZSgxKTtcbiAgY29uc3QgdGV4U2hhcGUgPSBpbnB1dEluZm8uc2hhcGVJbmZvLnRleFNoYXBlO1xuICBjb25zdCBnbHNsID0gZ2V0R2xzbERpZmZlcmVuY2VzKCk7XG4gIGlmIChlbmFibGVTaGFwZVVuaWZvcm1zKSB7XG4gICAgcmV0dXJuIGBcbiAgICB2ZWM0ICR7ZnVuY05hbWV9KGludCBpbmRleCkge1xuICAgICAgaXZlYzIgcGFja2VkVGV4U2hhcGUgPSBpdmVjMihjZWlsKGZsb2F0KCR7XG4gICAgICAgIHRleE5hbWV9VGV4U2hhcGVbMF0pIC8gMi4wKSwgY2VpbChmbG9hdCgke3RleE5hbWV9VGV4U2hhcGVbMV0pIC8gMi4wKSk7XG4gICAgICB2ZWMyIHV2ID0gcGFja2VkVVZmcm9tMUQoXG4gICAgICAgIHBhY2tlZFRleFNoYXBlWzBdLCBwYWNrZWRUZXhTaGFwZVsxXSwgaW5kZXgpO1xuICAgICAgcmV0dXJuICR7Z2xzbC50ZXh0dXJlMkR9KCR7dGV4TmFtZX0sIHV2KTtcbiAgICB9XG4gIGA7XG4gIH1cbiAgY29uc3QgcGFja2VkVGV4U2hhcGUgPVxuICAgICAgW01hdGguY2VpbCh0ZXhTaGFwZVswXSAvIDIpLCBNYXRoLmNlaWwodGV4U2hhcGVbMV0gLyAyKV07XG4gIHJldHVybiBgXG4gICAgdmVjNCAke2Z1bmNOYW1lfShpbnQgaW5kZXgpIHtcbiAgICAgIHZlYzIgdXYgPSBwYWNrZWRVVmZyb20xRChcbiAgICAgICAgJHtwYWNrZWRUZXhTaGFwZVswXX0sICR7cGFja2VkVGV4U2hhcGVbMV19LCBpbmRleCk7XG4gICAgICByZXR1cm4gJHtnbHNsLnRleHR1cmUyRH0oJHt0ZXhOYW1lfSwgdXYpO1xuICAgIH1cbiAgYDtcbn1cblxuZnVuY3Rpb24gZ2V0U2FtcGxlcjFEKFxuICAgIGlucHV0SW5mbzogSW5wdXRJbmZvLCBlbmFibGVTaGFwZVVuaWZvcm1zOiBib29sZWFuKTogc3RyaW5nIHtcbiAgY29uc3QgdGV4TmFtZSA9IGlucHV0SW5mby5uYW1lO1xuICBjb25zdCBmdW5jTmFtZSA9ICdnZXQnICsgdGV4TmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRleE5hbWUuc2xpY2UoMSk7XG5cbiAgaWYgKGlucHV0SW5mby5zaGFwZUluZm8uaXNVbmlmb3JtKSB7XG4gICAgLy8gVW5pZm9ybSBhcnJheXMgd2lsbCBiZSBsZXNzIHRoYW4gNjU1MDUgKG5vIHJpc2sgb2YgZmxvYXQxNiBvdmVyZmxvdykuXG4gICAgcmV0dXJuIGBcbiAgICAgIGZsb2F0ICR7ZnVuY05hbWV9KGludCBpbmRleCkge1xuICAgICAgICAke2dldFVuaWZvcm1TYW1wbGVyKGlucHV0SW5mbyl9XG4gICAgICB9XG4gICAgYDtcbiAgfVxuXG4gIGNvbnN0IHRleFNoYXBlID0gaW5wdXRJbmZvLnNoYXBlSW5mby50ZXhTaGFwZTtcbiAgY29uc3QgdE51bVIgPSB0ZXhTaGFwZVswXTtcbiAgY29uc3QgdE51bUMgPSB0ZXhTaGFwZVsxXTtcblxuICBpZiAodE51bUMgPT09IDEgJiYgdE51bVIgPT09IDEpIHtcbiAgICByZXR1cm4gYFxuICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IGluZGV4KSB7XG4gICAgICAgIHJldHVybiBzYW1wbGVUZXh0dXJlKCR7dGV4TmFtZX0sIGhhbGZDUik7XG4gICAgICB9XG4gICAgYDtcbiAgfVxuICBjb25zdCBvZmZzZXQgPSBnZXRGbGF0T2Zmc2V0VW5pZm9ybU5hbWUodGV4TmFtZSk7XG4gIGlmICh0TnVtQyA9PT0gMSkge1xuICAgIGlmIChlbmFibGVTaGFwZVVuaWZvcm1zKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IGluZGV4KSB7XG4gICAgICAgIHZlYzIgdXYgPSB2ZWMyKDAuNSwgKGZsb2F0KGluZGV4ICsgJHtvZmZzZXR9KSArIDAuNSkgLyBmbG9hdCgke1xuICAgICAgICAgIHRleE5hbWV9VGV4U2hhcGVbMF0pKTtcbiAgICAgICAgcmV0dXJuIHNhbXBsZVRleHR1cmUoJHt0ZXhOYW1lfSwgdXYpO1xuICAgICAgfVxuICAgIGA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGBcbiAgICAgIGZsb2F0ICR7ZnVuY05hbWV9KGludCBpbmRleCkge1xuICAgICAgICB2ZWMyIHV2ID0gdmVjMigwLjUsIChmbG9hdChpbmRleCArICR7b2Zmc2V0fSkgKyAwLjUpIC8gJHt0TnVtUn0uMCk7XG4gICAgICAgIHJldHVybiBzYW1wbGVUZXh0dXJlKCR7dGV4TmFtZX0sIHV2KTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG4gIGlmICh0TnVtUiA9PT0gMSkge1xuICAgIGlmIChlbmFibGVTaGFwZVVuaWZvcm1zKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IGluZGV4KSB7XG4gICAgICAgIHZlYzIgdXYgPSB2ZWMyKChmbG9hdChpbmRleCArICR7b2Zmc2V0fSkgKyAwLjUpIC8gZmxvYXQoJHtcbiAgICAgICAgICB0ZXhOYW1lfVRleFNoYXBlWzFdKSwgMC41KTtcbiAgICAgICAgcmV0dXJuIHNhbXBsZVRleHR1cmUoJHt0ZXhOYW1lfSwgdXYpO1xuICAgICAgfVxuICAgIGA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGBcbiAgICAgIGZsb2F0ICR7ZnVuY05hbWV9KGludCBpbmRleCkge1xuICAgICAgICB2ZWMyIHV2ID0gdmVjMigoZmxvYXQoaW5kZXggKyAke29mZnNldH0pICsgMC41KSAvICR7dE51bUN9LjAsIDAuNSk7XG4gICAgICAgIHJldHVybiBzYW1wbGVUZXh0dXJlKCR7dGV4TmFtZX0sIHV2KTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG5cbiAgaWYgKGVuYWJsZVNoYXBlVW5pZm9ybXMpIHtcbiAgICByZXR1cm4gYFxuICAgIGZsb2F0ICR7ZnVuY05hbWV9KGludCBpbmRleCkge1xuICAgICAgdmVjMiB1diA9IHV2RnJvbUZsYXQoJHt0ZXhOYW1lfVRleFNoYXBlWzBdLCAke1xuICAgICAgICB0ZXhOYW1lfVRleFNoYXBlWzFdLCBpbmRleCArICR7b2Zmc2V0fSk7XG4gICAgICByZXR1cm4gc2FtcGxlVGV4dHVyZSgke3RleE5hbWV9LCB1dik7XG4gICAgfVxuICBgO1xuICB9XG5cbiAgcmV0dXJuIGBcbiAgICBmbG9hdCAke2Z1bmNOYW1lfShpbnQgaW5kZXgpIHtcbiAgICAgIHZlYzIgdXYgPSB1dkZyb21GbGF0KCR7dE51bVJ9LCAke3ROdW1DfSwgaW5kZXggKyAke29mZnNldH0pO1xuICAgICAgcmV0dXJuIHNhbXBsZVRleHR1cmUoJHt0ZXhOYW1lfSwgdXYpO1xuICAgIH1cbiAgYDtcbn1cblxuZnVuY3Rpb24gZ2V0UGFja2VkU2FtcGxlcjJEKFxuICAgIGlucHV0SW5mbzogSW5wdXRJbmZvLCBlbmFibGVTaGFwZVVuaWZvcm1zOiBib29sZWFuKTogc3RyaW5nIHtcbiAgY29uc3Qgc2hhcGUgPSBpbnB1dEluZm8uc2hhcGVJbmZvLmxvZ2ljYWxTaGFwZTtcbiAgY29uc3QgdGV4TmFtZSA9IGlucHV0SW5mby5uYW1lO1xuICBjb25zdCBmdW5jTmFtZSA9ICdnZXQnICsgdGV4TmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRleE5hbWUuc2xpY2UoMSk7XG4gIGNvbnN0IHRleFNoYXBlID0gaW5wdXRJbmZvLnNoYXBlSW5mby50ZXhTaGFwZTtcblxuICBjb25zdCB0ZXhOdW1SID0gdGV4U2hhcGVbMF07XG4gIGNvbnN0IHRleE51bUMgPSB0ZXhTaGFwZVsxXTtcbiAgY29uc3QgZ2xzbCA9IGdldEdsc2xEaWZmZXJlbmNlcygpO1xuICBpZiAodGV4U2hhcGUgIT0gbnVsbCAmJiB1dGlsLmFycmF5c0VxdWFsKHNoYXBlLCB0ZXhTaGFwZSkpIHtcbiAgICBpZiAoZW5hYmxlU2hhcGVVbmlmb3Jtcykge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIHZlYzQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCkge1xuICAgICAgICB2ZWMyIHV2ID0gKHZlYzIoY29sLCByb3cpICsgaGFsZkNSKSAvIHZlYzIoJHt0ZXhOYW1lfVRleFNoYXBlWzFdLCAke1xuICAgICAgICAgIHRleE5hbWV9VGV4U2hhcGVbMF0pO1xuXG4gICAgICAgIHJldHVybiAke2dsc2wudGV4dHVyZTJEfSgke3RleE5hbWV9LCB1dik7XG4gICAgICB9XG4gICAgYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcbiAgICAgIHZlYzQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCkge1xuICAgICAgICB2ZWMyIHV2ID0gKHZlYzIoY29sLCByb3cpICsgaGFsZkNSKSAvIHZlYzIoJHt0ZXhOdW1DfS4wLCAke3RleE51bVJ9LjApO1xuXG4gICAgICAgIHJldHVybiAke2dsc2wudGV4dHVyZTJEfSgke3RleE5hbWV9LCB1dik7XG4gICAgICB9XG4gICAgYDtcbiAgfVxuXG4gIGlmIChlbmFibGVTaGFwZVVuaWZvcm1zKSB7XG4gICAgcmV0dXJuIGBcbiAgICB2ZWM0ICR7ZnVuY05hbWV9KGludCByb3csIGludCBjb2wpIHtcbiAgICAgIGl2ZWMyIHBhY2tlZFRleFNoYXBlID0gaXZlYzIoY2VpbChmbG9hdCgke1xuICAgICAgICB0ZXhOYW1lfVRleFNoYXBlWzBdKSAvIDIuMCksIGNlaWwoZmxvYXQoJHt0ZXhOYW1lfVRleFNoYXBlWzFdKSAvIDIuMCkpO1xuICAgICAgaW50IHZhbHVlc1BlclJvdyA9IGludChjZWlsKGZsb2F0KCR7dGV4TmFtZX1TaGFwZVsxXSkgLyAyLjApKTtcbiAgICAgIHZlYzIgdXYgPSBwYWNrZWRVVmZyb20yRCh2YWx1ZXNQZXJSb3csIHBhY2tlZFRleFNoYXBlWzBdLCBwYWNrZWRUZXhTaGFwZVsxXSwgcm93LCBjb2wpO1xuICAgICAgcmV0dXJuICR7Z2xzbC50ZXh0dXJlMkR9KCR7dGV4TmFtZX0sIHV2KTtcbiAgICB9XG4gIGA7XG4gIH1cbiAgY29uc3QgcGFja2VkVGV4U2hhcGUgPVxuICAgICAgW01hdGguY2VpbCh0ZXhTaGFwZVswXSAvIDIpLCBNYXRoLmNlaWwodGV4U2hhcGVbMV0gLyAyKV07XG4gIGNvbnN0IHZhbHVlc1BlclJvdyA9IE1hdGguY2VpbChzaGFwZVsxXSAvIDIpO1xuXG4gIHJldHVybiBgXG4gICAgdmVjNCAke2Z1bmNOYW1lfShpbnQgcm93LCBpbnQgY29sKSB7XG4gICAgICB2ZWMyIHV2ID0gcGFja2VkVVZmcm9tMkQoJHt2YWx1ZXNQZXJSb3d9LCAke3BhY2tlZFRleFNoYXBlWzBdfSwgJHtcbiAgICAgIHBhY2tlZFRleFNoYXBlWzFdfSwgcm93LCBjb2wpO1xuICAgICAgcmV0dXJuICR7Z2xzbC50ZXh0dXJlMkR9KCR7dGV4TmFtZX0sIHV2KTtcbiAgICB9XG4gIGA7XG59XG5cbmZ1bmN0aW9uIGdldFNhbXBsZXIyRChcbiAgICBpbnB1dEluZm86IElucHV0SW5mbywgZW5hYmxlU2hhcGVVbmlmb3JtczogYm9vbGVhbik6IHN0cmluZyB7XG4gIGNvbnN0IHNoYXBlID0gaW5wdXRJbmZvLnNoYXBlSW5mby5sb2dpY2FsU2hhcGU7XG4gIGNvbnN0IHRleE5hbWUgPSBpbnB1dEluZm8ubmFtZTtcbiAgY29uc3QgZnVuY05hbWUgPSAnZ2V0JyArIHRleE5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0ZXhOYW1lLnNsaWNlKDEpO1xuICBjb25zdCB0ZXhTaGFwZSA9IGlucHV0SW5mby5zaGFwZUluZm8udGV4U2hhcGU7XG5cbiAgaWYgKHRleFNoYXBlICE9IG51bGwgJiYgdXRpbC5hcnJheXNFcXVhbChzaGFwZSwgdGV4U2hhcGUpKSB7XG4gICAgaWYgKGVuYWJsZVNoYXBlVW5pZm9ybXMpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICBmbG9hdCAke2Z1bmNOYW1lfShpbnQgcm93LCBpbnQgY29sKSB7XG4gICAgICAgIHZlYzIgdXYgPSAodmVjMihjb2wsIHJvdykgKyBoYWxmQ1IpIC8gdmVjMigke3RleE5hbWV9VGV4U2hhcGVbMV0sICR7XG4gICAgICAgICAgdGV4TmFtZX1UZXhTaGFwZVswXSk7XG4gICAgICAgIHJldHVybiBzYW1wbGVUZXh0dXJlKCR7dGV4TmFtZX0sIHV2KTtcbiAgICAgIH1cbiAgICBgO1xuICAgIH1cblxuICAgIGNvbnN0IHRleE51bVIgPSB0ZXhTaGFwZVswXTtcbiAgICBjb25zdCB0ZXhOdW1DID0gdGV4U2hhcGVbMV07XG4gICAgcmV0dXJuIGBcbiAgICBmbG9hdCAke2Z1bmNOYW1lfShpbnQgcm93LCBpbnQgY29sKSB7XG4gICAgICB2ZWMyIHV2ID0gKHZlYzIoY29sLCByb3cpICsgaGFsZkNSKSAvIHZlYzIoJHt0ZXhOdW1DfS4wLCAke3RleE51bVJ9LjApO1xuICAgICAgcmV0dXJuIHNhbXBsZVRleHR1cmUoJHt0ZXhOYW1lfSwgdXYpO1xuICAgIH1cbiAgYDtcbiAgfVxuXG4gIGNvbnN0IHtuZXdTaGFwZSwga2VwdERpbXN9ID0gdXRpbC5zcXVlZXplU2hhcGUoc2hhcGUpO1xuICBjb25zdCBzcXVlZXplZFNoYXBlID0gbmV3U2hhcGU7XG4gIGlmIChzcXVlZXplZFNoYXBlLmxlbmd0aCA8IHNoYXBlLmxlbmd0aCkge1xuICAgIGNvbnN0IG5ld0lucHV0SW5mbyA9IHNxdWVlemVJbnB1dEluZm8oaW5wdXRJbmZvLCBzcXVlZXplZFNoYXBlKTtcbiAgICBjb25zdCBwYXJhbXMgPSBbJ3JvdycsICdjb2wnXTtcbiAgICByZXR1cm4gYFxuICAgICAgJHtnZXRTYW1wbGVyRnJvbUluSW5mbyhuZXdJbnB1dEluZm8sIGVuYWJsZVNoYXBlVW5pZm9ybXMpfVxuICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCkge1xuICAgICAgICByZXR1cm4gJHtmdW5jTmFtZX0oJHtnZXRTcXVlZXplZFBhcmFtcyhwYXJhbXMsIGtlcHREaW1zKX0pO1xuICAgICAgfVxuICAgIGA7XG4gIH1cblxuICBpZiAoaW5wdXRJbmZvLnNoYXBlSW5mby5pc1VuaWZvcm0pIHtcbiAgICAvLyBVbmlmb3JtIGFycmF5cyB3aWxsIGJlIGxlc3MgdGhhbiA2NTUwNSAobm8gcmlzayBvZiBmbG9hdDE2IG92ZXJmbG93KS5cbiAgICByZXR1cm4gYFxuICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCkge1xuICAgICAgICBpbnQgaW5kZXggPSByb3VuZChkb3QodmVjMihyb3csIGNvbCksIHZlYzIoJHtzaGFwZVsxXX0sIDEpKSk7XG4gICAgICAgICR7Z2V0VW5pZm9ybVNhbXBsZXIoaW5wdXRJbmZvKX1cbiAgICAgIH1cbiAgICBgO1xuICB9XG5cbiAgY29uc3QgdGV4TnVtUiA9IHRleFNoYXBlWzBdO1xuICBjb25zdCB0ZXhOdW1DID0gdGV4U2hhcGVbMV07XG4gIGNvbnN0IG9mZnNldCA9IGdldEZsYXRPZmZzZXRVbmlmb3JtTmFtZSh0ZXhOYW1lKTtcbiAgaWYgKHRleE51bUMgPT09IDEpIHtcbiAgICAvLyBpbmRleCBpcyB1c2VkIGRpcmVjdGx5IGFzIHBoeXNpY2FsIChubyByaXNrIG9mIGZsb2F0MTYgb3ZlcmZsb3cpLlxuICAgIGlmIChlbmFibGVTaGFwZVVuaWZvcm1zKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCkge1xuICAgICAgICBmbG9hdCBpbmRleCA9IGRvdCh2ZWMzKHJvdywgY29sLCAke29mZnNldH0pLCB2ZWMzKCR7XG4gICAgICAgICAgdGV4TmFtZX1TaGFwZVsxXSwgMSwgMSkpO1xuICAgICAgICB2ZWMyIHV2ID0gdmVjMigwLjUsIChpbmRleCArIDAuNSkgLyBmbG9hdCgke3RleE5hbWV9VGV4U2hhcGVbMF0pKTtcbiAgICAgICAgcmV0dXJuIHNhbXBsZVRleHR1cmUoJHt0ZXhOYW1lfSwgdXYpO1xuICAgICAgfVxuICAgIGA7XG4gICAgfVxuICAgIHJldHVybiBgXG4gICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCkge1xuICAgICAgZmxvYXQgaW5kZXggPSBkb3QodmVjMyhyb3csIGNvbCwgJHtvZmZzZXR9KSwgdmVjMygke3NoYXBlWzFdfSwgMSwgMSkpO1xuICAgICAgdmVjMiB1diA9IHZlYzIoMC41LCAoaW5kZXggKyAwLjUpIC8gJHt0ZXhOdW1SfS4wKTtcbiAgICAgIHJldHVybiBzYW1wbGVUZXh0dXJlKCR7dGV4TmFtZX0sIHV2KTtcbiAgICB9XG4gIGA7XG4gIH1cbiAgaWYgKHRleE51bVIgPT09IDEpIHtcbiAgICAvLyBpbmRleCBpcyB1c2VkIGRpcmVjdGx5IGFzIHBoeXNpY2FsIChubyByaXNrIG9mIGZsb2F0MTYgb3ZlcmZsb3cpLlxuICAgIGlmIChlbmFibGVTaGFwZVVuaWZvcm1zKSB7XG4gICAgICByZXR1cm4gYFxuICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCkge1xuICAgICAgICBmbG9hdCBpbmRleCA9IGRvdCh2ZWMzKHJvdywgY29sLCAke29mZnNldH0pLCB2ZWMzKCR7XG4gICAgICAgICAgdGV4TmFtZX1TaGFwZVsxXSwgMSwgMSkpO1xuICAgICAgICB2ZWMyIHV2ID0gdmVjMigoaW5kZXggKyAwLjUpIC8gZmxvYXQoJHt0ZXhOYW1lfVRleFNoYXBlWzFdKSwgMC41KTtcbiAgICAgICAgcmV0dXJuIHNhbXBsZVRleHR1cmUoJHt0ZXhOYW1lfSwgdXYpO1xuICAgICAgfVxuICAgIGA7XG4gICAgfVxuICAgIHJldHVybiBgXG4gICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCkge1xuICAgICAgZmxvYXQgaW5kZXggPSBkb3QodmVjMyhyb3csIGNvbCwgJHtvZmZzZXR9KSwgdmVjMygke3NoYXBlWzFdfSwgMSwgMSkpO1xuICAgICAgdmVjMiB1diA9IHZlYzIoKGluZGV4ICsgMC41KSAvICR7dGV4TnVtQ30uMCwgMC41KTtcbiAgICAgIHJldHVybiBzYW1wbGVUZXh0dXJlKCR7dGV4TmFtZX0sIHV2KTtcbiAgICB9XG4gIGA7XG4gIH1cblxuICBpZiAoZW5hYmxlU2hhcGVVbmlmb3Jtcykge1xuICAgIHJldHVybiBgXG4gICAgICBmbG9hdCAke2Z1bmNOYW1lfShpbnQgcm93LCBpbnQgY29sKSB7XG4gICAgICAgIC8vIEV4cGxpY2l0bHkgdXNlIGludGVnZXIgb3BlcmF0aW9ucyBhcyBkb3QoKSBvbmx5IHdvcmtzIG9uIGZsb2F0cy5cbiAgICAgICAgaW50IGluZGV4ID0gcm93ICogJHt0ZXhOYW1lfVNoYXBlWzFdICsgY29sICsgJHtvZmZzZXR9O1xuICAgICAgICB2ZWMyIHV2ID0gdXZGcm9tRmxhdCgke3RleE5hbWV9VGV4U2hhcGVbMF0sICR7XG4gICAgICAgIHRleE5hbWV9VGV4U2hhcGVbMV0sIGluZGV4KTtcbiAgICAgICAgcmV0dXJuIHNhbXBsZVRleHR1cmUoJHt0ZXhOYW1lfSwgdXYpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cbiAgcmV0dXJuIGBcbiAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCkge1xuICAgIC8vIEV4cGxpY2l0bHkgdXNlIGludGVnZXIgb3BlcmF0aW9ucyBhcyBkb3QoKSBvbmx5IHdvcmtzIG9uIGZsb2F0cy5cbiAgICBpbnQgaW5kZXggPSByb3cgKiAke3NoYXBlWzFdfSArIGNvbCArICR7b2Zmc2V0fTtcbiAgICB2ZWMyIHV2ID0gdXZGcm9tRmxhdCgke3RleE51bVJ9LCAke3RleE51bUN9LCBpbmRleCk7XG4gICAgcmV0dXJuIHNhbXBsZVRleHR1cmUoJHt0ZXhOYW1lfSwgdXYpO1xuICB9XG5gO1xufVxuXG5mdW5jdGlvbiBnZXRQYWNrZWRTYW1wbGVyM0QoXG4gICAgaW5wdXRJbmZvOiBJbnB1dEluZm8sIGVuYWJsZVNoYXBlVW5pZm9ybXM6IGJvb2xlYW4pOiBzdHJpbmcge1xuICBjb25zdCBzaGFwZSA9IGlucHV0SW5mby5zaGFwZUluZm8ubG9naWNhbFNoYXBlO1xuICBjb25zdCB0ZXhOYW1lID0gaW5wdXRJbmZvLm5hbWU7XG4gIGNvbnN0IGZ1bmNOYW1lID0gJ2dldCcgKyB0ZXhOYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGV4TmFtZS5zbGljZSgxKTtcbiAgY29uc3QgdGV4U2hhcGUgPSBpbnB1dEluZm8uc2hhcGVJbmZvLnRleFNoYXBlO1xuICBjb25zdCBwYWNrZWRUZXhTaGFwZSA9XG4gICAgICBbTWF0aC5jZWlsKHRleFNoYXBlWzBdIC8gMiksIE1hdGguY2VpbCh0ZXhTaGFwZVsxXSAvIDIpXTtcblxuICBpZiAoc2hhcGVbMF0gPT09IDEpIHtcbiAgICBjb25zdCBzcXVlZXplZFNoYXBlID0gc2hhcGUuc2xpY2UoMSk7XG4gICAgY29uc3Qga2VwdERpbXMgPSBbMSwgMl07XG4gICAgY29uc3QgbmV3SW5wdXRJbmZvID0gc3F1ZWV6ZUlucHV0SW5mbyhpbnB1dEluZm8sIHNxdWVlemVkU2hhcGUpO1xuICAgIGNvbnN0IHBhcmFtcyA9IFsnYicsICdyb3cnLCAnY29sJ107XG4gICAgcmV0dXJuIGBcbiAgICAgICAgJHtnZXRQYWNrZWRTYW1wbGVyRnJvbUluSW5mbyhuZXdJbnB1dEluZm8sIGVuYWJsZVNoYXBlVW5pZm9ybXMpfVxuICAgICAgICB2ZWM0ICR7ZnVuY05hbWV9KGludCBiLCBpbnQgcm93LCBpbnQgY29sKSB7XG4gICAgICAgICAgcmV0dXJuICR7ZnVuY05hbWV9KCR7Z2V0U3F1ZWV6ZWRQYXJhbXMocGFyYW1zLCBrZXB0RGltcyl9KTtcbiAgICAgICAgfVxuICAgICAgYDtcbiAgfVxuXG4gIGNvbnN0IGdsc2wgPSBnZXRHbHNsRGlmZmVyZW5jZXMoKTtcbiAgaWYgKGVuYWJsZVNoYXBlVW5pZm9ybXMpIHtcbiAgICByZXR1cm4gYFxuICAgIHZlYzQgJHtmdW5jTmFtZX0oaW50IGIsIGludCByb3csIGludCBjb2wpIHtcbiAgICAgIGl2ZWMyIHBhY2tlZFRleFNoYXBlID0gaXZlYzIoY2VpbChmbG9hdCgke1xuICAgICAgICB0ZXhOYW1lfVRleFNoYXBlWzBdKSAvIDIuMCksIGNlaWwoZmxvYXQoJHt0ZXhOYW1lfVRleFNoYXBlWzFdKSAvIDIuMCkpO1xuICAgICAgaW50IHZhbHVlc1BlclJvdyA9IGludChjZWlsKGZsb2F0KCR7dGV4TmFtZX1TaGFwZVsyXSkgLyAyLjApKTtcbiAgICAgIGludCB0ZXhlbHNJbkJhdGNoID0gdmFsdWVzUGVyUm93ICogaW50KGNlaWwoZmxvYXQoJHtcbiAgICAgICAgdGV4TmFtZX1TaGFwZVsxXSkgLyAyLjApKTtcbiAgICAgIHZlYzIgdXYgPSBwYWNrZWRVVmZyb20zRChcbiAgICAgICAgcGFja2VkVGV4U2hhcGVbMF0sIHBhY2tlZFRleFNoYXBlWzFdLCB0ZXhlbHNJbkJhdGNoLCB2YWx1ZXNQZXJSb3csIGIsIHJvdywgY29sKTtcbiAgICAgIHJldHVybiAke2dsc2wudGV4dHVyZTJEfSgke3RleE5hbWV9LCB1dik7XG4gICAgfVxuICBgO1xuICB9XG5cbiAgY29uc3QgdGV4TnVtUiA9IHBhY2tlZFRleFNoYXBlWzBdO1xuICBjb25zdCB0ZXhOdW1DID0gcGFja2VkVGV4U2hhcGVbMV07XG5cbiAgY29uc3QgdmFsdWVzUGVyUm93ID0gTWF0aC5jZWlsKHNoYXBlWzJdIC8gMik7XG4gIGNvbnN0IHRleGVsc0luQmF0Y2ggPSB2YWx1ZXNQZXJSb3cgKiBNYXRoLmNlaWwoc2hhcGVbMV0gLyAyKTtcblxuICByZXR1cm4gYFxuICAgIHZlYzQgJHtmdW5jTmFtZX0oaW50IGIsIGludCByb3csIGludCBjb2wpIHtcbiAgICAgIHZlYzIgdXYgPSBwYWNrZWRVVmZyb20zRChcbiAgICAgICAgJHt0ZXhOdW1SfSwgJHt0ZXhOdW1DfSwgJHt0ZXhlbHNJbkJhdGNofSwgJHt2YWx1ZXNQZXJSb3d9LCBiLCByb3csIGNvbCk7XG4gICAgICByZXR1cm4gJHtnbHNsLnRleHR1cmUyRH0oJHt0ZXhOYW1lfSwgdXYpO1xuICAgIH1cbiAgYDtcbn1cblxuZnVuY3Rpb24gZ2V0U2FtcGxlcjNEKFxuICAgIGlucHV0SW5mbzogSW5wdXRJbmZvLCBlbmFibGVTaGFwZVVuaWZvcm1zOiBib29sZWFuKTogc3RyaW5nIHtcbiAgY29uc3Qgc2hhcGUgPSBpbnB1dEluZm8uc2hhcGVJbmZvLmxvZ2ljYWxTaGFwZTtcbiAgY29uc3QgdGV4TmFtZSA9IGlucHV0SW5mby5uYW1lO1xuICBjb25zdCBmdW5jTmFtZSA9ICdnZXQnICsgdGV4TmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRleE5hbWUuc2xpY2UoMSk7XG4gIGNvbnN0IHN0cmlkZTAgPSBzaGFwZVsxXSAqIHNoYXBlWzJdO1xuICBjb25zdCBzdHJpZGUxID0gc2hhcGVbMl07XG5cbiAgY29uc3Qge25ld1NoYXBlLCBrZXB0RGltc30gPSB1dGlsLnNxdWVlemVTaGFwZShzaGFwZSk7XG4gIGNvbnN0IHNxdWVlemVkU2hhcGUgPSBuZXdTaGFwZTtcbiAgaWYgKHNxdWVlemVkU2hhcGUubGVuZ3RoIDwgc2hhcGUubGVuZ3RoKSB7XG4gICAgY29uc3QgbmV3SW5wdXRJbmZvID0gc3F1ZWV6ZUlucHV0SW5mbyhpbnB1dEluZm8sIHNxdWVlemVkU2hhcGUpO1xuICAgIGNvbnN0IHBhcmFtcyA9IFsncm93JywgJ2NvbCcsICdkZXB0aCddO1xuICAgIHJldHVybiBgXG4gICAgICAgICR7Z2V0U2FtcGxlckZyb21JbkluZm8obmV3SW5wdXRJbmZvLCBlbmFibGVTaGFwZVVuaWZvcm1zKX1cbiAgICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCwgaW50IGRlcHRoKSB7XG4gICAgICAgICAgcmV0dXJuICR7ZnVuY05hbWV9KCR7Z2V0U3F1ZWV6ZWRQYXJhbXMocGFyYW1zLCBrZXB0RGltcyl9KTtcbiAgICAgICAgfVxuICAgICAgYDtcbiAgfVxuXG4gIGlmIChpbnB1dEluZm8uc2hhcGVJbmZvLmlzVW5pZm9ybSkge1xuICAgIC8vIFVuaWZvcm0gYXJyYXlzIHdpbGwgYmUgbGVzcyB0aGFuIDY1NTA1IChubyByaXNrIG9mIGZsb2F0MTYgb3ZlcmZsb3cpLlxuICAgIHJldHVybiBgXG4gICAgICBmbG9hdCAke2Z1bmNOYW1lfShpbnQgcm93LCBpbnQgY29sLCBpbnQgZGVwdGgpIHtcbiAgICAgICAgaW50IGluZGV4ID0gcm91bmQoZG90KHZlYzMocm93LCBjb2wsIGRlcHRoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmVjMygke3N0cmlkZTB9LCAke3N0cmlkZTF9LCAxKSkpO1xuICAgICAgICAke2dldFVuaWZvcm1TYW1wbGVyKGlucHV0SW5mbyl9XG4gICAgICB9XG4gICAgYDtcbiAgfVxuXG4gIGNvbnN0IHRleFNoYXBlID0gaW5wdXRJbmZvLnNoYXBlSW5mby50ZXhTaGFwZTtcbiAgY29uc3QgdGV4TnVtUiA9IHRleFNoYXBlWzBdO1xuICBjb25zdCB0ZXhOdW1DID0gdGV4U2hhcGVbMV07XG4gIGNvbnN0IGZsYXRPZmZzZXQgPSBpbnB1dEluZm8uc2hhcGVJbmZvLmZsYXRPZmZzZXQ7XG4gIGlmICh0ZXhOdW1DID09PSBzdHJpZGUwICYmIGZsYXRPZmZzZXQgPT0gbnVsbCkge1xuICAgIC8vIHRleEMgaXMgdXNlZCBkaXJlY3RseSBhcyBwaHlzaWNhbCAobm8gcmlzayBvZiBmbG9hdDE2IG92ZXJmbG93KS5cbiAgICBpZiAoZW5hYmxlU2hhcGVVbmlmb3Jtcykge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIGZsb2F0ICR7ZnVuY05hbWV9KGludCByb3csIGludCBjb2wsIGludCBkZXB0aCkge1xuICAgICAgICBpbnQgc3RyaWRlMSA9ICR7dGV4TmFtZX1TaGFwZVsyXTtcbiAgICAgICAgZmxvYXQgdGV4UiA9IGZsb2F0KHJvdyk7XG4gICAgICAgIGZsb2F0IHRleEMgPSBkb3QodmVjMihjb2wsIGRlcHRoKSwgdmVjMihzdHJpZGUxLCAxKSk7XG4gICAgICAgIHZlYzIgdXYgPSAodmVjMih0ZXhDLCB0ZXhSKSArIGhhbGZDUikgL1xuICAgICAgICAgICAgICAgICAgIHZlYzIoJHt0ZXhOYW1lfVRleFNoYXBlWzFdLCAke3RleE5hbWV9VGV4U2hhcGVbMF0pO1xuICAgICAgICByZXR1cm4gc2FtcGxlVGV4dHVyZSgke3RleE5hbWV9LCB1dik7XG4gICAgICB9XG4gICAgYDtcbiAgICB9XG4gICAgcmV0dXJuIGBcbiAgICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCwgaW50IGRlcHRoKSB7XG4gICAgICAgICAgZmxvYXQgdGV4UiA9IGZsb2F0KHJvdyk7XG4gICAgICAgICAgZmxvYXQgdGV4QyA9IGRvdCh2ZWMyKGNvbCwgZGVwdGgpLCB2ZWMyKCR7c3RyaWRlMX0sIDEpKTtcbiAgICAgICAgICB2ZWMyIHV2ID0gKHZlYzIodGV4QywgdGV4UikgKyBoYWxmQ1IpIC9cbiAgICAgICAgICAgICAgICAgICAgIHZlYzIoJHt0ZXhOdW1DfS4wLCAke3RleE51bVJ9LjApO1xuICAgICAgICAgIHJldHVybiBzYW1wbGVUZXh0dXJlKCR7dGV4TmFtZX0sIHV2KTtcbiAgICAgICAgfVxuICAgICAgYDtcbiAgfVxuXG4gIGlmICh0ZXhOdW1DID09PSBzdHJpZGUxICYmIGZsYXRPZmZzZXQgPT0gbnVsbCkge1xuICAgIC8vIHRleFIgaXMgdXNlZCBkaXJlY3RseSBhcyBwaHlzaWNhbCAobm8gcmlzayBvZiBmbG9hdDE2IG92ZXJmbG93KS5cbiAgICBpZiAoZW5hYmxlU2hhcGVVbmlmb3Jtcykge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIGZsb2F0ICR7ZnVuY05hbWV9KGludCByb3csIGludCBjb2wsIGludCBkZXB0aCkge1xuICAgICAgICBmbG9hdCB0ZXhSID0gZG90KHZlYzIocm93LCBjb2wpLCB2ZWMyKCR7dGV4TmFtZX1TaGFwZVsxXSwgMSkpO1xuICAgICAgICBmbG9hdCB0ZXhDID0gZmxvYXQoZGVwdGgpO1xuICAgICAgICB2ZWMyIHV2ID0gKHZlYzIodGV4QywgdGV4UikgKyBoYWxmQ1IpIC8gdmVjMigke3RleE5hbWV9VGV4U2hhcGVbMV0sICR7XG4gICAgICAgICAgdGV4TmFtZX1UZXhTaGFwZVswXSk7XG4gICAgICAgIHJldHVybiBzYW1wbGVUZXh0dXJlKCR7dGV4TmFtZX0sIHV2KTtcbiAgICAgIH1cbiAgICBgO1xuICAgIH1cbiAgICByZXR1cm4gYFxuICAgIGZsb2F0ICR7ZnVuY05hbWV9KGludCByb3csIGludCBjb2wsIGludCBkZXB0aCkge1xuICAgICAgZmxvYXQgdGV4UiA9IGRvdCh2ZWMyKHJvdywgY29sKSwgdmVjMigke3NoYXBlWzFdfSwgMSkpO1xuICAgICAgZmxvYXQgdGV4QyA9IGZsb2F0KGRlcHRoKTtcbiAgICAgIHZlYzIgdXYgPSAodmVjMih0ZXhDLCB0ZXhSKSArIGhhbGZDUikgLyB2ZWMyKCR7dGV4TnVtQ30uMCwgJHt0ZXhOdW1SfS4wKTtcbiAgICAgIHJldHVybiBzYW1wbGVUZXh0dXJlKCR7dGV4TmFtZX0sIHV2KTtcbiAgICB9XG4gIGA7XG4gIH1cblxuICBjb25zdCBvZmZzZXQgPSBnZXRGbGF0T2Zmc2V0VW5pZm9ybU5hbWUodGV4TmFtZSk7XG4gIGlmIChlbmFibGVTaGFwZVVuaWZvcm1zKSB7XG4gICAgcmV0dXJuIGBcbiAgICBmbG9hdCAke2Z1bmNOYW1lfShpbnQgcm93LCBpbnQgY29sLCBpbnQgZGVwdGgpIHtcbiAgICAgIC8vIEV4cGxpY2l0bHkgdXNlIGludGVnZXIgb3BlcmF0aW9ucyBhcyBkb3QoKSBvbmx5IHdvcmtzIG9uIGZsb2F0cy5cbiAgICAgIGludCBzdHJpZGUwID0gJHt0ZXhOYW1lfVNoYXBlWzFdICogJHt0ZXhOYW1lfVNoYXBlWzJdO1xuICAgICAgaW50IHN0cmlkZTEgPSAke3RleE5hbWV9U2hhcGVbMl07XG4gICAgICBpbnQgaW5kZXggPSByb3cgKiBzdHJpZGUwICsgY29sICogc3RyaWRlMSArIGRlcHRoICsgJHtvZmZzZXR9O1xuICAgICAgdmVjMiB1diA9IHV2RnJvbUZsYXQoJHt0ZXhOYW1lfVRleFNoYXBlWzBdLCAke3RleE5hbWV9VGV4U2hhcGVbMV0sIGluZGV4KTtcbiAgICAgIHJldHVybiBzYW1wbGVUZXh0dXJlKCR7dGV4TmFtZX0sIHV2KTtcbiAgICB9XG4gICAgYDtcbiAgfVxuICByZXR1cm4gYFxuICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCwgaW50IGRlcHRoKSB7XG4gICAgICAgIC8vIEV4cGxpY2l0bHkgdXNlIGludGVnZXIgb3BlcmF0aW9ucyBhcyBkb3QoKSBvbmx5IHdvcmtzIG9uIGZsb2F0cy5cbiAgICAgICAgaW50IGluZGV4ID0gcm93ICogJHtzdHJpZGUwfSArIGNvbCAqICR7c3RyaWRlMX0gKyBkZXB0aCArICR7b2Zmc2V0fTtcbiAgICAgICAgdmVjMiB1diA9IHV2RnJvbUZsYXQoJHt0ZXhOdW1SfSwgJHt0ZXhOdW1DfSwgaW5kZXgpO1xuICAgICAgICByZXR1cm4gc2FtcGxlVGV4dHVyZSgke3RleE5hbWV9LCB1dik7XG4gICAgICB9XG4gIGA7XG59XG5cbmZ1bmN0aW9uIGdldFBhY2tlZFNhbXBsZXJORChcbiAgICBpbnB1dEluZm86IElucHV0SW5mbywgZW5hYmxlU2hhcGVVbmlmb3JtczogYm9vbGVhbik6IHN0cmluZyB7XG4gIGNvbnN0IHRleE5hbWUgPSBpbnB1dEluZm8ubmFtZTtcbiAgY29uc3QgZnVuY05hbWUgPSAnZ2V0JyArIHRleE5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0ZXhOYW1lLnNsaWNlKDEpO1xuICBjb25zdCBnbHNsID0gZ2V0R2xzbERpZmZlcmVuY2VzKCk7XG4gIGlmIChlbmFibGVTaGFwZVVuaWZvcm1zKSB7XG4gICAgLy8gVE9ETzogc3VwcG9ydCA1ZCBhbmQgNmRcbiAgICByZXR1cm4gYFxuICAgIHZlYzQgJHtmdW5jTmFtZX0oaW50IGIyLCBpbnQgYiwgaW50IHJvdywgaW50IGNvbCkge1xuICAgICAgaW50IHZhbHVlc1BlclJvdyA9IGludChjZWlsKGZsb2F0KCR7dGV4TmFtZX1TaGFwZVszXSkgLyAyLjApKTtcbiAgICAgIGludCB0ZXhlbHNJbkJhdGNoID0gdmFsdWVzUGVyUm93ICogaW50KGNlaWwoZmxvYXQoJHtcbiAgICAgICAgdGV4TmFtZX1TaGFwZVsyXSkgLyAyLjApKTtcbiAgICAgIGludCBpbmRleCA9IGIgKiB0ZXhlbHNJbkJhdGNoICsgKHJvdyAvIDIpICogdmFsdWVzUGVyUm93ICsgKGNvbCAvIDIpO1xuICAgICAgdGV4ZWxzSW5CYXRjaCAqPSAke3RleE5hbWV9U2hhcGVbMV07XG4gICAgICBpbmRleCA9IGIyICogdGV4ZWxzSW5CYXRjaCArIGluZGV4O1xuICAgICAgaXZlYzIgcGFja2VkVGV4U2hhcGUgPSBpdmVjMihjZWlsKGZsb2F0KCR7XG4gICAgICAgIHRleE5hbWV9VGV4U2hhcGVbMF0pIC8gMi4wKSwgY2VpbChmbG9hdCgke3RleE5hbWV9VGV4U2hhcGVbMV0pIC8gMi4wKSk7XG4gICAgICBpbnQgdGV4UiA9IGluZGV4IC8gcGFja2VkVGV4U2hhcGVbMV07XG4gICAgICBpbnQgdGV4QyA9IGluZGV4IC0gdGV4UiAqIHBhY2tlZFRleFNoYXBlWzFdO1xuICAgICAgdmVjMiB1diA9ICh2ZWMyKHRleEMsIHRleFIpICsgaGFsZkNSKSAvIHZlYzIocGFja2VkVGV4U2hhcGVbMV0sIHBhY2tlZFRleFNoYXBlWzBdKTsgcmV0dXJuICR7XG4gICAgICAgIGdsc2wudGV4dHVyZTJEfSgke3RleE5hbWV9LCB1dik7XG4gICAgfVxuICBgO1xuICB9XG4gIGNvbnN0IHNoYXBlID0gaW5wdXRJbmZvLnNoYXBlSW5mby5sb2dpY2FsU2hhcGU7XG4gIGNvbnN0IHJhbmsgPSBzaGFwZS5sZW5ndGg7XG4gIGNvbnN0IHRleFNoYXBlID0gaW5wdXRJbmZvLnNoYXBlSW5mby50ZXhTaGFwZTtcbiAgY29uc3QgcGFja2VkVGV4U2hhcGUgPVxuICAgICAgW01hdGguY2VpbCh0ZXhTaGFwZVswXSAvIDIpLCBNYXRoLmNlaWwodGV4U2hhcGVbMV0gLyAyKV07XG4gIGNvbnN0IHRleE51bVIgPSBwYWNrZWRUZXhTaGFwZVswXTtcbiAgY29uc3QgdGV4TnVtQyA9IHBhY2tlZFRleFNoYXBlWzFdO1xuXG4gIGNvbnN0IHZhbHVlc1BlclJvdyA9IE1hdGguY2VpbChzaGFwZVtyYW5rIC0gMV0gLyAyKTtcbiAgbGV0IHRleGVsc0luQmF0Y2ggPSB2YWx1ZXNQZXJSb3cgKiBNYXRoLmNlaWwoc2hhcGVbcmFuayAtIDJdIC8gMik7XG4gIGxldCBwYXJhbXMgPSBgaW50IGIsIGludCByb3csIGludCBjb2xgO1xuICBsZXQgaW5kZXggPSBgYiAqICR7dGV4ZWxzSW5CYXRjaH0gKyAocm93IC8gMikgKiAke3ZhbHVlc1BlclJvd30gKyAoY29sIC8gMilgO1xuICBmb3IgKGxldCBiID0gMjsgYiA8IHJhbmsgLSAxOyBiKyspIHtcbiAgICBwYXJhbXMgPSBgaW50IGIke2J9LCBgICsgcGFyYW1zO1xuICAgIHRleGVsc0luQmF0Y2ggKj0gc2hhcGVbcmFuayAtIGIgLSAxXTtcbiAgICBpbmRleCA9IGBiJHtifSAqICR7dGV4ZWxzSW5CYXRjaH0gKyBgICsgaW5kZXg7XG4gIH1cbiAgcmV0dXJuIGBcbiAgICB2ZWM0ICR7ZnVuY05hbWV9KCR7cGFyYW1zfSkge1xuICAgICAgaW50IGluZGV4ID0gJHtpbmRleH07XG4gICAgICBpbnQgdGV4UiA9IGluZGV4IC8gJHt0ZXhOdW1DfTtcbiAgICAgIGludCB0ZXhDID0gaW5kZXggLSB0ZXhSICogJHt0ZXhOdW1DfTtcbiAgICAgIHZlYzIgdXYgPSAodmVjMih0ZXhDLCB0ZXhSKSArIGhhbGZDUikgLyB2ZWMyKCR7dGV4TnVtQ30sICR7dGV4TnVtUn0pO1xuICAgICAgcmV0dXJuICR7Z2xzbC50ZXh0dXJlMkR9KCR7dGV4TmFtZX0sIHV2KTtcbiAgICB9XG4gIGA7XG59XG5cbmZ1bmN0aW9uIGdldFNhbXBsZXI0RChcbiAgICBpbnB1dEluZm86IElucHV0SW5mbywgZW5hYmxlU2hhcGVVbmlmb3JtczogYm9vbGVhbik6IHN0cmluZyB7XG4gIGNvbnN0IHNoYXBlID0gaW5wdXRJbmZvLnNoYXBlSW5mby5sb2dpY2FsU2hhcGU7XG4gIGNvbnN0IHRleE5hbWUgPSBpbnB1dEluZm8ubmFtZTtcbiAgY29uc3QgZnVuY05hbWUgPSAnZ2V0JyArIHRleE5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0ZXhOYW1lLnNsaWNlKDEpO1xuICBjb25zdCBzdHJpZGUyID0gc2hhcGVbM107XG4gIGNvbnN0IHN0cmlkZTEgPSBzaGFwZVsyXSAqIHN0cmlkZTI7XG4gIGNvbnN0IHN0cmlkZTAgPSBzaGFwZVsxXSAqIHN0cmlkZTE7XG5cbiAgY29uc3Qge25ld1NoYXBlLCBrZXB0RGltc30gPSB1dGlsLnNxdWVlemVTaGFwZShzaGFwZSk7XG4gIGlmIChuZXdTaGFwZS5sZW5ndGggPCBzaGFwZS5sZW5ndGgpIHtcbiAgICBjb25zdCBuZXdJbnB1dEluZm8gPSBzcXVlZXplSW5wdXRJbmZvKGlucHV0SW5mbywgbmV3U2hhcGUpO1xuICAgIGNvbnN0IHBhcmFtcyA9IFsncm93JywgJ2NvbCcsICdkZXB0aCcsICdkZXB0aDInXTtcbiAgICByZXR1cm4gYFxuICAgICAgJHtnZXRTYW1wbGVyRnJvbUluSW5mbyhuZXdJbnB1dEluZm8sIGVuYWJsZVNoYXBlVW5pZm9ybXMpfVxuICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCwgaW50IGRlcHRoLCBpbnQgZGVwdGgyKSB7XG4gICAgICAgIHJldHVybiAke2Z1bmNOYW1lfSgke2dldFNxdWVlemVkUGFyYW1zKHBhcmFtcywga2VwdERpbXMpfSk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxuXG4gIGlmIChpbnB1dEluZm8uc2hhcGVJbmZvLmlzVW5pZm9ybSkge1xuICAgIC8vIFVuaWZvcm0gYXJyYXlzIHdpbGwgYmUgbGVzcyB0aGFuIDY1NTA1IChubyByaXNrIG9mIGZsb2F0MTYgb3ZlcmZsb3cpLlxuICAgIHJldHVybiBgXG4gICAgICBmbG9hdCAke2Z1bmNOYW1lfShpbnQgcm93LCBpbnQgY29sLCBpbnQgZGVwdGgsIGludCBkZXB0aDIpIHtcbiAgICAgICAgaW50IGluZGV4ID0gcm91bmQoZG90KHZlYzQocm93LCBjb2wsIGRlcHRoLCBkZXB0aDIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB2ZWM0KCR7c3RyaWRlMH0sICR7c3RyaWRlMX0sICR7c3RyaWRlMn0sIDEpKSk7XG4gICAgICAgICR7Z2V0VW5pZm9ybVNhbXBsZXIoaW5wdXRJbmZvKX1cbiAgICAgIH1cbiAgICBgO1xuICB9XG5cbiAgY29uc3QgZmxhdE9mZnNldCA9IGlucHV0SW5mby5zaGFwZUluZm8uZmxhdE9mZnNldDtcbiAgY29uc3QgdGV4U2hhcGUgPSBpbnB1dEluZm8uc2hhcGVJbmZvLnRleFNoYXBlO1xuICBjb25zdCB0ZXhOdW1SID0gdGV4U2hhcGVbMF07XG4gIGNvbnN0IHRleE51bUMgPSB0ZXhTaGFwZVsxXTtcblxuICBjb25zdCBzdHJpZGUyU3RyID0gYGludCBzdHJpZGUyID0gJHt0ZXhOYW1lfVNoYXBlWzNdO2A7XG4gIGNvbnN0IHN0cmlkZTFTdHIgPSBgaW50IHN0cmlkZTEgPSAke3RleE5hbWV9U2hhcGVbMl0gKiBzdHJpZGUyO2A7XG4gIGNvbnN0IHN0cmlkZTBTdHIgPSBgaW50IHN0cmlkZTAgPSAke3RleE5hbWV9U2hhcGVbMV0gKiBzdHJpZGUxO2A7XG4gIGlmICh0ZXhOdW1DID09PSBzdHJpZGUwICYmIGZsYXRPZmZzZXQgPT0gbnVsbCkge1xuICAgIC8vIHRleEMgaXMgdXNlZCBkaXJlY3RseSBhcyBwaHlzaWNhbCAobm8gcmlzayBvZiBmbG9hdDE2IG92ZXJmbG93KS5cbiAgICBpZiAoZW5hYmxlU2hhcGVVbmlmb3Jtcykge1xuICAgICAgcmV0dXJuIGBcbiAgICAgIGZsb2F0ICR7ZnVuY05hbWV9KGludCByb3csIGludCBjb2wsIGludCBkZXB0aCwgaW50IGRlcHRoMikge1xuICAgICAgICAke3N0cmlkZTJTdHJ9XG4gICAgICAgICR7c3RyaWRlMVN0cn1cbiAgICAgICAgZmxvYXQgdGV4UiA9IGZsb2F0KHJvdyk7XG4gICAgICAgIGZsb2F0IHRleEMgPVxuICAgICAgICAgICAgZG90KHZlYzMoY29sLCBkZXB0aCwgZGVwdGgyKSxcbiAgICAgICAgICAgICAgICB2ZWMzKHN0cmlkZTEsIHN0cmlkZTIsIDEpKTtcbiAgICAgICAgdmVjMiB1diA9ICh2ZWMyKHRleEMsIHRleFIpICsgaGFsZkNSKSAvXG4gICAgICAgICAgICAgICAgICAgdmVjMigke3RleE5hbWV9VGV4U2hhcGVbMV0sICR7dGV4TmFtZX1UZXhTaGFwZVswXSk7XG4gICAgICAgIHJldHVybiBzYW1wbGVUZXh0dXJlKCR7dGV4TmFtZX0sIHV2KTtcbiAgICAgIH1cbiAgICBgO1xuICAgIH1cbiAgICByZXR1cm4gYFxuICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCwgaW50IGRlcHRoLCBpbnQgZGVwdGgyKSB7XG4gICAgICAgIGZsb2F0IHRleFIgPSBmbG9hdChyb3cpO1xuICAgICAgICBmbG9hdCB0ZXhDID1cbiAgICAgICAgICAgIGRvdCh2ZWMzKGNvbCwgZGVwdGgsIGRlcHRoMiksXG4gICAgICAgICAgICAgICAgdmVjMygke3N0cmlkZTF9LCAke3N0cmlkZTJ9LCAxKSk7XG4gICAgICAgIHZlYzIgdXYgPSAodmVjMih0ZXhDLCB0ZXhSKSArIGhhbGZDUikgL1xuICAgICAgICAgICAgICAgICAgIHZlYzIoJHt0ZXhOdW1DfS4wLCAke3RleE51bVJ9LjApO1xuICAgICAgICByZXR1cm4gc2FtcGxlVGV4dHVyZSgke3RleE5hbWV9LCB1dik7XG4gICAgICB9XG4gICAgYDtcbiAgfVxuICBpZiAodGV4TnVtQyA9PT0gc3RyaWRlMiAmJiBmbGF0T2Zmc2V0ID09IG51bGwpIHtcbiAgICAvLyB0ZXhSIGlzIHVzZWQgZGlyZWN0bHkgYXMgcGh5c2ljYWwgKG5vIHJpc2sgb2YgZmxvYXQxNiBvdmVyZmxvdykuXG4gICAgaWYgKGVuYWJsZVNoYXBlVW5pZm9ybXMpIHtcbiAgICAgIHJldHVybiBgXG4gICAgICBmbG9hdCAke2Z1bmNOYW1lfShpbnQgcm93LCBpbnQgY29sLCBpbnQgZGVwdGgsIGludCBkZXB0aDIpIHtcbiAgICAgICAgZmxvYXQgdGV4UiA9IGRvdCh2ZWMzKHJvdywgY29sLCBkZXB0aCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgdmVjMygke3RleE5hbWV9U2hhcGVbMV0gKiAke3RleE5hbWV9U2hhcGVbMl0sICR7XG4gICAgICAgICAgdGV4TmFtZX1TaGFwZVsyXSwgMSkpO1xuICAgICAgICBmbG9hdCB0ZXhDID0gZmxvYXQoZGVwdGgyKTtcbiAgICAgICAgdmVjMiB1diA9ICh2ZWMyKHRleEMsIHRleFIpICsgaGFsZkNSKSAvXG4gICAgICAgICAgICAgICAgICB2ZWMyKCR7dGV4TmFtZX1UZXhTaGFwZVsxXSwgJHt0ZXhOYW1lfVRleFNoYXBlWzBdKTtcbiAgICAgICAgcmV0dXJuIHNhbXBsZVRleHR1cmUoJHt0ZXhOYW1lfSwgdXYpO1xuICAgICAgfVxuICAgIGA7XG4gICAgfVxuICAgIHJldHVybiBgXG4gICAgICBmbG9hdCAke2Z1bmNOYW1lfShpbnQgcm93LCBpbnQgY29sLCBpbnQgZGVwdGgsIGludCBkZXB0aDIpIHtcbiAgICAgICAgZmxvYXQgdGV4UiA9IGRvdCh2ZWMzKHJvdywgY29sLCBkZXB0aCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgdmVjMygke3NoYXBlWzFdICogc2hhcGVbMl19LCAke3NoYXBlWzJdfSwgMSkpO1xuICAgICAgICBmbG9hdCB0ZXhDID0gZmxvYXQoZGVwdGgyKTtcbiAgICAgICAgdmVjMiB1diA9ICh2ZWMyKHRleEMsIHRleFIpICsgaGFsZkNSKSAvXG4gICAgICAgICAgICAgICAgICB2ZWMyKCR7dGV4TnVtQ30uMCwgJHt0ZXhOdW1SfS4wKTtcbiAgICAgICAgcmV0dXJuIHNhbXBsZVRleHR1cmUoJHt0ZXhOYW1lfSwgdXYpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cblxuICBjb25zdCBvZmZzZXQgPSBnZXRGbGF0T2Zmc2V0VW5pZm9ybU5hbWUodGV4TmFtZSk7XG4gIGlmIChlbmFibGVTaGFwZVVuaWZvcm1zKSB7XG4gICAgcmV0dXJuIGBcbiAgICBmbG9hdCAke2Z1bmNOYW1lfShpbnQgcm93LCBpbnQgY29sLCBpbnQgZGVwdGgsIGludCBkZXB0aDIpIHtcbiAgICAgIC8vIEV4cGxpY2l0bHkgdXNlIGludGVnZXIgb3BlcmF0aW9ucyBhcyBkb3QoKSBvbmx5IHdvcmtzIG9uIGZsb2F0cy5cbiAgICAgICR7c3RyaWRlMlN0cn1cbiAgICAgICR7c3RyaWRlMVN0cn1cbiAgICAgICR7c3RyaWRlMFN0cn1cbiAgICAgIGludCBpbmRleCA9IHJvdyAqIHN0cmlkZTAgKyBjb2wgKiBzdHJpZGUxICtcbiAgICAgICAgICBkZXB0aCAqIHN0cmlkZTIgKyBkZXB0aDI7XG4gICAgICB2ZWMyIHV2ID0gdXZGcm9tRmxhdCgke3RleE5hbWV9VGV4U2hhcGVbMF0sICR7XG4gICAgICAgIHRleE5hbWV9VGV4U2hhcGVbMV0sIGluZGV4ICsgJHtvZmZzZXR9KTtcbiAgICAgIHJldHVybiBzYW1wbGVUZXh0dXJlKCR7dGV4TmFtZX0sIHV2KTtcbiAgICB9XG4gIGA7XG4gIH1cbiAgcmV0dXJuIGBcbiAgICBmbG9hdCAke2Z1bmNOYW1lfShpbnQgcm93LCBpbnQgY29sLCBpbnQgZGVwdGgsIGludCBkZXB0aDIpIHtcbiAgICAgIC8vIEV4cGxpY2l0bHkgdXNlIGludGVnZXIgb3BlcmF0aW9ucyBhcyBkb3QoKSBvbmx5IHdvcmtzIG9uIGZsb2F0cy5cbiAgICAgIGludCBpbmRleCA9IHJvdyAqICR7c3RyaWRlMH0gKyBjb2wgKiAke3N0cmlkZTF9ICtcbiAgICAgICAgICBkZXB0aCAqICR7c3RyaWRlMn0gKyBkZXB0aDI7XG4gICAgICB2ZWMyIHV2ID0gdXZGcm9tRmxhdCgke3RleE51bVJ9LCAke3RleE51bUN9LCBpbmRleCArICR7b2Zmc2V0fSk7XG4gICAgICByZXR1cm4gc2FtcGxlVGV4dHVyZSgke3RleE5hbWV9LCB1dik7XG4gICAgfVxuICBgO1xufVxuXG5mdW5jdGlvbiBnZXRTYW1wbGVyNUQoaW5wdXRJbmZvOiBJbnB1dEluZm8pOiBzdHJpbmcge1xuICBjb25zdCBzaGFwZSA9IGlucHV0SW5mby5zaGFwZUluZm8ubG9naWNhbFNoYXBlO1xuICBjb25zdCB0ZXhOYW1lID0gaW5wdXRJbmZvLm5hbWU7XG4gIGNvbnN0IGZ1bmNOYW1lID0gJ2dldCcgKyB0ZXhOYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGV4TmFtZS5zbGljZSgxKTtcbiAgY29uc3Qgc3RyaWRlMyA9IHNoYXBlWzRdO1xuICBjb25zdCBzdHJpZGUyID0gc2hhcGVbM10gKiBzdHJpZGUzO1xuICBjb25zdCBzdHJpZGUxID0gc2hhcGVbMl0gKiBzdHJpZGUyO1xuICBjb25zdCBzdHJpZGUwID0gc2hhcGVbMV0gKiBzdHJpZGUxO1xuXG4gIGNvbnN0IHtuZXdTaGFwZSwga2VwdERpbXN9ID0gdXRpbC5zcXVlZXplU2hhcGUoc2hhcGUpO1xuICBpZiAobmV3U2hhcGUubGVuZ3RoIDwgc2hhcGUubGVuZ3RoKSB7XG4gICAgY29uc3QgbmV3SW5wdXRJbmZvID0gc3F1ZWV6ZUlucHV0SW5mbyhpbnB1dEluZm8sIG5ld1NoYXBlKTtcbiAgICBjb25zdCBwYXJhbXMgPSBbJ3JvdycsICdjb2wnLCAnZGVwdGgnLCAnZGVwdGgyJywgJ2RlcHRoMyddO1xuICAgIHJldHVybiBgXG4gICAgICAke2dldFNhbXBsZXJGcm9tSW5JbmZvKG5ld0lucHV0SW5mbyl9XG4gICAgICBmbG9hdCAke2Z1bmNOYW1lfShpbnQgcm93LCBpbnQgY29sLCBpbnQgZGVwdGgsIGludCBkZXB0aDIsIGludCBkZXB0aDMpIHtcbiAgICAgICAgcmV0dXJuICR7ZnVuY05hbWV9KCR7Z2V0U3F1ZWV6ZWRQYXJhbXMocGFyYW1zLCBrZXB0RGltcyl9KTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG5cbiAgaWYgKGlucHV0SW5mby5zaGFwZUluZm8uaXNVbmlmb3JtKSB7XG4gICAgLy8gVW5pZm9ybSBhcnJheXMgd2lsbCBiZSBsZXNzIHRoYW4gNjU1MDUgKG5vIHJpc2sgb2YgZmxvYXQxNiBvdmVyZmxvdykuXG4gICAgcmV0dXJuIGBcbiAgICAgIGZsb2F0ICR7ZnVuY05hbWV9KGludCByb3csIGludCBjb2wsIGludCBkZXB0aCwgaW50IGRlcHRoMiwgaW50IGRlcHRoMykge1xuICAgICAgICBmbG9hdCBpbmRleCA9IGRvdChcbiAgICAgICAgICB2ZWM0KHJvdywgY29sLCBkZXB0aCwgZGVwdGgyKSxcbiAgICAgICAgICB2ZWM0KCR7c3RyaWRlMH0sICR7c3RyaWRlMX0sICR7c3RyaWRlMn0sICR7c3RyaWRlM30pKSArXG4gICAgICAgICAgZGVwdGgzO1xuICAgICAgICAke2dldFVuaWZvcm1TYW1wbGVyKGlucHV0SW5mbyl9XG4gICAgICB9XG4gICAgYDtcbiAgfVxuXG4gIGNvbnN0IGZsYXRPZmZzZXQgPSBpbnB1dEluZm8uc2hhcGVJbmZvLmZsYXRPZmZzZXQ7XG4gIGNvbnN0IHRleFNoYXBlID0gaW5wdXRJbmZvLnNoYXBlSW5mby50ZXhTaGFwZTtcbiAgY29uc3QgdGV4TnVtUiA9IHRleFNoYXBlWzBdO1xuICBjb25zdCB0ZXhOdW1DID0gdGV4U2hhcGVbMV07XG5cbiAgaWYgKHRleE51bUMgPT09IHN0cmlkZTAgJiYgZmxhdE9mZnNldCA9PSBudWxsKSB7XG4gICAgLy8gdGV4QyBpcyB1c2VkIGRpcmVjdGx5IGFzIHBoeXNpY2FsIChubyByaXNrIG9mIGZsb2F0MTYgb3ZlcmZsb3cpLlxuICAgIHJldHVybiBgXG4gICAgICBmbG9hdCAke2Z1bmNOYW1lfShpbnQgcm93LCBpbnQgY29sLCBpbnQgZGVwdGgsIGludCBkZXB0aDIsIGludCBkZXB0aDMpIHtcbiAgICAgICAgaW50IHRleFIgPSByb3c7XG4gICAgICAgIGZsb2F0IHRleEMgPSBkb3QodmVjNChjb2wsIGRlcHRoLCBkZXB0aDIsIGRlcHRoMyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgdmVjNCgke3N0cmlkZTF9LCAke3N0cmlkZTJ9LCAke3N0cmlkZTN9LCAxKSk7XG4gICAgICAgIHZlYzIgdXYgPSAodmVjMih0ZXhDLCB0ZXhSKSArIGhhbGZDUikgL1xuICAgICAgICAgICAgICAgICAgIHZlYzIoJHt0ZXhOdW1DfS4wLCAke3RleE51bVJ9LjApO1xuICAgICAgICByZXR1cm4gc2FtcGxlVGV4dHVyZSgke3RleE5hbWV9LCB1dik7XG4gICAgICB9XG4gICAgYDtcbiAgfVxuXG4gIGlmICh0ZXhOdW1DID09PSBzdHJpZGUzICYmIGZsYXRPZmZzZXQgPT0gbnVsbCkge1xuICAgIC8vIHRleFIgaXMgdXNlZCBkaXJlY3RseSBhcyBwaHlzaWNhbCAobm8gcmlzayBvZiBmbG9hdDE2IG92ZXJmbG93KS5cbiAgICByZXR1cm4gYFxuICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCwgaW50IGRlcHRoLCBpbnQgZGVwdGgyLCBpbnQgZGVwdGgzKSB7XG4gICAgICAgIGZsb2F0IHRleFIgPSBkb3QoXG4gICAgICAgICAgdmVjNChyb3csIGNvbCwgZGVwdGgsIGRlcHRoMiksXG4gICAgICAgICAgdmVjNCgke3NoYXBlWzFdICogc2hhcGVbMl0gKiBzaGFwZVszXX0sXG4gICAgICAgICAgICAgICAke3NoYXBlWzJdICogc2hhcGVbM119LCAke3NoYXBlWzNdfSwgMSkpO1xuICAgICAgICBpbnQgdGV4QyA9IGRlcHRoMztcbiAgICAgICAgdmVjMiB1diA9ICh2ZWMyKHRleEMsIHRleFIpICsgaGFsZkNSKSAvXG4gICAgICAgICAgICAgICAgICB2ZWMyKCR7dGV4TnVtQ30uMCwgJHt0ZXhOdW1SfS4wKTtcbiAgICAgICAgcmV0dXJuIHNhbXBsZVRleHR1cmUoJHt0ZXhOYW1lfSwgdXYpO1xuICAgICAgfVxuICAgIGA7XG4gIH1cblxuICBjb25zdCBvZmZzZXQgPSBnZXRGbGF0T2Zmc2V0VW5pZm9ybU5hbWUodGV4TmFtZSk7XG4gIHJldHVybiBgXG4gICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCwgaW50IGRlcHRoLCBpbnQgZGVwdGgyLCBpbnQgZGVwdGgzKSB7XG4gICAgICAvLyBFeHBsaWNpdGx5IHVzZSBpbnRlZ2VyIG9wZXJhdGlvbnMgYXMgZG90KCkgb25seSB3b3JrcyBvbiBmbG9hdHMuXG4gICAgICBpbnQgaW5kZXggPSByb3cgKiAke3N0cmlkZTB9ICsgY29sICogJHtzdHJpZGUxfSArIGRlcHRoICogJHtzdHJpZGUyfSArXG4gICAgICAgICAgZGVwdGgyICogJHtzdHJpZGUzfSArIGRlcHRoMyArICR7b2Zmc2V0fTtcbiAgICAgIHZlYzIgdXYgPSB1dkZyb21GbGF0KCR7dGV4TnVtUn0sICR7dGV4TnVtQ30sIGluZGV4KTtcbiAgICAgIHJldHVybiBzYW1wbGVUZXh0dXJlKCR7dGV4TmFtZX0sIHV2KTtcbiAgICB9XG4gIGA7XG59XG5cbmZ1bmN0aW9uIGdldFNhbXBsZXI2RChpbnB1dEluZm86IElucHV0SW5mbyk6IHN0cmluZyB7XG4gIGNvbnN0IHNoYXBlID0gaW5wdXRJbmZvLnNoYXBlSW5mby5sb2dpY2FsU2hhcGU7XG4gIGNvbnN0IHRleE5hbWUgPSBpbnB1dEluZm8ubmFtZTtcbiAgY29uc3QgZnVuY05hbWUgPSAnZ2V0JyArIHRleE5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0ZXhOYW1lLnNsaWNlKDEpO1xuXG4gIGNvbnN0IHtuZXdTaGFwZSwga2VwdERpbXN9ID0gdXRpbC5zcXVlZXplU2hhcGUoc2hhcGUpO1xuICBpZiAobmV3U2hhcGUubGVuZ3RoIDwgc2hhcGUubGVuZ3RoKSB7XG4gICAgY29uc3QgbmV3SW5wdXRJbmZvID0gc3F1ZWV6ZUlucHV0SW5mbyhpbnB1dEluZm8sIG5ld1NoYXBlKTtcbiAgICBjb25zdCBwYXJhbXMgPSBbJ3JvdycsICdjb2wnLCAnZGVwdGgnLCAnZGVwdGgyJywgJ2RlcHRoMycsICdkZXB0aDQnXTtcbiAgICByZXR1cm4gYFxuICAgICAgJHtnZXRTYW1wbGVyRnJvbUluSW5mbyhuZXdJbnB1dEluZm8pfVxuICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCwgaW50IGRlcHRoLFxuICAgICAgICAgICAgICAgICAgICBpbnQgZGVwdGgyLCBpbnQgZGVwdGgzLCBpbnQgZGVwdGg0KSB7XG4gICAgICAgIHJldHVybiAke2Z1bmNOYW1lfSgke2dldFNxdWVlemVkUGFyYW1zKHBhcmFtcywga2VwdERpbXMpfSk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxuXG4gIGNvbnN0IHN0cmlkZTQgPSBzaGFwZVs1XTtcbiAgY29uc3Qgc3RyaWRlMyA9IHNoYXBlWzRdICogc3RyaWRlNDtcbiAgY29uc3Qgc3RyaWRlMiA9IHNoYXBlWzNdICogc3RyaWRlMztcbiAgY29uc3Qgc3RyaWRlMSA9IHNoYXBlWzJdICogc3RyaWRlMjtcbiAgY29uc3Qgc3RyaWRlMCA9IHNoYXBlWzFdICogc3RyaWRlMTtcblxuICBpZiAoaW5wdXRJbmZvLnNoYXBlSW5mby5pc1VuaWZvcm0pIHtcbiAgICAvLyBVbmlmb3JtIGFycmF5cyB3aWxsIGJlIGxlc3MgdGhhbiA2NTUwNSAobm8gcmlzayBvZiBmbG9hdDE2IG92ZXJmbG93KS5cbiAgICByZXR1cm4gYFxuICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCwgaW50IGRlcHRoLFxuICAgICAgICAgICAgICAgICAgaW50IGRlcHRoMiwgaW50IGRlcHRoMywgaW50IGRlcHRoNCkge1xuICAgICAgICBpbnQgaW5kZXggPSByb3VuZChkb3QoXG4gICAgICAgICAgdmVjNChyb3csIGNvbCwgZGVwdGgsIGRlcHRoMiksXG4gICAgICAgICAgdmVjNCgke3N0cmlkZTB9LCAke3N0cmlkZTF9LCAke3N0cmlkZTJ9LCAke3N0cmlkZTN9KSkgK1xuICAgICAgICAgIGRvdChcbiAgICAgICAgICAgIHZlYzIoZGVwdGgzLCBkZXB0aDQpLFxuICAgICAgICAgICAgdmVjMigke3N0cmlkZTR9LCAxKSkpO1xuICAgICAgICAke2dldFVuaWZvcm1TYW1wbGVyKGlucHV0SW5mbyl9XG4gICAgICB9XG4gICAgYDtcbiAgfVxuXG4gIGNvbnN0IGZsYXRPZmZzZXQgPSBpbnB1dEluZm8uc2hhcGVJbmZvLmZsYXRPZmZzZXQ7XG4gIGNvbnN0IHRleFNoYXBlID0gaW5wdXRJbmZvLnNoYXBlSW5mby50ZXhTaGFwZTtcbiAgY29uc3QgdGV4TnVtUiA9IHRleFNoYXBlWzBdO1xuICBjb25zdCB0ZXhOdW1DID0gdGV4U2hhcGVbMV07XG4gIGlmICh0ZXhOdW1DID09PSBzdHJpZGUwICYmIGZsYXRPZmZzZXQgPT0gbnVsbCkge1xuICAgIC8vIHRleEMgaXMgdXNlZCBkaXJlY3RseSBhcyBwaHlzaWNhbCAobm8gcmlzayBvZiBmbG9hdDE2IG92ZXJmbG93KS5cbiAgICByZXR1cm4gYFxuICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCwgaW50IGRlcHRoLFxuICAgICAgICAgICAgICAgICAgICBpbnQgZGVwdGgyLCBpbnQgZGVwdGgzLCBpbnQgZGVwdGg0KSB7XG4gICAgICAgIGludCB0ZXhSID0gcm93O1xuICAgICAgICBmbG9hdCB0ZXhDID0gZG90KHZlYzQoY29sLCBkZXB0aCwgZGVwdGgyLCBkZXB0aDMpLFxuICAgICAgICAgIHZlYzQoJHtzdHJpZGUxfSwgJHtzdHJpZGUyfSwgJHtzdHJpZGUzfSwgJHtzdHJpZGU0fSkpICtcbiAgICAgICAgICAgICAgIGZsb2F0KGRlcHRoNCk7XG4gICAgICAgIHZlYzIgdXYgPSAodmVjMih0ZXhDLCB0ZXhSKSArIGhhbGZDUikgL1xuICAgICAgICAgICAgICAgICAgIHZlYzIoJHt0ZXhOdW1DfS4wLCAke3RleE51bVJ9LjApO1xuICAgICAgICByZXR1cm4gc2FtcGxlVGV4dHVyZSgke3RleE5hbWV9LCB1dik7XG4gICAgICB9XG4gICAgYDtcbiAgfVxuICBpZiAodGV4TnVtQyA9PT0gc3RyaWRlNCAmJiBmbGF0T2Zmc2V0ID09IG51bGwpIHtcbiAgICAvLyB0ZXhSIGlzIHVzZWQgZGlyZWN0bHkgYXMgcGh5c2ljYWwgKG5vIHJpc2sgb2YgZmxvYXQxNiBvdmVyZmxvdykuXG4gICAgcmV0dXJuIGBcbiAgICAgIGZsb2F0ICR7ZnVuY05hbWV9KGludCByb3csIGludCBjb2wsIGludCBkZXB0aCxcbiAgICAgICAgICAgICAgICAgICAgaW50IGRlcHRoMiwgaW50IGRlcHRoMywgaW50IGRlcHRoNCkge1xuICAgICAgICBmbG9hdCB0ZXhSID0gZG90KHZlYzQocm93LCBjb2wsIGRlcHRoLCBkZXB0aDIpLFxuICAgICAgICAgIHZlYzQoJHtzaGFwZVsxXSAqIHNoYXBlWzJdICogc2hhcGVbM10gKiBzaGFwZVs0XX0sXG4gICAgICAgICAgICAgICAke3NoYXBlWzJdICogc2hhcGVbM10gKiBzaGFwZVs0XX0sXG4gICAgICAgICAgICAgICAke3NoYXBlWzNdICogc2hhcGVbNF19LFxuICAgICAgICAgICAgICAgJHtzaGFwZVs0XX0pKSArIGZsb2F0KGRlcHRoMyk7XG4gICAgICAgIGludCB0ZXhDID0gZGVwdGg0O1xuICAgICAgICB2ZWMyIHV2ID0gKHZlYzIodGV4QywgdGV4UikgKyBoYWxmQ1IpIC9cbiAgICAgICAgICAgICAgICAgIHZlYzIoJHt0ZXhOdW1DfS4wLCAke3RleE51bVJ9LjApO1xuICAgICAgICByZXR1cm4gc2FtcGxlVGV4dHVyZSgke3RleE5hbWV9LCB1dik7XG4gICAgICB9XG4gICAgYDtcbiAgfVxuICBjb25zdCBvZmZzZXQgPSBnZXRGbGF0T2Zmc2V0VW5pZm9ybU5hbWUodGV4TmFtZSk7XG4gIHJldHVybiBgXG4gICAgZmxvYXQgJHtmdW5jTmFtZX0oaW50IHJvdywgaW50IGNvbCwgaW50IGRlcHRoLFxuICAgICAgICAgICAgICAgICAgaW50IGRlcHRoMiwgaW50IGRlcHRoMywgaW50IGRlcHRoNCkge1xuICAgICAgLy8gRXhwbGljaXRseSB1c2UgaW50ZWdlciBvcGVyYXRpb25zIGFzIGRvdCgpIG9ubHkgd29ya3Mgb24gZmxvYXRzLlxuICAgICAgaW50IGluZGV4ID0gcm93ICogJHtzdHJpZGUwfSArIGNvbCAqICR7c3RyaWRlMX0gKyBkZXB0aCAqICR7c3RyaWRlMn0gK1xuICAgICAgICAgIGRlcHRoMiAqICR7c3RyaWRlM30gKyBkZXB0aDMgKiAke3N0cmlkZTR9ICsgZGVwdGg0ICsgJHtvZmZzZXR9O1xuICAgICAgdmVjMiB1diA9IHV2RnJvbUZsYXQoJHt0ZXhOdW1SfSwgJHt0ZXhOdW1DfSwgaW5kZXgpO1xuICAgICAgcmV0dXJuIHNhbXBsZVRleHR1cmUoJHt0ZXhOYW1lfSwgdXYpO1xuICAgIH1cbiAgYDtcbn1cblxuZnVuY3Rpb24gZ2V0VW5pZm9ybVNhbXBsZXIoaW5wdXRJbmZvOiBJbnB1dEluZm8pOiBzdHJpbmcge1xuICBjb25zdCB0ZXhOYW1lID0gaW5wdXRJbmZvLm5hbWU7XG4gIGNvbnN0IGluU2l6ZSA9IHV0aWwuc2l6ZUZyb21TaGFwZShpbnB1dEluZm8uc2hhcGVJbmZvLmxvZ2ljYWxTaGFwZSk7XG5cbiAgaWYgKGluU2l6ZSA8IDIpIHtcbiAgICByZXR1cm4gYHJldHVybiAke3RleE5hbWV9O2A7XG4gIH1cblxuICByZXR1cm4gYFxuICAgIGZvciAoaW50IGkgPSAwOyBpIDwgJHtpblNpemV9OyBpKyspIHtcbiAgICAgIGlmIChpID09IGluZGV4KSB7XG4gICAgICAgIHJldHVybiAke3RleE5hbWV9W2ldO1xuICAgICAgfVxuICAgIH1cbiAgYDtcbn1cblxuZnVuY3Rpb24gZ2V0UGFja2VkU2FtcGxlckF0T3V0cHV0Q29vcmRzKFxuICAgIGlucHV0SW5mbzogSW5wdXRJbmZvLCBvdXRTaGFwZUluZm86IFNoYXBlSW5mbykge1xuICBjb25zdCB0ZXhOYW1lID0gaW5wdXRJbmZvLm5hbWU7XG4gIGNvbnN0IHRleEZ1bmNTbmlwcGV0ID0gdGV4TmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRleE5hbWUuc2xpY2UoMSk7XG4gIGNvbnN0IGZ1bmNOYW1lID0gJ2dldCcgKyB0ZXhGdW5jU25pcHBldCArICdBdE91dENvb3Jkcyc7XG4gIGNvbnN0IGluUmFuayA9IGlucHV0SW5mby5zaGFwZUluZm8ubG9naWNhbFNoYXBlLmxlbmd0aDtcbiAgY29uc3Qgb3V0UmFuayA9IG91dFNoYXBlSW5mby5sb2dpY2FsU2hhcGUubGVuZ3RoO1xuXG4gIGNvbnN0IGJyb2FkY2FzdERpbXMgPSBnZXRCcm9hZGNhc3REaW1zKFxuICAgICAgaW5wdXRJbmZvLnNoYXBlSW5mby5sb2dpY2FsU2hhcGUsIG91dFNoYXBlSW5mby5sb2dpY2FsU2hhcGUpO1xuXG4gIGNvbnN0IHR5cGUgPSBnZXRDb29yZHNEYXRhVHlwZShvdXRSYW5rKTtcbiAgY29uc3QgcmFua0RpZmYgPSBvdXRSYW5rIC0gaW5SYW5rO1xuICBsZXQgY29vcmRzU25pcHBldDogc3RyaW5nO1xuICBjb25zdCBmaWVsZHMgPSBbJ3gnLCAneScsICd6JywgJ3cnLCAndScsICd2J107XG5cbiAgaWYgKGluUmFuayA9PT0gMCkge1xuICAgIGNvb3Jkc1NuaXBwZXQgPSAnJztcbiAgfSBlbHNlIGlmIChvdXRSYW5rIDwgMiAmJiBicm9hZGNhc3REaW1zLmxlbmd0aCA+PSAxKSB7XG4gICAgY29vcmRzU25pcHBldCA9ICdjb29yZHMgPSAwOyc7XG4gIH0gZWxzZSB7XG4gICAgY29vcmRzU25pcHBldCA9XG4gICAgICAgIGJyb2FkY2FzdERpbXMubWFwKGQgPT4gYGNvb3Jkcy4ke2ZpZWxkc1tkICsgcmFua0RpZmZdfSA9IDA7YClcbiAgICAgICAgICAgIC5qb2luKCdcXG4nKTtcbiAgfVxuICBsZXQgdW5wYWNrZWRDb29yZHNTbmlwcGV0ID0gJyc7XG4gIGlmIChvdXRSYW5rIDwgMiAmJiBpblJhbmsgPiAwKSB7XG4gICAgdW5wYWNrZWRDb29yZHNTbmlwcGV0ID0gJ2Nvb3Jkcyc7XG4gIH0gZWxzZSB7XG4gICAgdW5wYWNrZWRDb29yZHNTbmlwcGV0ID0gaW5wdXRJbmZvLnNoYXBlSW5mby5sb2dpY2FsU2hhcGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgocywgaSkgPT4gYGNvb3Jkcy4ke2ZpZWxkc1tpICsgcmFua0RpZmZdfWApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKCcsICcpO1xuICB9XG5cbiAgbGV0IG91dHB1dCA9IGByZXR1cm4gb3V0cHV0VmFsdWU7YDtcbiAgY29uc3QgaW5TaXplID0gdXRpbC5zaXplRnJvbVNoYXBlKGlucHV0SW5mby5zaGFwZUluZm8ubG9naWNhbFNoYXBlKTtcbiAgY29uc3QgaXNJbnB1dFNjYWxhciA9IGluU2l6ZSA9PT0gMTtcbiAgY29uc3Qgb3V0U2l6ZSA9IHV0aWwuc2l6ZUZyb21TaGFwZShvdXRTaGFwZUluZm8ubG9naWNhbFNoYXBlKTtcbiAgY29uc3QgaXNPdXRwdXRTY2FsYXIgPSBvdXRTaXplID09PSAxO1xuXG4gIGlmIChpblJhbmsgPT09IDEgJiYgIWlzSW5wdXRTY2FsYXIgJiYgIWlzT3V0cHV0U2NhbGFyKSB7XG4gICAgb3V0cHV0ID0gYFxuICAgICAgcmV0dXJuIHZlYzQob3V0cHV0VmFsdWUueHksIG91dHB1dFZhbHVlLnh5KTtcbiAgICBgO1xuICB9IGVsc2UgaWYgKGlzSW5wdXRTY2FsYXIgJiYgIWlzT3V0cHV0U2NhbGFyKSB7XG4gICAgaWYgKG91dFJhbmsgPT09IDEpIHtcbiAgICAgIG91dHB1dCA9IGBcbiAgICAgICAgcmV0dXJuIHZlYzQob3V0cHV0VmFsdWUueCwgb3V0cHV0VmFsdWUueCwgMC4sIDAuKTtcbiAgICAgIGA7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dCA9IGBcbiAgICAgICAgcmV0dXJuIHZlYzQob3V0cHV0VmFsdWUueCk7XG4gICAgICBgO1xuICAgIH1cbiAgfSBlbHNlIGlmIChicm9hZGNhc3REaW1zLmxlbmd0aCkge1xuICAgIGNvbnN0IHJvd3MgPSBpblJhbmsgLSAyO1xuICAgIGNvbnN0IGNvbHMgPSBpblJhbmsgLSAxO1xuXG4gICAgaWYgKGJyb2FkY2FzdERpbXMuaW5kZXhPZihyb3dzKSA+IC0xICYmIGJyb2FkY2FzdERpbXMuaW5kZXhPZihjb2xzKSA+IC0xKSB7XG4gICAgICBvdXRwdXQgPSBgcmV0dXJuIHZlYzQob3V0cHV0VmFsdWUueCk7YDtcbiAgICB9IGVsc2UgaWYgKGJyb2FkY2FzdERpbXMuaW5kZXhPZihyb3dzKSA+IC0xKSB7XG4gICAgICBvdXRwdXQgPSBgcmV0dXJuIHZlYzQob3V0cHV0VmFsdWUueCwgb3V0cHV0VmFsdWUueSwgYCArXG4gICAgICAgICAgYG91dHB1dFZhbHVlLngsIG91dHB1dFZhbHVlLnkpO2A7XG4gICAgfSBlbHNlIGlmIChicm9hZGNhc3REaW1zLmluZGV4T2YoY29scykgPiAtMSkge1xuICAgICAgb3V0cHV0ID0gYHJldHVybiB2ZWM0KG91dHB1dFZhbHVlLnh4LCBvdXRwdXRWYWx1ZS56eik7YDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYFxuICAgIHZlYzQgJHtmdW5jTmFtZX0oKSB7XG4gICAgICAke3R5cGV9IGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgJHtjb29yZHNTbmlwcGV0fVxuICAgICAgdmVjNCBvdXRwdXRWYWx1ZSA9IGdldCR7dGV4RnVuY1NuaXBwZXR9KCR7dW5wYWNrZWRDb29yZHNTbmlwcGV0fSk7XG4gICAgICAke291dHB1dH1cbiAgICB9XG4gIGA7XG59XG5cbmZ1bmN0aW9uIGdldFNhbXBsZXJBdE91dHB1dENvb3JkcyhcbiAgICBpbnB1dEluZm86IElucHV0SW5mbywgb3V0U2hhcGVJbmZvOiBTaGFwZUluZm8pIHtcbiAgY29uc3QgdGV4TmFtZSA9IGlucHV0SW5mby5uYW1lO1xuICBjb25zdCB0ZXhGdW5jU25pcHBldCA9IHRleE5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0ZXhOYW1lLnNsaWNlKDEpO1xuICBjb25zdCBmdW5jTmFtZSA9ICdnZXQnICsgdGV4RnVuY1NuaXBwZXQgKyAnQXRPdXRDb29yZHMnO1xuICBjb25zdCBvdXRUZXhTaGFwZSA9IG91dFNoYXBlSW5mby50ZXhTaGFwZTtcbiAgY29uc3QgaW5UZXhTaGFwZSA9IGlucHV0SW5mby5zaGFwZUluZm8udGV4U2hhcGU7XG4gIGNvbnN0IGluUmFuayA9IGlucHV0SW5mby5zaGFwZUluZm8ubG9naWNhbFNoYXBlLmxlbmd0aDtcbiAgY29uc3Qgb3V0UmFuayA9IG91dFNoYXBlSW5mby5sb2dpY2FsU2hhcGUubGVuZ3RoO1xuXG4gIGlmICghaW5wdXRJbmZvLnNoYXBlSW5mby5pc1VuaWZvcm0gJiYgaW5SYW5rID09PSBvdXRSYW5rICYmXG4gICAgICBpbnB1dEluZm8uc2hhcGVJbmZvLmZsYXRPZmZzZXQgPT0gbnVsbCAmJlxuICAgICAgdXRpbC5hcnJheXNFcXVhbChpblRleFNoYXBlLCBvdXRUZXhTaGFwZSkpIHtcbiAgICByZXR1cm4gYFxuICAgICAgZmxvYXQgJHtmdW5jTmFtZX0oKSB7XG4gICAgICAgIHJldHVybiBzYW1wbGVUZXh0dXJlKCR7dGV4TmFtZX0sIHJlc3VsdFVWKTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG5cbiAgY29uc3QgdHlwZSA9IGdldENvb3Jkc0RhdGFUeXBlKG91dFJhbmspO1xuICBjb25zdCBicm9hZGNhc3REaW1zID0gZ2V0QnJvYWRjYXN0RGltcyhcbiAgICAgIGlucHV0SW5mby5zaGFwZUluZm8ubG9naWNhbFNoYXBlLCBvdXRTaGFwZUluZm8ubG9naWNhbFNoYXBlKTtcbiAgY29uc3QgcmFua0RpZmYgPSBvdXRSYW5rIC0gaW5SYW5rO1xuICBsZXQgY29vcmRzU25pcHBldDogc3RyaW5nO1xuICBjb25zdCBmaWVsZHMgPSBbJ3gnLCAneScsICd6JywgJ3cnLCAndScsICd2J107XG5cbiAgaWYgKGluUmFuayA9PT0gMCkge1xuICAgIGNvb3Jkc1NuaXBwZXQgPSAnJztcbiAgfSBlbHNlIGlmIChvdXRSYW5rIDwgMiAmJiBicm9hZGNhc3REaW1zLmxlbmd0aCA+PSAxKSB7XG4gICAgY29vcmRzU25pcHBldCA9ICdjb29yZHMgPSAwOyc7XG4gIH0gZWxzZSB7XG4gICAgY29vcmRzU25pcHBldCA9XG4gICAgICAgIGJyb2FkY2FzdERpbXMubWFwKGQgPT4gYGNvb3Jkcy4ke2ZpZWxkc1tkICsgcmFua0RpZmZdfSA9IDA7YClcbiAgICAgICAgICAgIC5qb2luKCdcXG4nKTtcbiAgfVxuICBsZXQgdW5wYWNrZWRDb29yZHNTbmlwcGV0ID0gJyc7XG4gIGlmIChvdXRSYW5rIDwgMiAmJiBpblJhbmsgPiAwKSB7XG4gICAgdW5wYWNrZWRDb29yZHNTbmlwcGV0ID0gJ2Nvb3Jkcyc7XG4gIH0gZWxzZSB7XG4gICAgdW5wYWNrZWRDb29yZHNTbmlwcGV0ID0gaW5wdXRJbmZvLnNoYXBlSW5mby5sb2dpY2FsU2hhcGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgocywgaSkgPT4gYGNvb3Jkcy4ke2ZpZWxkc1tpICsgcmFua0RpZmZdfWApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5qb2luKCcsICcpO1xuICB9XG5cbiAgcmV0dXJuIGBcbiAgICBmbG9hdCAke2Z1bmNOYW1lfSgpIHtcbiAgICAgICR7dHlwZX0gY29vcmRzID0gZ2V0T3V0cHV0Q29vcmRzKCk7XG4gICAgICAke2Nvb3Jkc1NuaXBwZXR9XG4gICAgICByZXR1cm4gZ2V0JHt0ZXhGdW5jU25pcHBldH0oJHt1bnBhY2tlZENvb3Jkc1NuaXBwZXR9KTtcbiAgICB9XG4gIGA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb29yZHNEYXRhVHlwZShyYW5rOiBudW1iZXIpOiBzdHJpbmcge1xuICBpZiAocmFuayA8PSAxKSB7XG4gICAgcmV0dXJuICdpbnQnO1xuICB9IGVsc2UgaWYgKHJhbmsgPT09IDIpIHtcbiAgICByZXR1cm4gJ2l2ZWMyJztcbiAgfSBlbHNlIGlmIChyYW5rID09PSAzKSB7XG4gICAgcmV0dXJuICdpdmVjMyc7XG4gIH0gZWxzZSBpZiAocmFuayA9PT0gNCkge1xuICAgIHJldHVybiAnaXZlYzQnO1xuICB9IGVsc2UgaWYgKHJhbmsgPT09IDUpIHtcbiAgICByZXR1cm4gJ2l2ZWM1JztcbiAgfSBlbHNlIGlmIChyYW5rID09PSA2KSB7XG4gICAgcmV0dXJuICdpdmVjNic7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgRXJyb3IoYEdQVSBmb3IgcmFuayAke3Jhbmt9IGlzIG5vdCB5ZXQgc3VwcG9ydGVkYCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVuaWZvcm1JbmZvRnJvbVNoYXBlKFxuICAgIGlzUGFja2VkOiBib29sZWFuLCBzaGFwZTogbnVtYmVyW10sIHRleFNoYXBlOiBudW1iZXJbXSkge1xuICBjb25zdCB7bmV3U2hhcGUsIGtlcHREaW1zfSA9IHV0aWwuc3F1ZWV6ZVNoYXBlKHNoYXBlKTtcbiAgY29uc3QgcmFuayA9IHNoYXBlLmxlbmd0aDtcbiAgY29uc3QgdXNlU3F1ZWV6ZVBhY2tlZFNoYXBlID0gaXNQYWNrZWQgJiYgcmFuayA9PT0gMyAmJiBzaGFwZVswXSA9PT0gMTtcbiAgY29uc3Qgc3F1ZWV6ZVNoYXBlID0gdXNlU3F1ZWV6ZVBhY2tlZFNoYXBlID8gc2hhcGUuc2xpY2UoMSkgOiBuZXdTaGFwZTtcbiAgY29uc3QgdXNlU3F1ZWV6ZVNoYXBlID1cbiAgICAgICghaXNQYWNrZWQgJiYgcmFuayA+IDEgJiYgIXV0aWwuYXJyYXlzRXF1YWwoc2hhcGUsIHRleFNoYXBlKSAmJlxuICAgICAgIG5ld1NoYXBlLmxlbmd0aCA8IHJhbmspIHx8XG4gICAgICB1c2VTcXVlZXplUGFja2VkU2hhcGU7XG4gIGNvbnN0IHVuaWZvcm1TaGFwZSA9IHVzZVNxdWVlemVTaGFwZSA/IHNxdWVlemVTaGFwZSA6IHNoYXBlO1xuICByZXR1cm4ge3VzZVNxdWVlemVTaGFwZSwgdW5pZm9ybVNoYXBlLCBrZXB0RGltc307XG59XG5cbi8qKiBSZXR1cm5zIGEgbmV3IGlucHV0IGluZm8gKGEgY29weSkgdGhhdCBoYXMgYSBzcXVlZXplZCBsb2dpY2FsIHNoYXBlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNxdWVlemVJbnB1dEluZm8oXG4gICAgaW5JbmZvOiBJbnB1dEluZm8sIHNxdWVlemVkU2hhcGU6IG51bWJlcltdKTogSW5wdXRJbmZvIHtcbiAgLy8gRGVlcCBjb3B5LlxuICBjb25zdCBuZXdJbnB1dEluZm86IElucHV0SW5mbyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoaW5JbmZvKSk7XG4gIG5ld0lucHV0SW5mby5zaGFwZUluZm8ubG9naWNhbFNoYXBlID0gc3F1ZWV6ZWRTaGFwZTtcbiAgcmV0dXJuIG5ld0lucHV0SW5mbztcbn1cblxuZnVuY3Rpb24gZ2V0U3F1ZWV6ZWRQYXJhbXMocGFyYW1zOiBzdHJpbmdbXSwga2VwdERpbXM6IG51bWJlcltdKTogc3RyaW5nIHtcbiAgcmV0dXJuIGtlcHREaW1zLm1hcChkID0+IHBhcmFtc1tkXSkuam9pbignLCAnKTtcbn1cbiJdfQ==