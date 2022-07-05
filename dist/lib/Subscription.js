"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const uuid_1 = require("uuid");
const Message_1 = require("./Message");
class Subscription {
    id;
    subscribor;
    subscribee;
    callback;
    tags;
    constructor(subscribor, subscribee, callback, tags) {
        this.id = (0, uuid_1.v4)();
        this.subscribor = subscribor; // The one that is subscribing
        this.subscribee = subscribee; // The one to whom the subscription is being made
        this.callback = callback; // The callback to invoke when a message is sent
        if (typeof tags === "string") {
            tags = [tags];
        }
        this.tags = new Set(tags);
    }
    /**
     * An object that can be used to sign a message, providing details about the subscription and the sender.
     */
    signature() {
        return {
            id: this.id,
            emitter: this.subscribor,
            tags: Array.from(this.tags),
        };
    }
    /**
     * You can either send a Message, or pass an object with the initialization properties to create a Message.
     */
    send(message) {
        message.emitter = this.subscribor;
        if (message instanceof Message_1.Message) {
            this.callback(message, this.signature());
        }
        else {
            this.callback(Message_1.Message.From(message), this.signature());
        }
        return this;
    }
    /**
     * This creates a any subscription that can be invoked at any time.  Because the signature is included,
     * the callback function will receive the relevant information about the subscription to be handled as needed.
     */
    static CreateAnonymous(callback, tags) {
        return new Subscription((0, uuid_1.v4)(), (0, uuid_1.v4)(), callback, tags);
    }
}
exports.Subscription = Subscription;
;
exports.default = Subscription;
