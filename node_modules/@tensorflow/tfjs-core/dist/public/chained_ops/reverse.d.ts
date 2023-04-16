/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/reverse" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        reverse<T extends Tensor>(this: T, axis?: number | number[]): T;
    }
}
