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
import { backend_util, env, util } from '@tensorflow/tfjs-core';
import * as shader_compiler from './shader_compiler';
import { createFragmentShader } from './webgl_util';
export function compileProgram(gpgpu, program, inputs, output) {
    const inputInfos = inputs.map((input, i) => {
        const shapeInfo = {
            logicalShape: input.shape,
            texShape: input.isUniform ? null : input.texData.texShape,
            isUniform: input.isUniform,
            isPacked: input.isUniform ? false : input.texData.isPacked,
            flatOffset: null
        };
        if (input.texData != null && input.texData.slice != null &&
            input.texData.slice.flatOffset > 0) {
            shapeInfo.flatOffset = input.texData.slice.flatOffset;
        }
        return { name: program.variableNames[i], shapeInfo };
    });
    const inShapeInfos = inputInfos.map(x => x.shapeInfo);
    const outShapeInfo = {
        logicalShape: output.shape,
        texShape: output.texData.texShape,
        isUniform: false,
        isPacked: output.texData.isPacked,
        flatOffset: null
    };
    const source = shader_compiler.makeShader(inputInfos, outShapeInfo, program);
    const fragmentShader = createFragmentShader(gpgpu.gl, source);
    const webGLProgram = gpgpu.createProgram(fragmentShader);
    if (!env().get('ENGINE_COMPILE_ONLY')) {
        return Object.assign({ program,
            fragmentShader,
            source,
            webGLProgram,
            inShapeInfos,
            outShapeInfo }, getUniformLocations(gpgpu, program, webGLProgram));
    }
    else {
        return {
            program,
            fragmentShader,
            source,
            webGLProgram,
            inShapeInfos,
            outShapeInfo,
            uniformLocations: null,
            customUniformLocations: null,
            infLoc: null,
            nanLoc: null,
            inShapesLocations: null,
            inTexShapesLocations: null,
            outShapeLocation: null,
            outShapeStridesLocation: null,
            outTexShapeLocation: null
        };
    }
}
export function getUniformLocations(gpgpu, program, webGLProgram) {
    const uniformLocations = {};
    const inShapesLocations = {};
    const inTexShapesLocations = {};
    const customUniformLocations = [];
    let outShapeLocation;
    let outTexShapeLocation;
    let outShapeStridesLocation;
    let infLoc = null;
    let nanLoc = null;
    // Add special uniforms (NAN, INFINITY)
    nanLoc = gpgpu.getUniformLocation(webGLProgram, 'NAN', false);
    if (env().getNumber('WEBGL_VERSION') === 1) {
        infLoc = gpgpu.getUniformLocation(webGLProgram, 'INFINITY', false);
    }
    // Add user-defined uniforms
    const shouldThrow = false;
    for (let i = 0; i < program.variableNames.length; i++) {
        const varName = program.variableNames[i];
        uniformLocations[varName] =
            gpgpu.getUniformLocation(webGLProgram, varName, shouldThrow);
        uniformLocations[`offset${varName}`] =
            gpgpu.getUniformLocation(webGLProgram, `offset${varName}`, shouldThrow);
        if (program.enableShapeUniforms) {
            inShapesLocations[`${varName}Shape`] = gpgpu.getUniformLocation(webGLProgram, `${varName}Shape`, shouldThrow);
            inTexShapesLocations[`${varName}TexShape`] = gpgpu.getUniformLocation(webGLProgram, `${varName}TexShape`, shouldThrow);
        }
    }
    if (program.enableShapeUniforms) {
        outShapeLocation =
            gpgpu.getUniformLocation(webGLProgram, 'outShape', shouldThrow);
        outShapeStridesLocation =
            gpgpu.getUniformLocation(webGLProgram, 'outShapeStrides', shouldThrow);
        outTexShapeLocation =
            gpgpu.getUniformLocation(webGLProgram, 'outTexShape', shouldThrow);
    }
    if (program.customUniforms) {
        program.customUniforms.forEach((d, i) => {
            customUniformLocations[i] =
                gpgpu.getUniformLocation(webGLProgram, d.name, shouldThrow);
        });
    }
    return {
        uniformLocations,
        customUniformLocations,
        infLoc,
        nanLoc,
        inShapesLocations,
        inTexShapesLocations,
        outShapeLocation,
        outShapeStridesLocation,
        outTexShapeLocation
    };
}
function validateBinaryAndProgram(shapeInfos, inputs) {
    if (shapeInfos.length !== inputs.length) {
        throw Error(`Binary was compiled with ${shapeInfos.length} inputs, but ` +
            `was executed with ${inputs.length} inputs`);
    }
    shapeInfos.forEach((s, i) => {
        const shapeA = s.logicalShape;
        const input = inputs[i];
        const shapeB = input.shape;
        if (!util.arraysEqual(shapeA, shapeB)) {
            throw Error(`Binary was compiled with different shapes than ` +
                `the current args. Shapes ${shapeA} and ${shapeB} must match`);
        }
        // The input is uploaded as uniform.
        if (s.isUniform && input.isUniform) {
            return;
        }
        const texShapeA = s.texShape;
        const texShapeB = input.isUniform ? null : input.texData.texShape;
        if (!util.arraysEqual(texShapeA, texShapeB)) {
            throw Error(`Binary was compiled with different texture shapes than the` +
                ` current args. Shape ${texShapeA} and ${texShapeB} must match`);
        }
    });
}
export function runProgram(gpgpu, binary, inputs, output, customUniformValues) {
    if (!binary.program.enableShapeUniforms) {
        validateBinaryAndProgram(binary.inShapeInfos, inputs);
        validateBinaryAndProgram([binary.outShapeInfo], [output]);
    }
    const outTex = output.texData.texture;
    const outTexShape = output.texData.texShape;
    if (output.texData.isPacked) {
        gpgpu.setOutputPackedMatrixTexture(outTex.texture, outTexShape[0], outTexShape[1]);
    }
    else {
        gpgpu.setOutputMatrixTexture(outTex.texture, outTexShape[0], outTexShape[1]);
    }
    gpgpu.setProgram(binary.webGLProgram);
    // Set special uniforms (NAN, INFINITY)
    if (env().getNumber('WEBGL_VERSION') === 1) {
        if (binary.infLoc !== null) {
            gpgpu.gl.uniform1f(binary.infLoc, Infinity);
        }
    }
    if (binary.nanLoc !== null) {
        gpgpu.gl.uniform1f(binary.nanLoc, NaN);
    }
    // Set user-defined inputs
    inputs.forEach((input, i) => {
        const varName = binary.program.variableNames[i];
        const varLoc = binary.uniformLocations[varName];
        const varOffsetLoc = binary.uniformLocations[`offset${varName}`];
        const varShapeLoc = binary.inShapesLocations[`${varName}Shape`];
        const varTexShapeLoc = binary.inTexShapesLocations[`${varName}TexShape`];
        if (varShapeLoc) {
            const { uniformShape } = shader_compiler.getUniformInfoFromShape(binary.program.packedInputs, input.shape, input.texData.texShape);
            switch (uniformShape.length) {
                case 1:
                    gpgpu.gl.uniform1iv(varShapeLoc, new Int32Array(uniformShape));
                    break;
                case 2:
                    gpgpu.gl.uniform2iv(varShapeLoc, new Int32Array(uniformShape));
                    break;
                case 3:
                    gpgpu.gl.uniform3iv(varShapeLoc, new Int32Array(uniformShape));
                    break;
                case 4:
                    gpgpu.gl.uniform4iv(varShapeLoc, new Int32Array(uniformShape));
                    break;
                default:
                    break;
            }
        }
        if (varTexShapeLoc) {
            gpgpu.gl.uniform2i(varTexShapeLoc, input.texData.texShape[0], input.texData.texShape[1]);
        }
        if (varLoc == null) {
            // The compiler inferred that this variable is not used in this shader.
            return;
        }
        if (input.isUniform) {
            // Upload the values of the tensor as uniform.
            if (util.sizeFromShape(input.shape) < 2) {
                gpgpu.gl.uniform1f(varLoc, input.uniformValues[0]);
            }
            else {
                let vals = input.uniformValues;
                if (!(vals instanceof Float32Array)) {
                    vals = new Float32Array(vals);
                }
                gpgpu.gl.uniform1fv(varLoc, vals);
            }
            return;
        }
        // If the input was sliced, upload the flat offset index.
        if (input.texData.slice != null && varOffsetLoc != null) {
            gpgpu.gl.uniform1i(varOffsetLoc, input.texData.slice.flatOffset);
        }
        gpgpu.setInputMatrixTexture(input.texData.texture.texture, varLoc, i);
    });
    const outShapeLoc = binary.outShapeLocation;
    if (outShapeLoc) {
        switch (output.shape.length) {
            case 1:
                gpgpu.gl.uniform1iv(outShapeLoc, new Int32Array(output.shape));
                break;
            case 2:
                gpgpu.gl.uniform2iv(outShapeLoc, new Int32Array(output.shape));
                break;
            case 3:
                gpgpu.gl.uniform3iv(outShapeLoc, new Int32Array(output.shape));
                break;
            case 4:
                gpgpu.gl.uniform4iv(outShapeLoc, new Int32Array(output.shape));
                break;
            default:
                break;
        }
    }
    if (binary.outShapeStridesLocation) {
        const strides = util.computeStrides(output.shape);
        switch (output.shape.length) {
            case 2:
                gpgpu.gl.uniform1iv(binary.outShapeStridesLocation, new Int32Array(strides));
                break;
            case 3:
                gpgpu.gl.uniform2iv(binary.outShapeStridesLocation, new Int32Array(strides));
                break;
            case 4:
                gpgpu.gl.uniform3iv(binary.outShapeStridesLocation, new Int32Array(strides));
                break;
            default:
                break;
        }
    }
    if (binary.outTexShapeLocation) {
        gpgpu.gl.uniform2i(binary.outTexShapeLocation, output.texData.texShape[0], output.texData.texShape[1]);
    }
    if (binary.program.customUniforms && customUniformValues) {
        binary.program.customUniforms.forEach((d, i) => {
            const customLoc = binary.customUniformLocations[i];
            const customValue = customUniformValues[i];
            if (d.type === 'float') {
                gpgpu.gl.uniform1fv(customLoc, customValue);
            }
            else if (d.type === 'vec2') {
                gpgpu.gl.uniform2fv(customLoc, customValue);
            }
            else if (d.type === 'vec3') {
                gpgpu.gl.uniform3fv(customLoc, customValue);
            }
            else if (d.type === 'vec4') {
                gpgpu.gl.uniform4fv(customLoc, customValue);
            }
            else if (d.type === 'int') {
                gpgpu.gl.uniform1iv(customLoc, customValue);
            }
            else if (d.type === 'ivec2') {
                gpgpu.gl.uniform2iv(customLoc, customValue);
            }
            else if (d.type === 'ivec3') {
                gpgpu.gl.uniform3iv(customLoc, customValue);
            }
            else if (d.type === 'ivec4') {
                gpgpu.gl.uniform4iv(customLoc, customValue);
            }
            else {
                throw Error(`uniform type ${d.type} is not supported yet.`);
            }
        });
    }
    gpgpu.executeProgram();
}
export function makeShaderKey(program, inputs, output) {
    let keyInputs = '';
    inputs.concat(output).forEach(x => {
        const hasOffset = x.texData != null && x.texData.slice != null &&
            x.texData.slice.flatOffset > 0;
        // TODO: Remove the condition of !x.isUniform.
        if (program.enableShapeUniforms && !x.isUniform) {
            const xTexShape = x.texData.texShape;
            const { useSqueezeShape, uniformShape, keptDims } = shader_compiler.getUniformInfoFromShape(program.packedInputs, x.shape, xTexShape);
            let rank1 = '', rank2 = '', rank34 = '';
            if (uniformShape.length === 1 && program.packedInputs) {
                const packedTexShape = [Math.ceil(xTexShape[0] / 2), Math.ceil(xTexShape[1] / 2)];
                rank1 = `${packedTexShape[0] > 1}_${packedTexShape[1] > 1}`;
            }
            else if (uniformShape.length === 2 && !program.packedInputs) {
                rank2 = `${uniformShape[0] > 1}_${uniformShape[1] > 1}`;
            }
            else if (uniformShape.length > 2 && !program.packedInputs) {
                const strides = util.computeStrides(uniformShape);
                rank34 = `${strides[0] === xTexShape[1]}_${strides[strides.length - 1] === xTexShape[1]}`;
            }
            const xRank = x.shape.length;
            const isLogicalShapTexShapeEqual = uniformShape.length === 2 && util.arraysEqual(x.shape, xTexShape);
            const isScalar = util.sizeFromShape(x.shape) === 1;
            const broadcastDims = backend_util.getBroadcastDims(x.shape, output.shape);
            const isInOutTexShapeEqual = !program.packedInputs &&
                xRank === output.shape.length &&
                util.arraysEqual(xTexShape, output.texData.texShape);
            const isTexShapeGreaterThanOne = program.packedInputs || uniformShape.length > 2 ?
                '' :
                `${xTexShape[0] > 1}_${xTexShape[1] > 1}`;
            // These key components are needed due to shader_compiler is embedding
            // them in the shader.
            // |xRank| is used to determine the coords length. See
            // get[Packed]SamplerAtOutputCoords.
            // |isInOutTexShapeEqual| is used to determine whether going to an
            // optimization path in getSamplerAtOutputCoords.
            // |useSqueezeShape| is extracted from squeezeInputInfo of
            // getSampler[2|3|4]D/getPackedSampler3D.
            // |isScalar| is extracted from isInputScalar/isOutputScalar in
            // getPackedSamplerAtOutputCoords.
            // |broadcastDims| is extracted from get[Packed]SamplerAtOutputCoords.
            // |isLogicalShapTexShapeEqual| is used in
            // getOutput[Packed]2DCoords/get[Packed]Sampler2D.
            // |rank1| is used in getOutputPacked1DCoords.
            // |rank2| is used in getOutput2DCoords.
            // |rank34| is used in getSampler3D/getSampler4D.
            // |isTexShapeGreaterThanOne| are used in
            // getSampler[Scalar|1D|2D]/getOutput1DCoords.
            keyInputs += `${xRank}_${isInOutTexShapeEqual}_${useSqueezeShape ? keptDims : ''}_${uniformShape.length}_${isScalar}_${broadcastDims}_${isLogicalShapTexShapeEqual}_${rank1}_${rank2}_${rank34}_${isTexShapeGreaterThanOne}_${hasOffset}`;
        }
        else {
            const texShape = x.isUniform ? 'uniform' : x.texData.texShape;
            keyInputs += `${x.shape}_${texShape}_${hasOffset}`;
        }
    });
    const keyUserCode = program.userCode;
    let key = program.constructor.name;
    // Fast string concat. See https://jsperf.com/string-concatenation/14.
    key += '_' + keyInputs + '_' + keyUserCode +
        `${env().getNumber('WEBGL_VERSION')}`;
    return key;
}
export function useShapeUniforms(rank) {
    // TODO: Remove the limitaion of rank <= 4.
    return env().getBool('WEBGL_USE_SHAPES_UNIFORMS') && rank <= 4;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3BncHVfbWF0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3RmanMtYmFja2VuZC13ZWJnbC9zcmMvZ3BncHVfbWF0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsWUFBWSxFQUFFLEdBQUcsRUFBc0IsSUFBSSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFHbEYsT0FBTyxLQUFLLGVBQWUsTUFBTSxtQkFBbUIsQ0FBQztBQUdyRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxjQUFjLENBQUM7QUErRGxELE1BQU0sVUFBVSxjQUFjLENBQzFCLEtBQW1CLEVBQUUsT0FBcUIsRUFBRSxNQUFvQixFQUNoRSxNQUFrQjtJQUNwQixNQUFNLFVBQVUsR0FBZ0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0RCxNQUFNLFNBQVMsR0FBYztZQUMzQixZQUFZLEVBQUUsS0FBSyxDQUFDLEtBQUs7WUFDekIsUUFBUSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRO1lBQ3pELFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztZQUMxQixRQUFRLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVE7WUFDMUQsVUFBVSxFQUFFLElBQUk7U0FDakIsQ0FBQztRQUNGLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSTtZQUNwRCxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFO1lBQ3RDLFNBQVMsQ0FBQyxVQUFVLEdB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QUFJLG9CQUFvQixJQUN6QyxlQUFlLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLFlBQVksQ0FBQyxNQUFNLElBQUksUUFBUSxJQUNsRSxhQUFhLElBQUksMEJBQTBCLElBQUksS0FBSyxJQUFJLEtBQUssSUFDN0QsTUFBTSxJQUFJLHdCQUF3QixJQUFJLFNBQVMsRUFBRSxDQUFDO1NBQ3ZEO2FBQU07WUFDTCxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQzlELFNBQVMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksUUFBUSxJQUFJLFNBQVMsRUFBRSxDQUFDO1NBQ3BEO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0lBQ3JDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO0lBQ25DLHNFQUFzRTtJQUN0RSxHQUFHLElBQUksR0FBRyxHQUFHLFNBQVMsR0FBRyxHQUFHLEdBQUcsV0FBVztRQUN0QyxHQUFHLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDO0lBQzFDLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxJQUFZO0lBQzNDLDJDQUEyQztJQUMzQyxPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUM7QUFDakUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtiYWNrZW5kX3V0aWwsIGVudiwgVGVuc29yLCBUeXBlZEFycmF5LCB1dGlsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge0dQR1BVQ29udGV4dH0gZnJvbSAnLi9ncGdwdV9jb250ZXh0JztcbmltcG9ydCAqIGFzIHNoYWRlcl9jb21waWxlciBmcm9tICcuL3NoYWRlcl9jb21waWxlcic7XG5pbXBvcnQge0lucHV0SW5mbywgU2hhcGVJbmZvLCBVbmlmb3JtVHlwZX0gZnJvbSAnLi9zaGFkZXJfY29tcGlsZXInO1xuaW1wb3J0IHtQYWNraW5nU2NoZW1lLCBUZXh0dXJlRGF0YSwgVGV4dHVyZVVzYWdlfSBmcm9tICcuL3RleF91dGlsJztcbmltcG9ydCB7Y3JlYXRlRnJhZ21lbnRTaGFkZXJ9IGZyb20gJy4vd2ViZ2xfdXRpbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lczogc3RyaW5nW107XG4gIG91dHB1dFNoYXBlOiBudW1iZXJbXTtcbiAgdXNlckNvZGU6IHN0cmluZztcbiAgZW5hYmxlU2hhcGVVbmlmb3Jtcz86IGJvb2xlYW47XG4gIC8qKiBJZiB0cnVlLCB0aGlzIHByb2dyYW0gZXhwZWN0cyBwYWNrZWQgaW5wdXQgdGV4dHVyZXMuIERlZmF1bHRzIHRvIGZhbHNlLiAqL1xuICBwYWNrZWRJbnB1dHM/OiBib29sZWFuO1xuICAvKiogSWYgdHJ1ZSwgdGhpcyBwcm9ncmFtIHByb2R1Y2VzIGEgcGFja2VkIHRleHR1cmUuIERlZmF1bHRzIHRvIGZhbHNlLiAqL1xuICBwYWNrZWRPdXRwdXQ/OiBib29sZWFuO1xuICAvKipcbiAgICogQWZmZWN0cyB3aGF0IHR5cGUgb2YgdGV4dHVyZSB3ZSBhbGxvY2F0ZSBmb3IgdGhlIG91dHB1dC4gRGVmYXVsdHMgdG9cbiAgICogYFRleHR1cmVVc2FnZS5SRU5ERVJgLlxuICAgKi9cbiAgb3V0VGV4VXNhZ2U/OiBUZXh0dXJlVXNhZ2U7XG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiBzY2hlbWUgdG8gdXNlIHdoZW4gcGFja2luZyB0ZXhlbHMgZm9yIHRoZSBvdXRwdXQgdmFsdWVzLlxuICAgKiBTZWUgYFBhY2tpbmdTY2hlbWVgIGZvciBkZXRhaWxzLiBEZWZhdWx0cyB0byBgUGFja2luZ1NjaGVtZS5TSEFSRURfQkFUQ0hgLlxuICAgKi9cbiAgb3V0UGFja2luZ1NjaGVtZT86IFBhY2tpbmdTY2hlbWU7XG4gIGN1c3RvbVVuaWZvcm1zPzpcbiAgICAgIEFycmF5PHtuYW1lOiBzdHJpbmc7IGFycmF5SW5kZXg/OiBudW1iZXI7IHR5cGU6IFVuaWZvcm1UeXBlO30+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdQR1BVQmluYXJ5IHtcbiAgd2ViR0xQcm9ncmFtOiBXZWJHTFByb2dyYW07XG4gIHByb2dyYW06IEdQR1BVUHJvZ3JhbTtcbiAgdW5pZm9ybUxvY2F0aW9uczoge1tuYW1lOiBzdHJpbmddOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbn07XG4gIGN1c3RvbVVuaWZvcm1Mb2NhdGlvbnM/OiBXZWJHTFVuaWZvcm1Mb2NhdGlvbltdO1xuICBzb3VyY2U6IHN0cmluZztcbiAgZnJhZ21lbnRTaGFkZXI6IFdlYkdMU2hhZGVyO1xuICBpblNoYXBlSW5mb3M6IFNoYXBlSW5mb1tdO1xuICBvdXRTaGFwZUluZm86IFNoYXBlSW5mbztcbiAgaW5mTG9jOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbjtcbiAgbmFuTG9jOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbjtcbiAgaW5TaGFwZXNMb2NhdGlvbnM/OiB7W25hbWU6IHN0cmluZ106IFdlYkdMVW5pZm9ybUxvY2F0aW9ufTtcbiAgaW5UZXhTaGFwZXNMb2NhdGlvbnM/OiB7W25hbWU6IHN0cmluZ106IFdlYkdMVW5pZm9ybUxvY2F0aW9ufTtcbiAgb3V0U2hhcGVMb2NhdGlvbj86IFdlYkdMVW5pZm9ybUxvY2F0aW9uO1xuICBvdXRTaGFwZVN0cmlkZXNMb2NhdGlvbj86IFdlYkdMVW5pZm9ybUxvY2F0aW9uO1xuICBvdXRUZXhTaGFwZUxvY2F0aW9uPzogV2ViR0xVbmlmb3JtTG9jYXRpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR1BHUFVCaW5hcnlMb2NhdGlvbnMge1xuICB1bmlmb3JtTG9jYXRpb25zOiB7W25hbWU6IHN0cmluZ106IFdlYkdMVW5pZm9ybUxvY2F0aW9ufTtcbiAgY3VzdG9tVW5pZm9ybUxvY2F0aW9ucz86IFdlYkdMVW5pZm9ybUxvY2F0aW9uW107XG4gIGluZkxvYzogV2ViR0xVbmlmb3JtTG9jYXRpb247XG4gIG5hbkxvYzogV2ViR0xVbmlmb3JtTG9jYXRpb247XG4gIGluU2hhcGVzTG9jYXRpb25zPzoge1tuYW1lOiBzdHJpbmddOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbn07XG4gIGluVGV4U2hhcGVzTG9jYXRpb25zPzoge1tuYW1lOiBzdHJpbmddOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbn07XG4gIG91dFNoYXBlTG9jYXRpb24/OiBXZWJHTFVuaWZvcm1Mb2NhdGlvbjtcbiAgb3V0U2hhcGVTdHJpZGVzTG9jYXRpb24/OiBXZWJHTFVuaWZvcm1Mb2NhdGlvbjtcbiAgb3V0VGV4U2hhcGVMb2NhdGlvbj86IFdlYkdMVW5pZm9ybUxvY2F0aW9uO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRlbnNvckRhdGEge1xuICBzaGFwZTogbnVtYmVyW107XG4gIHRleERhdGE6IFRleHR1cmVEYXRhO1xuICBpc1VuaWZvcm06IGJvb2xlYW47XG4gIC8vIEF2YWlsYWJsZSB3aGVuIHdlIGRlY2lkZSB0byB1cGxvYWQgYXMgdW5pZm9ybSBpbnN0ZWFkIG9mIHRleHR1cmUuXG4gIHVuaWZvcm1WYWx1ZXM/OiBUeXBlZEFycmF5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVByb2dyYW08VCBleHRlbmRzIFRlbnNvciwgSyBleHRlbmRzIFRlbnNvcj4oXG4gICAgZ3BncHU6IEdQR1BVQ29udGV4dCwgcHJvZ3JhbTogR1BHUFVQcm9ncmFtLCBpbnB1dHM6IFRlbnNvckRhdGFbXSxcbiAgICBvdXRwdXQ6IFRlbnNvckRhdGEpOiBHUEdQVUJpbmFyeSB7XG4gIGNvbnN0IGlucHV0SW5mb3M6IElucHV0SW5mb1tdID0gaW5wdXRzLm1hcCgoaW5wdXQsIGkpID0+IHtcbiAgICBjb25zdCBzaGFwZUluZm86IFNoYXBlSW5mbyA9IHtcbiAgICAgIGxvZ2ljYWxTaGFwZTogaW5wdXQuc2hhcGUsXG4gICAgICB0ZXhTaGFwZTogaW5wdXQuaXNVbmlmb3JtID8gbnVsbCA6IGlucHV0LnRleERhdGEudGV4U2hhcGUsXG4gICAgICBpc1VuaWZvcm06IGlucHV0LmlzVW5pZm9ybSxcbiAgICAgIGlzUGFja2VkOiBpbnB1dC5pc1VuaWZvcm0gPyBmYWxzZSA6IGlucHV0LnRleERhdGEuaXNQYWNrZWQsXG4gICAgICBmbGF0T2Zmc2V0OiBudWxsXG4gICAgfTtcbiAgICBpZiAoaW5wdXQudGV4RGF0YSAhPSBudWxsICYmIGlucHV0LnRleERhdGEuc2xpY2UgIT0gbnVsbCAmJlxuICAgICAgICBpbnB1dC50ZXhEYXRhLnNsaWNlLmZsYXRPZmZzZXQgPiAwKSB7XG4gICAgICBzaGFwZUluZm8uZmxhdE9mZnNldCA9IGlucHV0LnRleERhdGEuc2xpY2UuZmxhdE9mZnNldDtcbiAgICB9XG4gICAgcmV0dXJuIHtuYW1lOiBwcm9ncmFtLnZhcmlhYmxlTmFtZXNbaV0sIHNoYXBlSW5mb307XG4gIH0pO1xuICBjb25zdCBpblNoYXBlSW5mb3MgPSBpbnB1dEluZm9zLm1hcCh4ID0+IHguc2hhcGVJbmZvKTtcbiAgY29uc3Qgb3V0U2hhcGVJbmZvOiBTaGFwZUluZm8gPSB7XG4gICAgbG9naWNhbFNoYXBlOiBvdXRwdXQuc2hhcGUsXG4gICAgdGV4U2hhcGU6IG91dHB1dC50ZXhEYXRhLnRleFNoYXBlLFxuICAgIGlzVW5pZm9ybTogZmFsc2UsXG4gICAgaXNQYWNrZWQ6IG91dHB1dC50ZXhEYXRhLmlzUGFja2VkLFxuICAgIGZsYXRPZmZzZXQ6IG51bGxcbiAgfTtcbiAgY29uc3Qgc291cmNlID0gc2hhZGVyX2NvbXBpbGVyLm1ha2VTaGFkZXIoaW5wdXRJbmZvcywgb3V0U2hhcGVJbmZvLCBwcm9ncmFtKTtcbiAgY29uc3QgZnJhZ21lbnRTaGFkZXIgPSBjcmVhdGVGcmFnbWVudFNoYWRlcihncGdwdS5nbCwgc291cmNlKTtcbiAgY29uc3Qgd2ViR0xQcm9ncmFtID0gZ3BncHUuY3JlYXRlUHJvZ3JhbShmcmFnbWVudFNoYWRlcik7XG5cbiAgaWYgKCFlbnYoKS5nZXQoJ0VOR0lORV9DT01QSUxFX09OTFknKSkge1xuICAgIHJldHVybiB7XG4gICAgICBwcm9ncmFtLFxuICAgICAgZnJhZ21lbnRTaGFkZXIsXG4gICAgICBzb3VyY2UsXG4gICAgICB3ZWJHTFByb2dyYW0sXG4gICAgICBpblNoYXBlSW5mb3MsXG4gICAgICBvdXRTaGFwZUluZm8sXG4gICAgICAuLi5nZXRVbmlmb3JtTG9jYXRpb25zKGdwZ3B1LCBwcm9ncmFtLCB3ZWJHTFByb2dyYW0pXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvZ3JhbSxcbiAgICAgIGZyYWdtZW50U2hhZGVyLFxuICAgICAgc291cmNlLFxuICAgICAgd2ViR0xQcm9ncmFtLFxuICAgICAgaW5TaGFwZUluZm9zLFxuICAgICAgb3V0U2hhcGVJbmZvLFxuICAgICAgdW5pZm9ybUxvY2F0aW9uczogbnVsbCxcbiAgICAgIGN1c3RvbVVuaWZvcm1Mb2NhdGlvbnM6IG51bGwsXG4gICAgICBpbmZMb2M6IG51bGwsXG4gICAgICBuYW5Mb2M6IG51bGwsXG4gICAgICBpblNoYXBlc0xvY2F0aW9uczogbnVsbCxcbiAgICAgIGluVGV4U2hhcGVzTG9jYXRpb25zOiBudWxsLFxuICAgICAgb3V0U2hhcGVMb2NhdGlvbjogbnVsbCxcbiAgICAgIG91dFNoYXBlU3RyaWRlc0xvY2F0aW9uOiBudWxsLFxuICAgICAgb3V0VGV4U2hhcGVMb2NhdGlvbjogbnVsbFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVuaWZvcm1Mb2NhdGlvbnMoXG4gICAgZ3BncHU6IEdQR1BVQ29udGV4dCwgcHJvZ3JhbTogR1BHUFVQcm9ncmFtLFxuICAgIHdlYkdMUHJvZ3JhbTogV2ViR0xQcm9ncmFtKTogR1BHUFVCaW5hcnlMb2NhdGlvbnMge1xuICBjb25zdCB1bmlmb3JtTG9jYXRpb25zOiB7W25hbWU6IHN0cmluZ106IFdlYkdMVW5pZm9ybUxvY2F0aW9ufSA9IHt9O1xuICBjb25zdCBpblNoYXBlc0xvY2F0aW9uczoge1tuYW1lOiBzdHJpbmddOiBXZWJHTFVuaWZvcm1Mb2NhdGlvbn0gPSB7fTtcbiAgY29uc3QgaW5UZXhTaGFwZXNMb2NhdGlvbnM6IHtbbmFtZTogc3RyaW5nXTogV2ViR0xVbmlmb3JtTG9jYXRpb259ID0ge307XG4gIGNvbnN0IGN1c3RvbVVuaWZvcm1Mb2NhdGlvbnM6IFdlYkdMVW5pZm9ybUxvY2F0aW9uW10gPSBbXTtcbiAgbGV0IG91dFNoYXBlTG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uO1xuICBsZXQgb3V0VGV4U2hhcGVMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb247XG4gIGxldCBvdXRTaGFwZVN0cmlkZXNMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb247XG4gIGxldCBpbmZMb2M6IFdlYkdMVW5pZm9ybUxvY2F0aW9uID0gbnVsbDtcbiAgbGV0IG5hbkxvYzogV2ViR0xVbmlmb3JtTG9jYXRpb24gPSBudWxsO1xuXG4gIC8vIEFkZCBzcGVjaWFsIHVuaWZvcm1zIChOQU4sIElORklOSVRZKVxuICBuYW5Mb2MgPSBncGdwdS5nZXRVbmlmb3JtTG9jYXRpb24od2ViR0xQcm9ncmFtLCAnTkFOJywgZmFsc2UpO1xuICBpZiAoZW52KCkuZ2V0TnVtYmVyKCdXRUJHTF9WRVJTSU9OJykgPT09IDEpIHtcbiAgICBpbmZMb2MgPSBncGdwdS5nZXRVbmlmb3JtTG9jYXRpb24od2ViR0xQcm9ncmFtLCAnSU5GSU5JVFknLCBmYWxzZSk7XG4gIH1cblxuICAvLyBBZGQgdXNlci1kZWZpbmVkIHVuaWZvcm1zXG4gIGNvbnN0IHNob3VsZFRocm93ID0gZmFsc2U7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvZ3JhbS52YXJpYWJsZU5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgdmFyTmFtZSA9IHByb2dyYW0udmFyaWFibGVOYW1lc1tpXTtcbiAgICB1bmlmb3JtTG9jYXRpb25zW3Zhck5hbWVdID1cbiAgICAgICAgZ3BncHUuZ2V0VW5pZm9ybUxvY2F0aW9uKHdlYkdMUHJvZ3JhbSwgdmFyTmFtZSwgc2hvdWxkVGhyb3cpO1xuICAgIHVuaWZvcm1Mb2NhdGlvbnNbYG9mZnNldCR7dmFyTmFtZX1gXSA9XG4gICAgICAgIGdwZ3B1LmdldFVuaWZvcm1Mb2NhdGlvbih3ZWJHTFByb2dyYW0sIGBvZmZzZXQke3Zhck5hbWV9YCwgc2hvdWxkVGhyb3cpO1xuICAgIGlmIChwcm9ncmFtLmVuYWJsZVNoYXBlVW5pZm9ybXMpIHtcbiAgICAgIGluU2hhcGVzTG9jYXRpb25zW2Ake3Zhck5hbWV9U2hhcGVgXSA9IGdwZ3B1LmdldFVuaWZvcm1Mb2NhdGlvbihcbiAgICAgICAgICB3ZWJHTFByb2dyYW0sIGAke3Zhck5hbWV9U2hhcGVgLCBzaG91bGRUaHJvdyk7XG4gICAgICBpblRleFNoYXBlc0xvY2F0aW9uc1tgJHt2YXJOYW1lfVRleFNoYXBlYF0gPSBncGdwdS5nZXRVbmlmb3JtTG9jYXRpb24oXG4gICAgICAgICAgd2ViR0xQcm9ncmFtLCBgJHt2YXJOYW1lfVRleFNoYXBlYCwgc2hvdWxkVGhyb3cpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChwcm9ncmFtLmVuYWJsZVNoYXBlVW5pZm9ybXMpIHtcbiAgICBvdXRTaGFwZUxvY2F0aW9uID1cbiAgICAgICAgZ3BncHUuZ2V0VW5pZm9ybUxvY2F0aW9uKHdlYkdMUHJvZ3JhbSwgJ291dFNoYXBlJywgc2hvdWxkVGhyb3cpO1xuICAgIG91dFNoYXBlU3RyaWRlc0xvY2F0aW9uID1cbiAgICAgICAgZ3BncHUuZ2V0VW5pZm9ybUxvY2F0aW9uKHdlYkdMUHJvZ3JhbSwgJ291dFNoYXBlU3RyaWRlcycsIHNob3VsZFRocm93KTtcbiAgICBvdXRUZXhTaGFwZUxvY2F0aW9uID1cbiAgICAgICAgZ3BncHUuZ2V0VW5pZm9ybUxvY2F0aW9uKHdlYkdMUHJvZ3JhbSwgJ291dFRleFNoYXBlJywgc2hvdWxkVGhyb3cpO1xuICB9XG5cbiAgaWYgKHByb2dyYW0uY3VzdG9tVW5pZm9ybXMpIHtcbiAgICBwcm9ncmFtLmN1c3RvbVVuaWZvcm1zLmZvckVhY2goKGQsIGkpID0+IHtcbiAgICAgIGN1c3RvbVVuaWZvcm1Mb2NhdGlvbnNbaV0gPVxuICAgICAgICAgIGdwZ3B1LmdldFVuaWZvcm1Mb2NhdGlvbih3ZWJHTFByb2dyYW0sIGQubmFtZSwgc2hvdWxkVGhyb3cpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB1bmlmb3JtTG9jYXRpb25zLFxuICAgIGN1c3RvbVVuaWZvcm1Mb2NhdGlvbnMsXG4gICAgaW5mTG9jLFxuICAgIG5hbkxvYyxcbiAgICBpblNoYXBlc0xvY2F0aW9ucyxcbiAgICBpblRleFNoYXBlc0xvY2F0aW9ucyxcbiAgICBvdXRTaGFwZUxvY2F0aW9uLFxuICAgIG91dFNoYXBlU3RyaWRlc0xvY2F0aW9uLFxuICAgIG91dFRleFNoYXBlTG9jYXRpb25cbiAgfTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVCaW5hcnlBbmRQcm9ncmFtKFxuICAgIHNoYXBlSW5mb3M6IFNoYXBlSW5mb1tdLCBpbnB1dHM6IFRlbnNvckRhdGFbXSkge1xuICBpZiAoc2hhcGVJbmZvcy5sZW5ndGggIT09IGlucHV0cy5sZW5ndGgpIHtcbiAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgYEJpbmFyeSB3YXMgY29tcGlsZWQgd2l0aCAke3NoYXBlSW5mb3MubGVuZ3RofSBpbnB1dHMsIGJ1dCBgICtcbiAgICAgICAgYHdhcyBleGVjdXRlZCB3aXRoICR7aW5wdXRzLmxlbmd0aH0gaW5wdXRzYCk7XG4gIH1cblxuICBzaGFwZUluZm9zLmZvckVhY2goKHMsIGkpID0+IHtcbiAgICBjb25zdCBzaGFwZUEgPSBzLmxvZ2ljYWxTaGFwZTtcbiAgICBjb25zdCBpbnB1dCA9IGlucHV0c1tpXTtcbiAgICBjb25zdCBzaGFwZUIgPSBpbnB1dC5zaGFwZTtcblxuICAgIGlmICghdXRpbC5hcnJheXNFcXVhbChzaGFwZUEsIHNoYXBlQikpIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgIGBCaW5hcnkgd2FzIGNvbXBpbGVkIHdpdGggZGlmZmVyZW50IHNoYXBlcyB0aGFuIGAgK1xuICAgICAgICAgIGB0aGUgY3VycmVudCBhcmdzLiBTaGFwZXMgJHtzaGFwZUF9IGFuZCAke3NoYXBlQn0gbXVzdCBtYXRjaGApO1xuICAgIH1cbiAgICAvLyBUaGUgaW5wdXQgaXMgdXBsb2FkZWQgYXMgdW5pZm9ybS5cbiAgICBpZiAocy5pc1VuaWZvcm0gJiYgaW5wdXQuaXNVbmlmb3JtKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGV4U2hhcGVBID0gcy50ZXhTaGFwZTtcbiAgICBjb25zdCB0ZXhTaGFwZUIgPSBpbnB1dC5pc1VuaWZvcm0gPyBudWxsIDogaW5wdXQudGV4RGF0YS50ZXhTaGFwZTtcbiAgICBpZiAoIXV0aWwuYXJyYXlzRXF1YWwodGV4U2hhcGVBLCB0ZXhTaGFwZUIpKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICBgQmluYXJ5IHdhcyBjb21waWxlZCB3aXRoIGRpZmZlcmVudCB0ZXh0dXJlIHNoYXBlcyB0aGFuIHRoZWAgK1xuICAgICAgICAgIGAgY3VycmVudCBhcmdzLiBTaGFwZSAke3RleFNoYXBlQX0gYW5kICR7dGV4U2hhcGVCfSBtdXN0IG1hdGNoYCk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJ1blByb2dyYW08VCBleHRlbmRzIFRlbnNvciwgSyBleHRlbmRzIFRlbnNvcj4oXG4gICAgZ3BncHU6IEdQR1BVQ29udGV4dCwgYmluYXJ5OiBHUEdQVUJpbmFyeSwgaW5wdXRzOiBUZW5zb3JEYXRhW10sXG4gICAgb3V0cHV0OiBUZW5zb3JEYXRhLCBjdXN0b21Vbmlmb3JtVmFsdWVzPzogbnVtYmVyW11bXSk6IHZvaWQge1xuICBpZiAoIWJpbmFyeS5wcm9ncmFtLmVuYWJsZVNoYXBlVW5pZm9ybXMpIHtcbiAgICB2YWxpZGF0ZUJpbmFyeUFuZFByb2dyYW0oYmluYXJ5LmluU2hhcGVJbmZvcywgaW5wdXRzKTtcbiAgICB2YWxpZGF0ZUJpbmFyeUFuZFByb2dyYW0oW2JpbmFyeS5vdXRTaGFwZUluZm9dLCBbb3V0cHV0XSk7XG4gIH1cblxuICBjb25zdCBvdXRUZXggPSBvdXRwdXQudGV4RGF0YS50ZXh0dXJlO1xuICBjb25zdCBvdXRUZXhTaGFwZSA9IG91dHB1dC50ZXhEYXRhLnRleFNoYXBlO1xuICBpZiAob3V0cHV0LnRleERhdGEuaXNQYWNrZWQpIHtcbiAgICBncGdwdS5zZXRPdXRwdXRQYWNrZWRNYXRyaXhUZXh0dXJlKFxuICAgICAgICBvdXRUZXgudGV4dHVyZSwgb3V0VGV4U2hhcGVbMF0sIG91dFRleFNoYXBlWzFdKTtcbiAgfSBlbHNlIHtcbiAgICBncGdwdS5zZXRPdXRwdXRNYXRyaXhUZXh0dXJlKFxuICAgICAgICBvdXRUZXgudGV4dHVyZSwgb3V0VGV4U2hhcGVbMF0sIG91dFRleFNoYXBlWzFdKTtcbiAgfVxuICBncGdwdS5zZXRQcm9ncmFtKGJpbmFyeS53ZWJHTFByb2dyYW0pO1xuXG4gIC8vIFNldCBzcGVjaWFsIHVuaWZvcm1zIChOQU4sIElORklOSVRZKVxuICBpZiAoZW52KCkuZ2V0TnVtYmVyKCdXRUJHTF9WRVJTSU9OJykgPT09IDEpIHtcbiAgICBpZiAoYmluYXJ5LmluZkxvYyAhPT0gbnVsbCkge1xuICAgICAgZ3BncHUuZ2wudW5pZm9ybTFmKGJpbmFyeS5pbmZMb2MsIEluZmluaXR5KTtcbiAgICB9XG4gIH1cbiAgaWYgKGJpbmFyeS5uYW5Mb2MgIT09IG51bGwpIHtcbiAgICBncGdwdS5nbC51bmlmb3JtMWYoYmluYXJ5Lm5hbkxvYywgTmFOKTtcbiAgfVxuXG4gIC8vIFNldCB1c2VyLWRlZmluZWQgaW5wdXRzXG4gIGlucHV0cy5mb3JFYWNoKChpbnB1dCwgaSkgPT4ge1xuICAgIGNvbnN0IHZhck5hbWUgPSBiaW5hcnkucHJvZ3JhbS52YXJpYWJsZU5hbWVzW2ldO1xuICAgIGNvbnN0IHZhckxvYyA9IGJpbmFyeS51bmlmb3JtTG9jYXRpb25zW3Zhck5hbWVdO1xuICAgIGNvbnN0IHZhck9mZnNldExvYyA9IGJpbmFyeS51bmlmb3JtTG9jYXRpb25zW2BvZmZzZXQke3Zhck5hbWV9YF07XG4gICAgY29uc3QgdmFyU2hhcGVMb2MgPSBiaW5hcnkuaW5TaGFwZXNMb2NhdGlvbnNbYCR7dmFyTmFtZX1TaGFwZWBdO1xuICAgIGNvbnN0IHZhclRleFNoYXBlTG9jID0gYmluYXJ5LmluVGV4U2hhcGVzTG9jYXRpb25zW2Ake3Zhck5hbWV9VGV4U2hhcGVgXTtcblxuICAgIGlmICh2YXJTaGFwZUxvYykge1xuICAgICAgY29uc3Qge3VuaWZvcm1TaGFwZX0gPSBzaGFkZXJfY29tcGlsZXIuZ2V0VW5pZm9ybUluZm9Gcm9tU2hhcGUoXG4gICAgICAgICAgYmluYXJ5LnByb2dyYW0ucGFja2VkSW5wdXRzLCBpbnB1dC5zaGFwZSwgaW5wdXQudGV4RGF0YS50ZXhTaGFwZSk7XG4gICAgICBzd2l0Y2ggKHVuaWZvcm1TaGFwZS5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGdwZ3B1LmdsLnVuaWZvcm0xaXYodmFyU2hhcGVMb2MsIG5ldyBJbnQzMkFycmF5KHVuaWZvcm1TaGFwZSkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgZ3BncHUuZ2wudW5pZm9ybTJpdih2YXJTaGFwZUxvYywgbmV3IEludDMyQXJyYXkodW5pZm9ybVNoYXBlKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBncGdwdS5nbC51bmlmb3JtM2l2KHZhclNoYXBlTG9jLCBuZXcgSW50MzJBcnJheSh1bmlmb3JtU2hhcGUpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIGdwZ3B1LmdsLnVuaWZvcm00aXYodmFyU2hhcGVMb2MsIG5ldyBJbnQzMkFycmF5KHVuaWZvcm1TaGFwZSkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodmFyVGV4U2hhcGVMb2MpIHtcbiAgICAgIGdwZ3B1LmdsLnVuaWZvcm0yaShcbiAgICAgICAgICB2YXJUZXhTaGFwZUxvYywgaW5wdXQudGV4RGF0YS50ZXhTaGFwZVswXSwgaW5wdXQudGV4RGF0YS50ZXhTaGFwZVsxXSk7XG4gICAgfVxuXG4gICAgaWYgKHZhckxvYyA9PSBudWxsKSB7XG4gICAgICAvLyBUaGUgY29tcGlsZXIgaW5mZXJyZWQgdGhhdCB0aGlzIHZhcmlhYmxlIGlzIG5vdCB1c2VkIGluIHRoaXMgc2hhZGVyLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpbnB1dC5pc1VuaWZvcm0pIHtcbiAgICAgIC8vIFVwbG9hZCB0aGUgdmFsdWVzIG9mIHRoZSB0ZW5zb3IgYXMgdW5pZm9ybS5cbiAgICAgIGlmICh1dGlsLnNpemVGcm9tU2hhcGUoaW5wdXQuc2hhcGUpIDwgMikge1xuICAgICAgICBncGdwdS5nbC51bmlmb3JtMWYodmFyTG9jLCBpbnB1dC51bmlmb3JtVmFsdWVzWzBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB2YWxzID0gaW5wdXQudW5pZm9ybVZhbHVlcztcbiAgICAgICAgaWYgKCEodmFscyBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSkpIHtcbiAgICAgICAgICB2YWxzID0gbmV3IEZsb2F0MzJBcnJheSh2YWxzKTtcbiAgICAgICAgfVxuICAgICAgICBncGdwdS5nbC51bmlmb3JtMWZ2KHZhckxvYywgdmFscyk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIGlucHV0IHdhcyBzbGljZWQsIHVwbG9hZCB0aGUgZmxhdCBvZmZzZXQgaW5kZXguXG4gICAgaWYgKGlucHV0LnRleERhdGEuc2xpY2UgIT0gbnVsbCAmJiB2YXJPZmZzZXRMb2MgIT0gbnVsbCkge1xuICAgICAgZ3BncHUuZ2wudW5pZm9ybTFpKHZhck9mZnNldExvYywgaW5wdXQudGV4RGF0YS5zbGljZS5mbGF0T2Zmc2V0KTtcbiAgICB9XG5cbiAgICBncGdwdS5zZXRJbnB1dE1hdHJpeFRleHR1cmUoaW5wdXQudGV4RGF0YS50ZXh0dXJlLnRleHR1cmUsIHZhckxvYywgaSk7XG4gIH0pO1xuXG4gIGNvbnN0IG91dFNoYXBlTG9jID0gYmluYXJ5Lm91dFNoYXBlTG9jYXRpb247XG4gIGlmIChvdXRTaGFwZUxvYykge1xuICAgIHN3aXRjaCAob3V0cHV0LnNoYXBlLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICBncGdwdS5nbC51bmlmb3JtMWl2KG91dFNoYXBlTG9jLCBuZXcgSW50MzJBcnJheShvdXRwdXQuc2hhcGUpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGdwZ3B1LmdsLnVuaWZvcm0yaXYob3V0U2hhcGVMb2MsIG5ldyBJbnQzMkFycmF5KG91dHB1dC5zaGFwZSkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgZ3BncHUuZ2wudW5pZm9ybTNpdihvdXRTaGFwZUxvYywgbmV3IEludDMyQXJyYXkob3V0cHV0LnNoYXBlKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0OlxuICAgICAgICBncGdwdS5nbC51bmlmb3JtNGl2KG91dFNoYXBlTG9jLCBuZXcgSW50MzJBcnJheShvdXRwdXQuc2hhcGUpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgaWYgKGJpbmFyeS5vdXRTaGFwZVN0cmlkZXNMb2NhdGlvbikge1xuICAgIGNvbnN0IHN0cmlkZXMgPSB1dGlsLmNvbXB1dGVTdHJpZGVzKG91dHB1dC5zaGFwZSk7XG4gICAgc3dpdGNoIChvdXRwdXQuc2hhcGUubGVuZ3RoKSB7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGdwZ3B1LmdsLnVuaWZvcm0xaXYoXG4gICAgICAgICAgICBiaW5hcnkub3V0U2hhcGVTdHJpZGVzTG9jYXRpb24sIG5ldyBJbnQzMkFycmF5KHN0cmlkZXMpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGdwZ3B1LmdsLnVuaWZvcm0yaXYoXG4gICAgICAgICAgICBiaW5hcnkub3V0U2hhcGVTdHJpZGVzTG9jYXRpb24sIG5ldyBJbnQzMkFycmF5KHN0cmlkZXMpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQ6XG4gICAgICAgIGdwZ3B1LmdsLnVuaWZvcm0zaXYoXG4gICAgICAgICAgICBiaW5hcnkub3V0U2hhcGVTdHJpZGVzTG9jYXRpb24sIG5ldyBJbnQzMkFycmF5KHN0cmlkZXMpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgaWYgKGJpbmFyeS5vdXRUZXhTaGFwZUxvY2F0aW9uKSB7XG4gICAgZ3BncHUuZ2wudW5pZm9ybTJpKFxuICAgICAgICBiaW5hcnkub3V0VGV4U2hhcGVMb2NhdGlvbiwgb3V0cHV0LnRleERhdGEudGV4U2hhcGVbMF0sXG4gICAgICAgIG91dHB1dC50ZXhEYXRhLnRleFNoYXBlWzFdKTtcbiAgfVxuXG4gIGlmIChiaW5hcnkucHJvZ3JhbS5jdXN0b21Vbmlmb3JtcyAmJiBjdXN0b21Vbmlmb3JtVmFsdWVzKSB7XG4gICAgYmluYXJ5LnByb2dyYW0uY3VzdG9tVW5pZm9ybXMuZm9yRWFjaCgoZCwgaSkgPT4ge1xuICAgICAgY29uc3QgY3VzdG9tTG9jID0gYmluYXJ5LmN1c3RvbVVuaWZvcm1Mb2NhdGlvbnNbaV07XG4gICAgICBjb25zdCBjdXN0b21WYWx1ZSA9IGN1c3RvbVVuaWZvcm1WYWx1ZXNbaV07XG4gICAgICBpZiAoZC50eXBlID09PSAnZmxvYXQnKSB7XG4gICAgICAgIGdwZ3B1LmdsLnVuaWZvcm0xZnYoY3VzdG9tTG9jLCBjdXN0b21WYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGQudHlwZSA9PT0gJ3ZlYzInKSB7XG4gICAgICAgIGdwZ3B1LmdsLnVuaWZvcm0yZnYoY3VzdG9tTG9jLCBjdXN0b21WYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGQudHlwZSA9PT0gJ3ZlYzMnKSB7XG4gICAgICAgIGdwZ3B1LmdsLnVuaWZvcm0zZnYoY3VzdG9tTG9jLCBjdXN0b21WYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGQudHlwZSA9PT0gJ3ZlYzQnKSB7XG4gICAgICAgIGdwZ3B1LmdsLnVuaWZvcm00ZnYoY3VzdG9tTG9jLCBjdXN0b21WYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGQudHlwZSA9PT0gJ2ludCcpIHtcbiAgICAgICAgZ3BncHUuZ2wudW5pZm9ybTFpdihjdXN0b21Mb2MsIGN1c3RvbVZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoZC50eXBlID09PSAnaXZlYzInKSB7XG4gICAgICAgIGdwZ3B1LmdsLnVuaWZvcm0yaXYoY3VzdG9tTG9jLCBjdXN0b21WYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGQudHlwZSA9PT0gJ2l2ZWMzJykge1xuICAgICAgICBncGdwdS5nbC51bmlmb3JtM2l2KGN1c3RvbUxvYywgY3VzdG9tVmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChkLnR5cGUgPT09ICdpdmVjNCcpIHtcbiAgICAgICAgZ3BncHUuZ2wudW5pZm9ybTRpdihjdXN0b21Mb2MsIGN1c3RvbVZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IEVycm9yKGB1bmlmb3JtIHR5cGUgJHtkLnR5cGV9IGlzIG5vdCBzdXBwb3J0ZWQgeWV0LmApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGdwZ3B1LmV4ZWN1dGVQcm9ncmFtKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlU2hhZGVyS2V5KFxuICAgIHByb2dyYW06IEdQR1BVUHJvZ3JhbSwgaW5wdXRzOiBUZW5zb3JEYXRhW10sIG91dHB1dDogVGVuc29yRGF0YSk6IHN0cmluZyB7XG4gIGxldCBrZXlJbnB1dHMgPSAnJztcbiAgaW5wdXRzLmNvbmNhdChvdXRwdXQpLmZvckVhY2goeCA9PiB7XG4gICAgY29uc3QgaGFzT2Zmc2V0ID0geC50ZXhEYXRhICE9IG51bGwgJiYgeC50ZXhEYXRhLnNsaWNlICE9IG51bGwgJiZcbiAgICAgICAgeC50ZXhEYXRhLnNsaWNlLmZsYXRPZmZzZXQgPiAwO1xuICAgIC8vIFRPRE86IFJlbW92ZSB0aGUgY29uZGl0aW9uIG9mICF4LmlzVW5pZm9ybS5cbiAgICBpZiAocHJvZ3JhbS5lbmFibGVTaGFwZVVuaWZvcm1zICYmICF4LmlzVW5pZm9ybSkge1xuICAgICAgY29uc3QgeFRleFNoYXBlID0geC50ZXhEYXRhLnRleFNoYXBlO1xuICAgICAgY29uc3Qge3VzZVNxdWVlemVTaGFwZSwgdW5pZm9ybVNoYXBlLCBrZXB0RGltc30gPVxuICAgICAgICAgIHNoYWRlcl9jb21waWxlci5nZXRVbmlmb3JtSW5mb0Zyb21TaGFwZShcbiAgICAgICAgICAgICAgcHJvZ3JhbS5wYWNrZWRJbnB1dHMsIHguc2hhcGUsIHhUZXhTaGFwZSk7XG4gICAgICBsZXQgcmFuazEgPSAnJywgcmFuazIgPSAnJywgcmFuazM0ID0gJyc7XG4gICAgICBpZiAodW5pZm9ybVNoYXBlLmxlbmd0aCA9PT0gMSAmJiBwcm9ncmFtLnBhY2tlZElucHV0cykge1xuICAgICAgICBjb25zdCBwYWNrZWRUZXhTaGFwZSA9XG4gICAgICAgICAgICBbTWF0aC5jZWlsKHhUZXhTaGFwZVswXSAvIDIpLCBNYXRoLmNlaWwoeFRleFNoYXBlWzFdIC8gMildO1xuICAgICAgICByYW5rMSA9IGAke3BhY2tlZFRleFNoYXBlWzBdID4gMX1fJHtwYWNrZWRUZXhTaGFwZVsxXSA+IDF9YDtcbiAgICAgIH0gZWxzZSBpZiAodW5pZm9ybVNoYXBlLmxlbmd0aCA9PT0gMiAmJiAhcHJvZ3JhbS5wYWNrZWRJbnB1dHMpIHtcbiAgICAgICAgcmFuazIgPSBgJHt1bmlmb3JtU2hhcGVbMF0gPiAxfV8ke3VuaWZvcm1TaGFwZVsxXSA+IDF9YDtcbiAgICAgIH0gZWxzZSBpZiAodW5pZm9ybVNoYXBlLmxlbmd0aCA+IDIgJiYgIXByb2dyYW0ucGFja2VkSW5wdXRzKSB7XG4gICAgICAgIGNvbnN0IHN0cmlkZXMgPSB1dGlsLmNvbXB1dGVTdHJpZGVzKHVuaWZvcm1TaGFwZSk7XG4gICAgICAgIHJhbmszNCA9IGAke3N0cmlkZXNbMF0gPT09IHhUZXhTaGFwZVsxXX1fJHtcbiAgICAgICAgICAgIHN0cmlkZXNbc3RyaWRlcy5sZW5ndGggLSAxXSA9PT0geFRleFNoYXBlWzFdfWA7XG4gICAgICB9XG4gICAgICBjb25zdCB4UmFuayA9IHguc2hhcGUubGVuZ3RoO1xuICAgICAgY29uc3QgaXNMb2dpY2FsU2hhcFRleFNoYXBlRXF1YWwgPVxuICAgICAgICAgIHVuaWZvcm1TaGFwZS5sZW5ndGggPT09IDIgJiYgdXRpbC5hcnJheXNFcXVhbCh4LnNoYXBlLCB4VGV4U2hhcGUpO1xuICAgICAgY29uc3QgaXNTY2FsYXIgPSB1dGlsLnNpemVGcm9tU2hhcGUoeC5zaGFwZSkgPT09IDE7XG4gICAgICBjb25zdCBicm9hZGNhc3REaW1zID1cbiAgICAgICAgICBiYWNrZW5kX3V0aWwuZ2V0QnJvYWRjYXN0RGltcyh4LnNoYXBlLCBvdXRwdXQuc2hhcGUpO1xuICAgICAgY29uc3QgaXNJbk91dFRleFNoYXBlRXF1YWwgPSAhcHJvZ3JhbS5wYWNrZWRJbnB1dHMgJiZcbiAgICAgICAgICB4UmFuayA9PT0gb3V0cHV0LnNoYXBlLmxlbmd0aCAmJlxuICAgICAgICAgIHV0aWwuYXJyYXlzRXF1YWwoeFRleFNoYXBlLCBvdXRwdXQudGV4RGF0YS50ZXhTaGFwZSk7XG4gICAgICBjb25zdCBpc1RleFNoYXBlR3JlYXRlclRoYW5PbmUgPVxuICAgICAgICAgIHByb2dyYW0ucGFja2VkSW5wdXRzIHx8IHVuaWZvcm1TaGFwZS5sZW5ndGggPiAyID9cbiAgICAgICAgICAnJyA6XG4gICAgICAgICAgYCR7eFRleFNoYXBlWzBdID4gMX1fJHt4VGV4U2hhcGVbMV0gPiAxfWA7XG4gICAgICAvLyBUaGVzZSBrZXkgY29tcG9uZW50cyBhcmUgbmVlZGVkIGR1ZSB0byBzaGFkZXJfY29tcGlsZXIgaXMgZW1iZWRkaW5nXG4gICAgICAvLyB0aGVtIGluIHRoZSBzaGFkZXIuXG4gICAgICAvLyB8eFJhbmt8IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSBjb29yZHMgbGVuZ3RoLiBTZWVcbiAgICAgIC8vIGdldFtQYWNrZWRdU2FtcGxlckF0T3V0cHV0Q29vcmRzLlxuICAgICAgLy8gfGlzSW5PdXRUZXhTaGFwZUVxdWFsfCBpcyB1c2VkIHRvIGRldGVybWluZSB3aGV0aGVyIGdvaW5nIHRvIGFuXG4gICAgICAvLyBvcHRpbWl6YXRpb24gcGF0aCBpbiBnZXRTYW1wbGVyQXRPdXRwdXRDb29yZHMuXG4gICAgICAvLyB8dXNlU3F1ZWV6ZVNoYXBlfCBpcyBleHRyYWN0ZWQgZnJvbSBzcXVlZXplSW5wdXRJbmZvIG9mXG4gICAgICAvLyBnZXRTYW1wbGVyWzJ8M3w0XUQvZ2V0UGFja2VkU2FtcGxlcjNELlxuICAgICAgLy8gfGlzU2NhbGFyfCBpcyBleHRyYWN0ZWQgZnJvbSBpc0lucHV0U2NhbGFyL2lzT3V0cHV0U2NhbGFyIGluXG4gICAgICAvLyBnZXRQYWNrZWRTYW1wbGVyQXRPdXRwdXRDb29yZHMuXG4gICAgICAvLyB8YnJvYWRjYXN0RGltc3wgaXMgZXh0cmFjdGVkIGZyb20gZ2V0W1BhY2tlZF1TYW1wbGVyQXRPdXRwdXRDb29yZHMuXG4gICAgICAvLyB8aXNMb2dpY2FsU2hhcFRleFNoYXBlRXF1YWx8IGlzIHVzZWQgaW5cbiAgICAgIC8vIGdldE91dHB1dFtQYWNrZWRdMkRDb29yZHMvZ2V0W1BhY2tlZF1TYW1wbGVyMkQuXG4gICAgICAvLyB8cmFuazF8IGlzIHVzZWQgaW4gZ2V0T3V0cHV0UGFja2VkMURDb29yZHMuXG4gICAgICAvLyB8cmFuazJ8IGlzIHVzZWQgaW4gZ2V0T3V0cHV0MkRDb29yZHMuXG4gICAgICAvLyB8cmFuazM0fCBpcyB1c2VkIGluIGdldFNhbXBsZXIzRC9nZXRTYW1wbGVyNEQuXG4gICAgICAvLyB8aXNUZXhTaGFwZUdyZWF0ZXJUaGFuT25lfCBhcmUgdXNlZCBpblxuICAgICAgLy8gZ2V0U2FtcGxlcltTY2FsYXJ8MUR8MkRdL2dldE91dHB1dDFEQ29vcmRzLlxuICAgICAga2V5SW5wdXRzICs9IGAke3hSYW5rfV8ke2lzSW5PdXRUZXhTaGFwZUVxdWFsfV8ke1xuICAgICAgICAgIHVzZVNxdWVlemVTaGFwZSA/IGtlcHREaW1zIDogJyd9XyR7dW5pZm9ybVNoYXBlLmxlbmd0aH1fJHtpc1NjYWxhcn1fJHtcbiAgICAgICAgICBicm9hZGNhc3REaW1zfV8ke2lzTG9naWNhbFNoYXBUZXhTaGFwZUVxdWFsfV8ke3JhbmsxfV8ke3JhbmsyfV8ke1xuICAgICAgICAgIHJhbmszNH1fJHtpc1RleFNoYXBlR3JlYXRlclRoYW5PbmV9XyR7aGFzT2Zmc2V0fWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHRleFNoYXBlID0geC5pc1VuaWZvcm0gPyAndW5pZm9ybScgOiB4LnRleERhdGEudGV4U2hhcGU7XG4gICAgICBrZXlJbnB1dHMgKz0gYCR7eC5zaGFwZX1fJHt0ZXhTaGFwZX1fJHtoYXNPZmZzZXR9YDtcbiAgICB9XG4gIH0pO1xuICBjb25zdCBrZXlVc2VyQ29kZSA9IHByb2dyYW0udXNlckNvZGU7XG4gIGxldCBrZXkgPSBwcm9ncmFtLmNvbnN0cnVjdG9yLm5hbWU7XG4gIC8vIEZhc3Qgc3RyaW5nIGNvbmNhdC4gU2VlIGh0dHBzOi8vanNwZXJmLmNvbS9zdHJpbmctY29uY2F0ZW5hdGlvbi8xNC5cbiAga2V5ICs9ICdfJyArIGtleUlucHV0cyArICdfJyArIGtleVVzZXJDb2RlICtcbiAgICAgIGAke2VudigpLmdldE51bWJlcignV0VCR0xfVkVSU0lPTicpfWA7XG4gIHJldHVybiBrZXk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VTaGFwZVVuaWZvcm1zKHJhbms6IG51bWJlcikge1xuICAvLyBUT0RPOiBSZW1vdmUgdGhlIGxpbWl0YWlvbiBvZiByYW5rIDw9IDQuXG4gIHJldHVybiBlbnYoKS5nZXRCb29sKCdXRUJHTF9VU0VfU0hBUEVTX1VOSUZPUk1TJykgJiYgcmFuayA8PSA0O1xufVxuIl19