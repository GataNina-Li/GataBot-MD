/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/mul" />
import { Rank, TensorLike } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        mul<T extends Tensor>(b: Tensor | TensorLike): T;
    }
}
