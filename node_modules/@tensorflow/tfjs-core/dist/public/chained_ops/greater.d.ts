/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/greater" />
import { Rank, TensorLike } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        greater<T extends Tensor>(b: Tensor | TensorLike): T;
    }
}
