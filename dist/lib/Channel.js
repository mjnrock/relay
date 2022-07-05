"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const uuid_1 = require("uuid");
const Message_1 = require("./Message");
const MessageCollection_1 = require("./MessageCollection");
const Subscription_1 = require("./Subscription");
class Channel {
    static MessageTrigger = `@channel`;
    id;
    tags;
    messages;
    subscriptions;
    config;
    constructor({ config = {}, id, tags = [] }) {
        /**
         * The unique identifier for this channel
         */
        this.id = id || (0, uuid_1.v4)();
        /**
         * Any tags that are associated with this channel
         */
        this.tags = tags;
        /**
         * The messages collection is the primary storage for messages
         * sent to this channel, abiding by the configuration settings below.
         */
        this.messages = new MessageCollection_1.MessageCollection();
        /**
         * A map that stores [ Subscription.id, Subscription ] pairs
         */
        this.subscriptions = new Map();
        this.config = {
            /**
             * A boolean flag to indicate if the channel should retain message history
             */
            retainHistory: false,
            /**
             * The maximum number of messages to retain in the channel
             */
            maxHistorySize: 100,
            /**
             * A boolean flag to determine if the maxHistorySize should be treated as a soft limit
             * or a hard limit.  If true, the maxHistorySize will be treated as a soft limit,
             * and the channel will remove the oldest message and append the newest one.  If
             * false, the maxHistorySize will be treated as a hard limit, and the channel
             * will not append any new messages.
             */
            isSoftMax: true,
            ...config,
        };
    }
    addSubscriber(subscriber, callback) {
        let subscribor, subscribee = this.id;
        if ((0, uuid_1.validate)(subscriber)) {
            subscribor = subscriber;
        }
        else if (typeof subscriber === "object" && subscriber.id) {
            subscribor = subscriber.id;
        }
        const subscription = new Subscription_1.Subscription(subscribor, subscribee, callback);
        this.subscriptions.set(subscription.id, subscription);
        return subscription;
    }
    removeSubscriber(subscriber) {
        for (let subscription of this.subscriptions.values()) {
            if (subscription.subscribor === subscriber) {
                return this.subscriptions.delete(subscription.id);
            }
            else if (subscriber instanceof Subscription_1.Subscription && subscription.id === subscriber.id) {
                return this.subscriptions.delete(subscription.id);
            }
        }
        return false;
    }
    setMessages(messages) {
        this.messages = new MessageCollection_1.MessageCollection(messages);
        return this;
    }
    addMessage(message) {
        if (this.config.retainHistory) {
            if (this.messages.size < this.config.maxHistorySize) {
                this.messages.add(message);
                return true;
            }
            else {
                if (this.config.isSoftMax) {
                    const array = [
                        ...this.messages.values(),
                        message,
                    ];
                    this.setMessages(array.slice(1));
                    return true;
                }
            }
        }
        return false;
    }
    addMessages(...messages) {
        for (let message of messages) {
            this.addMessage(message);
        }
        return this;
    }
    clearMessages() {
        this.messages = new MessageCollection_1.MessageCollection();
        return this;
    }
    /**
     * This will invoke the callback for each subscription directly,
     * sending the ...args verbatim.  As such, it is not recommended to
     * use this method for sending messages, but rather use the send()
     * method, which uses this method to internally, but with Agency
     * opinionated message handling.
     */
    broadcast(message) {
        for (let subscription of this.subscriptions.values()) {
            subscription.send(message);
        }
        return this;
    }
    sendTo(subscriber, message) {
        if (typeof subscriber === "string" && (0, uuid_1.validate)(subscriber)) {
            const subscription = this.subscriptions.get(subscriber);
            if (subscription) {
                subscription.send(message);
                return true;
            }
        }
        else if (subscriber instanceof Subscription_1.Subscription) {
            return this.sendTo(subscriber.id, message);
        }
        return false;
    }
    sendMessage(message) {
        if (message instanceof Message_1.Message) {
            /**
             * Undergoes validation and checking against the configuration
             */
            this.addMessage(message);
            /**
             * Actually invoke the subscription callbacks, with optional mutators
             */
            this.broadcast(message);
        }
        return this;
    }
    sendData(data, tags = []) {
        const message = new Message_1.Message({
            data,
            tags,
            emitter: this.id,
        });
        return this.sendMessage(message);
    }
    send(data, tags) {
        if (data instanceof Message_1.Message) {
            return this.sendMessage(data);
        }
        return this.sendData(data, tags);
    }
}
exports.Channel = Channel;
;
exports.default = Channel;
