import { Message } from "./Message";
import { MessageCollection } from "./MessageCollection";
import { Subscription } from "./Subscription";
import { SubscriptionCallback } from "./Subscription";
export declare type ChannelConfig = {
    retainHistory?: boolean;
    maxHistorySize?: number;
    isSoftMax?: boolean;
};
export declare class Channel {
    static MessageTrigger: string;
    id: string;
    tags: string[];
    messages: MessageCollection;
    protected subscriptions: Map<string, Subscription>;
    protected config: any;
    constructor({ config, id, tags }: {
        config?: ChannelConfig;
        id?: string;
        tags?: string[];
    });
    addSubscriber(subscriber: string | any, callback: SubscriptionCallback): Subscription;
    removeSubscriber(subscriber: string | Subscription): boolean;
    setMessages(messages: Message[]): this;
    addMessage(message: Message): boolean;
    addMessages(...messages: Message[]): this;
    clearMessages(): this;
    /**
     * This will invoke the callback for each subscription directly,
     * sending the ...args verbatim.  As such, it is not recommended to
     * use this method for sending messages, but rather use the send()
     * method, which uses this method to internally, but with Agency
     * opinionated message handling.
     */
    broadcast(message: Message): this;
    sendTo(subscriber: string | Subscription, message: Message): boolean;
    sendMessage(message: Message): this;
    sendData(data: any, tags?: string[]): this;
    send(data: any, tags?: string[]): this;
}
export default Channel;
