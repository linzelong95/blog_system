<template>
  <div id="search">
    <a-drawer
        :title="title||'搜索框'"
        :placement="placement||'top'"
        :height="height||100"
        @close="toggleShowSearch"
        :visible="$store.state.search.searchBoxFlag"
        :zIndex="zIndex||998"
      >
        <div style="display:flex;justify-content:space-between">
          <a-input-search
            v-model="searchContent"
            :placeholder="placeholder||'文章搜索'"
            @search="search"
            enterButton
            ref="searchInput"
          />
          <a-button type="danger" shape="circle" icon="reload" @click="reset" />
        </div>
      </a-drawer>
  </div>
</template>

<script>
export default {
  props:["title","placement","height","zIndex","placeholder"],
  destroyed(){
    this.$store.dispatch({type:"search/toggleSearchBox",payload:{searchBoxFlag:false}});
    this.$store.dispatch({type:"search/setSearchContent",payload:{searchContent:""}});
  },
  methods:{
    toggleShowSearch(){
      this.$store.dispatch({type:"search/toggleSearchBox"});
    },
    search(){
      this.toggleShowSearch();
      this.$emit("request",{index:1});
    },
    reset(){
      this.$store.dispatch({type:"search/setSearchContent",payload:{searchContent:""}});
      this.search();
    },
    focus(){
      this.$refs.searchInput.focus();
    }
  },
  computed:{
    searchContent:{
      get(){
        return this.$store.state.search.searchContent;
      },
      set(value){
        this.$store.dispatch({type:"search/setSearchContent",payload:{searchContent:value}});
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #search{
    
  }
</style>
