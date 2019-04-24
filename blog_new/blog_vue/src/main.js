import Vue from 'vue';
import App from './App.vue';
import store from './vuex';
import router from './router';

import request from './api/request';
Vue.prototype.$request=request;

import { Button,Drawer,Icon,Card ,Tag,message,Modal,Spin,Input,Comment,Avatar,Divider,Menu,Form,Checkbox,Table,Badge,Select,Breadcrumb} from 'ant-design-vue';
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
Vue.use(Badge);
Vue.use(Select);
Vue.use(Modal);
Vue.use(Breadcrumb);
Vue.prototype.$message=message;
Vue.prototype.$error=Modal.error;
Vue.prototype.$confirm=Modal.confirm;

router.beforeEach((to,from,next)=>{
  const {meta={},path}=to;
  const {currentUser={}}=store.state.login;
  if(!meta.auth) return next(); 
  if(!currentUser.account) {
    store.dispatch({type:"login/logout",payload:{path}});
    return;
  }
  if(meta.role==="user" || currentUser.roleName==="admin") return next();
  message.error("无权限！");
  next("/homepage");
});

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
