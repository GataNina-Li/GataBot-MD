"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
class Cache {
    temporaryPath = os_1.default.tmpdir() + '/brainly-scraper2-cache.json';
    constructor() {
        if (!fs_1.default.existsSync(this.temporaryPath)) {
            fs_1.default.writeFileSync(this.temporaryPath, JSON.stringify({}));
        }
    }
    clearAll() {
        fs_1.default.writeFileSync(this.temporaryPath, JSON.stringify({}));
    }
    get(l, q) {
        if (!this.has(l, q.toLowerCase())) {
            return undefined;
        }
        return this.json()[l][q.toLowerCase()];
    }
    set(l, q, res) {
        if (this.has(l, q.toLowerCase()))
            return;
        const d = this.json();
        d[l] = {
            ...d[l],
            [q.toLowerCase()]: res,
        };
        fs_1.default.writeFileSync(this.temporaryPath, JSON.stringify(d));
    }
    has(l, q) {
        const d = this.json();
        if (d[l] && d[l][q.toLowerCase()]) {
            return true;
        }
        else {
            return false;
        }
    }
    getQuestionsByLang(lang) {
        return this.json()[lang];
    }
    json() {
        if (fs_1.default.existsSync(this.temporaryPath)) {
            try {
                const data = fs_1.default.readFileSync(this.temporaryPath, 'utf8');
                return JSON.parse(data);
            }
            catch {
                return {};
            }
        }
        else
            return {};
    }
}
exports.Cache = Cache;
