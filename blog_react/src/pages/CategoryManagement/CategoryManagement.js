import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Modal, Card, Checkbox, Col, Row, Badge, Button, Tooltip, Input, Tag, Icon, List, Drawer, Tree } from 'antd';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
import CateEditorialForm from './CateEditorialForm';
import SortEditorialForm from './SortEditorialForm';
import { timeFormat } from '@/utils/utils';

const SortAPI = {
  LIST: { url: "/api/admin/sort/list", desc: { zh_CN: "获取一级列表", en_US: "getList" } },
  DELETE: { url: "/api/admin/sort/delete", desc: { zh_CN: "删除", en_US: "delete" }, actionTip: { zh_CN: "将被删除", en_US: "will be deleted!" } },
  FORM: { url: `/api/admin/sort/form`, desc: { zh_CN: "编辑", en_US: "edit" }, actionTip: { zh_CN: "将处于可编辑状态，编辑时请注意核对！", en_US: "will be under editing. Please pay attention for information!" } },
  LOCK: { url: `/api/admin/sort/lock`, desc: { zh_CN: "锁定", en_US: "lock" }, actionTip: { zh_CN: "将被锁定，锁定后可以解锁和删除，但不可编辑！", en_US: "will be lock,and then  can be released  or deleted, but can not be edited!" } },
  UNLOCK: { url: `/api/admin/sort/unlock`, desc: { zh_CN: "解锁", en_US: "unlock" }, actionTip: { zh_CN: "将被解锁，解锁后可编辑和锁定,但不可删除！", en_US: "will be released,and then can be edited or locked,but can not be deleted!" } },
}

const CateAPI = {
  LIST: { url: "/api/admin/cate/list", desc: { zh_CN: "获取二级分类列表", en_US: "getList" } },
  DELETE: { url: "/api/admin/cate/delete", desc: { zh_CN: "删除", en_US: "delete" }, actionTip: { zh_CN: "将被删除", en_US: "will be deleted!" } },
  FORM: { url: `/api/admin/cate/form`, desc: { zh_CN: "编辑", en_US: "edit" }, actionTip: { zh_CN: "将处于可编辑状态，编辑时请注意核对！", en_US: "will be under editing. Please pay attention for information!" } },
  LOCK: { url: `/api/admin/cate/lock`, desc: { zh_CN: "锁定", en_US: "lock" }, actionTip: { zh_CN: "将被锁定，锁定后可以解锁和删除，但不可编辑！", en_US: "will be lock,and then  can be released  or deleted, but can not be edited!" } },
  UNLOCK: { url: `/api/admin/cate/unlock`, desc: { zh_CN: "解锁", en_US: "unlock" }, actionTip: { zh_CN: "将被解锁，解锁后可编辑和锁定,但不可删除！", en_US: "will be released,and then can be edited or locked,but can not be deleted!" } },
}



@connect(({ articleManagement, loading }) => ({
  articleManagement,
  loading: loading.models.articleManagement,
}))
class CategoryManagement extends React.Component {
  state = {
    conditionQuery: {},
    editorialPanelVisible: false,
    selectedItems: [],// 勾选的选项集合
    selectedRowKeys: [],// 被勾选项的key
    tabKey: "sort",
    formItem: {},
    categoryOptions: [],
    filters: {}
  };

  componentDidMount = () => this.request({ index: 1, size: 10 });

  request = (params, callback) => {
    const { conditionQuery, tabKey } = this.state;
    const netUrl = tabKey === "sort" ? SortAPI.LIST.url : CateAPI.LIST.url;
    const payload = { netUrl, conditionQuery, ...params };
    this.props.dispatch({ type: "articleManagement/handleArticles", payload, callback });
    if (payload.netUrl !== netUrl) this.cleanSelectedItem();
  }

  handleShowALL = () => this.setState({ conditionQuery: {}, filters: {} }, () => this.request({ index: 1 }));

  cleanSelectedItem = () => this.setState({ selectedRowKeys: [], selectedItems: [] });

  cleanFormItem = () => {
    this.cleanSelectedItem();
    this.setState({ formItem: {} });
  }

  toggleEditorialPanel = () => this.setState((oldState) => ({ editorialPanelVisible: !oldState.editorialPanelVisible }));

