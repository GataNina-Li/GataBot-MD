/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/mat_mul" />
import { Rank, TensorLike } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        matMul<T extends Tensor>(b: Tensor | TensorLike, transposeA?: boolean, transposeB?: boolean): Tensor;
    }
}
