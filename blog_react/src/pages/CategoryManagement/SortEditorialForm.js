import React from 'react';
import { Form ,Cascader} from 'antd';
import Editor from 'for-editor';
import Region from '@/assets/region.json';
import { UrlEnum, ProductEnum } from '@/assets/Enum';
import LangConfig from '@/assets/LangConfig';
import EditorialFormConfig from '@/pages/EditorialFormConfig';

const { getModalForm } = EditorialFormConfig;

const INSERT={url: "/api/admin/sort/insert", desc: { zh_CN: "添加", en_US: "insert" }};
const UPDATE={url: "/api/admin/sort/update", desc: { zh_CN: "更新", en_US: "update" }};

@Form.create()
class EditorialForm extends React.PureComponent {
  state = {
    initialFormData: {},
  }

  componentDidMount=()=>{
    const {formItem={},request}=this.props;
    if(formItem.id) this.formatInitialFormData(formItem);
  }

  // 网络数据
  // componentWillReceiveProps = (nextProps) => {
  //   const { formItem, formItem: { id } } = nextProps;
  //   const { formItem: { id: preId } } = this.props;
  //   if (id && id !== preId) this.formatInitialFormData(formItem);
  // }

  formatInitialFormData = (formItem, extraObj) => {
    this.setState({initialFormData:formItem,...extraObj});
  }

  handleSetState = (obj, func) => this.setState({ ...obj }, () => func);

  handleGetState = (val) => this.state[val];

  toggleEdit = (obj) => {
    const { form, request,cleanFormItem, toggleEditorialPanel, formItem: { id } } = this.props;
    if (obj === "cancel") {
      form.resetFields();
      toggleEditorialPanel();
      cleanFormItem();
      request();
      return;
    }
    form.validateFields((err, values) => {
      console.log(values)
      if (err) return;
      const netUrl = id ? UPDATE.url : INSERT.url;
      request({ ...values, id,  netUrl });
      toggleEditorialPanel();
      cleanFormItem();
      form.resetFields();
    });
  }



  render() {
    const { form, editorialPanelVisible, lang, request } = this.props;
    const {initialFormData}=this.state;
    const modalFormConfig = [
      { fieldId: 'name', label:"名称", rules: [{ required: true, message: "名称是必须的" }],fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }},
      { fieldId: 'disabled', label:"状态", fieldType: 'select', fieldProps: { options: [{value:1,label:"不可用"},{value:0,label:"可用"}], style: { width: "86%" } },initialValue:0, formItemLayout: { labelCol: { span: 6 } }},
    ]
    return getModalForm({ initialFormData, editorialPanelVisible, toggleEdit: this.toggleEdit, form, modalFormConfig, INSERT, UPDATE, width: 600 });
  }
}

export default EditorialForm;