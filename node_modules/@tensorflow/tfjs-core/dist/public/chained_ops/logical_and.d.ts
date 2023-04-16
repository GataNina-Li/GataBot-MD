/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/logical_and" />
import { Rank, TensorLike } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        logicalAnd<T extends Tensor>(b: Tensor | TensorLike): T;
    }
}
