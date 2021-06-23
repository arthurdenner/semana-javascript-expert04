import { SOCKET_NAMESPACES, SOCKET_URL } from '../../_shared/constants.js';
import LobbyController from './controller.js';
import LobbySocketBuilder from './util/lobbySocketBuilder.js';

const user = {
  img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/afro_man_male_avatar-512.png',
  username: 'arthurdenner',
};

const socketBuilder = new LobbySocketBuilder({
  socketUrl: SOCKET_URL,
  namespace: SOCKET_NAMESPACES.LOBBY,
});

const dependencies = {
  socketBuilder,
  user,
};

await LobbyController.initialize(dependencies);
