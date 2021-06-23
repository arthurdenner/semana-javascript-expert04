import { SOCKET_NAMESPACES, SOCKET_URL } from '../../_shared/constants.js';
import SocketBuilder from '../../_shared/socketBuilder.js';
import RoomSocketBuilder from './util/roomSocket.js';
import RoomController from './controller.js';

const roomSocketBuilder = new RoomSocketBuilder({
  namespace: SOCKET_NAMESPACES.ROOM,
  socketUrl: SOCKET_URL,
});

const room = {
  id: '001',
  topic: 'JS Expert',
};

const user = {
  img: 'https://www.iconfinder.com/icons/4043229/afro_avatar_male_man_icon',
  username: 'arthurdenner',
};

RoomController.initialize({
  roomInfo: { room, user },
  socketBuilder: roomSocketBuilder,
});
