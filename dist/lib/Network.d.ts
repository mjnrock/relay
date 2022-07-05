import { Subscription, SubscriptionCallback } from "./Subscription";
import { Channel } from "./Channel";
export declare class Network {
    protected channels: Map<string, Channel>;
    constructor(channels?: any);
    addChannel(alias: string, channel: Channel): this;
    removeChannel(alias: string): boolean;
    getChannel(alias: string): Channel | undefined;
    addSubscriberToChannel(alias: string, subscriber: string | any, callback: SubscriptionCallback): Subscription | undefined;
    removeSubscriberFromChannel(alias: string, subscriber: string | Subscription): boolean;
    send(alias: string, data: any, tags?: string[]): boolean;
    broadcast(data: any, tags?: string[]): boolean;
}
export default Network;
