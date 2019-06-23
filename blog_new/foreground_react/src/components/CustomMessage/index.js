import React from 'react';
import { connect } from 'dva';
import { Form, Drawer, Icon, Button, message, Comment, List } from 'antd';
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
    const { request } = this.props;
    const netUrl = UserMessageAPI.LIST.url;
    request({ netUrl, conditionQuery, prettyFormat: true }, res => {
      this.setState({ ...res, conditionQuery });
    }, false);
  }

  handleWriteMessage = val => {
    console.log(1111)
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
      const toMail = "11@qq.com";
      request({ ...values, fromId, toId, toMail, netUrl }, () => {
        this.getMessageList();
        if (roleName !== "admin") message.success('评论成功，审核通过后将得以展示！');
      });
      form.resetFields();
    });
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
        rules: [{ required: true, message: '内容不能为空' }],
        fieldType: 'textArea',
      },
      {
        fieldId: 'blog',
        label: '博客',
        fieldType: 'input',
      },
      {
        fieldId: 'fromMail',
        label: '邮箱',
        fieldType: 'input',
      },
      { fieldId: 'parentId', style: { display: 'none' }, fieldType: 'inputNumber', initialValue: 0 },
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
        <List
          loading={loading}
          itemLayout="horizontal"
          dataSource={list}
          style={{marginTop:40}}
          renderItem={listItem => (
            <Comment
              key={listItem.id}
              actions={[
                <span><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(listItem.createDate)))}</span>,
                <span><a onClick={() => this.handleDealWithReply(listItem)}>回复</a></span>,
                (currentUser.roleName === 'admin' || (listItem.from && currentUser.id === listItem.from.id)) && (
                  <span>
                    <a
                      onClick={() => this.handleDealWithReply(listItem, currentUser.roleName === 'admin' ? AdminMessageAPI.DELETE : UserMessageAPI.DELETE)}
                      style={{ color: 'red' }}
                    >
                      删除
                    </a>
                  </span>
                ),
                currentUser.roleName === "admin" && listItem.isApproved === 0 && <span><a onClick={() => this.handleDealWithReply(listItem, AdminMessageAPI.APPROVE)} style={{ color: '#66CD00' }}>展示</a></span>,
                currentUser.roleName === "admin" && listItem.isApproved === 1 && <span><a onClick={() => this.handleDealWithReply(listItem, AdminMessageAPI.DISAPPROVE)} style={{ color: '#BF3EFF' }}>隐藏</a> </span>
              ]}
              author={listItem.from ? listItem.from.nickName : listItem.fromMail}
              avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              content={listItem.isApproved || currentUser.roleName === 'admin' ? <span style={{ color: listItem.isApproved === 0 ? 'lightgray' : '' }}>{listItem.message}</span> : '（该评论待审核）'}
            >
              {listItem.children.map(i => (
                <Comment
                  key={i.id}
                  actions={[
                    <span><Icon type="clock-circle" />&nbsp;{timeFormat(Number(new Date(i.createDate)))}</span>,
                    <span><a onClick={() => this.handleDealWithReply({ ...i, parentId: listItem.id })}>回复</a></span>,
                    (currentUser.roleName === 'admin' || (i.from && currentUser.id === i.from.id)) && <span><a onClick={() => this.handleDealWithReply(i, currentUser.roleName === 'admin' ? AdminMessageAPI.DELETE : UserMessageAPI.DELETE)} style={{ color: 'red' }}>删除</a></span>,
                    currentUser.roleName === "admin" && i.isApproved === 0 && <span><a onClick={() => this.handleDealWithReply(i, AdminMessageAPI.APPROVE)} style={{ color: '#66CD00' }}>展示</a></span>,
                    currentUser.roleName === "admin" && i.isApproved === 1 && <span><a onClick={() => this.handleDealWithReply(i, AdminMessageAPI.DISAPPROVE)} style={{ color: '#BF3EFF' }}>隐藏</a> </span>
                  ]}
                  author={`${i.from ? i.from.nickName : i.fromMail} 回复@ ${i.to ? i.to.nickName : i.toMail}`}
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
