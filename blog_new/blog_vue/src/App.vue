<template>
  <div id="app">
    <header  v-if="!['/login'].includes($route.path)">
      <v-header @executeParentFunc="executeSonSearchInputFocus" />
    </header>
    <section :class="{section:!['/login'].includes($route.path)}">
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
  }
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
    color: #333;
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
    header{
      position: fixed;
      top:0;
      background: white;
      width:100%;
      padding: 0px 20px;
      z-index:999;
    }
    .section{
      margin:0px 10px;
      padding:64px 0px 10px 0px;
    }
    section{
      height:100%;
    }
  }
</style>
