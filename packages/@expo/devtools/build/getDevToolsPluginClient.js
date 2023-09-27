import DevToolsPluginClient from './DevToolsPluginClient';
import { getDevServer } from './getDevServer';
let instance = null;
/**
 * Public API to get the DevToolsPluginClient instance.
 */
export async function getDevToolsPluginClientAsync() {
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
//# sourceMappingURL=getDevToolsPluginClient.js.map