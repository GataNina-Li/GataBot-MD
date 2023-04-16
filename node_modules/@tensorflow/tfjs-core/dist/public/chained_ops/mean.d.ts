/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/mean" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        mean<T extends Tensor>(axis?: number | number[], keepDims?: boolean): T;
    }
}
