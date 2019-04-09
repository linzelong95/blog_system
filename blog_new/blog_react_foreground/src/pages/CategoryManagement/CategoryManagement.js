import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Modal, Card, Col, Row, Badge, Button, Tooltip, Input, Tag, Icon } from 'antd';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
import CateEditorialForm from './CateEditorialForm';
import SortEditorialForm from './SortEditorialForm';
import { timeFormat } from '@/utils/utils';
import { UrlEnum } from '@/assets/Enum';

const { AdminSortAPI, AdminCateAPI } = UrlEnum;

@connect(({ articleManagement, loading }) => ({
  articleManagement,
  loading: loading.models.articleManagement,
}))
class CategoryManagement extends React.Component {
  state = {
    conditionQuery: {},
    editorialPanelVisible: false,
    selectedItems: [], // 勾选的选项集合
    selectedRowKeys: [], // 被勾选项的key
    tabKey: 'sort',
    formItem: {},
    categoryOptions: [],
    filters: {},
    EditorialForm: SortEditorialForm
  };

  componentDidMount = () => this.request({ index: 1, size: 10 });

  componentWillUnmount = () => this.props.dispatch({ type: 'articleManagement/save', payload: { list: [] } });

  request = (params, callback) => {
    const { conditionQuery, tabKey } = this.state;
    const netUrl = tabKey === 'cate' ? AdminCateAPI.LIST.url : AdminSortAPI.LIST.url;
    const payload = { netUrl, conditionQuery, ...params };
    this.props.dispatch({ type: 'articleManagement/handleArticles', payload, callback });
    if (payload.netUrl !== netUrl) this.cleanSelectedItem();
  };

  handleShowALL = () => this.setState({ conditionQuery: {}, filters: {} }, () => {
    this.request({ index: 1 });
    this.inputSearch.input.state.value = '';
  });

  cleanSelectedItem = () => this.setState({ selectedRowKeys: [], selectedItems: [] });

  cleanFormItem = () => {
    this.cleanSelectedItem();
    this.setState({ formItem: {} });
  };

