"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = void 0;
class Network {
    channels;
    constructor(channels) {
        this.channels = new Map();
        if (channels) {
            if (Array.isArray(channels)) {
                channels.forEach((channel) => {
                    this.addChannel(channel[0], channel[1]);
                });
            }
            else if (channels instanceof Map) {
                this.channels = channels;
            }
        }
    }
    addChannel(alias, channel) {
        this.channels.set(alias, channel);
        return this;
    }
    removeChannel(alias) {
        return this.channels.delete(alias);
    }
    getChannel(alias) {
        return this.channels.get(alias);
    }
    addSubscriberToChannel(alias, subscriber, callback) {
        const channel = this.channels.get(alias);
        if (channel) {
            return channel.addSubscriber(subscriber, callback);
        }
    }
    removeSubscriberFromChannel(alias, subscriber) {
        const channel = this.channels.get(alias);
        if (channel) {
            return channel.removeSubscriber(subscriber);
        }
        return false;
    }
    send(alias, data, tags) {
        const channel = this.channels.get(alias);
        if (channel) {
            channel.send(data, tags);
            return true;
        }
        return false;
    }
    broadcast(data, tags) {
        this.channels.forEach((channel) => {
            channel.send(data, tags);
        });
        return true;
    }
}
exports.Network = Network;
;
exports.default = Network;
