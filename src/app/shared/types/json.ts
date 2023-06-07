import type { IDictionary } from './generic';

/**
 * JSONPrimitive are the permitted primitive values for JSON
 *
 * @public
 *
 * @example
 * ```ts
 * const jsonPrimitive: JSONPrimitive = 'string';
 * ```
 *
 */
type JSONPrimitive = string | number | boolean | null;

/**
 * Dictionary of JSONValue
 *
 * @public
 *
 * @example
 * ```ts
 * const jsonValue: DictionaryOfJSONValue = {
 *   key: 'value',
 * }
 * ```
 */
type JSONObject = IDictionary<JSONValue>;

/**
 * Array of JSONValue
 *
 * @public
 *
 * @example
 * ```ts
 * const jsonValue: JSONValue[] = [
 *  'value',
 * ]
 * ```
 */
type JSONArray = JSONValue[];

/**
 * Any JSON value permitted by JSON.parse
 *
 * @public
 *
 * @example
 * ```ts
 * const jsonValue: JSONValue = 'value';
 * ```
 */
type JSONValue = JSONPrimitive | JSONArray | JSONObject;

export type { JSONArray, JSONObject, JSONPrimitive, JSONValue };
