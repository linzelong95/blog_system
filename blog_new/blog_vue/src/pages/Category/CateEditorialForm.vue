<template>
  <div id="tag-edit">
    <a-modal
      :title="initialFormData.id?AdminCateAPI.UPDATE.desc['zh_CN']:AdminCateAPI.INSERT.desc['zh_CN']"
      :visible="editorialPanelVisible"
      width="100%"
      okText="确定"
      cancelText="取消"
      @ok="toggleEdit"
      @cancel="toggleEdit('cancel')"
    >
      <a-form :form="form" layout="horizontal">
        <a-form-item label="名称" :label-col="{span:5}" :wrapper-col="{span:15}">
          <a-input v-decorator="['name',{rules:[{required:true,message:'名称是必须的！'}],initialValue:this.initialFormData.name}]" />
        </a-form-item>
        <a-form-item label="分类" :label-col="{span:5}" :wrapper-col="{span:15}">
          <a-select :labelInValue="true" v-decorator="['sort',{rules:[{required:true,message:'分类是必须的！'}],initialValue:this.initialFormData.sort}]">
            <a-select-option v-for="item in categoryOptions.map(i => ({ label: i.name, value: i.id, disabled: !i.isEnable }))" :key="item.value" :value="item.value" :disabled="item.disabled">{{item.label}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
          <a-select v-decorator="['isEnable',{rules: [{ required: true, message: '请选择状态!' }],initialValue:this.initialFormData.isEnable!==undefined?this.initialFormData.isEnable:1}]">
            <a-select-option :value="1">可用</a-select-option>
            <a-select-option :value="0">禁用</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import urls from '../../api/urls';
  const { AdminCateAPI,AdminSortAPI }=urls;
  export default{
    data(){
      return {
        form:this.$form.createForm(this),
        AdminCateAPI,
        categoryOptions: [],
        initialFormData:{}
      }
    },
    props:["editorialPanelVisible","formItem","tabKey"],
    mounted(){
      const formItem=this.formItem;
      if (formItem.id) this.formatInitialFormData(formItem);
      this.$emit("request",{netUrl: AdminSortAPI.LIST.url, index: 1, size: 999},res=>{this.categoryOptions= res.list;})
    },
    methods:{
      formatInitialFormData (formItem) {
        const { sort } = formItem;
        this.initialFormData = { ...formItem, sort: { label: sort.name, key: sort.id } };
      },
      toggleEdit(obj){
        if (obj === 'cancel') {
          this.form.resetFields();
          this.$emit("toggleEditorialPanel");
          this.$emit("cleanFormItem");
          this.$emit("request");
          return;
        }
        this.form.validateFields((err, values) => {
          if (err) return;
          const { sort } = values;
          const id=this.formItem.id;
          const netUrl = id ? AdminCateAPI.UPDATE.url : AdminCateAPI.INSERT.url;
          const callback=this.tabKey==="sort"?()=>this.$emit("request"):undefined;
          this.$emit("request",{ ...values, id, netUrl, sortId: sort.key },callback);
          this.$emit("toggleEditorialPanel");
          this.$emit("cleanFormItem");
          this.form.resetFields();
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  #tag-edit{

  }
</style>
