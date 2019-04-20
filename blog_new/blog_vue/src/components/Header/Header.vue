<template>
  <div id="header">
    <div class="back"  v-show="backFlag">
      <a-icon type="left-circle" @click="goBack" />
    </div>
    <div class="logo" :class="{f_left:!backFlag}">
      <router-link to="/homepage">
        <img src="../../assets/logo.png">
        <span>向上的博客</span>
      </router-link>
    </div>
    <div class="menu">
      <span class="search" @click="toggleShowSearch">
        <a-icon type="search" />
        <a-icon type="caret-down" class="down" v-if="$store.state.search.searchBoxFlag" />
        <a-icon type="caret-up" class="up" v-else />
      </span>
      &nbsp;&nbsp;&nbsp;
      <a-icon type="menu-fold" @click="toggleMenu" />
    </div>
    <div>
      <a-drawer
        title="菜单栏"
        placement="right"
        width=150
        @close="toggleMenu"
        :visible="menuFlag"
      >
        <a-menu
          style="width: 256px"
          mode="vertical"
          v-model="current"
          @click="changeMenu"
        >
          <a-menu-item key="homepage">
            <a-icon type="mail" />首页
          </a-menu-item>
          <a-menu-item key="article">
            <a-icon type="calendar" />文章管理
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
          <a-menu-item key="login">
            <a-icon type="calendar" />登录
          </a-menu-item>
          <a-menu-item key="register">
            <a-icon type="calendar" />注册
          </a-menu-item>
        </a-menu>
      </a-drawer>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuFlag:false,
      backFlag:false,
      current:["homepage"]
    }
  },
  created(){
    this.backFlag=this.$route.path!=="/homepage";
  },
  methods:{
    toggleMenu(){
      this.menuFlag=!this.menuFlag;
    },
    goBack(){
      this.$router.go(-1);
    },
    toggleShowSearch(){
      this.$store.dispatch({type:"search/toggleSearchBox"});
      if(this.$store.state.search.searchBoxFlag) this.$emit("executeParentFunc");
    },
    changeMenu(obj){
      const {key}=obj;
      this.toggleMenu();
      this.$router.push(`/${key}`);
    }
  },
  watch:{
    "$route.path":function(newVal){
      this.backFlag=newVal!=="/homepage";
      this.current=[newVal.slice(1)];
    }
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
          font-size: 2px;
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
