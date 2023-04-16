/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/arg_max" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        argMax<T extends Tensor>(axis?: number): T;
    }
}
