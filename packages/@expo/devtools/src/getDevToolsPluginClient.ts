import DevToolsPluginClient from './DevToolsPluginClient';
import { getDevServer } from './getDevServer';

let instance: DevToolsPluginClient | null = null;

/**
 * Public API to get the DevToolsPluginClient instance.
 */
export async function getDevToolsPluginClientAsync(): Promise<DevToolsPluginClient> {
  const devServer = getDevServer();
  if (instance?.isConnected() === false || instance?.devServer !== devServer) {
    instance?.close();
    instance = null;
  }
  if (instance == null) {
    instance = new DevToolsPluginClient(devServer);
    await instance.connectAsync();
  }
  return instance;
}
