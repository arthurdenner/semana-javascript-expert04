import { EVENTS } from '../util/constants.js';

class RoomsController {
  constructor() {}

  onNewConnection(socket) {
    const { id } = socket;
    console.log('connection established with', id);
  }

  joinRoom(socket, data) {
    console.log('data received', data);

    socket.emit(EVENTS.USER_CONNECTED, data);
  }

  getEvents() {
    const fns = Reflect.ownKeys(RoomsController.prototype)
      .filter((name) => name !== 'constructor')
      .map((name) => [name, this[name].bind(this)]);

    return new Map(fns);
  }
}

export default RoomsController;
