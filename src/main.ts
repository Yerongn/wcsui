import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from '/@/App.vue';
import router from '/@/router';
import { directive } from '/@/directive/index';
import other from '/@/utils/other';
import 'virtual:svg-icons-register';

import ElementPlus from 'element-plus';
import '/@/theme/index.scss';

import VueKonva from 'vue-konva';

const app = createApp(App);

directive(app);
other.elSvg(app);

app.use(pinia).use(router).use(ElementPlus).use(VueKonva).mount('#app');
