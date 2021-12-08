import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router';
import store from './store'
import * as ElIconModules from '@element-plus/icons'
import App from './App.vue'
import 'animate.css';

const app = createApp(App)
const transElIconName = (iconName) => {
    return 'i' + iconName.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase())
}
for (let iconName in ElIconModules) {
    app.component(transElIconName(iconName), ElIconModules[iconName])
}
app.use(ElementPlus).use(router).use(store).mount('#app')