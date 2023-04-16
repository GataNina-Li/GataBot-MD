/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/greater_equal" />
import { Rank, TensorLike } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        greaterEqual<T extends Tensor>(b: Tensor | TensorLike): T;
    }
}
