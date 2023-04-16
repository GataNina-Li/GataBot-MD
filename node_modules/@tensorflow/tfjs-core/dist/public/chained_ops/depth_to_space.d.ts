/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/depth_to_space" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        depthToSpace<T extends Tensor4D>(blockSize: number, dataFormat: 'NHWC' | 'NCHW'): T;
    }
}
