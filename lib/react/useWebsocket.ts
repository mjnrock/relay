import { useContext, useRef, useEffect, useState } from "react";

import Message from "../Message";

const isDebuggingMode = false;

export class WebsocketBroker {
	public static Host = `buddha.com`;
	public static Port = `3001`;
	public static URL = `wss://${ this.Host }:${ this.Port }`;

	protected ws: WebSocket | undefined;

	constructor (websocket?: WebSocket) {
		this.ws = websocket;
	}

	public onOpen = (): void => {
		if(isDebuggingMode) {
			console.log(`Websocket opened`);
		}
	}

	public onClose = (): void => {
		if(isDebuggingMode) {
			console.log(`Websocket closed`);
		}
	}

	public onMessage = (message: Message): void => {
		if(isDebuggingMode) {
			console.log(`Websocket message`, message);
		}
	}

	public connect = (url: string = WebsocketBroker.URL) => {
		if(!this.ws) {
			this.ws = new WebSocket(url);
		}

		this.ws.onopen = () => this.onOpen.call(this);
		this.ws.onclose = () => this.onClose.call(this);
		this.ws.onmessage = (event) => this.onMessage.call(this, Message.FromJson(event.data));

		return this;
	}

	public send = (message: Message) => {
		if(this.ws && this.isConnected()) {
			this.ws.send(message.toJson());

			return true;
		}

		return false;
	}

	public close = () => {
		if(this.ws && this.isConnected()) {
			this.ws.close();

			return true;
		}

		return false;
	}

	public isConnected = () => {
		return this.ws && this.ws.readyState === WebSocket.OPEN;
	}
};

export function useWebsocket(callback: any) {
	const broker = useRef<any>(null);
	const [ connected, setConnected ] = useState(false);

	useEffect(() => {
		broker.current = new WebsocketBroker();
		const ws = broker.current;
		
		ws.onOpen = () => {
			setConnected(true);
		};
		ws.onClose = () => {
			setConnected(false);
		};
		ws.onMessage = (message: Message) => {
			callback(message);
		};

		ws.connect();
		
		return () => {
			ws.close();
		};
	}, []);

	return [ broker.current, connected ];
};

export function useWebsocketContext(context: any) {
	const broker = useContext<WebsocketBroker>(context);

	return broker;
};

export default useWebsocket;