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
        <a-icon type="caret-down" class="down" v-if="showSearchFlag" />
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
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
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
      showSearchFlag:false
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
      this.$emit("executeAppToggleShowSearch");
      this.showSearchFlag=!this.showSearchFlag;
    }
  },
  watch:{
    "$route.path":function(newVal){
      this.backFlag=newVal!=="/homepage";
    }
  }
}
</script>

<style lang="scss" scoped>
  #header{
    width:100%;
    height:50px;
    line-height: 50px;
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
