import { STSServiceException as __BaseException } from "./STSServiceException";
export class ExpiredTokenException extends __BaseException {
    constructor(opts) {
        super({
            name: "ExpiredTokenException",
            $fault: "client",
            ...opts,
        });
        this.name = "ExpiredTokenException";
        this.$fault = "client";
        Object.setPrototypeOf(this, ExpiredTokenException.prototype);
    }
}
export class MalformedPolicyDocumentException extends __BaseException {
    constructor(opts) {
        super({
            name: "MalformedPolicyDocumentException",
            $fault: "client",
            ...opts,
        });
        this.name = "MalformedPolicyDocumentException";
        this.$fault = "client";
        Object.setPrototypeOf(this, MalformedPolicyDocumentException.prototype);
    }
}
export class PackedPolicyTooLargeException extends __BaseException {
    constructor(opts) {
        super({
            name: "PackedPolicyTooLargeException",
            $fault: "client",
            ...opts,
        });
        this.name = "PackedPolicyTooLargeException";
        this.$fault = "client";
        Object.setPrototypeOf(this, PackedPolicyTooLargeException.prototype);
    }
}
export class RegionDisabledException extends __BaseException {
    constructor(opts) {
        super({
            name: "RegionDisabledException",
            $fault: "client",
            ...opts,
        });
        this.name = "RegionDisabledException";
        this.$fault = "client";
        Object.setPrototypeOf(this, RegionDisabledException.prototype);
    }
}
export class IDPRejectedClaimException extends __BaseException {
    constructor(opts) {
        super({
            name: "IDPRejectedClaimException",
            $fault: "client",
            ...opts,
        });
        this.name = "IDPRejectedClaimException";
        this.$fault = "client";
        Object.setPrototypeOf(this, IDPRejectedClaimException.prototype);
    }
}
export class InvalidIdentityTokenException extends __BaseException {
    constructor(opts) {
        super({
            name: "InvalidIdentityTokenException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidIdentityTokenException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidIdentityTokenException.prototype);
    }
}
export class IDPCommunicationErrorException extends __BaseException {
    constructor(opts) {
        super({
            name: "IDPCommunicationErrorException",
            $fault: "client",
            ...opts,
        });
        this.name = "IDPCommunicationErrorException";
        this.$fault = "client";
        Object.setPrototypeOf(this, IDPCommunicationErrorException.prototype);
    }
}
export class InvalidAuthorizationMessageException extends __BaseException {
    constructor(opts) {
        super({
            name: "InvalidAuthorizationMessageException",
            $fault: "client",
            ...opts,
        });
        this.name = "InvalidAuthorizationMessageException";
        this.$fault = "client";
        Object.setPrototypeOf(this, InvalidAuthorizationMessageException.prototype);
    }
}
