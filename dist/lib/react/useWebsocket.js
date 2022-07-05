"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWebsocketContext = exports.useWebsocket = exports.WebsocketBroker = void 0;
const react_1 = require("react");
const Message_1 = __importDefault(require("../Message"));
const isDebuggingMode = false;
class WebsocketBroker {
    static Host = `buddha.com`;
    static Port = `3001`;
    static URL = `wss://${this.Host}:${this.Port}`;
    ws;
    constructor(websocket) {
        this.ws = websocket;
    }
    onOpen = () => {
        if (isDebuggingMode) {
            console.log(`Websocket opened`);
        }
    };
    onClose = () => {
        if (isDebuggingMode) {
            console.log(`Websocket closed`);
        }
    };
    onMessage = (message) => {
        if (isDebuggingMode) {
            console.log(`Websocket message`, message);
        }
    };
    connect = (url = WebsocketBroker.URL) => {
        if (!this.ws) {
            this.ws = new WebSocket(url);
        }
        this.ws.onopen = () => this.onOpen.call(this);
        this.ws.onclose = () => this.onClose.call(this);
        this.ws.onmessage = (event) => this.onMessage.call(this, Message_1.default.FromJson(event.data));
        return this;
    };
    send = (message) => {
        if (this.ws && this.isConnected()) {
            this.ws.send(message.toJson());
            return true;
        }
        return false;
    };
    close = () => {
        if (this.ws && this.isConnected()) {
            this.ws.close();
            return true;
        }
        return false;
    };
    isConnected = () => {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    };
}
exports.WebsocketBroker = WebsocketBroker;
;
function useWebsocket(callback) {
    const broker = (0, react_1.useRef)(null);
    const [connected, setConnected] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        broker.current = new WebsocketBroker();
        const ws = broker.current;
        ws.onOpen = () => {
            setConnected(true);
        };
        ws.onClose = () => {
            setConnected(false);
        };
        ws.onMessage = (message) => {
            callback(message);
        };
        ws.connect();
        return () => {
            ws.close();
        };
    }, []);
    return [broker.current, connected];
}
exports.useWebsocket = useWebsocket;
;
function useWebsocketContext(context) {
    const broker = (0, react_1.useContext)(context);
    return broker;
}
exports.useWebsocketContext = useWebsocketContext;
;
exports.default = useWebsocket;
