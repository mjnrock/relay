import { v4 as uuid } from "uuid";

export class Message {
	public id: string;
	public data: any;
	public emitter: any;
	public meta: any;

	constructor({ data, type, emitter, tags = [], meta = {} }: { data: any, emitter: string, type?: string, tags?: string[] | Set<string>, meta?: any }) {
		this.id = uuid();
		this.data = data;
		this.emitter = emitter;

		if(typeof tags === "string") {
			tags = [tags];
		} else if(!Array.isArray(tags)) {
			tags = Array.from(tags);
		}

		this.meta = {
			...meta,
			
			type: meta.type || type || tags[ 0 ] || "default",
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
	toJson(): string {
		return JSON.stringify(this.toObject());
	}
	toString(): string {
		return this.toJson();
	}

	static From(data: any): Message {
		return new this(data);
	}
	static FromJson(json: string): Message {
		return this.From(JSON.parse(json));
	}
	static FromString(str: string): Message {
		return this.FromJson(str);
	}
};

export default Message;