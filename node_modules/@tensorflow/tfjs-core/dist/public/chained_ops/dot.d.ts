/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/dot" />
import { Rank, TensorLike } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        dot<T extends Tensor>(b: Tensor | TensorLike): Tensor;
    }
}
