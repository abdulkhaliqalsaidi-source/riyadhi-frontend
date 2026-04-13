import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { useAuth } from './composables/useAuth'
import { vAnimate } from './composables/useAnimate'

const { init } = useAuth()
init()

const app = createApp(App)
app.use(router)
app.directive('animate', vAnimate)
app.mount('#app')
