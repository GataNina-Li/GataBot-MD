/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
export class MultinomialProgram {
    constructor(batchSize, numOutcomes, numSamples) {
        this.variableNames = ['probs'];
        this.customUniforms = [{ name: 'seed', type: 'float' }];
        this.outputShape = [batchSize, numSamples];
        this.userCode = `
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];

        float r = random(seed);
        float cdf = 0.0;

        for (int i = 0; i < ${numOutcomes - 1}; i++) {
          cdf += getProbs(batch, i);

          if (r < cdf) {
            setOutput(float(i));
            return;
          }
        }

        // If no other event happened, last event happened.
        setOutput(float(${numOutcomes - 1}));
      }
    `;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlub21pYWxfZ3B1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1iYWNrZW5kLXdlYmdsL3NyYy9tdWx0aW5vbWlhbF9ncHUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBS0gsTUFBTSxPQUFPLGtCQUFrQjtJQU03QixZQUFZLFNBQWlCLEVBQUUsV0FBbUIsRUFBRSxVQUFrQjtRQUx0RSxrQkFBYSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFHMUIsbUJBQWMsR0FBRyxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBc0IsRUFBQyxDQUFDLENBQUM7UUFHOUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsUUFBUSxHQUFHOzs7Ozs7Ozs4QkFRVSxXQUFXLEdBQUcsQ0FBQzs7Ozs7Ozs7OzswQkFVbkIsV0FBVyxHQUFHLENBQUM7O0tBRXBDLENBQUM7SUFDSixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7R1BHUFVQcm9ncmFtfSBmcm9tICcuL2dwZ3B1X21hdGgnO1xuaW1wb3J0IHtVbmlmb3JtVHlwZX0gZnJvbSAnLi9zaGFkZXJfY29tcGlsZXInO1xuXG5leHBvcnQgY2xhc3MgTXVsdGlub21pYWxQcm9ncmFtIGltcGxlbWVudHMgR1BHUFVQcm9ncmFtIHtcbiAgdmFyaWFibGVOYW1lcyA9IFsncHJvYnMnXTtcbiAgb3V0cHV0U2hhcGU6IG51bWJlcltdO1xuICB1c2VyQ29kZTogc3RyaW5nO1xuICBjdXN0b21Vbmlmb3JtcyA9IFt7bmFtZTogJ3NlZWQnLCB0eXBlOiAnZmxvYXQnIGFzIFVuaWZvcm1UeXBlfV07XG5cbiAgY29uc3RydWN0b3IoYmF0Y2hTaXplOiBudW1iZXIsIG51bU91dGNvbWVzOiBudW1iZXIsIG51bVNhbXBsZXM6IG51bWJlcikge1xuICAgIHRoaXMub3V0cHV0U2hhcGUgPSBbYmF0Y2hTaXplLCBudW1TYW1wbGVzXTtcblxuICAgIHRoaXMudXNlckNvZGUgPSBgXG4gICAgICB2b2lkIG1haW4oKSB7XG4gICAgICAgIGl2ZWMyIGNvb3JkcyA9IGdldE91dHB1dENvb3JkcygpO1xuICAgICAgICBpbnQgYmF0Y2ggPSBjb29yZHNbMF07XG5cbiAgICAgICAgZmxvYXQgciA9IHJhbmRvbShzZWVkKTtcbiAgICAgICAgZmxvYXQgY2RmID0gMC4wO1xuXG4gICAgICAgIGZvciAoaW50IGkgPSAwOyBpIDwgJHtudW1PdXRjb21lcyAtIDF9OyBpKyspIHtcbiAgICAgICAgICBjZGYgKz0gZ2V0UHJvYnMoYmF0Y2gsIGkpO1xuXG4gICAgICAgICAgaWYgKHIgPCBjZGYpIHtcbiAgICAgICAgICAgIHNldE91dHB1dChmbG9hdChpKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgbm8gb3RoZXIgZXZlbnQgaGFwcGVuZWQsIGxhc3QgZXZlbnQgaGFwcGVuZWQuXG4gICAgICAgIHNldE91dHB1dChmbG9hdCgke251bU91dGNvbWVzIC0gMX0pKTtcbiAgICAgIH1cbiAgICBgO1xuICB9XG59XG4iXX0=