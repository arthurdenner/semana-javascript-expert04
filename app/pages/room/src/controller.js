import { EVENTS } from '../../_shared/constants.js';

class RoomController {
  constructor({ peerBuilder, roomInfo, socketBuilder, view }) {
    this.peerBuilder = peerBuilder;
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
    this.peer = this._setupWebRTC();
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
      .setOnUserProfileUpgrade(this.onUserProfileUpgrade())
      .build();
  }

  _setupWebRTC() {
    return this.peerBuilder
      .setOnError(this.onPeerError())
      .setOnConnectionOpened(this.onPeerConnectionOpened())
      .build();
  }

  onPeerConnectionOpened() {
    return (peer) => {
      console.log('peer', peer);
    };
  }

  onPeerError() {
    return (error) => {
      console.error('onPeerError', error);
    };
  }

  onRoomUpdated() {
    return (users) => {
      console.log('room list', users);
      this.view.addUsersToGrid(users);
    };
  }

  onUserProfileUpgrade() {
    return (user) => {
      console.log('user upgraded', user);

      if (user.isSpeaker) {
        this.view.addUserToGrid(user, true);
      }
    };
  }

  onUserDisconnected() {
    return (user) => {
      console.log('user disconnected', user);
      this.view.removeItemFromGrid(user.id);
    };
  }

  onUserConnected() {
    return (user) => {
      console.log('user connected', user);
      this.view.addUserToGrid(user);
    };
  }
}

export default RoomController;
