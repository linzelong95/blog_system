<template>
  <div id="article">
    <a-spin :spinning="spinningFlag">
      <h2>{{article.title}}</h2>
      <div class="f_right">
        <a-icon type="clock-circle" />
        {{article.createDate|dateFormat}}
      </div>
      <div class="clearfix" />
      <div class="tags" v-if="article.tags && article.tags.length">
        <b>标签：</b>
        {{article.tags.map(i=>i.name).join(", ")}}
      </div>
      <div class="abstract">
        <b>摘要：</b>
        {{article.abstract}}
      </div>
      <v-markdown :value="article.content" />
    </a-spin>
  </div>
</template>

<script>
import ShowMarkdown from '../components/ShowMarkdown/ShowMarkdown.vue'
import UserArticle from '../api/UserArticle';
const userArticleAPI=new UserArticle();
export default {
  data () {
    return {
      article:{},
      spinningFlag:true
    }
  },
  created(){
    const articleId=this.$route.params.id;
    userArticleAPI.list({conditionQuery:{id:articleId}})
      .then(res=>{
        const article=res.data.list[0];
        userArticleAPI.content({articleId})
          .then(res=>{
            article.content=res.data.list[0].content;
            this.article=article;
            this.spinningFlag=false;
          })
          .catch(e=>this.$error({title:"请求出错！"}))
      })
      .catch(e=>this.$error({title:"请求出错！"}))
  },
  components:{
    "v-markdown":ShowMarkdown
  }
}
</script>

<style lang="scss" scoped>
  #article{
    background:white;
    .abstract,.tags{
      text-indent: 2em;
    }
    .content{
      margin-top:20px;
      img{
        width:100%;
      }
    }
  }
</style>
