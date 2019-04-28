<template>
  <div id="category">
    <v-search 
      @request="request"
      placeholder="分类搜索"
      ref="searchRef"
    />
    <a-tabs :activeKey="tabKey" size="small" @change="handleChangeTabs">
      <a-tab-pane tab="父分类" key="sort"/>
      <a-tab-pane tab="子分类" key="cate"/>
      <a-breadcrumb slot="tabBarExtraContent" class="breadcrumb">
        <a-breadcrumb-item><router-link to="/homepage"><a>首页</a></router-link></a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="/category"><a>分类管理</a></router-link></a-breadcrumb-item>
      </a-breadcrumb>
    </a-tabs>
    <div class="operation">
      <span>
        <a-button type="primary" size="small" @click="toggleEditorialPanel">新增</a-button>
        <span v-show="selectedItems.length>0">
          <a-badge :count="selectedItems.length">
            <a-button type="primary" size="small" @click="cleanSelectedItem">清空</a-button>
          </a-badge>
          <a-button icon="delete" shape="circle" size="small" style="color:red;margin-left:20px;" @click="handleItems(tabKey === 'sort' ? AdminSortAPI.DELETE : AdminCateAPI.DELETE)" />
          <a-button icon="unlock" shape="circle" size="small" style="color:green;" @click="handleItems(tabKey === 'sort' ? AdminSortAPI.UNLOCK : AdminCateAPI.UNLOCK)" />
          <a-button icon="lock" shape="circle" size="small" style="color:#A020F0;" @click="handleItems(tabKey === 'sort' ? AdminSortAPI.LOCK : AdminCateAPI.LOCK)" />
        </span>
      </span>
      <a-button type="primary" icon="home" shape="circle" size="small" @click="handleShowAll" />
    </div>
    <a-table
      :columns="getColumn()[tabKey]"
      :rowKey="record=>record.id"
      :dataSource="list"
      :loading="spinningFlag"
      :rowSelection="{
        selectedRowKeys:selectedItems.map(i=>i.id),
        onChange:handleSelectRows
      }"
      :pagination="{
        current:index,
        total:total,
        pageSize:size,
      }"
      @change="handleTableChange"
      :scroll="tabKey==='sort'?undefined:{x:450}"
      size="small"
    >
      <template slot="sort" slot-scope="val">
        {{val && val.name}}
      </template>
      <template slot="isEnable" slot-scope="val">
        <a-tag color="blue" v-if="val===1">可用</a-tag>
        <a-tag color="gray" v-else>禁用</a-tag>
      </template>
      <template slot="action" slot-scope="_,item">
        <a-button icon="form" size="small" shape="circle" style="color:#8B3A3A" @click="handleItems(tabKey==='cate'?AdminCateAPI.FORM:AdminSortAPI.FORM, item)" /> 
        <a-button icon="delete" size="small" shape="circle" style="color:red" @click="handleItems(tabKey==='cate'?AdminCateAPI.DELETE:AdminSortAPI.DELETE, item)" /> 
        <a-button icon="lock" size="small" shape="circle" style="color:#A020F0" @click="handleItems(tabKey==='cate'?AdminCateAPI.LOCK:AdminSortAPI.LOCK, item)" v-if="item.isEnable===1" /> 
        <a-button icon="unlock" size="small" shape="circle" style="color:green" @click="handleItems(tabKey==='cate'?AdminCateAPI.UNLOCK:AdminSortAPI.UNLOCK, item)" v-else /> 
      </template>
      <a-table
        :slot="tabKey==='sort'?'expandedRowRender':null"
        slot-scope="record"
        :rowKey="record=>record.id"
        :columns="getColumn()[tabKey].map(i=>{i.align='center';return i;})"
        :dataSource="record.categories.map(i=>({...i,sort:{id:record.id,name:record.name}}))"
        :pagination="false"
        :showHeader="false"
      >
        <template slot="action" slot-scope="_,item">
          <a-button icon="form" size="small" shape="circle" style="color:#8B3A3A" @click="handleItems(AdminCateAPI.FORM, item)" /> 
          <a-button icon="delete" size="small" shape="circle" style="color:red" @click="handleItems(AdminCateAPI.DELETE, item)" /> 
          <a-button icon="lock" size="small" shape="circle" style="color:#A020F0" @click="handleItems(AdminCateAPI.LOCK, item)" v-if="item.isEnable===1" /> 
          <a-button icon="unlock" size="small" shape="circle" style="color:green" @click="handleItems(AdminCateAPI.UNLOCK, item)" v-else /> 
        </template>
      </a-table>
    </a-table>
    <v-editor-sort
      v-if="editorialPanelVisible&&useEditor==='sort'"
      :editorialPanelVisible="editorialPanelVisible"
      :formItem="formItem"
      @cleanFormItem="cleanFormItem"
      @toggleEditorialPanel="toggleEditorialPanel"
      @request="request"
    />
    <v-editor-cate
      v-if="editorialPanelVisible&&useEditor==='cate'"
      :tabKey="tabKey"
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
  import CateEditorialForm from './CateEditorialForm.vue';
  import SortEditorialForm from './SortEditorialForm.vue';
  import urls from '../../api/urls';
  const { AdminCateAPI ,AdminSortAPI}=urls;
  export default {
    data () {
      return {
        conditionQuery: { name: '',orderBy :{}, sortIdsArr : []  },
        selectedItems:[],
        filters: {},
        AdminCateAPI,
        AdminSortAPI,
        editorialPanelVisible:false,
        formItem:{},
        categoryOptions:[],
        tabKey:"sort",
        useEditor:"sort"
      }
    },
    components:{
      "v-editor-sort":SortEditorialForm,
      "v-editor-cate":CateEditorialForm,
      "v-search":Search 
    },
    created(){
      this.$store.commit("save",{spinningFlag:false,list:[],index:1,size:10,total:0,formItem:{}});
    },
    mounted(){
      this.request();
    },
    destroyed(){
      this.$store.commit("save",{spinningFlag:false,list:[],index:1,size:10,total:0,formItem:{}});
    },
    methods:{
      async request(paramsObj={},callback,isConcat){
        const { conditionQuery:con, tabKey,searchContent:name } = this;
        const conditionQuery={...con,name};
        const netUrl=tabKey === 'cate' ? AdminCateAPI.LIST.url : AdminSortAPI.LIST.url;
        const payload={netUrl,conditionQuery,...paramsObj};
        this.$store.dispatch({type:"commonHandle",payload,callback,isConcat});
        if (payload.netUrl !== netUrl) this.cleanSelectedItem();
      },
      getColumn(){
        const cateColumn=[
          {title:'名称',dataIndex:'name',key:'name',sorter:true,width:100},
          {title:'所属',dataIndex:'sort',key:'sort',sorter:true,width:100,scopedSlots: { customRender: 'sort' },filters:this.categoryOptions.map(i => ({ text: i.name, value: `${i.id}` })),filteredValue: this.filters.sort || null},
          {title:'状态',dataIndex:'isEnable',key:'isEnable',sorter:true,width:100,scopedSlots: { customRender: 'isEnable' },filters: [{ text: '不可用', value: '0' }, { text: '可用', value: '1' }],filterMultiple: false,filteredValue: this.filters.isEnable || null},
          {title:'操作',dataIndex:'action',key:'action',width:100,fixed:'right',scopedSlots: { customRender: 'action' }},
        ];
        const sortColumn=[
          {title:'名称',dataIndex:'name',key:'name',sorter:true,width:'25%'},
          {title:'状态',dataIndex:'isEnable',key:'isEnable',sorter:true,width:'30%',scopedSlots: { customRender: 'isEnable' },filters: [{ text: '不可用', value: '0' }, { text: '可用', value: '1' }],filterMultiple: false,filteredValue: this.filters.isEnable || null},
          {title:'操作',dataIndex:'action',key:'action',width:'45%',scopedSlots: { customRender: 'action' }},
        ];
        return {cate:cateColumn,sort:sortColumn};
      },
      searchInputFocus(){
        this.$nextTick(()=>this.$refs.searchRef.focus());
      },
      cleanSelectedItem(){
        this.selectedItems=[];
      },
      toggleEditorialPanel(){
        this.editorialPanelVisible=!this.editorialPanelVisible;
      },
      cleanFormItem(){
        this.cleanSelectedItem();
        this.formItem={};
      },
      handleShowAll(){
        this.conditionQuery={};
        this.filters={};
        this.$store.dispatch({type:"search/setSearchContent",payload:{searchContent:""}});
        this.request({index:1});
      },
      handleItems(action,item){
        const { selectedItems, tabKey } = this;
        const { url: netUrl, desc, actionTip } = action;
        const lang='zh_CN';
        let content = '';
        let items = [];
        if (item) {
          const { id, name } = item;
          items = [{ id, name }];
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
            this.useEditor=netUrl.includes('/cate/form')?"cate":"sort";
            this.toggleEditorialPanel();
            return;
          }
          const callback = tabKey === "sort" && netUrl.includes("/cate") ? () => this.request() : undefined;
          this.request({ netUrl, items },callback);
        };
        this.$confirm({ title, content, okText, cancelText, onCancel, onOk });
      },
      handleTableChange(pagination, filters, sorter){
        const { current: index, pageSize: size } = pagination;
        const { columnKey, order } = sorter;
        const { isEnable: isEnableArr, sort } = filters;
        const isEnable = isEnableArr && isEnableArr.length > 0 ? parseInt(isEnableArr[0], 10) : undefined;
        const sortIdsArr = sort && sort.length > 0 ? sort.map(i => parseInt(i, 10)) : [];
        const orderBy = columnKey ? { name: columnKey, by: order === 'descend' ? 'DESC' : 'ASC' } : {};
        this.filters=filters;
        this.conditionQuery={...this.conditionQuery,orderBy, isEnable, sortIdsArr};
        this.request({index,size});
      },
      handleSelectRows(keys, items){
        const selectedItems=this.selectedItems;
        let newItems = [];
        if (selectedItems.length === keys.length) {
          newItems = items;
        } else if (selectedItems.length < keys.length) {
          newItems = [...selectedItems.filter(i => items.every(v => i.id !== v.id)), ...items];
        } else {
          newItems = selectedItems.filter(i => keys.some(v => v === i.id));
        }
        this.selectedItems=newItems;
      },
      handleChangeTabs(tabKey){
        this.$store.commit("save",{spinningFlag:false,list:[],index:1,size:10,total:0,formItem:{}});
        this.$store.dispatch({type:"search/setSearchContent",payload:{searchContent:""}});
        // this.setState({ tabKey, selectedRowKeys: [], selectedItems: [], conditionQuery: {}, filters: {}, EditorialForm: tabKey === "cate" ? CateEditorialForm : SortEditorialForm });
        this.tabKey=tabKey;
        this.useEditor=tabKey;
        this.selectedItems=[];
        this.conditionQuery={};
        this.filters={};
        if (tabKey === 'cate') {
          this.request({ netUrl: AdminCateAPI.LIST.url, index: 1, size: 10 });
          this.request({ netUrl: AdminSortAPI.LIST.url, conditionQuery: { isEnable: 1 }, index: 1, size: 999 }, res => this.categoryOptions= res.list );
        } else {
          this.request({ netUrl: AdminSortAPI.LIST.url, index: 1, size: 10 });
        }
      }
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
  #category{
    background: white;
    padding:0px 10px;
    .breadcrumb{
      margin-top:8px;
    }
    .operation{
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    /deep/ .ant-tabs-tab{
      padding:8px 5px;
    }
    /deep/ .ant-tabs-bar{
      margin-bottom: 10px;
    }
    /deep/ .ant-table-expand-icon-th{
      min-width: 10px;
      width:10px;
    }
    /deep/ .ant-table-row-expand-icon-cell{
      min-width: 10px;
      width:10px;
    }
    /deep/ .ant-table-thead > tr > th.ant-table-selection-column{
      min-width: 40px;
      width:40px;
    }
    /deep/ .ant-table-tbody > tr > td.ant-table-selection-column{
      min-width: 40px;
      width:40px;
    }
    /deep/ .ant-table-small  .ant-table-content table th{
      padding:8px 0px;
    }
    /deep/ .ant-table-small  .ant-table-content table td{
      padding:8px 0px;
    }
  }
</style>
