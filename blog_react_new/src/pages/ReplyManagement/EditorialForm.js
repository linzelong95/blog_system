import React from 'react';
import { Form } from 'antd';
import { UrlEnum } from '@/assets/Enum';
import EditorialFormConfig from '@/pages/EditorialFormConfig';

const { getModalForm } = EditorialFormConfig;
const {
  AdminReplyAPI: { INSERT },
  AdminArticleAPI,
} = UrlEnum;
const initArticleContainer = {
  netUrl: AdminArticleAPI.LIST.url,
  list: [],
  total: 0,
  index: 1,
  size: 6,
  query: '',
  selectedItems: [],
};

@Form.create()
class EditorialForm extends React.PureComponent {
  state = {
    articlecontainer: initArticleContainer,
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
      const { article } = values;
      const netUrl = INSERT.url;
      request({ ...values, id, netUrl, articleId: article.key });
      toggleEditorialPanel();
      cleanFormItem();
      form.resetFields();
    });
  };

  searchItem = ({ query, container, pageIndex, pageSize }) => {
    const { request } = this.props;
    const { index: preIndex, size: preSize, netUrl } = container;
    const index = pageIndex || preIndex;
    const size = pageSize || preSize;
    request({ netUrl, index, size, conditionQuery: { title: query } }, res =>
      this.setState(oldState => ({
        articlecontainer: { ...oldState.articlecontainer, ...res, index, size, query },
      }))
    );
  };

  getSelectorConfig = ({ container, ...otherProps }) => {
    const { list, total, index: current, size: pageSize } = container;
    return {
      pagination: {
        total,
        current,
        pageSize,
        defaultPageSize: 6,
        usePagination: total > 6,
        onChange: (i, s) =>
          this.searchItem({ query: container.query, container, pageIndex: i, pageSize: s }),
      },
      options: list.map(i => ({ label: i.title, value: i.id })),
      labelInValue: true,
      filterOption: false,
      onSearch: query => this.searchItem({ query, container }),
      onMouseEnter: () => this.searchItem({ query: '', container }),
      style: { width: '86%' },
      ...otherProps,
    };
  };

  render() {
    const { form, editorialPanelVisible } = this.props;
    const { articlecontainer } = this.state;
    const modalFormConfig = [
      {
        fieldId: 'article',
        label: '文章',
        rules: [{ required: true, message: '文章是必须的' }],
        fieldType: 'select',
        fieldProps: {
          ...this.getSelectorConfig({ container: articlecontainer }),
          style: { width: '86%' },
        },
        formItemLayout: { labelCol: { span: 6 } },
      },
      {
        fieldId: 'isTop',
        label: '是否置顶',
        rules: [{ required: true, message: '该项是必须的' }],
        fieldType: 'select',
        fieldProps: {
          options: [{ value: 1, label: '是' }, { value: 0, label: '否' }],
          style: { width: '86%' },
        },
        initialValue: 1,
        formItemLayout: { labelCol: { span: 6 } },
      },
      {
        fieldId: 'reply',
        label: '评论内容',
        rules: [{ required: true, message: '评论内容是必须的' }],
        fieldProps: { style: { width: '86%' }, autosize: true },
        fieldType: 'textArea',
        formItemLayout: { labelCol: { span: 6 } },
      },
    ];
    return getModalForm({
      editorialPanelVisible,
      toggleEdit: this.toggleEdit,
      form,
      modalFormConfig,
      INSERT,
      UPDATE: INSERT,
      width: 600,
    });
  }
}

export default EditorialForm;
