import Attendee from './entities/attendee.js';
import { getAttendeeTemplate } from './templates/attendeeTemplate.js';

const imgUser = document.getElementById('imgUser');
const roomTopic = document.getElementById('pTopic');
const gridAttendees = document.getElementById('gridAttendees');
const gridSpeakers = document.getElementById('gridSpeakers');

class RoomView {
  static updateUserImage({ img, username }) {
    imgUser.src = img;
    imgUser.alt = username;
  }

  static updateRoomTopic({ topic }) {
    roomTopic.textContent = topic;
  }

  static addUsersToGrid(users) {
    users.forEach(this.addUserToGrid);
  }

  static _getExistingItemOnGrid({ id, baseElement = document }) {
    return baseElement.querySelector(`[id="${id}"]`);
  }

  static removeItemFromGrid(id) {
    this._getExistingItemOnGrid({ id })?.remove();
  }

  static addUserToGrid(user) {
    const attendee = new Attendee(user);
    const htmlTemplate = getAttendeeTemplate(attendee);
    const baseElement = attendee.isSpeaker ? gridSpeakers : gridAttendees;

    baseElement.innerHTML += htmlTemplate;
  }
}

export default RoomView;
