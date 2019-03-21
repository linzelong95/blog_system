import React from 'react';
import { Form } from 'antd';
import { UrlEnum } from '@/assets/Enum';
import EditorialFormConfig from '@/pages/EditorialFormConfig';

const { getModalForm } = EditorialFormConfig;
const {
  AdminTagAPI: { INSERT, UPDATE },
  AdminSortAPI,
} = UrlEnum;

@Form.create()
class EditorialForm extends React.PureComponent {
  state = {
    initialFormData: {},
    categoryOptions: [],
  };

  componentDidMount = () => {
    const { formItem = {}, request } = this.props;
    request({ netUrl: AdminSortAPI.LIST.url, index: 1, size: 999 }, res =>
      this.setState({ categoryOptions: res.list })
    );
    if (formItem.id) this.formatInitialFormData(formItem);
  };

  formatInitialFormData = (formItem, extraObj) => {
    const { sort } = formItem;
    const initialFormData = { ...formItem, sort: { label: sort.name, key: sort.id } };
    this.setState({ initialFormData, ...extraObj });
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
      const { sort } = values;
      const netUrl = id ? UPDATE.url : INSERT.url;
      request({ ...values, id, netUrl, sortId: sort.key });
      toggleEditorialPanel();
      cleanFormItem();
      form.resetFields();
    });
  };

  render() {
    const { form, editorialPanelVisible } = this.props;
    const { initialFormData, categoryOptions } = this.state;
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
        fieldId: 'sort',
        label: '分类',
        rules: [{ required: true, message: '分类是必须的' }],
        fieldType: 'select',
        fieldProps: {
          options: categoryOptions.map(i => ({ label: i.name, value: i.id, disabled: !i.isEnable })),
          labelInValue: true,
          style: { width: '86%' },
        },
        formItemLayout: { labelCol: { span: 6 } },
      },
      {
        fieldId: 'isEnable',
        label: '状态',
        fieldType: 'select',
        fieldProps: {
          options: [{ value: 0, label: '不可用' }, { value: 1, label: '可用' }],
          style: { width: '86%' },
        },
        initialValue: 1,
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
