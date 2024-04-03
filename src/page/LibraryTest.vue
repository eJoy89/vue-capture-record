<template>
    <div>
      <button @click="startRecording" :disabled="recording" @result="onResult" >시작</button>
      <button @click="stopRecording" :disabled="!recording">종료</button>
      {{ chunks }}
      <button @click="saveScreenshot">화면 캡쳐</button>
  
      <div v-if="time !== 0">
        {{ formatTime(time) }}
      </div>
      <!-- <div>
        <img src="@/git.gif" alt="" ref="videoElement">
      </div> -->
      <video ref="video" src="@/DASH.mp4" controls autoplay style="width: 400px; height: 280px;"></video>
      <button @click="togglePlay">Pause / Unpause</button>
  
      <youtube-iframe ref="player" @ready="onReady" style="width: 0; height: 0;"></youtube-iframe>
  
  
      
      <!-- <vue-record-video /> -->
  
    </div>
  </template>
  
  <script setup>
  import { usePlayer } from '@vue-youtube/core';
  import { ref } from 'vue';
  import html2canvas from 'html2canvas';
  
  const player = ref();
  const recording = ref(false);
  const video = ref();
  const recorder = ref(null);
  const chunks = ref([]);
  const time = ref(0);
  let timer = null;
  
  const { togglePlay } = usePlayer('JM88m7SY8FE', player);
  
  
  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const formattedHrs = String(hrs).padStart(2, '0');
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');
    return `${formattedHrs}:${formattedMins}:${formattedSecs}`;
  }
  
  async function saveScreenshot() {
      try {
          const canvas = await html2canvas(video.value);
          const image = canvas.toDataURL("image/jpg");
          const link = document.createElement('a');
          link.href = image;
          link.download = 'screenshot.png';
          link.click();
      } catch (error) {
          console.error('Error saving screenshot:', error);
      }
  }
  
  function onResult (data) {
    console.log('The blob data:', data);
    console.log('Downloadable video', window.URL.createObjectURL(data));
  }
  
  function startRecording() {
    try {
      const vid = video.value.$el || video.value;
      const options = { mimeType: 'video/webm' }; 
      recorder.value = new MediaRecorder(vid.captureStream(), options);
      chunks.value = [];
      
      // Start the timer
      time.value = 0;
      timer = setInterval(() => {
        time.value++;
      }, 1000);
  
      recorder.value.ondataavailable = (e) => {
        console.log(e)
        chunks.value.push(e.data);
      };
  
      recorder.value.onstop = async () => {
        // Clear the timer
        clearInterval(timer);
        
        // Combine the chunks into a single Blob
        const blob = new Blob(chunks.value, { mimeType: 'video/webm' });
  
        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);
  
        // Create a link element to trigger download
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'captured_video.mp4';
        console.log(a)
        document.body.appendChild(a);
  
        // Trigger the download
        a.click();
  
        // Clean up
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      };
  
      recording.value = true;
      recorder.value.start();
    } catch (error) {
      console.error('오류:', error);
    }
  }
  
  function stopRecording() {
    if (recorder.value && recording.value) {
      recording.value = false;
      // 추가
      clearInterval(timer);
      time.value = 0
      
      recorder.value.stop();
    }
  }
  </script>
