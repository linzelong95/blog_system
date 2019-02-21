import React from 'react';
import { Form } from 'antd';
import { UrlEnum } from '@/assets/Enum';
import LangConfig from '@/assets/LangConfig';
import EditorialFormConfig from '@/pages/EditorialFormConfig';

const { getModalForm } = EditorialFormConfig;
const { AttributeAPI: { INSERT, UPDATE } } = UrlEnum;
const {
  CommonLang: { SEQUENCE },
  AttributeLang: { ATTRIBUTE_NAME }
} = LangConfig;

@Form.create()
class EditorialForm extends React.PureComponent {

  state = {
    initialFormData: {},
  };

  componentWillReceiveProps = (nextProps) => {
    const { formItem, formItem: { id } } = nextProps;
    const { formItem: { id: preId } } = this.props;
    if (id && id !== preId) this.formatInitialFormData(formItem);
  }

  formatInitialFormData = (formItem) => {
    this.setState({ initialFormData: formItem });
  }

  handleSetState = (obj, func) => this.setState({ ...obj }, () => func);

  handleGetState = (val) => this.state[val];

  toggleEdit = (obj) => {
    const { form, request, toggleEditorialPanel, formItem: { id } } = this.props;
    if (obj === "cancel") {
      form.resetFields();
      toggleEditorialPanel();
      request();
      return;
    }
    form.validateFields((err, values) => {
      if (err) return;
      const netUrl = id ? UPDATE.url : INSERT.url;
      request({ ...values, id, netUrl });
      toggleEditorialPanel();
      form.resetFields();
    })
  }

  render() {
    const { form, editorialPanelVisible, lang } = this.props;
    const { initialFormData } = this.state;
    const modalFormConfig = [
      { fieldId: 'name', label: ATTRIBUTE_NAME[lang], rules: [{ required: true, message: ATTRIBUTE_NAME.require[lang] }], fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } } },
      { fieldId: 'sequence', label: SEQUENCE[lang], fieldProps: { style: { width: "86%" }, min: 1, max: 99 }, fieldType: 'inputNumber', formItemLayout: { labelCol: { span: 6 } } },
    ];
    return getModalForm({ initialFormData, editorialPanelVisible, toggleEdit: this.toggleEdit, form, modalFormConfig, INSERT, UPDATE,width:610 });
  }
}

export default EditorialForm;
