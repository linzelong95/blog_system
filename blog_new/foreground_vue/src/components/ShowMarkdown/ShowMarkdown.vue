<template>
  <div id="markdown" v-html="markedFunc">
    <!-- <div v-html="markedFunc" /> -->
  </div>
</template>

<script>
import marked from './helpers/marked';
import 'highlight.js/styles/tomorrow.css';
export default {

  props:["value"],
  computed:{
    markedFunc:function(){
      return marked(this.value);
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../node_modules/highlight.js/styles/tomorrow.css';
  #markdown{
    line-height: 2;

    p,
    blockquote,
    ul,
    ol,
    dl,
    pre {
      margin-top: 0;
      margin-bottom: 0.6em;
    }

    h1,
    h2 {
      border-bottom: 1px solid #e2e2e2;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      padding: 0;
      margin: 0 0 0.6em;
      font-weight: 600;

      text-indent: 0;

      &:target {
        padding-top: 4.5rem;
      }
    }

    a {
      color: #0366d6;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    ul,
    ol {
      padding: 0.2em 0.8em;

      > li {
        line-height: 2;



        
        padding-left: 0.2em;
        margin-left: 0.2em;
        list-style-type: disc;

        > p {
          text-indent: 0;
        }

        > ul {
          li {
            list-style-type: circle;
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    > ul,
    ol {
      padding: 0 20px;
    }

    ol > li {
      list-style-type: decimal;
    }

    blockquote {
      margin: 0;
      margin-bottom: 0.6em;
      padding: 0 1em;
      color: #6a737d;
      border-left: 0.25em solid #dfe2e5;

      p {
        text-indent: 0;

        &:first-child {
          margin-top: 0;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    pre {
      padding: 0.6em;
      overflow: auto;
      line-height: 1.6;
      background-color: #f0f0f0;
      border-radius: 3px;

      code {
        padding: 0;
        margin: 0;
        font-size: 100%;
        background: transparent;
      }
    }

    code {
      padding: 0.2em 0.4em;
      margin: 0;
      background-color: #f0f0f0;
      border-radius: 3px;
    }

    hr {
      margin-bottom: 0.6em;
      height: 1px;
      background: #dadada;
      border: none;
    }

    table {
      width: 100%;
      border: 1px solid #ddd;
      margin-bottom: 0.6em;
      border-collapse: collapse;
      text-align: left;
      th,
      td {
        padding: 0.1em 0.4em;
        border: 1px solid #ddd;
      }
    }

    img {
      display: block;
      margin: 0 auto;
      max-width: 100%;
      margin-bottom: 0.6em;
    }
  }
</style>
