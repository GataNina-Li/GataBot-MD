/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/prod" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        prod<T extends Tensor>(this: T, axis?: number | number[], keepDims?: boolean): T;
    }
}
