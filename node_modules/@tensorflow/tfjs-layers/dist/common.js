/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
/**
 * Common functions for TensorFlow.js Layers.
 */
import { VALID_DATA_FORMAT_VALUES, VALID_INTERPOLATION_FORMAT_VALUES, VALID_PADDING_MODE_VALUES, VALID_POOL_MODE_VALUES } from './keras_format/common';
import { checkStringTypeUnionValue } from './utils/generic_utils';
// A map from the requested scoped name of a Tensor to the number of Tensors
// wanting that name so far.  This allows enforcing name uniqueness by appending
// an incrementing index, e.g. scope/name, scope/name_1, scope/name_2, etc.
const nameMap = new Map();
export function checkDataFormat(value) {
    checkStringTypeUnionValue(VALID_DATA_FORMAT_VALUES, 'DataFormat', value);
}
export function checkInterpolationFormat(value) {
    checkStringTypeUnionValue(VALID_INTERPOLATION_FORMAT_VALUES, 'InterpolationFormat', value);
}
export function checkPaddingMode(value) {
    checkStringTypeUnionValue(VALID_PADDING_MODE_VALUES, 'PaddingMode', value);
}
export function checkPoolMode(value) {
    checkStringTypeUnionValue(VALID_POOL_MODE_VALUES, 'PoolMode', value);
}
const _nameScopeStack = [];
const _nameScopeDivider = '/';
/**
 * Enter namescope, which can be nested.
 */
export function nameScope(name, fn) {
    _nameScopeStack.push(name);
    try {
        const val = fn();
        _nameScopeStack.pop();
        return val;
    }
    catch (e) {
        _nameScopeStack.pop();
        throw e;
    }
}
/**
 * Get the current namescope as a flat, concatenated string.
 */
function currentNameScopePrefix() {
    if (_nameScopeStack.length === 0) {
        return '';
    }
    else {
        return _nameScopeStack.join(_nameScopeDivider) + _nameScopeDivider;
    }
}
/**
 * Get the name a Tensor (or Variable) would have if not uniqueified.
 * @param tensorName
 * @return Scoped name string.
 */
export function getScopedTensorName(tensorName) {
    if (!isValidTensorName(tensorName)) {
        throw new Error('Not a valid tensor name: \'' + tensorName + '\'');
    }
    return currentNameScopePrefix() + tensorName;
}
/**
 * Get unique names for Tensors and Variables.
 * @param scopedName The fully-qualified name of the Tensor, i.e. as produced by
 *  `getScopedTensorName()`.
 * @return A unique version of the given fully scoped name.
 *   If this is the first time that the scoped name is seen in this session,
 *   then the given `scopedName` is returned unaltered.  If the same name is
 *   seen again (producing a collision), an incrementing suffix is added to the
 *   end of the name, so it takes the form 'scope/name_1', 'scope/name_2', etc.
 */
export function getUniqueTensorName(scopedName) {
    if (!isValidTensorName(scopedName)) {
        throw new Error('Not a valid tensor name: \'' + scopedName + '\'');
    }
    if (!nameMap.has(scopedName)) {
        nameMap.set(scopedName, 0);
    }
    const index = nameMap.get(scopedName);
    nameMap.set(scopedName, nameMap.get(scopedName) + 1);
    if (index > 0) {
        const result = `${scopedName}_${index}`;
        // Mark the composed name as used in case someone wants
        // to call getUniqueTensorName("name_1").
        nameMap.set(result, 1);
        return result;
    }
    else {
        return scopedName;
    }
}
const tensorNameRegex = new RegExp(/^[A-Za-z0-9][-A-Za-z0-9\._\/]*$/);
/**
 * Determine whether a string is a valid tensor name.
 * @param name
 * @returns A Boolean indicating whether `name` is a valid tensor name.
 */
