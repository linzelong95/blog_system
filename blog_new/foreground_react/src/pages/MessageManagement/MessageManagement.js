import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
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
  Avatar,
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import EditorialForm from './EditorialForm';
import { timeFormat } from '@/utils/utils';
import { UrlEnum } from '@/assets/Enum';
import styles from './index.less';

const { AdminMessageAPI: { LIST, DELETE, APPROVE, DISAPPROVE, TOP, UNTOP, FORM } } = UrlEnum;

@connect(({ articleManagement, loading }) => ({
  articleManagement,
  loading: loading.models.articleManagement,
}))
class MessageManagement extends React.Component {
  state = {
    conditionQuery: { title: '', category: {}, orderBy: {} },
    showSorterFlag: false,
    selectedItems: [],
    allSelectedFlag: false,
    editorialPanelVisible: false,
    formItem: {},
    filterModalVisible: false,
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
    delete conditionQuery.commonFilterArr;
    const payload = { netUrl: LIST.url, conditionQuery, ...params };
    this.props.dispatch({ type: 'articleManagement/handleArticles', payload, callback });
    if (payload.netUrl !== LIST.url) this.cleanSelectedItem();
  }

  handleShowALL = () => {
    this.setState({ conditionQuery: {}, temporaryCondition: {} }, () => {
      this.request({ index: 1 });
      this.inputSearch.input.state.value = '';
    });
  }

  handlePageChange = (index, size) => this.request({ index, size });

  handleOnSearch = val =>
    this.setState(
      oldState => ({
        conditionQuery: { ...oldState.conditionQuery, message: val.replace(/(^\s*)|(\s*$)/g, '') },
      }),
      () => this.request({ index: 1 })
    );

  toggleEditorialPanel = () => {
    this.setState(oldState => ({ editorialPanelVisible: !oldState.editorialPanelVisible }));
  }

  cleanSelectedItem = () => this.setState({ selectedItems: [], allSelectedFlag: false });

  cleanFormItem = () => {
    this.cleanSelectedItem();
    this.setState({ formItem: {} });
  }

  handleItems = (action, item) => {
    const { selectedItems } = this.state;
    const {
      articleManagement: { lang },
    } = this.props;
    const { url: netUrl, desc, actionTip } = action;
    let content = '';
    let items = [];
    if (item) {
      const { id, message, parentId } = item;
      items = [{ id, name: message, parentId }];
      content = `【${items[0].name}】${actionTip[lang]}`;
    } else {
      items = selectedItems.map(v => ({ id: v.id, name: v.message, parentId: v.parentId }));
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
    const { articleManagement: { list = [] } } = this.props;
    if (!list.length) return;
    const { allSelectedFlag, selectedItems } = this.state;
    const uniqueSeletedItems = list.filter(i => !selectedItems.some(v => v.id === i.id));
    const newSelectedItems = allSelectedFlag
      ? selectedItems.filter(i => !list.some(v => v.id === i.id))
      : [...selectedItems, ...uniqueSeletedItems];
    this.setState({ allSelectedFlag: !allSelectedFlag, selectedItems: newSelectedItems });
  };

  toggleFilterModal = () => {
    this.setState(oldState => ({ filterModalVisible: !oldState.filterModalVisible }));
  }

  filterRequest = method => {
    if (method === 'clear') {
      this.setState({ temporaryCondition: {} });
      return;
    }
    this.toggleFilterModal();
    if (method === 'exit') {
      const { conditionQuery: { commonFilterArr = [] } } = this.state;
      this.setState({ temporaryCondition: { filterflag: commonFilterArr.length > 0 } });
      return;
    }
    const { temporaryCondition: { commonFilterArr = [] } } = this.state;
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
          isApproved,
          isTop,
          isRoot,
          commonFilterArr,
        },
        temporaryCondition: { ...oldState.temporaryCondition, filterflag: commonFilterArr.length > 0 },
      }),
      () => this.request({ index: 1 })
    );
  };


  commonFilterConditionSelect = commonFilterArr => {
    this.setState(oldState => ({
      temporaryCondition: { ...oldState.temporaryCondition, commonFilterArr },
    }));
  }

  render() {
    const {
      articleManagement: { total = 10, list = [], size = 10, index = 1 },
      loading,
    } = this.props;
    const {
      allSelectedFlag,
      selectedItems,
      editorialPanelVisible,
      formItem,
      showSorterFlag,
      filterModalVisible,
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
                onClick={this.toggleFilterModal}
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
                      <span style={{ color: 'green', fontWeight: 'bold' }}>
                        <i>{item.from ? item.from.nickName : `${item.fromMail} [游客]`}&nbsp;</i>
                      </span>
                      的留言
                      {item.parentId > 0 &&
                        <span>
                          (
                          回复&nbsp;
                          <i style={{ color: '#A0522D', fontWeight: 'bold' }}>{item.to ? item.to.nickName : `${item.toMail} [游客]`}</i>
                          &nbsp;
                          )
                        </span>
                      }
                      &nbsp;:&nbsp;
                      {item.parentId === 0 && <Tag color="cyan">父</Tag>}
                      {item.isTop === 1 && <Tag color="magenta">已置顶</Tag>}
                      {item.isApproved === 0 && <Tag color="orange">待审核</Tag>}
                    </span>
                  }
                  description={item.message}
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
                  { label: '父留言', value: 'isParent' },
                  { label: '子留言', value: 'isSon' },
                ]}
                value={temporaryCondition.commonFilterArr}
                onChange={this.commonFilterConditionSelect}
              />
            </div>
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
export default MessageManagement;