  handleTableChange = (pagination, filters, sorter) => {
    const { current: index, pageSize: size } = pagination;
    const { columnKey, order } = sorter;
    const { disabled: disabledArr, sort: s = [] } = filters;
    const disabled = disabledArr && disabledArr.length > 0 ? parseInt(disabledArr[0]) : undefined;
    const sort = s.map(i => parseInt(i, 10));
    const orderBy = columnKey ? { name: columnKey, by: order === "descend" ? "desc" : "asc" } : {};
    this.setState(oldState => ({ filters, conditionQuery: { ...oldState.conditionQuery, orderBy, disabled, sort } }), () => this.request({ index, size }));
  }

  handleSelectRows = (keys, items) => {
    const { selectedItems } = this.state;
    let newItems = [];
    if (selectedItems.length === keys.length) {
      newItems = items;
    } else if (selectedItems.length < keys.length) {
      newItems = [...selectedItems.filter(i => items.every(v => i.id !== v.id)), ...items];
    } else {
      newItems = selectedItems.filter(i => keys.some(v => v === i.id));
    }
    this.setState({ selectedRowKeys: keys, selectedItems: newItems });
  }

  handleChangeTabs = (tabKey) => {
    this.setState({ tabKey, selectedRowKeys: [], selectedItems: [], conditionQuery: {}, filters: {} });
    if (tabKey === "sort") {
      this.request({ netUrl: SortAPI.LIST.url, index: 1 });
    } else if (tabKey === "cate") {
      this.request({ netUrl: CateAPI.LIST.url, index: 1 });
      const callback = (res) => this.setState({ categoryOptions: res.list });
      this.request({ netUrl: CateAPI.LIST.url, index: 1, size: 100, prettyFormat: true }, callback);
    } else if (tabKey === "all") {
      this.request({ netUrl: CateAPI.LIST.url, index: 1, size: 100, allCateAndSort: true });
    } else {
      this.request({ netUrl: CateAPI.LIST.url, index: 1, size: 100, prettyFormat: true });
    }
  }

  handleItems = (action, item) => {
    const { selectedItems } = this.state;
    const { articleManagement: { lang } } = this.props;
    const { url: netUrl, desc, actionTip } = action;
    let content = "";
    let items = [];
    if (item) {
      const { id, name, title } = item;
      items = [{ id, name }];
      content = `【${items[0].name}】${actionTip[lang]}`;
    } else {
      items = selectedItems.map(v => ({ id: v.id, name: v.name }));
      if (netUrl.includes("/article")) items = selectedItems.map(v => ({ id: v.id, name: v.title }));;
      content = lang === "zh_CN" ? `注意：【${items[0].name}......】等多个所选项${actionTip[lang]}` : `warnning：Such as【${items[0].name}......】,they ${actionTip[lang]}`;
    }
    const title = lang === "zh_CN" ? `确定${desc[lang]}吗？` : `Do you want to ${desc[lang]} what you have selected?`;
    // const okText = confirmButtonName[lang];
    // const cancelText = CANCEL[lang];
    const okText = "确定";
    const cancelText = "取消";
    const onCancel = () => this.cleanSelectedItem();
    const onOk = () => {
      if (netUrl.includes("/form")) {
        this.setState({ formItem: item });
        this.toggleEditorialPanel();
        return;
      }
      this.request({ netUrl, items });
    }
    Modal.confirm({ title, content, okText, cancelText, onCancel, onOk });
  }

