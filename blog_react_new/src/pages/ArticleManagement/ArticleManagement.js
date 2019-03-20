import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Card, Col, Row, Badge, Button, Tooltip, Input, Tag, Icon, List, Tree } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Ellipsis from '@/components/Ellipsis';
import EditorialForm from './EditorialForm';
import ShowArticle from './ShowArticle';
import { timeFormat } from '@/utils/utils';
import { UrlEnum } from '@/assets/Enum';
import styles from './index.less';

const { AdminArticleAPI: { LIST, DELETE, FORM, TOP, UNTOP, LOCK, UNLOCK, CONTENT }, AdminSortAPI } = UrlEnum;

@connect(({ articleManagement, loading }) => ({
  articleManagement,
  loading: loading.models.articleManagement,
}))
class ArticleManagement extends React.Component {
  state = {
    conditionQuery: { title: '', category: {}, orderBy: {} },
    showSorterFlag: false, // 是否显示排序按钮
    selectedItems: [],
    allSelectedFlag: false,
    editorialPanelVisible: false,
    formItem: {},
    drawerVisible: false,
    filterModalVisible: false,
    temporaryCondition: {},
    categoryOptions: [],
  };

  componentDidMount = () => this.request({ index: 1, size: 6 });

  componentWillUnmount = () => this.props.dispatch({ type: 'articleManagement/save', payload: { list: [] } });

  componentWillReceiveProps = nextProps => {
    const { selectedItems } = this.state;
    const { articleManagement: { list = [] } } = nextProps;
    const allSelectedFlag = !list.length ? false : list.every(listItem => selectedItems.some(i => i.id === listItem.id));
    this.setState({ allSelectedFlag });
  };

  request = (params, callback) => {
    const { conditionQuery: con } = this.state;
    const conditionQuery = { ...con };
    delete conditionQuery.filteredSortArr;
    const payload = { netUrl: LIST.url, conditionQuery, ...params };
    this.props.dispatch({ type: 'articleManagement/handleArticles', payload, callback });
    if (payload.netUrl !== LIST.url) this.cleanSelectedItem();
  };

  handleShowALL = () => this.setState({ conditionQuery: {}, temporaryCondition: {} }, () => {
    this.request({ index: 1 });
    this.inputSearch.input.state.value = '';
  });

  handlePageChange = (index, size) => this.request({ index, size });

