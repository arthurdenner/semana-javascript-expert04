class RoomService {
  constructor() {
    this.currentPeer = {};
  }

  setCurrentPeer(peer) {
    this.currentPeer = peer;
  }
}

export default RoomService;
