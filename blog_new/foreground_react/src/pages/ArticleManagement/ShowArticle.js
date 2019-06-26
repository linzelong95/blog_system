import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Col, Row, Button, Tag, Icon, Drawer, Comment, List, Divider, Form, Modal } from 'antd';
import CustomForm from '@/components/CustomForm';
import ShowMarkdown from '@/components/CustomShowMarkDown';
import { UrlEnum } from '@/assets/Enum';
import { timeFormat } from '@/utils/utils';

const { AdminReplyAPI: { LIST, DELETE, INSERT, APPROVE, DISAPPROVE } } = UrlEnum;

@connect(({ global }) => ({
  currentUser: global.currentUser,
}))
@Form.create()
class ShowArticle extends React.Component {
  state = {
    reviewBoxVisible: false,
    clientHeight: document.documentElement.clientHeight,
    replyObj: { total: 0, list: [] },
    conditionQuery: { prettyFormat: true },
  };

  componentDidMount = () => {
    window.addEventListener('resize', this.onWindowResize);
    this.getReplyList();
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.onWindowResize);
  };

  getReplyList = () => {
    const { request, item: { id } } = this.props;
    const { conditionQuery: con } = this.state;
    const conditionQuery = { ...con, articleIdsArr: [id] };
    request({ netUrl: LIST.url, conditionQuery, size: 99999 }, replyObj =>
      this.setState({ replyObj, conditionQuery })
    );
  };

  replySort = e => {
    const { id: name } = e.currentTarget;
    const { conditionQuery: { orderBy = {} } } = this.state;
    this.setState(oldState => ({ conditionQuery: { ...oldState.conditionQuery, orderBy: { name, by: orderBy.by === 'ASC' ? 'DESC' : 'ASC' } } }), () =>
      this.getReplyList()
    );
  };

  onWindowResize = () => this.setState({ clientHeight: document.documentElement.clientHeight });

  handleWriteReply = val => {
    const { request, form, item: { id: articleId }, currentUser } = this.props;
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
      const netUrl = INSERT.url;
      const toId = to.key;
      request({ ...values, articleId, fromId, toId, netUrl }, () => {
        this.toggleReviewBox();
        this.getReplyList();
      });
      form.resetFields();
    });
  };

  handleDealWithReply = (replyItem, action) => {
    const { form, currentUser: { id: currentUserId }, request } = this.props;
    if (!currentUserId) {
      Modal.error({ title: '登录后才可进行操作！' });
      return;
    }
    const { from: { id: toId, nickName }, id, parentId: pid, reply } = replyItem;
    if (action && [DELETE.url, APPROVE.url, DISAPPROVE.url].includes(action.url)) {
      const items = [{ id, parentId: pid, name: reply }];
      request({ netUrl: action.url, items }, () => this.getReplyList());
      return;
    }
    const parentId = pid > 0 ? pid : id;
    this.setState({ reviewBoxVisible: true }, () =>
      form.setFieldsValue({ parentId, to: { label: nickName, key: toId } })
    );
  };

  toggleReviewBox = () =>
    this.setState(oldState => ({ reviewBoxVisible: !oldState.reviewBoxVisible }));

  render() {
    const { visible, item, onClose, form, loading } = this.props;
    const { clientHeight, replyObj, reviewBoxVisible, conditionQuery } = this.state;
    const formConfig = [
      {
        fieldId: 'to',
        label: '对象',
        fieldType: 'select',
        fieldProps: {
          options: [{ key: item.user.id, label: '楼主' }],
          labelInValue: true,
        },
        initialValue: { key: item.user.id, label: '楼主' },
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
      <Drawer
        visible={visible}
        title={
          <div style={{ textAlign: 'center' }}>
            {item.title}
            &nbsp;&nbsp;
            <Tag color="purple">
              <Icon type="tag" />&nbsp;{item.category.sort.name},{item.category.name}
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
                  {timeFormat(Number(new Date(item.createDate)))}
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
                    <Tag color="volcano" style={{ textIndent: '0em' }} key={i.id}>
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
                    {...{ formConfig, form, formProps: { hideRequiredMark: true } }}
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
              <h2>
                {replyObj.total || 0}
                &nbsp;条评论&nbsp;
                <Icon type="reload" style={{ color: '#1890FF' }} onClick={this.getReplyList} />
                <Tag
                  color="magenta"
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
                  dataSource={replyObj.list || []}
                  renderItem={listItem => (
                    <Comment
                      actions={[
                        <span><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(listItem.createDate)))}</span>,
                        <span><a onClick={() => this.handleDealWithReply(listItem)}>回复</a></span>,
                        <span><a onClick={() => this.handleDealWithReply(listItem, DELETE)} style={{ color: 'red' }}>删除</a></span>,
                        listItem.isApproved === 0
                          ? <span><a onClick={() => this.handleDealWithReply(listItem, APPROVE)} style={{ color: '#66CD00' }}>展示</a></span>
                          : <span><a onClick={() => this.handleDealWithReply(listItem, DISAPPROVE)} style={{ color: '#BF3EFF' }}>隐藏</a> </span>
                      ]}
                      author={listItem.from.nickName}
                      avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      content={<span style={{ color: listItem.isApproved === 0 ? 'lightgray' : '' }}>{listItem.reply}</span>}
                    >
                      {listItem.children.map(i => (
                        <Comment
                          key={i.id}
                          actions={[
                            <span><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(i.createDate)))}</span>,
                            <span><a onClick={() => this.handleDealWithReply({ ...i, parentId: listItem.id })}>回复</a></span>,
                            <span><a onClick={() => this.handleDealWithReply(i, DELETE)} style={{ color: 'red' }}>删除</a></span>,
                            i.isApproved === 0
                              ? <span><a onClick={() => this.handleDealWithReply(i, APPROVE)} style={{ color: '#66CD00' }}>展示</a></span>
                              : <span><a onClick={() => this.handleDealWithReply(i, DISAPPROVE)} style={{ color: '#BF3EFF' }}>隐藏</a></span>
                          ]}
                          author={`${i.from.nickName} 回复@ ${i.to.nickName}`}
                          avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                          content={<span style={{ color: i.isApproved === 0 ? 'lightgray' : '' }}>{i.reply}</span>}
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
