import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Card, Col, Row, Button, Radio, Alert, Badge, Tooltip, Input, Tag, Icon, List, Tree, Avatar, Divider } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import CourseDrawer from '@/components/CustomCourse';
import MessageDrawer from '@/components/CustomMessage';
import Ellipsis from '@/components/Ellipsis';
import { imgPrefix } from '@/defaultSettings';
import { timeFormat, getRandomColor } from '@/utils/utils';
import { UrlEnum } from '@/assets/Enum';

const { UserArticleAPI: { LIST }, UserSortAPI, UserTagAPI } = UrlEnum;

@connect(({ articleManagement, loading }) => ({
  articleManagement,
  loading: loading.models.articleManagement,
}))
class HomePage extends React.Component {
  state = {
    conditionQuery: { title: '', category: {}, orderBy: {} },
    showSorterFlag: false,
    filterModalVisible: false,
    categoryOptions: [],
    tagOptions: [],
    temporaryCondition: {},
    filterSort: 'selectedByCate',
    courseDrawerVisible: false,
    messageDrawerVisible: false
  };

  componentDidMount = () => {
    this.request({ index: 1, size: 6 });
    this.request({ netUrl: UserTagAPI.LIST.url, conditionQuery: { isEnable: 1 }, index: 1, size: 999 }, (res) => this.setState({ tagOptions: res.list }));
    this.request({ netUrl: UserSortAPI.LIST.url, conditionQuery: { isEnable: 1 }, index: 1, size: 999 }, (res) =>
      this.setState({ categoryOptions: res.list.filter(i => i.categories && i.categories.length > 0) })
    );
  }

  componentWillUnmount = () => this.props.dispatch({ type: 'articleManagement/save', payload: { list: [] } });

  request = (params, callback, needExtraParamFlag = true) => {
    const { conditionQuery: con } = this.state;
    const conditionQuery = { ...con };
    delete conditionQuery.filteredSortArr;
    const payload = needExtraParamFlag ? { netUrl: LIST.url, conditionQuery, ...params } : params;
    this.props.dispatch({ type: 'articleManagement/handleArticles', payload, callback });
  };

  handleShowALL = () => this.setState({ conditionQuery: {}, temporaryCondition: {} }, () => {
    this.request({ index: 1 });
    this.inputSearch.input.state.value = '';
  })

  handlePageChange = (index, size) => this.request({ index, size });

