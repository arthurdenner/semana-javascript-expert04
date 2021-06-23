import Room from './entities/room.js';
import getTemplate from './templates/lobbyItem.js';

const roomGrid = document.getElementById('roomGrid');

class LobbyView {
  static clearRoomList() {
    roomGrid.innerHTML = '';
  }

  static generateRoomLink({ id, topic }) {
    return `./../room/index.html?id=${id}&topic=${topic}`;
  }

  static updateRoomList(rooms) {
    LobbyView.clearRoomList();

    rooms.forEach((room) => {
      const params = new Room({
        ...room,
        roomLink: LobbyView.generateRoomLink(room),
      });
      const htmlTemplate = getTemplate(params);

      roomGrid.innerHTML += htmlTemplate;
    });
  }

  static updateUserImage({ img, username }) {
    imgUser.src = img;
    imgUser.alt = username;
  }
}

export default LobbyView;
