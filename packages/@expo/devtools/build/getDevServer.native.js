/**
 * Get the dev server address.
 */
export function getDevServer() {
    const getDevServer = require('react-native/Libraries/Core/Devtools/getDevServer');
    return getDevServer()
        .url.replace(/^https?:\/\//, '')
        .replace(/\/?$/, '');
}
//# sourceMappingURL=getDevServer.native.js.map