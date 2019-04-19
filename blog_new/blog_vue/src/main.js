import Vue from 'vue';
import App from './App.vue';

import VueRouter from 'vue-router';
import routes from './route';
Vue.use(VueRouter);
const router=new VueRouter({routes});

import { Button,Drawer,Icon,Card ,Tag,message,Modal,Spin,Input,Comment,Avatar,Divider,Menu,Form} from 'ant-design-vue';
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
Vue.prototype.$message=message;
Vue.prototype.$error=Modal.error;

import moment from 'moment';
Vue.filter("dateFormat",function(dataStr,pattern="YYYY-MM-DD HH:mm:ss"){
  return moment(dataStr).format(pattern);
});

import Vuex from 'vuex';
Vue.use(Vuex);
const store=new Vuex.Store({
  state:{
    searchBoxFlag:false
  },
  mutations:{
    toggleSearchBox(state){
      state.searchBoxFlag=!state.searchBoxFlag;
    }
  },
  getters:{
    // this.store.getters.test
    test:function(state){
      return !state.searchBoxFlag;
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
