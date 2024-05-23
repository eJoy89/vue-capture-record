<template>
    <section style="display: flex; column-gap: 120px; padding: 90px;">
        <div style="width: 300px; height: 300px; border: 1px solid black;">
        <video ref="videoPlayback" src="@/assets/videoplayback.mp4" autoplay controls></video>
        </div>

        <div style="width: 300px; height: 300px; border: 1px solid red; display: flex; flex-direction: column; justify-content: space-between;">
            <video ref="cameraVideo" autoplay></video>
            <div style="width: 100%; display: flex;">
                <button style="width: 50%;" @click="startCamera">카메라</button>
                <button style="width: 50%;" @click="toggleRecording">{{ isRecording ? '녹음 중지' : '녹음' }}</button>
            </div>
        </div>
        <input type="range" min="0" max="2" step="0.1" v-model="microphoneGain" @input="updateMicrophoneGain">

    </section>
</template>

<script>
export default {
    data() {
        return {
        mediaRecorder: null,
        audioChunks: [],
        isRecording: false,
        audioContext: null,
        microphoneStream: null,
        videoAudioStream: null,
        microphoneGain: 1, 
        microphoneGainNode: null 
        };
    },
    methods: {
        async startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                this.$refs.cameraVideo.srcObject = stream;
            } catch (error) {
                console.error('Error accessing the camera', error);
            }
        },
        async toggleRecording() {
            if (this.isRecording) {
                this.stopRecording();
            } else {
                this.startRecording();
            }
        },
        async startRecording() {
            try {
                const microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.microphoneStream = microphoneStream;

                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

                const videoElement = this.$refs.videoPlayback;
                const videoAudioSource = this.audioContext.createMediaElementSource(videoElement);
                this.videoAudioStream = this.audioContext.createMediaStreamDestination();

                const microphoneSource = this.audioContext.createMediaStreamSource(microphoneStream);
                
                // Create GainNode for microphone
                this.microphoneGainNode = this.audioContext.createGain();
                this.microphoneGainNode.gain.value = this.microphoneGain;

                const mixedOutput = this.audioContext.createMediaStreamDestination();

                videoAudioSource.connect(mixedOutput);
                microphoneSource.connect(this.microphoneGainNode).connect(mixedOutput);

                this.mediaRecorder = new MediaRecorder(mixedOutput.stream);
                this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
                };
                this.mediaRecorder.onstop = this.saveRecording;
                this.mediaRecorder.start();
                this.isRecording = true;
            } catch (error) {
                console.error('Error accessing the microphone or video audio', error);
            }
        },
        stopRecording() {
            this.mediaRecorder.stop();
            this.isRecording = false;
        },
        saveRecording() {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const link = document.createElement('a');
            link.href = audioUrl;
            link.download = 'recording.wav';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.audioChunks = [];
            this.cleanup();
        },
        updateMicrophoneGain() {
            if (this.microphoneGainNode) {
                this.microphoneGainNode.gain.value = this.microphoneGain;
            }
        },
        cleanup() {
            if (this.microphoneStream) {
                this.microphoneStream.getTracks().forEach(track => track.stop());
            }
            if (this.audioContext) {
                this.audioContext.close();
            }
        }
    }
};
</script>

<style>
</style>
`