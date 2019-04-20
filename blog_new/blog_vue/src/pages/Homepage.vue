<template>
  <div id="homepage">
    <a-spin :spinning="spinningFlag">
      <a-drawer
        title="搜索框"
        placement="top"
        :height="100"
        @close="toggleShowSearch"
        :visible="$store.state.search.searchBoxFlag"
        :zIndex="998"
      >
        <div style="display:flex;justify-content:space-between">
          <a-input-search
            placeholder="文章搜索"
            v-model="conditionQuery.title"
            @search="searchArticle"
            enterButton
            ref="searchInput"
          />
          <a-button type="danger" shape="circle" icon="reload" @click="resetTitle" />
        </div>
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
        <a-tag color="purple" class="category" v-show="item.category!==undefined">
          <a-icon type="tag" />&nbsp;{{item.category.sort.name}},{{item.category.name}}
        </a-tag>
        <div class="top" v-if="item.isTop===1">置顶</div>
      </a-card>
      <div class="more" v-if="moreFlag && !spinningFlag">
        <a-button @click="loadMore">加载更多</a-button>
      </div>
    </a-spin>
  </div>
</template>

<script>
import {baseImgUrl} from '../utils/defaultSetting.js'
import UserArticle from '../api/UserArticle';
const userArticleAPI=new UserArticle();
import request from '../api/request';
import urls from '../api/urls';
const {UserArticleAPI}=urls;
import vm from '../main';
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
      spinningFlag:false,
    }
  },
  mounted(){
    console.log(999999,vm)
    this.getArticleList();
  },
  methods:{
    async getArticleList(paramsObj={},isConcat){
      const {index=this.index,size=this.size}=paramsObj;
      const newParamsObj={
        size,
        index,
        conditionQuery:this.conditionQuery,
        ...paramsObj
      }
      const data=await request(UserArticleAPI.LIST.url,newParamsObj);
      if(!data) return;
      const {list,total}=data;
      const newList=isConcat?[...this.list,...list]:list;
      this.list=newList;
      this.index=index;
      this.total=total;
      this.moreFlag=newList.length!==total;
    },
    // getArticleList(paramsObj={},isConcat){
    //   this.spinningFlag=true;
    //   const {index=this.index,size=this.size}=paramsObj;
    //   userArticleAPI.list({
    //     size,
    //     index,
    //     conditionQuery:this.conditionQuery,
    //     ...paramsObj
    //   })
    //   .then(res=>{
    //     const {data:{list,total}}=res;
    //     const newList=isConcat?[...this.list,...list]:list;
    //     this.list=newList;
    //     this.index=index;
    //     this.total=total;
    //     this.moreFlag=newList.length!==total;
    //     this.spinningFlag=false;
    //   })
    //   .catch(e=>this.$error({title:"请求出错！"}));
    // },
    loadMore(){
      this.getArticleList({index:this.index+1},true);
    },
    toggleShowSearch(){
      this.$store.dispatch({type:"search/toggleSearchBox"});
    },
    searchInputFocus(){
      this.$nextTick(()=>this.$refs.searchInput.focus());
    },
    searchArticle(){
      this.getArticleList({index:1});
      this.toggleShowSearch();
    },
    resetTitle(){
      this.conditionQuery.title="";
      this.getArticleList({index:1});
      this.toggleShowSearch();
    },
    readArticle(id){
      this.$router.push(`/read/${id}`);
    },
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
