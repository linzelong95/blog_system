<template>
  <div id="homepage">
    <a-spin :spinning="spinningFlag">
      <a-drawer
        title="搜索框"
        placement="top"
        height=100
        closable="false"
        maskClosable="false"
        :visible="showSearchFlag"
        z-index="998"
      >
        <a-input-search
          placeholder="文章搜索"
          v-model="conditionQuery.title"
          @search="searchArticle"
          enterButton
        />
      </a-drawer>
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
                {{item.tags.map(i=>i.name).join(", ")}}
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
        <a-tag color="purple" style="position:absolute;top:0px;left:0px">
          <a-icon type="tag" />&nbsp;{{item.category.sort.name}},{{item.category.name}}
        </a-tag>
        <div class="top" v-if="item.isTop===1">置顶</div>
      </a-card>
      <div class="more" v-show="moreFlag && !spinningFlag">
        <a-button @click="loadMore">加载更多</a-button>
      </div>
    </a-spin>
  </div>
</template>

<script>
import {baseImgUrl} from '../utils/defaultSetting.js'
import UserArticle from '../api/UserArticle';
const userArticleAPI=new UserArticle();
export default {
  data () {
    return {
      list:[],
      total:0,
      index:1,
      size:10,
      moreFlag:true,
      baseImgUrl,
      conditionQuery: { title: '', category: {}, orderBy: {} },
      spinningFlag:true,
      showSearchFlag:false
    }
  },
  created(){
    userArticleAPI.list({
      conditionQuery:this.conditionQuery,
      index:this.index,
      size:this.size
    })
      .then(res=>{
        const {data:{list,total}}=res;
        this.list=list;
        this.total=total;
        this.moreFlag=list.length!==total;
        this.spinningFlag=!this.spinningFlag;
      })
      .catch(e=>this.$error({title:"请求出错！"}));
  },
  methods:{
    readArticle(id){
      this.$router.push(`/article/${id}`);
    },
    loadMore(){
      const index=this.index+1;
      userArticleAPI.list({
        conditionQuery:this.conditionQuery,
        index,
        size:this.size
      })
        .then(res=>{
          const {data:{list,total}}=res;
          const newList=[...this.list,list];
          this.list=newList;
          this.index=index;
          this.total=total;
          this.moreFlag=newList.length!==total;
        })
        .catch(e=>this.$error({title:"请求出错！"}));
    },
    toggleShowSearch(){
      this.showSearchFlag=!this.showSearchFlag;
    },
    searchArticle(){
      userArticleAPI.list({
      conditionQuery:this.conditionQuery,
      index:1,
      size:this.size
    })
      .then(res=>{
        const {data:{list,total}}=res;
        this.list=list;
        this.total=total;
        this.moreFlag=list.length!==total;
      })
      .catch(e=>this.$error({title:"请求出错！"}));
    }
  }
}
</script>

<style lang="scss" scoped>
  #homepage{
    width:100%;
    .card{
      margin-bottom:10px;
      position: relative;
      overflow: hidden;
      &:last-of-type{
        margin-bottom: 0;
      }
      .abstract{
        text-indent: 2em;
      }
      .tag-and-date{
        display: flex;
        justify-content: space-between;
        font-size:10px;
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
