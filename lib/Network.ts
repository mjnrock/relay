import { Subscription, SubscriptionCallback } from "./Subscription";
import { Channel } from "./Channel";

export class Network {
	protected channels: Map<string, Channel>;

	constructor (channels?: any) {
		this.channels = new Map<string, Channel>();

		if(channels) {
			if(Array.isArray(channels)) {
				channels.forEach((channel) => {
					this.addChannel(channel[ 0 ], channel[ 1 ]);
				});
			} else if(channels instanceof Map) {
				this.channels = channels;
			}
		}
	}

	addChannel(alias: string, channel: Channel) {
		this.channels.set(alias, channel);

		return this;
	}
	removeChannel(alias: string) {
		return this.channels.delete(alias);
	}
	getChannel(alias: string) {
		return this.channels.get(alias);
	}

	addSubscriberToChannel(alias: string, subscriber: string | any, callback: SubscriptionCallback) {
		const channel = this.channels.get(alias);

		if(channel) {
			return channel.addSubscriber(subscriber, callback);
		}
	}
	removeSubscriberFromChannel(alias: string, subscriber: string | Subscription) {
		const channel = this.channels.get(alias);

		if(channel) {
			return channel.removeSubscriber(subscriber);
		}

		return false;
	}

	send(alias: string, data: any, tags?: string[]) {
		const channel = this.channels.get(alias);

		if(channel) {
			channel.send(data, tags);

			return true;
		}

		return false;
	}
	broadcast(data: any, tags?: string[]) {
		this.channels.forEach((channel) => {
			channel.send(data, tags);
		});

		return true;
	}
};

export default Network;