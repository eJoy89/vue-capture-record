<template>
    <div>
        <canvas id="stockGraph" width="150" height="150">

      <div id="captureHere" style="width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center;">
        <div style="width: 300px; height: 300px;" :style="{background: bg1 ? 'lightBlue' : 'green'}"></div>
        <div style="width: 100px; height: 100px;" :style="{background: bg2 ? 'pink' : 'black'}"></div>
      </div>
      <button @click="toggleRecording">{{ isRecording ? 'Stop Recording' : 'Start Recording' }}</button>
    
    </canvas>
    </div>
  </template>
  
  <script>
  import html2canvas from 'html2canvas';
  
  export default {
    data() {
      return {
        bg1: true,
        bg2: true,
        isRecording: false,
        mediaRecorder: null,
        recordedChunks: []
      }
    },
    mounted() {
      setInterval(() => {
        this.bg1 = !this.bg1;
        this.bg2 = !this.bg2;
      }, 1000);
    },
    methods: {
      async toggleRecording() {
        if (this.isRecording) {
          this.mediaRecorder.stop();
        } else {
          this.recordedChunks = [];
          const canvas = await html2canvas(document.getElementById('captureHere'));
          const stream = canvas.captureStream();
          this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm; codecs=vp9'
          });
  
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.recordedChunks.push(event.data);
            }
          };
  
          this.mediaRecorder.onstop = this.handleStop;
          this.mediaRecorder.start();
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
      }
    }
  }
  </script>
  
  <style>
  
  </style>
  