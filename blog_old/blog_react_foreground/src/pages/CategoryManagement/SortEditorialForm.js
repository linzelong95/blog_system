import React from 'react';
import { Form } from 'antd';
import { UrlEnum } from '@/assets/Enum';
import EditorialFormConfig from '@/pages/EditorialFormConfig';

const { getModalForm } = EditorialFormConfig;
const {
  AdminSortAPI: { INSERT, UPDATE },
} = UrlEnum;

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
    this.setState({ initialFormData: formItem, ...extraObj });
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
      console.log(values);
      if (err) return;
      const netUrl = id ? UPDATE.url : INSERT.url;
      request({ ...values, id, netUrl });
      toggleEditorialPanel();
      cleanFormItem();
      form.resetFields();
    });
  };

  render() {
    const { form, editorialPanelVisible } = this.props;
    const { initialFormData } = this.state;
    const modalFormConfig = [
      {
        fieldId: 'name',
        label: '名称',
        rules: [{ required: true, message: '名称是必须的' }],
        fieldProps: { style: { width: '86%' } },
        fieldType: 'input',
        formItemLayout: { labelCol: { span: 6 } },
      },
      {
        fieldId: 'disabled',
        label: '状态',
        fieldType: 'select',
        fieldProps: {
          options: [{ value: 1, label: '不可用' }, { value: 0, label: '可用' }],
          style: { width: '86%' },
        },
        initialValue: 0,
        formItemLayout: { labelCol: { span: 6 } },
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
      width: 600,
    });
  }
}

export default EditorialForm;
