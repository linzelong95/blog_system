<template>
  <div id="article">
    <v-action 
      class="action" 
      @request="request" 
      @changeConditionQuery="changeConditionQuery" 
      :conditionQuery="conditionQuery" 
    />
    <v-search 
      @request="request"
      ref="searchRef"
    />
    <a-list
      :loading="spinningFlag"
      itemLayout="vertical"
      :dataSource="list"
      :pagination="{
        current:index,
        total:total,
        pageSize:size,
        onChange: handlePageChange,
      }"
    >
      <a-list-item slot="renderItem" slot-scope="item" key="item.id" class="listitem">
        <a-icon type="pushpin" class="top" v-if="item.isTop===1" />

          <!-- { type: 'form', action:AdminArticleAPI.FORM },
          { type: 'delete', action:AdminArticleAPI.DELETE },
          { type: 'arrow-up', action:AdminArticleAPI.TOP },
          { type: 'arrow-down', action:AdminArticleAPI.UNTOP },
          { type: 'lock', action:AdminArticleAPI.LOCK },
          { type: 'unlock', action:AdminArticleAPI.UNLOCK }, -->
        
        <a-list-item-meta>
          <a-avatar slot="avatar" :src="`${baseImgUrl}${item.imageUrl}`||'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'" />
          <template slot="title">
            <a>
              {{item.title}}&nbsp;&nbsp;
              <a-tag color="purple" class="category" v-if="item.category && item.category.sort">
                <a-icon type="tag" />&nbsp;{{item.category.sort.name}},{{item.category.name}}
              </a-tag>
            </a>
          </template>
        </a-list-item-meta>
        {{item.abstract}}
        <div class="tag-and-date">
          <span>
            <a-icon type="tags" v-if="item.tags&&item.tags.length" />
            {{item.tags&&item.tags.map(i=>i.name).join(", ")}}
          </span>
          <span>
            <a-icon type="clock-circle" />
            {{item.createDate|dateFormat("YYYY-MM-DD")}}
          </span>
        </div>
        <!-- <div class="action-box" slot="actions"> -->
          <a-icon type="delete" slot="actions" />
          <a-icon type="form" slot="actions" />
          <a-icon type="arrow-down" v-if="item.isTop===1" slot="actions" />
          <a-icon type="arrow-up"  />
          <a-icon type="lock" v-if="item.isEnable===1" />
          <a-icon type="unlock" v-else />
          <a-button type="primary" size="small" style="font-size:10px;">选中</a-button>
        <!-- </div> -->
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import Search from '../../components/Search/Search.vue';
  import Action from '../../components/Action/Action.vue';
  import {baseImgUrl} from '../../utils/defaultSetting.js';
  import urls from '../../api/urls';
  const {AdminArticleAPI}=urls;
  export default {
    data () {
      return {
        baseImgUrl,
        conditionQuery: { title: '', category: {}, orderBy: {} },
        AdminArticleAPI,
      }
    },
    components:{
      "v-search":Search ,
      "v-action":Action
    },
    mounted(){
      this.request();
    },
    destroyed(){
      this.$store.commit("save",{spinningFlag:false,list:[],index:1,size:10,total:0,formItem:{}});
    },
    methods:{
      async request(paramsObj={},callback,isConcat){
        const conditionQuery={...this.conditionQuery,title:this.searchContent};
        const payload={netUrl:AdminArticleAPI.LIST.url,conditionQuery,...paramsObj}
        this.$store.dispatch({type:"commonHandle",payload,callback,isConcat});
      },
      changeConditionQuery(obj){
        this.conditionQuery={...this.conditionQuery,...obj};
      },
      searchInputFocus(){
        this.$nextTick(()=>this.$refs.searchRef.focus());
      },
      readArticle(id){
        this.$router.push(`/read/${id}`);
      },
      handlePageChange(index,size){
        this.request({index,size});
      }
    },
    computed:{
      ...mapState(['list','total','index','size','spinningFlag']),
      ...mapState({
        searchContent:state=>state.search.searchContent
      }),
    }
  }
</script>

<style lang="scss" scoped>
  #article{
    width:100%;
    background: white;
    padding:10px;
    .action{
      position: fixed;
      top:250px;
      left:0px;
      z-index: 1000;
    }
    .listitem{
      overflow: hidden;
      position: relative;
      .top{
        position: absolute;
        top: 0px;
        right: 0px;
        color:red;
      }
      .tag-and-date{
        display: flex;
        justify-content: space-between;
        font-size:10px;
        margin:10px 0px;
      }
      // .action-box{
      //   display: flex;
      //   justify-content: space-around;
      //   align-items: center;
      // }
    }
    /deep/ .ant-list-item-meta{
      margin-bottom: 0px;
    }
    /deep/ .ant-list-item-action{
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
</style>
