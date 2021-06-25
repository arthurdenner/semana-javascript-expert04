import Attendee from './entities/attendee.js';
import getAttendeeTemplate from './templates/attendeeTemplate.js';

const imgUser = document.getElementById('imgUser');
const roomTopic = document.getElementById('pTopic');
const gridAttendees = document.getElementById('gridAttendees');
const gridSpeakers = document.getElementById('gridSpeakers');
const btnClap = document.getElementById('btnClap');
const btnClipBoard = document.getElementById('btnClipBoard');
const btnMicrophone = document.getElementById('btnMicrophone');

class RoomView {
  static updateUserImage({ img, username }) {
    imgUser.src = img;
    imgUser.alt = username;
  }

  static updateRoomTopic({ topic }) {
    roomTopic.textContent = topic;
  }

  static addUsersToGrid(users) {
    users.forEach(RoomView.addUserToGrid);
  }

  static _getExistingItemOnGrid({ id, baseElement = document }) {
    return baseElement.querySelector(`[id="${id}"]`);
  }

  static removeItemFromGrid(id) {
    RoomView._getExistingItemOnGrid({ id })?.remove();
  }

  static addUserToGrid(user, removeFirst = false) {
    const attendee = new Attendee(user);
    const id = attendee.id;
    const htmlTemplate = getAttendeeTemplate(attendee);
    const baseElement = attendee.isSpeaker ? gridSpeakers : gridAttendees;

    if (removeFirst) {
      RoomView.removeItemFromGrid(id);
      baseElement.innerHTML += htmlTemplate;
      return;
    }

    const existingItem = RoomView._getExistingItemOnGrid({ id, baseElement });

    if (existingItem) {
      existingItem.innerHTML = htmlTemplate;
      return;
    }

    baseElement.innerHTML += htmlTemplate;
  }

  static showUserFeatures(user) {
    if (user.isSpeaker) {
      btnClap.classList.add('hidden');
      btnClipBoard.classList.remove('hidden');
      btnMicrophone.classList.remove('hidden');
      return;
    }

    btnClap.classList.remove('hidden');
    btnClipBoard.classList.add('hidden');
    btnMicrophone.classList.add('hidden');
  }
}

export default RoomView;
