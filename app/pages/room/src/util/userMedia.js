class UserMedia {
  static async getUserAudio(audio = true) {
    return navigator.mediaDevices.getUserMedia({ audio });
  }
}

export default UserMedia;
