import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Select, Modal, Card, Checkbox, Col, Row, Badge, Button, Tooltip, Input, Tag, Icon, List, Drawer, Tree, Avatar } from 'antd';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Ellipsis from '@/components/Ellipsis';
import { timeFormat } from '@/utils/utils';
import { UrlEnum } from '@/assets/Enum';
import styles from './index.less';


const { AdminCommentAPI: { LIST, DELETE, SHOW,UNSHOW,TOP,UNTOP },AdminCateAPI,AdminArticleAPI } = UrlEnum;


@connect(({ articleManagement, loading }) => ({
  articleManagement,
  loading: loading.models.articleManagement,
}))
class CommentManagement extends React.Component {
  state = {
    conditionQuery: { title: "", category: {}, orderBy: {} },
    showSorter: false,// 是否显示排序按钮
    selectedItems: [],
    allSelectedFlag: false,
    editorialPanelVisible: false,
    formItem: {},
    filterModalVisible: false,
    categoryOptions: [],
    filterKeys: [],
    articlecontainer :{
      netUrl: AdminArticleAPI.LIST.url,
      list: [],
      total: 0,
      index: 1,
      size: 6,
      query: "",
      selectedItems: []
    }
  };

  componentDidMount = () => this.request({ index: 1, size: 10 });

  request = (params, callback) => {
    const { conditionQuery } = this.state;
    const payload = { netUrl: LIST.url, conditionQuery, ...params };
    this.props.dispatch({ type: "articleManagement/handleArticles", payload, callback });
    if (payload.netUrl !== LIST.url) this.cleanSelectedItem();
  }

  handleShowALL = () => {
    this.setState({ conditionQuery: {}, filterKeys: [] }, () => this.request({ index: 1 }));
  }

  handlePageChange = (index, size) => this.request({ index, size });


  handleOnSearch = (val) => this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, title: val.replace(/(^\s*)|(\s*$)/g, "") } }), () => this.request({ index: 1 }));


  toggleEditorialPanel = () => this.setState((oldState) => ({ editorialPanelVisible: !oldState.editorialPanelVisible }));

  cleanSelectedItem = () => this.setState({ selectedItems: [], allSelectedFlag: false });

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
    const allSelectedFlag = list.every(listItem => newSelectedItems.some(i => i.id === listItem.id));
    this.setState({ selectedItems: newSelectedItems, allSelectedFlag });
  }

  selectAllOrPart = () => {
    const { allSelectedFlag } = this.state;
    const { articleManagement: { list = [] } } = this.props;
    const newSelectedItems = allSelectedFlag ? [] : list;
    this.setState({ allSelectedFlag: !allSelectedFlag, selectedItems: newSelectedItems });
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
      } else if (!category.sort.includes(parseInt(arr[0], 10))) {
        category.child.push(parseInt(arr.pop(), 10));
      }
    });
    this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, category } }), () => this.request({ index: 1 }));
    this.toggleFilterModal();
  }

  conditionTreeSelect = (filterKeys) => this.setState({ filterKeys });

  render() {
    const { articleManagement: { total = 10, list = [], size = 12, index = 1 }, loading, dispatch } = this.props;
    const { articlecontainer,allSelectedFlag, selectedItems, editorialPanelVisible,formItem, showSorter, filterModalVisible, categoryOptions, filterKeys, conditionQuery } = this.state;
    return (
      // <PageHeaderLayout>
      <GridContent>
        <Card>
          <Row type="flex" align="middle" style={{ marginBottom: "15px" }}>
            <Col xs={12} sm={13} md={15} lg={16} xl={17}>
              <Button icon="plus" type="primary" size="small" onClick={this.toggleEditorialPanel}>新增&nbsp;</Button>
              <Button icon="filter" type={conditionQuery.category && Object.keys(conditionQuery.category).length > 0 ? "danger" : "primary"} size="small" onClick={this.showFilterModal} style={{ marginLeft: "20px" }}>筛选&nbsp;</Button>
              <Button icon="star" type={allSelectedFlag ? "danger" : "primary"} size="small" onClick={this.selectAllOrPart} style={{ marginLeft: "20px" }}>{allSelectedFlag ? "反选" : "全选"}&nbsp;</Button>
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
              <Input.Search placeholder="请输入回复内容" onSearch={this.handleOnSearch} enterButton ref={inputSearch => this.inputSearch = inputSearch} />
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
              // pageSizeOptions: ["10", "20", "30", "40"],
              pageSize: size,
              // defaultPageSize: 10,
              total,
              current: index
            }}
            renderItem={item => (
              <List.Item
                style={{ background: selectedItems.map(i=>i.id).includes(item.id) && "#FFFFE0" }}
                className={styles.eachChild}
                key={item.id}
                actions={[
                  <span>{timeFormat(Number(new Date(item.create_time)))}</span>,
                  <Button size="small" type="danger" onClick={() => this.handleItems(DELETE,item)}>删除</Button>,
                  <Button size="small" type="primary" onClick={() => this.handleItems(item.is_show ?UNSHOW : SHOW, item)}>{item.is_show ? "隐藏" : "显示"}</Button>,
                  <Button size="small" type="primary" onClick={() => this.handleItems(item.is_top ?UNTOP : TOP, item)}>{item.is_top ?  "取置":"置顶"}</Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Fragment>
                      <Checkbox checked={allSelectedFlag ? true : selectedItems.map(i=>i.id).includes(item.id)} onChange={()=>this.toggleItem(item)} style={{marginLeft:"20px",marginTop:"10px"}} />
                      <Badge>&nbsp;&nbsp;</Badge>
                      <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" />
                    </Fragment>
                  }
                  title={
                    <a onClick={() => this.showContentDetail(item)}>《{item.title}》&nbsp;&nbsp;
                      {item.is_top === 1 && <Tag color="magenta">已置顶</Tag>}&nbsp;&nbsp;
                      {item.is_show === 1 && <Tag color="orange">已显示</Tag>}
                    </a>
                  }
                  description={
                    <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", display: "inline-block", width: "500px" }}>
                      <span style={{ color: "green",fontWeight:"bold" }}><i>{item.from_name}&nbsp;</i></span>
                      <span>回复&nbsp;</span>
                      <span style={{ color: "#A0522D" ,fontWeight:"bold"}}><i>@{item.to_name?item.to_name:"文章"}&nbsp;</i>:</span>&nbsp;
                      <a onClick={() => this.showContentDetail(item)}><i>{item.content}</i></a>
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
            <Select
              labelInValue
              mode="multiple"
            >
                {articlecontainer.list.map(i=><Select.Option key={i.id}>{i.title}</Select.Option>)}
            </Select>
          </Modal>
        </Card>
        {/* // </PageHeaderLayout> */}
      </GridContent>
    );
  }
}
export default CommentManagement;



