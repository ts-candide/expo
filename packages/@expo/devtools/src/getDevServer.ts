/**
 * Get the dev server address.
 */
export function getDevServer(): string {
  return window.location.origin.replace(/^https?:\/\//, '');
}
