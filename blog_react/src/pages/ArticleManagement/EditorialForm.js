import React from 'react';
import { Form ,Cascader} from 'antd';
import Editor from 'for-editor';
import Region from '@/assets/region.json';
import { UrlEnum, ProductEnum } from '@/assets/Enum';
import LangConfig from '@/assets/LangConfig';
import EditorialFormConfig from '@/pages/EditorialFormConfig';

const { getModalForm } = EditorialFormConfig;


const INSERT={url: "/api/admin/article/insert", desc: { zh_CN: "添加", en_US: "insert" }};
const UPDATE={url: "/api/admin/article/update", desc: { zh_CN: "更新", en_US: "update" }};

@Form.create()
class EditorialForm extends React.PureComponent {
  state = {
    initialFormData: {},
    markdownValue:"",
    categoryOptions :[]
  }

  componentDidMount=()=>{
    const {formItem={},request}=this.props;
    const callback=(res)=>this.setState({categoryOptions:res.list});
    request({netUrl:"/api/admin/cate/list",index:1,size:100,prettyFormat:true},callback);
    if(formItem.id){
      const callbackContent=(res)=>{
        formItem.content=res.list[0].content;
        this.formatInitialFormData(formItem);
      }
      request({netUrl:"/api/admin/article/listone",id:formItem.id},callbackContent);
    } 
  }

  // 网络数据
  // componentWillReceiveProps = (nextProps) => {
  //   const { formItem, formItem: { id } } = nextProps;
  //   const { formItem: { id: preId } } = this.props;
  //   if (id && id !== preId) this.formatInitialFormData(formItem);
  // }

  formatInitialFormData = (formItem, extraObj) => {
    const { category_id,category_name,content,sort } = formItem;
    const initialFormData = { ...formItem,category_id:[sort,category_id]};
    this.setState({initialFormData,markdownValue:content,...extraObj});
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

  markDownChange=(markdownValue)=>this.setState({markdownValue});


  render() {
    const { form, editorialPanelVisible, lang, request } = this.props;
    const { shipmodeContainer, initialFormData,markdownValue,categoryOptions } = this.state;
    const markdownNode=<Editor value={markdownValue} preview={true} expand={true} onChange={this.markDownChange} />;
    const modalFormConfig = [
      { fieldId: 'title', label:"标题", rules: [{ required: true, message: "标题是必须的" }],fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'label', label:"标签", fieldProps: { style: { width: "86%" } }, fieldType: 'input', formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'category_id', label: '分类',rules: [{ required: true, message: "分类是必须的" }], fieldType: 'cascader', fieldProps: {options:categoryOptions, fieldNames:{label:"name",value:"id"},style: { width: "86%" } },  formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 } },
      { fieldId: 'is_top', label:"置顶", fieldType: 'select', fieldProps: { options: [{value:1,label:"是"},{value:0,label:"否"}], style: { width: "86%" } },initialValue:0, formItemLayout: { labelCol: { span: 6 } }, colLayout: { span: 12 }},
      { fieldId: 'abstract', label: "摘要", fieldProps: { style: { width: "94%" }, autosize: true }, fieldType: 'textArea', formItemLayout: { labelCol: { span: 3 } } },
      { fieldId: 'content', label: '内容', fieldType: 'node', fieldProps: { style: { width: "94%" } }, fieldNode: markdownNode, formItemLayout: { labelCol: { span: 3 } } },

    ]
    return getModalForm({ initialFormData, editorialPanelVisible, toggleEdit: this.toggleEdit, form, modalFormConfig, INSERT, UPDATE, width: 1000 });
  }
}

export default EditorialForm;