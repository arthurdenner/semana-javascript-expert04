import { EVENTS } from '../util/constants.js';

class LobbyController {
  constructor({ activeRooms, roomsListener }) {
    this.activeRooms = activeRooms;
    this.roomsListener = roomsListener;
  }

  onNewConnection(socket) {
    const { id } = socket;
    console.log('[Lobby] connection established with', id);
    this.#updateLobbyRooms(socket, [...this.activeRooms.values()]);
    this.#setupRoomListener(socket);
  }

  #setupRoomListener(socket) {
    this.roomsListener.on(EVENTS.LOBBY_UPDATED, (activeRooms) => {
      console.log('rooms updated', activeRooms);
      this.#updateLobbyRooms(socket, activeRooms);
    });
  }

  #updateLobbyRooms(socket, activeRooms) {
    socket.emit(EVENTS.LOBBY_UPDATED, activeRooms);
  }

  getEvents() {
    const fns = Reflect.ownKeys(LobbyController.prototype)
      .filter((name) => name !== 'constructor')
      .map((name) => [name, this[name].bind(this)]);

    return new Map(fns);
  }
}

export default LobbyController;
