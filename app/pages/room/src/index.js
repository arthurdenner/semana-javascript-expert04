import { SOCKET_NAMESPACES, SOCKET_URL } from '../../_shared/constants.js';
import SocketBuilder from '../../_shared/socketBuilder.js';
import RoomSocketBuilder from './util/roomSocket.js';
import RoomController from './controller.js';
import RoomView from './view.js';

const roomSocketBuilder = new RoomSocketBuilder({
  namespace: SOCKET_NAMESPACES.ROOM,
  socketUrl: SOCKET_URL,
});

const room = {
  id: '001',
  topic: 'JS Expert',
};

const user = {
  img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/afro_man_male_avatar-512.png',
  username: 'arthurdenner',
};

RoomController.initialize({
  roomInfo: { room, user },
  socketBuilder: roomSocketBuilder,
  view: RoomView,
});