  handleOnSearch = val => this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, title: val.replace(/(^\s*)|(\s*$)/g, '') } }), () =>
    this.request({ index: 1 })
  )

  toggleShowSorter = () => {
    const { articleManagement: { list = [] } } = this.props;
    if (!list.length) return;
    this.setState(oldState => ({ showSorterFlag: !oldState.showSorterFlag }));
  }

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
  }

  toggleFilterModal = () =>
    this.setState(oldState => ({ filterModalVisible: !oldState.filterModalVisible }));

  filterRequest = method => {
    if (method === 'clear') {
      this.setState({ temporaryCondition: {} });
      return;
    }
    if (method !== "noModal") this.toggleFilterModal();
    let filterflag = false;
    if (method === 'exit') {
      const { conditionQuery: { filteredSortArr = [], tagIdsArr = [] }, } = this.state;
      filterflag = filteredSortArr.length > 0 || tagIdsArr.length > 0;
      this.setState(oldState => ({ temporaryCondition: { ...oldState.temporaryCondition, filteredSortArr, tagIdsArr, filterflag } }));
      return;
    }
    const { temporaryCondition: { filteredSortArr = [], tagIdsArr = [] } } = this.state;
    filterflag = filteredSortArr.length > 0 || tagIdsArr.length > 0;
    const category = { sortIdsArr: [], cateIdsArr: [] };
    filteredSortArr.forEach(item => {
      const arr = item.split('-');
      if (arr.length === 1) {
        category.sortIdsArr.push(parseInt(arr.pop(), 10));
      } else if (!category.sortIdsArr.includes(parseInt(arr[0], 10))) {
        category.cateIdsArr.push(parseInt(arr.pop(), 10));
      }
    });
    this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, category, filteredSortArr, tagIdsArr }, temporaryCondition: { ...oldState.temporaryCondition, filterflag } }), () =>
      this.request({ index: 1 })
    );
  };

  conditionTreeSelect = filteredSortArr => this.setState(oldState => ({ temporaryCondition: { ...oldState.temporaryCondition, filteredSortArr } }));

  handleTagSelect = (id, checked) => {
    const { temporaryCondition: { tagIdsArr = [] } } = this.state;
    const newTagIds = checked ? [...tagIdsArr, id] : tagIdsArr.filter(i => i !== id);
    this.setState(oldState => ({
      temporaryCondition: { ...oldState.temporaryCondition, tagIdsArr: newTagIds },
    }));
  }

  filterSort = e => this.setState({ filterSort: e.target.value });

  toggleCourseDrawer = () => {
    const { courseDrawerVisible } = this.state;
    this.setState({ courseDrawerVisible: !courseDrawerVisible });
  }

  toggleMessageDrawer = () => {
    const { messageDrawerVisible } = this.state;
    this.setState({ messageDrawerVisible: !messageDrawerVisible });
  }

  render() {
    const {
      articleManagement: { total = 6, list = [], size = 6, index = 1 },
      loading,
    } = this.props;
    const {
      filterSort,
      showSorterFlag,
      filterModalVisible,
      categoryOptions,
      tagOptions,
      conditionQuery,
      temporaryCondition,
      courseDrawerVisible,
      messageDrawerVisible
    } = this.state;
    return (
      <GridContent>
        <Card style={{ position: 'relative' }}>
          <div
            onClick={this.toggleCourseDrawer}
            style={{
              position: 'fixed',
              right: '0px',
              top: '300px',
              height: '50px',
              width: '75px',
              background: '#1890FF',
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              cursor: "pointer",
              borderRadius: "5px 0px 0px 5px"
            }}
          >
            <Icon type="ordered-list" style={{ fontWeight: 'bold', fontSize: '20px' }} />
            <b style={{ fontSize: 18, marginLeft: 5 }}>归档</b>
          </div>
          <div
            onClick={this.toggleMessageDrawer}
            style={{
              position: 'fixed',
              right: '0px',
              top: '370px',
              height: '50px',
              width: '75px',
              background: '#1890FF',
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              cursor: "pointer",
              borderRadius: "5px 0px 0px 5px"
            }}
          >
            <Icon type="form" style={{ fontWeight: 'bold', fontSize: '20px' }} />
            <b style={{ fontSize: 18, marginLeft: 5 }}>留言</b>
          </div>
          <Row type="flex" align="middle" style={{ marginBottom: '15px' }}>
            <Col xs={12} sm={13} md={15} lg={16} xl={17}>
              <Button
                icon="filter"
                type={temporaryCondition.filterflag ? 'danger' : 'primary'}
                size="small"
                onClick={this.toggleFilterModal}
              >
                筛选&nbsp;
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
          <Row gutter={16}>
            <Col span={17}>
              <List
                loading={loading}
                itemLayout="vertical"
                dataSource={list}
                pagination={{
                  showQuickJumper: true,
                  showSizeChanger: true,
                  onChange: this.handlePageChange,
                  onShowSizeChange: this.handlePageChange,
                  pageSizeOptions: ['6', '12', '18', '24'],
                  pageSize: size,
                  defaultPageSize: 6,
                  total,
                  current: index,
                }}
                renderItem={item => (
                  <List.Item
                    key={item.id}
                    actions={[
                      <span><Icon type="edit" />&nbsp;{timeFormat(Number(new Date(item.createDate)))}</span>,
                      <Icon type="star-o" />,
                      <Icon type="like-o" />,
                      <Icon type="message" />,
                      <span>{item.tags.map(i => (<Tag color="volcano" key={i.id}>{i.name}</Tag>))}</span>,
                    ]}
                    extra={
                      <img
                        width={200}
                        height={110}
                        alt="logo"
                        src={
                          item.imageUrl
                            ? `${imgPrefix}${item.imageUrl}`
                            : 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'
                        }
                      />
                    }
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
                    {item.isTop === 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          background: 'gray',
                          top: '5px',
                          right: '-55px',
                          width: '150px',
                          textAlign: 'center',
                          transform: 'rotate(40deg)',
                          color: 'yellow'
                        }}
                      >
                        置顶
                      </div>
                    )}
                    <List.Item.Meta
                      avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                      title={
                        <a
                          href={`${window.location.origin}/article/${item.id}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {item.title}
                          &nbsp;&nbsp;
                          <Tag color="purple">
                            <Icon type="tag" />
                            {item.category.sort.name},{item.category.name}
                          </Tag>
                        </a>
                      }
                      style={{ marginBottom: "0px" }}
                    />
                    <Ellipsis lines={2} style={{ height: '40px' }}>
                      <span style={{ paddingLeft: '30px', fontWeight: 'bold' }}>摘要：</span>
                      {item.abstract ? item.abstract : '无'}
                    </Ellipsis>
                  </List.Item>
                )}
              />
            </Col>
            <Col span={7}>
              <div style={{ textAlign: "center" }}>
                <p><Avatar size={200} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /></p>
                <span style={{ fontSize: "25px", fontWeight: "bold", margin: "10px" }}>博客</span>
                <Divider style={{ margin: "5px 0px" }}>
                  <span>
                    <a><Icon type="github" /></a>&nbsp;&nbsp;
                    <a><Icon type="cloud" /></a>
                  </span>
                </Divider>
                <span>这个人很懒，什么都没留下</span>
              </div>
              <div>
                <Divider style={{ margin: "25px 0px 10px 0px" }}><Icon type="tags" style={{ color: "purple" }} /></Divider>
                {
                  tagOptions.map(i => (
                    <Tag
                      onClick={() => {
                        this.setState(oldState => ({
                          temporaryCondition: { ...oldState.temporaryCondition, tagIdsArr: [i.id] },
                        }), () => this.filterRequest("noModal"))
                      }}
                      color={getRandomColor()}
                      style={{ fontSize: "13px", margin: "3px" }}
                      key={i.id}
                    >
                      {i.name}
                    </Tag>
                  ))
                }
              </div>
              <div>
                <Divider style={{ margin: "25px 0px 10px 0px" }}><Icon type="clock-circle" style={{ color: "blue" }} /></Divider>
                <Tree
                  checkable
                  showLine
                  onCheck={(filteredSortArr) => {
                    this.setState(oldState => ({
                      temporaryCondition: { ...oldState.temporaryCondition, filteredSortArr },
                    }), () => this.filterRequest("noModal"))
                  }}
                  checkedKeys={temporaryCondition.filteredSortArr || []}
                  style={{ marginLeft: "30%" }}
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
              </div>
            </Col>
          </Row>
          <Modal
            destroyOnClose
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
                <Radio.Button value="selectedByTag">
                  <Badge
                    dot={temporaryCondition.tagIdsArr && temporaryCondition.tagIdsArr.length > 0}
                  >
                    &nbsp;按标签&nbsp;&nbsp;
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
            {filterSort === 'selectedByTag' && (
              <Row>
                <Col span={3} style={{ marginTop: "5px" }}>请选择：</Col>
                <Col span={21}>
                  {tagOptions.map(item => (
                    <Tag.CheckableTag
                      key={item.id}
                      checked={temporaryCondition.tagIdsArr && temporaryCondition.tagIdsArr.includes(item.id)}
                      onChange={(checked) => this.handleTagSelect(item.id, checked)}
                      style={{ marginTop: "5px" }}
                    >
                      {item.name}
                    </Tag.CheckableTag>
                  ))}
                </Col>
              </Row>
            )}
          </Modal>
          {courseDrawerVisible &&
            <CourseDrawer
              visible={courseDrawerVisible}
              onClose={this.toggleCourseDrawer}
              request={this.request}
              title="归档"
              width={500}
            />
          }
          {messageDrawerVisible &&
            <MessageDrawer
              visible={messageDrawerVisible}
              onClose={this.toggleMessageDrawer}
              request={this.request}
              title="留言板"
              width={500}
            />
          }
        </Card>
      </GridContent>
    );
  }
}
export default HomePage;
