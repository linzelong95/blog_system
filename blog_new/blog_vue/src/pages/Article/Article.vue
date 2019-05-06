<template>
  <div id="article">
    <v-action 
      class="action" 
      role="admin"
      @request="request" 
      @changeConditionQuery="changeConditionQuery" 
      :conditionQuery="conditionQuery" 
    />
    <v-search 
      @request="request"
      ref="searchRef"
    />
    <a-divider class="breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/homepage"><a>首页</a></router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/article"><a>文章管理</a></router-link></a-breadcrumb-item>
      </a-breadcrumb>
    </a-divider>
    <div class="operation">
      <span>
        <a-button type="primary" size="small" @click="toggleEditorialPanel" v-if="selectedItems.length===0">新增</a-button>
        <a-button type="primary" size="small" @click="toggleEditorialPanel" icon="plus" v-else />
        <span v-show="selectedItems.length>0">
          <a-badge :count="selectedItems.length">
            <!-- <a-button type="primary" size="small" @click="cleanSelectedItem">清空</a-button> -->
            <a-button type="primary" size="small" @click="cleanSelectedItem" icon="redo" />
          </a-badge>
          <a-button icon="delete" shape="circle" size="small" style="color:red;margin-left:10px;" @click="handleItems(AdminArticleAPI.DELETE)" />
          <a-button icon="unlock" shape="circle" size="small" style="color:green;" @click="handleItems(AdminArticleAPI.UNLOCK)" />
          <a-button icon="lock" shape="circle" size="small" style="color:#A020F0;" @click="handleItems(AdminArticleAPI.LOCK)" />
          <a-button icon="arrow-down" shape="circle" size="small" style="color:black;" @click="handleItems(AdminArticleAPI.UNTOP)" />
          <a-button icon="arrow-up" shape="circle" size="small" style="color:#A52A2A;" @click="handleItems(AdminArticleAPI.TOP)" />
        </span>
      </span>
      <a-button :type="allSelectedFlag?'danger':'primary'" size="small" @click="toggleSelectAll">{{allSelectedFlag ? '反选' : '全选'}}</a-button>
    </div>
    <a-list
      :loading="spinningFlag"
      itemLayout="vertical"
      :dataSource="list"
      :pagination="{
        current:index,
        total:total,
        pageSize:size,
        onChange: handlePageChange,
      }"
    >
      <a-list-item slot="renderItem" slot-scope="item" key="item.id" :class="{listitem:true,listactive:selectedItems.some(i => i.id === item.id)}">
        <a-icon type="pushpin" class="top" v-if="item.isTop===1" />
        <a-list-item-meta>
          <a-avatar size="large" slot="avatar" :src="`${baseImgUrl}${item.imageUrl}`||'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'" />
          <template slot="title">
            <a @click="readArticle(item.id,'admin')">
              {{item.title}}&nbsp;&nbsp;
              <a-tag color="purple" class="category" v-if="item.category && item.category.sort">
                <!-- <a-icon type="tag" />&nbsp; -->
                {{item.category.sort.name}},{{item.category.name}}
              </a-tag>
            </a>
          </template>
        </a-list-item-meta>
        <p class="abstract"><b>摘要：</b>{{item.abstract}}</p>
        <div class="tag-and-date">
          <span>
            <a-icon type="tags" v-if="item.tags&&item.tags.length" />
            {{item.tags&&item.tags.map(i=>i.name).join(", ")}}
          </span>
          <span>
            <a-icon type="clock-circle" />
            {{item.createDate|dateFormat("YYYY-MM-DD")}}
          </span>
        </div>
        <a-icon type="delete" slot="actions" style="color:red;" @click="handleItems(AdminArticleAPI.DELETE, item)" />
        <a-icon type="form" slot="actions" style="color:green;" @click="handleItems(AdminArticleAPI.FORM, item)" />
        <a-icon type="arrow-down" v-if="item.isTop===1" slot="actions" style="color:black;" @click="handleItems(AdminArticleAPI.UNTOP, item)" />
        <a-icon type="arrow-up" v-else slot="actions" style="color:#A52A2A;" @click="handleItems(AdminArticleAPI.TOP, item)" />
        <a-icon type="lock" v-if="item.isEnable===1" slot="actions" style="color:#4169E1;" @click="handleItems(AdminArticleAPI.LOCK, item)" />
        <a-icon type="unlock" slot="actions" v-else style="color:#4169E1;" @click="handleItems(AdminArticleAPI.UNLOCK, item)" />
        <a-button :type="selectedItems.some(i => i.id === item.id)?'danger':'primary'" size="small" slot="actions" @click="toggleSelectOne(item)">
          {{selectedItems.some(i => i.id === item.id)?"退选":"选中"}}
        </a-button>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import Search from '../../components/Search/Search.vue';
  import Action from '../../components/Action/Action.vue';
  import {baseImgUrl} from '../../utils/defaultSetting.js';
  import urls from '../../api/urls';
  const {AdminArticleAPI}=urls;
  export default {
    data () {
      return {
        baseImgUrl,
        conditionQuery: { title: '', category: {}, orderBy: {} },
        AdminArticleAPI,
        selectedItems:[],
        allSelectedFlag :false
      }
    },
    components:{
      "v-search":Search ,
      "v-action":Action
    },
    mounted(){
      this.request();
    },
    updated(){
      const { selectedItems,list } = this;
      this.allSelectedFlag = !list.length ? false : list.every(listItem => selectedItems.some(i => i.id === listItem.id));
    },
    destroyed(){
      this.$store.commit("save",{spinningFlag:false,list:[],index:1,size:10,total:0,formItem:{}});
    },
    methods:{
      async request(paramsObj={},callback,isConcat){
        const conditionQuery={...this.conditionQuery,title:this.searchContent};
        const payload={netUrl:AdminArticleAPI.LIST.url,conditionQuery,...paramsObj}
        this.$store.dispatch({type:"commonHandle",payload,callback,isConcat});
      },
      changeConditionQuery(obj){
        this.conditionQuery={...this.conditionQuery,...obj};
      },
      searchInputFocus(){
        this.$nextTick(()=>this.$refs.searchRef.focus());
      },
      readArticle(id,role){
        this.$router.push(`/read/${role}/${id}`);
      },
      handlePageChange(index,size){
        this.request({index,size});
      },
      cleanSelectedItem(){
        this.selectedItems=[];
        this.allSelectedFlag=false;
      },
      toggleEditorialPanel(){
        this.editorialPanelVisible=!this.editorialPanelVisible;
      },
      cleanFormItem(){
        this.cleanSelectedItem();
        this.formItem={};
      },
      toggleSelectOne(item)  {
        const { selectedItems,list } = this;
        const newSelectedItems = selectedItems.some(i => i.id === item.id)
          ? selectedItems.filter(i => i.id !== item.id)
          : [...selectedItems, item];
        this.allSelectedFlag  = !list.length
          ? false
          : list.every(listItem => newSelectedItems.some(i => i.id === listItem.id));
        this.selectedItems=newSelectedItems;
      },
      toggleSelectAll (){
        const {list} = this;
        if (!list.length) return;
        const { allSelectedFlag,selectedItems } = this;
        this.allSelectedFlag=!allSelectedFlag
        const uniqueSeletedItems = list.filter(i => !selectedItems.some(v => v.id === i.id));
        this.selectedItems = allSelectedFlag
          ? selectedItems.filter(i => !list.some(v => v.id === i.id))
          : [...selectedItems, ...uniqueSeletedItems];
      },
      handleItems(action,item){
        const selectedItems  = this.selectedItems;
        const { url: netUrl, desc, actionTip } = action;
        const lang='zh_CN';
        let content = '';
        let items = [];
        if (item) {
          const { id, name,title } = item;
          items = [{ id, name }];
          if (netUrl.includes('/article')) items = [{ id, name: title }];
          content = `【${items[0].name}】${actionTip[lang]}`;
        } else {
          items = selectedItems.map(v => ({ id: v.id, name: v.name }));
          if (netUrl.includes('/article'))
            items = selectedItems.map(v => ({ id: v.id, name: v.title }));
          content =
            lang === 'zh_CN'
              ? `注意：【${items[0].name}......】等多个所选项${actionTip[lang]}`
              : `warnning：Such as【${items[0].name}......】,they ${actionTip[lang]}`;
        }
        const title =lang === 'zh_CN'
            ? `确定${desc[lang]}吗？`
            : `Do you want to ${desc[lang]} what you have selected?`;
        const okText = '确定';
        const cancelText = '取消';
        const onCancel = () => this.cleanSelectedItem();
        const onOk = () => {
          if (netUrl.includes('/form')) {
            this.formItem=item;
            this.toggleEditorialPanel();
            return;
          }
          this.request({ netUrl, items });
        };
        this.$confirm({ title, content, okText, cancelText, onCancel, onOk });
      },
    },
    computed:{
      ...mapState(['list','total','index','size','spinningFlag']),
      ...mapState({
        searchContent:state=>state.search.searchContent
      }),
    }
  }
</script>

<style lang="scss" scoped>
  #article{
    width:100%;
    background: white;
    padding:10px;
    .action{
      position: fixed;
      top:250px;
      left:0px;
      z-index: 1000;
    }
    .breadcrumb{
      margin: 0px;
    }
    .operation{
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    .listactive{
      background: #FFFFE0;
    }
    .listitem{
      overflow: hidden;
      position: relative;
      .top{
        position: absolute;
        top: 0px;
        right: 0px;
        color:red;
      }
      .abstract{
        text-indent: 2em;
        margin:0px;
      }
      .tag-and-date{
        display: flex;
        justify-content: space-between;
        font-size:10px;
      }
    }
    /deep/ .ant-list-item-meta{
      margin-bottom: 0px;
    }
    /deep/ .ant-list-item-action{
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
</style>
