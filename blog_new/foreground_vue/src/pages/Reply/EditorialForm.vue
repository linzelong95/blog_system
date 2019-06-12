<template>
  <div id="reply-edit">
    <a-modal
      :title="AdminReplyAPI.INSERT.desc['zh_CN']"
      :visible="editorialPanelVisible"
      width="100%"
      okText="确定"
      cancelText="取消"
      @ok="toggleEdit"
      @cancel="toggleEdit('cancel')"
    >
      <a-form :form="form" layout="horizontal">
        <a-form-item label="文章" :label-col="{span:5}" :wrapper-col="{span:15}">
          <a-select 
            v-decorator="['article',{rules:[{required:true,message:'文章是必须的！'}],initialValue:initialFormData.article}]" 
            :disabled="initialFormData.id !== undefined" 
            :labelInValue="true" 
            :filterOption= "false"
            :showSearch="true"
            @search="(query) => searchItem({ query, container:articlecontainer })"
            @focus="() => searchItem({ query: '', container:articlecontainer })"
            @change="() => searchItem({ query: '', container:articlecontainer })"
          >
            <a-select-option v-for="item in articlecontainer.list.map(i => ({ label: i.title, value: i.id }))" :key="item.value" :value="item.value">{{item.label}}</a-select-option>
            <a-select-option :disabled="true" :key="-1">
              <a-pagination 
                style="text-align:center;"
                size="small"
                :current="articlecontainer.index"
                :total="articlecontainer.total"
                :pageSize="articlecontainer.size"
                @change="(i, s) =>searchItem({ query: articlecontainer.query, container:articlecontainer, pageIndex: i, pageSize: s })"
              />
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="评论人" :label-col="{span:5}" :wrapper-col="{span:15}" v-if="initialFormData.id !== undefined">
          <a-select 
            v-decorator="['to',{rules:[{required:true,message:'评论人是必须的！'}],initialValue:initialFormData.to}]" 
            :disabled="true" 
            :labelInValue="true" 
          />
        </a-form-item>
        <a-form-item label="内容" :label-col="{span:5}" :wrapper-col="{span:15}" v-if="initialFormData.id !== undefined">
          <span>{{initialFormData.preReply}}</span>
        </a-form-item>
        <a-form-item label="置顶" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
          <a-select v-decorator="['isTop',{rules: [{ required: true, message: '请选择状态!' }],initialValue:initialFormData.isEnable!==undefined?this.initialFormData.isEnable:1}]">
            <a-select-option :value="1">是</a-select-option>
            <a-select-option :value="0">否</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="回复" :label-col="{span:5}" :wrapper-col="{span:15}">
          <a-textarea v-decorator="['reply',{rules:[{required:true,message:'回复内容是必须的！'}],initialValue:initialFormData.name}]" autosize />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import urls from '../../api/urls';
  const { AdminReplyAPI,AdminArticleAPI }=urls;
  const initArticleContainer = {
    netUrl: AdminArticleAPI.LIST.url,
    list: [],
    total: 0,
    index: 1,
    size: 6,
    query: '',
  };
  export default{
    data(){
      return {
        form:this.$form.createForm(this),
        AdminReplyAPI,
        initialFormData:{},
        articlecontainer: initArticleContainer,
      }
    },
    props:["editorialPanelVisible","formItem"],
    mounted(){
      const {formItem={}}=this;
      if (formItem.id) this.formatInitialFormData(formItem);
    },
    methods:{
      formatInitialFormData (formItem) {
        const { id, from, reply: preReply, article: art } = formItem;
        const article = { key: art.id, label: art.title };
        const to = { key: from.id, label: from.nickName };
        this.initialFormData = { id, to, preReply, article };
      },
      searchItem ({ query, container, pageIndex, pageSize }) {
        const { index: preIndex, size: preSize, netUrl } = container;
        const index = pageIndex || preIndex;
        const size = pageSize || preSize;
        this.$emit("request",{netUrl, index, size, conditionQuery: { title: query } },res=>{
          this.articlecontainer={...this.articlecontainer,...res, index, size, query};
        });
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
          const { article, to } = values;
          const netUrl = AdminReplyAPI.INSERT.url;
          const parentId = pid === 0 ? id : pid;
          const toId = to && to.key;
          this.$emit("request",{ ...values, netUrl, parentId, toId, articleId: article.key  });
          this.$emit("toggleEditorialPanel");
          this.$emit("cleanFormItem");
          this.form.resetFields();
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  #reply-edit{

  }
</style>
