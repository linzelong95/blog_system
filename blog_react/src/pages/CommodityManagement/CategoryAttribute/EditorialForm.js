import React from 'react';
import { Form } from 'antd';
import { UrlEnum, ProductEnum, CommonEnum } from '@/assets/Enum';
import LangConfig from '@/assets/LangConfig';
import Category from '@/assets/allCategory.json';
import EditorialFormConfig from '@/pages/EditorialFormConfig';

const { getSelectorConfig, getModalForm } = EditorialFormConfig;
const { AttributeAPI, CategoryAttributeAPI: { UPDATE, INSERT } } = UrlEnum;
const { AttributeType_POS, EditMode_POS } = ProductEnum;
const { Bool_POS } = CommonEnum;
const {
  CommonLang: { SEQUENCE },
  AttributeLang: { ATTRIBUTE_SELECT },
  CategoryAttributeLang: { CATEGORYATTRIBUTE_ATTRIBUTE_TYPE, CATEGORYATTRIBUTE_REQUIRE, CATEGORYATTRIBUTE_EDIT_MODE, CATEGORYATTRIBUTE_SELECT }
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
    initialFormData: {}
  }

  componentWillReceiveProps = (nextProps) => {
    const { formItem, formItem: { id, attribute: attr } } = nextProps;
    if (id && id !== this.props.formItem.id) {
      const attribute = { key: attr.id, label: attr.name };
      const initialFormData = { ...formItem, attribute };
      this.setState({ initialFormData });
    }
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
      const { attribute: attr } = values;
      const netUrl = id ? UPDATE.url : INSERT.url;
      const attribute = { id: attr.key, name: attr.label };
      request({ ...values, id, attribute, netUrl });
      toggleEditorialPanel();
      form.resetFields();
    });
  }

  render() {
    const { form, editorialPanelVisible, lang, request } = this.props;
    const { attributeContainer, initialFormData, initialFormData:{id}} = this.state;
    const disabled=id!==undefined;
    const AttributeTypeEnum = Object.values(AttributeType_POS).map(i => ({ value: i.code, label: i[lang] }));
    const BoolEnum = Object.values(Bool_POS).map(i => ({ value: i.code, label: i[lang] }));
    const EditModeEnum = Object.values(EditMode_POS).map(i => ({ value: i.code, label: i[lang] }));
    const modalFormConfig = [
      { fieldId: 'category_ids', label: CATEGORYATTRIBUTE_SELECT[lang], rules: [{ required: true, message: CATEGORYATTRIBUTE_SELECT.require[lang] }], fieldProps: { disabled,options: Category.category, fieldNames: { label: 'name', value: 'id', children: 'category' }, expandTrigger: "hover", onChange: this.handleCategoryChange, showSearch: (inputValue, path) => (path.some(option => (option.name).toLowerCase().includes(inputValue.toLowerCase()))), style: { width: "86%" } }, fieldType: 'cascader', formItemLayout: { labelCol: { span: 6 } } },
      { fieldId: 'attribute', label: ATTRIBUTE_SELECT[lang], rules: [{ required: true, message: ATTRIBUTE_SELECT.require[lang] }], fieldType: 'select', fieldProps: { disabled,...getSelectorConfig({ container: attributeContainer, request, handleSetState: this.handleSetState, handleGetState: this.handleGetState }) }, formItemLayout: { labelCol: { span: 6 } } },
      { fieldId: 'attribute_type', label: CATEGORYATTRIBUTE_ATTRIBUTE_TYPE[lang], rules: [{ required: true, message: CATEGORYATTRIBUTE_ATTRIBUTE_TYPE.require[lang] }], fieldType: 'select', fieldProps: { options: AttributeTypeEnum, style: { width: "86%" } }, formItemLayout: { labelCol: { span: 6 } } },
      { fieldId: 'is_required', label: CATEGORYATTRIBUTE_REQUIRE[lang], rules: [{ required: true, message: CATEGORYATTRIBUTE_REQUIRE.require[lang] }], fieldType: 'select', fieldProps: { options: BoolEnum, style: { width: "86%" } }, formItemLayout: { labelCol: { span: 6 } } },
      { fieldId: 'edit_mode', label: CATEGORYATTRIBUTE_EDIT_MODE[lang], rules: [{ required: true, message: CATEGORYATTRIBUTE_EDIT_MODE.require[lang] }], fieldType: 'select', fieldProps: { options: EditModeEnum, style: { width: "86%" } }, formItemLayout: { labelCol: { span: 6 } } },
      { fieldId: 'sequence', label: SEQUENCE[lang], fieldProps: { style: { width: "86%" }, min: 1, max: 99 }, fieldType: 'inputNumber', formItemLayout: { labelCol: { span: 6 } } },
    ];
    return getModalForm({ initialFormData, editorialPanelVisible, toggleEdit: this.toggleEdit, form, modalFormConfig, INSERT, UPDATE, width: 610 });
  }
}

export default EditorialForm;