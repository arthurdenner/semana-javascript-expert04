import {
  PEER_CONFIG,
  SOCKET_NAMESPACES,
  SOCKET_URL,
} from '../../_shared/constants.js';
import PeerBuilder from '../../_shared/peerBuilder.js';
import SocketBuilder from '../../_shared/socketBuilder.js';
import UserDb from '../../_shared/userDb.js';
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

const user = UserDb.get();

if (!user.id) {
  RoomView.redirectToLogin();
}

RoomController.initialize({
  peerBuilder,
  roomInfo: { room, user },
  roomService,
  socketBuilder: roomSocketBuilder,
  view: RoomView,
}).catch((err) => alert(err.message));
