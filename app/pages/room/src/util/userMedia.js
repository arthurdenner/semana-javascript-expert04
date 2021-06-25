class UserMedia {
  static async getUserAudio(audio = true) {
    return navigator.mediaDevices.getUserMedia({ audio });
  }

  static createFakeMediaStream() {
    return new MediaStream([UserMedia._createEmptyAudioTrack()]);
  }

  static _createEmptyAudioTrack() {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const destination = oscillator.connect(
      audioContext.createMediaStreamDestination()
    );
    oscillator.start();
    const [track] = destination.stream.getAudioTracks();

    return Object.assign(track, { enabled: false });
  }
}

export default UserMedia;
