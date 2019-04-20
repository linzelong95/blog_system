const search={
  namespaced:true,
  state:{
    searchBoxFlag:false
  },
  mutations:{
    toggleSearchBox(state){
      state.searchBoxFlag=!state.searchBoxFlag;
    }
  },
  actions:{
    toggleSearchBox(context,payload){
      // context包含 commit rootState state dispatch
      context.commit("toggleSearchBox");
    }
  },
  getters:{
    // this.store.getters.test
    test:function(state){
      return !state.searchBoxFlag;
    }
  }
}

export default search;