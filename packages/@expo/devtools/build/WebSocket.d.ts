/**
 * WebSocket wrapper for injecting a mock WebSocket in tests.
 * For browser and react-native, the global WebSocket should be avilable.
 */
declare const _default: {
    new (url: string | URL, protocols?: string | string[] | undefined): WebSocket;
    prototype: WebSocket;
    readonly CONNECTING: 0;
    readonly OPEN: 1;
    readonly CLOSING: 2;
    readonly CLOSED: 3;
};
export default _default;
//# sourceMappingURL=WebSocket.d.ts.map