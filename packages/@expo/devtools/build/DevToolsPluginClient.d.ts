import { EventSubscription } from 'fbemitter';
import WebSocket from './WebSocket';
/**
 * This client is for the Expo CLI DevTools Plugins to communicate between the app and the DevTools webpage.
 * All the code should be both compatible with browsers and React Native.
 */
export default class DevToolsPluginClient {
    readonly devServer: string;
    private ws;
    private eventEmitter;
    constructor(devServer: string);
    /**
     * Internal and for testing.
     */
    connectAsync(): Promise<WebSocket>;
    close(): void;
    sendMessage(method: string, params: any): void;
    addMessageListener(method: string, listener: (params: any) => void): EventSubscription;
    addMessageListenerOnce(method: string, listener: (params: any) => void): void;
    isConnected(): boolean;
    private handleMessage;
}
//# sourceMappingURL=DevToolsPluginClient.d.ts.map