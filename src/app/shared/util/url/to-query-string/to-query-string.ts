import { IDictionary } from "../../../types/generic";

/**
 * Stringify an object into a query string
 * @public
 *
 * @param obj - Object to stringify
 *
 * @returns query string
 *
 * @example
 * ```ts
 * const result = toQueryString({a: 'a', b: 'b'});
 * console.log(result);
 * // -> a=a&b=b
 * ```
 */
function toQueryString(
  obj: IDictionary<string | string[] | undefined>
): string {
  const parse = (list: string[]) => list.filter(Boolean).join("&");

  return parse(
    Object.entries(obj)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) =>
        parse(
          ([] as string[])
            .concat(value as string)
            .map(
              (val) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
            )
        )
      )
  );
}

export { toQueryString };
