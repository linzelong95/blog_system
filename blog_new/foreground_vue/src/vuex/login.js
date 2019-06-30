import $router from '../router';
import { getPageQuery, serialize, rsa } from '../utils/utils.js';
import $request from '../api/request';
import store from 'store';
import urls from '../api/urls';
const { AccountAPI } = urls;

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
      let response;
      if (autoLoginMark) {
        response = await $request(AccountAPI.LOGIN.url, { autoLogin });
      } else {
        const verifyCaptchaResult = await $request(AccountAPI.VERIFY_WEBPAGE_CAPTCHA.url, { captcha });
        if (!verifyCaptchaResult) return;
        const publicKey = await $request(AccountAPI.GET_PUBLICK_KEY.url);
        response = await $request(AccountAPI.LOGIN.url, { account, password: rsa(serialize(password), publicKey.item), autoLogin });
      }
      if (!response || !Object.keys(response).length) {
        // if (window.location.pathname === "/user/login" && autoLoginMark) yield put({ type: "getCaptcha", payload: {} });
        return;
      }
      store.set('blog_account', { autoLogin, autoLoginMark: autoLogin });
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
      const { autoLogin = false } = store.get("blog_account") || {};
      store.set('blog_account', { autoLogin, autoLoginMark: false });
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
      if (!verifyCaptchaResult) return;
      const md5Pwd = serialize(password);
      const res = await $request(AccountAPI.REGISTER.url, { ...payload, password: md5Pwd });
      if (!res) return;
      return "success";
    }
  },
  getters: {}
}

export default login;