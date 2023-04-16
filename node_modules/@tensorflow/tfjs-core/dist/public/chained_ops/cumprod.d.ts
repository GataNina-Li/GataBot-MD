/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/cumprod" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        cumprod<R extends Rank>(axis?: number, exclusive?: boolean, reverse?: boolean): Tensor<R>;
    }
}
