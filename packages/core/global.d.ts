/**
 * Development flag.
 */
declare const __DEV__: boolean;

declare type Dictionary<T> = T & {
    [key: string]: any;
};
