import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Col, Card, Row, Button, Tooltip, Tag, Icon, Drawer, Comment, Avatar, List, Divider, Form, Modal, message } from 'antd';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Ellipsis from '@/components/Ellipsis';
import CustomForm from '@/components/SeftForm';
import Markdown from 'react-markdown/with-html';
import { UrlEnum } from '@/assets/Enum';
import { timeFormat } from '@/utils/utils';
import moment from 'moment';

const { UserArticleAPI: { LIST, CONTENT }, UserCateAPI, UserCommentAPI } = UrlEnum;


@connect(({ articleManagement, loading, global }) => ({
  articleManagement,
  loading: loading.models.articleManagement,
  currentUser: global.currentUser
}))
@Form.create()
class HomePage extends React.Component {
  state = {
    reviewBoxVisible: false,
    reviewDrawerVisible: false,
    clientHeight: document.documentElement.clientHeight,
    commentObj: { total: 0, list: [] },
    conditionQuery: {},
    item: {}
  };

  componentDidMount = () => {
    const { match: { params: { id } } } = this.props;
    this.request({ id, conditionQuery: {} }, (res) => {
      this.request({ netUrl: CONTENT.url, id, conditionQuery: {} }, (response) => {
        const item = res.list[0];
        item.content = response.list[0].content;
        this.setState({ item });
      })
    })
    window.addEventListener("resize", this.onWindowResize);
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.onWindowResize);
  }

  request = (params, callback) => {
    const { conditionQuery: con } = this.state;
    const conditionQuery = { ...con };
    delete conditionQuery.filteredSortArr;
    const payload = { netUrl: LIST.url, conditionQuery, ...params };
    this.props.dispatch({ type: "articleManagement/handleArticles", payload, callback });
  }

  getCommentList = () => {
    const { match: { params: { id } } } = this.props;
    const { conditionQuery: con } = this.state;
    const conditionQuery = { ...con, aids: [id] };
    this.request({ netUrl: UserCommentAPI.LIST.url, conditionQuery, prettyFormat: true }, (commentObj) =>
      this.setState({ commentObj, conditionQuery })
    );
  }

  commentSort = (e) => {
    const { id: name } = e.currentTarget;
    const { conditionQuery: { orderBy = {} } } = this.state;
    this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, orderBy: { name, by: orderBy.by === "asc" ? "desc" : "asc" } } }), () => this.getCommentList());
  }

  onWindowResize = () => this.setState({ clientHeight: document.documentElement.clientHeight });

  handleWriteComment = (val) => {
    const { form, currentUser } = this.props;
    const { item: { id: aid, author_id } } = this.state;
    if (val === "reset") {
      form.resetFields();
      return;
    }
    if (!currentUser.id) {
      Modal.error({ title: "请登录后再评论！" });
      return;
    }
    form.validateFields((err, values) => {
      if (err) return;
      const { to } = values;
      const from_id = currentUser.id;
      const netUrl = UserCommentAPI.INSERT.url;
      const to_id = to.key;
      const callback = (res) => {
        this.toggleReviewBox();
        this.getCommentList();
        message.success('评论成功，审核通过后将得以展示！');
      }
      this.request({ ...values, aid, from_id, to_id, author_id, netUrl }, callback);
      form.resetFields();
    });
  }

  handleDealWithComment = (commentitem, action) => {
    const { form, currentUser: { id: currentUserId } } = this.props;
    if (!currentUserId) {
      Modal.error({ title: "登录后才可进行操作！" });
      return;
    }
    const { from_id: to_id, from_name: to_name, children, id, pid: p, content } = commentitem;
    if (action && [UserCommentAPI.DELETE.url].includes(action.url)) {
      const items = [{ id, pid: p, name: content }];
      const callback = (res) => this.getCommentList();
      this.request({ netUrl: action.url, items }, callback);
      return;
    }
    const pid = p ? p : id;
    this.setState({ reviewBoxVisible: true }, () => form.setFieldsValue({ pid: pid, to: { label: to_name, key: to_id } }));
  }

  toggleReviewBox = () => this.setState(oldState => ({ reviewBoxVisible: !oldState.reviewBoxVisible }));




  handleShowALL = () => this.setState({ conditionQuery: {}, temporaryCondition: {} }, () => {
    this.request({ index: 1 });
    this.inputSearch.input.state.value = "";
  });

  handlePageChange = (index, size) => this.request({ index, size });


  handleOnSearch = (val) => this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, title: val.replace(/(^\s*)|(\s*$)/g, "") } }), () => this.request({ index: 1 }));

  toggleShowSorter = () => {
    const { articleManagement: { list = [] } } = this.props;
    if (!list.length) return;
    this.setState((oldState) => ({ showSorterFlag: !oldState.showSorterFlag }));
  }
  sort = (e) => {
    if (e === "default") {
      this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, orderBy: {} } }), () => this.request({ index: 1 }));
      this.showSorterFlag();
      return;
    }
    const { id: name } = e.currentTarget;
    const { conditionQuery: { orderBy = {} } } = this.state;
    this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, orderBy: { name, by: orderBy.by === "asc" ? "desc" : "asc" } } }), () => this.request({ index: 1 }));
  }

  toggleShowReviewDrawer = () => {
    this.getCommentList();
    this.setState({ reviewDrawerVisible: true });
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
      this.setState({ temporaryCondition: {} });
      return;
    }
    this.toggleFilterModal();
    let filterflag = false;
    if (method === "exit") {
      const { conditionQuery: { filteredSortArr = [] } } = this.state;
      filterflag = filteredSortArr.length > 0;
      this.setState(oldState => ({ temporaryCondition: { ...oldState.temporaryCondition, filteredSortArr, filterflag } }));
      return;
    }
    const { temporaryCondition: { filteredSortArr = [] } } = this.state;
    filterflag = filteredSortArr.length > 0;
    const category = { sort: [], child: [] };
    filteredSortArr.forEach(item => {
      const arr = item.split("-");
      if (arr.length === 1) {
        category.sort.push(parseInt(arr.pop(), 10));
      } else if (!category.sort.includes(parseInt(arr[0], 10))) {
        category.child.push(parseInt(arr.pop(), 10));
      }
    });
    this.setState(oldState => ({
      conditionQuery: { ...oldState.conditionQuery, category, filteredSortArr },
      temporaryCondition: { ...oldState.temporaryCondition, filterflag }
    }), () => this.request({ index: 1 }));
  }

  conditionTreeSelect = (filteredSortArr) => this.setState(oldState => ({ temporaryCondition: { ...oldState.temporaryCondition, filteredSortArr } }));

  render() {
    const { visible, onClose, form, currentUser, loading } = this.props;
    const { clientHeight, commentObj, reviewBoxVisible, conditionQuery, item, reviewDrawerVisible } = this.state;
    const modalFormConfig = [
      { fieldId: 'to', label: "对象", fieldType: 'select', fieldProps: { options: [{ key: item.author_id, label: "楼主" }], labelInValue: true }, initialValue: { key: item.author_id, label: "楼主" } },
      { fieldId: 'content', label: '内容', rules: [{ required: true, message: "内容不能为空" }], fieldType: 'textArea' },
      { fieldId: 'pid', style: { display: "none" }, fieldType: 'inputNumber', initialValue: 0 },
    ];
    return (
      <GridContent>
        <Card style={{ position: "relative" }}>
          <div onClick={this.toggleShowReviewDrawer} style={{ position: "fixed", right: "0px", top: "350px", height: "50px", width: "50px", background: "#1890FF", textAlign: "center" }}>
            <Icon type="form" style={{ color: "white", fontWeight: "bold", fontSize: "20px", lineHeight: "50px" }} />
          </div>
          <Row type="flex" justify="center" gutter={24}>
            <Col span={16}>
              <div ref={contentDivRef => this.contentDivRef = contentDivRef}>
                <div style={{ marginBottom: "10px", fontSize: "12px", textAlign: "CENTER" }}>
                  <span><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(item.create_time)))}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <span><Icon type="edit" />&nbsp;{timeFormat(Number(new Date(item.modified_time)))}</span>
                </div>
                {item.label && <p style={{ textIndent: "2em" }}><b>标签：</b>{item.label.split("&&").map(i => <Tag color="volcano" style={{ textIndent: "0em" }}>{i}</Tag>)}</p>}
                {item.abstract && <p style={{ textIndent: "2em" }}><b>摘要：</b>{item.abstract}</p>}
                <Markdown source={item.content} escapeHtml={false} />
              </div>
            </Col>

          </Row>
          {reviewDrawerVisible &&
            <Drawer
              visible={reviewDrawerVisible}
              title={<div style={{ textAlign: "center" }}>{item.title}&nbsp;&nbsp;<Tag color="purple"><Icon type="tag" />&nbsp;{item.sort_name},{item.category_name}</Tag></div>}
              placement="bottom"
              height={clientHeight - 70}
              closable
              onClose={onClose}
            >
              <div style={{ marginBottom: "30px" }}>
                <h2>回复区&nbsp;<Icon type={reviewBoxVisible ? "down-circle" : "up-circle"} style={{ color: "#1890FF" }} onClick={this.toggleReviewBox} /></h2>
                <Divider style={{ marginTop: "-5px" }} />
                {reviewBoxVisible &&
                  <Fragment>
                    <CustomForm {...{ modalFormConfig, form, formProps: { hideRequiredMark: true } }} />
                    <div style={{ float: "right", marginTop: "10px" }}>
                      <Button size="small" style={{ marginRight: "10px" }} onClick={() => this.handleWriteComment("reset")}>重置</Button>
                      <Button size="small" type="primary" onClick={this.handleWriteComment}>发送</Button>
                    </div>
                  </Fragment>
                }
              </div>
              <div>
                <h2>
                  {commentObj.total || 0}&nbsp;条评论&nbsp;
                                <Icon type="reload" style={{ color: "#1890FF" }} onClick={this.getCommentList} />
                  <Tag color="magenta" id="create_time" style={{ marginLeft: "10px" }} onClick={this.commentSort}>时间<Icon type={conditionQuery.orderBy && conditionQuery.orderBy.name === "create_time" && conditionQuery.orderBy.by === "asc" ? "up" : "down"} /></Tag>
                </h2>
                <Divider style={{ marginTop: "-5px" }} />
                <div style={{ maxHeight: reviewBoxVisible ? this.contentDivRef ? (this.contentDivRef.clientHeight - 250) : (document.clientHeight - 400) : this.contentDivRef ? (this.contentDivRef.clientHeight - 100) : (document.clientHeight - 300), overflow: "auto" }}>
                  <List
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={commentObj.list || []}
                    renderItem={listItem => (
                      <Comment
                        key={listItem.id}
                        actions={[
                          <span><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(listItem.create_time)))}</span>,
                          <span><a onClick={() => this.handleDealWithComment(listItem)}>回复</a></span>,
                          currentUser.id === listItem.from_id && <span><a onClick={() => this.handleDealWithComment(listItem, DELETE)} style={{ color: "red" }}>删除</a></span>,
                        ]}
                        author={listItem.from_name}
                        avatar='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                        content={listItem.is_show ? listItem.content : "（该评论待审核）"}
                      >
                        {listItem.children.map(i =>
                          <Comment
                            key={i.id}
                            actions={[
                              <span><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(i.create_time)))}</span>,
                              <span><a onClick={() => this.handleDealWithComment({ ...i, pid: listItem.id })}>回复</a></span>,
                              currentUser.id === i.from_id && <span><a onClick={() => this.handleDealWithComment(i, DELETE)} style={{ color: "red" }}>删除</a></span>,
                            ]}
                            author={`${i.from_name} 回复@ ${i.to_name}`}
                            avatar='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                            content={i.is_show ? i.content : "（该评论待审核）"}
                          />
                        )}
                      </Comment>
                    )}
                  />
                </div>
              </div>
            </Drawer>
          }
        </Card>
      </GridContent>
    );
  }
}
export default HomePage;



