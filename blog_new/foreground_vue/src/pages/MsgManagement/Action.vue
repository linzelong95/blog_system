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
        <a-tag color="magenta" @click.stop="sort" id="isApproved">
          显示
          <a-icon :type="conditionQuery.orderBy&&conditionQuery.orderBy.name === 'title'&&conditionQuery.orderBy.by === 'DESC'?'down':'up'" />
        </a-tag>
        <a-tag color="magenta" @click.stop="sort" id="isTop">
          置顶
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
      <div style="text-align: center">
        <a-checkbox-group
          :options="[
            { label: '置顶', value: 'isTop' },
            { label: '待审', value: 'isApproved' },
            { label: '父', value: 'isParent' },
            { label: '子', value: 'isSon' },
          ]"
          :value="temporaryCondition.commonFilterArr||[]"
          @change="commonFilterConditionSelect"
        />
      </div>
    </a-modal>
  </div>
</template>

<script>

  export default {
    data(){
      return {
        expandFlag:false,
        showSorterFlag: false,
        filterModalVisible:false,
        temporaryCondition:{},
      }
    },
    props:["conditionQuery"],
    methods:{
      toggleExpand(){
        this.expandFlag=!this.expandFlag;
      },
      toggleSorter(){
        this.showSorterFlag=!this.showSorterFlag;
      },
      toggleFilterModal(){
        const {filterModalVisible}=this;
        this.filterModalVisible=!filterModalVisible;
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
        if (method === 'exit') {
          const { conditionQuery: { commonFilterArr = [] } } = this;
          this.temporaryCondition={...this.temporaryCondition, commonFilterArr, filterflag:commonFilterArr.length>0};
          return;
        }
        const { temporaryCondition: { commonFilterArr = [] } } = this;
        const isApproved = commonFilterArr.includes('isApproved') ? 0 : undefined;
        const isTop = commonFilterArr.includes('isTop') ? 1 : undefined;
        const isRoot = (() => {
          if (commonFilterArr.includes('isParent') && !commonFilterArr.includes('isSon')) return 1;
          if (!commonFilterArr.includes('isParent') && commonFilterArr.includes('isSon')) return 0;
          return undefined;
        })();
        this.temporaryCondition={...this.temporaryCondition,filterflag:commonFilterArr.length>0};
        this.$emit("changeConditionQuery",{isApproved,isTop,isRoot,commonFilterArr});
        this.$emit("request",{index:1});
      },
      commonFilterConditionSelect (commonFilterArr) {
        this.temporaryCondition={...this.temporaryCondition,commonFilterArr};
      },
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
      background:#AB82FF;
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
