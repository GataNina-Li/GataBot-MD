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
import { dispose, tidy } from '../globals';
import { add } from '../ops/add';
import { div } from '../ops/div';
import { fill } from '../ops/fill';
import { mul } from '../ops/mul';
import { sqrt } from '../ops/sqrt';
import { square } from '../ops/square';
import { registerClass } from '../serialization';
import { Optimizer } from './optimizer';
/** @doclink Optimizer */
export class AdagradOptimizer extends Optimizer {
    constructor(learningRate, initialAccumulatorValue = 0.1) {
        super();
        this.learningRate = learningRate;
        this.initialAccumulatorValue = initialAccumulatorValue;
        this.accumulatedGrads = [];
    }
    applyGradients(variableGradients) {
        const variableNames = Array.isArray(variableGradients) ?
            variableGradients.map(item => item.name) :
            Object.keys(variableGradients);
        variableNames.forEach((name, i) => {
            const value = ENGINE.registeredVariables[name];
            if (this.accumulatedGrads[i] == null) {
                const trainable = false;
                this.accumulatedGrads[i] = {
                    originalName: `${name}/accumulator`,
                    variable: tidy(() => fill(value.shape, this.initialAccumulatorValue)
                        .variable(trainable))
                };
            }
            const gradient = Array.isArray(variableGradients) ?
                variableGradients[i].tensor :
                variableGradients[name];
            if (gradient == null) {
                return;
            }
            const accumulatedGrad = this.accumulatedGrads[i].variable;
            tidy(() => {
                const newAccumulatedGrad = add(accumulatedGrad, square(gradient));
                accumulatedGrad.assign(newAccumulatedGrad);
                const newValue = add(mul(div(gradient, sqrt(add(newAccumulatedGrad, ENGINE.backend.epsilon()))), -this.learningRate), value);
                value.assign(newValue);
            });
        });
        this.incrementIterations();
    }
    dispose() {
        if (this.accumulatedGrads != null) {
            dispose(this.accumulatedGrads.map(v => v.variable));
        }
    }
    async getWeights() {
        // Order matters for Python compatibility.
        return [await this.saveIterations()].concat(this.accumulatedGrads.map(v => ({ name: v.originalName, tensor: v.variable })));
    }
    async setWeights(weightValues) {
        weightValues = await this.extractIterations(weightValues);
        const trainable = false;
        this.accumulatedGrads = weightValues.map(v => ({ originalName: v.name, variable: v.tensor.variable(trainable) }));
    }
    getConfig() {
        return {
            'learningRate': this.learningRate,
            'initialAccumulatorValue': this.initialAccumulatorValue,
        };
    }
    /** @nocollapse */
    static fromConfig(cls, config) {
        return new cls(config['learningRate'], config['initialAccumulatorValue']);
    }
}
/** @nocollapse */
AdagradOptimizer.className = 'Adagrad'; // Note: Name matters for Python compatibility.
registerClass(AdagradOptimizer);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRhZ3JhZF9vcHRpbWl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wdGltaXplcnMvYWRhZ3JhZF9vcHRpbWl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUN6QyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0IsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNqQyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDakMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNyQyxPQUFPLEVBQWEsYUFBYSxFQUF3QyxNQUFNLGtCQUFrQixDQUFDO0FBR2xHLE9BQU8sRUFBQyxTQUFTLEVBQW9CLE1BQU0sYUFBYSxDQUFDO0FBRXpELHlCQUF5QjtBQUN6QixNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsU0FBUztJQU03QyxZQUNjLFlBQW9CLEVBQVUsMEJBQTBCLEdBQUc7UUFDdkUsS0FBSyxFQUFFLENBQUM7UUFESSxpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUFVLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBTTtRQUhqRSxxQkFBZ0IsR0FBd0IsRUFBRSxDQUFDO0lBS25ELENBQUM7SUFFRCxjQUFjLENBQUMsaUJBQWlEO1FBQzlELE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1lBQ3BELGlCQUFp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QyxnQkFBZ0IsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUNwQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVELFNBQVM7UUFDUCxPQUFPO1lBQ0wsY0FBYyxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQ2pDLHlCQUF5QixFQUFFLElBQUksQ0FBQyx1QkFBdUI7U0FDeEQsQ0FBQztJQUNKLENBQUM7SUFFRCxrQkFBa0I7SUFDbEIsTUFBTSxDQUFDLFVBQVUsQ0FDYixHQUErQixFQUFFLE1BQWtCO1FBQ3JELE9BQU8sSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQzs7QUFqRkQsa0JBQWtCO0FBQ1gsMEJBQVMsR0FBRyxTQUFTLENBQUMsQ0FBRSwrQ0FBK0M7QUFrRmhGLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vZW5naW5lJztcbmltcG9ydCB7ZGlzcG9zZSwgdGlkeX0gZnJvbSAnLi4vZ2xvYmFscyc7XG5pbXBvcnQge2FkZH0gZnJvbSAnLi4vb3BzL2FkZCc7XG5pbXBvcnQge2Rpdn0gZnJvbSAnLi4vb3BzL2Rpdic7XG5pbXBvcnQge2ZpbGx9IGZyb20gJy4uL29wcy9maWxsJztcbmltcG9ydCB7bXVsfSBmcm9tICcuLi9vcHMvbXVsJztcbmltcG9ydCB7c3FydH0gZnJvbSAnLi4vb3BzL3NxcnQnO1xuaW1wb3J0IHtzcXVhcmV9IGZyb20gJy4uL29wcy9zcXVhcmUnO1xuaW1wb3J0IHtDb25maWdEaWN0LCByZWdpc3RlckNsYXNzLCBTZXJpYWxpemFibGUsIFNlcmlhbGl6YWJsZUNvbnN0cnVjdG9yfSBmcm9tICcuLi9zZXJpYWxpemF0aW9uJztcbmltcG9ydCB7TmFtZWRUZW5zb3IsIE5hbWVkVmFyaWFibGVNYXB9IGZyb20gJy4uL3RlbnNvcl90eXBlcyc7XG5cbmltcG9ydCB7T3B0aW1pemVyLCBPcHRpbWl6ZXJWYXJpYWJsZX0gZnJvbSAnLi9vcHRpbWl6ZXInO1xuXG4vKiogQGRvY2xpbmsgT3B0aW1pemVyICovXG5leHBvcnQgY2xhc3MgQWRhZ3JhZE9wdGltaXplciBleHRlbmRzIE9wdGltaXplciB7XG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgY2xhc3NOYW1lID0gJ0FkYWdyYWQnOyAgLy8gTm90ZTogTmFtZSBtYXR0ZXJzIGZvciBQeXRob24gY29tcGF0aWJpbGl0eS5cblxuICBwcml2YXRlIGFjY3VtdWxhdGVkR3JhZHM6IE9wdGltaXplclZhcmlhYmxlW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByb3RlY3RlZCBsZWFybmluZ1JhdGU6IG51bWJlciwgcHJpdmF0ZSBpbml0aWFsQWNjdW11bGF0b3JWYWx1ZSA9IDAuMSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBhcHBseUdyYWRpZW50cyh2YXJpYWJsZUdyYWRpZW50czogTmFtZWRWYXJpYWJsZU1hcHxOYW1lZFRlbnNvcltdKSB7XG4gICAgY29uc3QgdmFyaWFibGVOYW1lcyA9IEFycmF5LmlzQXJyYXkodmFyaWFibGVHcmFkaWVudHMpID9cbiAgICAgICAgdmFyaWFibGVHcmFkaWVudHMubWFwKGl0ZW0gPT4gaXRlbS5uYW1lKSA6XG4gICAgICAgIE9iamVjdC5rZXlzKHZhcmlhYmxlR3JhZGllbnRzKTtcblxuICAgIHZhcmlhYmxlTmFtZXMuZm9yRWFjaCgobmFtZSwgaSkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBFTkdJTkUucmVnaXN0ZXJlZFZhcmlhYmxlc1tuYW1lXTtcbiAgICAgIGlmICh0aGlzLmFjY3VtdWxhdGVkR3JhZHNbaV0gPT0gbnVsbCkge1xuICAgICAgICBjb25zdCB0cmFpbmFibGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hY2N1bXVsYXRlZEdyYWRzW2ldID0ge1xuICAgICAgICAgIG9yaWdpbmFsTmFtZTogYCR7bmFtZX0vYWNjdW11bGF0b3JgLFxuICAgICAgICAgIHZhcmlhYmxlOiB0aWR5KFxuICAgICAgICAgICAgICAoKSA9PiBmaWxsKHZhbHVlLnNoYXBlLCB0aGlzLmluaXRpYWxBY2N1bXVsYXRvclZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnZhcmlhYmxlKHRyYWluYWJsZSkpXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdyYWRpZW50ID0gQXJyYXkuaXNBcnJheSh2YXJpYWJsZUdyYWRpZW50cykgP1xuICAgICAgICAgIHZhcmlhYmxlR3JhZGllbnRzW2ldLnRlbnNvciA6XG4gICAgICAgICAgdmFyaWFibGVHcmFkaWVudHNbbmFtZV07XG4gICAgICBpZiAoZ3JhZGllbnQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFjY3VtdWxhdGVkR3JhZCA9IHRoaXMuYWNjdW11bGF0ZWRHcmFkc1tpXS52YXJpYWJsZTtcblxuICAgICAgdGlkeSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0FjY3VtdWxhdGVkR3JhZCA9IGFkZChhY2N1bXVsYXRlZEdyYWQsIHNxdWFyZShncmFkaWVudCkpO1xuICAgICAgICBhY2N1bXVsYXRlZEdyYWQuYXNzaWduKG5ld0FjY3VtdWxhdGVkR3JhZCk7XG5cbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPSBhZGQoXG4gICAgICAgICAgICBtdWwoZGl2KGdyYWRpZW50LFxuICAgICAgICAgICAgICAgICAgICBzcXJ0KGFkZChuZXdBY2N1bXVsYXRlZEdyYWQsIEVOR0lORS5iYWNrZW5kLmVwc2lsb24oKSkpKSxcbiAgICAgICAgICAgICAgICAtdGhpcy5sZWFybmluZ1JhdGUpLFxuICAgICAgICAgICAgdmFsdWUpO1xuICAgICAgICB2YWx1ZS5hc3NpZ24obmV3VmFsdWUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdGhpcy5pbmNyZW1lbnRJdGVyYXRpb25zKCk7XG4gIH1cblxuICBkaXNwb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmFjY3VtdWxhdGVkR3JhZHMgIT0gbnVsbCkge1xuICAgICAgZGlzcG9zZSh0aGlzLmFjY3VtdWxhdGVkR3JhZHMubWFwKHYgPT4gdi52YXJpYWJsZSkpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGdldFdlaWdodHMoKTogUHJvbWlzZTxOYW1lZFRlbnNvcltdPiB7XG4gICAgLy8gT3JkZXIgbWF0dGVycyBmb3IgUHl0aG9uIGNvbXBhdGliaWxpdHkuXG4gICAgcmV0dXJuIFthd2FpdCB0aGlzLnNhdmVJdGVyYXRpb25zKCldLmNvbmNhdCh0aGlzLmFjY3VtdWxhdGVkR3JhZHMubWFwKFxuICAgICAgICB2ID0+ICh7bmFtZTogdi5vcmlnaW5hbE5hbWUsIHRlbnNvcjogdi52YXJpYWJsZX0pKSk7XG4gIH1cblxuICBhc3luYyBzZXRXZWlnaHRzKHdlaWdodFZhbHVlczogTmFtZWRUZW5zb3JbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHdlaWdodFZhbHVlcyA9IGF3YWl0IHRoaXMuZXh0cmFjdEl0ZXJhdGlvbnMod2VpZ2h0VmFsdWVzKTtcbiAgICBjb25zdCB0cmFpbmFibGUgPSBmYWxzZTtcbiAgICB0aGlzLmFjY3VtdWxhdGVkR3JhZHMgPSB3ZWlnaHRWYWx1ZXMubWFwKFxuICAgICAgICB2ID0+ICh7b3JpZ2luYWxOYW1lOiB2Lm5hbWUsIHZhcmlhYmxlOiB2LnRlbnNvci52YXJpYWJsZSh0cmFpbmFibGUpfSkpO1xuICB9XG5cbiAgZ2V0Q29uZmlnKCk6IENvbmZpZ0RpY3Qge1xuICAgIHJldHVybiB7XG4gICAgICAnbGVhcm5pbmdSYXRlJzogdGhpcy5sZWFybmluZ1JhdGUsXG4gICAgICAnaW5pdGlhbEFjY3VtdWxhdG9yVmFsdWUnOiB0aGlzLmluaXRpYWxBY2N1bXVsYXRvclZhbHVlLFxuICAgIH07XG4gIH1cblxuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGZyb21Db25maWc8VCBleHRlbmRzIFNlcmlhbGl6YWJsZT4oXG4gICAgICBjbHM6IFNlcmlhbGl6YWJsZUNvbnN0cnVjdG9yPFQ+LCBjb25maWc6IENvbmZpZ0RpY3QpOiBUIHtcbiAgICByZXR1cm4gbmV3IGNscyhjb25maWdbJ2xlYXJuaW5nUmF0ZSddLCBjb25maWdbJ2luaXRpYWxBY2N1bXVsYXRvclZhbHVlJ10pO1xuICB9XG59XG5yZWdpc3RlckNsYXNzKEFkYWdyYWRPcHRpbWl6ZXIpO1xuIl19