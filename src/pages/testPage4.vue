<template>
    <div>
      <canvas id="captureHere" width="800" height="600" style="border: 1px solid black;"></canvas>
      <button @click="toggleRecording">{{ isRecording ? 'Stop Recording' : 'Start Recording' }}</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isRecording: false,
        mediaRecorder: null,
        recordedChunks: [],
        context: null,
        intervalId: null,
        colorToggle: true,
      }
    },
    mounted() {
      const canvas = document.getElementById('captureHere');
      this.context = canvas.getContext('2d');
      this.startDrawing();
    },
    methods: {
      startDrawing() {
        this.intervalId = setInterval(() => {
          this.colorToggle = !this.colorToggle;
          this.context.fillStyle = this.colorToggle ? 'lightBlue' : 'green';
          this.context.fillRect(0, 0, 800, 600);
  
          this.context.fillStyle = this.colorToggle ? 'pink' : 'black';
          this.context.fillRect(50, 50, 100, 100);
        }, 1000);
      },
      stopDrawing() {
        clearInterval(this.intervalId);
      },
      async toggleRecording() {
        if (this.isRecording) {
          this.mediaRecorder.stop();
          this.stopDrawing();
        } else {
          this.recordedChunks = [];
          const canvas = document.getElementById('captureHere');
          const stream = canvas.captureStream();
          this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm'
          });
  
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.recordedChunks.push(event.data);
            }
          };
  
          this.mediaRecorder.onstop = this.handleStop;
          this.mediaRecorder.start();
          this.startDrawing();
        }
        this.isRecording = !this.isRecording;
      },
      handleStop() {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'capture.webm';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
  
        this.$refs.recordedVideo.src = url;
        this.$refs.recordedVideo.style.display = 'block';
        this.$refs.recordedVideo.play();
      }
    }
  }
  </script>
  
  <style>
  </style>
  