/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/space_to_batch_nd" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        spaceToBatchND<R extends Rank>(blockShape: number[], paddings: number[][]): Tensor<R>;
    }
}
