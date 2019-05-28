<template>
  <div id="homepage">
    <a-spin :spinning="spinningFlag">
      <v-action 
        class="action" 
        role="user"
        @request="request" 
        @changeConditionQuery="changeConditionQuery" 
        :conditionQuery="conditionQuery" 
      />
      <v-search 
        @request="request"
        ref="searchRef"
      />
      <a-card
        v-for="item in list"
        :key="item.id"
        class="card"
        @click="readArticle(item.id)"
      >
        <img
          alt="pic"
          :src="`${baseImgUrl}${item.imageUrl}`||'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'"
          slot="cover"
        />
        <template class="ant-card-actions" slot="actions">
          <a-icon type="star-o" />
          <a-icon type="like-o" />
          <a-icon type="message" />
        </template>
        <a-card-meta
          :title="item.title"
        >
          <template slot="description">
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
            <div class="abstract">
              <b>摘要：</b>
              {{item.abstract}}
            </div>
          </template>
        </a-card-meta>
        <a-tag color="purple" class="category" v-if="item.category && item.category.sort">
          <a-icon type="tag" />&nbsp;{{item.category.sort.name}},{{item.category.name}}
        </a-tag>
        <div class="top" v-if="item.isTop===1">置顶</div>
      </a-card>
      <div class="more" v-if="list.length!== total && !spinningFlag">
        <a-button @click="loadMore">加载更多>></a-button>
      </div>
    </a-spin>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import Search from '../../components/Search/Search.vue';
  import Action from '../../components/Action/Action.vue';
  import {baseImgUrl} from '../../utils/defaultSetting.js';
  import urls from '../../api/urls';
  const {UserArticleAPI}=urls;
  export default {
    data () {
      return {
        baseImgUrl,
        conditionQuery: { title: '', category: {}, orderBy: {} },
      }
    },
    components:{
      "v-search":Search ,
      "v-action":Action
    },
    mounted(){
      this.request({},null,true);
    },
    destroyed(){
      this.$store.commit("save",{spinningFlag:false,list:[],index:1,size:10,total:0,formItem:{}});
    },
    methods:{
      async request(paramsObj={},callback,isConcat){
        const conditionQuery={...this.conditionQuery,title:this.searchContent};
        const payload={netUrl:UserArticleAPI.LIST.url,conditionQuery,...paramsObj}
        this.$store.dispatch({type:"commonHandle",payload,callback,isConcat});
      },
      changeConditionQuery(obj){
        this.conditionQuery={...this.conditionQuery,...obj};
      },
      loadMore(){
        this.request({index:this.index+1},null,true);
      },
      searchInputFocus(){
        this.$nextTick(()=>this.$refs.searchRef.focus());
      },
      readArticle(id){
        this.$router.push(`/read/${id}`);
      },
    },
    computed:{
      ...mapState(['list','total','index','spinningFlag']),
      ...mapState({
        searchContent:state=>state.search.searchContent,
        currentUser:state=>state.login.currentUser,
      }),
    }
  }
</script>

<style lang="scss" scoped>
  #homepage{
    width:100%;
    .action{
      position: fixed;
      top:250px;
      left:0px;
      z-index: 1000;
    }
    .card{
      margin-bottom:10px;
      position: relative;
      overflow: hidden;
      &:last-of-type{
        margin-bottom:0px;
      }
      .abstract{
        text-indent: 2em;
      }
      .tag-and-date{
        display: flex;
        justify-content: space-between;
        font-size:10px;
      }
      .category{
        position:absolute;
        top:0px;
        left:0px;
      }
      .top{
        position: absolute;
        background: gray;
        top: 5px;
        right: -55px;
        width: 150px;
        text-align: center;
        transform: rotate(40deg);
        color:yellow;
      }
    }
    /deep/ .ant-card-meta-title{
      white-space: normal;
    }
    .more{
      margin-top:10px;
      text-align: center;
    }
  }
</style>
