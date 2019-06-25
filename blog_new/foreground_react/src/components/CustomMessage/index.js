import React from 'react';
import { connect } from 'dva';
import { Form, Drawer, Icon, Button, message, Comment, List, Tooltip, Divider } from 'antd';
import CustomForm from '@/components/CustomForm';
import { timeFormat } from '@/utils/utils';
import { UrlEnum } from '@/assets/Enum';

const { UserMessageAPI, AdminMessageAPI } = UrlEnum;

@connect(({ articleManagement, global, loading }) => ({
  articleManagement,
  loading: loading.models.articleManagement,
  currentUser: global.currentUser,
}))
@Form.create()
class Message extends React.Component {
  state = {
    index: 1,
    size: 10,
    total: 0,
    list: [],
    conditionQuery: {}
  };

  componentDidMount = () => {
    this.getMessageList();
  }

  paginationChange = (index, size) => {
    const { request } = this.props;
    request({ index, size, conditionQuery: {}, netUrl: UserMessageAPI.LIST.url }, (res) => {
      this.setState({ ...res, index, size });
    }, false);
  }

  getMessageList = () => {
    const { conditionQuery } = this.state;
    const { request, currentUser: { roleName } } = this.props;
    const netUrl = roleName === "admin" ? AdminMessageAPI.LIST.url : UserMessageAPI.LIST.url;
    request({ netUrl, conditionQuery, size: 9999, prettyFormat: true }, res => {
      this.setState({ ...res, conditionQuery });
    }, false);
  }

  handleWriteMessage = val => {
    const { form, request, currentUser: { id: currentUserId, roleName } } = this.props;
    if (val === 'reset') {
      form.resetFields();
      return;
    }
    form.validateFields((err, values) => {
      if (err) return;
      const { to } = values;
      const fromId = currentUserId;
      const netUrl = roleName === "admin" ? AdminMessageAPI.INSERT.url : UserMessageAPI.INSERT.url;
      const toId = typeof to.key === "number" ? to.key : undefined;
      const toMail = typeof to.key !== "number" && to.key !== "博主" ? to.key : "无";
      request({ ...values, fromId, toId, toMail, netUrl }, () => {
        this.getMessageList();
        if (roleName !== "admin") message.success('评论成功，审核通过后将得以展示！');
      });
      form.resetFields();
    });
  }

  handleDealWithMessage = (messageItem, action) => {
    const { form, request } = this.props;
    const { from , id, parentId: pid, fromMail: toMail } = messageItem;
    if (action && [UserMessageAPI.DELETE.url, AdminMessageAPI.DELETE.url, AdminMessageAPI.APPROVE.url, AdminMessageAPI.DISAPPROVE.url].includes(action.url)) {
      const items = [{ id, parentId: pid, name: message }];
      request({ netUrl: action.url, items }, () => this.getMessageList());
      return;
    }
    const parentId = pid > 0 ? pid : id;
    form.setFieldsValue({ parentId, to: { label: from !== null ? from.nickName : toMail, key: from !== null ? from.id : toMail } });
  }

