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
        <v-markdown :value="article.content" />
        <!-- <v-markdown-other :source="article.content"></v-markdown-other> -->
      </div>
      <div class="f_right">
        <a-icon type="clock-circle" />
        {{article.createDate|dateFormat}}
      </div>
      <div class="clearfix" />
      <v-reply :articleId="$route.params.id" :role="$route.params.role" />
    </a-spin>
  </div>
</template>

<script>
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
      const {id:articleId,role}=this.$route.params;
      this.request({conditionQuery:{id:articleId}},res=>{
        const article=res.list[0];
        this.request({netUrl:role==="user"?UserArticleAPI.CONTENT.url:AdminArticleAPI.CONTENT.url,articleId},response=>{
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
        const {role}=this.$route.params;
        const payload={netUrl:role==="user"?UserArticleAPI.LIST.url:AdminArticleAPI.LIST.url,conditionQuery:this.conditionQuery,...paramsObj}
        this.$store.dispatch({type:"commonHandle",payload,callback,isConcat});
      },
    },
    components:{
      "v-markdown":ShowMarkdown,
      "v-reply":Reply,
      "v-markdown-other":VueMarkdown
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
