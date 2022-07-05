import { useRef } from "react";
import { WebsocketBroker } from "./useWebsocket";
import { Message } from "../Message";

export function useCRUDAdapter({ webSocketBroker, setter }: { webSocketBroker: WebsocketBroker, setter: Function }) {
	const toast: any = useRef(null);
	const showToast = ({ severity = "success", summary = "Success", detail }: { severity?: string, summary?: string, detail: string }) => {
		if(toast.current) {
			toast.current.show({ severity, summary, detail, life: 3000 });
		}
	};

	const onMessage = ({ op = "read", table, json = "*", where }: { op?: string, table: string, json?: string, where?: string | boolean }) => (message: Message) => {
		if(message.type.startsWith("CRUD")) {
			if(message.type === "CRUD:read") {
				setter(message.data);
			} else {
				const count = message.data;

				if(count > 0) {
					showToast({ severity: "success", summary: "Success", detail: `Rows Affected: ${ count }` });

					webSocketBroker.send(Message.From({
						type: "CRUD",
						data: [
							op,
							table,
							json,
							where,
						],
					}));
				} else {
					showToast({ severity: "error", summary: "Error", detail: `Something went wrong, check console logs.` });
					console.warn(message);
				}
			}
		}
	};

	const crud = ({ op, table, json, where }: { op: string, table: string, json: string, where?: string | boolean }) => {
		webSocketBroker.send(Message.From({
			type: "CRUD",
			data: [
				op,
				table,
				json,
				where,
			],
		}));
	};

	return {
		toast,
		showToast,
		onMessage,
		crud,
	};
};

export default useCRUDAdapter;