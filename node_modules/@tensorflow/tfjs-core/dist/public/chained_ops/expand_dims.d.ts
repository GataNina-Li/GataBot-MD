/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/expand_dims" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        expandDims<T extends Tensor>(axis?: number): T;
    }
}
