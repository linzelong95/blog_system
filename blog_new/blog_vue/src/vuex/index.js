import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import login from './login';
import search from './search';

import $request from '../api/request';
import { Modal} from 'ant-design-vue';
const $error=Modal.error;


const initState={
  spinningFlag:false,
  list:[],
  index:1,
  size:12,
  total:0,
  formItem:{}
};
const store=new Vuex.Store({
  state:initState,
  mutations:{
    toggleSpinnig(state,spinningFlag){
      state.spinningFlag=spinningFlag;
    },
    save(state,payload){
      const {list:preList,index:preIndex,size:preSize,total:preTotal,formItem:preFormItem}=state;
      const {list=preList,index=preIndex,size=preSize,total=preTotal,formItem=preFormItem}=payload;
      state.list=list;
      state.index=index;
      state.size=size;
      state.total=total;
      state.formItem=formItem;
    }
  },
  actions:{
    toggleSpinnig({commit},{payload,isConcat}){
      commit("toggleSpinnig",payload.spinningFlag);
    },
    async commonHandle({state,commit},{payload,callback}){
      commit("toggleSpinnig",true);
      const {index:pageIndex,size:pageSize}=state;
      const {netUrl,index=pageIndex,size=pageSize,conditionQuery}=payload;
      const position=netUrl.lastIndexOf("/")+1;
      let action=netUrl.substring(position);
      let response=await $request(netUrl,{...payload,size,index,t:Date.now()});
      if(!response) {
        commit("toggleSpinnig",false);
        return;
      }
      if(callback) {
        commit("toggleSpinnig",false);
        callback();
        return;
      }
      if(!action.includes("list")){
        const baseUrl=netUrl.substring(0, position - 1);
        // 这里处理操作后的提示信息
        let tempIndex=index;
        do{
          response=$request(`${baseUrl}/list`,{conditionQuery,index:tempIndex,size,t:Date.now()});
          if(!response) return $error({title:"请求出错了！"});
          tempIndex--;
        }while(tempIndex>0&& response.list && response.list.length);
      }
      const {total}=response;
      const maxIndex = Math.ceil(total / size);
      const actualIndex = maxIndex > index ? index : maxIndex < 1 ? 1 : maxIndex;
      commit("save",{...response,index:actualIndex,size});
      commit("toggleSpinnig",false);
    }
  },
  modules:{
    login,
    search
  }
});

export default store;