import React from 'react';
import { Form } from 'antd';
import { UrlEnum } from '@/assets/Enum';
import LangConfig from '@/assets/LangConfig';
import EditorialFormConfig from '@/pages/EditorialFormConfig';

const {  getModalForm } = EditorialFormConfig;
const { BrandAPI: { INSERT ,UPDATE} } = UrlEnum;
const { 
  CommonLang: { SEQUENCE, DESCRIPTION },
  BrandLang:{ BRAND_NAME,BRAND_NAME_EN,BRAND_ALIAS ,BRAND_META_TITLE,BRAND_META_KEYS,BRAND_META_DESC,BRAND_VOUCHER,BRAND_THEME,BRAND_LOGO_URL,BRAND_COMPANY_URL}
 } = LangConfig;

@Form.create()
class EditorialForm extends React.PureComponent {
  state = {
    initialFormData:{}
  };

  componentWillReceiveProps = (nextProps) => {
    const { formItem, formItem: { id } } = nextProps;
    if (id && id !== this.props.formItem.id) {
      this.setState({ initialFormData:formItem });
    }
  }

  handleSetState = (obj, func) => this.setState({ ...obj }, () => func);

  handleGetState = (val) => this.state[val];

  toggleEdit = (obj) => {
    const { form, request, toggleEditorialPanel,formItem: { id }  } = this.props;
    if (obj === "cancel") {
      form.resetFields();
      toggleEditorialPanel();
      request();
      return;
    }
    form.validateFields((err, values) => {
      if (err) return;
      const netUrl = id ? UPDATE.url : INSERT.url;
      request({ ...values,netUrl, index: 1 });
      form.resetFields();
      toggleEditorialPanel();
    })
  }

  render() {
    const { editorialPanelVisible, form, lang } = this.props;
    const {initialFormData}=this.state;
    const modalFormConfig = [
      { fieldId: 'name', label: BRAND_NAME[lang],rules: [{ required: true, message: BRAND_NAME.require[lang] }],  fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'name_en', label: BRAND_NAME_EN[lang],rules: [{ required: true, message: BRAND_NAME_EN.require[lang] }],  fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'name_by', label: BRAND_ALIAS[lang],rules: [{ required: true, message: BRAND_ALIAS.require[lang] }],  fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'logo', label: BRAND_LOGO_URL[lang],rules: [{ required: true, message: BRAND_LOGO_URL.require[lang] }],  fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'company_url', label: BRAND_COMPANY_URL[lang],rules: [{ required: true, message:BRAND_COMPANY_URL.require[lang] }],  fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'theme', label: BRAND_THEME[lang], fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'meta_title', label: BRAND_META_TITLE[lang], fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'meta_keys', label: BRAND_META_KEYS[lang], fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'meta_desc', label: BRAND_META_DESC[lang], fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'voucher', label: BRAND_VOUCHER[lang],rules: [{ required: true, message: BRAND_VOUCHER.require[lang] }],  fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'sequence', label: SEQUENCE[lang], fieldProps: { style: { width: "86%" }, min: 1, max: 99 }, fieldType: 'inputNumber', formItemLayout: { labelCol: { span: 6 } } , colLayout: { span: 12 } },
      { fieldId: 'description', label: DESCRIPTION[lang], fieldProps: { style: { width: "86%" }, autosize: true }, fieldType: 'textArea', formItemLayout: { labelCol: { span: 6 } } , colLayout: { span: 12 } },
    ];
    return getModalForm({ initialFormData,editorialPanelVisible, toggleEdit: this.toggleEdit, form, modalFormConfig, INSERT,UPDATE,width:1200 });
  }
}

export default EditorialForm;


