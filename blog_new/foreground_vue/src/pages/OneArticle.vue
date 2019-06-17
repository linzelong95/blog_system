<template>
  <div id="one-article">
    <a-spin :spinning="$store.state.spinningFlag">
      <h3 class="title">{{article.title}}</h3>
      <div class="tags" v-if="article.tags && article.tags.length">
        <b>标签：</b>
        <i>{{article.tags.map(i=>i.name).join(", ")}}</i>
      </div>
      <div class="abstract">
        <b>摘要：</b>
        {{article.abstract}}
      </div>
      <div class="content">
        <!-- <v-markdown :value="article.content" /> -->
        <!-- <v-markdown-other :source="article.content"></v-markdown-other> -->
        <mavon-editor
          v-model="article.content"
          defaultOpen= 'preview'
          :editable="false"
          :toolbarsFlag="false"
          :subfield="false"
          :scrollStyle="true"
          style="z-index:0"
        />
      </div>
      <div class="f_right" :style="{'margin-top':'20px'}">
        <a-icon type="clock-circle" />
        {{article.createDate|dateFormat}}
      </div>
      <div class="clearfix" />
      <v-reply :articleId="$route.params.articleId*1" :authorId="article.user?article.user.id:undefined" />
    </a-spin>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import VueMarkdown from 'vue-markdown';
  import ShowMarkdown from '../components/ShowMarkdown/ShowMarkdown.vue';
  import Reply from '../components/Reply/Reply.vue';
  import urls from '../api/urls';
  const {UserArticleAPI,AdminArticleAPI}=urls;
  export default {
    data () {
      return {
        article:{},
      }
    },
    mounted(){
      const {currentUser:{roleName="user"}}=this;
      const {articleId:preArticleId}=this.$route.params;
      const articleId=preArticleId*1;
      this.request({conditionQuery:{articleId}},res=>{
        const article=res.list[0];
        this.request({netUrl:roleName==="user"?UserArticleAPI.CONTENT.url:AdminArticleAPI.CONTENT.url,articleId},response=>{
          article.content=response.list[0].content;
          this.article=article;
        });
      });
    },
    destroyed(){
      this.$store.commit("save",{spinningFlag:false,list:[],index:1,size:10,total:0,formItem:{}});
    },
    methods:{
      async request(paramsObj={},callback,isConcat){
        const {currentUser:{roleName="user"}}=this;
        const payload={netUrl:roleName==="user"?UserArticleAPI.LIST.url:AdminArticleAPI.LIST.url,conditionQuery:this.conditionQuery,...paramsObj}
        this.$store.dispatch({type:"commonHandle",payload,callback,isConcat});
      },
    },
    components:{
      "v-markdown":ShowMarkdown,
      "v-reply":Reply,
      "v-markdown-other":VueMarkdown
    },
    computed:{
      ...mapState({
        currentUser:state=>state.login.currentUser,
      }),
    }
  }
</script>

<style lang="scss" scoped>
  #one-article{
    background:white;
    padding:15px;
    .title,.abstract,.tags{
      text-indent: 2em;
    }
    .title{
      font-weight: bold;
      color:#1890ff;
    }
    .abstract{
      margin-bottom:10px;
    }
    .content{
      width:100%;
      overflow: scroll;
      overflow-y:hidden;
    }
  }
</style>
