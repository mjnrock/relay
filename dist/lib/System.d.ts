import Channel from "./Channel";
import Message from "./Message";
import MessageCollection from "./MessageCollection";
export declare type HandlerEntries = Map<string, Function> | Array<[string, Function]> | Object;
/**
 * The System is a handler registry that allows for the handling of messages
 * when they are sent to the bus and have a corresponding handler registered via
 * the Message.type property.
 *
 * A generic handler can be registered under the "default" key, which will be called
 * for all messages that will *only be called if no handler exists* for that Message.type.
 */
export declare class System {
    handlers: Map<string, Function>;
    constructor(handlers?: HandlerEntries);
    addHandler(name: string, handler: Function): this;
    addHandlers(handlers: HandlerEntries): this;
    removeHandler(name: string): boolean;
    removeHandlers(names: string[]): this;
    getHandler(name: string): Function | undefined;
    hasHandler(name: string): boolean;
    receive(message: Message | MessageCollection | Channel): any;
}
export default System;
