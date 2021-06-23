import { EVENTS } from '../../_shared/constants.js';

class RoomController {
  constructor({ roomInfo, socketBuilder, view }) {
    this.roomInfo = roomInfo;
    this.socketBuilder = socketBuilder;
    this.socket = {};
    this.view = view;
  }

  static initialize(deps) {
    return new RoomController(deps)._initialize();
  }

  _initialize() {
    this._setupViewEvents();

    this.socket = this._setupSocket();
    this.socket.emit(EVENTS.JOIN_ROOM, this.roomInfo);
  }

  _setupViewEvents() {
    this.view.updateUserImage(this.roomInfo.user);
    this.view.updateRoomTopic(this.roomInfo.room);
  }

  _setupSocket() {
    return this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .setOnRoomUpdated(this.onRoomUpdated())
      .build();
  }

  onRoomUpdated() {
    return (users) => {
      console.log('room list', users);
      this.view.addUsersToGrid(users);
    };
  }

  onUserDisconnected() {
    return (user) => console.log('user disconnected', user);
  }

  onUserConnected() {
    return (user) => {
      console.log('user connected', user);
      this.view.addUserToGrid(user);
    };
  }
}

export default RoomController;
