/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/selu" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        selu<T extends Tensor>(): T;
    }
}
