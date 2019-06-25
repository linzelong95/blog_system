<template>
  <div id="message">
    <a-button type="primary" @click="toggleMessageBox">留言</a-button>
    <a-spin :spinning="spinningFlag">
      <a-divider orientation="right">
          <span class="total">{{total}}</span>
          &nbsp;条留言&nbsp;
          <a-icon type="sync" class="sync" @click="request" />
      </a-divider>
      <a-list
        :loading="spinningFlag"
        itemLayout="vertical"
        :dataSource="list"
        :pagination="null"
      >
        <a-list-item slot="renderItem" slot-scope="item" key="item.id">
          <a-comment>
            <template slot="actions">
              <a style="padding-right:10px;" @click="handleDealWithMessage(item)">回复</a>
              <a style="padding-right:10px;color:red;" @click="handleDealWithMessage(item,getApi.DELETE)" v-if="currentUser.roleName==='admin'||(item.from&&currentUser.id===item.from.id)">删除</a>
              <a style="padding-right:10px;color:green;" @click="handleDealWithMessage(item,getApi.APPROVE)" v-if="currentUser.roleName==='admin'&&item.isApproved===0">展示</a>
              <a style="padding-right:10px;color:#B23AEE;" @click="handleDealWithMessage(item,getApi.DISAPPROVE)" v-if="currentUser.roleName==='admin'&&item.isApproved===1">隐藏</a>
              <a style="padding-right:10px;color:orange;" @click="handleDealWithMessage(item,getApi.TOP)" v-if="currentUser.roleName==='admin'&&item.isTop===0">置顶</a>
              <a style="color:#A0522D;" @click="handleDealWithMessage(item,getApi.UNTOP)" v-if="currentUser.roleName==='admin'&&item.isTop===1">取置</a>
            </template>
            <span slot="datetime">{{item.createDate|dateFormat("YYYY-MM-DD")}}</span>
            <a slot="author">{{item.from&&item.from.nickName}}</a>
            <span slot="author">
              {{item.from ? item.from.roleName === "admin" ? "博主" : item.from.nickName : `${item.fromMail} [游客]`}}&nbsp;
              <a v-if="item.blog" :href="item.blog" target="_blank" rel="noopener noreferrer"><a-icon type="paper-clip" /></a>
            </span>
            <a-avatar
              slot="avatar"
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt="Han Solo"
            />
            <span slot="content">
              <span :style="{'text-decoration':currentUser.roleName==='admin'&&item.isApproved===0?'line-through':'none'}">{{currentUser.roleName==='admin'|| item.isApproved===1?item.message:'（该内容待审核）'}}</span>
              <a-tag v-if="currentUser.roleName==='admin'&&item.isApproved===0" color="purple">待展示</a-tag>
            </span>
            <a-comment v-for="i in item.children" :key="i.id">
              <template slot="actions">
                <a style="padding-right:10px;" @click="handleDealWithMessage(i)">回复</a>
                <a style="padding-right:10px;color:red;" @click="handleDealWithMessage(i,getApi.DELETE)" v-if="currentUser.roleName==='admin'||(i.from&&currentUser.id===i.from.id)">删除</a>
                <a style="padding-right:10px;color:green;" @click="handleDealWithMessage(i,getApi.APPROVE)" v-if="currentUser.roleName==='admin'&&i.isApproved===0">展示</a>
                <a style="padding-right:10px;color:#B23AEE;" @click="handleDealWithMessage(i,getApi.DISAPPROVE)" v-if="currentUser.roleName==='admin'&&i.isApproved===1">隐藏</a>
                <a style="padding-right:10px;color:orange;" @click="handleDealWithMessage(i,getApi.TOP)" v-if="currentUser.roleName==='admin'&&i.isTop===0">置顶</a>
                <a style="color:#A0522D;" @click="handleDealWithMessage(i,getApi.UNTOP)" v-if="currentUser.roleName==='admin'&&i.isTop===1">取置</a>
              </template>
              <span slot="author">
                {{i.from ? i.from.roleName === "admin" ? "博主" : i.from.nickName : `${i.fromMail} [游客]`}}&nbsp;
                <a v-if="i.blog" :href="i.blog" target="_blank" rel="noopener noreferrer"><a-icon type="paper-clip" /></a>
                &nbsp;回复&nbsp;
                {{i.to ? i.to.roleName === "admin" ? "博主" : i.to.nickName : `${i.toMail}[游客]`}}
              </span>
              <span slot="datetime">{{i.createDate|dateFormat("YYYY-MM-DD")}}</span>
              <a-avatar
                slot="avatar"
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt="Han Solo"
              />
              <span slot="content">
              <span :style="{'text-decoration':i.isApproved===0?'line-through':'none'}">{{currentUser.roleName==='admin'|| i.isApproved===1?i.message:'（该内容待审核）'}}</span>
                <a-tag v-if="currentUser.roleName==='admin'&&i.isApproved===0" color="purple">待展示</a-tag>
              </span>
            </a-comment>
          </a-comment>
        </a-list-item>
      </a-list>
    </a-spin>
    <a-drawer
      placement="bottom"
      :height="250"
      @close="toggleMessageBox"
      :visible="reviewBoxVisible"
    >
      <span slot="title">
        邮箱：<a-input style="width:75%" :placeholder="currentUser.id?'选填':'游客必填'" v-model="fromMail"/>
      </span>
      <a-textarea v-model="messageContent" :autosize="{minRows:2,maxRows:2}" ref="messageContentRef" @change="messageContentChange" />
      <a-input placeholder="http://您的博客，选填" style="margin:15px 0px" v-model="blog" />
       <!-- :style="{background:'red',display:'flex','justify-content':'flex-end','margin-top':'20px'}" -->
      <div :style="{display:'flex','justify-content':'flex-end'}" >
        <a-button size="small" @click="toggleWriteMessage('reset')" :style="{'margin-right':'10px'}">重置</a-button>
        <a-button size="small" type="primary" @click="toggleWriteMessage">确定</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import urls from '../../api/urls';
  const { UserMessageAPI ,AdminMessageAPI}=urls;

  export default {
    data () {
      return {
        conditionQuery: {  category: {}, orderBy: {} },
        reviewBoxVisible:false,
        reviewedMan:{},
        messageParentId:0,
        messageContent:"",
        blog:"",
        fromMail:""
      }
    },
    mounted(){
      this.request()
    },
    destroyed(){
      this.$store.commit("save",{spinningFlag:false,list:[],index:1,size:10,total:0,formItem:{}});
    },
    methods:{
      request(paramsObj={},callback,hasExtraParamsFlag=true){
        const payload=hasExtraParamsFlag?{
          conditionQuery:this.conditionQuery,
          prettyFormat: true ,
          netUrl:this.getApi.LIST.url,
          size:9999,
          ...paramsObj
        }:{size:9999,...paramsObj};
        this.$store.dispatch({type:"commonHandle",payload,callback});
      },
      handleDealWithMessage(messageItem,action){
        const {currentUser:{id:currentUserId,roleName="user"}}=this;
        const { from, id, parentId: pid, message,fromMail: toMail  } = messageItem;
        let actionAPIs=[this.getApi.DELETE.url];
        if(roleName==="admin"){
          actionAPIs=[this.getApi.DELETE.url,this.getApi.TOP.url,this.getApi.UNTOP.url,this.getApi.APPROVE.url,this.getApi.DISAPPROVE.url];
        }
        if (action && actionAPIs.includes(action.url)) {
          const items = [{ id, parentId: pid, name: message }];
          this.request({ netUrl: action.url, items });
          return;
        }
        this.reviewBoxVisible=true;
        this.reviewedMan={name:from !== null ? from.nickName : toMail,id: from !== null ? from.id : toMail};
        this.messageParentId=pid > 0 ? pid : id;
        this.messageContent=`@${from !== null ? from.nickName : toMail}：`;
        this.$nextTick(()=>{
            this.$refs.messageContentRef.focus();
          });
      },
      toggleMessageBox(){
        const {reviewBoxVisible}=this;
        this.reviewBoxVisible=!reviewBoxVisible;
        if(!reviewBoxVisible){
          this.blog="";
          this.fromMail="";
          this.reviewedMan={name:"博主", id:"博主"};
          this.messageContent="@博主：";// 注意冒号是中文的
          this.$nextTick(()=>{
            this.$refs.messageContentRef.focus();
          });
        }else{
          this.blog="";
          this.fromMail="";
          this.reviewedMan={};
          this.messageParentId=0;
          this.messageContent="";
        }
      },
      toggleWriteMessage(mark){
        const { currentUser: { id: currentUserId },reviewedMan,messageContent,messageParentId,blog,fromMail} = this;
        if(mark==="reset"){
          const arr=messageContent.split("：");
          this.messageContent=`${arr[0]}：`;
          this.$refs.messageContentRef.focus();
          this.blog="";
          this.fromMail="";
          return;
        }
        const fromId = currentUserId;
        const netUrl = this.getApi.INSERT.url;
        const toId = typeof reviewedMan.id==="number"?reviewedMan.id:undefined;
        const parentId=messageParentId;
        const message=messageContent.replace(/^@.*：/,"");
        const toMail=typeof reviewedMan.id !== "number" && reviewedMan.id !== "博主" ? reviewedMan.id : "无";
        if(!message){
          this.$error({title:'内容不能为空！'});
          return;
        }
        if(!currentUserId&& (!fromMail||!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(fromMail))){
          this.$error({title:'请输入正确的邮箱！'});
          return;
        }
        if(blog&&!/^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(blog)){
          this.$error({title:'请输入正确的地址，以http开头！'});
          return;
        }
        this.request({fromId, toId, netUrl,message,parentId});
        this.toggleMessageBox();
      },
      messageContentChange(e){
        const {reviewedMan:{name}}=this;
        const {value}=e.target;
        if(!/^@.*：/.test(value)) this.messageContent=`@${name}：`;
      }
    },
    computed:{
      getApi(){
        const {currentUser:{roleName="user"}}=this;
        return roleName==="admin"?AdminMessageAPI:UserMessageAPI;
      },
      ...mapState(['list','total','index','size','spinningFlag']),
      ...mapState({
        currentUser:state=>state.login.currentUser,
      }),
    }
  }
  </script>

  <style lang="scss" scoped>
    #message{
      background: white;
      padding: 10px;
      .total{
        color:#1890FF;
        font-size: 25px;
        font-weight: bold;
      }
      .sync{
        color:#1890FF;
      }
    }
</style>
