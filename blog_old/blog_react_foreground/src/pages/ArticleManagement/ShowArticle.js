import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Col, Row, Button, Tag, Icon, Drawer, Comment, List, Divider, Form, Modal } from 'antd';
import CustomForm from '@/components/SeftForm';
import ShowMarkdown from '@/components/CustomShowMarkDown';
import { UrlEnum } from '@/assets/Enum';
import { timeFormat } from '@/utils/utils';

const {
  AdminCommentAPI: { LIST, DELETE, INSERT, SHOW, UNSHOW },
} = UrlEnum;

@connect(({ global }) => ({
  currentUser: global.currentUser,
}))
@Form.create()
class ShowArticle extends React.Component {
  state = {
    reviewBoxVisible: false,
    clientHeight: document.documentElement.clientHeight,
    commentObj: { total: 0, list: [] },
    conditionQuery: {},
  };

  componentDidMount = () => {
    window.addEventListener('resize', this.onWindowResize);
    this.getCommentList();
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.onWindowResize);
  };

  getCommentList = () => {
    const {
      request,
      item: { id },
    } = this.props;
    const { conditionQuery: con } = this.state;
    const conditionQuery = { ...con, aids: [id] };
    request({ netUrl: LIST.url, conditionQuery, prettyFormat: true }, commentObj =>
      this.setState({ commentObj, conditionQuery })
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

  onWindowResize = () => this.setState({ clientHeight: document.documentElement.clientHeight });

  handleWriteComment = val => {
    const {
      request,
      form,
      item: { id: aid, author_id },
      currentUser,
    } = this.props;
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
      const netUrl = INSERT.url;
      const to_id = to.key;
      request({ ...values, aid, from_id, to_id, author_id, netUrl }, () => {
        this.toggleReviewBox();
        this.getCommentList();
      });
      form.resetFields();
    });
  };

  handleDealWithComment = (commentitem, action) => {
    const {
      form,
      currentUser: { id: currentUserId },
      request,
    } = this.props;
    if (!currentUserId) {
      Modal.error({ title: '登录后才可进行操作！' });
      return;
    }
    const { from_id: to_id, from_name: to_name, id, pid: p, content } = commentitem;
    if (action && [DELETE.url, SHOW.url, UNSHOW.url].includes(action.url)) {
      const items = [{ id, pid: p, name: content }];
      request({ netUrl: action.url, items }, () => this.getCommentList());
      return;
    }
    const pid = p > 0 ? p : id;
    this.setState({ reviewBoxVisible: true }, () =>
      form.setFieldsValue({ pid, to: { label: to_name, key: to_id } })
    );
  };

  toggleReviewBox = () =>
    this.setState(oldState => ({ reviewBoxVisible: !oldState.reviewBoxVisible }));

  render() {
    const { visible, item, onClose, form, loading } = this.props;
    const { clientHeight, commentObj, reviewBoxVisible, conditionQuery } = this.state;
    const modalFormConfig = [
      {
        fieldId: 'to',
        label: '对象',
        fieldType: 'select',
        fieldProps: {
          options: [{ key: item.author_id, label: '楼主' }],
          labelInValue: true,
          onChange: obj => console.log(obj),
        },
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
      <Drawer
        visible={visible}
        title={
          <div style={{ textAlign: 'center' }}>
            {item.title}
            &nbsp;&nbsp;
            <Tag color="purple">
              <Icon type="tag" />
              &nbsp;
              {item.sort_name},{item.category_name}
            </Tag>
          </div>
        }
        placement="bottom"
        height={clientHeight - 70}
        closable
        onClose={onClose}
      >
        <Row type="flex" justify="center" gutter={24}>
          <Col span={16} style={{ maxHeight: clientHeight - 170, overflow: 'auto' }}>
            <div style={{ paddingRight: '15px' }}>
              <div style={{ marginBottom: '10px', fontSize: '12px', textAlign: 'CENTER' }}>
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
            </div>
          </Col>
          <Col span={8}>
            <div style={{ marginBottom: '30px' }}>
              <h2>
                回复区&nbsp;
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
              <h2>
                {commentObj.total || 0}
                &nbsp;条评论&nbsp;
                <Icon type="reload" style={{ color: '#1890FF' }} onClick={this.getCommentList} />
                <Tag
                  color="magenta"
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
              </h2>{' '}
              <Divider style={{ marginTop: '-5px' }} />
              <div
                style={{
                  maxHeight: reviewBoxVisible ? clientHeight - 460 : clientHeight - 300,
                  overflow: 'auto',
                }}
              >
                <List
                  loading={loading}
                  itemLayout="horizontal"
                  dataSource={commentObj.list || []}
                  renderItem={listItem => (
                    <Comment
                      actions={[
                        <span>
                          <Icon type="clock-circle" />
                          &nbsp;
                          {timeFormat(Number(new Date(listItem.create_time)))}
                        </span>,
                        <span>
                          <a onClick={() => this.handleDealWithComment(listItem)}>回复</a>
                        </span>,
                        <span>
                          <a
                            onClick={() => this.handleDealWithComment(listItem, DELETE)}
                            style={{ color: 'red' }}
                          >
                            删除
                          </a>
                        </span>,
                        listItem.is_show === 0 ? (
                          <span>
                            <a
                              onClick={() => this.handleDealWithComment(listItem, SHOW)}
                              style={{ color: '#66CD00' }}
                            >
                              展示
                            </a>
                          </span>
                        ) : (
                          <span>
                            <a
                              onClick={() => this.handleDealWithComment(listItem, UNSHOW)}
                              style={{ color: '#BF3EFF' }}
                            >
                              隐藏
                            </a>
                          </span>
                        ),
                      ]}
                      author={listItem.from_name}
                      avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      content={
                        <span style={{ color: listItem.is_show === 0 ? 'lightgray' : '' }}>
                          {listItem.content}
                        </span>
                      }
                    >
                      {listItem.children.map(i => (
                        <Comment
                          actions={[
                            <span>
                              <Icon type="clock-circle" />
                              &nbsp;
                              {timeFormat(Number(new Date(i.create_time)))}
                            </span>,
                            <span>
                              <a
                                onClick={() =>
                                  this.handleDealWithComment({ ...i, pid: listItem.id })
                                }
                              >
                                回复
                              </a>
                            </span>,
                            <span>
                              <a
                                onClick={() => this.handleDealWithComment(i, DELETE)}
                                style={{ color: 'red' }}
                              >
                                删除
                              </a>
                            </span>,
                            i.is_show === 0 ? (
                              <span>
                                <a
                                  onClick={() => this.handleDealWithComment(i, SHOW)}
                                  style={{ color: '#66CD00' }}
                                >
                                  展示
                                </a>
                              </span>
                            ) : (
                              <span>
                                <a
                                  onClick={() => this.handleDealWithComment(i, UNSHOW)}
                                  style={{ color: '#BF3EFF' }}
                                >
                                  隐藏
                                </a>
                              </span>
                            ),
                          ]}
                          author={`${i.from_name} 回复@ ${i.to_name}`}
                          avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                          content={
                            <span style={{ color: i.is_show === 0 ? 'lightgray' : '' }}>
                              {i.content}
                            </span>
                          }
                        />
                      ))}
                    </Comment>
                  )}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Drawer>
    );
  }
}
export default ShowArticle;
