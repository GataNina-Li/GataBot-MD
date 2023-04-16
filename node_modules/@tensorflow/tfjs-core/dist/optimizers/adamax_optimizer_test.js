/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as tf from '../index';
import { ALL_ENVS, describeWithFlags } from '../jasmine_util';
import { expectArraysClose } from '../test_util';
describeWithFlags('AdamaxOptimizer', ALL_ENVS, () => {
    it('basic', async () => {
        const initialTensors = tf.memory().numTensors;
        const learningRate = 0.1;
        const beta1 = 0.8;
        const beta2 = 0.9;
        const decay = 0.1;
        const optimizer = tf.train.adamax(learningRate, beta1, beta2, undefined, decay);
        const x = tf.tensor1d([2, 4]).variable();
        const f = () => x.square().sum();
        let numTensors = tf.memory().numTensors;
        let cost = optimizer.minimize(f, /* returnCost */ true);
        // Cost & 2 accumulators should be the only additional arrays.
        expect(tf.memory().numTensors).toBe(numTensors + 3);
        // new_first_m = [
        //    beta1 * old_first_m_w1 + (1-beta1) * grad_w1,
        //    beta1 * old_first_m_w2 + (1-beta1) * grad_w2
        // ] = [.8, 1.6]
        //
        // ut_0 = beta2 * old_weighted_inf_norm = [0, 0]
        // u1_1 = [
        //    abs(grad_w1),
        //    abs(grad_w2)
        // ] = [4, 8]
        // new_weighted_inf_norm = max(ut_0, ut_1) = [4, 8]
        //
        // coefficient = alpha / (1-beta1) = 0.5
        // updates = coefficient * [
        //    new_first_m1 / new_weighted_inf_norm1,
        //    new_first_m2 / new_weighted_inf_norm2
        // ] = [0.1, 0.1]
        // w = [
        //    w1_old - updates_1,
        //    w2_old - updates_2
        // ] = [1.9, 3.9]
        //
        expectArraysClose(await x.data(), [1.9, 3.9]);
        cost.dispose();
        numTensors = tf.memory().numTensors;
        cost = optimizer.minimize(f, /* returnCost */ false);
        // gradient = [3.8, 7.8]
        // new_first_m = [
        //    beta1 * old_first_m_w1 + (1-beta1) * grad_w1,
        //    beta1 * old_first_m_w2 + (1-beta1) * grad_w2
        // ] = [
        //    0.8 * 0.8 + 0.2 * 3.8,
        //    0.8 * 1.6 + 0.2 * 7.8
        // ] = [1.4, 2.84]
        //
        // ut_0 = beta2 * old_weighted_inf_norm = [
        //    0.9 * 4,
        //    0.9 * 8
        // ] = [3.6, 7.2]
        // u1_1 = [
        //    abs(grad_w1),
        //    abs(grad_w2)
        // ] = [3.8, 7.8]
        // new_weighted_inf_norm = max(ut_0, ut_1) = [3.8, 7.8]
        //
        // alpha = 0.1 / (1 + 0.1 * 1) = 0.0909090909
        //
        // coefficient = alpha / (1 - beta1*beta1) = 0.25252525
        // updates = coefficient * [
        //    new_first_m1 / new_weighted_inf_norm1,
        //    new_first_m2 / new_weighted_inf_norm2
        // ] = [0.09303, 0.09194]
        // w = [
        //    w1_old - updates_1,
        //    w2_old - updates_2
        // ] = [1.80697, 3.8086]
        //
        expectArraysClose(await x.data(), [1.80697, 3.8086]);
        // There should be no new additional Tensors.
        expect(tf.memory().numTensors).toBe(numTensors);
        expect(cost).toBe(null);
        x.dispose();
        optimizer.dispose();
        // The only additional tensor remaining should be the argument to
        // variable().
        expect(tf.memory().numTensors).toBe(initialTensors + 1);
    });
    it('serialization round-trip', () => {
        const originalOpt = tf.train.adamax(0.1, 0.2, 0.3, 2e-8, 0.1);
        const reserialized = tf.AdamaxOptimizer.fromConfig(tf.AdamaxOptimizer, originalOpt.getConfig());
        expect(reserialized.getConfig()).toEqual(originalOpt.getConfig());
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRhbWF4X29wdGltaXplcl90ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHRpbWl6ZXJzL2FkYW1heF9vcHRpbWl6ZXJfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMvQixPQUFPLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRS9DLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDbEQsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLElBQUksRUFBRTtRQUNyQixNQUFNLGNBQWMsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDO1FBQzlDLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQztRQUN6QixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUM7UUFDbEIsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ2xCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUNsQixNQUFNLFNBQVMsR0FDWCxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFbEUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRXpDLE1BQU0sQ0FBQyxHQUFvQixHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFbEQsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFD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QUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQ3BFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7QUxMX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzfSBmcm9tICcuLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHtleHBlY3RBcnJheXNDbG9zZX0gZnJvbSAnLi4vdGVzdF91dGlsJztcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ0FkYW1heE9wdGltaXplcicsIEFMTF9FTlZTLCAoKSA9PiB7XG4gIGl0KCdiYXNpYycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBpbml0aWFsVGVuc29ycyA9IHRmLm1lbW9yeSgpLm51bVRlbnNvcnM7XG4gICAgY29uc3QgbGVhcm5pbmdSYXRlID0gMC4xO1xuICAgIGNvbnN0IGJldGExID0gMC44O1xuICAgIGNvbnN0IGJldGEyID0gMC45O1xuICAgIGNvbnN0IGRlY2F5ID0gMC4xO1xuICAgIGNvbnN0IG9wdGltaXplciA9XG4gICAgICAgIHRmLnRyYWluLmFkYW1heChsZWFybmluZ1JhdGUsIGJldGExLCBiZXRhMiwgdW5kZWZpbmVkLCBkZWNheSk7XG5cbiAgICBjb25zdCB4ID0gdGYudGVuc29yMWQoWzIsIDRdKS52YXJpYWJsZSgpO1xuXG4gICAgY29uc3QgZjogKCkgPT4gdGYuU2NhbGFyID0gKCkgPT4geC5zcXVhcmUoKS5zdW0oKTtcblxuICAgIGxldCBudW1UZW5zb3JzID0gdGYubWVtb3J5KCkubnVtVGVuc29ycztcblxuICAgIGxldCBjb3N0ID0gb3B0aW1pemVyLm1pbmltaXplKGYsIC8qIHJldHVybkNvc3QgKi8gdHJ1ZSk7XG5cbiAgICAvLyBDb3N0ICYgMiBhY2N1bXVsYXRvcnMgc2hvdWxkIGJlIHRoZSBvbmx5IGFkZGl0aW9uYWwgYXJyYXlzLlxuICAgIGV4cGVjdCh0Zi5tZW1vcnkoKS5udW1UZW5zb3JzKS50b0JlKG51bVRlbnNvcnMgKyAzKTtcbiAgICAvLyBuZXdfZmlyc3RfbSA9IFtcbiAgICAvLyAgICBiZXRhMSAqIG9sZF9maXJzdF9tX3cxICsgKDEtYmV0YTEpICogZ3JhZF93MSxcbiAgICAvLyAgICBiZXRhMSAqIG9sZF9maXJzdF9tX3cyICsgKDEtYmV0YTEpICogZ3JhZF93MlxuICAgIC8vIF0gPSBbLjgsIDEuNl1cbiAgICAvL1xuICAgIC8vIHV0XzAgPSBiZXRhMiAqIG9sZF93ZWlnaHRlZF9pbmZfbm9ybSA9IFswLCAwXVxuICAgIC8vIHUxXzEgPSBbXG4gICAgLy8gICAgYWJzKGdyYWRfdzEpLFxuICAgIC8vICAgIGFicyhncmFkX3cyKVxuICAgIC8vIF0gPSBbNCwgOF1cbiAgICAvLyBuZXdfd2VpZ2h0ZWRfaW5mX25vcm0gPSBtYXgodXRfMCwgdXRfMSkgPSBbNCwgOF1cbiAgICAvL1xuICAgIC8vIGNvZWZmaWNpZW50ID0gYWxwaGEgLyAoMS1iZXRhMSkgPSAwLjVcbiAgICAvLyB1cGRhdGVzID0gY29lZmZpY2llbnQgKiBbXG4gICAgLy8gICAgbmV3X2ZpcnN0X20xIC8gbmV3X3dlaWdodGVkX2luZl9ub3JtMSxcbiAgICAvLyAgICBuZXdfZmlyc3RfbTIgLyBuZXdfd2VpZ2h0ZWRfaW5mX25vcm0yXG4gICAgLy8gXSA9IFswLjEsIDAuMV1cbiAgICAvLyB3ID0gW1xuICAgIC8vICAgIHcxX29sZCAtIHVwZGF0ZXNfMSxcbiAgICAvLyAgICB3Ml9vbGQgLSB1cGRhdGVzXzJcbiAgICAvLyBdID0gWzEuOSwgMy45XVxuICAgIC8vXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgeC5kYXRhKCksIFsxLjksIDMuOV0pO1xuXG4gICAgY29zdC5kaXNwb3NlKCk7XG4gICAgbnVtVGVuc29ycyA9IHRmLm1lbW9yeSgpLm51bVRlbnNvcnM7XG5cbiAgICBjb3N0ID0gb3B0aW1pemVyLm1pbmltaXplKGYsIC8qIHJldHVybkNvc3QgKi8gZmFsc2UpO1xuXG4gICAgLy8gZ3JhZGllbnQgPSBbMy44LCA3LjhdXG4gICAgLy8gbmV3X2ZpcnN0X20gPSBbXG4gICAgLy8gICAgYmV0YTEgKiBvbGRfZmlyc3RfbV93MSArICgxLWJldGExKSAqIGdyYWRfdzEsXG4gICAgLy8gICAgYmV0YTEgKiBvbGRfZmlyc3RfbV93MiArICgxLWJldGExKSAqIGdyYWRfdzJcbiAgICAvLyBdID0gW1xuICAgIC8vICAgIDAuOCAqIDAuOCArIDAuMiAqIDMuOCxcbiAgICAvLyAgICAwLjggKiAxLjYgKyAwLjIgKiA3LjhcbiAgICAvLyBdID0gWzEuNCwgMi44NF1cbiAgICAvL1xuICAgIC8vIHV0XzAgPSBiZXRhMiAqIG9sZF93ZWlnaHRlZF9pbmZfbm9ybSA9IFtcbiAgICAvLyAgICAwLjkgKiA0LFxuICAgIC8vICAgIDAuOSAqIDhcbiAgICAvLyBdID0gWzMuNiwgNy4yXVxuICAgIC8vIHUxXzEgPSBbXG4gICAgLy8gICAgYWJzKGdyYWRfdzEpLFxuICAgIC8vICAgIGFicyhncmFkX3cyKVxuICAgIC8vIF0gPSBbMy44LCA3LjhdXG4gICAgLy8gbmV3X3dlaWdodGVkX2luZl9ub3JtID0gbWF4KHV0XzAsIHV0XzEpID0gWzMuOCwgNy44XVxuICAgIC8vXG4gICAgLy8gYWxwaGEgPSAwLjEgLyAoMSArIDAuMSAqIDEpID0gMC4wOTA5MDkwOTA5XG4gICAgLy9cbiAgICAvLyBjb2VmZmljaWVudCA9IGFscGhhIC8gKDEgLSBiZXRhMSpiZXRhMSkgPSAwLjI1MjUyNTI1XG4gICAgLy8gdXBkYXRlcyA9IGNvZWZmaWNpZW50ICogW1xuICAgIC8vICAgIG5ld19maXJzdF9tMSAvIG5ld193ZWlnaHRlZF9pbmZfbm9ybTEsXG4gICAgLy8gICAgbmV3X2ZpcnN0X20yIC8gbmV3X3dlaWdodGVkX2luZl9ub3JtMlxuICAgIC8vIF0gPSBbMC4wOTMwMywgMC4wOTE5NF1cbiAgICAvLyB3ID0gW1xuICAgIC8vICAgIHcxX29sZCAtIHVwZGF0ZXNfMSxcbiAgICAvLyAgICB3Ml9vbGQgLSB1cGRhdGVzXzJcbiAgICAvLyBdID0gWzEuODA2OTcsIDMuODA4Nl1cbiAgICAvL1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHguZGF0YSgpLCBbMS44MDY5NywgMy44MDg2XSk7XG4gICAgLy8gVGhlcmUgc2hvdWxkIGJlIG5vIG5ldyBhZGRpdGlvbmFsIFRlbnNvcnMuXG4gICAgZXhwZWN0KHRmLm1lbW9yeSgpLm51bVRlbnNvcnMpLnRvQmUobnVtVGVuc29ycyk7XG5cbiAgICBleHBlY3QoY29zdCkudG9CZShudWxsKTtcblxuICAgIHguZGlzcG9zZSgpO1xuICAgIG9wdGltaXplci5kaXNwb3NlKCk7XG5cbiAgICAvLyBUaGUgb25seSBhZGRpdGlvbmFsIHRlbnNvciByZW1haW5pbmcgc2hvdWxkIGJlIHRoZSBhcmd1bWVudCB0b1xuICAgIC8vIHZhcmlhYmxlKCkuXG4gICAgZXhwZWN0KHRmLm1lbW9yeSgpLm51bVRlbnNvcnMpLnRvQmUoaW5pdGlhbFRlbnNvcnMgKyAxKTtcbiAgfSk7XG5cbiAgaXQoJ3NlcmlhbGl6YXRpb24gcm91bmQtdHJpcCcsICgpID0+IHtcbiAgICBjb25zdCBvcmlnaW5hbE9wdCA9IHRmLnRyYWluLmFkYW1heCgwLjEsIDAuMiwgMC4zLCAyZS04LCAwLjEpO1xuICAgIGNvbnN0IHJlc2VyaWFsaXplZCA9IHRmLkFkYW1heE9wdGltaXplci5mcm9tQ29uZmlnKFxuICAgICAgICB0Zi5BZGFtYXhPcHRpbWl6ZXIsIG9yaWdpbmFsT3B0LmdldENvbmZpZygpKTtcbiAgICBleHBlY3QocmVzZXJpYWxpemVkLmdldENvbmZpZygpKS50b0VxdWFsKG9yaWdpbmFsT3B0LmdldENvbmZpZygpKTtcbiAgfSk7XG59KTtcbiJdfQ==