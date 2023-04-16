/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/elu" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        elu<T extends Tensor>(): T;
    }
}
