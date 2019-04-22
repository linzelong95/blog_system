<template>
  <div id="tag">
    <div class="action">
      <span>
        <a-button type="primary" icon="plus" size="small">新增</a-button>
        <a-button type="primary" icon="redo" size="small" @click="cleanSelectedItem">清空</a-button>
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
        pageSizeOptions:['12','24']
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
        <a-button icon="form" size="small" shape="circle" style="color:#8B3A3A" @click="handleItems(FORM, item)" /> 
      </template>
    </a-table>
  </div>
</template>

<script>
  import urls from '../api/urls';
  const { AdminTagAPI:{LIST,FORM} }=urls;
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
      }
    },
    mounted(){
      this.ajax();
    },
    destroyed(){
      this.$store.commit("save",{spinningFlag:false,list:[],index:1,size:10,total:0,formItem:{}});
    },
    methods:{
      async ajax(paramsObj={},callback,isConcat){
        const payload={netUrl:LIST.url,conditionQuery:this.conditionQuery,...paramsObj}
        this.$store.dispatch({type:"commonHandle",payload,callback,isConcat});
      },
      cleanSelectedItem(){
        this.selectedItems=[];
      },
      handleShowAll(){
        this.conditionQuery={};
        this.filters={};
        this.ajax({index:1});
      },
      handleItems(action,item){

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
        this.ajax({index,size});
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
    .action{
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
  }
</style>
