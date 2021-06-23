import http from 'http';
import { Server } from 'socket.io';
import { EVENTS } from './constants.js';

class SocketServer {
  #io;

  constructor({ port }) {
    this.port = port;
  }

  attachEvents({ routeConfig }) {
    routeConfig.forEach((route) => {
      Object.entries(route).forEach(([ns, { events, eventEmitter }]) => {
        const route = this.#io.of(`/${ns}`);

        route.on('connection', (socket) => {
          events.forEach((eventHandler, eventName) => {
            socket.on(eventName, (...args) => eventHandler(socket, ...args));
          });

          eventEmitter.emit(EVENTS.USER_CONNECTED, socket);
        });
      });
    });
  }

  async start() {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      });

      res.end('hey there!');
    });

    this.#io = new Server(server, {
      cors: {
        origin: '*',
        credentials: false,
      },
    });

    return new Promise((resolve, reject) => {
      server.on('error', reject);

      server.listen(this.port, () => resolve(server));
    });
  }
}

export default SocketServer;
