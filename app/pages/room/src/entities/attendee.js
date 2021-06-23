class Attendee {
  constructor({ id, img, isSpeaker, peerId, roomId, username }) {
    this.id = id;
    this.img = img || '';
    this.isSpeaker = isSpeaker;
    this.peerId = peerId;
    this.roomId = roomId;
    this.username = username || 'Usuário Anônimo';

    const [firstName, lastName] = this.username.split(/\s/);
    this.firstName = firstName.concat(' ', id);
    this.lastName = lastName;
  }
}

export default Attendee;
