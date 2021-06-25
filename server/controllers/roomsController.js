import Attendee from '../entities/attendee.js';
import Room from '../entities/room.js';
import { EVENTS } from '../util/constants.js';
import CustomMap from '../util/customMap.js';

class RoomsController {
  #roomsPubSub;
  #users = new Map();

  constructor({ roomsPubSub }) {
    this.#roomsPubSub = roomsPubSub;
    this.rooms = new CustomMap({
      customMapper: this.#mapRoom,
      observer: this.#roomObserver(),
    });
  }

  #roomObserver() {
    return {
      notify: (rooms) => {
        this.#roomsPubSub.emit(EVENTS.LOBBY_UPDATED, [...rooms.values()]);
      },
    };
  }

  onNewConnection(socket) {
    const { id } = socket;
    console.log('[Rooms] connection established with', id);
    this.#updateGlobalUserData(id);
  }

  disconnect(socket) {
    this.#logoutUser(socket);
  }

  // TODO: Refactor and translate it
  #logoutUser(socket) {
    const userId = socket.id;
    const user = this.#users.get(userId);
    const roomId = user.roomId;
    // remover user da lista de usuarios ativos
    this.#users.delete(userId);

    // caso seja um usuario sujeira que estava em uma sala que não existe mais
    if (!this.rooms.has(roomId)) {
      return;
    }

    const room = this.rooms.get(roomId);
    const toBeRemoved = [...room.users].find(({ id }) => id === userId);

    // removemos o usuario da sala
    room.users.delete(toBeRemoved);

    // se não tiver mais nenhum usuario na sala, matamos a sala
    if (!room.users.size) {
      this.rooms.delete(roomId);
      return;
    }

    const disconnectedUserWasAnOwner = userId === room.owner.id;
    const onlyOneUserLeft = room.users.size === 1;

    // validar se tem somente um usuario ou se o usuario era o dono da sala
    if (onlyOneUserLeft || disconnectedUserWasAnOwner) {
      room.owner = this.#getNewRoomOwner(room, socket);
    }

    // atualiza a room no final
    this.rooms.set(roomId, room);

    // notifica a sala que o usuario se desconectou
    socket.to(roomId).emit(EVENTS.USER_DISCONNECTED, user);
  }

  #notifyUserProfileUpgrade(socket, roomId, user) {
    socket.to(roomId).emit(EVENTS.UPGRADE_USER_PERMISSION, user);
  }

  // TODO: Refactor and translate it
  #getNewRoomOwner(room, socket) {
    const users = [...room.users.values()];
    const activeSpeakers = users.find((user) => user.isSpeaker);
    // se quem desconectou era o dono, passa a liderança para o próximo
    // se não houver speakers, ele pega o attendee mais antigo (primeira posição)
    const [newOwner] = activeSpeakers ? [activeSpeakers] : users;
    newOwner.isSpeaker = true;

    const currentUserData = this.#users.get(newOwner.id);
    const updatedUserData = new Attendee({
      ...currentUserData,
      ...newOwner,
    });

    this.#users.set(newOwner.id, updatedUserData);

    this.#notifyUserProfileUpgrade(socket, room.id, updatedUserData);

    return newOwner;
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
