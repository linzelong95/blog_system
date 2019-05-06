<template>
  <div id="reply">
    <a-divider orientation="right">
        <span class="total">{{total}}</span>
        &nbsp;条评论&nbsp;
        <a-icon type="sync" class="reload" @click="reload" />
    </a-divider>
    <a-comment v-for="item in list" :key="item.id">
      <template slot="actions">
        <a style="padding-right:10px;" @click="handleDealWithReply(item)">回复</a>
        <a style="padding-right:10px;color:red;" @click="handleDealWithReply(item,getApi.DELETE)" v-if="currentUser.roleName==='admin'||(item.from&&currentUser.nickName===item.from.nickName)">删除</a>
        <a style="padding-right:10px;color:green;" v-if="currentUser.roleName==='admin'&&item.isApproved===0">展示</a>
        <a style="padding-right:10px;color:#B23AEE;" v-if="currentUser.roleName==='admin'&&item.isApproved===1">隐藏</a>
        <a style="padding-right:10px;color:orange;" v-if="currentUser.roleName==='admin'&&item.isTop===0">置顶</a>
        <a style="color:#A0522D;" v-if="currentUser.roleName==='admin'&&item.isTop===1">取置</a>
      </template>
      <span slot="datetime">{{item.createDate|dateFormat("YYYY-MM-DD")}}</span>
      <a slot="author">{{item.from&&item.from.nickName}}</a>
      <a-avatar
        slot="avatar"
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        alt="Han Solo"
      />
      <p slot="content">
        {{item.reply}}
        <a-tag v-if="currentUser.roleName==='admin'&&item.isApproved===0">待审</a-tag>
      </p>
      <a-comment v-for="i in item.children" :key="i.id">
        <template slot="actions">
          <a style="padding-right:10px;">回复</a>
          <a style="padding-right:10px;color:red;" v-if="i.from&&currentUser.nickName===i.from.nickName">删除</a>
          <a style="padding-right:10px;color:green;" v-if="currentUser.roleName==='admin'&&i.isApproved===0">展示</a>
          <a style="padding-right:10px;color:#B23AEE;" v-if="currentUser.roleName==='admin'&&i.isApproved===1">隐藏</a>
          <a style="padding-right:10px;color:orange;" v-if="currentUser.roleName==='admin'&&i.isTop===0">置顶</a>
          <a style="color:#A0522D;" v-if="currentUser.roleName==='admin'&&i.isTop===1">取置</a>
        </template>
        <a slot="author">{{item.to&&item.to.nickName}}</a>
        <span slot="datetime">{{item.createDate|dateFormat("YYYY-MM-DD")}}</span>
        <a-avatar
          slot="avatar"
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          alt="Han Solo"
        />
        <p slot="content">{{i.reply}}</p>
      </a-comment>
    </a-comment>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import urls from '../../api/urls';
  const { UserReplyAPI ,AdminReplyAPI}=urls;

  export default {
    data () {
      return {
        conditionQuery: {  category: {}, orderBy: {} },
        index:1,
        size:999,
        total:0,
        list:[],
      }
    },
    props:["articleId","role"],
    mounted(){
      this.reload();
    },
    methods:{
      getReplyList(paramsObj={},callback){
        const articleIdsArr= [this.articleId*1];
        const {index=this.index,size=this.size}=paramsObj;
        paramsObj.conditionQuery = { ...this.conditionQuery, articleIdsArr };
        const payload={
          size,
          index,
          conditionQuery:this.conditionQuery,
          prettyFormat: true ,
          netUrl:this.getApi.LIST.url,
          ...paramsObj
        };
        this.$store.dispatch({type:"commonHandle",payload,callback});
      },
      reload(){
        this.getReplyList({},(res)=>{
          const {list,total}=res;
          this.list=list;
          this.total=total;
        });
      },
      handleDealWithReply(item,action){
        const {currentUser:{id:currentUserId}}=this;
        if(!currentUserId) return this.$error({title:"登录后才可进行操作！"});
      }
    },
    computed:{
      getApi(){
        return this.role==="admin"?AdminReplyAPI:UserReplyAPI;
      },
      ...mapState({
        currentUser:state=>state.login.currentUser,
      }),
    }
  }
  </script>

  <style lang="scss" scoped>
    #reply{
      .total{
        color:#1890FF;
        font-size: 25px;
        font-weight: bold;
      }
      .reload{
        color:#1890FF;
      }
    }
</style>
