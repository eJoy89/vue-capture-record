<template>
  <div>
    <button @click="toggleCamera">{{ isCameraActive ? '카메라 종료' : '카메라 시작' }}</button>
    <button @click="toggleRecording">{{ isRecording ? '녹음 중지' : '녹음 시작' }}</button>
    <button @click="toggleVideoRecording">{{ isVideoRecording ? '녹화 중지' : '녹화 시작' }}</button>
    <button @click="toggleMusicRecording">{{ isMusicRecording ? '뮤직 녹음 중지' : '뮤직 녹음 시작' }}</button>
    <div v-if="isCameraActive">
      <video ref="video" width="640" height="480" autoplay></video>
    </div>
    <div style="padding-top: 100px;">
      <video ref="music" src="@/assets/videoplayback.mp4" controls></video>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCameraActive: false,
      isRecording: false,
      isVideoRecording: false,
      isMusicRecording: false,
      mediaRecorder: null,
      recordedChunks: [],
      combinedStream: null,
      musicStream: null,
      audioStream: null,
    };
  },
  methods: {
    async toggleCamera() {
      if (this.isCameraActive) {
        this.stopCamera();
      } else {
        await this.startCamera();
      }
    },
    async startCamera() {
      this.isCameraActive = true;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.$refs.video.srcObject = stream;
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    },
    stopCamera() {
      this.isCameraActive = false;
      const stream = this.$refs.video.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    },
    toggleRecording() {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    },
    async startRecording() {
      this.isRecording = true;
      this.recordedChunks = [];
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.combinedStream = new MediaStream([...this.$refs.video.srcObject.getTracks(), ...audioStream.getTracks()]);

        this.mediaRecorder = new MediaRecorder(this.combinedStream);
        this.mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };
        this.mediaRecorder.onstop = this.saveRecording;
        this.mediaRecorder.start();
      } catch (err) {
        console.error("Error accessing microphone: ", err);
      }
    },
    stopRecording() {
      this.isRecording = false;
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
      }
    },
    saveRecording() {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'recording.webm';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    },
    toggleVideoRecording() {
      this.toggleRecording();
      this.isVideoRecording = !this.isVideoRecording;
    },
    toggleMusicRecording() {
      if (this.isMusicRecording) {
        this.stopMusicRecording();
      } else {
        this.startMusicRecording();
      }
    },
    async startMusicRecording() {
      this.isMusicRecording = true;
      this.recordedChunks = [];
      try {
        this.musicStream = this.$refs.music.captureStream();
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // const audioTracks = this.audioStream.getAudioTracks();
        const musicTracks = this.musicStream.getAudioTracks();

        this.combinedStream = new MediaStream([...musicTracks, ...audioStream.getTracks()]);

        this.mediaRecorder = new MediaRecorder(this.combinedStream);
        this.mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };
        this.mediaRecorder.onstop = this.saveRecording;
        this.mediaRecorder.start();
        this.$refs.music.play();
      } catch (err) {
        console.error("Error accessing streams: ", err);
      }
    },
    stopMusicRecording() {
      this.isMusicRecording = false;
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
      }
      this.$refs.music.pause();
    }
  },
};
</script>

<style scoped>
video {
  border: 1px solid black;
}
</style>
