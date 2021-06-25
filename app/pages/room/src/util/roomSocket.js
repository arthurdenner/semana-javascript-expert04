import { EVENTS } from '../../../_shared/constants.js';
import SocketBuilder from '../../../_shared/socketBuilder.js';

class RoomSocketBuilder extends SocketBuilder {
  constructor({ socketUrl, namespace }) {
    super({ socketUrl, namespace });

    this.onRoomUpdated = () => {};
    this.onUserProfileUpgrade = () => {};
    this.onSpeakRequested = () => {};
  }

  setOnRoomUpdated(fn) {
    this.onRoomUpdated = fn;

    return this;
  }

  setOnUserProfileUpgrade(fn) {
    this.onUserProfileUpgrade = fn;

    return this;
  }

  setOnSpeakRequested(fn) {
    this.onSpeakRequested = fn;

    return this;
  }

  build() {
    const socket = super.build();

    socket.on(EVENTS.LOBBY_UPDATED, this.onRoomUpdated);
    socket.on(EVENTS.UPGRADE_USER_PERMISSION, this.onUserProfileUpgrade);
    socket.on(EVENTS.SPEAK_REQUEST, this.onSpeakRequested);

    return socket;
  }
}

export default RoomSocketBuilder;
