import Vue from 'vue';
import App from './App.vue';

import VueRouter from 'vue-router';
import routes from './route';
Vue.use(VueRouter);
const router=new VueRouter({routes});

import { Button,Drawer,Icon,Card ,Tag} from 'ant-design-vue';
Vue.use(Button);
Vue.use(Drawer);
Vue.use(Icon);
Vue.use(Card);
Vue.use(Tag);

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
