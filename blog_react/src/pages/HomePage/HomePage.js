import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Switch, Modal, Card, Checkbox, Col, Row, Badge, Button, Tooltip, Input, Tag, Icon, List, Drawer, Tree, Collapse } from 'antd';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Ellipsis from '@/components/Ellipsis';
import ShowArticle from './ShowArticle';
import { timeFormat } from '@/utils/utils';
import styles from './index.less';

const LIST = { url: "/api/admin/article/list", desc: { zh_CN: "获取文章列表", en_US: "getList" } };
const DELETE = { url: "/api/admin/article/delete", desc: { zh_CN: "删除", en_US: "delete" }, actionTip: { zh_CN: "将被删除", en_US: "will be deleted!" } };
const FORM = { url: `/api/admin/article/form`, desc: { zh_CN: "编辑", en_US: "edit" }, actionTip: { zh_CN: "将处于可编辑状态，编辑时请注意核对！", en_US: "will be under editing. Please pay attention for information!" } };
const TOP = { url: `/api/admin/article/top`, desc: { zh_CN: "置顶", en_US: "up" }, actionTip: { zh_CN: "将被置顶，置顶后，在评论显示的状态下可取消置顶！", en_US: "will be stuck,and then can be downed when being shown!" } };
const UNTOP = { url: `/api/admin/article/untop`, desc: { zh_CN: "取置", en_US: "down" }, actionTip: { zh_CN: "将被取消置顶，取消置顶后，在评论显示的状态下可重新置顶！", en_US: "will be downed,and then can be stuck when being shown!" } };
const LOCK = { url: `/api/admin/article/lock`, desc: { zh_CN: "锁定", en_US: "lock" }, actionTip: { zh_CN: "将被锁定，锁定后可以解锁和删除，但不可编辑！", en_US: "will be lock,and then  can be released  or deleted, but can not be edited!" } };
const UNLOCK = { url: `/api/admin/article/unlock`, desc: { zh_CN: "解锁", en_US: "unlock" }, actionTip: { zh_CN: "将被解锁，解锁后可编辑和锁定,但不可删除！", en_US: "will be released,and then can be edited or locked,but can not be deleted!" } };


@connect(({ articleManagement, loading }) => ({
  articleManagement,
  loading: loading.models.articleManagement,
}))
class ArticleManagement extends React.Component {
  state = {
    conditionQuery: { title: "", category: {}, orderBy: {} },
    showSorter: false,// 是否显示排序按钮
    formItem: {},
    drawerVisible: false,
    filterModalVisible: false,
    categoryOptions: [],
    filterKeys: []
  };

  componentDidMount = () => this.request({ index: 1, size: 12 });

  request = (params, callback) => {
    const { conditionQuery } = this.state;
    const payload = { netUrl: LIST.url, conditionQuery, ...params };
    this.props.dispatch({ type: "articleManagement/handleArticles", payload, callback });
  }

