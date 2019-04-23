<template>
  <div id="tag">
    <div class="action">
      <span>
        <a-button type="primary" size="small" @click="toggleEditorialPanel">新增</a-button>
        <span v-show="selectedItems.length>0">
          <a-badge :count="selectedItems.length">
            <a-button type="primary" size="small" @click="cleanSelectedItem">清空</a-button>
          </a-badge>
          <a-button icon="delete" shape="circle" size="small" style="color:red;margin-left:20px;" @click="handleItems(AdminTagAPI.DELETE)" />
          <a-button icon="unlock" shape="circle" size="small" style="color:green;" @click="handleItems(AdminTagAPI.UNLOCK)" />
          <a-button icon="lock" shape="circle" size="small" style="color:#A020F0;" @click="handleItems(AdminTagAPI.LOCK)" />
        </span>
      </span>
      <a-button type="primary" icon="home" shape="circle" size="small" @click="handleShowAll" />
    </div>
    <a-table
      :columns="columns"
      :rowKey="record=>record.id"
      :dataSource="$store.state.list"
      :loading="$store.state.spinningFlag"
      :rowSelection="{
        selectedRowKeys:selectedItems.map(i=>i.id),
        onChange:handleSelectRows
      }"
      :pagination="{
        current:$store.state.index,
        total:$store.state.total,
        pageSize:$store.state.size,
      }"
      @change="handleTableChange"
      :scroll="{x:400}"
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
        <a-button icon="form" size="small" shape="circle" style="color:#8B3A3A" @click="handleItems(AdminTagAPI.FORM, item)" /> 
        <a-button icon="delete" size="small" shape="circle" style="color:red" @click="handleItems(AdminTagAPI.DELETE, item)" /> 
        <a-button icon="lock" size="small" shape="circle" style="color:#A020F0" @click="handleItems(AdminTagAPI.LOCK, item)" v-if="item.isEnable===1" /> 
        <a-button icon="unlock" size="small" shape="circle" style="color:green" @click="handleItems(AdminTagAPI.UNLOCK, item)" v-else /> 
      </template>
    </a-table>
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
  import EditorialForm from './EditorialForm.vue'
  import urls from '../../api/urls';
  const { AdminTagAPI }=urls;
  const columns=[
    {title:"名称",dataIndex:"name",key:"name",sorter:true,width:100},
    {title:"所属",dataIndex:"sort",key:"sort",sorter:true,width:100,scopedSlots: { customRender: 'sort' }},
    {title:"状态",dataIndex:"isEnable",key:"isEnable",sorter:true,width:100,scopedSlots: { customRender: 'isEnable' }},
    {title:"操作",dataIndex:"action",key:"action",width:100,fixed:"right",scopedSlots: { customRender: 'action' }},
  ];
  export default {
    data () {
      return {
        columns,
        conditionQuery: { title: '', category: {}, orderBy: {} },
        selectedItems:[],
        filters: {},
        AdminTagAPI,
        editorialPanelVisible:false,
        formItem:{}
      }
    },
    components:{
      "v-editor":EditorialForm
    },
    mounted(){
      this.request();
    },
    destroyed(){
      this.$store.commit("save",{spinningFlag:false,list:[],index:1,size:10,total:0,formItem:{}});
    },
    methods:{
      async request(paramsObj={},callback,isConcat){
        const payload={netUrl:AdminTagAPI.LIST.url,conditionQuery:this.conditionQuery,...paramsObj}
        this.$store.dispatch({type:"commonHandle",payload,callback,isConcat});
        if (payload.netUrl !== AdminTagAPI.LIST.url) this.cleanSelectedItem();
      },
      cleanSelectedItem(){
        this.selectedItems=[];
      },
      toggleEditorialPanel(){
        this.editorialPanelVisible=!this.editorialPanelVisible;
      },
      cleanFormItem(){
        this.formItem={};
      },
      handleShowAll(){
        this.conditionQuery={};
        this.filters={};
        this.request({index:1});
      },
      handleItems(action,item){
        const selectedItems  = this.selectedItems;
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
            this.toggleEditorialPanel();
            return;
          }
          this.request({ netUrl, items });
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  #tag{
    background: white;
    padding:10px 5px 0px 5px;
    margin-bottom:10px;
    .action{
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
  }
</style>
