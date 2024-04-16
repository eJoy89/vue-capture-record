<template>
    <div>
        <button @click="fetchData">영화</button>
        <div v-if="responseData">
        <div v-for="(list, index) in this.responseData" :key="list" :index="index">
            <div v-for="(item, index) in list.dailyBoxOfficeList" :key="item" :index="index">
                {{ item.movieNm }}
                ////
                {{ 'fixed' }}
                {{ item.audiCnt }}
            </div>
        </div>
    </div>
    
    <button>git</button>

    <button @click="bakery">빵집</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            responseData: null,
            error: null
        };
    },
    methods: {
        async fetchData() {
            try {
                const response = await axios.get('http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=f5eef3421c602c6cb7ea224104795888&targetDt=20240301');
                this.responseData = response.data;
                console.log(this.responseData)
            } catch (error) {
                console.error('Error fetching data:', error);
                this.error = error.message;
            }
        },
        async bakery() {
            try {
                const response = await axios.get('https://apis.data.go.kr/5690000/sejong_bakery/getBakery?serviceKey=jDDorJlGEy5KVTpmpQ%2ByZwmN5QwdCO%2B3sLo1RvCg9I8bwv1YIO3Oo%2BjXLG%2BeFaGq3IrOiUh5bNVgSsbLq3y%2BzQ%3D%3D&pageNo=1&numOfRows=10')
                console.log(response.data.body);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }
};
</script>

<style>
</style>