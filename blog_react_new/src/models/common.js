import React from 'react';
import { common} from '@/services/api';
import { message, Modal } from 'antd';
import { SystemEnum, UrlEnum } from '@/assets/Enum';
import LangConfig from '@/assets/LangConfig';

const { LetterAPI, ReviewAPI, OrderAPI } = UrlEnum;
const { CommonLang: { ACTION } } = LangConfig;

export default {
  namespace: 'common',
  state: {
    total: 10,
    list: [],
    index: 1,
    size: 10,
    lang: "zh_CN",
    formItem: {},
  },
  effects: {
    *handle({ payload, callback}, { call, put, select }) {
      // console.log("common",window.g_app._store.getState().common)
      const { index: pageIndex, size: pageSize, lang } = yield select(models => models.common);
      const { netUrl, index = pageIndex, size = pageSize, condition: netQueryCondition, manager_type } = payload;
      const position = netUrl.lastIndexOf("/") + 1;
      let action = netUrl.substring(position);
      let response = yield call(common, { ...payload, ...netQueryCondition, size, index, t: new Date().getTime() });
      // if (!response) return;
      if (!response.status) {
        yield put({ type: 'save', payload: { formItem: {} } });
        return;
      }
      if (callback) {
        callback(response);
        return;
      }
      if (action === "form") {
        yield put({ type: 'save', payload: { formItem: response.item } });
        return;
      }
      if (action !== "list") {
        const specialUrl = [LetterAPI.BASE_URL, ReviewAPI.BASE_URL, OrderAPI.BASE_URL];
        const baseUrl = netUrl.substring(0, position - 1);
        if (specialUrl.includes(baseUrl)){
          yield put({ type: 'global/fetchNotices' });
          const specialPathname=["letter","commodityevaluation","orderlist"];
          const pathnameArr=window.location.pathname.split("/");
          if(!specialPathname.includes(pathnameArr[pathnameArr.length-1])) return;
        } 
        const { Action_POS } = SystemEnum;
        action = Action_POS[action.toUpperCase()][lang] || ACTION[lang];
        // if (!action) action = ACTION[lang];
        const { success, error } = response;
        if (success.length && !error.length) {
          const tip = success.pop().message;
          message.success(success.length > 1 ? `批量${tip}` : tip, 1);
        }
        if (!success.length && error.length) {
          const content = error.map(i => <p>{`【${i.name}】：`}<b style={{ color: "red" }}>{i.message}</b></p>);
          const title = `${error.length > 1 ? `【批量${action}】失败` : `【${action}】失败`}！`
          Modal.error({ title, content });
        }
        if (success.length && error.length) {
          const content = error.map(i => <p>{`【${i.name}】：`}<b style={{ color: "red" }}>{i.message}</b></p>);
          const title = `${success.length}项成功${action}，${error.length}项失败！原因：`;
          Modal.warning({ title, content });
        }
        response = yield call(common, { ...netQueryCondition, manager_type, netUrl: `${baseUrl}/list`, index, size, t: new Date().getTime() });
      }
      const { total } = response;
      const maxIndex = Math.ceil(total / size);
      const actualIndex = maxIndex > index ? index : maxIndex < 1 ? 1 : maxIndex;
      yield put({ type: 'save', payload: { ...response,index: actualIndex, size, formItem: {} } });
    },
  },
  reducers: {
    save(state, action) {
      const { payload } = action;
      return { ...state, ...payload };
    },
    saveLang(state, action) {
      const { payload: { language = "zh-CN" } } = action;
      const lang = (language === "zh-CN" || language === "zh_CN") ? "zh_CN" : "en_US";
      return { ...state, lang }
    },
  },
};
