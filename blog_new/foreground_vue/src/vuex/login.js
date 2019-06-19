import $router from '../router';
import { getPageQuery, serialize, rsa } from '../utils/utils.js';
import $request from '../api/request';
import { Modal } from 'ant-design-vue';
import store from 'store';
import urls from '../api/urls';
const { AccountAPI } = urls;
const $error = Modal.error;



const login = {
  namespaced: true,
  state: {
    loginStatus: false,
    currentUser: {}
  },
  mutations: {
    save(state, payload) {
      const { loginStatus = false, currentUser = {} } = payload;
      state.loginStatus = loginStatus;
      state.currentUser = currentUser;
    },
  },
  actions: {
    async login({ commit }, { payload }) {
      const { account, password, autoLogin, autoLoginMark, captcha } = payload;
      const md5Pwd = autoLoginMark ? password : serialize(password);
      let accountObj = { ...store.get("blog_account"), account, autoLogin, password: md5Pwd };
      if (!autoLoginMark) {
        const verifyCaptchaResult = await $request(AccountAPI.VERIFY_WEBPAGE_CAPTCHA.url, { captcha });
        if (!verifyCaptchaResult) return $error({ title: "验证码错误！" });
        accountObj = { ...accountObj, lastTime: Date.now() };
      }
      const publicKey = await $request(AccountAPI.GET_PUBLICK_KEY.url);
      const response = await $request(AccountAPI.LOGIN.url, { account, password: rsa(md5Pwd, publicKey.item) });
      if (!response) return $error({ title: "登录失败，检查账户是否正确！" });
      store.set('blog_account', { ...accountObj, currentUser: response });
      commit("save", { loginStatus: true, currentUser: response });
      const currentPageUrl = window.location.href;
      if (!currentPageUrl.includes("/login") && !currentPageUrl.includes("/exception")) return;
      const urlParams = new URL(currentPageUrl);
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) redirect = redirect.substr(redirect.indexOf('#') + 1);
        } else {
          window.location.href = redirect;
          return;
        }
      }
      $router.push(redirect || "/homepage");
    },
    async logout({ commit }, { payload = {} }) {
      await $request(AccountAPI.LOGOUT.url);
      const user = store.get("blog_account") || {};
      const { autoLogin = false } = user;
      store.set('blog_account', { autoLogin });
      commit("save", { loginStatus: false, currentUser: {} });
      const { path } = payload;
      let currentPageUrl = window.location.href;
      if (path) {
        const index = currentPageUrl.lastIndexOf("/");
        currentPageUrl = currentPageUrl.substring(0, index) + path;
      }
      if (currentPageUrl.includes("/exception")) return $router.push(`/homepage`);
      $router.push(`/login?redirect=${currentPageUrl}`);
    },
    async register(_, { payload }) {
      const { password, captcha } = payload;
      const verifyCaptchaResult = await $request(AccountAPI.VERIFY_WEBPAGE_CAPTCHA.url, { captcha });
      if (!verifyCaptchaResult) return $error({ title: "验证码错误！" });
      const md5Pwd = serialize(password);
      const res = await $request(AccountAPI.REGISTER.url, { ...payload, password: md5Pwd });
      if (!res) return $error({ title: "注册失败！" });
      return "success";
    }
  },
  getters: {}
}

export default login;