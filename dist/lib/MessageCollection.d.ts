import { Message } from "./Message";
export declare class MessageCollection {
    id: string;
    messages: Map<number, Set<Message>>;
    constructor(messages?: Message[]);
    add(message: Message): this;
    addMany(messages: Message[]): this;
    remove(message: Message): boolean;
    removeMany(messages: Message[]): this;
    empty(): this;
    get size(): number;
    values(): Message[];
    each(callback: (message: Message, key: number) => any): any;
    get(ts: number): Message[];
    getSince(ts: number, inclusive?: boolean): Message[];
    getBetween(start: number, end: number): Message[];
    getByProp(property: string, value: any): Message[];
    getByFilter(filter: (message: Message) => boolean): Message[];
    toObject(): any;
    toJson(): string;
    toString(): string;
    static From(obj: any): MessageCollection;
    static FromJson(json: string): MessageCollection;
    static FromString(str: string): MessageCollection;
}
export default MessageCollection;
