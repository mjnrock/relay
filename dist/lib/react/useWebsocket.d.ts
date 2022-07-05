import Message from "../Message";
export declare class WebsocketBroker {
    static Host: string;
    static Port: string;
    static URL: string;
    protected ws: WebSocket | undefined;
    constructor(websocket?: WebSocket);
    onOpen: () => void;
    onClose: () => void;
    onMessage: (message: Message) => void;
    connect: (url?: string) => this;
    send: (message: Message) => boolean;
    close: () => boolean;
    isConnected: () => boolean | undefined;
}
export declare function useWebsocket(callback: any): any[];
export declare function useWebsocketContext(context: any): WebsocketBroker;
export default useWebsocket;
