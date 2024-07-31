import { createApp } from 'vue'
import './renderer/assets/css/font.css'
import './renderer/assets/css/main.css'
import notify from '@/renderer/components/modals/notify.vue'
import notify2 from '@/renderer/components/modals/notify2.vue'
import Icons from '@/renderer/components/icons.vue'
import App from './App.vue'
import router  from './renderer/router/index'
import axios from '@/renderer/plugins/axios'
import locale from './renderer/locale/index.json'
import i18n from './renderer/plugins/i18.js';
import license from './renderer/plugins/license.js';
    
const app = createApp(App)
// eslint-disable-next-line
app.component("notify", notify)
// eslint-disable-next-line
app.component("notify2", notify2)
// eslint-disable-next-line
app.component("Icons", Icons)
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$locale = locale;
app.use(router)
app.config.globalProperties.$i18n = (i18n)
app.config.globalProperties.$license = (license)
app.mount('#app')
