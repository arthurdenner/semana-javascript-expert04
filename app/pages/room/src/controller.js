import { EVENTS } from '../../_shared/constants.js';

class RoomController {
  constructor({ roomInfo, socketBuilder }) {
    this.roomInfo = roomInfo;
    this.socketBuilder = socketBuilder;
    this.socket = {};
  }

  static initialize(deps) {
    return new RoomController(deps)._initialize();
  }

  _initialize() {
    this.socket = this._setupSocket();

    this.socket.emit(EVENTS.JOIN_ROOM, this.roomInfo);
  }

  _setupSocket() {
    return this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .setOnRoomUpdated(this.onRoomUpdated())
      .build();
  }

  onRoomUpdated() {
    return room => console.log('room list', room);
  }

  onUserDisconnected() {
    return user => console.log('user disconnected', user);
  }

  onUserConnected() {
    return user => console.log('user connected', user);
  }
}

export default RoomController;
