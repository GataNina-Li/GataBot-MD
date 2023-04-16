/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/squeeze" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        squeeze<T extends Tensor>(axis?: number[]): T;
    }
}
