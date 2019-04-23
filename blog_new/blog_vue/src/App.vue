<template>
  <div id="app">
    <header  v-if="!['/login','/register'].includes($route.path)">
      <v-header @executeParentFunc="executeSonSearchInputFocus"  />
    </header>
    <router-link to="/homepage" v-else>
      <a class="home">
        <a-icon type="home" />
        <span>去首页</span>
      </a>
    </router-link>
    <section :class="{section:!['/login','/register'].includes($route.path)}">
      <router-view ref="son" />
    </section>
  </div>
</template>

<script>
import Header from './components/Header/Header.vue';
export default {
  name: 'app',
  methods:{
    executeSonSearchInputFocus(){
      this.$refs.son.searchInputFocus();
    }
  },
  components:{
    "v-header":Header
  },
}
</script>

<style lang="scss">
  *,::before,::after{
    margin:0px;
    padding:0px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }
  body{
    color: #333;
    background:#f5f5f5;
    font-family: 'Microsoft Yahei',sans-serif;
    height:100%;
    width:100%;
  }
  ul,ol{
    list-style: none;
  }
  a{
    text-decoration: none;
    color: #1890FF;
    &:link,&:hover,&:active,&:visited{
      text-decoration: none;
      color: #333;
    }
  }
  input,textarea{
    outline: none;
    border: none;
    resize:none;
    -webkit-appearance: none;
  }
  .clearfix::after,.clearfix::before{
    content:"";
    display: block;
    height:0;
    line-height: 0;
    visibility: hidden;
  }
  .f_left{
    float: left;
  }
  .f_right{
    float:right;
  }
  #app{
    width:100%;
    height:100%;
    position: relative;
    header{
      position: fixed;
      top:0;
      background: white;
      width:100%;
      padding: 0px 20px;
      z-index:999;
    }
    .home{
      display: block;
      position: absolute;
      top:20px;
      left:20px;
    }
    .section{
      padding:64px 10px 10px 10px;
    }
    section{
      display: block;
      height:100%; // 为什么设置了100% padding-bottom便不起作用？
    }
  }
</style>