<template>
    <div>
      <button @click="startRecording" :disabled="recording" @result="onResult" >시작</button>
      <button @click="stopRecording" :disabled="!recording">종료</button>
      {{ chunks }}
      <button @click="saveScreenshot">화면 캡쳐</button>
  
      <div v-if="time !== 0">
        {{ formatTime(time) }}
      </div>
      <!-- <div>
        <img src="@/git.gif" alt="" ref="videoElement">
      </div> -->
      <video ref="video" src="@/DASH.mp4" controls autoplay style="width: 400px; height: 280px;"></video>
      <button @click="togglePlay">Pause / Unpause</button>
  
      <youtube-iframe ref="player" @ready="onReady" style="width: 0; height: 0;"></youtube-iframe>
  
  
      
      <!-- <vue-record-video /> -->
  
    </div>
  </template>
  
  <script setup>
  import { usePlayer } from '@vue-youtube/core';
  import { ref } from 'vue';
  import html2canvas from 'html2canvas';
  
  const player = ref();
  const recording = ref(false);
  const video = ref();
  const recorder = ref(null);
  const chunks = ref([]);
  const time = ref(0);
  let timer = null;
  
  const { togglePlay } = usePlayer('JM88m7SY8FE', player);
  
  
  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const formattedHrs = String(hrs).padStart(2, '0');
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');
    return `${formattedHrs}:${formattedMins}:${formattedSecs}`;
  }
  
  async function saveScreenshot() {
      try {
          const canvas = await html2canvas(video.value);
          const image = canvas.toDataURL("image/jpg");
          const link = document.createElement('a');
          link.href = image;
          link.download = 'screenshot.png';
          link.click();
      } catch (error) {
          console.error('Error saving screenshot:', error);
      }
  }
  
  function onResult (data) {
    console.log('The blob data:', data);
    console.log('Downloadable video', window.URL.createObjectURL(data));
  }
  
  function startRecording() {
    try {
      const vid = video.value.$el || video.value;
      const options = { mimeType: 'video/webm' }; 
      recorder.value = new MediaRecorder(vid.captureStream(), options);
      chunks.value = [];
      
      // Start the timer
      time.value = 0;
      timer = setInterval(() => {
        time.value++;
      }, 1000);
  
      recorder.value.ondataavailable = (e) => {
        console.log(e)
        chunks.value.push(e.data);
      };
  
      recorder.value.onstop = async () => {
        // Clear the timer
        clearInterval(timer);
        
        // Combine the chunks into a single Blob
        const blob = new Blob(chunks.value, { mimeType: 'video/webm' });
  
        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);
  
        // Create a link element to trigger download
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'captured_video.mp4';
        console.log(a)
        document.body.appendChild(a);
  
        // Trigger the download
        a.click();
  
        // Clean up
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      };
  
      recording.value = true;
      recorder.value.start();
    } catch (error) {
      console.error('오류:', error);
    }
  }
  
  function stopRecording() {
    if (recorder.value && recording.value) {
      recording.value = false;
      // 추가
      clearInterval(timer);
      time.value = 0
      
      recorder.value.stop();
    }
  }
  </script>
    







    <template>
        <h1>use-screen-recorder-composition</h1>
        <div>
          <button
            v-if="['idle', 'permission-requested', 'error'].includes(screenRecorder.status)"
            @click="screenRecorder.actions.startRecording()"
          >
            start recording
          </button>
          <button
            v-if="['recording', 'paused'].includes(screenRecorder.status)"
            @click="screenRecorder.actions.stopRecording()"
          >
            stop recording
          </button>
          <template v-if="['recording', 'paused'].includes(screenRecorder.status)">
            <button
              v-if="screenRecorder.status === 'paused'"
              @click="screenRecorder.actions.resumeRecording()"
            >
              resume recording
            </button>
            <button v-else @click="screenRecorder.actions.pauseRecording()">
              pause recording
            </button>
          </template>
          <button
            v-if="['stopped'].includes(screenRecorder.status)"
            @click="screenRecorder.actions.resetRecording()"
          >
            reset recording
          </button>
        </div>
        <video
          v-if="screenRecorder.blobUrl"
          :src="screenRecorder.blobUrl"
          autoplay
          controls
        />
        {{ screenRecorder.blobUrl }}
      </template>
      
      <script setup >
      import useScreenRecorder from "use-screen-recorder-composition";
      const screenRecorder = useScreenRecorder();
      </script>
      
      <style>
      #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
      }
      video {
        max-width: 800px;
        max-height: 500px;
      }
      </style>