import store from 'store';
import { routerRedux } from 'dva/router';
import { beforeAccount, common ,handleArticles} from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { serialize, rsa ,getPageQuery} from '@/utils/utils';
import { message } from 'antd';
import { UrlEnum } from '@/assets/Enum';
import { stringify } from 'querystring';
import { adminType } from '@/defaultSettings';

// const { AccountAPI: { LOGIN, LOGOUT }, MAccountAPI: { GET_PUBLICK_KEY, GET_POHNE_CAPTCHA, GET_WEBPAGE_CAPTCHA, VERIFY_POHNE_CAPTCHA, VERIFY_WEBPAGE_CAPTCHA } } = UrlEnum;
const { AccountAPI: { LOGIN, LOGOUT,GET_PUBLICK_KEY,GET_WEBPAGE_CAPTCHA,VERIFY_WEBPAGE_CAPTCHA } } = UrlEnum;

export default {
  namespace: 'login',

  state: {
    captcha: "",
    loginStatus:false
  },

  effects: {
    *login({ payload, autoLoginMark }, { call, put,select }) {
      const {lang}=yield select(models=>models.articleManagement);
      const { account, password, autoLogin,captcha } = payload;
      const md5Pwd = autoLoginMark ? password : serialize(password);// 增加
      let accountObj = { ...store.get("account"),account, autoLogin, password:md5Pwd };
      if (!autoLoginMark) {
        const verifyCaptchaResult = yield call(handleArticles, { netUrl:VERIFY_WEBPAGE_CAPTCHA.url,captcha });
        if(!verifyCaptchaResult.status) return;
        accountObj = { ...accountObj, lastTime: new Date().getTime() };
      }
      const publicKey = yield call(handleArticles, { netUrl: GET_PUBLICK_KEY.url });
      const response = yield call(handleArticles, { netUrl: LOGIN.url, account, password : rsa(md5Pwd, publicKey.item) });
      if (!response.status) {
        setAuthority('user');
        reloadAuthorized();
        return;
      }
      store.set('account', {  ...accountObj,currentUser: response,language:lang });
      yield put({ type: 'save', payload: {loginStatus:true} });
      yield put({type: 'global/save',payload:{currentUser:response}});
      // yield put({type: 'global/fetchNotices'});
      setAuthority('admin');
      reloadAuthorized();
      const currentPageUrl=window.location.href;
      if(!currentPageUrl.includes("/user/login") && !currentPageUrl.includes("/exception")) return;
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
      yield put(routerRedux.replace(redirect || '/articlemanagement'));
      // yield put(routerRedux.replace(redirect || '/index'));
    },
    // *login({ payload, autoLoginMark }, { call, put,select }) {
    //   const {lang}=yield select(models=>models.common);
    //   const { account, password, autoLogin, captcha: code, mobile: phone, code_type = 1 } = payload;// code_type ，1是注册，2是登录
    //   const md5Pwd = autoLoginMark ? password : serialize(phone ? code : password);
    //   const netUrl = phone ? VERIFY_POHNE_CAPTCHA.url : VERIFY_WEBPAGE_CAPTCHA.url;
    //   let accountObj = { ...store.get("account"),account, autoLogin, password: md5Pwd };
    //   if (!autoLoginMark) {
    //     // const verifyCaptchaResult = yield call(beforeAccount, { netUrl, code, phone, code_type });
    //     // if(!verifyCaptchaResult.status) return;
    //     accountObj = { ...accountObj, lastTime: new Date().getTime() };
    //   }
    //   const publicKey = yield call(beforeAccount, { netUrl: GET_PUBLICK_KEY.url });
    //   const response = yield call(common, { netUrl: LOGIN.url, account, password: rsa(md5Pwd, publicKey.item) });
    //   if (!response.status) return;
    //   store.set('account', {  ...accountObj,currentUser: response,language:lang });
    //   yield put({ type: 'save', payload: {loginStatus:true} });
    //   yield put({type: 'global/save',payload:{currentUser:response}});
    //   yield put({type: 'global/fetchNotices'});
    //   setAuthority('admin');
    //   reloadAuthorized();
    //   const currentPageUrl=window.location.href;
    //   if(!currentPageUrl.includes("/user/login") && !currentPageUrl.includes("/exception")) return;
    //   const urlParams = new URL(currentPageUrl);
    //   const params = getPageQuery();
    //   let { redirect } = params;
    //   if (redirect) {
    //     const redirectUrlParams = new URL(redirect);
    //     if (redirectUrlParams.origin === urlParams.origin) {
    //       redirect = redirect.substr(urlParams.origin.length);
    //       if (redirect.match(/^\/.*#/)) redirect = redirect.substr(redirect.indexOf('#') + 1);
    //     } else {
    //       window.location.href = redirect;
    //       return;
    //     }
    //   }
    //   yield put(routerRedux.replace(redirect || '/commoditymanagement/insellinggoods'));
    // },
    *logout(_, { call, put,select }) {
      const {lang}=yield select(models=>models.articleManagement);
      yield call(handleArticles, { netUrl: LOGOUT.url });
      const admin=store.get("account")||{};
      const { autoLogin=false ,language=lang} = admin;
      store.set('account', { autoLogin,language});
      setAuthority('user');
      reloadAuthorized();
      yield put({ type: 'save', payload: {loginStatus:false} });
      yield put({type: 'global/save',payload:{currentUser:{}}});
      yield put(routerRedux.push('/index'));
    },
    // *logout(_, { call, put,select }) {
    //   const {lang}=yield select(models=>models.common);
    //   yield call(common, { netUrl: LOGOUT.url });
    //   const admin=store.get("account")||{};
    //   const { autoLogin=false ,language=lang} = admin;
    //   store.set('account', { autoLogin,language});
    //   reloadAuthorized();
    //   yield put({ type: 'save', payload: {loginStatus:false} });
    //   // const currentPageUrl=window.location.href;
    //   // if(currentPageUrl.includes("/exception")){
    //   //   yield put(routerRedux.push('/user/login'));
    //   //   return;
    //   // }
    //   // yield put(routerRedux.push({pathname:'/user/login',search:stringify({redirect:currentPageUrl.replace(`/${adminType}`,"")})}));
    // },
    *getCaptcha({ payload }, { call, put }) {
      const { phone } = payload;
      const netUrl = phone ? GET_POHNE_CAPTCHA.url : GET_WEBPAGE_CAPTCHA.url;
      const response = yield call(handleArticles, { ...payload, netUrl, t: new Date().getTime() });
      if (!response.status) return;
      const captcha = response.item;
      yield put({ type: 'save', payload: {captcha} });
    },
  },

  reducers: {
    save(state,action){
      return {...state,...action.payload}
    },
  },
};
