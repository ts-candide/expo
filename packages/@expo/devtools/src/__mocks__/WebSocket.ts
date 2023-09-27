import { EventEmitter } from 'events';

const BOARDCAST_EVENT_EMITTER = new EventEmitter();

export default class MockWebSocket extends EventEmitter {
  constructor(address: string) {
    super();
    setTimeout(() => {
      this.emit('open');
    }, 0);
  }

  addEventListener = jest.fn().mockImplementation((event, listener) => {
    this.on(event, listener);
    BOARDCAST_EVENT_EMITTER.on(event, listener);
  });
  close = jest.fn();
  send = jest.fn().mockImplementation((data) => {
    BOARDCAST_EVENT_EMITTER.emit('message', { data });
  });
}
