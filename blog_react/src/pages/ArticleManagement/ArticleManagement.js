import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Switch, Modal, Card, Checkbox, Col, Row, Badge, Button, Tooltip, Input, Tag, Icon, List, Drawer, Tree, Collapse } from 'antd';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Ellipsis from '@/components/Ellipsis';
import EditorialForm from './EditorialForm';
import ShowArticle from './ShowArticle';
import { timeFormat } from '@/utils/utils';
import { UrlEnum } from '@/assets/Enum';
import styles from './index.less';

const { AdminArticleAPI: { LIST, DELETE, FORM,TOP,UNTOP,LOCK,UNLOCK,CONTENT },AdminCateAPI } = UrlEnum;

@connect(({ articleManagement, global,loading }) => ({
  articleManagement,
  currentUser:global.currentUser,
  loading: loading.models.articleManagement,
}))
class ArticleManagement extends React.Component {
  state = {
    conditionQuery: { title: "", category: {}, orderBy: {} },
    showSorter: false,// 是否显示排序按钮
    selectedItems: [],
    allSelectedItem: false,
    editorialPanelVisible: false,
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
    if (payload.netUrl !== LIST.url) this.cleanSelectedItem();
  }

  handleShowALL = () => {
    console.log(this.inputSearch.input)
    // this.inputSearch.input.value="1111";
    this.setState({ conditionQuery: {}, filterKeys: [] }, () => this.request({ index: 1 }));
  }

  handlePageChange = (index, size) => this.request({ index, size });


