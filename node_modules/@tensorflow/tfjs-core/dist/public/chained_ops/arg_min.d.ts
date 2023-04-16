/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/arg_min" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        argMin<T extends Tensor>(axis?: number): T;
    }
}
