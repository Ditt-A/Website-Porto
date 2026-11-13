import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { finishStartup } from './startup'

createApp(App).mount('#app')
void finishStartup()
