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
            mediaRecorder1: null,
            chunks: [],
            chunks1: []
        };
    },
    methods: {
        async toggleRecording() {
            if (!this.isRecording) {
                this.startRecording();
            } else {
                this.stopRecording();
            }
        },
        startRecording() {
            const videoElement = this.$refs.video1;
            const videoElement1 = this.$refs.video2;

            const stream = videoElement.captureStream();
            const audioTracks = stream.getAudioTracks();

            const stream1 = videoElement1.captureStream();
            const audioTracks1 = stream.getAudioTracks();


            if (audioTracks.length === 0 && stream1 === 0) {
                console.error('No audio track found');
                return;
            }

            const audioStream = new MediaStream(audioTracks);
            this.mediaRecorder = new MediaRecorder(audioStream);
            this.chunks = [];

            const audioStream1 = new MediaStream(audioTracks1);
            this.mediaRecorder1 = new MediaRecorder(audioStream1);
            this.chunks1 = [];

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    this.chunks.push(e.data);
                }
            };

            this.mediaRecorder.start();
            this.isRecording = true;
        },
        stopRecording() {
            this.mediaRecorder.stop();
            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.chunks, { type: 'audio/mp3' });
                const audioURL = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = audioURL;
                a.download = 'extracted_audio.mp3';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(audioURL);
                this.isRecording = false;
            };
        }
    }
};
</script>

<style>
</style>