  handleShowALL = () => {
    console.log(this.inputSearch.input)
    // this.inputSearch.input.value="1111";
    this.setState({ conditionQuery: {}, filterKeys: [] }, () => this.request({ index: 1 }));
  }

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
    this.request({ netUrl: "/api/admin/article/listone", id: item.id }, callback);
  }


  onCloseDrawer = () => this.setState({ formItem: {}, drawerVisible: false });

  toggleFilterModal = () => this.setState((oldState) => ({ filterModalVisible: !oldState.filterModalVisible }));

  showFilterModal = () => {
    const callback = (res) => this.setState({ categoryOptions: res.list });
    this.request({ netUrl: "/api/admin/cate/list", index: 1, size: 100, prettyFormat: true }, callback);
    this.toggleFilterModal();
  }

  filterRequest = (method) => {
    if (method === "clear") {
      this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, category: {} }, filterKeys: [] }), () => this.request({ index: 1 }));
      this.toggleFilterModal();
      return;
    }
    if (method === "exit") {
      this.toggleFilterModal();
      return;
    }
    const { filterKeys } = this.state;
    const category = { sort: [], child: [] };
    filterKeys.forEach(item => {
      const arr = item.split("-");
      if (arr.length === 1) {
        category.sort.push(parseInt(arr.pop(), 10));
      } else {
        if (!category.sort.includes(parseInt(arr[0], 10))) category.child.push(parseInt(arr.pop(), 10));
      }
    });
    this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, category } }), () => this.request({ index: 1 }));
    this.toggleFilterModal();
  }

  conditionTreeSelect = (filterKeys) => this.setState({ filterKeys });

  render() {
    const { articleManagement: { total = 10, list = [], size = 12, index = 1 }, loading, dispatch } = this.props;
    const { drawerVisible, formItem, showSorter, filterModalVisible, categoryOptions, filterKeys, conditionQuery } = this.state;
    return (
      <GridContent>
        <Card>
          <Row type="flex" align="middle" style={{ marginBottom: "15px" }}>
            <Col xs={12} sm={13} md={15} lg={16} xl={17}>
              <Button icon="filter" type={conditionQuery.category && Object.keys(conditionQuery.category).length > 0 ? "danger" : "primary"} size="small" onClick={this.showFilterModal}>筛选&nbsp;</Button>
              <Button icon={showSorter ? "right-circle-o" : "left-circle-o"} type="primary" size="small" onClick={this.showSorter} style={{ marginLeft: "20px" }}>排序&nbsp;</Button>
              {showSorter &&
                <Fragment>
                  <Tag color="magenta" style={{ marginLeft: "10px" }} onClick={() => this.sort("default")}>默认</Tag>
                  <Tag color="magenta" id="title" style={{ marginLeft: "5px" }} onClick={this.sort}>标题<Icon type={conditionQuery.orderBy && conditionQuery.orderBy.name === "title" && conditionQuery.orderBy.by === "asc" ? "up" : "down"} /></Tag>
                  <Tag color="magenta" id="create_time" style={{ marginLeft: "5px" }} onClick={this.sort}>创建时间<Icon type={conditionQuery.orderBy && conditionQuery.orderBy.name === "create_time" && conditionQuery.orderBy.by === "asc" ? "up" : "down"} /></Tag>
                  <Tag color="magenta" id="modified_time" style={{ marginLeft: "5px" }} onClick={this.sort}>修改时间<Icon type={conditionQuery.orderBy && conditionQuery.orderBy.name === "modified_time" && conditionQuery.orderBy.by === "asc" ? "up" : "down"} /></Tag>
                </Fragment>
              }
            </Col>
            <Col xs={2} sm={2} md={1} lg={1} xl={1}>
              <Tooltip title="默认展示">
                <Button type="primary" icon="home" shape="circle" size="small" onClick={this.handleShowALL} />
              </Tooltip>
            </Col>
            <Col xs={10} sm={9} md={8} lg={7} xl={6}>
              <Input.Search placeholder="请输入标题" onSearch={this.handleOnSearch} enterButton ref={inputSearch => this.inputSearch = inputSearch} />
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
                  style={{ position: "relative", overflow: "hidden"}}
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
              <Button onClick={() => this.filterRequest("exit")}>退出</Button>,
              <Button type="danger" onClick={() => this.filterRequest("clear")}>清空</Button>,
              <Button type="primary" onClick={this.filterRequest}>筛选</Button>,
            ]}
          >
            <Tree checkable showLine onCheck={this.conditionTreeSelect} defaultExpandedKeys={filterKeys} checkedKeys={filterKeys}>
              {categoryOptions.map(item =>
                <Tree.TreeNode title={item.name} key={`${item.id}`} selectable={false} disabled={item.disabled}>
                  {item.children.map(i => <Tree.TreeNode title={i.name} key={`${item.id}-${i.id}`} selectable={false} disabled={item.disabled === 0 ? i.disabled : true} />)}
                </Tree.TreeNode>
              )}
            </Tree>
          </Modal>
          {drawerVisible&&<ShowArticle visible={drawerVisible} item={formItem} onClose={this.onCloseDrawer} request={this.request}  />}
        </Card>
      </GridContent>
    );
  }
}
export default ArticleManagement;



