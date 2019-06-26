<template>
  <div id="message-edit">
    <a-modal
      :title="AdminMessageAPI.INSERT.desc['zh_CN']"
      :visible="editorialPanelVisible"
      width="100%"
      okText="确定"
      cancelText="取消"
      @ok="toggleEdit"
      @cancel="toggleEdit('cancel')"
    >
      <a-form :form="form" layout="horizontal">
        <a-form-item label="留言人" :label-col="{span:5}" :wrapper-col="{span:15}" v-if="initialFormData.id !== undefined">
          <a-select 
            v-decorator="['to',{rules:[{required:true,message:'评论人是必须的！'}],initialValue:initialFormData.to}]" 
            :disabled="true" 
            :labelInValue="true" 
          />
        </a-form-item>
        <a-form-item label="内容" :label-col="{span:5}" :wrapper-col="{span:15}" v-if="initialFormData.id !== undefined">
          <span>{{initialFormData.preMessage}}</span>
        </a-form-item>
        <a-form-item label="置顶" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
          <a-select v-decorator="['isTop',{rules: [{ required: true, message: '请选择状态!' }],initialValue:initialFormData.isEnable!==undefined?this.initialFormData.isEnable:1}]">
            <a-select-option :value="1">是</a-select-option>
            <a-select-option :value="0">否</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="留言" :label-col="{span:5}" :wrapper-col="{span:15}">
          <a-textarea v-decorator="['message',{rules:[{required:true,message:'留言内容是必须的！'}],initialValue:initialFormData.name}]" autosize />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import urls from '../../api/urls';
  const { AdminMessageAPI }=urls;

  export default{
    data(){
      return {
        form:this.$form.createForm(this),
        AdminMessageAPI,
        initialFormData:{},
      }
    },
    props:["editorialPanelVisible","formItem"],
    mounted(){
      const {formItem={}}=this;
      if (formItem.id) this.formatInitialFormData(formItem);
    },
    methods:{
      formatInitialFormData (formItem) {
        const { id, from, fromMail,message: preMessage } = formItem;
        const to = { key: from?from.id:fromMail, label: from?from.nickName:fromMail };
        this.initialFormData = { id, to, preMessage };
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
          const {formItem: { id, parentId: pid }}=this;
          const { to={} } = values;
          const netUrl = AdminMessageAPI.INSERT.url;
          const parentId = pid === 0 ? id : pid;
          const toId = typeof to.key === "number" ? to.key : undefined;
          const toMail = to.key!==undefined&&typeof to.key !== "number" && to.key !== "博主" ? to.key : "无";
          this.$emit("request",{ ...values, netUrl, parentId, toId,toMail,fromMail:"无"  });
          this.$emit("toggleEditorialPanel");
          this.$emit("cleanFormItem");
          this.form.resetFields();
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  #message-edit{

  }
</style>
