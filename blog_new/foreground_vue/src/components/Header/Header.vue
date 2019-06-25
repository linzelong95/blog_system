<template>
  <div id="header">
    <div class="back"  v-show="backFlag">
      <a-icon type="left-circle" @click="goBack" />
    </div>
    <div class="logo" :class="{f_left:!backFlag}" @click="goHome">
      <img src="../../assets/logo.png">
      <span>向上的博客</span>
    </div>
    <div class="menu">
      <span class="search" @click="toggleShowSearch" v-if="searchIconFlag">
        <a-icon type="search" />
        <a-icon type="caret-down" class="down" v-if="searchBoxFlag" />
        <a-icon type="caret-up" class="up" v-else />
      </span>
      &nbsp;&nbsp;&nbsp;
      <a-icon type="menu-fold" @click="toggleMenu" />
    </div>
    <div>
      <a-drawer
        title="菜单栏"
        placement="right"
        :width="150"
        @close="toggleMenu"
        :visible="menuFlag"
      >
        <a-menu
          style="width: 126px"
          mode="vertical"
          :selectedKeys="current"
          @click="changeMenu"
        >
          <a-menu-item key="homepage">
            <a-icon type="mail" />首页
          </a-menu-item>
          <a-menu-item key="message">
            <a-icon type="mail" />留言板
          </a-menu-item>
          <a-menu-item key="timeline">
            <a-icon type="mail" />时间轴
          </a-menu-item>
          <a-menu-item key="article">
            <a-icon type="calendar" />文章管理
          </a-menu-item>
          <a-menu-item key="msgManagement">
            <a-icon type="calendar" />留言管理
          </a-menu-item>
          <a-menu-item key="tag">
            <a-icon type="calendar" />标签管理
          </a-menu-item>
          <a-menu-item key="category">
            <a-icon type="calendar" />分类管理
          </a-menu-item>
          <a-menu-item key="reply">
            <a-icon type="calendar" />回复管理
          </a-menu-item>
          <a-menu-item key="logout" v-show="loginStatus">
            <a-icon type="calendar" />退出账号
          </a-menu-item>
          <a-menu-item key="login" v-show="!loginStatus">
            <a-icon type="calendar"/>登录账号
          </a-menu-item>
          <a-menu-item key="register" v-show="!loginStatus">
            <a-icon type="calendar" />注册账号
          </a-menu-item>
        </a-menu>
      </a-drawer>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import store from 'store';
  import urls from '../../api/urls';
  const {AccountAPI,UserArticleAPI}=urls;
  export default {
    data () {
      return {
        menuFlag:false,
        backFlag:false,
        searchIconFlag:true,
        current:["homepage"]
      }
    },
    mounted(){
      const pathname=this.$route.path;
      this.current=[pathname.substring(1)];
      this.backFlag=pathname!=="/homepage";
      this.searchIconFlag=["/read","timeline","/message"].every(i=>!pathname.includes(i));
      const currentPageUrl=window.location.href;
      const user=store.get("blog_account")||{};
      const {currentUser}=user;
      if(!this.loginStatus&&currentUser&&!currentPageUrl.includes("/login")){
        this.$store.dispatch({type:"login/login",payload:{...user,autoLoginMark:true}});
      }
    },
    methods:{
      toggleMenu(){
        this.menuFlag=!this.menuFlag;
      },
      goBack(){
        this.$router.go(-1);
      },
      goHome(){
        const {pathname}=window.location;
        if(pathname==="/homepage") {
          this.$store.dispatch({
            type: "search/setSearchContent",
            payload: { searchContent: "" }
          });
          this.$store.dispatch({ 
            type: "search/toggleSearchBox" ,
            payload:{searchBoxFlag:false}
          });
          this.$store.dispatch({
            type:"commonHandle",
            payload:{netUrl:UserArticleAPI.LIST.url,conditionQuery:{}}
          });
          return;
        }
        this.$router.push("/homepage");
      },
      toggleShowSearch(){
        this.$store.dispatch({type:"search/toggleSearchBox"});
        if(this.searchBoxFlag) this.$emit("executeParentFunc");
      },
      changeMenu(obj){
        const {key}=obj;
        this.toggleMenu();
        if(key==="logout") {
          this.$store.dispatch({type:"login/logout"});
          return;
        }
        this.$router.push(`/${key}`);
      }
    },
    watch:{
      "$route.path":function(newVal){
        this.backFlag=newVal!=="/homepage";
        this.searchIconFlag=["/read","timeline","/message"].every(i=>!newVal.includes(i));
        this.current=[newVal.substring(1)];
      }
    },
    computed:{
      ...mapState({
        searchBoxFlag:state=>state.search.searchBoxFlag,
        loginStatus:state=>state.login.loginStatus,
      }),
    }
  }
</script>

<style lang="scss" scoped>
  #header{
    width:100%;
    height:54px;
    line-height: 54px;
    position: relative;
    .back{
      position: absolute;
      left: 0;
    }
    .logo{
      text-align: center;
      img{
        width:36px;
        height:36px;
      }
    }
    .menu{
      position: absolute;
      right: 0;
      top:0;
      .search{
        position: relative;
        display: inline-block;
        .up,.down{
          color:#1890ff;
          position: absolute;
          left:5px;
        }
        .up{
          top:7px;
        }
        .down{
          bottom:7px;
        }
      }
    }
  }
</style>
