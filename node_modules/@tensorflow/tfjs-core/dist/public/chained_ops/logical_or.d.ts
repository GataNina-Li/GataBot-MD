/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/logical_or" />
import { Rank, TensorLike } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        logicalOr<T extends Tensor>(b: Tensor | TensorLike): T;
    }
}
