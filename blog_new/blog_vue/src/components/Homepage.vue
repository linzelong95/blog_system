<template>
  <div id="homepage">
    <a-card
      v-for="item in list"
      :key="item.id"
    >
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        slot="cover"
      />
      <template class="ant-card-actions" slot="actions">
        <a-icon type="setting" />
        <a-icon type="edit" />
        <a-icon type="ellipsis" />
      </template>
      <a-card-meta
        :title="item.title"
        :description="item.abstract"
      />
      <a-tag color="purple" style="position:absolute;top:0px;left:0px">
        <a-icon type="tag" />&nbsp;{{item.category.sort.name}},{{item.category.name}}
      </a-tag>
    </a-card>
  </div>
</template>

<script>
import UserArticle from '../api/UserArticle';
const userArticleAPI=new UserArticle();
export default {
  data () {
    return {
      list:[],
      total:0,
      index:1,
      size:10
    }
  },
  created(){
    userArticleAPI.list()
      .then(res=>{
        const {data:{list,total}}=res;
        this.list=list;
        this.total=total;
      })
      .catch(e=>console.log(e))
  },
  methods:{
    // getArticles(){
    //   axios.post('http://127.0.0.1:7001/user/article/list',{
    //     conditionQuery:{}
    //   })
    //     .then(res=>console.log(res.data))
    //     .catch(e=>console.log(e))
    // }
  }
}
</script>

<style lang="scss" scoped>
  #homepage{
    width:100%;
    overflow: hidden;
  }
</style>