  handleOnSearch = val => this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, title: val.replace(/(^\s*)|(\s*$)/g, '') } }), () =>
    this.request({ index: 1 })
  );

  toggleEditorialPanel = () => this.setState(oldState => ({ editorialPanelVisible: !oldState.editorialPanelVisible }));

  cleanSelectedItem = () => this.setState({ selectedItems: [], allSelectedFlag: false });

  cleanFormItem = () => {
    this.cleanSelectedItem();
    this.setState({ formItem: {} });
  };

  handleItems = (action, item) => {
    const { selectedItems } = this.state;
    const { articleManagement: { lang } } = this.props;
    const { url: netUrl, desc, actionTip } = action;
    let content = '';
    let items = [];
    if (item) {
      const { id, name, title } = item;
      items = [{ id, name }];
      if (netUrl.includes('/article')) items = [{ id, name: title }];
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

  toggleShowSorter = () => {
    const { articleManagement: { list = [] } } = this.props;
    if (!list.length) return;
    this.setState(oldState => ({ showSorterFlag: !oldState.showSorterFlag }));
  };

  sort = e => {
    if (e === 'default') {
      this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, orderBy: {} } }), () =>
        this.request({ index: 1 })
      );
      this.toggleShowSorter();
      return;
    }
    const { id: name } = e.currentTarget;
    const { conditionQuery: { orderBy = {} } } = this.state;
    this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, orderBy: { name, by: orderBy.by === 'ASC' ? 'DESC' : 'ASC' } } }), () =>
      this.request({ index: 1 })
    );
  };

  toggleSelectOne = item => {
    const { selectedItems } = this.state;
    const { articleManagement: { list = [] } } = this.props;
    const newSelectedItems = selectedItems.some(i => i.id === item.id)
      ? selectedItems.filter(i => i.id !== item.id)
      : [...selectedItems, item];
    const allSelectedFlag = !list.length
      ? false
      : list.every(listItem => newSelectedItems.some(i => i.id === listItem.id));
    this.setState({ selectedItems: newSelectedItems, allSelectedFlag });
  };

  toggleSelectAll = () => {
    const {
      articleManagement: { list = [] },
    } = this.props;
    if (!list.length) return;
    const { allSelectedFlag } = this.state;
    const { selectedItems } = this.state;
    const uniqueSeletedItems = list.filter(i => !selectedItems.some(v => v.id === i.id));
    const newSelectedItems = allSelectedFlag
      ? selectedItems.filter(i => !list.some(v => v.id === i.id))
      : [...selectedItems, ...uniqueSeletedItems];
    this.setState({ allSelectedFlag: !allSelectedFlag, selectedItems: newSelectedItems });
  };

  readArticle = item => this.request({ netUrl: CONTENT.url, id: item.id }, (res) => {
    const formItem = item;
    formItem.content = res.list[0].content;
    this.setState({ formItem, drawerVisible: true });
  });

  onCloseDrawer = () => {
    this.cleanSelectedItem();
    this.setState({ formItem: {}, drawerVisible: false });
  };

  toggleFilterModal = () =>
    this.setState(oldState => ({ filterModalVisible: !oldState.filterModalVisible }));

  showFilterModal = () => {
    this.request({ netUrl: AdminSortAPI.LIST.url, index: 1, size: 999 }, (res) =>
      this.setState({ categoryOptions: res.list.filter(i => i.categories && i.categories.length > 0) })
    );
    this.toggleFilterModal();
  };

  filterRequest = method => {
    if (method === 'clear') {
      this.setState({ temporaryCondition: {} });
      return;
    }
    this.toggleFilterModal();
    let filterflag = false;
    if (method === 'exit') {
      const { conditionQuery: { filteredSortArr = [] } } = this.state;
      filterflag = filteredSortArr.length > 0;
      this.setState(oldState => ({ temporaryCondition: { ...oldState.temporaryCondition, filteredSortArr, filterflag } }));
      return;
    }
    const { temporaryCondition: { filteredSortArr = [] } } = this.state;
    filterflag = filteredSortArr.length > 0;
    const category = { sortIdsArr: [], cateIdsArr: [] };
    filteredSortArr.forEach(item => {
      const arr = item.split('-');
      if (arr.length === 1) {
        category.sortIdsArr.push(parseInt(arr.pop(), 10));
      } else if (!category.sortIdsArr.includes(parseInt(arr[0], 10))) {
        category.cateIdsArr.push(parseInt(arr.pop(), 10));
      }
    });
    this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, category, filteredSortArr }, temporaryCondition: { ...oldState.temporaryCondition, filterflag } }), () =>
      this.request({ index: 1 })
    );
  };

  conditionTreeSelect = filteredSortArr => this.setState(oldState => ({ temporaryCondition: { ...oldState.temporaryCondition, filteredSortArr } }));

  render() {
    const { articleManagement: { total = 6, list = [], size = 6, index = 1 }, loading } = this.props;
    const {
      allSelectedFlag,
      selectedItems,
      editorialPanelVisible,
      drawerVisible,
      formItem,
      showSorterFlag,
      filterModalVisible,
      categoryOptions,
      conditionQuery,
      temporaryCondition,
    } = this.state;
    return (
      <GridContent>
        <Card>
          <Row type="flex" align="middle" style={{ marginBottom: '15px' }}>
            <Col xs={12} sm={13} md={15} lg={16} xl={17}>
              <Button icon="plus" type="primary" size="small" onClick={this.toggleEditorialPanel}>
                新增&nbsp;
              </Button>
              <Button
                icon="filter"
                type={temporaryCondition.filterflag ? 'danger' : 'primary'}
                size="small"
                onClick={this.showFilterModal}
                style={{ marginLeft: '20px' }}
              >
                筛选&nbsp;
              </Button>
              <Button
                icon="star"
                type={allSelectedFlag ? 'danger' : 'primary'}
                size="small"
                onClick={this.toggleSelectAll}
                style={{ marginLeft: '20px' }}
              >
                {allSelectedFlag ? '反选' : '全选'}
                &nbsp;
              </Button>
              <Button
                icon={showSorterFlag ? 'right-circle-o' : 'left-circle-o'}
                type="primary"
                size="small"
                onClick={this.toggleShowSorter}
                style={{ marginLeft: '20px' }}
              >
                排序&nbsp;
              </Button>
              {showSorterFlag && (
                <Fragment>
                  <Tag
                    color="magenta"
                    style={{ marginLeft: '10px' }}
                    onClick={() => this.sort('default')}
                  >
                    默认
                  </Tag>
                  <Tag color="magenta" id="title" style={{ marginLeft: '5px' }} onClick={this.sort}>
                    标题
                    <Icon
                      type={
                        conditionQuery.orderBy &&
                          conditionQuery.orderBy.name === 'title' &&
                          conditionQuery.orderBy.by === 'DESC'
                          ? 'down'
                          : 'up'
                      }
                    />
                  </Tag>
                  <Tag
                    color="magenta"
                    id="createDate"
                    style={{ marginLeft: '5px' }}
                    onClick={this.sort}
                  >
                    创建时间
                    <Icon
                      type={
                        conditionQuery.orderBy &&
                          conditionQuery.orderBy.name === 'createDate' &&
                          conditionQuery.orderBy.by === 'DESC'
                          ? 'down'
                          : 'up'
                      }
                    />
                  </Tag>
                  <Tag
                    color="magenta"
                    id="updateDate"
                    style={{ marginLeft: '5px' }}
                    onClick={this.sort}
                  >
                    修改时间
                    <Icon
                      type={
                        conditionQuery.orderBy &&
                          conditionQuery.orderBy.name === 'updateDate' &&
                          conditionQuery.orderBy.by === 'DESC'
                          ? 'down'
                          : 'up'
                      }
                    />
                  </Tag>
                </Fragment>
              )}
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
                      onClick={() => this.handleItems(DELETE)}
                      style={{ color: 'red', marginLeft: '20px' }}
                    />
                  </Tooltip>
                  <Tooltip title="一键置顶">
                    <Button
                      icon="arrow-up"
                      size="small"
                      shape="circle"
                      onClick={() => this.handleItems(TOP)}
                      style={{ color: 'green', marginLeft: '10px' }}
                    />
                  </Tooltip>
                  <Tooltip title="一键取置">
                    <Button
                      icon="arrow-down"
                      size="small"
                      shape="circle"
                      onClick={() => this.handleItems(UNTOP)}
                      style={{ color: '#A020F0', marginLeft: '10px' }}
                    />
                  </Tooltip>
                  <Tooltip title="一键解锁">
                    <Button
                      icon="unlock"
                      size="small"
                      shape="circle"
                      onClick={() => this.handleItems(UNLOCK)}
                      style={{ color: 'green', marginLeft: '10px' }}
                    />
                  </Tooltip>
                  <Tooltip title="一键锁定">
                    <Button
                      icon="lock"
                      size="small"
                      shape="circle"
                      onClick={() => this.handleItems(LOCK)}
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
                placeholder="请输入标题"
                onSearch={this.handleOnSearch}
                enterButton
                allowClear
                ref={inputSearch => {
                  this.inputSearch = inputSearch;
                }}
              />
            </Col>
          </Row>
          <List
            loading={loading}
            grid={{ gutter: 16, sm: 2, md: 3, xl: 3, xxl: 3 }}
            dataSource={list}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: this.handlePageChange,
              onShowSizeChange: this.handlePageChange,
              pageSizeOptions: ['6', '12', '18', '24',],
              pageSize: size,
              defaultPageSize: 6,
              total,
              current: index,
            }}
            renderItem={item => (
              <List.Item>
                <Card
                  title={
                    <Tooltip title={item.title}>
                      <span>{item.title}</span>
                    </Tooltip>
                  }
                  extra={
                    <Tag color="purple">
                      <Icon type="tag" />
                      &nbsp;
                      {item.category.sort.name},{item.category.name}
                    </Tag>
                  }
                  actions={[
                    <Icon
                      type="form"
                      style={{ color: 'green', width: '60px' }}
                      onClick={() => this.handleItems(FORM, item)}
                    />,
                    <Icon
                      type="delete"
                      style={{ color: 'red', width: '60px' }}
                      onClick={() => this.handleItems(DELETE, item)}
                    />,
                    item.is_top === 0 ? (
                      <Icon
                        type="arrow-up"
                        style={{ color: '#4169E1', width: '60px' }}
                        onClick={() => this.handleItems(TOP, item)}
                      />
                    ) : (
                        <Icon
                          type="arrow-down"
                          style={{ color: 'black', width: '60px' }}
                          onClick={() => this.handleItems(UNTOP, item)}
                        />
                      ),
                    item.isEnable === 1 ? (
                      <Icon
                        type="lock"
                        style={{ color: '#4169E1', width: '60px' }}
                        onClick={() => this.handleItems(LOCK, item)}
                      />
                    ) : (
                        <Icon
                          type="unlock"
                          style={{ color: 'black', width: '60px' }}
                          onClick={() => this.handleItems(UNLOCK, item)}
                        />
                      ),
                    <Icon
                      type="eye"
                      style={{ color: '#A52A2A', width: '60px' }}
                      onClick={() => this.readArticle(item)}
                    />,
                  ]}
                  className={styles.eachChild}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    background: selectedItems.some(i => i.id === item.id) && '#FFFFE0',
                  }}
                  onClick={() => this.toggleSelectOne(item)}
                >
                  <div style={{ marginBottom: '5px', fontSize: '12px' }}>
                    <Ellipsis lines={1}>
                      标签：{item.tags && item.tags.length > 0 ? item.tags.map(i => <Tag color="volcano">{i.name}</Tag>) : <Tag color="volcano">无</Tag>}
                    </Ellipsis>
                  </div>
                  <Ellipsis lines={2} style={{ height: '40px' }}>
                    摘要：
                    {item.abstract ? item.abstract : '无'}
                  </Ellipsis>
                  <div style={{ marginTop: '5px', fontSize: '12px' }}>
                    <div style={{ float: 'left' }}>
                      <Icon type="clock-circle" />
                      &nbsp;
                      {timeFormat(Number(new Date(item.createDate)))}
                    </div>
                    <div style={{ float: 'right' }}>
                      <Icon type="edit" />
                      &nbsp;
                      {timeFormat(Number(new Date(item.updateDate)))}
                    </div>
                  </div>
                  {item.is_top === 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        background: 'gray',
                        top: '5px',
                        right: '-55px',
                        width: '150px',
                        textAlign: 'center',
                        overflow: 'hidden',
                        transform: 'rotate(40deg)',
                      }}
                    >
                      <span style={{ color: 'yellow' }}>置顶</span>
                    </div>
                  )}
                </Card>
              </List.Item>
            )}
          />
          <Modal
            visible={filterModalVisible}
            title="请选择筛选条件"
            onCancel={() => this.filterRequest('exit')}
            footer={[
              <Button onClick={() => this.filterRequest('exit')}>不更改并退出</Button>,
              <Button type="danger" onClick={() => this.filterRequest('clear')}>
                清空
              </Button>,
              <Button type="primary" onClick={this.filterRequest}>
                确定
              </Button>,
            ]}
          >
            <Tree
              checkable
              showLine
              onCheck={this.conditionTreeSelect}
              defaultExpandedKeys={temporaryCondition.filteredSortArr || []}
              checkedKeys={temporaryCondition.filteredSortArr || []}
            >
              {categoryOptions.map(item => (
                <Tree.TreeNode
                  title={item.name}
                  key={`${item.id}`}
                  selectable={false}
                  disabled={item.isEnable === 0}
                >
                  {item.categories.map(i => (
                    <Tree.TreeNode
                      title={i.name}
                      key={`${item.id}-${i.id}`}
                      selectable={false}
                      disabled={item.isEnable === 1 ? i.isEnable === 0 : true}
                    />
                  ))}
                </Tree.TreeNode>
              ))}
            </Tree>
          </Modal>
          {drawerVisible && (
            <ShowArticle
              loading={loading}
              visible={drawerVisible}
              item={formItem}
              onClose={this.onCloseDrawer}
              request={this.request}
            />
          )}
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
export default ArticleManagement;
