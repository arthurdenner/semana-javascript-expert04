import Attendee from '../entities/attendee.js';
import Room from '../entities/room.js';
import { EVENTS } from '../util/constants.js';

class RoomsController {
  #users = new Map();

  constructor() {
    this.rooms = new Map();
  }

  onNewConnection(socket) {
    const { id } = socket;
    console.log('connection established with', id);
    this.#updateGlobalUserData(id);
  }

  joinRoom(socket, { room, user }) {
    const roomId = room.id;
    user.id = socket.id;

    const updatedUserData = this.#updateGlobalUserData(user.id, user, roomId);
    const updatedRoom = this.#joinUserRoom(socket, updatedUserData, room);

    this.#notifyUsersOnRoom(socket, roomId, updatedUserData);
    this.#replyWithActiveUsers(socket, updatedRoom.users);
  }

  #replyWithActiveUsers(socket, users) {
    // Send current users to user who just joined
    socket.emit(EVENTS.LOBBY_UPDATED, [...users.values()]);
  }

  #notifyUsersOnRoom(socket, roomId, user) {
    // Send new user to existing users
    socket.to(roomId).emit(EVENTS.USER_CONNECTED, user);
  }

  #joinUserRoom(socket, user, room) {
    const roomId = room.id;
    const roomExists = this.rooms.has(roomId);
    const currentRoom = roomExists ? this.rooms.get(roomId) : {};
    const currentUser = new Attendee({
      ...user,
      roomId,
    });

    // Define who's the owner
    const [owner, users] = roomExists
      ? [currentRoom.owner, currentRoom.users]
      : [currentUser, new Set()];

    const updatedRoom = this.#mapRoom({
      ...currentRoom,
      ...room,
      owner,
      users: new Set([...users, ...[currentUser]]),
    });

    this.rooms.set(roomId, updatedRoom);

    socket.join(roomId);

    return this.rooms.get(roomId);
  }

  #mapRoom(room) {
    const users = [...room.users.values()];
    const speakersCount = users.filter((user) => user.isSpeaker).length;
    const featuredAttendees = users.slice(0, 3);

    return new Room({
      ...room,
      featuredAttendees,
      speakersCount,
      attendeesCount: room.users.size,
    });
  }

  #updateGlobalUserData(userId, userData = {}, roomId = '') {
    const user = this.#users.get(userId) ?? {};
    const roomExists = this.rooms.has(roomId);

    const updatedUserData = new Attendee({
      ...user,
      ...userData,
      roomId,
      // Are they the only one in the room?
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
