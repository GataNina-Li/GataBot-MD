/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/leaky_relu" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        leakyRelu<T extends Tensor>(alpha: number): T;
    }
}
