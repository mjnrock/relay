"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCRUDAdapter = void 0;
const react_1 = require("react");
const Message_1 = require("../Message");
function useCRUDAdapter({ webSocketBroker, setter }) {
    const toast = (0, react_1.useRef)(null);
    const showToast = ({ severity = "success", summary = "Success", detail }) => {
        if (toast.current) {
            toast.current.show({ severity, summary, detail, life: 3000 });
        }
    };
    const onMessage = ({ op = "read", table, json = "*", where }) => (message) => {
        if (message.type.startsWith("CRUD")) {
            if (message.type === "CRUD:read") {
                setter(message.data);
            }
            else {
                const count = message.data;
                if (count > 0) {
                    showToast({ severity: "success", summary: "Success", detail: `Rows Affected: ${count}` });
                    webSocketBroker.send(Message_1.Message.From({
                        type: "CRUD",
                        data: [
                            op,
                            table,
                            json,
                            where,
                        ],
                    }));
                }
                else {
                    showToast({ severity: "error", summary: "Error", detail: `Something went wrong, check console logs.` });
                    console.warn(message);
                }
            }
        }
    };
    const crud = ({ op, table, json, where }) => {
        webSocketBroker.send(Message_1.Message.From({
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
}
exports.useCRUDAdapter = useCRUDAdapter;
;
exports.default = useCRUDAdapter;
