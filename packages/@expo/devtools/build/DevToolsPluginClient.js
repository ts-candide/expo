import { EventEmitter } from 'fbemitter';
import WebSocket from './WebSocket';
// This version should be synced with the one in the **createMessageSocketEndpoint.ts** in @react-native-community/cli-server-api
const MESSAGE_PROTOCOL_VERSION = 2;
const DevToolsPluginMethod = 'Expo:DevToolsPlugin';
/**
 * This client is for the Expo CLI DevTools Plugins to communicate between the app and the DevTools webpage.
 * All the code should be both compatible with browsers and React Native.
 */
export default class DevToolsPluginClient {
    devServer;
    ws = null;
    eventEmitter = new EventEmitter();
    constructor(devServer) {
        this.devServer = devServer;
    }
    /**
     * Internal and for testing.
     */
    async connectAsync() {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(`ws://${this.devServer}/message`);
            ws.addEventListener('open', () => {
                this.ws = ws;
                resolve(ws);
            });
            ws.addEventListener('error', (e) => {
                reject(e);
            });
            ws.addEventListener('close', (e) => {
                console.debug('WebSocket closed', e.code, e.reason);
                this.ws = null;
            });
            ws.addEventListener('message', (e) => {
                this.handleMessage(e);
            });
        });
    }
    close() {
        this.ws?.close();
        this.ws = null;
        this.eventEmitter.removeAllListeners();
    }
    sendMessage(method, params) {
        const payload = {
            version: MESSAGE_PROTOCOL_VERSION,
            method: DevToolsPluginMethod,
            params: {
                method,
                params,
            },
        };
        this.ws?.send(JSON.stringify(payload));
    }
    addMessageListener(method, listener) {
        return this.eventEmitter.addListener(method, listener);
    }
    addMessageListenerOnce(method, listener) {
        this.eventEmitter.once(method, listener);
    }
    isConnected() {
        return this.ws?.readyState === WebSocket.OPEN;
    }
    handleMessage(event) {
        try {
            const payload = JSON.parse(event.data);
            if (payload.version === MESSAGE_PROTOCOL_VERSION && payload.method === DevToolsPluginMethod) {
                this.eventEmitter.emit(payload.params.method, payload.params.params);
            }
        }
        catch { }
    }
}
//# sourceMappingURL=DevToolsPluginClient.js.map