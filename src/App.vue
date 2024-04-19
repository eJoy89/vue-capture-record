<template>
  <component :is="this.testComp"></component>

  <div>
    <input type="file" ref="inputV" @change="updateInputValue">
    <video v-if="inputValue" :src="inputValue" controls autoplay style="width: 300px; height: 270px; "></video>
  </div>

  <div>
    <button class="button" @click="fetchData('1')">1번</button>
    <button class="button" @click="fetchData('2')">2번</button>
    <button class="button" @click="fetchData('3')">3번</button>
    <button class="button" @click="fetchData('4')">4번</button>
    <button class="button" @click="fetchData('5')">5번</button>

    <div v-for="(list, index) in unis" :key="list" :index="index">
        {{ list.univ_nm }}
    </div>

  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';



export default {
  data() {
    return {
      inputValue: null,
      unis: null,

    };
  },
  computed: {
    testComp() {
      if(this.testBtn === true) {
        return defineAsyncComponent(() => 
          import('@/components/HelloWorld.vue')
        )
      } else {
        return null
      } 
    }    
  },
  methods: {
    changing() {
      this.cities = ['tokyo', 'london', 'paris', 'seoul']
    },
    updateInputValue(event) {
      if (event.target.files.length > 0) {
        this.inputValue = URL.createObjectURL(event.target.files[0]);
      } else {
        this.inputValue = null;
      }
    },
    toggleTestBtn() {
      this.testBtn = !this.testBtn; // testBtn 값을 토글
    },
    fetchData(num) {
      const url = `https://apis.data.go.kr/B260004/OverseasKorProvideService3/getKorProvideList3?serviceKey=jDDorJlGEy5KVTpmpQ%2ByZwmN5QwdCO%2B3sLo1RvCg9I8bwv1YIO3Oo%2BjXLG%2BeFaGq3IrOiUh5bNVgSsbLq3y%2BzQ%3D%3D&pageNo=${num}&numOfRows=50&cond[country_nm::LIKE]=일본`;
      fetch(url)
        .then(response => response.json())
        .then(data => this.unis = data.data)
        .catch(error => console.error('Error:', error));
    }
  },
};
</script>

<style scoped>
.button{
  width: 60px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: lightcoral;
}
</style>
