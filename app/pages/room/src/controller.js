import { EVENTS } from '../../_shared/constants.js';

class RoomController {
  constructor({ peerBuilder, roomInfo, roomService, socketBuilder, view }) {
    this.peerBuilder = peerBuilder;
    this.roomInfo = roomInfo;
    this.roomService = roomService;
    this.socketBuilder = socketBuilder;
    this.socket = {};
    this.view = view;
  }

  static initialize(deps) {
    return new RoomController(deps)._initialize();
  }

  async _initialize() {
    this._setupViewEvents();
    await this.roomService.initialize();
    this.socket = this._setupSocket();
    this.roomService.setCurrentPeer(await this._setupWebRTC());
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
      .setOnCallReceived(this.onCallReceived())
      .setOnCallError(this.onCallError())
      .setOnCallClose(this.onCallClose())
      .setOnStreamReceived(this.onStreamReceived())
      .build();
  }

  onStreamReceived() {
    return (call, stream) => {
      console.log('onStreamReceived', call, stream);
      const callerId = call.peer;
      const { isCurrentId } = this.roomService.addReceivedPeer(call);

      this.view.renderAudioElement({ callerId, isCurrentId, stream });
    };
  }

  onCallClose() {
    return (call) => {
      console.log('onCallClose', call);
      this.roomService.disconnectPeer({ peerId: call.peer });
    };
  }

  onCallError() {
    return (call, error) => {
      console.log('onCallError', call, error);
      this.roomService.disconnectPeer({ peerId: call.peer });
    };
  }

  onCallReceived() {
    return (call) => {
      console.log('onCallReceived', call);
      call.answer(this.roomService.getCurrentStream());
    };
  }

  onPeerConnectionOpened() {
    return (peer) => {
      console.log('peer', peer);
      this.roomInfo.user.peerId = peer.id;
      this.socket.emit(EVENTS.JOIN_ROOM, this.roomInfo);
    };
  }

  onPeerError() {
    return (error) => {
      console.error('onPeerError', error);
    };
  }

  onRoomUpdated() {
    return (users) => {
      this.view.addUsersToGrid(users);
      this.roomService.updateCurrentUserProfile(users);
      this.activateUserFeatures();
    };
  }

  onUserProfileUpgrade() {
    return (user) => {
      console.log('user upgraded', user);

      if (user.isSpeaker) {
        this.roomService.updateCurrentUserProfile(user);
        this.view.addUserToGrid(user, true);
      }

      this.activateUserFeatures();
    };
  }

  onUserDisconnected() {
    return (user) => {
      console.log('user disconnected', user);
      this.view.removeItemFromGrid(user.id);
      this.roomService.disconnectPeer(user);
    };
  }

  onUserConnected() {
    return (user) => {
      console.log('user connected', user);
      this.view.addUserToGrid(user);
      this.roomService.callNewUser(user);
    };
  }

  activateUserFeatures() {
    this.view.showUserFeatures(this.roomService.getCurrentUser());
  }
}

export default RoomController;
