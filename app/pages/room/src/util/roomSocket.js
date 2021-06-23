import { EVENTS } from '../../../_shared/constants.js';
import SocketBuilder from '../../../_shared/socketBuilder.js';

class RoomSocketBuilder extends SocketBuilder {
  constructor({ socketUrl, namespace }) {
    super({ socketUrl, namespace });

    this.onRoomUpdated = () => {};
  }

  setOnRoomUpdated(fn) {
    this.onRoomUpdated = fn;

    return this;
  }

  build() {
    const socket = super.build();

    socket.on(EVENTS.LOBBY_UPDATED, this.onRoomUpdated);

    return socket;
  }
}

export default RoomSocketBuilder;
