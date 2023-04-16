/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/local_response_normalization" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        localResponseNormalization<T extends Tensor>(depthRadius?: number, bias?: number, alpha?: number, beta?: number): T;
    }
}
