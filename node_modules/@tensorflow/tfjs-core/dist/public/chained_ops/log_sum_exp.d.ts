/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/log_sum_exp" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        logSumExp<T extends Tensor>(this: T, axis?: number | number[], keepDims?: boolean): T;
    }
}
