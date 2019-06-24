import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Select,
  Modal,
  Card,
  Checkbox,
  Col,
  Row,
  Badge,
  Button,
  Tooltip,
  Input,
  Tag,
  Icon,
  List,
  Pagination,
  Tree,
  Avatar,
  Radio,
  Alert,
  Divider,
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import EditorialForm from './EditorialForm';
import { timeFormat } from '@/utils/utils';
import { UrlEnum } from '@/assets/Enum';
import styles from './index.less';

const {
  AdminReplyAPI: { LIST, DELETE, APPROVE, DISAPPROVE, TOP, UNTOP, FORM },
  AdminSortAPI,
  AdminArticleAPI,
} = UrlEnum;

const initArticleContainer = {
  netUrl: AdminArticleAPI.LIST.url,
  list: [],
  total: 0,
  index: 1,
  size: 6,
  query: '',
  selectedItems: [],
};

@connect(({ articleManagement, loading }) => ({
  articleManagement,
  loading: loading.models.articleManagement,
}))
class ReplyManagement extends React.Component {
  state = {
    conditionQuery: { title: '', category: {}, orderBy: {} },
    showSorterFlag: false,
    selectedItems: [],
    allSelectedFlag: false,
    editorialPanelVisible: false,
    formItem: {},
    filterModalVisible: false,
    categoryOptions: [],
    articlecontainer: initArticleContainer,
    filterSort: 'selectedByCate',
    temporaryCondition: {},
  };

  componentDidMount = () => this.request({ index: 1, size: 10 });

  componentWillUnmount = () => this.props.dispatch({ type: 'articleManagement/save', payload: { list: [] } });

  componentWillReceiveProps = nextProps => {
    const { selectedItems } = this.state;
    const {
      articleManagement: { list = [] },
    } = nextProps;
    const allSelectedFlag = !list.length
      ? false
      : list.every(listItem => selectedItems.some(i => i.id === listItem.id));
    this.setState({ allSelectedFlag });
  };

  request = (params, callback) => {
    const { conditionQuery: con } = this.state;
    const conditionQuery = { ...con };
    delete conditionQuery.filteredSortArr;
    delete conditionQuery.articleArr;
    delete conditionQuery.commonFilterArr;
    const payload = { netUrl: LIST.url, conditionQuery, ...params };
    this.props.dispatch({ type: 'articleManagement/handleArticles', payload, callback });
    if (payload.netUrl !== LIST.url) this.cleanSelectedItem();
  };

  handleShowALL = () =>
    this.setState({ conditionQuery: {}, temporaryCondition: {} }, () => {
      this.request({ index: 1 });
      this.inputSearch.input.state.value = '';
    });

  handlePageChange = (index, size) => this.request({ index, size });

  handleOnSearch = val =>
    this.setState(
      oldState => ({
        conditionQuery: { ...oldState.conditionQuery, reply: val.replace(/(^\s*)|(\s*$)/g, '') },
      }),
      () => this.request({ index: 1 })
    );

  toggleEditorialPanel = () =>
    this.setState(oldState => ({ editorialPanelVisible: !oldState.editorialPanelVisible }));

  cleanSelectedItem = () => this.setState({ selectedItems: [], allSelectedFlag: false });

  cleanFormItem = () => {
    this.cleanSelectedItem();
    this.setState({ formItem: {} });
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
      const { id, reply, parentId } = item;
      items = [{ id, name: reply, parentId }];
      content = `【${items[0].name}】${actionTip[lang]}`;
    } else {
      items = selectedItems.map(v => ({ id: v.id, name: v.reply, parentId: v.parentId }));
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
    const {
      articleManagement: { list = [] },
    } = this.props;
    if (!list.length) return;
    this.setState(oldState => ({ showSorterFlag: !oldState.showSorterFlag }));
  };

