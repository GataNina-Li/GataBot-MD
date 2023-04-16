/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/sub" />
import { Rank, TensorLike } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        sub<T extends Tensor>(b: Tensor | TensorLike): T;
    }
}
