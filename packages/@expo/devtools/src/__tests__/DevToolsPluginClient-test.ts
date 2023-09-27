import DevToolsPluginClient from '../DevToolsPluginClient';

jest.mock('../WebSocket');

describe(DevToolsPluginClient, () => {
  let client: DevToolsPluginClient;
  const devServer = 'localhost:8081';

  beforeEach(async () => {
    client = new DevToolsPluginClient(devServer);
    await client.connectAsync();
  });

  afterEach(() => {
    client.close();
  });

  it('should connect to the WebSocket server', async () => {
    expect(client.isConnected()).toBe(true);
  });

  it('should send and receive messages', async () => {
    const method = 'testMethod';
    const message = { foo: 'bar' };

    const client2 = new DevToolsPluginClient(devServer);
    await client2.connectAsync();
    const receivedPromise = new Promise((resolve) => {
      client2.addMessageListener(method, (params) => {
        resolve(params);
      });
    });

    client.sendMessage(method, message);
    const received = await receivedPromise;
    expect(received).toEqual(message);
  });
});
