<template>
  <div id="article">
    <v-action 
      class="action" 
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
        <a-breadcrumb-item><router-link to="/reply"><a>回复管理</a></router-link></a-breadcrumb-item>
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
          <a-button icon="delete" shape="circle" size="small" style="color:red;margin-left:10px;" @click="handleItems(AdminReplyAPI.DELETE)" />
          <a-button icon="check" shape="circle" size="small" style="color:green;" @click="handleItems(AdminReplyAPI.APPROVE)" />
          <a-button icon="close" shape="circle" size="small" style="color:#A020F0;" @click="handleItems(AdminReplyAPI.DISAPPROVE)" />
          <a-button icon="arrow-down" shape="circle" size="small" style="color:black;" @click="handleItems(AdminReplyAPI.UNTOP)" />
          <a-button icon="arrow-up" shape="circle" size="small" style="color:#A52A2A;" @click="handleItems(AdminReplyAPI.TOP)" />
        </span>
      </span>
      <a-button :type="allSelectedFlag?'danger':'primary'" size="small" @click="toggleSelectAll" style="font-size:10px;">{{allSelectedFlag ? '反选' : '全选'}}</a-button>
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
          <a-avatar slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" />
          <template slot="title">
            <span style="font-size:10px;color:gray;">
              《{{item.article.title}}》
              <a-tag color="cyan" v-if="item.parentId === 0" style="font-size:10px;margin:0px;">父</a-tag>
              <a-tag color="magenta" v-if="item.isApproved === 0" style="font-size:10px;margin:0px;">待审</a-tag>
            </span>
          </template>
        </a-list-item-meta>
        <p class="abstract">
          <i style="color:green; fontWeight: bold;">{{item.from.nickName}}</i>
          &nbsp;回复&nbsp;
          <span style="color: #A0522D;fontWeight: bold;">
            <i v-if="item.parentId === 0">该文</i>
            <i v-else>{{item.to.nickName}}</i>
            &nbsp;:&nbsp;
          </span>
          <b style="color: black;">{{`“${item.reply}”`}}</b>
        </p>
        <div class="clearfix">
          <span class="f_right">
            <a-icon type="clock-circle" />
            {{item.createDate|dateFormat("YYYY-MM-DD")}}
          </span>
        </div>
        <a-icon type="delete" slot="actions" style="color:red;" @click="handleItems(AdminReplyAPI.DELETE, item)" />
        <a-icon type="form" slot="actions" style="color:green;" @click="handleItems(AdminReplyAPI.FORM, item)" />
        <a-icon type="arrow-down" v-if="item.isTop===1" slot="actions" style="color:black;" @click="handleItems(AdminReplyAPI.UNTOP, item)" />
        <a-icon type="arrow-up" v-else slot="actions" style="color:#A52A2A;" @click="handleItems(AdminReplyAPI.TOP, item)" />
        <a-icon type="close" v-if="item.isApproved===1" slot="actions" style="color:#4169E1;" @click="handleItems(AdminReplyAPI.DISAPPROVE, item)" />
        <a-icon type="check" slot="actions" v-else style="color:#4169E1;" @click="handleItems(AdminReplyAPI.APPROVE, item)" />
        <a-button :type="selectedItems.some(i => i.id === item.id)?'danger':'primary'" size="small" style="font-size:10px;" slot="actions" @click="toggleSelectOne(item)">
          {{selectedItems.some(i => i.id === item.id)?"退选":"选中"}}
        </a-button>
      </a-list-item>
    </a-list>
    <v-editor 
      v-if="editorialPanelVisible"
      :editorialPanelVisible="editorialPanelVisible"
      :formItem="formItem"
      @cleanFormItem="cleanFormItem"
      @toggleEditorialPanel="toggleEditorialPanel"
      @request="request"
    />
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import Search from '../../components/Search/Search.vue';
  import Action from '../../components/Action/Action.vue';
  import EditorialForm from './EditorialForm.vue';
  import {baseImgUrl} from '../../utils/defaultSetting.js';
  import urls from '../../api/urls';
  const {AdminReplyAPI,AdminArticleAPI}=urls;
  export default {
    data () {
      return {
        baseImgUrl,
        conditionQuery: { title: '', category: {}, orderBy: {} },
        AdminReplyAPI,
        selectedItems:[],
        formItem:{},
        allSelectedFlag :false,
        editorialPanelVisible:false,
      }
    },
    components:{
      "v-search":Search ,
      "v-action":Action,
      "v-editor":EditorialForm,
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
        const payload={netUrl:AdminReplyAPI.LIST.url,conditionQuery,...paramsObj}
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
        console.log(111111111)
        const selectedItems  = this.selectedItems;
        const { url: netUrl, desc, actionTip } = action;
        const lang='zh_CN';
        let content = '';
        let items = [];
        if (item) {
          const { id, name,title,reply } = item;
          items = [{ id, name }];
          if (netUrl.includes('/article')) items = [{ id, name: title }];
          if (netUrl.includes('/reply')) items = [{ id, name: reply }];
          content = `【${items[0].name}】${actionTip[lang]}`;
        } else {
          items = selectedItems.map(v => ({ id: v.id, name: v.name }));
          if (netUrl.includes('/article')) items = selectedItems.map(v => ({ id: v.id, name: v.title }));
          if (netUrl.includes('/reply')) items = selectedItems.map(v => ({ id: v.id, name: v.reply }));
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
