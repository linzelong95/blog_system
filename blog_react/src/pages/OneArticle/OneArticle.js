import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Col,
  Card,
  Row,
  Button,
  Tag,
  Icon,
  Drawer,
  Comment,
  List,
  Divider,
  Form,
  Modal,
  message,
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import CustomForm from '@/components/SeftForm';
import ShowMarkdown from '@/components/CustomShowMarkDown';
import { UrlEnum } from '@/assets/Enum';
import { timeFormat } from '@/utils/utils';

const {
  UserArticleAPI: { LIST, CONTENT },
  UserCommentAPI,
} = UrlEnum;

@connect(({ articleManagement, loading, global }) => ({
  articleManagement,
  loading: loading.models.articleManagement,
  currentUser: global.currentUser,
}))
@Form.create()
class HomePage extends React.Component {
  state = {
    reviewBoxVisible: false,
    reviewDrawerVisible: false,
    commentObj: { total: 0, list: [] },
    conditionQuery: {},
    item: {},
  };

  componentDidMount = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    this.request({ id, conditionQuery: {} }, res => {
      this.request({ netUrl: CONTENT.url, id, conditionQuery: {} }, response => {
        const item = res.list[0];
        item.content = response.list[0].content;
        this.setState({ item });
      });
    });
  };

  componentWillUnmount=()=>this.props.dispatch({ type: 'articleManagement/save', payload: { list: [] } });

  request = (params, callback) => {
    const { conditionQuery: con } = this.state;
    const conditionQuery = { ...con };
    delete conditionQuery.filteredSortArr;
    const payload = { netUrl: LIST.url, conditionQuery, ...params };
    this.props.dispatch({ type: 'articleManagement/handleArticles', payload, callback });
  };

  getCommentList = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const { conditionQuery: con } = this.state;
    const conditionQuery = { ...con, aids: [id] };
    this.request(
      { netUrl: UserCommentAPI.LIST.url, conditionQuery, prettyFormat: true },
      commentObj => this.setState({ commentObj, conditionQuery })
    );
  };

  commentSort = e => {
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
      () => this.getCommentList()
    );
  };

  handleWriteComment = val => {
    const { form, currentUser } = this.props;
    const {
      item: { id: aid, author_id },
    } = this.state;
    if (val === 'reset') {
      form.resetFields();
      return;
    }
    if (!currentUser.id) {
      Modal.error({ title: '请登录后再评论！' });
      return;
    }
    form.validateFields((err, values) => {
      if (err) return;
      const { to } = values;
      const from_id = currentUser.id;
      const netUrl = UserCommentAPI.INSERT.url;
      const to_id = to.key;
      this.request({ ...values, aid, from_id, to_id, author_id, netUrl }, () => {
        this.toggleReviewBox();
        this.getCommentList();
        message.success('评论成功，审核通过后将得以展示！');
      });
      form.resetFields();
    });
  };

  handleDealWithComment = (commentitem, action) => {
    const {
      form,
      currentUser: { id: currentUserId },
    } = this.props;
    if (!currentUserId) {
      Modal.error({ title: '登录后才可进行操作！' });
      return;
    }
    const { from_id: to_id, from_name: to_name, id, pid: p, content } = commentitem;
    if (action && [UserCommentAPI.DELETE.url].includes(action.url)) {
      const items = [{ id, pid: p, name: content }];
      this.request({ netUrl: action.url, items }, () => this.getCommentList());
      return;
    }
    const pid = p > 0 ? p : id;
    this.setState({ reviewBoxVisible: true }, () =>
      form.setFieldsValue({ pid, to: { label: to_name, key: to_id } })
    );
  };

  toggleReviewBox = () =>
    this.setState(oldState => ({ reviewBoxVisible: !oldState.reviewBoxVisible }));

  handlePageChange = (index, size) => this.request({ index, size });

  toggleShowReviewDrawer = () => {
    const { reviewDrawerVisible } = this.state;
    if (!reviewDrawerVisible) this.getCommentList();
    this.setState({ reviewDrawerVisible: !reviewDrawerVisible });
  };

  render() {
    const { form, currentUser, loading } = this.props;
    const { commentObj, reviewBoxVisible, conditionQuery, item, reviewDrawerVisible } = this.state;
    const modalFormConfig = [
      {
        fieldId: 'to',
        label: '对象',
        fieldType: 'select',
        fieldProps: { options: [{ key: item.author_id, label: '楼主' }], labelInValue: true },
        initialValue: { key: item.author_id, label: '楼主' },
      },
      {
        fieldId: 'content',
        label: '内容',
        rules: [{ required: true, message: '内容不能为空' }],
        fieldType: 'textArea',
      },
      { fieldId: 'pid', style: { display: 'none' }, fieldType: 'inputNumber', initialValue: 0 },
    ];
    return (
      <GridContent>
        <Card style={{ position: 'relative' }}>
          <div
            onClick={this.toggleShowReviewDrawer}
            style={{
              position: 'fixed',
              right: '0px',
              top: '300px',
              height: '50px',
              width: '50px',
              background: '#1890FF',
              textAlign: 'center',
            }}
          >
            <Icon
              type="form"
              style={{ color: 'white', fontWeight: 'bold', fontSize: '20px', lineHeight: '50px' }}
            />
          </div>
          <Row type="flex" justify={reviewDrawerVisible ? 'start' : 'center'}>
            <Col span={reviewDrawerVisible ? 16 : 22}>
              <div style={{ marginBottom: '10px', fontSize: '12px', textAlign: 'CENTER' }}>
                <h1>{item.title}</h1>
                <span>
                  <Icon type="clock-circle" />
                  &nbsp;
                  {timeFormat(Number(new Date(item.create_time)))}
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span>
                  <Icon type="edit" />
                  &nbsp;
                  {timeFormat(Number(new Date(item.modified_time)))}
                </span>
              </div>
              {item.label && (
                <p style={{ textIndent: '2em' }}>
                  <b>标签：</b>
                  {item.label.map(i => (
                    <Tag color="volcano" style={{ textIndent: '0em' }}>
                      {i.name}
                    </Tag>
                  ))}
                </p>
              )}
              {item.abstract && (
                <p style={{ textIndent: '2em' }}>
                  <b>摘要：</b>
                  {item.abstract}
                </p>
              )}
              <ShowMarkdown value={item.content} />
            </Col>
          </Row>
          <Drawer
            visible={reviewDrawerVisible}
            title={
              <div>
                {commentObj.total || 0}
                &nbsp;条评论&nbsp;
                <Icon type="reload" style={{ color: '#1890FF' }} onClick={this.getCommentList} />
                <Tag
                  color="purple"
                  id="create_time"
                  style={{ marginLeft: '10px' }}
                  onClick={this.commentSort}
                >
                  时间
                  <Icon
                    type={
                      conditionQuery.orderBy &&
                      conditionQuery.orderBy.name === 'create_time' &&
                      conditionQuery.orderBy.by === 'asc'
                        ? 'up'
                        : 'down'
                    }
                  />
                </Tag>
              </div>
            }
            onClose={this.toggleShowReviewDrawer}
            width={500}
          >
            {reviewDrawerVisible && (
              <div
                onClick={this.toggleShowReviewDrawer}
                style={{
                  position: 'absolute',
                  left: '-50px',
                  top: '300px',
                  height: '50px',
                  width: '50px',
                  background: '#1890FF',
                  textAlign: 'center',
                }}
              >
                <Icon
                  type="close"
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    lineHeight: '50px',
                  }}
                />
              </div>
            )}
            <div style={{ marginBottom: '30px' }}>
              <h2>
                回复框&nbsp;
                <Icon
                  type={reviewBoxVisible ? 'down-circle' : 'up-circle'}
                  style={{ color: '#1890FF' }}
                  onClick={this.toggleReviewBox}
                />
              </h2>
              <Divider style={{ marginTop: '-5px' }} />
              {reviewBoxVisible && (
                <Fragment>
                  <CustomForm
                    {...{ modalFormConfig, form, formProps: { hideRequiredMark: true } }}
                  />
                  <div style={{ float: 'right', marginTop: '10px' }}>
                    <Button
                      size="small"
                      style={{ marginRight: '10px' }}
                      onClick={() => this.handleWriteComment('reset')}
                    >
                      重置
                    </Button>
                    <Button size="small" type="primary" onClick={this.handleWriteComment}>
                      发送
                    </Button>
                  </div>
                </Fragment>
              )}
            </div>
            <div>
              <List
                loading={loading}
                itemLayout="horizontal"
                dataSource={commentObj.list || []}
                renderItem={listItem => (
                  <Comment
                    key={listItem.id}
                    actions={[
                      <span>
                        <Icon type="clock-circle" />
                        &nbsp;
                        {timeFormat(Number(new Date(listItem.create_time)))}
                      </span>,
                      <span>
                        <a onClick={() => this.handleDealWithComment(listItem)}>回复</a>
                      </span>,
                      currentUser.id === listItem.from_id && (
                        <span>
                          <a
                            onClick={() =>
                              this.handleDealWithComment(listItem, UserCommentAPI.DELETE)
                            }
                            style={{ color: 'red' }}
                          >
                            删除
                          </a>
                        </span>
                      ),
                    ]}
                    author={listItem.from_name}
                    avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    content={listItem.is_show ? listItem.content : '（该评论待审核）'}
                  >
                    {listItem.children.map(i => (
                      <Comment
                        key={i.id}
                        actions={[
                          <span>
                            <Icon type="clock-circle" />
                            &nbsp;
                            {timeFormat(Number(new Date(i.create_time)))}
                          </span>,
                          <span>
                            <a
                              onClick={() => this.handleDealWithComment({ ...i, pid: listItem.id })}
                            >
                              回复
                            </a>
                          </span>,
                          currentUser.id === i.from_id && (
                            <span>
                              <a
                                onClick={() => this.handleDealWithComment(i, UserCommentAPI.DELETE)}
                                style={{ color: 'red' }}
                              >
                                删除
                              </a>
                            </span>
                          ),
                        ]}
                        author={`${i.from_name} 回复@ ${i.to_name}`}
                        avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        content={i.is_show ? i.content : '（该评论待审核）'}
                      />
                    ))}
                  </Comment>
                )}
              />
            </div>
          </Drawer>
        </Card>
      </GridContent>
    );
  }
}
export default HomePage;
