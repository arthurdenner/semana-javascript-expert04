import { SOCKET_NAMESPACES, SOCKET_URL } from '../../_shared/constants.js';
import UserDb from '../../_shared/userDb.js';
import LobbyController from './controller.js';
import LobbyView from './view.js';
import LobbySocketBuilder from './util/lobbySocketBuilder.js';

const user = UserDb.get();

if (!user.id) {
  LobbyView.redirectToLogin();
}

const socketBuilder = new LobbySocketBuilder({
  socketUrl: SOCKET_URL,
  namespace: SOCKET_NAMESPACES.LOBBY,
});

const dependencies = {
  socketBuilder,
  user,
  view: LobbyView,
};

LobbyController.initialize(dependencies).catch((err) => alert(err.message));
