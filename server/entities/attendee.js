class Attendee {
  constructor({ id, img, isSpeaker, peerId, roomId, username }) {
    this.id = id;
    this.img = img;
    this.isSpeaker = isSpeaker;
    this.peerId = peerId;
    this.roomId = roomId;
    this.username = username;
  }
}

export default Attendee;
