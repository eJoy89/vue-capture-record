<template>
    <section style="display: flex; column-gap: 520px; padding: 90px;">
        <div style="width: 300px; height: 300px; border: 1px solid black;">
            <video ref="video1" src="@/assets/audioTest.mp4" autoplay controls></video>
        </div>
        <div style="width: 300px; height: 300px; border: 1px solid red; display: flex; flex-direction: column; justify-content: space-between;">
            <video ref="video2" src="@/assets/audioTest1.mp4" autoplay controls></video>
        </div>
    </section>
    <button @click="toggleRecording">{{ isRecording ? 'Stop and Save Audio' : 'Start Recording' }}</button>
</template>

<script>
    export default {
        data() {
        return {
            isRecording: false,
            mediaRecorder: null,
            audioChunks: [],
            audioContext: null,
            mixedOutput: null,
            videoElements: [],
            audioSources: [],
        };
        },
        methods: {
        async toggleRecording() {
            if (this.isRecording) {
            this.stopRecording();
            } else {
            this.startRecording();
            }
        },
        async startRecording() {
            try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.mixedOutput = this.audioContext.createMediaStreamDestination();
            this.videoElements = [this.$refs.video1, this.$refs.video2];
            this.audioSources = [];
    
            for (const videoElement of this.videoElements) {
                const audioSource = this.audioContext.createMediaElementSource(videoElement);
                this.audioSources.push(audioSource);
                audioSource.connect(this.mixedOutput);
                audioSource.connect(this.audioContext.destination); 
            }
    
            this.mediaRecorder = new MediaRecorder(this.mixedOutput.stream);
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
                this.mediaRecorder.onstop = this.saveRecording;
                this.mediaRecorder.start();
                this.isRecording = true;
            } catch (error) {
                console.error('Error accessing the audio', error);
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
            // this.cleanup();
        },
        cleanup() {
            if (this.audioContext) {
                this.audioContext.close();
            }
        }
        }
    };
</script>

<style>
</style>