/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/minimum" />
import { Rank, TensorLike } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        minimum<T extends Tensor>(b: Tensor | TensorLike): T;
    }
}
