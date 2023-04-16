/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/reshape" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        reshape<T extends Tensor>(shape: number[]): T;
    }
}
