import { AxiosRequestConfig } from 'axios';
import type { Logger } from 'pino';
import { proto } from '../../WAProto';
import { AuthenticationCreds, BaileysEventEmitter, SignalKeyStoreWithTransaction } from '../Types';
declare type ProcessMessageContext = {
    shouldProcessHistoryMsg: boolean;
    creds: AuthenticationCreds;
    keyStore: SignalKeyStoreWithTransaction;
    ev: BaileysEventEmitter;
    logger?: Logger;
    options: AxiosRequestConfig<any>;
};
/** Cleans a received message to further processing */
export declare const cleanMessage: (message: proto.IWebMessageInfo, meId: string) => void;
export declare const isRealMessage: (message: proto.IWebMessageInfo, meId: string) => boolean | undefined;
export declare const shouldIncrementChatUnread: (message: proto.IWebMessageInfo) => boolean;
declare const processMessage: (message: proto.IWebMessageInfo, { shouldProcessHistoryMsg, ev, creds, keyStore, logger, options }: ProcessMessageContext) => Promise<void>;
export default processMessage;
