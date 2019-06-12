const search={
  namespaced:true,
  state:{
    searchBoxFlag:false,
    searchContent:""
  },
  mutations:{
    toggleSearchBox(state,searchBoxFlag){
      state.searchBoxFlag=!state.searchBoxFlag;
      if(searchBoxFlag!==undefined) state.searchBoxFlag=searchBoxFlag;
    },
    setSearchContent(state,searchContent){
      state.searchContent=searchContent;
    }
  },
  actions:{
    toggleSearchBox({commit},{payload={}}){
      commit("toggleSearchBox",payload.searchBoxFlag);
    },
    setSearchContent({commit},{payload}){
      commit("setSearchContent",payload.searchContent);
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