import Event from 'events';
import RoomsController from './controllers/roomsController.js';
import { EVENTS } from './util/constants.js';
import SocketServer from './util/socket.js';

const port = process.env.PORT || 3000;
const socketServer = new SocketServer({ port });

const server = await socketServer.start();

const roomsController = new RoomsController();

const namespaces = {
  room: { controller: roomsController, eventEmitter: new Event() },
};

const routeConfig = Object.entries(namespaces).map(
  ([ns, { controller, eventEmitter }]) => {
    const controllerEvents = controller.getEvents();

    eventEmitter.on(
      EVENTS.USER_CONNECTED,
      controller.onNewConnection.bind(controller)
    );

    return {
      [ns]: {
        eventEmitter,
        events: controllerEvents,
      },
    };
  }
);

socketServer.attachEvents({ routeConfig });

console.log(`server running at ${server.address().port}`);
