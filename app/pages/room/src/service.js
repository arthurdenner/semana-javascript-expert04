import UserStream from './entities/userStream.js';

class RoomService {
  constructor({ userMedia }) {
    this.currentPeer = {};
    this.currentStream = {};
    this.currentUser = {};
    this.isAudioActive = true;
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
    this.currentUser = user.find(
      ({ peerId }) => peerId === this.currentPeer.id
    );
  }

  async upgradeUserPermission(user) {
    if (!user.isSpeaker) {
      return;
    }

    if (user.id !== this.currentUser.id) {
      return;
    }

    this.currentUser = user;

    return this._reconnectAsSpeaker();
  }

  async toggleAudioActivation() {
    this.isAudioActive = !this.isAudioActive;
    this.switchAudioStreamSource({ realAudio: this.isAudioActive });
  }

  async _reconnectAsSpeaker() {
    return this.switchAudioStreamSource({ realAudio: true });
  }

  _reconnectPeers(stream) {
    for (const peer of this.peers.values()) {
      const peerId = peer.call.peer;
      peer.call.close();
      console.log('calling', peerId);

      this.currentPeer.call(peerId, stream);
    }
  }

  async switchAudioStreamSource({ realAudio }) {
    const userAudio = realAudio
      ? await this.userMedia.getUserAudio()
      : this.userMedia.createFakeMediaStream();

    this.currentStream = new UserStream({
      isFake: realAudio,
      stream: userAudio,
    });

    this.currentUser.isSpeaker = realAudio;

    // We need to close and restart all calls
    this._reconnectPeers(this.currentStream.stream);
  }

  getCurrentStream() {
    return this.currentUser.isSpeaker
      ? this.currentStream.stream
      : this.userMedia.createFakeMediaStream();
  }

  disconnectPeer({ peerId }) {
    if (!this.peers.has(peerId)) {
      return;
    }

    this.peers.get(peerId).call.close();
    this.peers.delete(peerId);
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
