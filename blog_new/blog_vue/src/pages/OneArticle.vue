<template>
  <div id="article">
    <a-spin :spinning="$store.state.spinningFlag">
      <h2>{{article.title}}</h2>
      <div class="tags" v-if="article.tags && article.tags.length">
        <b>标签：</b>
        <i>{{article.tags.map(i=>i.name).join(", ")}}</i>
      </div>
      <div class="abstract">
        <b>摘要：</b>
        {{article.abstract}}
      </div>
      <v-markdown :value="article.content" />
      <div class="f_right">
        <a-icon type="clock-circle" />
        {{article.createDate|dateFormat}}
      </div>
      <div class="clearfix" />
      <v-reply :articleId="$route.params.id" />
    </a-spin>
  </div>
</template>

<script>
import ShowMarkdown from '../components/ShowMarkdown/ShowMarkdown.vue';
import Reply from '../components/Reply/Reply.vue';
import urls from '../api/urls';
const {UserArticleAPI}=urls;
export default {
  data () {
    return {
      article:{},
    }
  },
  mounted(){
    const articleId=this.$route.params.id;
    this.request({conditionQuery:{id:articleId}},res=>{
      const article=res.list[0];
      this.request({netUrl:UserArticleAPI.CONTENT.url,articleId},response=>{
        article.content=res.list[0].content;
        this.article=article;
      });
    });
  },
  destroyed(){
    this.$store.commit("save",{spinningFlag:false,list:[],index:1,size:10,total:0,formItem:{}});
  },
  methods:{
    async request(paramsObj={},callback,isConcat){
      const payload={netUrl:UserArticleAPI.LIST.url,conditionQuery:this.conditionQuery,...paramsObj}
      this.$store.dispatch({type:"commonHandle",payload,callback,isConcat});
    },
  },
  components:{
    "v-markdown":ShowMarkdown,
    "v-reply":Reply
  }
}
</script>

<style lang="scss" scoped>
  #article{
    background:white;
    padding:15px;
    .abstract,.tags{
      text-indent: 2em;
    }
    .abstract{
      margin-bottom:10px;
    }
  }
</style>
