import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Modal, Card, Col, Row, Badge, Button, Tooltip, Input, Tag, Icon } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import EditorialForm from './EditorialForm';
import { timeFormat } from '@/utils/utils';
import { UrlEnum } from '@/assets/Enum';

const { AdminTagAPI: { LIST, DELETE, LOCK, UNLOCK, FORM }, AdminSortAPI } = UrlEnum;

@connect(({ articleManagement, loading }) => ({
  articleManagement,
  loading: loading.models.articleManagement,
}))
class TagManagement extends React.Component {
  state = {
    conditionQuery: {},
    editorialPanelVisible: false,
    selectedItems: [], // 勾选的选项集合
    selectedRowKeys: [], // 被勾选项的key
    formItem: {},
    categoryOptions: [],
    filters: {},
  };

  componentDidMount = () => {
    this.request({ index: 1, size: 10 });
    this.request({ netUrl: AdminSortAPI.LIST.url, conditionQuery: { isEnable: 1 }, index: 1, size: 999 }, res =>
      // 是否需要disabled字段，待确定,应该不需要吧？
      this.setState({
        categoryOptions: res.list.map(i => {
          const newSort = { ...i };
          newSort.disabled = !i.isEnable;
          return newSort;
        })
      })
    );
  }

  componentWillUnmount = () => this.props.dispatch({ type: 'articleManagement/save', payload: { list: [] } });

  request = (params, callback) => {
    const { conditionQuery } = this.state;
    const netUrl = LIST.url;
    const payload = { netUrl, conditionQuery, ...params };
    this.props.dispatch({ type: 'articleManagement/handleArticles', payload, callback });
    if (payload.netUrl !== netUrl) this.cleanSelectedItem();
  };

  handleShowALL = () =>
    this.setState({ conditionQuery: {}, filters: {} }, () => {
      this.request({ index: 1 });
      this.inputSearch.input.state.value = '';
    });

  cleanSelectedItem = () => this.setState({ selectedRowKeys: [], selectedItems: [] });

  cleanFormItem = () => {
    this.cleanSelectedItem();
    this.setState({ formItem: {} });
  };

  toggleEditorialPanel = () =>
    this.setState(oldState => ({ editorialPanelVisible: !oldState.editorialPanelVisible }));

  handleTableChange = (pagination, filters, sorter) => {
    const { current: index, pageSize: size } = pagination;
    const { columnKey, order } = sorter;
    const { isEnable: isEnableArr, sort } = filters;
    const isEnable = isEnableArr && isEnableArr.length > 0 ? parseInt(isEnableArr[0], 10) : undefined;
    const sortIdsArr = sort && sort.length > 0 ? sort.map(i => parseInt(i, 10)) : [];
    const orderBy = columnKey ? { name: columnKey, by: order === 'descend' ? 'DESC' : 'ASC' } : {};
    this.setState(
      oldState => ({ filters, conditionQuery: { ...oldState.conditionQuery, orderBy, isEnable, sortIdsArr } }),
      () => this.request({ index, size })
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


  handleItems = (action, item) => {
    const { selectedItems } = this.state;
    const {
      articleManagement: { lang },
    } = this.props;
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
        this.setState({ formItem: item });
        this.toggleEditorialPanel();
        return;
      }
      this.request({ netUrl, items });
    };
    Modal.confirm({ title, content, okText, cancelText, onCancel, onOk });
  };

  handleOnSearch = val => this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, name: val.replace(/(^\s*)|(\s*$)/g, '') } }), () =>
    this.request({ index: 1 })
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
    } = this.state;

    const tagColumn = [
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
              onClick={() => this.handleItems(FORM, item)}
              style={{ color: '#8B3A3A' }}
            />
            <Button
              icon="delete"
              size="small"
              shape="circle"
              onClick={() => this.handleItems(DELETE, item)}
              style={{ color: 'red', marginLeft: '10px' }}
            />
            {item.isEnable === 1 && (
              <Button
                icon="lock"
                size="small"
                shape="circle"
                onClick={() => this.handleItems(LOCK, item)}
                style={{ color: '#A020F0', marginLeft: '10px' }}
              />
            )}
            {item.isEnable === 0 && (
              <Button
                icon="unlock"
                size="small"
                shape="circle"
                onClick={() => this.handleItems(UNLOCK, item)}
                style={{ color: 'green', marginLeft: '10px' }}
              />
            )}
          </Fragment>
        ),
      },
    ];

    return (
      <GridContent>
        <Card>
          <Row type="flex" align="middle" style={{ marginBottom: '15px' }}>
            <Col xs={12} sm={13} md={15} lg={16} xl={17}>
              <Button icon="plus" type="primary" size="small" onClick={this.toggleEditorialPanel}>
                新增&nbsp;
              </Button>
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
                        this.handleItems(DELETE)
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
                        this.handleItems(UNLOCK)
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
                        this.handleItems(LOCK)
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
            columns={tagColumn}
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
          />
          {editorialPanelVisible && (
            <EditorialForm
              editorialPanelVisible={editorialPanelVisible}
              toggleEditorialPanel={this.toggleEditorialPanel}
              cleanFormItem={this.cleanFormItem}
              formItem={formItem}
              request={this.request}
            />
          )}
        </Card>
      </GridContent>
    );
  }
}
export default TagManagement;
