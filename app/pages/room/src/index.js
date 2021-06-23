import {
  EVENTS,
  SOCKET_NAMESPACES,
  SOCKET_URL,
} from '../../_shared/constants.js';
import RoomSocketBuilder from './util/roomSocket.js';

const roomSocketBuilder = new RoomSocketBuilder({
  namespace: SOCKET_NAMESPACES.ROOM,
  socketUrl: SOCKET_URL,
});

const socket = roomSocketBuilder
  .setOnUserConnected((user) => console.log('user connected', user))
  .setOnUserDisconnected((user) => console.log('user disconnected', user))
  .setOnRoomUpdated((room) => console.log('room list', room))
  .build();

const room = {
  id: '001',
  topic: 'JS Expert',
};

const user = {
  img: 'https://www.iconfinder.com/icons/4043229/afro_avatar_male_man_icon',
  username: 'arthurdenner',
};

socket.emit(EVENTS.JOIN_ROOM, { room, user });
