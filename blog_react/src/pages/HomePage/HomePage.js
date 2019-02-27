import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Switch, Modal, Card, Checkbox, Col, Row, Badge, Button, Tooltip, Input, Tag, Icon, List, Drawer, Tree, Collapse } from 'antd';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Ellipsis from '@/components/Ellipsis';
import ShowArticle from './ShowArticle';
import { timeFormat } from '@/utils/utils';
import { UrlEnum } from '@/assets/Enum';
import styles from './index.less';

const { UserArticleAPI: { LIST, CONTENT }, UserCateAPI } = UrlEnum;


@connect(({ articleManagement, loading }) => ({
  articleManagement,
  loading: loading.models.articleManagement,
}))
class HomePage extends React.Component {
  state = {
    conditionQuery: { title: "", category: {}, orderBy: {} },
    showSorter: false,// 是否显示排序按钮
    formItem: {},
    drawerVisible: false,
    filterModalVisible: false,
    categoryOptions: [],
    temporaryCondition: {},
  };

  componentDidMount = () => this.request({ index: 1, size: 12 });

  request = (params, callback) => {
    const { conditionQuery: con } = this.state;
    const conditionQuery = { ...con };
    delete conditionQuery.filteredSortArr;
    const payload = { netUrl: LIST.url, conditionQuery, ...params };
    this.props.dispatch({ type: "articleManagement/handleArticles", payload, callback });
  }

  handleShowALL = () => this.setState({ conditionQuery: {}, temporaryCondition: {} }, () => {
    this.request({ index: 1 });
    this.inputSearch.input.state.value = "";
  });

  handlePageChange = (index, size) => this.request({ index, size });


