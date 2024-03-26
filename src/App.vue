<template>
  <div>
    <button @click="startRecording" :disabled="recording">시작</button>
    <button @click="stopRecording" :disabled="!recording">종료</button>
{{ chunks }}
    <button @click="saveScreenshot">화면 캡쳐</button>
    <!-- <div>
      <img src="@/git.gif" alt="" ref="videoElement">
    </div> -->
    <video ref="videoElement" src="@/video22.mp4" controls autoplay></video>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';


export default {
  data() {
    return {
      recording: false,
      video: null,
      recorder: null,
      chunks: [],
    };
  },
  methods: {
    async saveScreenshot() {
        try {
            const canvas = await html2canvas(document.body);
            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = 'screenshot.png';
            link.click();
        } catch (error) {
            console.error('Error saving screenshot:', error);
        }
    },

    async startRecording() {
      try {
        const video = this.$refs.videoElement;
        this.video = video;

        this.recorder = new MediaRecorder(video.captureStream());
        this.chunks = [];
        console.log(this.chunks)

        this.recorder.ondataavailable = (e) => {
          this.chunks.push(e.data);
        };

        this.recorder.onstop = async () => {
          const blob = new Blob(this.chunks, { type: 'video/webm' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'captured_video.webm';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        };

        this.recording = true;
        this.recorder.start();
      } catch (error) {
        console.error('오류:', error);
      }
    },
    stopRecording() {
      if (this.recorder && this.recording) {
        this.recording = false;
        this.recorder.stop();
      }
    },
  },
};
</script>
