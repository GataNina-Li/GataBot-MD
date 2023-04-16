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
import { ENGINE } from '../engine';
import { keep, tidy } from '../globals';
import { add } from '../ops/add';
import { mul } from '../ops/mul';
import { scalar } from '../ops/scalar';
import { registerClass } from '../serialization';
import { Optimizer } from './optimizer';
/** @doclink Optimizer */
export class SGDOptimizer extends Optimizer {
    constructor(learningRate) {
        super();
        this.learningRate = learningRate;
        this.setLearningRate(learningRate);
    }
    applyGradients(variableGradients) {
        const varNames = Array.isArray(variableGradients) ?
            variableGradients.map(v => v.name) :
            Object.keys(variableGradients);
        varNames.forEach((name, i) => {
            const gradient = Array.isArray(variableGradients) ?
                variableGradients[i].tensor :
                variableGradients[name];
            if (gradient == null) {
                return;
            }
            const value = ENGINE.registeredVariables[name];
            tidy(() => {
                const newValue = add(mul(this.c, gradient), value);
                value.assign(newValue);
            });
        });
        this.incrementIterations();
    }
    /**
     * Sets the learning rate of the optimizer.
     */
    setLearningRate(learningRate) {
        this.learningRate = learningRate;
        if (this.c != null) {
            this.c.dispose();
        }
        this.c = keep(scalar(-learningRate));
    }
    dispose() {
        this.c.dispose();
    }
    async getWeights() {
        return [await this.saveIterations()];
    }
    async setWeights(weightValues) {
        weightValues = await this.extractIterations(weightValues);
        if (weightValues.length !== 0) {
            throw new Error('SGD optimizer does not have settable weights.');
        }
    }
    getConfig() {
        return { 'learningRate': this.learningRate };
    }
    /** @nocollapse */
    static fromConfig(cls, config) {
        return new cls(config['learningRate']);
    }
}
/** @nocollapse */
SGDOptimizer.className = 'SGD'; // Note: Name matters for Python compatibility.
registerClass(SGDOptimizer);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2dkX29wdGltaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3B0aW1pemVycy9zZ2Rfb3B0aW1pemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUMvQixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckMsT0FBTyxFQUFhLGFBQWEsRUFBd0MsTUFBTSxrQkFBa0IsQ0FBQztBQUlsRyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRXRDLHlCQUF5QjtBQUN6QixNQUFNLE9BQU8sWUFBYSxTQUFRLFNBQVM7SUFLekMsWUFBc0IsWUFBb0I7UUFDeEMsS0FBSyxFQUFFLENBQUM7UUFEWSxpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUV4QyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxjQUFjLENBQUMsaUJBQStDO1FBQzVELE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1lBQy9DLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNuQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDN0IsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUIsSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO2dCQUNwQixPQUFPO2FBQ1I7WUFDRCxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDUixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ25ELEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRDs7T0FFRztJQUNILGVBQWUsQ0FBQyxZQUFvQjtRQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDbEI7UUFDRCxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxPQUFPO1FBQ0wsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVU7UUFDZCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUEyQjtRQUMxQyxZQUFZLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUQsSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7U0FDbEU7SUFDSCxDQUFDO0lBRUQsU0FBUztRQUNQLE9BQU8sRUFBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxrQkFBa0I7SUFDbEIsTUFBTSxDQUFDLFVBQVUsQ0FDYixHQUErQixFQUFFLE1BQWtCO1FBQ3JELE9BQU8sSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDekMsQ0FBQzs7QUEvREQsa0JBQWtCO0FBQ1gsc0JBQVMsR0FBRyxLQUFLLENBQUMsQ0FBRSwrQ0FBK0M7QUFnRTVFLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge2tlZXAsIHRpZHl9IGZyb20gJy4uL2dsb2JhbHMnO1xuaW1wb3J0IHthZGR9IGZyb20gJy4uL29wcy9hZGQnO1xuaW1wb3J0IHttdWx9IGZyb20gJy4uL29wcy9tdWwnO1xuaW1wb3J0IHtzY2FsYXJ9IGZyb20gJy4uL29wcy9zY2FsYXInO1xuaW1wb3J0IHtDb25maWdEaWN0LCByZWdpc3RlckNsYXNzLCBTZXJpYWxpemFibGUsIFNlcmlhbGl6YWJsZUNvbnN0cnVjdG9yfSBmcm9tICcuLi9zZXJpYWxpemF0aW9uJztcbmltcG9ydCB7U2NhbGFyfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvciwgTmFtZWRUZW5zb3JNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5cbmltcG9ydCB7T3B0aW1pemVyfSBmcm9tICcuL29wdGltaXplcic7XG5cbi8qKiBAZG9jbGluayBPcHRpbWl6ZXIgKi9cbmV4cG9ydCBjbGFzcyBTR0RPcHRpbWl6ZXIgZXh0ZW5kcyBPcHRpbWl6ZXIge1xuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGNsYXNzTmFtZSA9ICdTR0QnOyAgLy8gTm90ZTogTmFtZSBtYXR0ZXJzIGZvciBQeXRob24gY29tcGF0aWJpbGl0eS5cbiAgcHJvdGVjdGVkIGM6IFNjYWxhcjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgbGVhcm5pbmdSYXRlOiBudW1iZXIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc2V0TGVhcm5pbmdSYXRlKGxlYXJuaW5nUmF0ZSk7XG4gIH1cblxuICBhcHBseUdyYWRpZW50cyh2YXJpYWJsZUdyYWRpZW50czogTmFtZWRUZW5zb3JNYXB8TmFtZWRUZW5zb3JbXSkge1xuICAgIGNvbnN0IHZhck5hbWVzID0gQXJyYXkuaXNBcnJheSh2YXJpYWJsZUdyYWRpZW50cykgP1xuICAgICAgICB2YXJpYWJsZUdyYWRpZW50cy5tYXAodiA9PiB2Lm5hbWUpIDpcbiAgICAgICAgT2JqZWN0LmtleXModmFyaWFibGVHcmFkaWVudHMpO1xuICAgIHZhck5hbWVzLmZvckVhY2goKG5hbWUsIGkpID0+IHtcbiAgICAgIGNvbnN0IGdyYWRpZW50ID0gQXJyYXkuaXNBcnJheSh2YXJpYWJsZUdyYWRpZW50cykgP1xuICAgICAgICAgIHZhcmlhYmxlR3JhZGllbnRzW2ldLnRlbnNvciA6XG4gICAgICAgICAgdmFyaWFibGVHcmFkaWVudHNbbmFtZV07XG4gICAgICBpZiAoZ3JhZGllbnQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB2YWx1ZSA9IEVOR0lORS5yZWdpc3RlcmVkVmFyaWFibGVzW25hbWVdO1xuICAgICAgdGlkeSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gYWRkKG11bCh0aGlzLmMsIGdyYWRpZW50KSwgdmFsdWUpO1xuICAgICAgICB2YWx1ZS5hc3NpZ24obmV3VmFsdWUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy5pbmNyZW1lbnRJdGVyYXRpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbGVhcm5pbmcgcmF0ZSBvZiB0aGUgb3B0aW1pemVyLlxuICAgKi9cbiAgc2V0TGVhcm5pbmdSYXRlKGxlYXJuaW5nUmF0ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5sZWFybmluZ1JhdGUgPSBsZWFybmluZ1JhdGU7XG4gICAgaWYgKHRoaXMuYyAhPSBudWxsKSB7XG4gICAgICB0aGlzLmMuZGlzcG9zZSgpO1xuICAgIH1cbiAgICB0aGlzLmMgPSBrZWVwKHNjYWxhcigtbGVhcm5pbmdSYXRlKSk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuYy5kaXNwb3NlKCk7XG4gIH1cblxuICBhc3luYyBnZXRXZWlnaHRzKCk6IFByb21pc2U8TmFtZWRUZW5zb3JbXT4ge1xuICAgIHJldHVybiBbYXdhaXQgdGhpcy5zYXZlSXRlcmF0aW9ucygpXTtcbiAgfVxuXG4gIGFzeW5jIHNldFdlaWdodHMod2VpZ2h0VmFsdWVzOiBOYW1lZFRlbnNvcltdKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgd2VpZ2h0VmFsdWVzID0gYXdhaXQgdGhpcy5leHRyYWN0SXRlcmF0aW9ucyh3ZWlnaHRWYWx1ZXMpO1xuICAgIGlmICh3ZWlnaHRWYWx1ZXMubGVuZ3RoICE9PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NHRCBvcHRpbWl6ZXIgZG9lcyBub3QgaGF2ZSBzZXR0YWJsZSB3ZWlnaHRzLicpO1xuICAgIH1cbiAgfVxuXG4gIGdldENvbmZpZygpOiBDb25maWdEaWN0IHtcbiAgICByZXR1cm4geydsZWFybmluZ1JhdGUnOiB0aGlzLmxlYXJuaW5nUmF0ZX07XG4gIH1cblxuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGZyb21Db25maWc8VCBleHRlbmRzIFNlcmlhbGl6YWJsZT4oXG4gICAgICBjbHM6IFNlcmlhbGl6YWJsZUNvbnN0cnVjdG9yPFQ+LCBjb25maWc6IENvbmZpZ0RpY3QpOiBUIHtcbiAgICByZXR1cm4gbmV3IGNscyhjb25maWdbJ2xlYXJuaW5nUmF0ZSddKTtcbiAgfVxufVxucmVnaXN0ZXJDbGFzcyhTR0RPcHRpbWl6ZXIpO1xuIl19