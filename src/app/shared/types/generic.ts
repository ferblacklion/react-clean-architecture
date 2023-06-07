/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Generic dictionary
 * @public
 *
 * @typeParam T - Type of value for all of the Dictionary items.
 *
 * @example
 * ```ts
 * const config: IDictionary<string> = {
 *  key: 'value',
 * }
 * ```
 */
interface IDictionary<T> {
  [k: string]: T;
}

type PlainObject<TValue = any> = IDictionary<TValue>;

/**
 * Convert a type with an optional key to a type with that key but required/defined
 * @public
 *
 * @typeParam T - Type with the optional fields
 * @typeParam K - Optional key to be casted to required
 *
 * @example
 * ```ts
 * type User = {
 *   id: string
 *   name?: string
 *   email?: string
 * }
 *
 * type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
 *
 * type UserWithName = WithRequired<User, 'name'>
 *
 * // error: missing name
 * const user: UserWithName = {
 *   id: '12345',
 * }
 * ```
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Convert a required key into a nullable key type
 *
 * @public
 *
 * @typeParam T - Type with the required key
 * @typeParam K - Optional key to be casted to null
 *
 * @example
 * ```ts
 * type User = {
 *   id: string
 *   name: string
 *   email: string
 * }
 *
 *
 * type UserWithNameNull = WithNullable<User, 'name'>
 *
 * // should not throw an error
 * const user: UserWithName = {
 *   name: null,
 *   id: '1',
 *   email: 'a@b.com'
 * }
 * ```
 */
export type WithNullable<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P] | null;
};

/**
 * Convert a custom key into a different key type
 *
 * @public
 *
 * @typeParam T - Type with the target key
 * @typeParam K - Key to be casted to type O
 * @typeParam O - New type of the key
 *
 * @example
 * ```ts
 * type User = {
 *   id: string
 *   name: string
 *   email: string
 * }
 *
 *
 * type UserWithNumberId = WithOverride<User, 'id', number>
 *
 * // should not throw an error
 * const user: UserWithNumberId = {
 *   name: 'John Smith',
 *   id: 1,
 *   email: 'a@b.com'
 * }
 * ```
 */
export type WithOverride<T, K extends keyof T, O> = Omit<T, K> & {
  [P in K]: O;
};

/**
 * Convert a required key in a type to optional
 * @public
 *
 * @typeParam T - Type with the optional fields
 * @typeParam K - Required key to be casted to optional
 *
 * @example
 * ```ts
 * type User = {
 *   id: string
 *   name: string
 *   email?: string
 * }
 *
 * // Safe, the name is now optional
 * const user: WithOptional<User, 'name'> = {
 *   id: '12345',
 * }
 * ```
 */
export type WithOptional<T, K extends keyof T> = Pick<Partial<T>, K> &
  Omit<T, K>;

/**
 * Dictionary of string values
 * @public
 *
 * @typeParam Keys - List of valid keys for the Dictionary.
 * @typeParam T - Type of value for all of the Dictionary items.
 *
 * @example
 * ```ts
 * type keyNames = 'key1' | 'key2'
 *
 * const config: DictionaryOfKeys<keyNames, string> = {
 *  key1: 'value',
 *  key2: 'value',
 * }
 *
 * config.key3 // throws error
 * ```
 */
type DictionaryOfKeys<Keys extends string, T> = {
  [K in Keys]: T | undefined;
};

/**
 * Has Id - Is used to check if an object has or extend an id property
 * @public
 *
 * @example
 * ```ts
 * function listToDictionaryById<T extends IHasId>(list: T[]): { [key: string]: T }
 * ```
 */
interface IHasId {
  id: string;
}

/**
 * Infer the first argument of a constructor
 * @public
 *
 * @typeParam C - The typeof-Object to infer the first argument from its constructor.
 *
 * @example
 * ```ts
 * let dateFirst: ConstructorArg<typeof Date>
 * // -> dateFirst: string | number | Date
 * ```
 */
type ConstructorArg<C> = C extends {
  new (arg: infer A, ...args: unknown[]): unknown;
}
  ? A
  : never;

