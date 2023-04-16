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
import { dispose } from '../globals';
import { variableGrads } from '../gradients';
import { scalar } from '../ops/ops';
import { Serializable } from '../serialization';
/** @doc {heading: 'Training', subheading: 'Classes', namespace: 'train'} */
export class Optimizer extends Serializable {
    /**
     * Executes `f()` and minimizes the scalar output of `f()` by computing
     * gradients of y with respect to the list of trainable variables provided by
     * `varList`. If no list is provided, it defaults to all trainable variables.
     *
     * @param f The function to execute and whose output to minimize.
     * @param returnCost Whether to return the scalar cost value produced by
     * executing `f()`.
     * @param varList An optional list of variables to update. If specified, only
     * the trainable variables in varList will be updated by minimize. Defaults to
     * all trainable variables.
     *
     * @doc {heading: 'Training', subheading: 'Optimizers'}
     */
    minimize(f, returnCost = false, varList) {
        const { value, grads } = this.computeGradients(f, varList);
        if (varList != null) {
            const gradArray = varList.map(v => ({ name: v.name, tensor: grads[v.name] }));
            this.applyGradients(gradArray);
        }
        else {
            this.applyGradients(grads);
        }
        // Dispose gradients.
        dispose(grads);
        if (returnCost) {
            return value;
        }
        else {
            value.dispose();
            return null;
        }
    }
    /**
     * The number of iterations that this optimizer instance has been invoked for.
     */
    get iterations() {
        if (this.iterations_ == null) {
            this.iterations_ = 0;
        }
        return this.iterations_;
    }
    incrementIterations() {
        this.iterations_ = this.iterations + 1;
    }
    /**
     * Executes f() and computes the gradient of the scalar output of f() with
     * respect to the list of trainable variables provided by `varList`. If no
     * list is provided, it defaults to all trainable variables.
     *
     * @param f The function to execute and whose output to use for computing
     * gradients with respect to variables.
     * @param varList An optional list of variables to compute gradients with
     * respect to. If specified, only the trainable variables in varList will have
     * gradients computed with respect to. Defaults to all trainable variables.
     *
     * @doc {heading: 'Training', subheading: 'Optimizers'}
     */
    computeGradients(f, varList) {
        return variableGrads(f, varList);
    }
    /**
     * Dispose the variables (if any) owned by this optimizer instance.
     */
    dispose() {
        if (this.iterations_ != null) {
            dispose(this.iterations_);
        }
    }
    async saveIterations() {
        if (this.iterations_ == null) {
            this.iterations_ = 0;
        }
        return {
            name: 'iter',
            // TODO(cais): Use 'int64' type when available.
            tensor: scalar(this.iterations_, 'int32')
        };
    }
    async getWeights() {
        throw new Error('getWeights() is not implemented for this optimizer yet.');
    }
    async setWeights(weightValues) {
        throw new Error(`setWeights() is not implemented for this optimizer class ` +
            `${this.getClassName()}`);
    }
    /**
     * Extract the first element of the weight values and set it
     * as the iterations counter variable of this instance of optimizer.
     *
     * @param weightValues
     * @returns Weight values with the first element consumed and excluded.
     */
    async extractIterations(weightValues) {
        this.iterations_ = (await weightValues[0].tensor.data())[0];
        return weightValues.slice(1);
    }
}
Object.defineProperty(Optimizer, Symbol.hasInstance, {
    value: (instance) => {
        return instance.minimize != null && instance.computeGradients != null &&
            instance.applyGradients != null;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW1pemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHRpbWl6ZXJzL29wdGltaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDM0MsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNsQyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFvQjlDLDRFQUE0RTtBQUM1RSxNQUFNLE9BQWdCLFNBQVUsU0FBUSxZQUFZO0lBR2xEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSCxRQUFRLENBQUMsQ0FBZSxFQUFFLFVBQVUsR0FBRyxLQUFLLEVBQUUsT0FBb0I7UUFFaEUsTUFBTSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXpELElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtZQUNuQixNQUFNLFNBQVMsR0FDWCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDaEM7YUFBTTtZQUNMLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDNUI7UUFFRCxxQkFBcUI7UUFDckIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWYsSUFBSSxVQUFVLEVBQUU7WUFDZCxPQUFPLEtBQUssQ0FBQztTQUNkO2FBQU07WUFDTCxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDaEIsT0FBTyxJQUFJLENBQUM7U0FDYjtJQUNILENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksVUFBVTtRQUNaLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7U0FDdEI7UUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVTLG1CQUFtQjtRQUMzQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDSCxnQkFBZ0IsQ0FBQyxDQUFlLEVBQUUsT0FBb0I7UUFFcEQsT0FBTyxhQUFhLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFZRDs7T0FFRztJQUNILE9BQU87UUFDTCxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxFQUFFO1lBQzVCLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDM0I7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLGNBQWM7UUFDbEIsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksRUFBRTtZQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztTQUN0QjtRQUNELE9BQU87WUFDTCxJQUFJLEVBQUUsTUFBTTtZQUNaLCtDQUErQztZQUMvQyxNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDO1NBQzFDLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVU7UUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVELEtBQUssQ0FBQyxVQUFVLENBQUMsWUFBMkI7UUFDMUMsTUFBTSxJQUFJLEtBQUssQ0FDWCwyREFBMkQ7WUFDM0QsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDTyxLQUFLLENBQUMsaUJBQWlCLENBQUMsWUFBMkI7UUFFM0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLE1BQU0sWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDO0NBQ0Y7QUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFO0lBQ25ELEtBQUssRUFBRSxDQUFDLFFBQW1CLEVBQUUsRUFBRTtRQUM3QixPQUFPLFFBQVEsQ0FBQyxRQUFRLElBQUksSUFBSSxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJO1lBQ2pFLFFBQVEsQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDO0lBQ3RDLENBQUM7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7ZGlzcG9zZX0gZnJvbSAnLi4vZ2xvYmFscyc7XG5pbXBvcnQge3ZhcmlhYmxlR3JhZHN9IGZyb20gJy4uL2dyYWRpZW50cyc7XG5pbXBvcnQge3NjYWxhcn0gZnJvbSAnLi4vb3BzL29wcyc7XG5pbXBvcnQge1NlcmlhbGl6YWJsZX0gZnJvbSAnLi4vc2VyaWFsaXphdGlvbic7XG5pbXBvcnQge1NjYWxhciwgVmFyaWFibGV9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yLCBOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcblxuLyoqXG4gKiBBIHZhcmlhYmxlIHRoYXQgYmVsb25ncyB0byBhbiBvcHRpbWl6ZXIuXG4gKlxuICogVGhlIGBvcmlnaW5hbE5hbWVgIGZpZWxkIGlzIHJlcXVpcmVkIGZvciBrZWVwaW5nIHRyYWNrIG9mIHRoZSBjYW5vbmljYWxcbiAqIG5hbWUgb2YgdGhlIHZhcmlhYmxlLCB3aGljaCBpcyB1c3VhbGx5IHRoZSBuYW1lIG9mIHRoZSBtb2RlbCB3ZWlnaHQgdGhhdFxuICogdGhlIHZhcmlhYmxlIGlzIHJlbGF0ZWQgdG8gcGx1cyBhIHN1ZmZpeCwgZS5nLiwgJ2RlbnNlMS9rZXJuZWwvbW9tZW50dW0nLlxuICogVGhlIG5hbWUgb2YgdGhlIGBWYXJpYWJsZWAgb2JqZWN0IGl0c2VsZiBjYW5ub3QgYmUgdXNlZCBkaXJlY3RseSBkdWUgdG9cbiAqIHBvc3NpYmxlIGRlZHVwbGljYXRpb246IEV2ZXJ5IGBWYXJpYWJsZWAgbXVzdCBoYXZlIGEgdW5pcXVlIG5hbWUgYnV0IG1vcmVcbiAqIHRoYW4gb25lIG9wdGltaXplciBvYmplY3RzIG9mIHRoZSBzYW1lIHR5cGUgbWF5IGJlIGNyZWF0ZWQgZm9yIHRoZSBzYW1lIG1vZGVsXG4gKiBvciB0aGUgc2FtZSBgVmFyaWFibGVgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE9wdGltaXplclZhcmlhYmxlIHtcbiAgb3JpZ2luYWxOYW1lOiBzdHJpbmc7XG4gIHZhcmlhYmxlOiBWYXJpYWJsZTtcbn1cblxuLyoqIEBkb2Mge2hlYWRpbmc6ICdUcmFpbmluZycsIHN1YmhlYWRpbmc6ICdDbGFzc2VzJywgbmFtZXNwYWNlOiAndHJhaW4nfSAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE9wdGltaXplciBleHRlbmRzIFNlcmlhbGl6YWJsZSB7XG4gIHByb3RlY3RlZCBpdGVyYXRpb25zXzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBFeGVjdXRlcyBgZigpYCBhbmQgbWluaW1pemVzIHRoZSBzY2FsYXIgb3V0cHV0IG9mIGBmKClgIGJ5IGNvbXB1dGluZ1xuICAgKiBncmFkaWVudHMgb2YgeSB3aXRoIHJlc3BlY3QgdG8gdGhlIGxpc3Qgb2YgdHJhaW5hYmxlIHZhcmlhYmxlcyBwcm92aWRlZCBieVxuICAgKiBgdmFyTGlzdGAuIElmIG5vIGxpc3QgaXMgcHJvdmlkZWQsIGl0IGRlZmF1bHRzIHRvIGFsbCB0cmFpbmFibGUgdmFyaWFibGVzLlxuICAgKlxuICAgKiBAcGFyYW0gZiBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSBhbmQgd2hvc2Ugb3V0cHV0IHRvIG1pbmltaXplLlxuICAgKiBAcGFyYW0gcmV0dXJuQ29zdCBXaGV0aGVyIHRvIHJldHVybiB0aGUgc2NhbGFyIGNvc3QgdmFsdWUgcHJvZHVjZWQgYnlcbiAgICogZXhlY3V0aW5nIGBmKClgLlxuICAgKiBAcGFyYW0gdmFyTGlzdCBBbiBvcHRpb25hbCBsaXN0IG9mIHZhcmlhYmxlcyB0byB1cGRhdGUuIElmIHNwZWNpZmllZCwgb25seVxuICAgKiB0aGUgdHJhaW5hYmxlIHZhcmlhYmxlcyBpbiB2YXJMaXN0IHdpbGwgYmUgdXBkYXRlZCBieSBtaW5pbWl6ZS4gRGVmYXVsdHMgdG9cbiAgICogYWxsIHRyYWluYWJsZSB2YXJpYWJsZXMuXG4gICAqXG4gICAqIEBkb2Mge2hlYWRpbmc6ICdUcmFpbmluZycsIHN1YmhlYWRpbmc6ICdPcHRpbWl6ZXJzJ31cbiAgICovXG4gIG1pbmltaXplKGY6ICgpID0+IFNjYWxhciwgcmV0dXJuQ29zdCA9IGZhbHNlLCB2YXJMaXN0PzogVmFyaWFibGVbXSk6IFNjYWxhclxuICAgICAgfG51bGwge1xuICAgIGNvbnN0IHt2YWx1ZSwgZ3JhZHN9ID0gdGhpcy5jb21wdXRlR3JhZGllbnRzKGYsIHZhckxpc3QpO1xuXG4gICAgaWYgKHZhckxpc3QgIT0gbnVsbCkge1xuICAgICAgY29uc3QgZ3JhZEFycmF5OiBOYW1lZFRlbnNvcltdID1cbiAgICAgICAgICB2YXJMaXN0Lm1hcCh2ID0+ICh7bmFtZTogdi5uYW1lLCB0ZW5zb3I6IGdyYWRzW3YubmFtZV19KSk7XG4gICAgICB0aGlzLmFwcGx5R3JhZGllbnRzKGdyYWRBcnJheSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXBwbHlHcmFkaWVudHMoZ3JhZHMpO1xuICAgIH1cblxuICAgIC8vIERpc3Bvc2UgZ3JhZGllbnRzLlxuICAgIGRpc3Bvc2UoZ3JhZHMpO1xuXG4gICAgaWYgKHJldHVybkNvc3QpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUuZGlzcG9zZSgpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgaXRlcmF0aW9ucyB0aGF0IHRoaXMgb3B0aW1pemVyIGluc3RhbmNlIGhhcyBiZWVuIGludm9rZWQgZm9yLlxuICAgKi9cbiAgZ2V0IGl0ZXJhdGlvbnMoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5pdGVyYXRpb25zXyA9PSBudWxsKSB7XG4gICAgICB0aGlzLml0ZXJhdGlvbnNfID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaXRlcmF0aW9uc187XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5jcmVtZW50SXRlcmF0aW9ucygpIHtcbiAgICB0aGlzLml0ZXJhdGlvbnNfID0gdGhpcy5pdGVyYXRpb25zICsgMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlcyBmKCkgYW5kIGNvbXB1dGVzIHRoZSBncmFkaWVudCBvZiB0aGUgc2NhbGFyIG91dHB1dCBvZiBmKCkgd2l0aFxuICAgKiByZXNwZWN0IHRvIHRoZSBsaXN0IG9mIHRyYWluYWJsZSB2YXJpYWJsZXMgcHJvdmlkZWQgYnkgYHZhckxpc3RgLiBJZiBub1xuICAgKiBsaXN0IGlzIHByb3ZpZGVkLCBpdCBkZWZhdWx0cyB0byBhbGwgdHJhaW5hYmxlIHZhcmlhYmxlcy5cbiAgICpcbiAgICogQHBhcmFtIGYgVGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgYW5kIHdob3NlIG91dHB1dCB0byB1c2UgZm9yIGNvbXB1dGluZ1xuICAgKiBncmFkaWVudHMgd2l0aCByZXNwZWN0IHRvIHZhcmlhYmxlcy5cbiAgICogQHBhcmFtIHZhckxpc3QgQW4gb3B0aW9uYWwgbGlzdCBvZiB2YXJpYWJsZXMgdG8gY29tcHV0ZSBncmFkaWVudHMgd2l0aFxuICAgKiByZXNwZWN0IHRvLiBJZiBzcGVjaWZpZWQsIG9ubHkgdGhlIHRyYWluYWJsZSB2YXJpYWJsZXMgaW4gdmFyTGlzdCB3aWxsIGhhdmVcbiAgICogZ3JhZGllbnRzIGNvbXB1dGVkIHdpdGggcmVzcGVjdCB0by4gRGVmYXVsdHMgdG8gYWxsIHRyYWluYWJsZSB2YXJpYWJsZXMuXG4gICAqXG4gICAqIEBkb2Mge2hlYWRpbmc6ICdUcmFpbmluZycsIHN1YmhlYWRpbmc6ICdPcHRpbWl6ZXJzJ31cbiAgICovXG4gIGNvbXB1dGVHcmFkaWVudHMoZjogKCkgPT4gU2NhbGFyLCB2YXJMaXN0PzogVmFyaWFibGVbXSk6XG4gICAgICB7dmFsdWU6IFNjYWxhciwgZ3JhZHM6IE5hbWVkVGVuc29yTWFwfSB7XG4gICAgcmV0dXJuIHZhcmlhYmxlR3JhZHMoZiwgdmFyTGlzdCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB2YXJpYWJsZXMgYnkgdXNpbmcgdGhlIGNvbXB1dGVkIGdyYWRpZW50cy5cbiAgICpcbiAgICogQHBhcmFtIHZhcmlhYmxlR3JhZGllbnRzIEEgbWFwcGluZyBvZiB2YXJpYWJsZSBuYW1lIHRvIGl0cyBncmFkaWVudCB2YWx1ZS5cbiAgICpcbiAgICogQGRvYyB7aGVhZGluZzogJ1RyYWluaW5nJywgc3ViaGVhZGluZzogJ09wdGltaXplcnMnfVxuICAgKi9cbiAgYWJzdHJhY3QgYXBwbHlHcmFkaWVudHModmFyaWFibGVHcmFkaWVudHM6IE5hbWVkVGVuc29yTWFwfFxuICAgICAgICAgICAgICAgICAgICAgICAgICBOYW1lZFRlbnNvcltdKTogdm9pZDtcblxuICAvKipcbiAgICogRGlzcG9zZSB0aGUgdmFyaWFibGVzIChpZiBhbnkpIG93bmVkIGJ5IHRoaXMgb3B0aW1pemVyIGluc3RhbmNlLlxuICAgKi9cbiAgZGlzcG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pdGVyYXRpb25zXyAhPSBudWxsKSB7XG4gICAgICBkaXNwb3NlKHRoaXMuaXRlcmF0aW9uc18pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHNhdmVJdGVyYXRpb25zKCk6IFByb21pc2U8TmFtZWRUZW5zb3I+IHtcbiAgICBpZiAodGhpcy5pdGVyYXRpb25zXyA9PSBudWxsKSB7XG4gICAgICB0aGlzLml0ZXJhdGlvbnNfID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdpdGVyJywgIC8vIE5hbWVkIGZvciBQeXRob24gY29tcGF0aWJpbGl0eS5cbiAgICAgIC8vIFRPRE8oY2Fpcyk6IFVzZSAnaW50NjQnIHR5cGUgd2hlbiBhdmFpbGFibGUuXG4gICAgICB0ZW5zb3I6IHNjYWxhcih0aGlzLml0ZXJhdGlvbnNfLCAnaW50MzInKVxuICAgIH07XG4gIH1cblxuICBhc3luYyBnZXRXZWlnaHRzKCk6IFByb21pc2U8TmFtZWRUZW5zb3JbXT4ge1xuICAgIHRocm93IG5ldyBFcnJvcignZ2V0V2VpZ2h0cygpIGlzIG5vdCBpbXBsZW1lbnRlZCBmb3IgdGhpcyBvcHRpbWl6ZXIgeWV0LicpO1xuICB9XG5cbiAgYXN5bmMgc2V0V2VpZ2h0cyh3ZWlnaHRWYWx1ZXM6IE5hbWVkVGVuc29yW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBzZXRXZWlnaHRzKCkgaXMgbm90IGltcGxlbWVudGVkIGZvciB0aGlzIG9wdGltaXplciBjbGFzcyBgICtcbiAgICAgICAgYCR7dGhpcy5nZXRDbGFzc05hbWUoKX1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IHRoZSBmaXJzdCBlbGVtZW50IG9mIHRoZSB3ZWlnaHQgdmFsdWVzIGFuZCBzZXQgaXRcbiAgICogYXMgdGhlIGl0ZXJhdGlvbnMgY291bnRlciB2YXJpYWJsZSBvZiB0aGlzIGluc3RhbmNlIG9mIG9wdGltaXplci5cbiAgICpcbiAgICogQHBhcmFtIHdlaWdodFZhbHVlc1xuICAgKiBAcmV0dXJucyBXZWlnaHQgdmFsdWVzIHdpdGggdGhlIGZpcnN0IGVsZW1lbnQgY29uc3VtZWQgYW5kIGV4Y2x1ZGVkLlxuICAgKi9cbiAgcHJvdGVjdGVkIGFzeW5jIGV4dHJhY3RJdGVyYXRpb25zKHdlaWdodFZhbHVlczogTmFtZWRUZW5zb3JbXSk6XG4gICAgICBQcm9taXNlPE5hbWVkVGVuc29yW10+IHtcbiAgICB0aGlzLml0ZXJhdGlvbnNfID0gKGF3YWl0IHdlaWdodFZhbHVlc1swXS50ZW5zb3IuZGF0YSgpKVswXTtcbiAgICByZXR1cm4gd2VpZ2h0VmFsdWVzLnNsaWNlKDEpO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShPcHRpbWl6ZXIsIFN5bWJvbC5oYXNJbnN0YW5jZSwge1xuICB2YWx1ZTogKGluc3RhbmNlOiBPcHRpbWl6ZXIpID0+IHtcbiAgICByZXR1cm4gaW5zdGFuY2UubWluaW1pemUgIT0gbnVsbCAmJiBpbnN0YW5jZS5jb21wdXRlR3JhZGllbnRzICE9IG51bGwgJiZcbiAgICAgICAgaW5zdGFuY2UuYXBwbHlHcmFkaWVudHMgIT0gbnVsbDtcbiAgfVxufSk7XG4iXX0=