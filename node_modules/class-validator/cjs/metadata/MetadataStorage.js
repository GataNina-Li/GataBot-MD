"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadataStorage = exports.MetadataStorage = void 0;
const ValidationSchemaToMetadataTransformer_1 = require("../validation-schema/ValidationSchemaToMetadataTransformer");
const utils_1 = require("../utils");
/**
 * Storage all metadatas.
 */
class MetadataStorage {
    constructor() {
        // -------------------------------------------------------------------------
        // Private properties
        // -------------------------------------------------------------------------
        this.validationMetadatas = [];
        this.constraintMetadatas = [];
    }
    get hasValidationMetaData() {
        return !!this.validationMetadatas.length;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Adds a new validation metadata.
     */
    addValidationSchema(schema) {
        const validationMetadatas = new ValidationSchemaToMetadataTransformer_1.ValidationSchemaToMetadataTransformer().transform(schema);
        validationMetadatas.forEach(validationMetadata => this.addValidationMetadata(validationMetadata));
    }
    /**
     * Adds a new validation metadata.
     */
    addValidationMetadata(metadata) {
        this.validationMetadatas.push(metadata);
    }
    /**
     * Adds a new constraint metadata.
     */
    addConstraintMetadata(metadata) {
        this.constraintMetadatas.push(metadata);
    }
    /**
     * Groups metadata by their property names.
     */
    groupByPropertyName(metadata) {
        const grouped = {};
        metadata.forEach(metadata => {
            if (!grouped[metadata.propertyName])
                grouped[metadata.propertyName] = [];
            grouped[metadata.propertyName].push(metadata);
        });
        return grouped;
    }
    /**
     * Gets all validation metadatas for the given object with the given groups.
     */
    getTargetValidationMetadatas(targetConstructor, targetSchema, always, strictGroups, groups) {
        const includeMetadataBecauseOfAlwaysOption = (metadata) => {
            // `metadata.always` overrides global default.
            if (typeof metadata.always !== 'undefined')
                return metadata.always;
            // `metadata.groups` overrides global default.
            if (metadata.groups && metadata.groups.length)
                return false;
            // Use global default.
            return always;
        };
        const excludeMetadataBecauseOfStrictGroupsOption = (metadata) => {
            if (strictGroups) {
                // Validation is not using groups.
                if (!groups || !groups.length) {
                    // `metadata.groups` has at least one group.
                    if (metadata.groups && metadata.groups.length)
                        return true;
                }
            }
            return false;
        };
        // get directly related to a target metadatas
        const originalMetadatas = this.validationMetadatas.filter(metadata => {
            if (metadata.target !== targetConstructor && metadata.target !== targetSchema)
                return false;
            if (includeMetadataBecauseOfAlwaysOption(metadata))
                return true;
            if (excludeMetadataBecauseOfStrictGroupsOption(metadata))
                return false;
            if (groups && groups.length > 0)
                return metadata.groups && !!metadata.groups.find(group => groups.indexOf(group) !== -1);
            return true;
        });
        // get metadatas for inherited classes
        const inheritedMetadatas = this.validationMetadatas.filter(metadata => {
            // if target is a string it's means we validate against a schema, and there is no inheritance support for schemas
            if (typeof metadata.target === 'string')
                return false;
            if (metadata.target === targetConstructor)
                return false;
            if (metadata.target instanceof Function && !(targetConstructor.prototype instanceof metadata.target))
                return false;
            if (includeMetadataBecauseOfAlwaysOption(metadata))
                return true;
            if (excludeMetadataBecauseOfStrictGroupsOption(metadata))
                return false;
            if (groups && groups.length > 0)
                return metadata.groups && !!metadata.groups.find(group => groups.indexOf(group) !== -1);
            return true;
        });
        // filter out duplicate metadatas, prefer original metadatas instead of inherited metadatas
        const uniqueInheritedMetadatas = inheritedMetadatas.filter(inheritedMetadata => {
            return !originalMetadatas.find(originalMetadata => {
                return (originalMetadata.propertyName === inheritedMetadata.propertyName &&
                    originalMetadata.type === inheritedMetadata.type);
            });
        });
        return originalMetadatas.concat(uniqueInheritedMetadatas);
    }
    /**
     * Gets all validator constraints for the given object.
     */
    getTargetValidatorConstraints(target) {
        return this.constraintMetadatas.filter(metadata => metadata.target === target);
    }
}
exports.MetadataStorage = MetadataStorage;
/**
 * Gets metadata storage.
 * Metadata storage follows the best practices and stores metadata in a global variable.
 */
function getMetadataStorage() {
    const global = (0, utils_1.getGlobal)();
    if (!global.classValidatorMetadataStorage) {
        global.classValidatorMetadataStorage = new MetadataStorage();
    }
    return global.classValidatorMetadataStorage;
}
exports.getMetadataStorage = getMetadataStorage;
//# sourceMappingURL=MetadataStorage.js.map