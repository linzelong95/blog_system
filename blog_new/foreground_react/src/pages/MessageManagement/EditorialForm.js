import React from 'react';
import { Form } from 'antd';
import { UrlEnum } from '@/assets/Enum';
import EditorialFormConfig from '@/pages/EditorialFormConfig';

const { getModalForm } = EditorialFormConfig;
const { AdminMessageAPI: { INSERT } } = UrlEnum;

@Form.create()
class EditorialForm extends React.PureComponent {
  state = {
    initialFormData: {},
  };

  componentDidMount = () => {
    const { formItem = {} } = this.props;
    if (formItem.id) this.formatInitialFormData(formItem);
  };

  formatInitialFormData = (formItem, extraObj) => {
    const { id, from, fromMail,message: preMessage } = formItem;
    const to = { key: from?from.id:fromMail, label: from?from.nickName:fromMail };
    const initialFormData = { id, to, preMessage };
    this.setState({ initialFormData, ...extraObj });
  };

  toggleEdit = obj => {
    const {
      form,
      request,
      cleanFormItem,
      toggleEditorialPanel,
      formItem: { id, parentId: pid },
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
      const { to={} } = values;
      const netUrl = INSERT.url;
      const parentId = pid === 0 ? id : pid;
      const toId = typeof to.key === "number" ? to.key : undefined;
      const toMail = to.key!==undefined&&typeof to.key !== "number" && to.key !== "博主" ? to.key : "无";
      request({ ...values, netUrl, parentId, toId,toMail,fromMail:"无" });
      toggleEditorialPanel();
      cleanFormItem();
      form.resetFields();
    });
  };

  render() {
    const { form, editorialPanelVisible } = this.props;
    const { initialFormData } = this.state;
    const formConfig = [
      initialFormData.id !== undefined && {
        fieldId: 'to',
        label: '被回复人',
        rules: [{ required: true, message: '评论人是必须的' }],
        fieldType: 'select',
        fieldProps: {
          options: [],
          labelInValue: true,
          disabled: true,
          style: { width: '94%' },
        },
        formItemLayout: { labelCol: { span: 4 } },
      },
      initialFormData.id !== undefined && {
        fieldId: 'preMessage',
        label: '内容',
        fieldType: "node",
        fieldNode: <span>{initialFormData.preMessage}</span>,
        fieldProps: {
          style: { width: '94%' },
        },
        formItemLayout: { labelCol: { span: 4 } },
      },
      {
        fieldId: 'isTop',
        label: '是否置顶',
        rules: [{ required: true, message: '该项是必须的' }],
        fieldType: 'select',
        fieldProps: {
          options: [{ value: 1, label: '是' }, { value: 0, label: '否' }],
          style: { width: '94%' },
        },
        initialValue: 1,
        formItemLayout: { labelCol: { span: 4 } },
      },
      {
        fieldId: 'message',
        label: '留言',
        rules: [{ required: true, message: '留言内容是必须的' }],
        fieldProps: { style: { width: '94%' }, autosize: true, rows: 2 },
        fieldType: 'textArea',
        formItemLayout: { labelCol: { span: 4 } },
      },
    ];
    return getModalForm({
      initialFormData,
      editorialPanelVisible,
      toggleEdit: this.toggleEdit,
      form,
      formConfig,
      INSERT,
      UPDATE: INSERT,
      width: 600,
    });
  }
}

export default EditorialForm;
