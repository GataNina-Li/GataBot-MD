/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/logical_not" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        logicalNot<T extends Tensor>(): T;
    }
}
