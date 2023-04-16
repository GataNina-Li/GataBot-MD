/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/all" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        all<T extends Tensor>(this: T, axis?: number | number[], keepDims?: boolean): T;
    }
}
