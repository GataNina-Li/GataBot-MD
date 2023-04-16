/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/prelu" />
import { Rank, TensorLike } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        prelu<T extends Tensor>(alpha: T | TensorLike): T;
    }
}
