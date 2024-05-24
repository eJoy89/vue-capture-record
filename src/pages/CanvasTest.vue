<template>
    <canvas ref="canvas" width="1000" height="500" style="border: 1px solid black;"></canvas>
    <button @click="startRecording">start recording</button>
    <button @click="stopRecording">stop recording</button>
</template>

<script>
export default {
    data() {
        return {
            mediaRecorder: null,
            recordedChunks: []
        };
    },
    mounted() {
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext('2d');
        let x = canvas.width / 2;
        let y = canvas.height / 2;
        let dx = 2;
        let dy = 2;
        let radius = 20;

        const stream = canvas.captureStream();
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.recordedChunks.push(event.data);
            }
        };
        
        this.mediaRecorder.onstop = this.handleStop;

        const drawBall = () => {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath();
        };

        const update = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();
            x += dx;
            y += dy;

            if (x + radius > canvas.width || x - radius < 0) {
                dx = -dx;
            }

            if (y + radius > canvas.height || y - radius < 0) {
                dy = -dy;
            }

            requestAnimationFrame(update);
        };

        update();
    },
    methods: {
        startRecording() {
            this.recordedChunks = [];
            this.mediaRecorder.start();
        },
        stopRecording() {
            this.mediaRecorder.stop();
        },
        handleStop() {
            const blob = new Blob(this.recordedChunks, {
                type: 'video/webm'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'canvas-recording.webm';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
        }
    }
}
</script>

<style>

</style>
