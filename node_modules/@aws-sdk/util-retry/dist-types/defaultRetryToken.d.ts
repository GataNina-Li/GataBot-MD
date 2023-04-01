import { StandardRetryBackoffStrategy, StandardRetryToken } from "@aws-sdk/types";
/**
 * @internal
 */
export interface DefaultRetryTokenOptions {
    /**
     * The total amount of retry tokens to be decremented from retry token balance.
     */
    retryCost?: number;
    /**
     * The total amount of retry tokens to be decremented from retry token balance
     * when a throttling error is encountered.
     */
    timeoutRetryCost?: number;
    /**
     *
     */
    retryBackoffStrategy?: StandardRetryBackoffStrategy;
}
/**
 * @internal
 */
export declare const getDefaultRetryToken: (initialRetryTokens: number, initialRetryDelay: number, initialRetryCount?: number, options?: DefaultRetryTokenOptions) => StandardRetryToken;