  toggleEditorialPanel = (flag) => {
    const { editorialPanelVisible, tabKey } = this.state;
    if (editorialPanelVisible) {
      this.setState({ EditorialForm: tabKey === "cate" ? CateEditorialForm : SortEditorialForm });
    }
    if (flag === "son") {
      this.setState({ EditorialForm: CateEditorialForm });
    }
    this.setState({ editorialPanelVisible: !editorialPanelVisible });
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { current: index, pageSize: size } = pagination;
    const { columnKey, order } = sorter;
    const { isEnable: isEnableArr, sort } = filters;
    const isEnable = isEnableArr && isEnableArr.length > 0 ? parseInt(isEnableArr[0], 10) : undefined;
    const sortIdsArr = sort && sort.length > 0 ? sort.map(i => parseInt(i, 10)) : [];
    const orderBy = columnKey ? { name: columnKey, by: order === 'descend' ? 'DESC' : 'ASC' } : {};
    this.setState(oldState => ({ filters, conditionQuery: { ...oldState.conditionQuery, orderBy, isEnable, sortIdsArr } }), () =>
      this.request({ index, size })
    );
  };

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
  };

  handleChangeTabs = tabKey => {
    this.props.dispatch({ type: 'articleManagement/save', payload: { list: [] } });
    this.setState({ tabKey, selectedRowKeys: [], selectedItems: [], conditionQuery: {}, filters: {}, EditorialForm: tabKey === "cate" ? CateEditorialForm : SortEditorialForm });
    if (this.inputSearch && this.inputSearch.input) this.inputSearch.input.state.value = '';
    if (tabKey === 'cate') {
      this.request({ netUrl: AdminCateAPI.LIST.url, index: 1, size: 10 });
      this.request({ netUrl: AdminSortAPI.LIST.url, conditionQuery: { isEnable: 1 }, index: 1, size: 999 }, res => this.setState({ categoryOptions: res.list }));
    } else {
      this.request({ netUrl: AdminSortAPI.LIST.url, index: 1, size: 10 });
    }
  };

  handleItems = (action, item) => {
    const { selectedItems, tabKey } = this.state;
    const { articleManagement: { lang } } = this.props;
    const { url: netUrl, desc, actionTip } = action;
    let content = '';
    let items = [];
    if (item) {
      const { id, name } = item;
      items = [{ id, name }];
      content = `【${items[0].name}】${actionTip[lang]}`;
    } else {
      items = selectedItems.map(v => ({ id: v.id, name: v.name }));
      if (netUrl.includes('/article'))
        items = selectedItems.map(v => ({ id: v.id, name: v.title }));
      content =
        lang === 'zh_CN'
          ? `注意：【${items[0].name}......】等多个所选项${actionTip[lang]}`
          : `warnning：Such as【${items[0].name}......】,they ${actionTip[lang]}`;
    }
    const title =
      lang === 'zh_CN'
        ? `确定${desc[lang]}吗？`
        : `Do you want to ${desc[lang]} what you have selected?`;
    // const okText = confirmButtonName[lang];
    // const cancelText = CANCEL[lang];
    const okText = '确定';
    const cancelText = '取消';
    const onCancel = () => this.cleanSelectedItem();
    const onOk = () => {
      if (netUrl.includes('/form')) {
        this.setState({ formItem: item, EditorialForm: netUrl.includes('/cate/form') ? CateEditorialForm : SortEditorialForm }, () =>
          this.toggleEditorialPanel()
        );
        return;
      }
      const callback = tabKey === "sort" && netUrl.includes("/cate") ? () => this.request() : undefined;
      this.request({ netUrl, items }, callback);
    };
    Modal.confirm({ title, content, okText, cancelText, onCancel, onOk });
  };

  handleOnSearch = val =>
    this.setState(
      oldState => ({
        conditionQuery: { ...oldState.conditionQuery, name: val.replace(/(^\s*)|(\s*$)/g, '') },
      }),
      () => this.request({ index: 1 })
    );

  render() {
    const {
      articleManagement: { total = 10, list = [], size = 10, index = 1 },
      loading,
    } = this.props;
    const {
      selectedItems,
      editorialPanelVisible,
      formItem,
      categoryOptions,
      filters,
      selectedRowKeys,
      tabKey,
      EditorialForm
    } = this.state;
    const tabList = [
      { key: 'sort', tab: '所有分类' },
      { key: 'cate', tab: '二级分类' },
    ];
    const sortColumn = [
      { title: '名称', dataIndex: 'name', key: "name", sorter: true, width: '20%' },
      {
        title: '创建时间',
        dataIndex: "createDate",
        key: "createDate",
        sorter: true,
        width: '20%',
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
        dataIndex: 'updateDate',
        key: "updateDate",
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
        dataIndex: 'isEnable',
        key: "isEnable",
        sorter: true,
        width: '20%',
        filters: [{ text: '不可用', value: 0 }, { text: '可用', value: 1 }],
        filterMultiple: false,
        filteredValue: filters.isEnable || null,
        render: val => <Tag color={val === 1 ? "blue" : "gray"}>{val === 1 ? '可用' : '不可用'}</Tag>,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: "action",
        width: '20%',
        render: (_, item) => (
          <Fragment>
            <Button
              icon="form"
              size="small"
              shape="circle"
              onClick={() => this.handleItems(AdminSortAPI.FORM, item)}
              style={{ color: '#8B3A3A' }}
            />
            <Button
              icon="delete"
              size="small"
              shape="circle"
              onClick={() => this.handleItems(AdminSortAPI.DELETE, item)}
              style={{ color: 'red', marginLeft: '10px' }}
            />
            {item.isEnable === 1 && (
              <Button
                icon="lock"
                size="small"
                shape="circle"
                onClick={() => this.handleItems(AdminSortAPI.LOCK, item)}
                style={{ color: '#A020F0', marginLeft: '10px' }}
              />
            )}
            {item.isEnable === 0 && (
              <Button
                icon="unlock"
                size="small"
                shape="circle"
                onClick={() => this.handleItems(AdminSortAPI.UNLOCK, item)}
                style={{ color: 'green', marginLeft: '10px' }}
              />
            )}
          </Fragment>
        ),
      },
    ];
    const cateColumn = [
      { title: '名称', dataIndex: 'name', key: "name", sorter: true, width: '15%' },
      {
        title: '所属',
        dataIndex: 'sort',
        key: "sort",
        sorter: true,
        width: '15%',
        filters: categoryOptions.map(i => ({ text: i.name, value: i.id })),
        filteredValue: filters.sort || null,
        render: (val) => <span>{val.name}</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: "createDate",
        sorter: true,
        width: '20%',
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
        dataIndex: 'updateDate',
        key: "updateDate",
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
        dataIndex: 'isEnable',
        key: "isEnable",
        width: '10%',
        sorter: true,
        filters: [{ text: '不可用', value: 0 }, { text: '可用', value: 1 }],
        filterMultiple: false,
        filteredValue: filters.isEnable || null,
        render: val => <Tag color={val === 1 ? "blue" : "gray"}>{val === 1 ? '可用' : '不可用'}</Tag>,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: "action",
        width: '20%',
        render: (_, item) => (
          <Fragment>
            <Button
              icon="form"
              size="small"
              shape="circle"
              onClick={() => this.handleItems(AdminCateAPI.FORM, item)}
              style={{ color: '#8B3A3A' }}
            />
            <Button
              icon="delete"
              size="small"
              shape="circle"
              onClick={() => this.handleItems(AdminCateAPI.DELETE, item)}
              style={{ color: 'red', marginLeft: '10px' }}
            />
            {item.isEnable === 1 && (
              <Button
                icon="lock"
                size="small"
                shape="circle"
                onClick={() => this.handleItems(AdminCateAPI.LOCK, item)}
                style={{ color: '#A020F0', marginLeft: '10px' }}
              />
            )}
            {item.isEnable === 0 && (
              <Button
                icon="unlock"
                size="small"
                shape="circle"
                onClick={() => this.handleItems(AdminCateAPI.UNLOCK, item)}
                style={{ color: 'green', marginLeft: '10px' }}
              />
            )}
          </Fragment>
        ),
      },
    ];

    const expandedRowRender = (record) =>
      <Table
        columns={cateColumn.filter(i => i.dataIndex !== "sort").map(i => ({ ...i, width: "20%", align: "right" }))}
        rowKey={item => item.id}
        onChange={this.handleTableChange}
        loading={loading}
        dataSource={record.categories}
        pagination={false}
        showHeader={false}
      />

    return (
      <PageHeaderLayout tabList={tabList} onTabChange={this.handleChangeTabs}>
        <Card>
          <Row type="flex" align="middle" style={{ marginBottom: '15px' }}>
            <Col xs={12} sm={13} md={15} lg={16} xl={17}>
              <Button icon="plus" type="primary" size="small" onClick={this.toggleEditorialPanel}>新增&nbsp;</Button>
              {tabKey === "sort" && <Button icon="plus" type="primary" size="small" style={{ marginLeft: '20px' }} onClick={() => this.toggleEditorialPanel("son")}>新增子分类&nbsp;</Button>}
              {selectedItems.length > 0 && (
                <Fragment>
                  <Badge count={selectedItems.length} title="已选项数">
                    &nbsp;
                    <Button
                      icon="reload"
                      type="primary"
                      size="small"
                      onClick={this.cleanSelectedItem}
                      style={{ marginLeft: '16px' }}
                    >
                      清空&nbsp;
                    </Button>
                  </Badge>
                  <Tooltip title="一键删除">
                    <Button
                      icon="delete"
                      size="small"
                      shape="circle"
                      onClick={() =>
                        this.handleItems(
                          tabKey === 'sort' ? AdminSortAPI.DELETE : AdminCateAPI.DELETE
                        )
                      }
                      style={{ color: 'red', marginLeft: '20px' }}
                    />
                  </Tooltip>
                  <Tooltip title="一键解锁">
                    <Button
                      icon="unlock"
                      size="small"
                      shape="circle"
                      onClick={() =>
                        this.handleItems(
                          tabKey === 'sort' ? AdminSortAPI.UNLOCK : AdminCateAPI.UNLOCK
                        )
                      }
                      style={{ color: 'green', marginLeft: '10px' }}
                    />
                  </Tooltip>
                  <Tooltip title="一键锁定">
                    <Button
                      icon="lock"
                      size="small"
                      shape="circle"
                      onClick={() =>
                        this.handleItems(
                          tabKey === 'sort' ? AdminSortAPI.LOCK : AdminCateAPI.LOCK
                        )
                      }
                      style={{ color: '#A020F0', marginLeft: '10px' }}
                    />
                  </Tooltip>
                </Fragment>
              )}
            </Col>
            <Col xs={2} sm={2} md={1} lg={1} xl={1}>
              <Tooltip title="默认展示">
                <Button
                  type="primary"
                  icon="home"
                  shape="circle"
                  size="small"
                  onClick={this.handleShowALL}
                />
              </Tooltip>
            </Col>
            <Col xs={10} sm={9} md={8} lg={7} xl={6}>
              <Input.Search
                placeholder="请输入名称"
                onSearch={this.handleOnSearch}
                enterButton
                allowClear
                ref={inputSearch => {
                  this.inputSearch = inputSearch;
                }}
              />
            </Col>
          </Row>
          <Table
            columns={tabKey === 'cate' ? cateColumn : sortColumn}
            rowKey={item => item.id}
            onChange={this.handleTableChange}
            rowSelection={{ selectedRowKeys, onChange: this.handleSelectRows }}
            loading={loading}
            dataSource={list}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              current: index,
              total,
              pageSize: size,
            }}
            expandedRowRender={tabKey === "sort" ? (record) => expandedRowRender(record) : undefined}
          />
          {editorialPanelVisible && (
            <EditorialForm
              editorialPanelVisible={editorialPanelVisible}
              toggleEditorialPanel={this.toggleEditorialPanel}
              cleanFormItem={this.cleanFormItem}
              formItem={formItem}
              request={this.request}
              tabKey={tabKey}
            />
          )}
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default CategoryManagement;
