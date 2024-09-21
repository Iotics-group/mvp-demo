import { createApp } from 'vue'
import './renderer/assets/css/font.css'
import './renderer/assets/css/main.css'
import notify from '@/renderer/components/modals/notify.vue'
import notify2 from '@/renderer/components/modals/notify2.vue'
import Icons from '@/renderer/components/icons.vue'
import App from './App.vue'
import axios from '@/renderer/plugins/axios'
import checkReq from '@/renderer/events/async'
import router  from './renderer/router/index'
import locale from './renderer/locale/index.json'
import i18n from './renderer/plugins/i18.js';
import license from './renderer/plugins/license.js';
    
const app = createApp(App)
// eslint-disable-next-line
app.component("notify", notify)
// eslint-disable-next-line
app.component("notify2", notify2)
app.config.globalProperties.$axios = axios;
// eslint-disable-next-line
app.component("Icons", Icons)
app.config.globalProperties.$locale = locale;
app.config.globalProperties.$checkReq = checkReq;
app.use(router)
app.config.globalProperties.$i18n = (i18n)
app.config.globalProperties.$license = (license)
app.mount('#app')
