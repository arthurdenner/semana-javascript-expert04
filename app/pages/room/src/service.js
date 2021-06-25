class RoomService {
  constructor() {
    this.currentPeer = {};
    this.currentUser = {};
  }

  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentPeer(peer) {
    this.currentPeer = peer;
  }

  updateCurrentUserProfile(users) {
    this.currentUser = users.find(
      ({ peerId }) => peerId === this.currentPeer.id
    );
  }
}

export default RoomService;
