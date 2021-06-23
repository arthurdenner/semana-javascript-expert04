import {
  EVENTS,
  SOCKET_NAMESPACES,
  SOCKET_URL,
} from '../../_shared/constants.js';
import SocketBuilder from '../../_shared/socketBuilder.js';

const socketBuilder = new SocketBuilder({
  namespace: SOCKET_NAMESPACES.ROOM,
  socketUrl: SOCKET_URL,
});

const socket = socketBuilder
  .setOnUserConnected((user) => console.log('user connected', user))
  .setOnUserDisconnected((user) => console.log('user disconnected', user))
  .build();

const room = {
  id: Date.now(),
  topic: 'JS Expert',
};

const user = {
  img: 'https://www.iconfinder.com/icons/4043229/afro_avatar_male_man_icon',
  username: 'arthurdenner',
};

socket.emit(EVENTS.JOIN_ROOM, { room, user });
