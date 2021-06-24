export const EVENTS = {
  USER_CONNECTED: 'userConnection',
  USER_DISCONNECTED: 'userDisconnection',
  JOIN_ROOM: 'joinRoom',
  LOBBY_UPDATED: 'lobbyUpdated',
  UPGRADE_USER_PERMISSION: 'upgradeUserPermission',
};

export const SOCKET_URL = 'http://localhost:3000';

export const SOCKET_NAMESPACES = {
  LOBBY: 'lobby',
  ROOM: 'room',
};

export const PEER_CONFIG = Object.values({
  id: undefined,
});
