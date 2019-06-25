<template>
  <div id="timeline">
    <a-spin :spinning="spinningFlag">
      <a-divider class="breadcrumb">
        <a-breadcrumb>
          <a-breadcrumb-item><router-link to="/homepage"><a>首页</a></router-link></a-breadcrumb-item>
          <a-breadcrumb-item><router-link to="/timeline"><a>时间轴</a></router-link></a-breadcrumb-item>
        </a-breadcrumb>
      </a-divider>
      <a-timeline>
        <a-timeline-item v-for="item in list" :key="item.id" :color="getColor()" @click="readArticle(item.id)">
          <a>{{item.title}}</a>
          <span style="display:block">{{item.createDate|dateFormat("YYYY-MM-DD")}}</span>
        </a-timeline-item>
        <a-timeline-item key="more" v-if="list.length!== total && !spinningFlag">
          <a-button @click="loadMore">加载更多>></a-button>
        </a-timeline-item>
      </a-timeline>
    </a-spin>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import urls from '../../api/urls';
  import {getRandomColor} from '../../utils/utils'
  const {UserCourseAPI}=urls;
  export default {
    data () {
      return {
        conditionQuery: { title: '', category: {}, orderBy: {} },
      }
    },
    mounted(){
      this.request({},null,true);
    },
    destroyed(){
      this.$store.commit("save",{spinningFlag:false,list:[],index:1,size:10,total:0,formItem:{}});
    },
    methods:{
      async request(paramsObj={},callback,isConcat){
        const conditionQuery={...this.conditionQuery,title:this.searchContent};
        const payload={netUrl:UserCourseAPI.LIST.url,conditionQuery,...paramsObj};
        this.$store.dispatch({type:"commonHandle",payload,callback,isConcat});
      },
      loadMore(){
        this.request({index:this.index+1},null,true);
      },
      readArticle(id){
        this.$router.push(`/read/${id}`);
      },
      getColor(){
        return getRandomColor();
      }
    },
    computed:{
      ...mapState(['list','total','index','spinningFlag']),
    }
  }
</script>

<style lang="scss" scoped>
  #timeline{
    width:100%;
    background: white;
    padding:10px;
    .breadcrumb{
      margin: 0px 0px 10px 0px;
    }
  }
</style>
