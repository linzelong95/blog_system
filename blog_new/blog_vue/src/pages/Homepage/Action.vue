<template>
  <div id="action">
    <a-badge :dot="temporaryCondition.filterflag"><a-icon type="appstore" theme="twoTone" class="appstore" @click="toggleExpand" /></a-badge>
    <div class="category" :class="{active:temporaryCondition.filteredSortArr&&temporaryCondition.filteredSortArr.length > 0}" v-show="expandFlag" @click="selectAction('category')">分类</div>
    <div class="tag" :class="{active:temporaryCondition.tagIdsArr && temporaryCondition.tagIdsArr.length > 0}" v-show="expandFlag" @click="selectAction('tag')">标签</div>
    <div class="sort" v-show="expandFlag" @click="selectAction('sort')">排序</div>
    <a-modal
      title="请选择"
      :visible="openModalName!=''"
      width="100%"
      okText="确定"
      cancelText="取消"
      @ok="filterRequest"
      @cancel="filterRequest('cancel')"
    >
      <template slot="footer">
        <a-button key="exit" type="danger" size="small" @click="filterRequest('exit')">不更改并退出</a-button>
        <a-button key="clear" type="primary" size="small" @click="filterRequest('clear')">清空</a-button>
        <a-button key="ok" type="primary" size="small" @click="filterRequest('category')">确定</a-button>
      </template>
      <a-tree
        checkable
        showLine
        :treeData="categoryOptions"
        :checkedKeys="temporaryCondition.filteredSortArr || []"
        @check="conditionTreeSelect"
        v-if="openModalName==='category'"
      />
      <a-row>
        <a-col :span="5" style="margin-top: 5px">请选择：</a-col>
        <a-col :span="19">
            <a-checkable-tag
              v-for="item in tagOptions"
              :key="item.id"
              style="margin-top:5px"
              :checked="temporaryCondition.tagIdsArr && temporaryCondition.tagIdsArr.includes(item.id)"
              @change="(checked)=>handleTagSelect(checked,item.id)"
            >
              {{item.name}}
            </a-checkable-tag>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
  import urls from '../../api/urls';
  const {UserSortAPI,UserTagAPI}=urls;
  export default {
    data(){
      return {
        expandFlag:false,
        openModalName:"",
        categoryOptions:[],
        tagOptions:[],
        temporaryCondition:{}
      }
    },
    props:["conditionQuery"],
    mounted(){
      this.$emit("request",{netUrl:UserTagAPI.LIST.url,conditionQuery: { isEnable: 1 }, index: 1, size: 999},res=>{
        this.tagOptions=res.list;
      })
      this.$emit("request",{netUrl:UserSortAPI.LIST.url,conditionQuery: { isEnable: 1 }, index: 1, size: 999},res=>{
        const catetories=res.list.filter(i => i.categories && i.categories.length > 0);
        this.categoryOptions=catetories.map(i=>{
          const item={
            title:i.name,
            key:`${i.id}`,
            disableCheckbox:i.isEnable===0,
            children:i.categories.map(v=>{
              const one={
                title:v.name,
                key:`${i.id}=${v.id}`,
                disableCheckbox:i.isEnable === 1 ? v.isEnable === 0 : true
              };
              return one;
            })
          };
          return item;
        });
      })
    },
    methods:{
      toggleExpand(){
        this.expandFlag=!this.expandFlag;
      },
      selectAction(name){
        this.openModalName=name;
      },
      filterRequest(method){
        if (method === 'clear') {
          this.temporaryCondition={};
          return;
        }
        this.selectAction("");
        let filterflag = false;
        if (method === 'exit') {
          const { conditionQuery: { filteredSortArr = [], tagIdsArr = [] } } = this;
          filterflag = filteredSortArr.length > 0 || tagIdsArr.length;
          this.temporaryCondition={...this.temporaryCondition,filteredSortArr, tagIdsArr, filterflag};
          return;
        }
        const { temporaryCondition: { filteredSortArr = [], tagIdsArr = [] } } = this;
        filterflag = filteredSortArr.length > 0 || tagIdsArr.length > 0;
        const category = { sortIdsArr: [], cateIdsArr: [] };
        filteredSortArr.forEach(item => {
          const arr = item.split('-');
          if (arr.length === 1) {
            category.sortIdsArr.push(parseInt(arr.pop(), 10));
          } else if (!category.sortIdsArr.includes(parseInt(arr[0], 10))) {
            category.cateIdsArr.push(parseInt(arr.pop(), 10));
          }
        });
        this.temporaryCondition={...this.temporaryCondition,filterflag};
        this.$emit("changeConditionQuery",{category, filteredSortArr, tagIdsArr});
        this.$emit("request",{index:1});
      },
      conditionTreeSelect(filteredSortArr){
        this.temporaryCondition={...this.temporaryCondition,filteredSortArr};
      },
      handleTagSelect(checked,id) {
        const { temporaryCondition: { tagIdsArr = [] } } = this;
        const newTagIds = checked ? [...tagIdsArr, id] : tagIdsArr.filter(i => i !== id);
        this.temporaryCondition={...this.temporaryCondition,tagIdsArr: newTagIds};
      }
    }
  }
</script>

<style lang="scss" scoped>
  #action{
    position: relative;
    height:100px;
    width:100px;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    color:white;
    text-align: center;
    line-height: 30px;
    .appstore{
      font-size: 30px;
    }
    .category,.tag,.sort{
      position: absolute;
      width:30px;
      height:30px;
      border-radius: 15px;
      background:lightskyblue;
    }
    .category{
      top:0px;
      left:30px;
    }
    .tag{
      left:50px;
    }
    .sort{
      bottom:0px;
      left:30px;
    }
    .active{
      background: lightpink;
    }
  }
</style>
