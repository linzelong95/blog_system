<template>
  <div id="reply">
    <a-button type="primary" @click="toggleReplyBox">回复楼主</a-button>
    <a-divider orientation="right">
        <span class="total">{{total}}</span>
        &nbsp;条评论&nbsp;
        <a-icon type="sync" class="getReplyList" @click="getReplyList" />
    </a-divider>
    <a-comment v-for="item in list" :key="item.id">
      <template slot="actions">
        <a style="padding-right:10px;" @click="handleDealWithReply(item)">回复</a>
        <a style="padding-right:10px;color:red;" @click="handleDealWithReply(item,getApi.DELETE)" v-if="currentUser.roleName==='admin'||(item.from&&currentUser.nickName===item.from.nickName)">删除</a>
        <a style="padding-right:10px;color:green;" @click="handleDealWithReply(item,getApi.APPROVE)" v-if="currentUser.roleName==='admin'&&item.isApproved===0">展示</a>
        <a style="padding-right:10px;color:#B23AEE;" @click="handleDealWithReply(item,getApi.DISAPPROVE)" v-if="currentUser.roleName==='admin'&&item.isApproved===1">隐藏</a>
        <a style="padding-right:10px;color:orange;" @click="handleDealWithReply(item,getApi.TOP)" v-if="currentUser.roleName==='admin'&&item.isTop===0">置顶</a>
        <a style="color:#A0522D;" @click="handleDealWithReply(item,getApi.UNTOP)" v-if="currentUser.roleName==='admin'&&item.isTop===1">取置</a>
      </template>
      <span slot="datetime">{{item.createDate|dateFormat("YYYY-MM-DD")}}</span>
      <a slot="author">{{item.from&&item.from.nickName}}</a>
      <a-avatar
        slot="avatar"
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        alt="Han Solo"
      />
      <span slot="content">
        <span :style="{'text-decoration':currentUser.roleName==='admin'&&item.isApproved===0?'line-through':'none'}">{{currentUser.roleName==='admin'|| item.isApproved===1?item.reply:'（该内容待审核）'}}</span>
        <a-tag v-if="currentUser.roleName==='admin'&&item.isApproved===0" color="purple">待展示</a-tag>
      </span>
      <a-comment v-for="i in item.children" :key="i.id">
        <template slot="actions">
          <a style="padding-right:10px;" @click="handleDealWithReply(i)">回复</a>
          <a style="padding-right:10px;color:red;" @click="handleDealWithReply(i,getApi.DELETE)" v-if="currentUser.roleName==='admin'||(i.from&&currentUser.nickName===i.from.nickName)">删除</a>
          <a style="padding-right:10px;color:green;" @click="handleDealWithReply(i,getApi.APPROVE)" v-if="currentUser.roleName==='admin'&&i.isApproved===0">展示</a>
          <a style="padding-right:10px;color:#B23AEE;" @click="handleDealWithReply(i,getApi.DISAPPROVE)" v-if="currentUser.roleName==='admin'&&i.isApproved===1">隐藏</a>
          <a style="padding-right:10px;color:orange;" @click="handleDealWithReply(i,getApi.TOP)" v-if="currentUser.roleName==='admin'&&i.isTop===0">置顶</a>
          <a style="color:#A0522D;" @click="handleDealWithReply(i,getApi.UNTOP)" v-if="currentUser.roleName==='admin'&&i.isTop===1">取置</a>
        </template>
        <a slot="author">{{i.from&&i.from.nickName}}@{{i.to&&i.to.nickName}}</a>
        <span slot="datetime">{{i.createDate|dateFormat("YYYY-MM-DD")}}</span>
        <a-avatar
          slot="avatar"
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          alt="Han Solo"
        />
        <span slot="content">
        <span :style="{'text-decoration':i.isApproved===0?'line-through':'none'}">{{currentUser.roleName==='admin'|| i.isApproved===1?i.reply:'（该内容待审核）'}}</span>
          <a-tag v-if="currentUser.roleName==='admin'&&i.isApproved===0" color="purple">待展示</a-tag>
        </span>
      </a-comment>
    </a-comment>
    <a-drawer
      title="回复框"
      placement="bottom"
      :height="180"
      @close="toggleReplyBox"
      :visible="reviewBoxVisible"
    >
      <a-textarea v-model="replyContent" :autosize="{minRows:2,maxRows:2}" ref="replyContentRef" @change="replyContentChange" />
       <!-- :style="{background:'red',display:'flex','justify-content':'flex-end','margin-top':'20px'}" -->
      <div :style="{display:'flex','justify-content':'flex-end','margin-top':'15px'}" >
        <a-button size="small" @click="toggleWriteReply('reset')" :style="{'margin-right':'10px'}">重置</a-button>
        <a-button size="small" type="primary" @click="toggleWriteReply">确定</a-button>
      </div>
    </a-drawer>
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
        reviewBoxVisible:false,
        reviewedMan:{},
        replyParentId:0,
        replyContent:""
      }
    },
    props:["articleId","authorId"],
    mounted(){
      this.getReplyList();
    },
    methods:{
      request(paramsObj={},callback,hasExtraParamsFlag=true){
        const articleIdsArr= [this.articleId];
        const {index=this.index,size=this.size}=paramsObj;
        paramsObj.conditionQuery = { ...this.conditionQuery, articleIdsArr };
        const payload=hasExtraParamsFlag?{
          size,
          index,
          conditionQuery:this.conditionQuery,
          prettyFormat: true ,
          netUrl:this.getApi.LIST.url,
          ...paramsObj
        }:paramsObj;
        this.$store.dispatch({type:"commonHandle",payload,callback});
      },
      getReplyList(){
        this.request({},(res)=>{
          const {list,total}=res;
          this.list=list;
          this.total=total;
        });
      },
      handleDealWithReply(replyItem,action){
        const {currentUser:{id:currentUserId,roleName="user"}}=this;
        if(!currentUserId) return this.$error({title:"登录后才可进行操作！"});
        const { from: { id: toId, nickName }, id, parentId: pid, reply } = replyItem;
        let actionAPIs=[this.getApi.DELETE.url];
        if(roleName==="admin"){
          actionAPIs=[this.getApi.DELETE.url,this.getApi.TOP.url,this.getApi.UNTOP.url,this.getApi.APPROVE.url,this.getApi.DISAPPROVE.url]
        }
        if (action && actionAPIs.includes(action.url)) {
          const items = [{ id, parentId: pid, name: reply }];
          this.request({ netUrl: action.url, items }, this.getReplyList);
          return;
        }
        this.reviewBoxVisible=true;
        this.reviewedMan={name:nickName, id: toId};
        this.replyParentId=pid > 0 ? pid : id;
        this.replyContent=`@${nickName}：`;
        this.$nextTick(()=>{
            this.$refs.replyContentRef.focus();
          });
      },
      toggleReplyBox(){
        const {reviewBoxVisible,authorId}=this;
        this.reviewBoxVisible=!reviewBoxVisible;
        if(!reviewBoxVisible){
          this.reviewedMan={name:"楼主", id:authorId};
          this.replyContent="@楼主：";// 注意冒号是中文的
          this.$nextTick(()=>{
            this.$refs.replyContentRef.focus();
          });
        }else{
          this.reviewedMan={};
          this.replyParentId=0;
          this.replyContent="";
        }
      },
      toggleWriteReply(mark){
        const { currentUser: { id: currentUserId },authorId,reviewedMan,replyContent,articleId,replyParentId} = this;
        if(mark==="reset"){
          const arr=replyContent.split("：");
          this.replyContent=`${arr[0]}：`;
          this.$refs.replyContentRef.focus();
          return;
        }
        if(!currentUserId){
          this.$error({title:'请登录后再评论！'});
          return;
        }
        const fromId = currentUserId;
        const netUrl = this.getApi.INSERT.url;
        const toId = reviewedMan.id;
        const isApproved = authorId === currentUserId ? 1 : 0;
        const parentId=replyParentId;
        const reply=replyContent.replace(/^@.*：/,"");
        if(!reply){
          this.$error({title:'内容不能为空！'});
          return;
        }
        this.request({isApproved, articleId:articleId, fromId, toId, netUrl,reply,parentId},()=>{
          this.getReplyList();
          this.toggleReplyBox();
        },false);
      },
      replyContentChange(e){
        const {reviewedMan:{name}}=this;
        const {value}=e.target;
        if(!/^@.*：/.test(value)) this.replyContent=`@${name}：`;
      }
    },
    computed:{
      getApi(){
        const {currentUser:{roleName="user"}}=this;
        return roleName==="admin"?AdminReplyAPI:UserReplyAPI;
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
      .getReplyList{
        color:#1890FF;
      }
    }
</style>
