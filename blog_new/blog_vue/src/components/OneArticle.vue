<template>
  <div id="article">
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
    <div class="content" v-html="article.content" />
  </div>
</template>

<script>
import UserArticle from '../api/UserArticle';
const userArticleAPI=new UserArticle();
export default {
  data () {
    return {
      article:{}
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
          })
          .catch(e=>this.$error({title:"请求出错！"}))
      })
      .catch(e=>this.$error({title:"请求出错！"}))
  },
  methods:{

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
