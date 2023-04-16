/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/stack" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        stack<T extends Tensor>(x: Tensor | Tensor[], axis?: number): T;
    }
}
