/**
 * Get the dev server address.
 */
export function getDevServer(): string {
  const getDevServer = require('react-native/Libraries/Core/Devtools/getDevServer');
  return getDevServer()
    .url.replace(/^https?:\/\//, '')
    .replace(/\/?$/, '');
}
