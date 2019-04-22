import Vue from 'vue';
import App from './App.vue';
import store from './vuex';
import router from './router';

import request from './api/request';
Vue.prototype.$request=request;

import { Button,Drawer,Icon,Card ,Tag,message,Modal,Spin,Input,Comment,Avatar,Divider,Menu,Form,Checkbox,Table} from 'ant-design-vue';
Vue.use(Button);
Vue.use(Drawer);
Vue.use(Icon);
Vue.use(Card);
Vue.use(Tag);
Vue.use(Spin);
Vue.use(Input);
Vue.use(Comment);
Vue.use(Avatar);
Vue.use(Divider);
Vue.use(Menu);
Vue.use(Form);
Vue.use(Checkbox);
Vue.use(Table);
Vue.prototype.$message=message;
Vue.prototype.$error=Modal.error;

import moment from 'moment';
Vue.filter("dateFormat",function(dataStr,pattern="YYYY-MM-DD HH:mm:ss"){
  return moment(dataStr).format(pattern);
});



const vm=new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

export default vm;
