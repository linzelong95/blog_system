import Vue from 'vue';
import App from './App.vue';

import VueRouter from 'vue-router';
import routes from './route';
Vue.use(VueRouter);
const router=new VueRouter({routes});

import { Button,Drawer,Icon,Card ,Tag,message,Modal} from 'ant-design-vue';
Vue.use(Button);
Vue.use(Drawer);
Vue.use(Icon);
Vue.use(Card);
Vue.use(Tag);
Vue.prototype.$message=message;
Vue.prototype.$error=Modal.error;

import moment from 'moment';
Vue.filter("dateFormat",function(dataStr,pattern="YYYY-MM-DD HH:mm:ss"){
  return moment(dataStr).format(pattern);
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
