const PEER_SERVER_URL = 'arthurdenner-peerjs.herokuapp.com';
const WS_SERVER_URL = 'https://arthurdenner-clubhouse-server.herokuapp.com';

export const EVENTS = {
  USER_CONNECTED: 'userConnection',
  USER_DISCONNECTED: 'userDisconnection',
  JOIN_ROOM: 'joinRoom',
  LOBBY_UPDATED: 'lobbyUpdated',
  UPGRADE_USER_PERMISSION: 'upgradeUserPermission',
  SPEAK_ANSWER: 'speakAnswer',
  SPEAK_REQUEST: 'speakRequest',
};

export const SOCKET_URL = WS_SERVER_URL || 'http://localhost:3000';

export const SOCKET_NAMESPACES = {
  LOBBY: 'lobby',
  ROOM: 'room',
};

export const PEER_CONFIG = Object.values({
  id: undefined,
  config: PEER_SERVER_URL
    ? {
        host: PEER_SERVER_URL,
        secure: true,
        path: '/',
      }
    : undefined,
});

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyD0vyC-dOjj-F-ewtvKdqkoS7jCpMwnWwM',
  authDomain: 'semanajsexpert4.firebaseapp.com',
  projectId: 'semanajsexpert4',
  storageBucket: 'semanajsexpert4.appspot.com',
  messagingSenderId: '303237998748',
  appId: '1:303237998748:web:dd1ea366df04d1624ee559',
  measurementId: 'G-NNP80P2PLJ',
};

export const STORAGE_KEY = 'semanajsexpert4:user';
