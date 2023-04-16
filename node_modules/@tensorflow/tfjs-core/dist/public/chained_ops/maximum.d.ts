/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/maximum" />
import { Rank, TensorLike } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        maximum<T extends Tensor>(b: Tensor | TensorLike): T;
    }
}
