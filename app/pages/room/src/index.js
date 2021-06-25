import {
  PEER_CONFIG,
  SOCKET_NAMESPACES,
  SOCKET_URL,
} from '../../_shared/constants.js';
import PeerBuilder from '../../_shared/peerBuilder.js';
import SocketBuilder from '../../_shared/socketBuilder.js';
import RoomSocketBuilder from './util/roomSocket.js';
import UserMedia from './util/userMedia.js';
import RoomController from './controller.js';
import RoomService from './service.js';
import RoomView from './view.js';

const peerBuilder = new PeerBuilder({
  peerConfig: PEER_CONFIG,
});

const roomSocketBuilder = new RoomSocketBuilder({
  namespace: SOCKET_NAMESPACES.ROOM,
  socketUrl: SOCKET_URL,
});

const roomService = new RoomService({
  userMedia: UserMedia,
});

const urlParams = new URLSearchParams(window.location.search);

const room = {
  id: urlParams.get('id'),
  topic: urlParams.get('topic'),
};

const user = {
  img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/afro_man_male_avatar-512.png',
  username: 'arthurdenner',
};

await RoomController.initialize({
  peerBuilder,
  roomInfo: { room, user },
  roomService,
  socketBuilder: roomSocketBuilder,
  view: RoomView,
});
