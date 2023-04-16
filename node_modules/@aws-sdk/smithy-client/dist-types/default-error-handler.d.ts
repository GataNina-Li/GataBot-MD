/**
 * Always throws an error with the given `exceptionCtor` and other arguments.
 * This is only called from an error handling code path.
 *
 * @internal
 */
export declare const throwDefaultError: ({ output, parsedBody, exceptionCtor, errorCode }: any) => never;
