import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Checkbox, Alert,Icon } from 'antd';
import Login from '@/components/Login';
import store from 'store';
import styles from './Login.less';

const { Tab, UserName, Password, CaptchaHtml, Submit, Captcha, Mobile } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: false,
  };

  componentDidMount() {
    const admin = store.get('account') || {};
    const { account, password, lastTime = 0, autoLogin = false } = admin;
    this.setState({ autoLogin });
    const d7 = 7 * 24 * 60 * 60 * 1000;
    const validTimeFlag = Date.now() - lastTime < d7;
    if (!autoLogin || !validTimeFlag || !account || !password) {
      this.onGetCaptcha();
      return;
    }
    this.props.dispatch({
      type: 'login/login',
      payload: { account, password, autoLogin },
      autoLoginMark: true
    });
  }

  handleSubmit = (err, values) => {
    if (err) return;
    const { autoLogin } = this.state;
    this.props.dispatch({
      type: 'login/login',
      payload: { ...values, autoLogin }
    });
  };

  onGetCaptcha = (phone) => {
    this.props.dispatch({
      type: 'login/getCaptcha',
      payload: { phone, code_type: 1 } // code_type ，1是注册，2是登录
    });
  }

  onTabChange = type => {
    this.setState({ type });
    if (type === "account") this.onGetCaptcha();
  };

  changeAutoLogin = e => this.setState({ autoLogin: e.target.checked, });


  // renderMessage = content => <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;

  render() {
    const { submitting, login: { captcha } } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="账户密码登录">
            <UserName name="account" placeholder="请输入账号/手机号/邮箱" />
            <Password name="password" placeholder="请输入密码" />
            <CaptchaHtml name="captcha" onGetCaptchaHtml={() => this.onGetCaptcha()} captchahtml={captcha} />
          </Tab>
          <Tab key="mobile" tab="手机号登录">
            <Mobile name="mobile" placeholder="请输入手机号" />
            <Captcha name="captcha" onGetCaptcha={this.onGetCaptcha} />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              忘记密码
            </a>
          </div>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            其他登录方式
            <Icon className={styles.icon} type="alipay-circle" />
            <Icon className={styles.icon} type="taobao-circle" />
            <Icon className={styles.icon} type="weibo-circle" />
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