/**
 * Convert a constant value to its respective type
 * @public
 *
 * @typeParam T - The value to get type from.
 *
 * @example
 * ```ts
 * const returns42 = <T,>(a: T) => a;
 * // const returns42: <42>(a: 42) => 42
 * returns42(42); // Type = 42 ;
 *
 * const returnsNumber = <T,>(a: ConstToPrimitive<T>) => a
 * // const returnsNumber: <42>(a: number) => number
 * returnsNumber(42) // Type = number
 * ```
 */
type ConstToPrimitive<T> = T extends number
  ? number
  : T extends string
  ? string
  : T extends boolean
  ? boolean
  : T;

/**
 * Define a value that can be null.
 * @public
 *
 * @typeParam T - Orinigal type of the value that eventually could be null.
 *
 * @example
 * ```ts
 * let x: Nullable<number> = null;
 * x = 0;
 * ```
 */
type Nullable<T> = T | null;

/**
 * Define a value that can be null as promise.
 * @public
 *
 * @typeParam T - Promise type that eventually could resolve to null.
 *
 * @example
 * ```ts
 * let x: PromNull<number> = Promise.resolve(null);
 * x = 0;
 * ```
 */
type PromNull<T> = Promise<Nullable<T>>;

/**
 * Define a value that can be undefined.
 * @public
 *
 * @typeParam T - Original type of a value that eventually could be undefined.
 *
 * @example
 * ```ts
 * let x: Optional<number> = undefined;
 * x = 0;
 * ```
 */
type Optional<T> = T | undefined;

/**
 * Define a type that can be partially filled, including nested levels
 * @public
 *
 * @typeParam T - Type from where extract partial key-value pairs including nested keys.
 *
 * @example
 * ```ts
 * let f: RecursivePartial<NestedObject> = {}
 * ```
 */
type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P] extends infer R ? R : never>;
};

/**
 * Define a type that can be partially filled, including nested levels
 * but excluding certain keys
 * @public
 *
 * @typeParam T - Type from where extract partial key-value pairs including nested keys.
 * @typeParam K - A subset of keys to exclude from T.
 *
 * @example
 * ```ts
 * let f: PartialExcept<NestedObject, "key1"> = {}
 * ```
 */
type PartialExcept<T, K extends keyof T> = RecursivePartial<T> & Pick<T, K>;

/**
 * Utility type for creating normalized custom keys depending on a dynamic value {@link V}
 * @public
 *
 * @typeParam prefix - String to be added at the beginning of the key.
 * @typeParam V - Root of the key.
 * @typeParam sufix - String to be added at the end of the key.
 *
 * @example
 * ```ts
 * type UseHooks<T extends string> = {[key in CustomKey<'use', T, 'Value'>]: string;};
 *
 * function createHook<T extends Readonly<string> & string>(options: {key: T}): UseHooks<T> {
 *  return `use${options.key.charAt(0).toUpperCase() + options.key.slice(1)}Value` as unknown as UseHooks<T>;
 * }
 *
 * const hooks = createHook({key: 'User'});
 * hooks.useUserValue // --> The hooks object will have dynamic properties based on key value
 * ```
 *
 */
type CustomKey<
  P extends string,
  V extends Capitalize<string>,
  T extends Capitalize<string>,
> = `${P}${V}${T}`;

/**
 * Given an input type that can be nullable, prevent the null type by providing a default value different from null.
 * @public
 *
 * @typeParam TValue - Type of value to be defaulted.
 * @typeParam TDefault - Could be the same as TValue, except null.
 *
 * @example
 * ```ts
 * function setDefaultValue<V, D extends V | undefined = undefined>(
 *  v?: Nullable<V>,
 *  d?: D,
 *): DefaultValue<V, D> {
 *  if (isDefined(v)) return v as DefaultValue<V, D>;
 *
 *  if (isDefined(d)) return d as DefaultValue<V, D>;
 *
 *  return null as DefaultValue<V, D>;
 *}
 *
 *const a = setDefaultValue('eder');
 *const b = setDefaultValue('', 'eder');
 *const c = setDefaultValue();
 * ```
 */
