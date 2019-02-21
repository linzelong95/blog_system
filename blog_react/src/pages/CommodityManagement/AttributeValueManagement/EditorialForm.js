import React from 'react';
import { Form } from 'antd';
import TableConfig from '@/pages/TableConfig';
import { UrlEnum } from '@/assets/Enum';
import LangConfig from '@/assets/LangConfig';
import EditorialFormConfig from '@/pages/EditorialFormConfig';

const { getCommonSelectedTable,getModalForm } = EditorialFormConfig;
const { AttributeTable } = TableConfig;
const { ValueAPI: { INSERT, UPDATE }, AttributeAPI } = UrlEnum;
const {
  CommonLang: { SEQUENCE },
  ValueLang: { VALUE_NAME },
  AttributeLang: { ATTRIBUTE_SELECT }
} = LangConfig;

const initAttributeContainer = {
  netUrl: AttributeAPI.LIST.url,
  list: [],
  total: 0,
  index: 1,
  size: 6,
  query: "",
  selectedItems: []
};

@Form.create()
class EditorialForm extends React.PureComponent {

  state = {
    attributeContainer: initAttributeContainer,
    initialFormData: {},
  };

  componentWillReceiveProps = (nextProps) => {
    const { formItem, formItem: { id } } = nextProps;
    const { formItem: { id: preId } } = this.props;
    if (id && id !== preId) this.formatInitialFormData(formItem);
  }

  formatInitialFormData = (formItem) => {
    const { attribute } = formItem;
    const attributes = [attribute];
    const initialFormData = { ...formItem, attributes };
    this.setState(oldState => ({ initialFormData, attributeContainer: { ...oldState.attributeContainer, selectedItems: attributes } }));
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
      const { attributeContainer: { selectedItems: attributes } } = this.state;
      const attribute = attributes[0];
      const netUrl = id ? UPDATE.url : INSERT.url;
      request({ ...values, id, attribute, netUrl });
      toggleEditorialPanel();
      form.resetFields();
    })
  }

  render() {
    const { form, editorialPanelVisible, lang, request } = this.props;
    const { initialFormData, attributeContainer } = this.state;
    const attributeComponent = getCommonSelectedTable({
      container: attributeContainer,
      itemTable: AttributeTable,
      selectBtnName: ATTRIBUTE_SELECT[lang],
      actionColumnConfig: { width: "20%" },
      type: "radio",
      formVerify: true,
      request,
      form,
      handleSetState: this.handleSetState,
      handleGetState: this.handleGetState,
      notAllowChange: typeof initialFormData.id !== "undefined",
    });
    const modalFormConfig = [
      { fieldId: 'attributes', label: ATTRIBUTE_SELECT[lang], rules: [{ required: true, message: ATTRIBUTE_SELECT.require[lang] }], fieldType: 'node', fieldProps: { style: { width: "90%" } }, fieldNode: attributeComponent, formItemLayout: { labelCol: { span: 3 } } },
      { fieldId: 'name', label: VALUE_NAME[lang], rules: [{ required: true, message: VALUE_NAME.require[lang] }], fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'sequence', label: SEQUENCE[lang], fieldProps: { style: { width: "86%" }, min: 1, max: 99 }, fieldType: 'inputNumber', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
    ]
    return getModalForm({ initialFormData, editorialPanelVisible, toggleEdit: this.toggleEdit, form, modalFormConfig, INSERT, UPDATE });
  }
}

export default EditorialForm;
