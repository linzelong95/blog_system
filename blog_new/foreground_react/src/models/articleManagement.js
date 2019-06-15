import React from 'react';
import { handleArticles } from '@/services/api';
import { message, Modal } from 'antd';
import { SystemEnum, UrlEnum } from '@/assets/Enum';
import LangConfig from '@/assets/LangConfig';

const { CommonLang: { ACTION } } = LangConfig;

export default {
  namespace: 'articleManagement',
  state: {
    total: 10,
    list: [],
    index: 1,
    size: 10,
    lang: "zh_CN",
    formItem: {},
  },
  effects: {
    *handleArticles({ payload, callback }, { call, put, select }) {
      const { index: pageIndex, size: pageSize, lang } = yield select(models => models.articleManagement);
      const { netUrl, index = pageIndex, size = pageSize, conditionQuery } = payload;
      const position = netUrl.lastIndexOf("/") + 1;
      let action = netUrl.substring(position);
      let response = yield call(handleArticles, { ...payload, size, index, t: Date.now() });
      if (!response) return;
      if (callback) { callback(response); return; }
      if (!action.includes("list")) {
        // const specialUrl = [LetterAPI.BASE_URL, ReviewAPI.BASE_URL, OrderAPI.BASE_URL];
        const baseUrl = netUrl.substring(0, position - 1);

        // if (specialUrl.includes(baseUrl)){
        //   yield put({ type: 'global/fetchNotices' });
        //   const specialPathname=["letter","commodityevaluation","orderlist"];
        //   const pathnameArr=window.location.pathname.split("/");
        //   if(!specialPathname.includes(pathnameArr[pathnameArr.length-1])) return;
        // } 
        // const { Action_POS } = SystemEnum;
        // action = Action_POS[action.toUpperCase()][lang] || ACTION[lang];
        // const { success, error } = response;
        // if (success.length && !error.length) {
        //   const tip = success.pop().message;
        //   message.success(success.length > 1 ? `批量${tip}` : tip, 1);
        // }
        // if (!success.length && error.length) {
        //   const content = error.map(i => <p>{`【${i.name}】：`}<b style={{ color: "red" }}>{i.message}</b></p>);
        //   const title = `${error.length > 1 ? `【批量${action}】失败` : `【${action}】失败`}！`
        //   Modal.error({ title, content });
        // }
        // if (success.length && error.length) {
        //   const content = error.map(i => <p>{`【${i.name}】：`}<b style={{ color: "red" }}>{i.message}</b></p>);
        //   const title = `${success.length}项成功${action}，${error.length}项失败！原因：`;
        //   Modal.warning({ title, content });
        // }

        // 如果删除的那一页刚好没有list，那么要将页数往前移动
        let tempIndex = index;
        do {
          response = yield call(handleArticles, { conditionQuery, netUrl: `${baseUrl}/list`, index: tempIndex, size, t: Date.now() });
          if (!response) return;
          tempIndex--;
        } while (tempIndex > 0 && response.list && !response.list.length);
        // 考虑添加时自动将页数往后移动？
      }
      const { total } = response;
      const maxIndex = Math.ceil(total / size);
      const actualIndex = maxIndex > index ? index : maxIndex < 1 ? 1 : maxIndex;
      yield put({ type: 'save', payload: { ...response, index: actualIndex, size } });
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