  render() {
    const { list, index, size, total } = this.state;
    const { onClose, visible, width, form, loading, currentUser } = this.props;
    const formConfig = [
      {
        fieldId: 'to',
        label: '对象',
        fieldType: 'select',
        fieldProps: {
          options: [{ key: '博主', label: '博主' }],
          labelInValue: true,
        },
        initialValue: { key: '博主', label: '博主' },
      },
      {
        fieldId: 'message',
        label: '内容',
        rules: [{ required: true, message: '内容不能为空', whitespace: true }],
        fieldType: 'textArea',
      },
      {
        fieldId: 'blog',
        label: '博客',
        fieldProps: {
          placeholder: "您的相关网站，选填"
        },
        rules: [{
          message: '请输入正确的地址',
          type: "url"
        }],
        fieldType: 'input',
      },
      {
        fieldId: 'fromMail',
        label: '邮箱',
        fieldProps: {
          placeholder: currentUser.id === undefined ? "游客必填" : "选填"
        },
        rules: [{
          required: currentUser.id === undefined,
          message: '请输入正确的邮箱',
          type: "email"
        }],
        fieldType: 'input',
      },
      {
        fieldId: 'parentId',
        style: { display: 'none' },
        fieldType: 'inputNumber',
        initialValue: 0
      },
    ];
    return (
      <Drawer
        visible={visible}
        title="留言"
        onClose={onClose}
        width={width || 500}
      >
        {visible && (
          <div
            onClick={onClose}
            style={{
              position: 'absolute',
              left: '-50px',
              top: '300px',
              height: '50px',
              width: '50px',
              background: '#1890FF',
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: 'white',
              cursor: "pointer",
              borderRadius: "5px 0px 0px 5px"
            }}
          >
            <Icon type="close" style={{ fontWeight: 'bold', fontSize: '20px' }} />
          </div>
        )}
        <CustomForm {...{ formConfig, form, formProps: { hideRequiredMark: true } }} />
        <div style={{ float: 'right', marginTop: '10px' }}>
          <Button
            size="small"
            style={{ marginRight: '10px' }}
            onClick={() => this.handleWriteMessage('reset')}
          >
            重置
          </Button>
          <Button size="small" type="primary" onClick={this.handleWriteMessage}>
            发送
          </Button>
        </div>
        <Divider orientation="left">
          <b style={{ color: "#1890FF", fontSize: 25 }}>{total}</b>
          <span style={{ margin: "0px 10px" }}>条留言</span>
          <Icon type="sync" style={{ color: "#1890FF" }} onClick={this.getMessageList} />
        </Divider>
        <List
          loading={loading}
          itemLayout="horizontal"
          dataSource={list}
          renderItem={listItem => (
            <Comment
              key={listItem.id}
              actions={[
                <span><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(listItem.createDate)))}</span>,
                <span><a onClick={() => this.handleDealWithMessage(listItem)}>回复</a></span>,
                (currentUser.roleName === 'admin' || (listItem.from && currentUser.id === listItem.from.id)) && (
                  <span>
                    <a
                      onClick={() => this.handleDealWithMessage(listItem, currentUser.roleName === 'admin' ? AdminMessageAPI.DELETE : UserMessageAPI.DELETE)}
                      style={{ color: 'red' }}
                    >
                      删除
                    </a>
                  </span>
                ),
                currentUser.roleName === "admin" && listItem.isApproved === 0 && <span><a onClick={() => this.handleDealWithMessage(listItem, AdminMessageAPI.APPROVE)} style={{ color: '#66CD00' }}>展示</a></span>,
                currentUser.roleName === "admin" && listItem.isApproved === 1 && <span><a onClick={() => this.handleDealWithMessage(listItem, AdminMessageAPI.DISAPPROVE)} style={{ color: '#BF3EFF' }}>隐藏</a> </span>
              ]}
              author={
                <span>
                  {listItem.from ? listItem.from.roleName === "admin" ? "博主" : listItem.from.nickName : `${listItem.fromMail} [游客]`}&nbsp;
                  {listItem.blog &&
                    <Tooltip title="博客地址">
                      <a href={listItem.blog} target="_blank" rel="noopener noreferrer"><Icon type="paper-clip" /></a>
                    </Tooltip>
                  }
                </span>
              }
              avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              content={listItem.isApproved || currentUser.roleName === 'admin' ? <span style={{ color: listItem.isApproved === 0 ? 'lightgray' : '' }}>{listItem.message}</span> : '（该评论待审核）'}
            >
              {listItem.children.map(i => (
                <Comment
                  key={i.id}
                  actions={[
                    <span><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(i.createDate)))}</span>,
                    <span><a onClick={() => this.handleDealWithMessage({ ...i, parentId: listItem.id })}>回复</a></span>,
                    (currentUser.roleName === 'admin' || (i.from && currentUser.id === i.from.id)) && <span><a onClick={() => this.handleDealWithMessage(i, currentUser.roleName === 'admin' ? AdminMessageAPI.DELETE : UserMessageAPI.DELETE)} style={{ color: 'red' }}>删除</a></span>,
                    currentUser.roleName === "admin" && i.isApproved === 0 && <span><a onClick={() => this.handleDealWithMessage(i, AdminMessageAPI.APPROVE)} style={{ color: '#66CD00' }}>展示</a></span>,
                    currentUser.roleName === "admin" && i.isApproved === 1 && <span><a onClick={() => this.handleDealWithMessage(i, AdminMessageAPI.DISAPPROVE)} style={{ color: '#BF3EFF' }}>隐藏</a> </span>
                  ]}
                  author={
                    <span>
                      {i.from ? i.from.roleName === "admin" ? "博主" : i.from.nickName : `${i.fromMail} [游客]`}&nbsp;
                      {i.blog &&
                        <Tooltip title="博客地址">
                          <a href={i.blog} target="_blank" rel="noopener noreferrer"><Icon type="paper-clip" /></a>
                        </Tooltip>
                      }
                      &nbsp;回复&nbsp;
                      {i.to ? i.to.roleName === "admin" ? "博主" : i.to.nickName : `${i.toMail}[游客]`}
                    </span>
                  }
                  avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  content={i.isApproved || currentUser.roleName === 'admin' ? <span style={{ color: i.isApproved === 0 ? 'lightgray' : '' }}>{i.message}</span> : '（该评论待审核）'}
                />
              ))}
            </Comment>
          )}
        />
      </Drawer>
    );
  }
}
export default Message;
