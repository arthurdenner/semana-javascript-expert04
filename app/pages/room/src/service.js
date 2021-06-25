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
}

export default RoomService;
