/// <amd-module name="@tensorflow/tfjs-backend-webgl/dist/kernels/Cast" />
import { CastAttrs, CastInputs, KernelConfig, TensorInfo } from '@tensorflow/tfjs-core';
import { MathBackendWebGL } from '../backend_webgl';
export declare function cast(args: {
    inputs: CastInputs;
    backend: MathBackendWebGL;
    attrs: CastAttrs;
}): TensorInfo;
export declare const castConfig: KernelConfig;
