/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/relu6" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        relu6<T extends Tensor>(): T;
    }
}
