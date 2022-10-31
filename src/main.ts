import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import PrimeVue from 'primevue/config';
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue);
app.use(router)

app.mount('#app')