  handleOnSearch = (val) => this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, title: val.replace(/(^\s*)|(\s*$)/g, "") } }), () => this.request({ index: 1 }));

  showSorter = () => this.setState((oldState) => ({ showSorter: !oldState.showSorter }));

  sort = (e) => {
    if (e === "default") {
      this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, orderBy: {} } }), () => this.request({ index: 1 }));
      this.showSorter();
      return;
    }
    const { id: name } = e.currentTarget;
    const { conditionQuery: { orderBy = {} } } = this.state;
    this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, orderBy: { name, by: orderBy.by === "asc" ? "desc" : "asc" } } }), () => this.request({ index: 1 }));
  }

  readArticle = (item) => {
    const callback = (res) => {
      const formItem = item;
      formItem.content = res.list[0].content;
      this.setState({ formItem, drawerVisible: true });
    }
    this.request({ netUrl: CONTENT.url, id: item.id }, callback);
  }


  onCloseDrawer = () => this.setState({ formItem: {}, drawerVisible: false });

  toggleFilterModal = () => this.setState((oldState) => ({ filterModalVisible: !oldState.filterModalVisible }));

  showFilterModal = () => {
    const callback = (res) => this.setState({ categoryOptions: res.list });
    this.request({ netUrl: UserCateAPI.LIST.url, index: 1, size: 100, prettyFormat: true }, callback);
    this.toggleFilterModal();
  }

  filterRequest = (method) => {
    if (method === "clear") {
      this.setState(oldState => ({ temporaryCondition: { ...oldState.temporaryCondition, filteredSortArr: [] } }));
      return;
    }
    this.toggleFilterModal();
    if (method === "exit") {
      const { conditionQuery: { filteredSortArr = [] } } = this.state;
      this.setState(oldState => ({ temporaryCondition: { ...oldState.temporaryCondition, filteredSortArr } }));
      return;
    }
    const { temporaryCondition: { filteredSortArr = [] } } = this.state;
    const category = { sort: [], child: [] };
    filteredSortArr.forEach(item => {
      const arr = item.split("-");
      if (arr.length === 1) {
        category.sort.push(parseInt(arr.pop(), 10));
      } else if (!category.sort.includes(parseInt(arr[0], 10))) {
        category.child.push(parseInt(arr.pop(), 10));
      }
    });
    this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, category, filteredSortArr } }), () => this.request({ index: 1 }));
  }

  conditionTreeSelect = (filteredSortArr) => this.setState(oldState => ({ temporaryCondition: { ...oldState.temporaryCondition, filteredSortArr } }));

  render() {
    const { articleManagement: { total = 10, list = [], size = 12, index = 1 }, loading, dispatch } = this.props;
    const { drawerVisible, formItem, showSorter, filterModalVisible, categoryOptions, conditionQuery, temporaryCondition } = this.state;
    return (
      <GridContent>
        <Card>
          <Row type="flex" align="middle" style={{ marginBottom: "15px" }}>
            <Col xs={12} sm={13} md={15} lg={16} xl={17}>
              <Button icon="filter" type={conditionQuery.filteredSortArr && conditionQuery.filteredSortArr.length > 0 ? "danger" : "primary"} size="small" onClick={this.showFilterModal}>筛选&nbsp;</Button>
              <Button icon={showSorter ? "right-circle-o" : "left-circle-o"} type="primary" size="small" onClick={this.showSorter} style={{ marginLeft: "20px" }}>排序&nbsp;</Button>
              {showSorter &&
                <Fragment>
                  <Tag color="magenta" style={{ marginLeft: "10px" }} onClick={() => this.sort("default")}>默认</Tag>
                  <Tag color="magenta" id="title" style={{ marginLeft: "5px" }} onClick={this.sort}>标题<Icon type={conditionQuery.orderBy && conditionQuery.orderBy.name === "title" && conditionQuery.orderBy.by === "desc" ? "down" : "up"} /></Tag>
                  <Tag color="magenta" id="create_time" style={{ marginLeft: "5px" }} onClick={this.sort}>创建时间<Icon type={conditionQuery.orderBy && conditionQuery.orderBy.name === "create_time" && conditionQuery.orderBy.by === "desc" ? "down" : "up"} /></Tag>
                  <Tag color="magenta" id="modified_time" style={{ marginLeft: "5px" }} onClick={this.sort}>修改时间<Icon type={conditionQuery.orderBy && conditionQuery.orderBy.name === "modified_time" && conditionQuery.orderBy.by === "desc" ? "down" : "up"} /></Tag>
                </Fragment>
              }
            </Col>
            <Col xs={2} sm={2} md={1} lg={1} xl={1}>
              <Tooltip title="默认展示">
                <Button type="primary" icon="home" shape="circle" size="small" onClick={this.handleShowALL} />
              </Tooltip>
            </Col>
            <Col xs={10} sm={9} md={8} lg={7} xl={6}>
              <Input.Search placeholder="请输入标题" onSearch={this.handleOnSearch} enterButton allowClear ref={inputSearch => this.inputSearch = inputSearch} />
            </Col>
          </Row>
          <List
            loading={loading}
            size="large"
            grid={{ gutter: 16, sm: 2, md: 3, xl: 3, xxl: 3 }}
            dataSource={list}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: this.handlePageChange,
              onShowSizeChange: this.handlePageChange,
              pageSizeOptions: ["12", "24", "36", "48"],
              pageSize: size,
              defaultPageSize: 12,
              total,
              current: index
            }}
            renderItem={item => (
              <List.Item>
                <Card
                  title={<Tooltip title={item.title}><span>{item.title}</span></Tooltip>}
                  extra={<Tag color="purple"><Icon type="tag" />&nbsp;{item.sort_name},{item.category_name}</Tag>}
                  className={styles.eachChild}
                  style={{ position: "relative", overflow: "hidden" }}
                  onClick={() => this.readArticle(item)}
                >
                  <div style={{ marginBottom: "5px", fontSize: "12px" }}>
                    <Ellipsis lines={1}>
                      标签：{item.label ? item.label.split("&&").map(i => <Tag color="volcano">{i}</Tag>) : <Tag color="volcano">无</Tag>}
                    </Ellipsis>
                  </div>
                  <div style={{ height: "45px" }}>
                    <Ellipsis lines={2}>
                      摘要：{item.abstract ? item.abstract : "无"}
                    </Ellipsis>
                  </div>
                  <div style={{ marginTop: "5px", fontSize: "12px" }}>
                    <div style={{ float: "left" }}><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(item.create_time)))}</div>
                    <div style={{ float: "right" }}><Icon type="edit" />&nbsp;{timeFormat(Number(new Date(item.modified_time)))}</div>
                  </div>
                  {item.is_top &&
                    <div style={{ position: "absolute", background: "gray", top: "5px", right: "-55px", width: "150px", textAlign: "center", overflow: "hidden", transform: "rotate(40deg)" }}>
                      <span style={{ color: "yellow" }}>置顶</span>
                    </div>
                  }
                </Card>
              </List.Item>
            )}
          />
          <Modal
            destroyOnClose
            visible={filterModalVisible}
            title="请选择筛选条件"
            onCancel={() => this.filterRequest("exit")}
            footer={[
              <Button onClick={() => this.filterRequest("exit")}>不更改并退出</Button>,
              <Button type="danger" onClick={() => this.filterRequest("clear")}>清空</Button>,
              <Button type="primary" onClick={this.filterRequest}>确定</Button>,
            ]}
          >
            <Tree checkable showLine onCheck={this.conditionTreeSelect} defaultExpandedKeys={temporaryCondition.filteredSortArr || []} checkedKeys={temporaryCondition.filteredSortArr || []}>
              {categoryOptions.map(item =>
                <Tree.TreeNode title={item.name} key={`${item.id}`} selectable={false} disabled={item.disabled}>
                  {item.children.map(i => <Tree.TreeNode title={i.name} key={`${item.id}-${i.id}`} selectable={false} disabled={item.disabled === 0 ? i.disabled : true} />)}
                </Tree.TreeNode>
              )}
            </Tree>
          </Modal>
          {drawerVisible && <ShowArticle loading={loading} visible={drawerVisible} item={formItem} onClose={this.onCloseDrawer} request={this.request} />}
        </Card>
      </GridContent>
    );
  }
}
export default HomePage;



