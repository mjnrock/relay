export declare class Message {
    id: string;
    data: any;
    emitter: any;
    meta: any;
    constructor({ data, type, emitter, tags, meta, ...rest }: {
        data: any;
        emitter: string;
        type?: string;
        tags?: string[] | Set<string>;
        meta?: any;
    });
    get type(): any;
    get tags(): any;
    toObject(): this;
    toJson(): string;
    toString(): string;
    static From(data: any): Message;
    static FromJson(json: string): Message;
    static FromString(str: string): Message;
}
export default Message;
