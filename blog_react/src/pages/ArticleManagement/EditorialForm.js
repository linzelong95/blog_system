import React from 'react';
import { Form, Modal } from 'antd';
import CustomUpload from '@/components/CustomUpload';
import Editor from 'for-editor';
import { UrlEnum } from '@/assets/Enum';
import EditorialFormConfig from '@/pages/EditorialFormConfig';
import { imgPrefix } from '@/defaultSettings';

const { getModalForm } = EditorialFormConfig;
const {
  AdminArticleAPI: { INSERT, UPDATE, CONTENT },
  AdminCateAPI,
} = UrlEnum;

@Form.create()
class EditorialForm extends React.PureComponent {
  state = {
    initialFormData: {},
    markdownValue: '',
    categoryOptions: [],
    fileList: [],
  };

  componentDidMount = () => {
    const { formItem = {}, request } = this.props;
    request({ netUrl: AdminCateAPI.LIST.url, index: 1, size: 100, prettyFormat: true }, res =>
      this.setState({ categoryOptions: res.list })
    );
    if (formItem.id) {
      request({ netUrl: CONTENT.url, id: formItem.id }, res => {
        formItem.content = res.list[0].content;
        this.formatInitialFormData(formItem);
      });
    }
  };

  formatInitialFormData = (formItem, extraObj) => {
    const { category_id, content, sort, image_url } = formItem;
    const fileList = image_url ? [{ uid: -1, url: `${imgPrefix}${image_url}` }] : [];
    const initialFormData = { ...formItem, category_id: [sort, category_id] };
    this.setState({ initialFormData, fileList, markdownValue: content, ...extraObj });
  };

  handleSetState = (obj, func) => this.setState({ ...obj }, () => func);

  handleGetState = val => this.state[val];

  toggleEdit = obj => {
    const {
      form,
      request,
      cleanFormItem,
      toggleEditorialPanel,
      formItem: { id },
    } = this.props;
    if (obj === 'cancel') {
      form.resetFields();
      toggleEditorialPanel();
      cleanFormItem();
      request();
      return;
    }
    form.validateFields((err, values) => {
      if (err) return;
      const { fileList } = this.state;
      const image_urls = [];
      fileList.forEach(i => {
        if (i.url) {
          image_urls.push(i.url.split(imgPrefix)[1]);
        } else if (i.response && i.response.list) {
          i.response.list.forEach(v => {
            image_urls.push(v.url);
          });
        }
      });
      const netUrl = id ? UPDATE.url : INSERT.url;
      const image_url = image_urls[0];
      request({ ...values, id, netUrl, image_url });
      toggleEditorialPanel();
      cleanFormItem();
      form.resetFields();
    });
  };

  markDownChange = markdownValue => this.setState({ markdownValue });

  render() {
    const { form, editorialPanelVisible } = this.props;
    const { initialFormData, markdownValue, categoryOptions, fileList } = this.state;
    const markdownNode = (
      <Editor value={markdownValue} preview expand onChange={this.markDownChange} />
    );
    const imgUpload = (
      <CustomUpload
        fileList={fileList}
        action="http://127.0.0.1:3000/upload/pic?type=1&folder=1"
        handleUpload={list => {
          this.setState({ fileList: list });
          if (list.length > 0 && list[list.length - 1].status !== 'uploading') {
            const arr = list.filter(i => i.url || (i.response && i.response.url));
            if (arr.length < list.length) {
              Modal.error({ title: '上传失败！' });
              this.setState({ fileList: arr });
            }
          }
        }}
      />
    );
    const modalFormConfig = [
      {
        fieldId: 'title',
        label: '标题',
        rules: [{ required: true, message: '标题是必须的' }],
        fieldProps: { style: { width: '86%' } },
        fieldType: 'input',
        formItemLayout: { labelCol: { span: 6 } },
        colLayout: { span: 12 },
      },
      {
        fieldId: 'label',
        label: '标签',
        fieldProps: { style: { width: '86%' } },
        fieldType: 'input',
        formItemLayout: { labelCol: { span: 6 } },
        colLayout: { span: 12 },
      },
      {
        fieldId: 'category_id',
        label: '分类',
        rules: [{ required: true, message: '分类是必须的' }],
        fieldType: 'cascader',
        fieldProps: {
          options: categoryOptions,
          fieldNames: { label: 'name', value: 'id' },
          style: { width: '86%' },
        },
        formItemLayout: { labelCol: { span: 6 } },
        colLayout: { span: 12 },
      },
      {
        fieldId: 'is_top',
        label: '置顶',
        fieldType: 'select',
        fieldProps: {
          options: [{ value: 1, label: '是' }, { value: 0, label: '否' }],
          style: { width: '86%' },
        },
        initialValue: 0,
        formItemLayout: { labelCol: { span: 6 } },
        colLayout: { span: 12 },
      },
      {
        fieldId: 'image_url',
        label: '封面',
        fieldType: 'node',
        fieldNode: imgUpload,
        formItemLayout: { labelCol: { span: 3 } },
      },
      {
        fieldId: 'abstract',
        label: '摘要',
        fieldProps: { style: { width: '94%' }, autosize: true },
        fieldType: 'textArea',
        formItemLayout: { labelCol: { span: 3 } },
      },
      {
        fieldId: 'content',
        label: '内容',
        fieldType: 'node',
        fieldProps: { style: { width: '94%' } },
        fieldNode: markdownNode,
        formItemLayout: { labelCol: { span: 3 } },
      },
    ];
    return getModalForm({
      initialFormData,
      editorialPanelVisible,
      toggleEdit: this.toggleEdit,
      form,
      modalFormConfig,
      INSERT,
      UPDATE,
      width: 1000,
    });
  }
}

export default EditorialForm;
