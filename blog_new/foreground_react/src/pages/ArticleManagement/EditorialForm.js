import React, { Fragment } from 'react';
import { Form, Modal, Tag, Icon, Button } from 'antd';
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
  AdminSortAPI,
  AdminTagAPI,
} = UrlEnum;

const initTagContainer = {
  netUrl: AdminTagAPI.LIST.url,
  list: [],
  total: 0,
  index: 1,
  size: 6,
  conditionQuery: {},
  selectedItems: []
};

@Form.create()
class EditorialForm extends React.PureComponent {
  state = {
    initialFormData: {},
    markdownValue: '',
    categoryOptions: [],
    fileList: [],
    tagContainer: initTagContainer,
    tagEditorialModalVisible: false,
  };

  componentDidMount = () => {
    const { formItem = {}, request } = this.props;
    request({ netUrl: AdminSortAPI.LIST.url, index: 1, size: 999 }, res =>
      this.setState({
        categoryOptions: res.list.filter(i => i.categories && i.categories.length > 0).map(i => {
          const newSort = { ...i };
          newSort.disabled = !i.isEnable;
          newSort.categories = i.categories.map(v => {
            const newCategories = { ...v };
            newCategories.disabled = !v.isEnable;
            return newCategories;
          });
          return newSort;
        })
      })
    );
    if (formItem.id) {
      request({ netUrl: CONTENT.url, articleId: formItem.id }, res => {
        formItem.content = res.list[0].content;
        this.formatInitialFormData(formItem);
      });
    }
  };

  formatInitialFormData = (formItem, extraObj) => {
    const { category, content, imageUrl, tags } = formItem;
    const tagSelectedItems = tags.map(i => ({ ...i, sort: category.sort }));
    const fileList = imageUrl ? [{ uid: -1, url: `${imgPrefix}${imageUrl}` }] : [];
    const initialFormData = { ...formItem, category: [category.sort.id, category.id] };
    this.setState(oldState => ({
      initialFormData,
      tagContainer: { ...oldState.tagContainer, selectedItems: tagSelectedItems },
      fileList,
      markdownValue: content,
      ...extraObj
    }));
  };

  toggleEdit = obj => {
    const { form, request, cleanFormItem, toggleEditorialPanel, formItem: { id } } = this.props;
    if (obj === 'cancel') {
      form.resetFields();
      toggleEditorialPanel();
      cleanFormItem();
      request();
      return;
    }
    form.validateFields((err, values) => {
      if (err) return;
      const { fileList, tagContainer: { selectedItems: tags } } = this.state;
      const { category } = values;
      const imageUrls = [];
      fileList.forEach(i => {
        if (i.url) {
          imageUrls.push(i.url.split(imgPrefix)[1]);
        } else if (i.response && i.response.url) {
          imageUrls.push(i.response.url);
        }
      });
      const netUrl = id ? UPDATE.url : INSERT.url;
      const imageUrl = imageUrls[0];
      request({ ...values, id, netUrl, imageUrl, tags, category: { id: category[category.length - 1] } });
      toggleEditorialPanel();
      cleanFormItem();
      form.resetFields();
    });
  };

  markDownChange = markdownValue => this.setState({ markdownValue });

  onHandleCustomTableChange = ({ keys, items, formVerify, notAllowChange }) => {
    const { form } = this.props;
    if (notAllowChange) {
      Modal.error({ title: "不能修改" });
      return;
    }
    const { tagContainer } = this.state;
    const { selectedItems } = tagContainer;
    let newItems = [];
    if (selectedItems.length === keys.length) {
      newItems = items;
    } else if (selectedItems.length < keys.length) {
      newItems = [...selectedItems.filter(i => items.every(v => i.id !== v.id)), ...items];
    } else {
      newItems = selectedItems.filter(i => keys.some(v => v === i.id));
    }
    if (formVerify && !newItems.length) form.setFieldsValue({ tags: [] });
    this.setState({ tagContainer: { ...tagContainer, selectedItems: newItems } });
  }

  getList = (payload) => {
    const { index = 1, size = 6, conditionQuery = {} } = payload;
    const { request } = this.props;
    request({ ...payload, isEnable: 1, index, size }, (res) => {
      const { list: preList, total } = res;
      const list = preList.map(i => {
        const newItem = { ...i };
        newItem.disabled = !i.isEnable;
        return newItem;
      })
      this.setState(oldState => ({ tagContainer: { ...oldState.tagContainer, total, list, index, size, conditionQuery } }))
    });
  }

  categoryChange = (option) => {
    const sortIdsArr = option.slice(0, 1);
    this.getList({ netUrl: AdminTagAPI.LIST.url, index: 1, size: 6, conditionQuery: { sortIdsArr } });
  }

