/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/less_equal" />
import { Rank, TensorLike } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        lessEqual<T extends Tensor>(b: Tensor | TensorLike): T;
    }
}
