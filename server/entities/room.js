import Attendee from './attendee.js';

class Room {
  constructor({
    id,
    topic,
    attendeesCount,
    speakersCount,
    featuredAttendees,
    owner,
    users,
  }) {
    this.id = id;
    this.topic = topic;
    this.attendeesCount = attendeesCount;
    this.speakersCount = speakersCount;
    this.featuredAttendees = featuredAttendees?.map((d) => new Attendee(d));
    this.owner = new Attendee(owner);
    this.users = users;
  }
}

export default Room;
