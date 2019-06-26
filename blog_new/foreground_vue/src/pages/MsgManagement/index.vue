<template>
  <div id="message">
    <v-action 
      class="action" 
      @request="request" 
      @changeConditionQuery="changeConditionQuery" 
      :conditionQuery="conditionQuery" 
    />
    <v-search 
      @request="request"
      ref="searchRef"
      placeholder="留言内容搜索"
    />
    <a-divider class="breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/homepage"><a>首页</a></router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/msgmanagement"><a>留言管理</a></router-link></a-breadcrumb-item>
      </a-breadcrumb>
    </a-divider>
    <div class="operation">
      <span>
        <a-button type="primary" size="small" @click="toggleEditorialPanel" v-if="selectedItems.length===0">新增</a-button>
        <a-button type="primary" size="small" @click="toggleEditorialPanel" icon="plus" v-else />
        <span v-show="selectedItems.length>0">
          <a-badge :count="selectedItems.length">
            <a-button type="primary" size="small" @click="cleanSelectedItem">清空</a-button>
          </a-badge>
          <a-button icon="delete" shape="circle" size="small" style="color:red;margin-left:10px;" @click="handleItems(AdminMessageAPI.DELETE)" />
          <a-button icon="check" shape="circle" size="small" style="color:green;" @click="handleItems(AdminMessageAPI.APPROVE)" />
          <a-button icon="close" shape="circle" size="small" style="color:#A020F0;" @click="handleItems(AdminMessageAPI.DISAPPROVE)" />
          <a-button icon="arrow-down" shape="circle" size="small" style="color:black;" @click="handleItems(AdminMessageAPI.UNTOP)" />
          <a-button icon="arrow-up" shape="circle" size="small" style="color:#A52A2A;" @click="handleItems(AdminMessageAPI.TOP)" />
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
          <a-avatar slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" />
          <span slot="title" class="title">
            <span style="color:green;fontWeight:bold">
              <i>{{item.from ? item.from.nickName : `${item.fromMail} [游客]`}}&nbsp;</i>
            </span>
            的留言
            <span v-if="item.parentId > 0">
              (
              回复&nbsp;
              <i style="color:#A0522D;fontWeight:bold">{{item.to ? item.to.nickName : `${item.toMail} [游客]`}}</i>
              &nbsp;
              )
            </span>
            &nbsp;:&nbsp;
            <a-tag color="cyan" v-if="item.parentId === 0">父</a-tag>
            <a-tag color="magenta" v-if="item.isTop === 1">已置顶</a-tag>
            <a-tag color="orange" v-if="item.isApproved === 0">待审核</a-tag>
          </span>
        </a-list-item-meta>
        <p class="content">{{item.message}}</p>
        <div class="clearfix">
          <span class="f_right">
            <a-icon type="clock-circle" />
            {{item.createDate|dateFormat("YYYY-MM-DD")}}
          </span>
        </div>
        <a-icon type="delete" slot="actions" style="color:red;" @click="handleItems(AdminMessageAPI.DELETE, item)" />
        <a-icon type="form" slot="actions" style="color:green;" @click="handleItems(AdminMessageAPI.FORM, item)" />
        <a-icon type="arrow-down" v-if="item.isTop===1" slot="actions" style="color:black;" @click="handleItems(AdminMessageAPI.UNTOP, item)" />
        <a-icon type="arrow-up" v-else slot="actions" style="color:#A52A2A;" @click="handleItems(AdminMessageAPI.TOP, item)" />
        <a-icon type="close" v-if="item.isApproved===1" slot="actions" style="color:#4169E1;" @click="handleItems(AdminMessageAPI.DISAPPROVE, item)" />
        <a-icon type="check" slot="actions" v-else style="color:#4169E1;" @click="handleItems(AdminMessageAPI.APPROVE, item)" />
        <a-button :type="selectedItems.some(i => i.id === item.id)?'danger':'primary'" size="small" slot="actions" @click="toggleSelectOne(item)">
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
  import Action from './Action.vue';
  import EditorialForm from './EditorialForm.vue';
  import urls from '../../api/urls';
  const {AdminMessageAPI}=urls;
  export default {
    data () {
      return {
        conditionQuery: { message: '', category: {}, orderBy: {} },
        AdminMessageAPI,
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
        const conditionQuery={...this.conditionQuery,message:this.searchContent};
        const payload={netUrl:AdminMessageAPI.LIST.url,conditionQuery,...paramsObj}
        this.$store.dispatch({type:"commonHandle",payload,callback,isConcat});
        if (payload.netUrl !== AdminMessageAPI.LIST.url) this.cleanSelectedItem();
      },
      changeConditionQuery(obj){
        this.conditionQuery={...this.conditionQuery,...obj};
      },
      searchInputFocus(){
        this.$nextTick(()=>this.$refs.searchRef.focus());
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
          const { id, name,title,message } = item;
          items = [{ id, name }];
          if (netUrl.includes('/article')) items = [{ id, name: title }];
          if (netUrl.includes('/message')) items = [{ id, name: message }];
          content = `【${items[0].name}】${actionTip[lang]}`;
        } else {
          items = selectedItems.map(v => ({ id: v.id, name: v.name }));
          if (netUrl.includes('/article')) items = selectedItems.map(v => ({ id: v.id, name: v.title }));
          if (netUrl.includes('/message')) items = selectedItems.map(v => ({ id: v.id, name: v.message }));
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
  #message{
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
      .title{
        font-size: 12px;
      }
      .content{
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
