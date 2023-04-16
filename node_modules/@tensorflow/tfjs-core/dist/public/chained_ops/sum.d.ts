/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/sum" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        sum<T extends Tensor>(axis?: number | number[], keepDims?: boolean): T;
    }
}
