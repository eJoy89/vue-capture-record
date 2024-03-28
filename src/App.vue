<template>
  <div>
    <button @click="startRecording" :disabled="recording">시작</button>
    <button @click="stopRecording" :disabled="!recording">종료</button>
    {{ chunks }}
    <button @click="saveScreenshot">화면 캡쳐</button>

    <div v-if="time !== 0">
      {{ formatTime(time) }}
    </div>
    <!-- <div>
      <img src="@/git.gif" alt="" ref="videoElement">
    </div> -->
    <video ref="video" src="@/video22.mp4" controls autoplay></video>
    <button @click="togglePlay">Pause / Unpause</button>

    <youtube-iframe ref="player" @ready="onReady" style="width: 450px; height: 300px;"></youtube-iframe>

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

const onReady = ((event) => {
  event.target.playVideo();
});

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

function startRecording() {
  try {
    const vid = video.value.$el || video.value;
    recorder.value = new MediaRecorder(vid.captureStream());
    chunks.value = [];
    //추가
    time.value = 0;
    timer = setInterval(() => {
      time.value++;
    }, 1000);

    recorder.value.ondataavailable = (e) => {
      chunks.value.push(e.data);
    };

    recorder.value.onstop = async () => {
      // 추가
      clearInterval(timer);
      const blob = new Blob(chunks.value, { type: 'video/webm' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'captured_video.webm';
      document.body.appendChild(a);
      a.click();
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
