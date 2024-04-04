import { createApp } from 'vue'
import { createManager } from '@vue-youtube/core';
import App from './App.vue'

createApp(App).use(createManager()).mount('#app')
