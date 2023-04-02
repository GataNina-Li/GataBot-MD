"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetcherClient = void 0;
const axios_1 = __importDefault(require("axios"));
const fetcherClient = (prefixUrl, options) => axios_1.default.create({
    baseURL: prefixUrl,
    ...options,
});
exports.fetcherClient = fetcherClient;