export function isValidTensorName(name) {
    return !!name.match(tensorNameRegex);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGZqcy1sYXllcnMvc3JjL2NvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRztBQUVIOztHQUVHO0FBQ0gsT0FBTyxFQUFDLHdCQUF3QixFQUFFLGlDQUFpQyxFQUFFLHlCQUF5QixFQUFFLHNCQUFzQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDckosT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFaEUsNEVBQTRFO0FBQzVFLGdGQUFnRjtBQUNoRiwyRUFBMkU7QUFDM0UsTUFBTSxPQUFPLEdBQXdCLElBQUksR0FBRyxFQUFrQixDQUFDO0FBRS9ELE1BQU0sVUFBVSxlQUFlLENBQUMsS0FBYztJQUM1Qyx5QkFBeUIsQ0FBQyx3QkFBd0IsRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUVELE1BQU0sVUFBVSx3QkFBd0IsQ0FBQyxLQUFjO0lBQ3JELHlCQUF5QixDQUNyQixpQ0FBaUMsRUFBRSxxQkFBcUIsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN2RSxDQUFDO0FBRUQsTUFBTSxVQUFVLGdCQUFnQixDQUFDLEtBQWM7SUFDN0MseUJBQXlCLENBQUMseUJBQXlCLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzdFLENBQUM7QUFFRCxNQUFNLFVBQVUsYUFBYSxDQUFDLEtBQWM7SUFDMUMseUJBQXlCLENBQUMsc0JBQXNCLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3ZFLENBQUM7QUFFRCxNQUFNLGVBQWUsR0FBYSxFQUFFLENBQUM7QUFDckMsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUM7QUFFOUI7O0dBRUc7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUFJLElBQVksRUFBRSxFQUFXO0lBQ3BELGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsSUFBSTtRQUNGLE1BQU0sR0FBRyxHQUFNLEVBQUUsRUFBRSxDQUFDO1FBQ3BCLGVBQWUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN0QixPQUFPLEdBQUcsQ0FBQztLQUNaO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixlQUFlLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdEIsTUFBTSxDQUFDLENBQUM7S0FDVDtBQUNILENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsc0JBQXNCO0lBQzdCLElBQUksZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDaEMsT0FBTyxFQUFFLENBQUM7S0FDWDtTQUFNO1FBQ0wsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsaUJBQWlCLENBQUM7S0FDcEU7QUFDSCxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxtQkFBbUIsQ0FBQyxVQUFrQjtJQUNwRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUM7S0FDcEU7SUFDRCxPQUFPLHNCQUFzQixFQUFFLEdBQUcsVUFBVSxDQUFDO0FBQy9DLENBQUM7QUFFRDs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFNLFVBQVUsbUJBQW1CLENBQUMsVUFBa0I7SUFDcEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ2xDLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLEdBQUcsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDO0tBQ3BFO0lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDNUI7SUFDRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFckQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1FBQ2IsTUFBTSxNQUFNLEdBQUcsR0FBRyxVQUFVLElBQUksS0FBSyxFQUFFLENBQUM7UUFDeEMsdURBQXVEO1FBQ3ZELHlDQUF5QztRQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2QixPQUFPLE1BQU0sQ0FBQztLQUNmO1NBQU07UUFDTCxPQUFPLFVBQVUsQ0FBQztLQUNuQjtBQUNILENBQUM7QUFFRCxNQUFNLGVBQWUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBRXRFOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsSUFBWTtJQUM1QyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3ZDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gKiBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAqIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG4vKipcbiAqIENvbW1vbiBmdW5jdGlvbnMgZm9yIFRlbnNvckZsb3cuanMgTGF5ZXJzLlxuICovXG5pbXBvcnQge1ZBTElEX0RBVEFfRk9STUFUX1ZBTFVFUywgVkFMSURfSU5URVJQT0xBVElPTl9GT1JNQVRfVkFMVUVTLCBWQUxJRF9QQURESU5HX01PREVfVkFMVUVTLCBWQUxJRF9QT09MX01PREVfVkFMVUVTfSBmcm9tICcuL2tlcmFzX2Zvcm1hdC9jb21tb24nO1xuaW1wb3J0IHtjaGVja1N0cmluZ1R5cGVVbmlvblZhbHVlfSBmcm9tICcuL3V0aWxzL2dlbmVyaWNfdXRpbHMnO1xuXG4vLyBBIG1hcCBmcm9tIHRoZSByZXF1ZXN0ZWQgc2NvcGVkIG5hbWUgb2YgYSBUZW5zb3IgdG8gdGhlIG51bWJlciBvZiBUZW5zb3JzXG4vLyB3YW50aW5nIHRoYXQgbmFtZSBzbyBmYXIuICBUaGlzIGFsbG93cyBlbmZvcmNpbmcgbmFtZSB1bmlxdWVuZXNzIGJ5IGFwcGVuZGluZ1xuLy8gYW4gaW5jcmVtZW50aW5nIGluZGV4LCBlLmcuIHNjb3BlL25hbWUsIHNjb3BlL25hbWVfMSwgc2NvcGUvbmFtZV8yLCBldGMuXG5jb25zdCBuYW1lTWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrRGF0YUZvcm1hdCh2YWx1ZT86IHN0cmluZyk6IHZvaWQge1xuICBjaGVja1N0cmluZ1R5cGVVbmlvblZhbHVlKFZBTElEX0RBVEFfRk9STUFUX1ZBTFVFUywgJ0RhdGFGb3JtYXQnLCB2YWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0ludGVycG9sYXRpb25Gb3JtYXQodmFsdWU/OiBzdHJpbmcpOiB2b2lkIHtcbiAgY2hlY2tTdHJpbmdUeXBlVW5pb25WYWx1ZShcbiAgICAgIFZBTElEX0lOVEVSUE9MQVRJT05fRk9STUFUX1ZBTFVFUywgJ0ludGVycG9sYXRpb25Gb3JtYXQnLCB2YWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1BhZGRpbmdNb2RlKHZhbHVlPzogc3RyaW5nKTogdm9pZCB7XG4gIGNoZWNrU3RyaW5nVHlwZVVuaW9uVmFsdWUoVkFMSURfUEFERElOR19NT0RFX1ZBTFVFUywgJ1BhZGRpbmdNb2RlJywgdmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tQb29sTW9kZSh2YWx1ZT86IHN0cmluZyk6IHZvaWQge1xuICBjaGVja1N0cmluZ1R5cGVVbmlvblZhbHVlKFZBTElEX1BPT0xfTU9ERV9WQUxVRVMsICdQb29sTW9kZScsIHZhbHVlKTtcbn1cblxuY29uc3QgX25hbWVTY29wZVN0YWNrOiBzdHJpbmdbXSA9IFtdO1xuY29uc3QgX25hbWVTY29wZURpdmlkZXIgPSAnLyc7XG5cbi8qKlxuICogRW50ZXIgbmFtZXNjb3BlLCB3aGljaCBjYW4gYmUgbmVzdGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbmFtZVNjb3BlPFQ+KG5hbWU6IHN0cmluZywgZm46ICgpID0+IFQpOiBUIHtcbiAgX25hbWVTY29wZVN0YWNrLnB1c2gobmFtZSk7XG4gIHRyeSB7XG4gICAgY29uc3QgdmFsOiBUID0gZm4oKTtcbiAgICBfbmFtZVNjb3BlU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHZhbDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIF9uYW1lU2NvcGVTdGFjay5wb3AoKTtcbiAgICB0aHJvdyBlO1xuICB9XG59XG5cbi8qKlxuICogR2V0IHRoZSBjdXJyZW50IG5hbWVzY29wZSBhcyBhIGZsYXQsIGNvbmNhdGVuYXRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGN1cnJlbnROYW1lU2NvcGVQcmVmaXgoKTogc3RyaW5nIHtcbiAgaWYgKF9uYW1lU2NvcGVTdGFjay5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gJyc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF9uYW1lU2NvcGVTdGFjay5qb2luKF9uYW1lU2NvcGVEaXZpZGVyKSArIF9uYW1lU2NvcGVEaXZpZGVyO1xuICB9XG59XG5cbi8qKlxuICogR2V0IHRoZSBuYW1lIGEgVGVuc29yIChvciBWYXJpYWJsZSkgd291bGQgaGF2ZSBpZiBub3QgdW5pcXVlaWZpZWQuXG4gKiBAcGFyYW0gdGVuc29yTmFtZVxuICogQHJldHVybiBTY29wZWQgbmFtZSBzdHJpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTY29wZWRUZW5zb3JOYW1lKHRlbnNvck5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmICghaXNWYWxpZFRlbnNvck5hbWUodGVuc29yTmFtZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhIHZhbGlkIHRlbnNvciBuYW1lOiBcXCcnICsgdGVuc29yTmFtZSArICdcXCcnKTtcbiAgfVxuICByZXR1cm4gY3VycmVudE5hbWVTY29wZVByZWZpeCgpICsgdGVuc29yTmFtZTtcbn1cblxuLyoqXG4gKiBHZXQgdW5pcXVlIG5hbWVzIGZvciBUZW5zb3JzIGFuZCBWYXJpYWJsZXMuXG4gKiBAcGFyYW0gc2NvcGVkTmFtZSBUaGUgZnVsbHktcXVhbGlmaWVkIG5hbWUgb2YgdGhlIFRlbnNvciwgaS5lLiBhcyBwcm9kdWNlZCBieVxuICogIGBnZXRTY29wZWRUZW5zb3JOYW1lKClgLlxuICogQHJldHVybiBBIHVuaXF1ZSB2ZXJzaW9uIG9mIHRoZSBnaXZlbiBmdWxseSBzY29wZWQgbmFtZS5cbiAqICAgSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZSB0aGF0IHRoZSBzY29wZWQgbmFtZSBpcyBzZWVuIGluIHRoaXMgc2Vzc2lvbixcbiAqICAgdGhlbiB0aGUgZ2l2ZW4gYHNjb3BlZE5hbWVgIGlzIHJldHVybmVkIHVuYWx0ZXJlZC4gIElmIHRoZSBzYW1lIG5hbWUgaXNcbiAqICAgc2VlbiBhZ2FpbiAocHJvZHVjaW5nIGEgY29sbGlzaW9uKSwgYW4gaW5jcmVtZW50aW5nIHN1ZmZpeCBpcyBhZGRlZCB0byB0aGVcbiAqICAgZW5kIG9mIHRoZSBuYW1lLCBzbyBpdCB0YWtlcyB0aGUgZm9ybSAnc2NvcGUvbmFtZV8xJywgJ3Njb3BlL25hbWVfMicsIGV0Yy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFVuaXF1ZVRlbnNvck5hbWUoc2NvcGVkTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKCFpc1ZhbGlkVGVuc29yTmFtZShzY29wZWROYW1lKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQgdGVuc29yIG5hbWU6IFxcJycgKyBzY29wZWROYW1lICsgJ1xcJycpO1xuICB9XG4gIGlmICghbmFtZU1hcC5oYXMoc2NvcGVkTmFtZSkpIHtcbiAgICBuYW1lTWFwLnNldChzY29wZWROYW1lLCAwKTtcbiAgfVxuICBjb25zdCBpbmRleCA9IG5hbWVNYXAuZ2V0KHNjb3BlZE5hbWUpO1xuICBuYW1lTWFwLnNldChzY29wZWROYW1lLCBuYW1lTWFwLmdldChzY29wZWROYW1lKSArIDEpO1xuXG4gIGlmIChpbmRleCA+IDApIHtcbiAgICBjb25zdCByZXN1bHQgPSBgJHtzY29wZWROYW1lfV8ke2luZGV4fWA7XG4gICAgLy8gTWFyayB0aGUgY29tcG9zZWQgbmFtZSBhcyB1c2VkIGluIGNhc2Ugc29tZW9uZSB3YW50c1xuICAgIC8vIHRvIGNhbGwgZ2V0VW5pcXVlVGVuc29yTmFtZShcIm5hbWVfMVwiKS5cbiAgICBuYW1lTWFwLnNldChyZXN1bHQsIDEpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHNjb3BlZE5hbWU7XG4gIH1cbn1cblxuY29uc3QgdGVuc29yTmFtZVJlZ2V4ID0gbmV3IFJlZ0V4cCgvXltBLVphLXowLTldWy1BLVphLXowLTlcXC5fXFwvXSokLyk7XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgYSBzdHJpbmcgaXMgYSB2YWxpZCB0ZW5zb3IgbmFtZS5cbiAqIEBwYXJhbSBuYW1lXG4gKiBAcmV0dXJucyBBIEJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIGBuYW1lYCBpcyBhIHZhbGlkIHRlbnNvciBuYW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZFRlbnNvck5hbWUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAhIW5hbWUubWF0Y2godGVuc29yTmFtZVJlZ2V4KTtcbn1cbiJdfQ==