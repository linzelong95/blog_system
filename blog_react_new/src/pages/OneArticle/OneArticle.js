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

const { UserArticleAPI: { LIST, CONTENT }, UserReplyAPI } = UrlEnum;

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
    replyObj: { total: 0, list: [] },
    conditionQuery: {},
    item: {},
  };

  componentDidMount = () => {
    const { match: { params: { id } } } = this.props;
    this.request({ id, conditionQuery: {} }, res => {
      this.request({ netUrl: CONTENT.url, conditionQuery: {}, articleId: id }, response => {
        this.setState({ item: { ...res.list[0], content: response.list[0].content } });
      });
    });
  };

  componentWillUnmount = () => this.props.dispatch({ type: 'articleManagement/save', payload: { list: [] } });

  request = (params, callback) => {
    const { conditionQuery: con } = this.state;
    const conditionQuery = { ...con };
    delete conditionQuery.filteredSortArr;
    const payload = { netUrl: LIST.url, conditionQuery, ...params };
    this.props.dispatch({ type: 'articleManagement/handleArticles', payload, callback });
  };

  getReplyList = () => {
    const { match: { params: { id } } } = this.props;
    const { conditionQuery: con } = this.state;
    const conditionQuery = { ...con, articleIdsArr: [id] };
    this.request({ netUrl: UserReplyAPI.LIST.url, conditionQuery, prettyFormat: true },
      replyObj => this.setState({ replyObj, conditionQuery })
    );
  };

  replySort = e => {
    const { id: name } = e.currentTarget;
    const {conditionQuery: { orderBy = {} }} = this.state;
    this.setState(oldState => ({conditionQuery: {...oldState.conditionQuery, orderBy: { name, by: orderBy.by === 'ASC' ? 'DESC' : 'ASC' }}}),() => 
      this.getReplyList()
    );
  };

  handleWriteReply = val => {
    const { form, currentUser } = this.props;
    const { item: { id: articleId } } = this.state;
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
      const fromId = currentUser.id;
      const netUrl = UserReplyAPI.INSERT.url;
      const toId = to.key;
      this.request({ ...values, articleId, fromId, toId, netUrl }, () => {
        this.toggleReviewBox();
        this.getReplyList();
        message.success('评论成功，审核通过后将得以展示！');
      });
      form.resetFields();
    });
  };

  handleDealWithReply = (replyItem, action) => {
    const { form, currentUser: { id: currentUserId } } = this.props;
    if (!currentUserId) {
      Modal.error({ title: '登录后才可进行操作！' });
      return;
    }
    const { from: { id: toId, nickName }, id, parentId: pid, reply } = replyItem;
    if (action && [UserReplyAPI.DELETE.url].includes(action.url)) {
      const items = [{ id, parentId: pid, name: reply }];
      this.request({ netUrl: action.url, items }, () => this.getReplyList());
      return;
    }
    const parentId = pid > 0 ? pid : id;
    this.setState({ reviewBoxVisible: true }, () =>
      form.setFieldsValue({ parentId, to: { label: nickName, key: toId } })
    );
  };

  toggleReviewBox = () => this.setState(oldState => ({ reviewBoxVisible: !oldState.reviewBoxVisible }));

  handlePageChange = (index, size) => this.request({ index, size });

  toggleShowReviewDrawer = () => {
    const { reviewDrawerVisible } = this.state;
    if (!reviewDrawerVisible) this.getReplyList();
    this.setState({ reviewDrawerVisible: !reviewDrawerVisible });
  };

  render() {
    const { form, currentUser, loading } = this.props;
    const { replyObj, reviewBoxVisible, conditionQuery, item, reviewDrawerVisible } = this.state;
    const modalFormConfig = [
      {
        fieldId: 'to',
        label: '对象',
        fieldType: 'select',
        fieldProps: {
          options: [{ key: item.user && item.user.id, label: '楼主' }],
          labelInValue: true,
        },
        initialValue: { key: item.user && item.user.id, label: '楼主' },
      },
      {
        fieldId: 'reply',
        label: '内容',
        rules: [{ required: true, message: '内容不能为空' }],
        fieldType: 'textArea',
      },
      { fieldId: 'parentId', style: { display: 'none' }, fieldType: 'inputNumber', initialValue: 0 },
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
                  {timeFormat(Number(new Date(item.createDate)))}
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span>
                  <Icon type="edit" />
                  &nbsp;
                  {timeFormat(Number(new Date(item.updateTime)))}
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
                {replyObj.total || 0}
                &nbsp;条评论&nbsp;
                <Icon type="reload" style={{ color: '#1890FF' }} onClick={this.getReplyList} />
                <Tag
                  color="purple"
                  id="createDate"
                  style={{ marginLeft: '10px' }}
                  onClick={this.replySort}
                >
                  时间
                  <Icon
                    type={
                      conditionQuery.orderBy &&
                        conditionQuery.orderBy.name === 'createDate' &&
                        conditionQuery.orderBy.by === 'ASC' ? 'up' : 'down'
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
                      onClick={() => this.handleWriteReply('reset')}
                    >
                      重置
                    </Button>
                    <Button size="small" type="primary" onClick={this.handleWriteReply}>
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
                dataSource={replyObj.list || []}
                renderItem={listItem => (
                  <Comment
                    key={listItem.id}
                    actions={[
                      <span>
                        <Icon type="clock-circle" />
                        &nbsp;
                        {timeFormat(Number(new Date(listItem.createDate)))}
                      </span>,
                      <span>
                        <a onClick={() => this.handleDealWithReply(listItem)}>回复</a>
                      </span>,
                      currentUser.id === listItem.from.id && (
                        <span>
                          <a
                            onClick={() => this.handleDealWithReply(listItem, UserReplyAPI.DELETE)}
                            style={{ color: 'red' }}
                          >
                            删除
                          </a>
                        </span>
                      ),
                    ]}
                    author={listItem.from.nickName}
                    avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    content={listItem.isApproved ? listItem.reply : '（该评论待审核）'}
                  >
                    {listItem.children.map(i => (
                      <Comment
                        key={i.id}
                        actions={[
                          <span><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(i.createDate)))}</span>,
                          <span><a onClick={() => this.handleDealWithReply({ ...i, parentId: listItem.id })}>回复</a></span>,
                          currentUser.id === i.from.id && <span><a onClick={() => this.handleDealWithReply(i, UserReplyAPI.DELETE)} style={{ color: 'red' }}>删除</a></span>
                        ]}
                        author={`${i.from.nickName} 回复@ ${i.to.nickName}`}
                        avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        content={i.isApproved ? i.reply : '（该评论待审核）'}
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
