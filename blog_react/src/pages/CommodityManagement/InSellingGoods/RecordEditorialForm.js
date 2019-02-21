import React from 'react';
import { Form } from 'antd';
import { UrlEnum } from '@/assets/Enum';
import LangConfig from '@/assets/LangConfig';
import EditorialFormConfig from '@/pages/EditorialFormConfig';

const { ProductAPI: { RECORD },  UnitAPI } = UrlEnum;
const {
  UnitLang: { UNIT_SELECT },
  ProductLang: {  PRODUCT_ORIGIN, PRODUCT_EXPIRY_DATE, PRODUCT_FACTORY, PRODUCT_DESC, PRODUCT_RECORD_COUNT, PRODUCT_RECORD_PRICE, PRODUCT_RECORD_CODE, PRODUCT_RECORD_RATE, PRODUCT_RECORD_RATE2, PRODUCT_RECORD_BENCHMARK, PRODUCT_RECORD_UNIT_COUNT2, PRODUCT_RECORD_NO,PRODUCT_PLATFORM_RECORD_TIP }
} = LangConfig;
const { getSelectorConfig, getModalForm } = EditorialFormConfig;

const initUnitContainer = {
  netUrl: UnitAPI.LIST.url,
  list: [],
  total: 0,
  index: 1,
  size: 6,
  query: "",
  selectedItems: []
};

@Form.create()
class EditorialForm extends React.Component {

  state = {
    unitContainer: initUnitContainer,
    initialFormData: {},
  }

  componentDidMount=()=>{
    const {formItem}=this.props;
    this.formatInitialFormData(formItem);
  }

  formatInitialFormData = (formItem) => {
    const { unit: u} = formItem;
    const unit = { key: u.id, label: u.name };
    const initialFormData = { ...formItem,  unit };
    this.setState({ initialFormData });
  }

  handleSetState = (obj, func) => this.setState({ ...obj }, () => func);

  handleGetState = (val) => this.state[val];

  toggleEdit = (obj) => {
    const { form, request, toggleEditorialPanel, formItem: { id,name },handleSetState} = this.props;
    if (obj === "cancel") {
      form.resetFields();
      toggleEditorialPanel();
      handleSetState({localFormItem:null});
      return;
    }
    form.validateFields((err, values) => {
      if (err) return;
      const netUrl =  RECORD.url;
      const {  unit: u} = values;
      const unit = { id: u.key, name: u.label };
      const params=[{...values,unit,id}];
      const items=[{id,name}];
      request({ params, items,  unit,  netUrl });
      toggleEditorialPanel();
      form.resetFields();
      handleSetState({localFormItem:null});
    });
  }

  render() {
    const { form, editorialPanelVisible, lang, request } = this.props;
    const { initialFormData, unitContainer, } = this.state;
    const {name}=initialFormData;
    const recordTip=<span>[<b>{name}</b>]&nbsp;{PRODUCT_PLATFORM_RECORD_TIP[lang]}</span>;
    const modalFormConfig = [
      { fieldId: 'x', fieldType: 'node', fieldNode: recordTip, style: { textAlign: "center" } },
      { fieldId: 'origin', label: PRODUCT_ORIGIN[lang], fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'life', label: PRODUCT_EXPIRY_DATE[lang], fieldProps: { style: { width: "86%" } }, fieldType: 'inputNumber', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'factory', label: PRODUCT_FACTORY[lang], fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'unit', label: UNIT_SELECT[lang], rules: [{ required: true, message: UNIT_SELECT.require[lang] }], fieldType: 'select', fieldProps: { ...getSelectorConfig({ container: unitContainer, request, handleSetState: this.handleSetState, handleGetState: this.handleGetState }) }, formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'unit_count', label: PRODUCT_RECORD_COUNT[lang], fieldProps: { style: { width: "86%" } }, fieldType: 'inputNumber', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'reg_price', label: PRODUCT_RECORD_PRICE[lang], fieldProps: { style: { width: "86%" } }, fieldType: 'inputNumber', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'hs_code', label: PRODUCT_RECORD_CODE[lang], fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'rate', label: PRODUCT_RECORD_RATE[lang], fieldProps: { style: { width: "86%" } }, fieldType: 'inputNumber', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'rate2', label: PRODUCT_RECORD_RATE2[lang], fieldProps: { style: { width: "86%" } }, fieldType: 'inputNumber', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'benchmark', label: PRODUCT_RECORD_BENCHMARK[lang], fieldProps: { style: { width: "86%" } }, fieldType: 'inputNumber', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'unit_count2', label: PRODUCT_RECORD_UNIT_COUNT2[lang], fieldProps: { style: { width: "86%" } }, fieldType: 'inputNumber', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'no', label: PRODUCT_RECORD_NO[lang], fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'gnote', label: PRODUCT_DESC[lang], fieldProps: { style: { width: "94%" }, autosize: true }, fieldType: 'textArea', formItemLayout: { labelCol: { span: 3 } }},
    ];
    return getModalForm({ initialFormData,editorialPanelVisible,toggleEdit:this.toggleEdit,form,modalFormConfig,UPDATE:RECORD,INSERT:RECORD});
  }
}

export default EditorialForm;