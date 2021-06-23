import Attendee from '../entities/attendee.js';
import { EVENTS } from '../util/constants.js';

class RoomsController {
  #users = new Map();

  constructor() {
    this.rooms = new Map();
  }

  onNewConnection(socket) {
    const { id } = socket;
    console.log('connection established with', id);
  }

  joinRoom(socket, { room, user }) {
    user.id = socket.id;

    const updatedUserData = this.#updateGlobalUsersData(user.id, user, room.id);

    socket.emit(EVENTS.USER_CONNECTED, updatedUserData);
  }

  #updateGlobalUsersData(userId, userData = {}, roomId = '') {
    const user = this.#users.get(userId) ?? {};
    const roomExists = this.rooms.get(roomId);

    const updatedUserData = new Attendee({
      ...user,
      ...userData,
      roomId,
      // se for o único na sala
      isSpeaker: !roomExists,
    });

    this.#users.set(userId, updatedUserData);

    return this.#users.get(userId);
  }

  getEvents() {
    const fns = Reflect.ownKeys(RoomsController.prototype)
      .filter((name) => name !== 'constructor')
      .map((name) => [name, this[name].bind(this)]);

    return new Map(fns);
  }
}

export default RoomsController;
