import React from 'react';
import { Form, Modal,Tag,Icon } from 'antd';
import CustomUpload from '@/components/CustomUpload';
import CustomFormTable from '@/components/CustomFormTable';
import { timeFormat } from '@/utils/utils';
import Editor from 'for-editor';
import { UrlEnum } from '@/assets/Enum';
import EditorialFormConfig from '@/pages/EditorialFormConfig';
import { imgPrefix } from '@/defaultSettings';

const { getModalForm } = EditorialFormConfig;
const {
  AdminArticleAPI: { INSERT, UPDATE, CONTENT },
  AdminCateAPI,
  AdminLabelAPI,
} = UrlEnum;

const initLabelContainer = {
  netUrl: AdminLabelAPI.LIST.url,
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
    initialFormData: {},
    markdownValue: '',
    categoryOptions: [],
    fileList: [],
    labelContainer: initLabelContainer
  };

  componentDidMount = () => {
    const { formItem = {}, request } = this.props;
    request({ netUrl: AdminCateAPI.LIST.url, index: 1, size: 100, prettyFormat: true }, res =>
      this.setState({ categoryOptions: res.list })
    );
    if (formItem.id) {
      request({ netUrl: CONTENT.url, id: formItem.id }, res => {
        formItem.content = res.list[0].content;
        this.formatInitialFormData(formItem);
      });
    }
  };

  formatInitialFormData = (formItem, extraObj) => {
    const { category_id, content, sort, image_url } = formItem;
    const fileList = image_url ? [{ uid: -1, url: `${imgPrefix}${image_url}` }] : [];
    const initialFormData = { ...formItem, category_id: [sort, category_id] };
    this.setState({ initialFormData, fileList, markdownValue: content, ...extraObj });
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
      const { fileList,labelContainer:{selectedItems} } = this.state;
      const label=selectedItems.map(i=>i.id).join(",");
      const image_urls = [];
      fileList.forEach(i => {
        if (i.url) {
          image_urls.push(i.url.split(imgPrefix)[1]);
        } else if (i.response && i.response.url) {
          image_urls.push(i.response.url);
        }
      });
      const netUrl = id ? UPDATE.url : INSERT.url;
      const image_url = image_urls[0];
      request({ ...values, id, netUrl, image_url,label });
      toggleEditorialPanel();
      cleanFormItem();
      form.resetFields();
    });
  };

  markDownChange = markdownValue => this.setState({ markdownValue });

  onHandleCustomTableChange = ({ keys, items, formVerify,  notAllowChange }) => {
    const {form}=this.props;
    if (notAllowChange) {
      Modal.error({ title: "不能修改" });
      return;
    }
    const {labelContainer}=this.state;
    const { selectedItems } = labelContainer;
    let newItems = [];
    if (selectedItems.length === keys.length) {
      newItems = items;
    } else if (selectedItems.length < keys.length) {
      newItems = [...selectedItems.filter(i => items.every(v => i.id !== v.id)), ...items];
    } else {
      newItems = selectedItems.filter(i => keys.some(v => v === i.id));
    }
    if (formVerify && !newItems.length) form.setFieldsValue({ tags: [] });
    this.setState({ labelContainer: { ...labelContainer, selectedItems: newItems } });
  }

  getList = (payload) => {
    const { index = 1, size = 6, query = "" } = payload;
    const {request}=this.props;
    const {labelContainer}=this.state;
    const callback = (res) => this.setState({ labelContainer: { ...labelContainer, ...res, index, size, query } });
    request({ ...payload, is_enable: 1, index, size }, callback);
  }

  categoryChange=(option)=>{
    const sortIds=option[option.length-1];
    const {labelContainer:{index,size,query}}=this.state;
    this.getList({netUrl:AdminLabelAPI.LIST.url,index,size,query,conditionQuery:{sortIds}});
  }

  render() {
    const { form, editorialPanelVisible } = this.props;
    const { initialFormData, markdownValue, categoryOptions, fileList,labelContainer } = this.state;
    const markdownNode = <Editor value={markdownValue} preview expand onChange={this.markDownChange} />;
    const tagColumn = [
      { title: '名称', dataIndex: 'name', sorter: true, width: '15%' },
      {title: '所属',dataIndex: 'sort_id',sorter: true,width: '15%',render: (_, item) => <span>{item.sort_name}</span>,},
      {title: '创建时间',dataIndex: 'create_time',sorter: true,width: '20%',
        render: val => (
          <span>
            <Icon type="clock-circle" />
            &nbsp;
            {timeFormat(Number(new Date(val)))}
          </span>
        ),
      },
      {
        title: '修改时间',
        dataIndex: 'modified_time',
        sorter: true,
        width: '20%',
        render: val => (
          <span>
            <Icon type="edit" />
            &nbsp;
            {timeFormat(Number(new Date(val)))}
          </span>
        ),
      },
      {
        title: '状态',
        dataIndex: 'disabled',
        width: '10%',
        sorter: true,
        render: val => <Tag color="blue">{val === 0 ? '可用' : '不可用'}</Tag>,
      },
    ];
    const tagTable={COLUMNS:tagColumn,CONDITION: [
      { fieldId: 'name', label: "标签名", fieldType: 'input', colLayout: { span: 8 } },
    ],};
    const tagComponent=(
      <CustomFormTable 
        onHandleCustomTableChange={this.onHandleCustomTableChange}
        getList={this.getList}
        itemTable={tagTable}
        selectBtnName="标签"
        list={labelContainer.list}
        total={labelContainer.total}
        netUrl={labelContainer.netUrl}
        selectedItems={labelContainer.selectedItems}
        tableWidth={{width: "100%"}}
        type="checkbox"
        netValue={{conditionQuery:{sortIds:[]}}}
      />
    );
    const imgUpload = (
      <CustomUpload
        fileList={fileList}
        action="http://127.0.0.1:3000/upload/pic?type=1&folder=1"
        handleUpload={list => {
          this.setState({ fileList: list });
          if (list.length > 0 && list[list.length - 1].status !== 'uploading') {
            const arr = list.filter(i => i.url || (i.response && i.response.url));
            if (arr.length < list.length) {
              Modal.error({ title: '上传失败！' });
              this.setState({ fileList: arr });
            }
          }
        }}
      />
    );
    const modalFormConfig = [
      {
        fieldId: 'title',
        label: '标题',
        rules: [{ required: true, message: '标题是必须的' }],
        fieldProps: { style: { width: '94%' } },
        fieldType: 'input',
        formItemLayout: { labelCol: { span: 3 } },
      },
      {
        fieldId: 'category_id',
        label: '分类',
        rules: [{ required: true, message: '分类是必须的' }],
        fieldType: 'cascader',
        fieldProps: {
          options: categoryOptions,
          fieldNames: { label: 'name', value: 'id' },
          style: { width: '86%' },
          onChange:this.categoryChange
        },
        formItemLayout: { labelCol: { span: 6 } },
        colLayout: { span: 12 },
      },
      {
        fieldId: 'is_top',
        label: '置顶',
        rules: [{ required: true, message: '请选择是否置顶！' }],
        fieldType: 'select',
        fieldProps: {
          options: [{ value: 1, label: '是' }, { value: 0, label: '否' }],
          style: { width: '86%' },
        },
        initialValue: 0,
        formItemLayout: { labelCol: { span: 6 } },
        colLayout: { span: 12 },
      },
      { 
        fieldId: 'label', 
        label: "标签", 
        fieldType: 'node', 
        fieldProps: { style: { width: "90%" } }, 
        fieldNode: tagComponent, 
        formItemLayout: { labelCol: { span: 3 } } 
      },
      {
        fieldId: 'image_url',
        label: '封面',
        fieldType: 'node',
        fieldNode: imgUpload,
        formItemLayout: { labelCol: { span: 3 } },
      },
      {
        fieldId: 'abstract',
        label: '摘要',
        fieldProps: { style: { width: '94%' }, autosize: true },
        fieldType: 'textArea',
        formItemLayout: { labelCol: { span: 3 } },
      },
      {
        fieldId: 'content',
        label: '内容',
        fieldType: 'node',
        fieldProps: { style: { width: '94%' } },
        fieldNode: markdownNode,
        formItemLayout: { labelCol: { span: 3 } },
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
      width: 1000,
    });
  }
}

export default EditorialForm;
