<template>
  <div id="tag-edit">
    <a-modal
      :title="initialFormData.id?AdminSortAPI.UPDATE.desc['zh_CN']:AdminSortAPI.INSERT.desc['zh_CN']"
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
  const { AdminSortAPI }=urls;
  export default{
    data(){
      return {
        form:this.$form.createForm(this),
        AdminSortAPI,
        initialFormData:{}
      }
    },
    props:["editorialPanelVisible","formItem"],
    mounted(){
      const formItem=this.formItem;
      if (formItem.id) this.formatInitialFormData(formItem);
    },
    methods:{
      formatInitialFormData (formItem) {
        this.initialFormData = { ...formItem };
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
          const id=this.formItem.id;
          const netUrl = id ? AdminSortAPI.UPDATE.url : AdminSortAPI.INSERT.url;
          this.$emit("request",{ ...values, id, netUrl });
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
