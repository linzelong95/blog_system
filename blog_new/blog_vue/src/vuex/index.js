import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import login from './login';
import search from './search';

const store=new Vuex.Store({
  state:{
    spinning:false
  },
  mutations:{
    toggleSpinnig(state,spinning){
      state.spinning=spinning;
    }
  },
  actions:{
    toggleSpinnig({commit},{payload}){
      commit("toggleSpinnig",payload.spinnig);
    }
  },
  modules:{
    login,
    search
  }
});

export default store;