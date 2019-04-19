<template>
  <div id="reply">
    <a-divider orientation="right">
        <span class="total">{{total}}</span>
        &nbsp;条评论&nbsp;
        <a-icon type="reload" class="reload" />
    </a-divider>
    <a-comment v-for="item in list" :key="item.id">
      <template slot="actions">
      <span>
        <a-icon type="like" />
        <span style="padding-left: '8px';cursor: 'auto'">
          喜欢
        </span>
      </span>
      <span>
        <a-icon type="dislike" />
        <span style="padding-left: '8px';cursor: 'auto'">
          不喜欢
        </span>
      </span>
      <span>Reply to</span>
    </template>
      <a slot="author">Han Solo</a>
      <a-avatar
        slot="avatar"
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        alt="Han Solo"
      />
      <p slot="content">{{item.reply}}</p>
      <a-comment v-for="i in item.children" :key="i.id">
        <span slot="actions">Reply to</span>
        <a slot="author">Han Solo</a>
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
import UserReply from '../../api/UserReply';
const userReplyAPI=new UserReply();
export default {
  data () {
    return {
      conditionQuery: {  category: {}, orderBy: {} },
      index:1,
      size:10,
      total:0,
      list:[],
      spinningFlag:false
    }
  },
  props:["articleId"],
  created(){
    this.getReplyList();
  },
  methods:{
    getReplyList(paramsObj={},isConcat){
      const articleIdsArr= [this.articleId*1];
      this.spinningFlag=true;
      const {index=this.index,size=this.size}=paramsObj;
      paramsObj.conditionQuery = { ...this.conditionQuery, articleIdsArr };
      userReplyAPI.list({
        size,
        index,
        conditionQuery:this.conditionQuery,
        prettyFormat: true ,
        ...paramsObj
      })
      .then(res=>{
        const {data:{list,total}}=res;
        const newList=isConcat?[...this.list,...list]:list;
        this.list=newList;
        this.index=index;
        this.total=total;
        this.moreFlag=newList.length!==total;
        this.spinningFlag=false;
      })
      .catch(e=>this.$error({title:"请求出错！"}));
    },
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
