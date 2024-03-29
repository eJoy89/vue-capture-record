import { createApp } from 'vue'
import { createManager } from '@vue-youtube/core';
import App from './App.vue'
import VueRecord from '@codekraft-studio/vue-record'

createApp(App).use(createManager()).use(VueRecord).mount('#app')