  sort = e => {
    if (e === 'default') {
      this.setState(
        oldState => ({ conditionQuery: { ...oldState.conditionQuery, orderBy: {} } }),
        () => this.request({ index: 1 })
      );
      this.toggleShowSorter();
      return;
    }
    const { id: name } = e.currentTarget;
    const {
      conditionQuery: { orderBy = {} },
    } = this.state;
    this.setState(
      oldState => ({
        conditionQuery: {
          ...oldState.conditionQuery,
          orderBy: { name, by: orderBy.by === 'ASC' ? 'DESC' : 'ASC' },
        },
      }),
      () => this.request({ index: 1 })
    );
  };

  toggleSelectOne = item => {
    const { selectedItems } = this.state;
    const {
      articleManagement: { list = [] },
    } = this.props;
    const newSelectedItems = selectedItems.some(i => i.id === item.id)
      ? selectedItems.filter(i => i.id !== item.id)
      : [...selectedItems, item];
    const allSelectedFlag = !list.length
      ? false
      : list.every(listItem => newSelectedItems.some(i => i.id === listItem.id));
    this.setState({ selectedItems: newSelectedItems, allSelectedFlag });
  };

  toggleSelectAll = () => {
    const {articleManagement: { list = [] }} = this.props;
    if (!list.length) return;
    const { allSelectedFlag,selectedItems } = this.state;
    const uniqueSeletedItems = list.filter(i => !selectedItems.some(v => v.id === i.id));
    const newSelectedItems = allSelectedFlag
      ? selectedItems.filter(i => !list.some(v => v.id === i.id))
      : [...selectedItems, ...uniqueSeletedItems];
    this.setState({ allSelectedFlag: !allSelectedFlag, selectedItems: newSelectedItems });
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
      const {conditionQuery: { filteredSortArr = [], articleArr = [], commonFilterArr = [] }} = this.state;
      filterflag = filteredSortArr.length || articleArr.length || commonFilterArr.length;
      this.setState({
        temporaryCondition: { filteredSortArr, articleArr, commonFilterArr, filterflag },
      });
      return;
    }
    const {temporaryCondition: { filteredSortArr = [], articleArr = [], commonFilterArr = [] }} = this.state;
    filterflag = filteredSortArr.length || articleArr.length || commonFilterArr.length;
    const category = { sortIdsArr: [], cateIdsArr: [] };
    filteredSortArr.forEach(item => {
      const arr = item.split('-');
      if (arr.length === 1) {
        category.sortIdsArr.push(parseInt(arr.pop(), 10));
      } else if (!category.sortIdsArr.includes(parseInt(arr[0], 10))) {
        category.cateIdsArr.push(parseInt(arr.pop(), 10));
      }
    });
    const articleIdsArr = articleArr.map(i => i.key);
    const isApproved = commonFilterArr.includes('isApproved') ? 0 : undefined;
    const isTop = commonFilterArr.includes('isTop') ? 1 : undefined;
    const isRoot = (() => {
      if (commonFilterArr.includes('isParent') && !commonFilterArr.includes('isSon')) return 1;
      if (!commonFilterArr.includes('isParent') && commonFilterArr.includes('isSon')) return 0;
      return undefined;
    })();
    this.setState(
      oldState => ({
        conditionQuery: {
          ...oldState.conditionQuery,
          category,
          articleIdsArr,
          isApproved,
          isTop,
          isRoot,
          filteredSortArr,
          articleArr,
          commonFilterArr,
        },
        temporaryCondition: { ...oldState.temporaryCondition, filterflag },
      }),
      () => this.request({ index: 1 })
    );
  };

  conditionTreeSelect = filteredSortArr =>
    this.setState(oldState => ({
      temporaryCondition: { ...oldState.temporaryCondition, filteredSortArr },
    }));

  commonFilterConditionSelect = commonFilterArr =>
    this.setState(oldState => ({
      temporaryCondition: { ...oldState.temporaryCondition, commonFilterArr },
    }));

  articleSelet = articleArr =>
    this.setState(oldState => ({
      temporaryCondition: { ...oldState.temporaryCondition, articleArr },
    }));

  filterSort = e => this.setState({ filterSort: e.target.value });

  searchItem = ({ query, container, pageIndex, pageSize }) => {
    const { index: preIndex, size: preSize, netUrl } = container;
    const index = pageIndex || preIndex;
    const size = pageSize || preSize;
    this.request({ netUrl, index, size, conditionQuery: { title: query } }, res =>
      this.setState(oldState => ({
        articlecontainer: { ...oldState.articlecontainer, ...res, index, size, query },
      }))
    );
  };

  render() {
    const {
      articleManagement: { total = 10, list = [], size = 10, index = 1 },
      loading,
    } = this.props;
    const {
      filterSort,
      articlecontainer,
      allSelectedFlag,
      selectedItems,
      editorialPanelVisible,
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
                  <Tag
                    color="magenta"
                    id="createDate"
                    style={{ marginLeft: '5px' }}
                    onClick={this.sort}
                  >
                    时间
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
                    id="isApproved"
                    style={{ marginLeft: '5px' }}
                    onClick={this.sort}
                  >
                    显示
                    <Icon
                      type={
                        conditionQuery.orderBy &&
                          conditionQuery.orderBy.name === 'isApproved' &&
                          conditionQuery.orderBy.by === 'DESC'
                          ? 'down'
                          : 'up'
                      }
                    />
                  </Tag>
                  <Tag
                    color="magenta"
                    id="isTop"
                    style={{ marginLeft: '5px' }}
                    onClick={this.sort}
                  >
                    置顶
                    <Icon
                      type={
                        conditionQuery.orderBy &&
                          conditionQuery.orderBy.name === 'isTop' &&
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
                  <Tooltip title="一键隐藏">
                    <Button
                      icon="eye-invisible"
                      size="small"
                      shape="circle"
                      onClick={() => this.handleItems(DISAPPROVE)}
                      style={{ color: 'green', marginLeft: '10px' }}
                    />
                  </Tooltip>
                  <Tooltip title="一键展示">
                    <Button
                      icon="eye"
                      size="small"
                      shape="circle"
                      onClick={() => this.handleItems(APPROVE)}
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
                placeholder="请输入回复内容"
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
            dataSource={list}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: this.handlePageChange,
              onShowSizeChange: this.handlePageChange,
              pageSizeOptions: ["10", "20", "30", "40"],
              pageSize: size,
              defaultPageSize: 10,
              total,
              current: index,
            }}
            renderItem={item => (
              <List.Item
                style={{ background: selectedItems.map(i => i.id).includes(item.id) && '#FFFFE0' }}
                className={styles.eachChild}
                key={item.id}
                actions={[
                  <span>{timeFormat(Number(new Date(item.createDate)))}</span>,
                  <Button size="small" type="danger" onClick={() => this.handleItems(DELETE, item)}>删除</Button>,
                  <Button size="small" type="primary" onClick={() => this.handleItems(FORM, item)}>回复</Button>,
                  <Button size="small" type="primary" onClick={() => this.handleItems(item.isApproved ? DISAPPROVE : APPROVE, item)}>{item.isApproved ? '隐藏' : '过审'}</Button>,
                  <Button size="small" type="primary" onClick={() => this.handleItems(item.isTop ? UNTOP : TOP, item)}>{item.isTop ? '取置' : '置顶'}</Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Fragment>
                      <Checkbox
                        checked={
                          allSelectedFlag ? true : selectedItems.map(i => i.id).includes(item.id)
                        }
                        onChange={() => this.toggleSelectOne(item)}
                        style={{ marginLeft: '20px', marginTop: '10px' }}
                      />
                      <Badge>&nbsp;&nbsp;</Badge>
                      <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" />
                    </Fragment>
                  }
                  title={
                    <span>
                      《{item.article.title}》{item.parentId === 0 && <Tag color="cyan">父</Tag>}
                      {item.isTop === 1 && <Tag color="magenta">已置顶</Tag>}
                      {item.isApproved === 0 && <Tag color="orange">待审核</Tag>}
                    </span>
                  }
                  description={
                    <span>
                      <span style={{ color: 'green', fontWeight: 'bold' }}>
                        <i>{item.from.nickName}&nbsp;</i>
                      </span>
                      回复&nbsp;
                      <span style={{ color: '#A0522D', fontWeight: 'bold' }}>
                        <i>{item.parentId === 0 ? '该文' : item.to.nickName}&nbsp;</i>:
                      </span>
                      &nbsp;<b style={{ color: "black" }}>{`“${item.reply}”`}</b>
                    </span>
                  }
                />
              </List.Item>
            )}
          />
          <Modal
            destroyOnClose
            visible={filterModalVisible}
            title="请选择筛选条件"
            onCancel={() => this.filterRequest('exit')}
            footer={[
              <Button onClick={() => this.filterRequest('exit')}>不更改并退出</Button>,
              <Button type="danger" onClick={() => this.filterRequest('clear')}>
                全部清空
              </Button>,
              <Button type="primary" onClick={this.filterRequest}>
                确定
              </Button>,
            ]}
          >
            <div style={{ textAlign: 'center' }}>
              <Checkbox.Group
                options={[
                  { label: '置顶', value: 'isTop' },
                  { label: '待审', value: 'isApproved' },
                  { label: '父评论', value: 'isParent' },
                  { label: '子评论', value: 'isSon' },
                ]}
                value={temporaryCondition.commonFilterArr}
                onChange={this.commonFilterConditionSelect}
              />
            </div>
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <Radio.Group
                size="small"
                value={filterSort}
                buttonStyle="solid"
                onChange={this.filterSort}
              >
                <Radio.Button value="selectedByCate">
                  <Badge
                    dot={
                      temporaryCondition.filteredSortArr &&
                      temporaryCondition.filteredSortArr.length > 0
                    }
                  >
                    &nbsp;按分类&nbsp;&nbsp;
                  </Badge>
                </Radio.Button>
                <Radio.Button value="selectedByArticle">
                  <Badge
                    dot={temporaryCondition.articleArr && temporaryCondition.articleArr.length > 0}
                  >
                    &nbsp;按文章&nbsp;&nbsp;
                  </Badge>
                </Radio.Button>
              </Radio.Group>
            </div>
            <Alert
              message="筛选分两种类别，请注意您是否需要同时进行两种类别的筛选！"
              type="warning"
              showIcon
              style={{ margin: '15px 0px' }}
            />
            {filterSort === 'selectedByCate' && (
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
            )}
            {filterSort === 'selectedByArticle' && (
              <div style={{ textAlign: 'center' }}>
                <span>文章：</span>
                <Select
                  labelInValue
                  showSearch
                  mode="multiple"
                  filterOption={false}
                  onChange={this.articleSelet}
                  onSearch={query => this.searchItem({ query, container: articlecontainer })}
                  onMouseEnter={() => this.searchItem({ query: '', container: articlecontainer })}
                  style={{ width: '70%' }}
                  value={temporaryCondition.articleArr}
                >
                  {articlecontainer.list.map(i => (
                    <Select.Option value={i.id} key={i.id}>
                      {i.title}
                    </Select.Option>
                  ))}
                  {articlecontainer.total > 6 && (
                    <Select.Option key={-1} disabled>
                      <Pagination
                        {...{
                          size: 'small',
                          style: { textAlign: 'center' },
                          ...{
                            total: articlecontainer.total,
                            current: articlecontainer.index,
                            pageSize: articlecontainer.size,
                            defaultPageSize: 6,
                            onChange: (i, s) =>
                              this.searchItem({
                                query: articlecontainer.query,
                                container: articlecontainer,
                                pageIndex: i,
                                pageSize: s,
                              }),
                          },
                        }}
                      />
                    </Select.Option>
                  )}
                </Select>
              </div>
            )}
          </Modal>
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
export default ReplyManagement;
