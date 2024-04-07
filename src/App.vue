<template>
  <div>
    <input type="file" ref="inputV" @change="updateInputValue">
    <video v-if="inputValue" :src="inputValue" controls autoplay style="width: 300px; height: 270px; "></video>
    {{ inputValue }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: null,
    };
  },
  methods: {
    updateInputValue(event) {
      if (event.target.files.length > 0) {
        this.inputValue = URL.createObjectURL(event.target.files[0]);
      } else {
        this.inputValue = null;
      }
    },
  },
};
</script>

<style>
</style>
