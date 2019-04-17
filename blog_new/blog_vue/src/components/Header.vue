<template>
  <div id="header">
    <div class="logo">
      <img src="../assets/logo.png">
      <span>向上的博客</span>
    </div>
    <div class="menu">
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
      menuFlag:false
    }
  },
  methods:{
    toggleMenu(){
      this.menuFlag=!this.menuFlag;
    }
  }
}
</script>

<style lang="scss" scoped>
  #header{
    width:100%;
    height:50px;
    .logo{
      float: left;
      line-height: 50px;
      img{
        width:36px;
        height:36px;
      }
    }
    .menu{
      float: right;
      line-height: 50px;
    }
  }
</style>
