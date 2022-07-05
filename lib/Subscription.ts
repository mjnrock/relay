import { v4 as uuid } from "uuid";
import { Message } from "./Message";

export type SubscriptionCallback = (message: Message, signed: SubscriptionSignature) => void;
export type SubscriptionTags = string | string[] | Set<string>;
export type SubscriptionSignature = {
	id: string;
	emitter: string;
	tags: SubscriptionTags;
};

export class Subscription {
	public id: string;
	public subscribor: string;
	public subscribee: string;
	public callback: SubscriptionCallback;

	public tags: Set<string>;

	constructor (subscribor: string, subscribee: string, callback: SubscriptionCallback, tags?: SubscriptionTags) {
		this.id = uuid();
		this.subscribor = subscribor;	// The one that is subscribing
		this.subscribee = subscribee;	// The one to whom the subscription is being made
		this.callback = callback;		// The callback to invoke when a message is sent

		if(typeof tags === "string") {
			tags = [ tags ];
		}
		this.tags = new Set(tags);
	}

	/**
	 * An object that can be used to sign a message, providing details about the subscription and the sender.
	 */
	public signature(): SubscriptionSignature {
		return {
			id: this.id,
			emitter: this.subscribor,
			tags: Array.from(this.tags),
		};
	}
	/**
	 * You can either send a Message, or pass an object with the initialization properties to create a Message.
	 */
	public send(message: Message) {
		message.emitter = this.subscribor;

		if(message instanceof Message) {
			this.callback(message, this.signature());
		} else {
			this.callback(Message.From(message), this.signature());
		}

		return this;
	}

	/**
	 * This creates a any subscription that can be invoked at any time.  Because the signature is included,
	 * the callback function will receive the relevant information about the subscription to be handled as needed.
	 */
	static CreateAnonymous(callback: SubscriptionCallback, tags?: SubscriptionTags) {
		return new Subscription(uuid(), uuid(), callback, tags);
	}
};

export default Subscription;