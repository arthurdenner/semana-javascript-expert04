class Attendee {
  constructor({ id, img, isSpeaker, username }) {
    this.id = id;
    this.img = img;
    this.isSpeaker = isSpeaker;
    this.username = username;
  }
}

export default class Room {
  constructor({
    id,
    topic,
    subTopic,
    roomLink,
    attendeesCount,
    speakersCount,
    featuredAttendees,
    owner,
  }) {
    this.id = id;
    this.topic = topic;
    this.subTopic = subTopic || 'Semana JS Expert 4.0';
    this.attendeesCount = attendeesCount;
    this.speakersCount = speakersCount;
    this.featuredAttendees = featuredAttendees?.map((a) => new Attendee(a));
    this.owner = new Attendee(owner);
    this.roomLink = roomLink;
  }
}