  toggleTagEdit = obj => {
    const { form, request } = this.props;
    if (obj === 'cancel') {
      this.toggleEditorialTagPanel();
      return;
    }
    form.validateFields((err, values) => {
      const { tagSort, tagName } = values;
      if (!tagSort || !tagName) {
        Modal.error({ title: "请选择或输入相关值" });
        return;
      }
      const netUrl = AdminTagAPI.INSERT.url;
      request({ ...values, netUrl, name: tagName, sortId: tagSort.key }, (res) => {
        const { flag, entity } = res;
        if (!flag) {
          Modal.error({ title: "添加失败，请重试，注意标签是否已存在！" });
          return;
        }
        this.setState(oldState => ({ tagContainer: { ...oldState.tagContainer, selectedItems: [...oldState.tagContainer.selectedItems, { ...entity, sort: { id: tagSort.key, name: tagSort.label } }] } }));
        const { tagContainer: { index, size, conditionQuery } } = this.state;
        const categoryIds = form.getFieldValue("category") || [];
        const sortIdsArr = categoryIds.slice(0, 1);
        this.getList({ netUrl: AdminTagAPI.LIST.url, index, size, conditionQuery: { ...conditionQuery, sortIdsArr } })
      });
      this.toggleEditorialTagPanel();
    });
  };

  toggleEditorialTagPanel = () => this.setState(oldState => ({ tagEditorialModalVisible: !oldState.tagEditorialModalVisible }));

  doVerifyFunc = () => {
    const { form } = this.props;
    const categoryIds = form.getFieldValue("category");
    const flag = Array.isArray(categoryIds) && categoryIds.length > 0;
    if (!flag) Modal.error({ title: "请先选择分类！" });
    return flag;
  }

  render() {
    const { form, editorialPanelVisible } = this.props;
    const { initialFormData, markdownValue, categoryOptions, fileList, tagContainer, tagEditorialModalVisible } = this.state;
    const markdownNode = <Editor value={markdownValue} preview expand onChange={this.markDownChange} />;
    const tagTable = {
      COLUMNS: [
        { title: '名称', dataIndex: 'name', sorter: true, width: '15%' },
        { title: '所属', dataIndex: 'sort', sorter: true, width: '15%', render: (val) => <span>{val ? val.name : ""}</span> },
        { title: '创建时间', dataIndex: 'createDate', sorter: true, width: '20%', render: val => <span><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(val)))}</span> },
        { title: '修改时间', dataIndex: 'updateDate', sorter: true, width: '20%', render: val => <span><Icon type="edit" />&nbsp;{timeFormat(Number(new Date(val)))}</span> },
        { title: '状态', dataIndex: 'isEnable', width: '10%', sorter: true, render: val => <Tag color="blue">{val === 1 ? '可用' : '不可用'}</Tag> }
      ],
      CONDITION: [{ fieldId: 'name', label: "标签名", fieldType: 'input', colLayout: { span: 8 } }],
    };
    const categoryIds = form.getFieldValue("category") || [];
    const sortIdsArr = categoryIds.slice(0, 1);
    const additionalComponent = !categoryIds.length ? [] : [{
      type: "modal",
      component: (
        <Fragment>
          <Button type="danger" onClick={this.toggleEditorialTagPanel}>没有找到？新建一个</Button>
          {getModalForm({
            form,
            editorialPanelVisible: tagEditorialModalVisible,
            toggleEdit: this.toggleTagEdit,
            modalFormConfig: [{
              fieldId: 'tagName',
              label: '名称',
              fieldProps: { style: { width: '86%' } },
              fieldType: 'input',
              formItemLayout: { labelCol: { span: 6 } },
            },
            {
              fieldId: 'tagSort',
              label: '分类',
              fieldType: 'select',
              fieldProps: {
                options: [],
                labelInValue: true,
                style: { width: '86%' },
                disabled: true
              },
              initialValue: { key: categoryIds[0], label: categoryOptions.filter(i => i.id === categoryIds[0])[0].name },
              formItemLayout: { labelCol: { span: 6 } },
            }],
            INSERT: AdminTagAPI.INSERT,
            UPDATE: AdminTagAPI.INSERT,
            width: 600,
          })}
        </Fragment>
      )
    }];
    const tagComponent = (
      <CustomFormTable
        onHandleCustomTableChange={this.onHandleCustomTableChange}
        getList={this.getList}
        itemTable={tagTable}
        selectBtnName="标签"
        list={tagContainer.list}
        total={tagContainer.total}
        index={tagContainer.index}
        size={tagContainer.size}
        netUrl={tagContainer.netUrl}
        conditionQuery={tagContainer.conditionQuery}
        selectedItems={tagContainer.selectedItems}
        tableWidth={{ width: "100%" }}
        type="checkbox"
        customValue={{conditionQuery:{sortIdsArr}}}
        additionalComponent={additionalComponent}
        doVerifyFunc={this.doVerifyFunc}
      />
    );
    const imgUpload = (
      <CustomUpload
        fileList={fileList}
        action="http://127.0.0.1:7001/upload/file?type=1&folder=1"
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
        fieldId: 'category',
        label: '分类',
        rules: [{ required: true, message: '分类是必须的' }],
        fieldType: 'cascader',
        fieldProps: {
          options: categoryOptions,
          fieldNames: { label: 'name', value: 'id', children: "categories" },
          style: { width: '86%' },
          onChange: this.categoryChange
        },
        formItemLayout: { labelCol: { span: 6 } },
        colLayout: { span: 12 },
      },
      {
        fieldId: 'isTop',
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
        fieldId: 'tags',
        label: "标签",
        fieldType: 'node',
        fieldProps: { style: { width: "90%" } },
        fieldNode: tagComponent,
        formItemLayout: { labelCol: { span: 3 } }
      },
      {
        fieldId: 'imageUrl',
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
