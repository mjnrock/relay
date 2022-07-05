import { Message } from "./Message";
export declare type SubscriptionCallback = (message: Message, signed: SubscriptionSignature) => void;
export declare type SubscriptionTags = string | string[] | Set<string>;
export declare type SubscriptionSignature = {
    id: string;
    emitter: string;
    tags: SubscriptionTags;
};
export declare class Subscription {
    id: string;
    subscribor: string;
    subscribee: string;
    callback: SubscriptionCallback;
    tags: Set<string>;
    constructor(subscribor: string, subscribee: string, callback: SubscriptionCallback, tags?: SubscriptionTags);
    /**
     * An object that can be used to sign a message, providing details about the subscription and the sender.
     */
    signature(): SubscriptionSignature;
    /**
     * You can either send a Message, or pass an object with the initialization properties to create a Message.
     */
    send(message: Message): this;
    /**
     * This creates a any subscription that can be invoked at any time.  Because the signature is included,
     * the callback function will receive the relevant information about the subscription to be handled as needed.
     */
    static CreateAnonymous(callback: SubscriptionCallback, tags?: SubscriptionTags): Subscription;
}
export default Subscription;
