import { EventEmitter, EventSubscription } from 'fbemitter';

import WebSocket from './WebSocket';

// This version should be synced with the one in the **createMessageSocketEndpoint.ts** in @react-native-community/cli-server-api
const MESSAGE_PROTOCOL_VERSION = 2;

const DevToolsPluginMethod = 'Expo:DevToolsPlugin';

/**
 * This client is for the Expo CLI DevTools Plugins to communicate between the app and the DevTools webpage.
 * All the code should be both compatible with browsers and React Native.
 */
export default class DevToolsPluginClient {
  private ws: WebSocket | null = null;
  private eventEmitter: EventEmitter = new EventEmitter();

  public constructor(public readonly devServer: string) {}

  /**
   * Internal and for testing.
   */
  public async connectAsync(): Promise<WebSocket> {
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

  public close() {
    this.ws?.close();
    this.ws = null;
    this.eventEmitter.removeAllListeners();
  }

  public sendMessage(method: string, params: any): void {
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

  public addMessageListener(method: string, listener: (params: any) => void): EventSubscription {
    return this.eventEmitter.addListener(method, listener);
  }

  public addMessageListenerOnce(method: string, listener: (params: any) => void): void {
    this.eventEmitter.once(method, listener);
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const payload = JSON.parse(event.data);
      if (payload.version === MESSAGE_PROTOCOL_VERSION && payload.method === DevToolsPluginMethod) {
        this.eventEmitter.emit(payload.params.method, payload.params.params);
      }
    } catch {}
  }
}
