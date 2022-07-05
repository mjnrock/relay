"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageCollection = void 0;
const uuid_1 = require("uuid");
const Message_1 = require("./Message");
class MessageCollection {
    id;
    messages;
    constructor(messages = []) {
        this.id = (0, uuid_1.v4)();
        this.messages = new Map();
        this.addMany(messages);
    }
    add(message) {
        const key = Date.now();
        const entry = this.messages.get(key);
        if (!entry) {
            this.messages.set(key, new Set());
        }
        else {
            entry.add(message);
        }
        return this;
    }
    addMany(messages) {
        messages.forEach(message => this.add(message));
        return this;
    }
    remove(message) {
        const key = Date.now();
        const entry = this.messages.get(key);
        if (!entry) {
            return false;
        }
        else {
            return entry.delete(message);
        }
    }
    removeMany(messages) {
        messages.forEach(message => this.remove(message));
        return this;
    }
    empty() {
        this.messages.clear();
        return this;
    }
    get size() {
        return Array.from(this.messages).reduce((acc, [, messages]) => acc + messages.size, 0);
    }
    values() {
        const messages = [];
        this.messages.forEach((entry) => {
            entry.forEach((message) => {
                messages.push(message);
            });
        });
        return messages;
    }
    each(callback) {
        this.messages.forEach((entry, key) => {
            for (const message of entry.values()) {
                callback(message, key);
            }
        });
    }
    get(ts) {
        const entry = this.messages.get(ts);
        if (!entry) {
            return [];
        }
        else {
            return Array.from(entry);
        }
    }
    getSince(ts, inclusive = false) {
        const messages = [];
        this.messages.forEach((entry, key) => {
            if ((inclusive && +key >= ts) || (!inclusive && +key > ts)) {
                entry.forEach((message) => {
                    messages.push(message);
                });
            }
        });
        return messages;
    }
    getBetween(start, end) {
        const messages = [];
        this.messages.forEach((entry, key) => {
            if (+key >= start && +key <= end) {
                entry.forEach((message) => {
                    messages.push(message);
                });
            }
        });
        return messages;
    }
    getByProp(property, value) {
        const messages = [];
        this.messages.forEach((entry) => {
            entry.forEach((message) => {
                // @ts-ignore
                if (message[property] === value) {
                    messages.push(message);
                }
            });
        });
        return messages;
    }
    getByFilter(filter) {
        const messages = [];
        this.messages.forEach((entry) => {
            entry.forEach((message) => {
                if (filter(message) === true) {
                    messages.push(message);
                }
            });
        });
        return messages;
    }
    toObject() {
        const obj = {
            id: this.id,
            messages: {},
        };
        this.messages.forEach((messages, key) => {
            obj.messages[key] = Array.from(messages).map(message => message.toObject());
        });
        return obj;
    }
    toJson() {
        return JSON.stringify(this.toObject());
    }
    toString() {
        return this.toJson();
    }
    static From(obj) {
        const collection = new MessageCollection();
        obj.messages.forEach((messages, key) => {
            collection.messages.set(key, new Set(messages.map((message) => {
                const msg = Message_1.Message.From(message);
                msg.id = message.id;
                return msg;
            })));
        });
        return collection;
    }
    static FromJson(json) {
        return this.From(JSON.parse(json));
    }
    static FromString(str) {
        return this.FromJson(str);
    }
}
exports.MessageCollection = MessageCollection;
;
exports.default = MessageCollection;
