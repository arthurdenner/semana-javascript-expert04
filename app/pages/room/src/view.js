const imgUser = document.getElementById('imgUser');
const roomTopic = document.getElementById('pTopic');

class RoomView {
  static updateUserImage({ img, username }) {
    imgUser.src = img;
    imgUser.alt = username;
  }

  static updateRoomTopic({ topic }) {
    roomTopic.textContent = topic;
  }
}

export default RoomView;