  handleOnSearch = (val) => this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, name: val.replace(/(^\s*)|(\s*$)/g, "") } }), () => this.request({ index: 1 }));


  render() {
    const { articleManagement: { total = 10, list = [], size = 10, index = 1 }, loading } = this.props;
    const { allSelectedItem, selectedItems, editorialPanelVisible, drawerVisible, formItem, showSorter, clientHeight, filterModalVisible, categoryOptions, filters, conditionQuery, selectedRowKeys, tabKey } = this.state;
    const EditorialForm = tabKey === "sort" ? SortEditorialForm : CateEditorialForm;
    const tabList = [
      { key: "sort", tab: "一级分类" },
      { key: "cate", tab: "二级分类" },
      { key: "all", tab: "所有分类【览】" },
      { key: "using", tab: "在用分类 【览】" },
    ];
    const sortColumn = [
      { title: "名称", dataIndex: 'name', sorter: true, width: "20%" },
      { title: "创建时间", dataIndex: 'create_time', sorter: true, width: "20%", render: (val) => <span><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(val)))}</span> },
      { title: "修改时间", dataIndex: 'modified_time_time', sorter: true, width: "20%", render: (val) => <span><Icon type="edit" />&nbsp;{timeFormat(Number(new Date(val)))}</span> },
      { title: "状态", dataIndex: 'disabled', sorter: true, width: "20%", filters: [{ text: "不可用", value: 1 }, { text: "可用", value: 0 }], filterMultiple: false, filteredValue: filters.disabled || null, render: (val) => <Tag color="blue">{val === 0 ? "可用" : "不可用"}</Tag> },
      {
        title: "操作", dataIndex: 'action', width: "20%", render: (_, item) =>
          <Fragment>
            <Button icon="form" size="small" shape="circle" onClick={() => this.handleItems(SortAPI.FORM, item)} style={{ color: "#8B3A3A" }} />
            <Button icon="delete" size="small" shape="circle" onClick={() => this.handleItems(SortAPI.DELETE, item)} style={{ color: "red", marginLeft: "10px" }} />
            {item.disabled === 0&&<Button icon="lock" size="small" shape="circle" onClick={() => this.handleItems(SortAPI.LOCK, item)} style={{ color: "#A020F0", marginLeft: "10px" }} />}
            {item.disabled === 1&&<Button icon="unlock" size="small" shape="circle" onClick={() => this.handleItems(SortAPI.UNLOCK, item)} style={{ color: "green", marginLeft: "10px" }} />}
          </Fragment>
      },
    ];
    const cateColumn = [
      { title: "名称", dataIndex: 'name', sorter: true, width: "15%" },
      { title: "所属", dataIndex: 'sort', sorter: true, width: "15%", filters: categoryOptions.map(i => ({ text: i.name, value: i.id })), filteredValue: filters.sort || null, render: (_, item) => <span>{item.sort_name}</span> },
      { title: "创建时间", dataIndex: 'create_time', sorter: true, width: "20%", render: (val) => <span><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(val)))}</span> },
      { title: "修改时间", dataIndex: 'modified_time_time', sorter: true, width: "20%", render: (val) => <span><Icon type="edit" />&nbsp;{timeFormat(Number(new Date(val)))}</span> },
      { title: "状态", dataIndex: 'disabled', width: "10%", sorter: true, filters: [{ text: "不可用", value: 1 }, { text: "可用", value: 0 }], filterMultiple: false, filteredValue: filters.disabled || null, render: (val) => <Tag color="blue">{val === 0 ? "可用" : "不可用"}</Tag> },
      {
        title: "操作", dataIndex: 'action', width: "20%", render: (_, item) =>
          <Fragment>
            <Button icon="form" size="small" shape="circle" onClick={() => this.handleItems(CateAPI.FORM, item)} style={{ color: "#8B3A3A" }} />
            <Button icon="delete" size="small" shape="circle" onClick={() => this.handleItems(CateAPI.DELETE, item)} style={{ color: "red", marginLeft: "10px" }} />
            {item.disabled === 0&&<Button icon="lock" size="small" shape="circle" onClick={() => this.handleItems(CateAPI.LOCK, item)} style={{ color: "#A020F0", marginLeft: "10px" }} />}
            {item.disabled === 1&&<Button icon="unlock" size="small" shape="circle" onClick={() => this.handleItems(CateAPI.UNLOCK, item)} style={{ color: "green", marginLeft: "10px" }} />}
          </Fragment>
      },
    ];
    const cateAndSortColumn = [
      { title: "名称", dataIndex: 'name', width: "30%" },
      { title: "可用状态", dataIndex: 'disabled', width: "30%", render: (val) => <Tag color="blue">{val === 0 ? "可用" : "不可用"}</Tag> },
      { title: "使用状态", dataIndex: 'is_use', width: "30%", filteredValue: filters.disabled || null, render: (val) => <Tag color="blue">{val === 0 ? "暂未使用" : "正在使用"}</Tag> },
    ];

    const expandRender = (record) => {
      const expandColumn = [
        { title: "名称", dataIndex: 'name', width: "30%" },
        { title: "可用状态", dataIndex: 'disabled', width: "30%", render: (val) => <Tag color="blue">{val === 0 ? "可用" : "不可用"}</Tag> },
        { title: "使用状态", dataIndex: 'is_use', width: "30%", render: (val) => <Tag color="blue">{val === 0 ? "暂未使用" : "正在使用"}</Tag> },
      ];
      return (
        <Table
          showHeader={false}
          dataSource={record.children}
          columns={expandColumn}
          rowKey={row => row.id}
          pagination={false}
        />
      )
    }

    return (
      <PageHeaderLayout tabList={tabList} onTabChange={this.handleChangeTabs}>
        <Card>
          {(tabKey === "sort" || tabKey === "cate") &&
            <Row type="flex" align="middle" style={{ marginBottom: "15px" }}>
              <Col xs={12} sm={13} md={15} lg={16} xl={17}>
                <Button icon="plus" type="primary" size="small" onClick={this.toggleEditorialPanel}>新增&nbsp;</Button>
                {/* <Button icon="filter" type={conditionQuery.category&&Object.keys(conditionQuery.category).length>0 ? "danger" : "primary"} size="small" onClick={this.showFilterModal} style={{ marginLeft: "20px" }}>筛选&nbsp;</Button> */}
                {selectedItems.length > 0 &&
                  <Fragment>
                    <Badge count={selectedItems.length} title="已选项数">&nbsp;
                    <Button icon="reload" type="primary" size="small" onClick={this.cleanSelectedItem} style={{ marginLeft: "16px" }}>清空&nbsp;</Button>
                    </Badge>
                    <Tooltip title="一键删除">
                      <Button icon="delete" size="small" shape="circle" onClick={() => this.handleItems(tabKey === "sort" ? SortAPI.DELETE : CateAPI.DELETE)} style={{ color: "red", marginLeft: "20px" }} />
                    </Tooltip>
                    <Tooltip title="一键解锁">
                      <Button icon="unlock" size="small" shape="circle" onClick={() => this.handleItems(tabKey === "sort" ? SortAPI.UNLOCK : CateAPI.UNLOCK)} style={{ color: "green", marginLeft: "10px" }} />
                    </Tooltip>
                    <Tooltip title="一键锁定">
                      <Button icon="lock" size="small" shape="circle" onClick={() => this.handleItems(tabKey === "sort" ? SortAPI.LOCK : CateAPI.LOCK)} style={{ color: "#A020F0", marginLeft: "10px" }} />
                    </Tooltip>
                  </Fragment>
                }
              </Col>
              <Col xs={2} sm={2} md={1} lg={1} xl={1}>
                <Tooltip title="默认展示">
                  <Button type="primary" icon="home" shape="circle" size="small" onClick={this.handleShowALL} />
                </Tooltip>
              </Col>
              <Col xs={10} sm={9} md={8} lg={7} xl={6}>
                <Input.Search placeholder="请输入名称" onSearch={this.handleOnSearch} enterButton ref={inputSearch => this.inputSearch = inputSearch} />
              </Col>
            </Row>
          }
          <Table
            columns={tabKey === "sort" ? sortColumn : tabKey === "cate" ? cateColumn : cateAndSortColumn}
            rowKey={item => item.id}
            onChange={this.handleTableChange}
            rowSelection={tabKey === "all" || tabKey === "using" ? undefined : { selectedRowKeys, onChange: this.handleSelectRows }}
            loading={loading}
            dataSource={tabKey === "using" ? list.filter(i => { if (i.is_use && i.children) return i.children = i.children.filter(v => v.is_use); }) : list}
            pagination={{ showQuickJumper: true, showSizeChanger: true, current: index, total, pageSize: size }}
            expandedRowRender={(tabKey === "all" || tabKey === "using") ? expandRender : undefined}
          />
          {editorialPanelVisible &&
            <EditorialForm
              editorialPanelVisible={editorialPanelVisible}
              toggleEditorialPanel={this.toggleEditorialPanel}
              cleanFormItem={this.cleanFormItem}
              formItem={formItem}
              request={this.request}
            />
          }
        </Card>
      </PageHeaderLayout>
    )
  }
}
export default CategoryManagement;