  handleOnSearch = (val) => this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, title: val.replace(/(^\s*)|(\s*$)/g, "") } }), () => this.request({ index: 1 }));


  toggleEditorialPanel = () => this.setState((oldState) => ({ editorialPanelVisible: !oldState.editorialPanelVisible }));

  cleanSelectedItem = () => this.setState({ selectedItems: [], allSelectedItem: false });

  cleanFormItem = () => {
    this.cleanSelectedItem();
    this.setState({ formItem: {} });
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
      if (netUrl.includes("/article")) items = [{ id, name: title }];
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

  toggleItem = (item) => {
    const { selectedItems } = this.state;
    const { articleManagement: { list = [] } } = this.props;
    const newSelectedItems = selectedItems.some(i => i.id === item.id) ? selectedItems.filter(i => i.id !== item.id) : [...selectedItems, item];
    const allSelectedItem = list.every(listItem => newSelectedItems.some(i => i.id === listItem.id));
    this.setState({ selectedItems: newSelectedItems, allSelectedItem });
  }

  selectAllOrPart = () => {
    const { allSelectedItem } = this.state;
    const { articleManagement: { list = [] } } = this.props;
    const newSelectedItems = allSelectedItem ? [] : list;
    this.setState({ allSelectedItem: !allSelectedItem, selectedItems: newSelectedItems });
  }

  readArticle = (item) => {
    const callback = (res) => {
      const formItem = item;
      formItem.content = res.list[0].content;
      this.setState({ formItem, drawerVisible: true });
    }
    this.request({ netUrl: CONTENT.url, id: item.id }, callback);
  }


  onCloseDrawer = () => {
    this.cleanSelectedItem();
    this.setState({ formItem: {}, drawerVisible: false });
  }

  toggleFilterModal = () => this.setState((oldState) => ({ filterModalVisible: !oldState.filterModalVisible }));

  showFilterModal = () => {
    const callback = (res) => this.setState({ categoryOptions: res.list });
    this.request({ netUrl: AdminCateAPI.LIST.url, index: 1, size: 100, prettyFormat: true }, callback);
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
    const { allSelectedItem, selectedItems, editorialPanelVisible, drawerVisible, formItem, showSorter, filterModalVisible, categoryOptions, filterKeys, conditionQuery } = this.state;
    return (
      // <PageHeaderLayout>
      <GridContent>
        <Card>
          <Row type="flex" align="middle" style={{ marginBottom: "15px" }}>
            <Col xs={12} sm={13} md={15} lg={16} xl={17}>
              <Button icon="plus" type="primary" size="small" onClick={this.toggleEditorialPanel}>新增&nbsp;</Button>
              <Button icon="filter" type={conditionQuery.category && Object.keys(conditionQuery.category).length > 0 ? "danger" : "primary"} size="small" onClick={this.showFilterModal} style={{ marginLeft: "20px" }}>筛选&nbsp;</Button>
              <Button icon="star" type={allSelectedItem ? "danger" : "primary"} size="small" onClick={this.selectAllOrPart} style={{ marginLeft: "20px" }}>{allSelectedItem ? "反选" : "全选"}&nbsp;</Button>
              <Button icon={showSorter ? "right-circle-o" : "left-circle-o"} type="primary" size="small" onClick={this.showSorter} style={{ marginLeft: "20px" }}>排序&nbsp;</Button>
              {showSorter &&
                <Fragment>
                  <Tag color="magenta" style={{ marginLeft: "10px" }} onClick={() => this.sort("default")}>默认</Tag>
                  <Tag color="magenta" id="title" style={{ marginLeft: "5px" }} onClick={this.sort}>标题<Icon type={conditionQuery.orderBy && conditionQuery.orderBy.name === "title" && conditionQuery.orderBy.by === "asc" ? "up" : "down"} /></Tag>
                  <Tag color="magenta" id="create_time" style={{ marginLeft: "5px" }} onClick={this.sort}>创建时间<Icon type={conditionQuery.orderBy && conditionQuery.orderBy.name === "create_time" && conditionQuery.orderBy.by === "asc" ? "up" : "down"} /></Tag>
                  <Tag color="magenta" id="modified_time" style={{ marginLeft: "5px" }} onClick={this.sort}>修改时间<Icon type={conditionQuery.orderBy && conditionQuery.orderBy.name === "modified_time" && conditionQuery.orderBy.by === "asc" ? "up" : "down"} /></Tag>
                </Fragment>
              }
              {selectedItems.length > 0 &&
                <Fragment>
                  <Badge count={selectedItems.length} title="已选项数">&nbsp;
                    <Button icon="reload" type="primary" size="small" onClick={this.cleanSelectedItem} style={{ marginLeft: "16px" }}>清空&nbsp;</Button>
                  </Badge>
                  <Tooltip title="一键删除">
                    <Button icon="delete" size="small" shape="circle" onClick={() => this.handleItems(DELETE)} style={{ color: "red", marginLeft: "20px" }} />
                  </Tooltip>
                  <Tooltip title="一键置顶">
                    <Button icon="arrow-up" size="small" shape="circle" onClick={() => this.handleItems(TOP)} style={{ color: "green", marginLeft: "10px" }} />
                  </Tooltip>
                  <Tooltip title="一键取置">
                    <Button icon="arrow-down" size="small" shape="circle" onClick={() => this.handleItems(UNTOP)} style={{ color: "#A020F0", marginLeft: "10px" }} />
                  </Tooltip>
                  <Tooltip title="一键解锁">
                    <Button icon="unlock" size="small" shape="circle" onClick={() => this.handleItems(UNLOCK)} style={{ color: "green", marginLeft: "10px" }} />
                  </Tooltip>
                  <Tooltip title="一键锁定">
                    <Button icon="lock" size="small" shape="circle" onClick={() => this.handleItems(LOCK)} style={{ color: "#A020F0", marginLeft: "10px" }} />
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
                  actions={[
                    <Icon type="form" style={{ color: "green", width: "60px" }} onClick={() => this.handleItems(FORM, item)} />,
                    <Icon type="delete" style={{ color: "red", width: "60px" }} onClick={() => this.handleItems(DELETE, item)} />,
                    item.is_top === 0 ? <Icon type="arrow-up" style={{ color: "#4169E1", width: "60px" }} onClick={() => this.handleItems(TOP, item)} /> : <Icon type="arrow-down" style={{ color: "black", width: "60px" }} onClick={() => this.handleItems(UNTOP, item)} />,
                    item.disabled === 0 ? <Icon type="lock" style={{ color: "#4169E1", width: "60px" }} onClick={() => this.handleItems(LOCK, item)} /> : <Icon type="unlock" style={{ color: "black", width: "60px" }} onClick={() => this.handleItems(UNLOCK, item)} />,
                    <Icon type="eye" style={{ color: "#A52A2A", width: "60px" }} onClick={() => this.readArticle(item)} />,
                  ]}
                  className={styles.eachChild}
                  style={{ position: "relative", overflow: "hidden", background: selectedItems.some(i => i.id === item.id) && "#FFFFE0" }}
                  onClick={() => this.toggleItem(item)}
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
          {drawerVisible&&<ShowArticle loading={loading} visible={drawerVisible} item={formItem} onClose={this.onCloseDrawer} request={this.request}  />}
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
        {/* // </PageHeaderLayout> */}
      </GridContent>
    );
  }
}
export default ArticleManagement;



