import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Card, Col, Row, Button, Tooltip, Input, Tag, Icon, List, Tree, Avatar, Divider,Timeline } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Ellipsis from '@/components/Ellipsis';
import { adminType, imgPrefix } from '@/defaultSettings';
import { timeFormat } from '@/utils/utils';
import { UrlEnum } from '@/assets/Enum';

const {
  UserArticleAPI: { LIST },
  UserCateAPI,
} = UrlEnum;

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
    temporaryCondition: {},
  };

  componentDidMount = () =>{
    this.request({ index: 1, size: 6 });
    this.request(
      { netUrl: UserCateAPI.LIST.url, index: 1, size: 100, prettyFormat: true },
      (res) => this.setState({ categoryOptions: res.list })
    );
  } 

  request = (params, callback) => {
    const { conditionQuery: con } = this.state;
    const conditionQuery = { ...con };
    delete conditionQuery.filteredSortArr;
    const payload = { netUrl: LIST.url, conditionQuery, ...params };
    this.props.dispatch({ type: 'articleManagement/handleArticles', payload, callback });
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
        conditionQuery: { ...oldState.conditionQuery, title: val.replace(/(^\s*)|(\s*$)/g, '') },
      }),
      () => this.request({ index: 1 })
    );

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
      this.showSorterFlag();
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
          orderBy: { name, by: orderBy.by === 'asc' ? 'desc' : 'asc' },
        },
      }),
      () => this.request({ index: 1 })
    );
  };

  toggleFilterModal = () =>
    this.setState(oldState => ({ filterModalVisible: !oldState.filterModalVisible }));

  filterRequest = method => {
    if (method === 'clear') {
      this.setState({ temporaryCondition: {} });
      return;
    }
    if(method!=="noModal") this.toggleFilterModal();
    let filterflag = false;
    if (method === 'exit') {
      const {
        conditionQuery: { filteredSortArr = [] },
      } = this.state;
      filterflag = filteredSortArr.length > 0;
      this.setState(oldState => ({
        temporaryCondition: { ...oldState.temporaryCondition, filteredSortArr, filterflag },
      }));
      return;
    }
    const {
      temporaryCondition: { filteredSortArr = [] },
    } = this.state;
    filterflag = filteredSortArr.length > 0;
    const category = { sort: [], child: [] };
    filteredSortArr.forEach(item => {
      const arr = item.split('-');
      if (arr.length === 1) {
        category.sort.push(parseInt(arr.pop(), 10));
      } else if (!category.sort.includes(parseInt(arr[0], 10))) {
        category.child.push(parseInt(arr.pop(), 10));
      }
    });
    this.setState(
      oldState => ({
        conditionQuery: { ...oldState.conditionQuery, category, filteredSortArr },
        temporaryCondition: { ...oldState.temporaryCondition, filterflag },
      }),
      () => this.request({ index: 1 })
    );
  };

  conditionTreeSelect = filteredSortArr =>
    this.setState(oldState => ({
      temporaryCondition: { ...oldState.temporaryCondition, filteredSortArr },
    }));

  render() {
    const {
      articleManagement: { total = 6, list = [], size = 6, index = 1 },
      loading,
    } = this.props;
    const {
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
                        conditionQuery.orderBy.by === 'desc'
                          ? 'down'
                          : 'up'
                      }
                    />
                  </Tag>
                  <Tag
                    color="magenta"
                    id="create_time"
                    style={{ marginLeft: '5px' }}
                    onClick={this.sort}
                  >
                    创建时间
                    <Icon
                      type={
                        conditionQuery.orderBy &&
                        conditionQuery.orderBy.name === 'create_time' &&
                        conditionQuery.orderBy.by === 'desc'
                          ? 'down'
                          : 'up'
                      }
                    />
                  </Tag>
                  <Tag
                    color="magenta"
                    id="modified_time"
                    style={{ marginLeft: '5px' }}
                    onClick={this.sort}
                  >
                    修改时间
                    <Icon
                      type={
                        conditionQuery.orderBy &&
                        conditionQuery.orderBy.name === 'modified_time' &&
                        conditionQuery.orderBy.by === 'desc'
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
                  pageSizeOptions: ['6','12', '18', '24'],
                  pageSize: size,
                  defaultPageSize: 6,
                  total,
                  current: index,
                }}
                renderItem={item => (
                  <List.Item
                    key={item.id}
                    actions={[
                      <span>
                        <Icon type="edit" />
                        &nbsp;
                        {timeFormat(Number(new Date(item.modified_time)))}
                      </span>,
                      <Icon type="star-o" />,
                      <Icon type="like-o" />,
                      <Icon type="message" />,
                      <div>
                        {item.label.split('&&').map(i => (
                          <Tag color="volcano">{i}</Tag>
                        ))}
                      </div>,
                    ]}
                    extra={
                      <img
                        width={200}
                        alt="logo"
                        src={
                          item.image_url
                            ? `${imgPrefix}${item.image_url}`
                            : 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'
                        }
                      />
                    }
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
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
                    <List.Item.Meta
                      avatar={
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                      }
                      title={
                        <a
                          href={`${window.location.origin}/${adminType}/article/${item.id}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {item.title}
                          &nbsp;&nbsp;
                          <Tag color="purple">
                            <Icon type="tag" />
                            {item.sort_name},{item.category_name}
                          </Tag>
                        </a>
                      }
                      style={{marginBottom:"0px"}}
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
              <div style={{textAlign:"center"}}>
                <p><Avatar size={200} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /></p>
                <span style={{fontSize:"25px",fontWeight:"bold",margin:"10px"}}>博客</span>
                <Divider style={{margin:"5px 0px"}}> 
                  <span>
                    <a><Icon type="github" /></a>&nbsp;&nbsp;
                    <a><Icon type="cloud" /></a>
                  </span>
                </Divider> 
                <span>这个人很懒，什么都没留下</span>
              </div>
              <div>
                <Divider style={{margin:"25px 0px 10px 0px"}}><Icon type="tags" style={{color:"purple"}} /></Divider> 
                {categoryOptions.map(i=>{
                  if(!i.disabled&&i.is_use){
                    return i.children.filter(v=>!v.disabled&&v.is_use).map(m=>
                      <Tag 
                        onClick={()=>{this.setState(oldState => ({
                          temporaryCondition: { ...oldState.temporaryCondition, filteredSortArr:[`${i.id}-${m.id}`] },
                        }),()=>this.filterRequest("noModal"))}}
                        color={["#f50","#2db7f5","#87d068","#108ee9","#6fa1d1","#f84d78","#de7b5d","#4c9447"][Math.floor(Math.random()*7)]}
                        style={{fontSize:"15px"}}
                      >
                        {m.name}
                      </Tag>
                    )
                  }
                  return undefined;
                })}
              </div>
              <div>
                <Divider style={{margin:"25px 0px 10px 0px"}}><Icon type="clock-circle" style={{color:"blue"}} /></Divider> 
                <Timeline>
                  <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                  <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                  <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                  <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                  <Timeline.Item><a>more...</a></Timeline.Item>
                </Timeline>
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
                  disabled={item.disabled}
                >
                  {item.children.map(i => (
                    <Tree.TreeNode
                      title={i.name}
                      key={`${item.id}-${i.id}`}
                      selectable={false}
                      disabled={item.disabled === 0 ? i.disabled : true}
                    />
                  ))}
                </Tree.TreeNode>
              ))}
            </Tree>
          </Modal>
        </Card>
      </GridContent>
    );
  }
}
export default HomePage;
