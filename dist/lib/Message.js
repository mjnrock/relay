"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const uuid_1 = require("uuid");
class Message {
    id;
    data;
    emitter;
    meta;
    constructor({ data, type, emitter, tags = [], meta = {}, ...rest }) {
        for (let [key, value] of Object.entries(rest)) {
            // @ts-ignore
            this[key] = value;
        }
        this.id = (0, uuid_1.v4)();
        this.data = data;
        this.emitter = emitter;
        if (typeof tags === "string") {
            tags = [tags];
        }
        else if (!Array.isArray(tags)) {
            tags = Array.from(tags);
        }
        this.meta = {
            ...meta,
            type: meta.type || type || tags[0] || "default",
            tags: new Set(meta.tags || tags),
            timestamp: Date.now(),
        };
    }
    get type() {
        return this.meta.type;
    }
    get tags() {
        return this.meta.tags;
    }
    toObject() {
        const obj = {
            ...this,
        };
        obj.meta.tags = Array.from(obj.meta.tags);
        return obj;
    }
    toJson() {
        return JSON.stringify(this.toObject());
    }
    toString() {
        return this.toJson();
    }
    static From(data) {
        return new this(data);
    }
    static FromJson(json) {
        return this.From(JSON.parse(json));
    }
    static FromString(str) {
        return this.FromJson(str);
    }
}
exports.Message = Message;
;
exports.default = Message;
