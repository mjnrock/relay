import { WebsocketBroker } from "./useWebsocket";
import { Message } from "../Message";
export declare function useCRUDAdapter({ webSocketBroker, setter }: {
    webSocketBroker: WebsocketBroker;
    setter: Function;
}): {
    toast: any;
    showToast: ({ severity, summary, detail }: {
        severity?: string | undefined;
        summary?: string | undefined;
        detail: string;
    }) => void;
    onMessage: ({ op, table, json, where }: {
        op?: string | undefined;
        table: string;
        json?: string | undefined;
        where?: string | boolean | undefined;
    }) => (message: Message) => void;
    crud: ({ op, table, json, where }: {
        op: string;
        table: string;
        json: string;
        where?: string | boolean | undefined;
    }) => void;
};
export default useCRUDAdapter;
