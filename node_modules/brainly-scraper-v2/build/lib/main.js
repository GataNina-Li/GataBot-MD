"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brainly = void 0;
const piscina_1 = __importDefault(require("piscina"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const fetcher_1 = require("./fetcher");
const cache_1 = require("./cache");
class Brainly {
    country;
    enabledCache;
    worker = new piscina_1.default({
        filename: path_1.default.resolve(__dirname, 'worker.js'),
    });
    cache;
    constructor(country = 'id', enabledCache = true) {
        this.country = country;
        this.enabledCache = enabledCache;
        if (!Brainly.isValidLanguage(country)) {
            throw new TypeError('Please put valid country!');
        }
        if (enabledCache) {
            this.cache = new cache_1.Cache();
        }
    }
    async search(question, language = 'id', length = 10, options) {
        try {
            if (this.enabledCache &&
                this.cache.has(language, question.toLowerCase())) {
                return this.cache.get(language, question.toLowerCase());
            }
            const result = await this.worker.run({
                c: this.country.toLowerCase(),
                question: question,
                length: length,
                options: options,
                language: language,
            }, {
                name: 'search',
            });
            if (this.enabledCache)
                this.cache.set(language, question, result);
            return result;
        }
        catch (err) {
            throw new Error(err);
        }
    }
    static getRequestParams(question, length = 10) {
        return [
            {
                operationName: 'SearchQuery',
                query: config_1.graphqlQuery,
                variables: {
                    len: length,
                    query: question,
                },
            },
        ];
    }
    static isValidLanguage(lang) {
        return (config_1.languages.includes(lang.toLowerCase()) && typeof lang === 'string');
    }
    static getBaseURL(country) {
        return config_1.baseURLs[country];
    }
    async searchWithMT(question, language = 'id', length = 10, options) {
        if (this.enabledCache &&
            this.cache.has(language, question.toLowerCase())) {
            return this.cache.get(language, question.toLowerCase());
        }
        return await new Promise(async (resolve, reject) => {
            const result = await Promise.any(config_1.languages.map((country) => this.worker.run({
                c: country,
                language,
                question,
                length,
                options,
            }, { name: 'search' })));
            if (this.enabledCache)
                this.cache.set(language, question, result);
            resolve(result);
        });
    }
    static client(country) {
        return (0, fetcher_1.fetcherClient)(Brainly.getBaseURL(country), {
            headers: {
                Origin: Brainly.getBaseURL(country),
                Referer: Brainly.getBaseURL(country),
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                TE: 'trailers',
            },
        });
    }
}
exports.Brainly = Brainly;
