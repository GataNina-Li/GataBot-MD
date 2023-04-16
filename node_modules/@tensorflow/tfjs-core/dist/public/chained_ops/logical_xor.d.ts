/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/logical_xor" />
import { Rank, TensorLike } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        logicalXor<T extends Tensor>(b: Tensor | TensorLike): T;
    }
}
