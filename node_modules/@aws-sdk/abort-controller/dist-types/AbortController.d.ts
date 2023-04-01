import { AbortController as IAbortController } from "@aws-sdk/types";
import { AbortSignal } from "./AbortSignal";
/**
 * This implementation was added as Node.js didn't support AbortController prior to 15.x
 * Use native implementation in browsers or Node.js >=15.4.0.
 */
export declare class AbortController implements IAbortController {
    readonly signal: AbortSignal;
    abort(): void;
}
