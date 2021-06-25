import UserStream from './entities/userStream.js';

class RoomService {
  constructor({ userMedia }) {
    this.currentPeer = {};
    this.currentStream = {};
    this.currentUser = {};
    this.peers = new Map();
    this.userMedia = userMedia;
  }

  async initialize() {
    this.currentStream = new UserStream({
      isFake: false,
      stream: await this.userMedia.getUserAudio(),
    });
  }

  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentPeer(peer) {
    this.currentPeer = peer;
  }

  updateCurrentUserProfile(user) {
    if (Array.isArray(user)) {
      this.currentUser = user.find(
        ({ peerId }) => peerId === this.currentPeer.id
      );

      return;
    }

    if (user.id !== this.currentUser.id) {
      return;
    }

    this.currentUser = user;
  }

  getCurrentStream() {
    return this.currentUser.isSpeaker
      ? this.currentStream.stream
      : this.userMedia.createFakeMediaStream();
  }

  addReceivedPeer(call) {
    const calledId = call.peer;

    this.peers.set(calledId, { call });

    return {
      isCurrentId: calledId === this.currentUser.id,
    };
  }

  callNewUser(user) {
    if (!this.currentUser.isSpeaker) {
      return;
    }

    this.currentPeer.call(user.peerId, this.getCurrentStream());
  }
}

export default RoomService;
