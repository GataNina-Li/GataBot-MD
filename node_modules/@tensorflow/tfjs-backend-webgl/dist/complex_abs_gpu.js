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
export class ComplexAbsProgram {
    constructor(shape) {
        this.variableNames = ['real', 'imag'];
        this.outputShape = shape;
        this.userCode = `
      void main() {
        float re = abs(getRealAtOutCoords());
        float im = abs(getImagAtOutCoords());
        float mx = max(re, im);

        // sadly the length function in glsl is not underflow-safe
        // (at least not on Intel GPUs). So the safe solution is
        // to ensure underflow-safety in all cases.
        setOutput(
          mx == 0.0 ? 0.0 : mx * length(vec2(1, min(re, im)/mx))
        );
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxleF9hYnNfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9jb21wbGV4X2Fic19ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBSUgsTUFBTSxPQUFPLGlCQUFpQjtJQUs1QixZQUFZLEtBQWU7UUFKM0Isa0JBQWEsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUsvQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHOzs7Ozs7Ozs7Ozs7O0tBYWYsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtHUEdQVVByb2dyYW19IGZyb20gJy4vZ3BncHVfbWF0aCc7XG5cbmV4cG9ydCBjbGFzcyBDb21wbGV4QWJzUHJvZ3JhbSBpbXBsZW1lbnRzIEdQR1BVUHJvZ3JhbSB7XG4gIHZhcmlhYmxlTmFtZXMgPSBbJ3JlYWwnLCAnaW1hZyddO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuICBvdXRwdXRTaGFwZTogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3Ioc2hhcGU6IG51bWJlcltdKSB7XG4gICAgdGhpcy5vdXRwdXRTaGFwZSA9IHNoYXBlO1xuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGZsb2F0IHJlID0gYWJzKGdldFJlYWxBdE91dENvb3JkcygpKTtcbiAgICAgICAgZmxvYXQgaW0gPSBhYnMoZ2V0SW1hZ0F0T3V0Q29vcmRzKCkpO1xuICAgICAgICBmbG9hdCBteCA9IG1heChyZSwgaW0pO1xuXG4gICAgICAgIC8vIHNhZGx5IHRoZSBsZW5ndGggZnVuY3Rpb24gaW4gZ2xzbCBpcyBub3QgdW5kZXJmbG93LXNhZmVcbiAgICAgICAgLy8gKGF0IGxlYXN0IG5vdCBvbiBJbnRlbCBHUFVzKS4gU28gdGhlIHNhZmUgc29sdXRpb24gaXNcbiAgICAgICAgLy8gdG8gZW5zdXJlIHVuZGVyZmxvdy1zYWZldHkgaW4gYWxsIGNhc2VzLlxuICAgICAgICBzZXRPdXRwdXQoXG4gICAgICAgICAgbXggPT0gMC4wID8gMC4wIDogbXggKiBsZW5ndGgodmVjMigxLCBtaW4ocmUsIGltKS9teCkpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgYDtcbiAgfVxufVxuIl19