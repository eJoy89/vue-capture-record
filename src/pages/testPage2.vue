<template>
    <div>
        <video style="width: 200px; height: 200px;" ref="videoPlayback" src="@/assets/audioTest.mp4" autoplay></video>
        <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="updateVolume">
        {{ volume }}
    </div>
</template>

<script>
export default {
    data() {
        return {
            volume: 0.5 
        };
    },
    methods: {
        updateVolume() {
            const video = this.$refs.videoPlayback;
            video.volume = this.volume;
        }
    },
    mounted() {
        this.$refs.videoPlayback.volume = this.volume;
    }
}
</script>

<style scoped>

</style>