type DefaultValue<
  TValue,
  TDefault extends TValue | undefined = undefined,
> = TDefault extends undefined ? Nullable<TValue> : ConstToPrimitive<TDefault>;

/**
 * Declare a pure function without side effects receiving an array of parameters and return a result
 *
 * @public
 *
 * @typeParam TIn - An array of arguments to pass to this function
 * @typeParam TOut - The type of the response of this function
 *
 * @example
 * ```ts
 * const callback: IPureFunction<[string, string], string> = (hello, name) => `${hello} ${name}, how are you?`
 * ```
 */
type IPureFunction<TIn extends any[] = [], TOut = void> = (
  ...args: TIn
) => TOut;

/**
 * Declare a pure async function without side effects receiving an array of parameters and return a result
 *
 * @public
 *
 * @typeParam TIn - An array of arguments to pass to this function
 * @typeParam TOut - The type of the response of this function
 *
 * @example
 * ```ts
 * const callback: IPureAsyncFunction<[string, string], string> = (hello, name) => `${hello} ${name}, how are you?`
 * ```
 */
type IPureAsyncFunction<TIn extends any[] = [], TOut = void> = (
  ...args: TIn
) => Promise<TOut>;

/**
 * Utility type to ignore keys in the Draft type.
 *
 * @public
 */
type NoKeys = '';

/**
 * Utility type to create draft types, useful when converting incomplete/custom types
 * into standard types.
 *
 * @public
 *
 * @typeParam TIn - The target standard type with a proper structure.
 * @typeParam TOptionalKeys - Set keys from the input type as optional.
 * @typeParam TRequiredKeys - Set keys from the input type as required.
 * @typeParam TOmitKeys - Remove keys from the input type.
 *
 * @example
 * ```ts
 * type Document = {
 *   id: string;
 *   base64Content: string;
 *   file?: File;
 * };
 *
 * const a: Draft<Document, NoKeys, 'file', 'id'> = {
 *   file: new File(['ping'], 'ping.json'), // it becomes required
 *   base64Content: '', // it remains required
 *   // id is not needed anymore
 * };
 *
 * const b: Draft<Document, 'base64Content', NoKeys, 'id'> = {
 *   file: undefined, // it remains optional
 *   base64Content: undefined, // it becomes optional
 *   // id is not needed anymore
 * };
 *
 * const c: Draft<Document, 'base64Content', 'file', NoKeys> = {
 *   file: new File(['ping'], 'ping.json'), // it becomes required
 *   base64Content: undefined, // it becomes optional
 *   // id is not needed anymore
 * };
 *
 * const d: Draft<Document, 'id', 'file', 'base64Content'> = {
 *   file: new File(['ping'], 'ping.json'), // it becomes required
 *   id: undefined,
 * };
 * ```
 */
type Draft<
  TIn,
  TOptionalKeys extends keyof TIn | NoKeys,
  TRequiredKeys extends keyof Omit<TIn, TOptionalKeys> | NoKeys = NoKeys,
  TOmitKeys extends
    | keyof Omit<Omit<TIn, TOptionalKeys>, TRequiredKeys>
    | NoKeys = NoKeys,
> = TOptionalKeys extends keyof TIn
  ? Omit<
      TRequiredKeys extends keyof Omit<TIn, TOptionalKeys>
        ? WithRequired<WithOptional<TIn, TOptionalKeys>, TRequiredKeys>
        : WithOptional<TIn, TOptionalKeys>,
      TOmitKeys
    >
  : Omit<
      TRequiredKeys extends keyof TIn ? WithRequired<TIn, TRequiredKeys> : TIn,
      TOmitKeys
    >;

export type {
  ConstructorArg,
  ConstToPrimitive,
  CustomKey,
  DefaultValue,
  DictionaryOfKeys,
  Draft,
  IDictionary,
  IHasId,
  IPureAsyncFunction,
  IPureFunction,
  NoKeys,
  Nullable,
  Optional,
  PartialExcept,
  PlainObject,
  PromNull,
  RecursivePartial,
};
