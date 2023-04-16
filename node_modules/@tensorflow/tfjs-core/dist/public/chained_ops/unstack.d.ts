/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/unstack" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        unstack<T extends Tensor>(axis?: number): T[];
    }
}
