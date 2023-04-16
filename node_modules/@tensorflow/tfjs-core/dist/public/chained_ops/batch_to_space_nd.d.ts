/// <amd-module name="@tensorflow/tfjs-core/dist/public/chained_ops/batch_to_space_nd" />
import { Rank } from '../../types';
declare module '../../tensor' {
    interface Tensor<R extends Rank = Rank> {
        batchToSpaceND<R extends Rank>(blockShape: number[], crops: number[][]): Tensor<R>;
    }
}
