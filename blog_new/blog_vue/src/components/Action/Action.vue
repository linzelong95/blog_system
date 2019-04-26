<template>
  <div id="action">
    <a-badge :dot="temporaryCondition.filterflag||(conditionQuery.orderBy && Object.keys(conditionQuery.orderBy).length > 0)"><a-icon type="appstore" theme="twoTone" class="appstore" @click="toggleExpand" /></a-badge>
    <div class="filter" :class="{active:temporaryCondition.filterflag}" v-show="expandFlag" @click="toggleFilterModal">筛选</div>
    <div class="sort" :class="{active:conditionQuery.orderBy && Object.keys(conditionQuery.orderBy).length > 0}" v-show="expandFlag" @click="toggleSorter">
      排序
      <div class="item" v-if="showSorterFlag">
        <a-tag color="magenta" @click.stop="sort" id="default">
          默认
          <a-icon type="swap"/>
        </a-tag>
        <a-tag color="magenta" @click.stop="sort" id="title">
          标题
          <a-icon :type="conditionQuery.orderBy&&conditionQuery.orderBy.name === 'title'&&conditionQuery.orderBy.by === 'DESC'?'down':'up'" />
        </a-tag>
        <a-tag color="magenta" @click.stop="sort" id="createDate">
          时间
          <a-icon :type="conditionQuery.orderBy&&conditionQuery.orderBy.name === 'createDate'&&conditionQuery.orderBy.by === 'DESC'?'down':'up'" />
        </a-tag>
      </div>
    </div>
    <div class="clear"  v-show="expandFlag" @click="clearCondition">
      <a-icon type="home" theme="outlined" style="font-size:20px;"/>
    </div>
    <a-modal
      title="请选择"
      :visible="filterModalVisible"
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
      <div style="text-align:center;">
        <a-radio-group :value="filterSort" buttonStyle="solid" @change="handleFilterSort" size="small">
          <a-radio-button value="selectedByCate">
            <a-badge :dot="temporaryCondition.filteredSortArr&&temporaryCondition.filteredSortArr.length > 0">
              &nbsp;按分类&nbsp;&nbsp;
            </a-badge>
          </a-radio-button>
          <a-radio-button value="selectedByTag">
            <a-badge :dot="temporaryCondition.tagIdsArr&&temporaryCondition.tagIdsArr.length > 0">
              &nbsp;按标签&nbsp;&nbsp;
            </a-badge>
          </a-radio-button>
        </a-radio-group>
      </div>
      <a-alert
        message="注意是否同时进行两种类别的筛选！"
        type="warning"
        showIcon
        style="margin:15px 0px"
      />
      <a-tree
        checkable
        showLine
        :treeData="categoryOptions"
        :checkedKeys="temporaryCondition.filteredSortArr || []"
        @check="conditionTreeSelect"
        v-if="filterSort==='selectedByCate'"
      />
      <a-row v-if="filterSort==='selectedByTag'">
        <a-col :span="4" style="margin-top: 5px">标签：</a-col>
        <a-col :span="20">
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
        showSorterFlag: false,
        filterModalVisible:false,
        filterSort: 'selectedByCate',
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
      toggleSorter(){
        this.showSorterFlag=!this.showSorterFlag;
      },
      toggleFilterModal(){
        this.filterModalVisible=!this.filterModalVisible;
      },
      handleFilterSort(e){
        this.filterSort=e.target.value;
      },
      clearCondition(){
        this.$store.dispatch({type:"search/setSearchContent",payload:{searchContent:""}});
        this.temporaryCondition={};
        this.$emit("request",{index:1,conditionQuery:{}});
        this.toggleExpand();
      },
      sort(e){
        const { id: name } = e.currentTarget;
        if(name==="default"){
          this.$emit("changeConditionQuery",{orderBy:{}});
          this.$emit("request",{index:1});
          this.toggleSorter();
          this.toggleExpand();
          return;
        }
        const { conditionQuery: { orderBy = {} } } = this;
        this.$emit("changeConditionQuery",{orderBy: { name, by: orderBy.by === 'ASC' ? 'DESC' : 'ASC' }});
        this.$emit("request",{index:1});
      },
      filterRequest(method){
        this.toggleExpand();
        if (method === 'clear') {
          this.temporaryCondition={};
          return;
        }
        this.toggleFilterModal();
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
    line-height: 34px;
    .appstore{
      font-size: 30px;
    }
    .filter,.clear,.sort{
      position: absolute;
      width:34px;
      height:34px;
      border-radius: 17px;
      background:lightskyblue;
    }
    .filter{
      top:0px;
      left:25px;
    }
    .clear{
      bottom:0px;
      left:25px;
      background:red;
    }
    .sort{
      left:50px;
      .item{
        position: absolute;
        left:20px;
      }
    }
    .active{
      background: lightpink;
    }
  }
</style>
