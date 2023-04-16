/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 * =============================================================================
 */
/* Original Source layers/__init__.py */
import { serialization } from '@tensorflow/tfjs-core';
import { deserializeKerasObject } from '../utils/generic_utils';
/**
 * Instantiate a layer from a config dictionary.
 * @param config dict of the form {class_name: str, config: dict}
 * @param customObjects dict mapping class names (or function names)
 *   of custom (non-Keras) objects to class/functions
 * @param fastWeightInit Optional flag to use fast weight initialization
 *   during deserialization. This is applicable to cases in which
 *   the initialization will be immediately overwritten by loaded weight
 *   values. Default: `false`.
 * @returns Layer instance (may be LayersModel, Sequential, Layer...)
 */
export function deserialize(config, customObjects = {}, fastWeightInit = false) {
    return deserializeKerasObject(config, serialization.SerializationMap.getMap().classNameMap, customObjects, 'layer', fastWeightInit);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXphdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtbGF5ZXJzL3NyYy9sYXllcnMvc2VyaWFsaXphdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRztBQUVILHdDQUF3QztBQUN4QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFcEQsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFOUQ7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQU0sVUFBVSxXQUFXLENBQ3ZCLE1BQWdDLEVBQ2hDLGdCQUFnQixFQUE4QixFQUM5QyxjQUFjLEdBQUcsS0FBSztJQUN4QixPQUFPLHNCQUFzQixDQUN6QixNQUFNLEVBQUUsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLFlBQVksRUFDNUQsYUFBYSxFQUFFLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztBQUM5QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICogbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuLyogT3JpZ2luYWwgU291cmNlIGxheWVycy9fX2luaXRfXy5weSAqL1xuaW1wb3J0IHtzZXJpYWxpemF0aW9ufSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuXG5pbXBvcnQge2Rlc2VyaWFsaXplS2VyYXNPYmplY3R9IGZyb20gJy4uL3V0aWxzL2dlbmVyaWNfdXRpbHMnO1xuXG4vKipcbiAqIEluc3RhbnRpYXRlIGEgbGF5ZXIgZnJvbSBhIGNvbmZpZyBkaWN0aW9uYXJ5LlxuICogQHBhcmFtIGNvbmZpZyBkaWN0IG9mIHRoZSBmb3JtIHtjbGFzc19uYW1lOiBzdHIsIGNvbmZpZzogZGljdH1cbiAqIEBwYXJhbSBjdXN0b21PYmplY3RzIGRpY3QgbWFwcGluZyBjbGFzcyBuYW1lcyAob3IgZnVuY3Rpb24gbmFtZXMpXG4gKiAgIG9mIGN1c3RvbSAobm9uLUtlcmFzKSBvYmplY3RzIHRvIGNsYXNzL2Z1bmN0aW9uc1xuICogQHBhcmFtIGZhc3RXZWlnaHRJbml0IE9wdGlvbmFsIGZsYWcgdG8gdXNlIGZhc3Qgd2VpZ2h0IGluaXRpYWxpemF0aW9uXG4gKiAgIGR1cmluZyBkZXNlcmlhbGl6YXRpb24uIFRoaXMgaXMgYXBwbGljYWJsZSB0byBjYXNlcyBpbiB3aGljaFxuICogICB0aGUgaW5pdGlhbGl6YXRpb24gd2lsbCBiZSBpbW1lZGlhdGVseSBvdmVyd3JpdHRlbiBieSBsb2FkZWQgd2VpZ2h0XG4gKiAgIHZhbHVlcy4gRGVmYXVsdDogYGZhbHNlYC5cbiAqIEByZXR1cm5zIExheWVyIGluc3RhbmNlIChtYXkgYmUgTGF5ZXJzTW9kZWwsIFNlcXVlbnRpYWwsIExheWVyLi4uKVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVzZXJpYWxpemUoXG4gICAgY29uZmlnOiBzZXJpYWxpemF0aW9uLkNvbmZpZ0RpY3QsXG4gICAgY3VzdG9tT2JqZWN0cyA9IHt9IGFzIHNlcmlhbGl6YXRpb24uQ29uZmlnRGljdCxcbiAgICBmYXN0V2VpZ2h0SW5pdCA9IGZhbHNlKTogc2VyaWFsaXphdGlvbi5TZXJpYWxpemFibGUge1xuICByZXR1cm4gZGVzZXJpYWxpemVLZXJhc09iamVjdChcbiAgICAgIGNvbmZpZywgc2VyaWFsaXphdGlvbi5TZXJpYWxpemF0aW9uTWFwLmdldE1hcCgpLmNsYXNzTmFtZU1hcCxcbiAgICAgIGN1c3RvbU9iamVjdHMsICdsYXllcicsIGZhc3RXZWlnaHRJbml0KTtcbn1cbiJdfQ==