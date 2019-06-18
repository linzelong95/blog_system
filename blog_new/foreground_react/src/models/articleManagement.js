import { handleArticles } from '@/services/api';
import { message } from 'antd';


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
      const { index: pageIndex, size: pageSize } = yield select(models => models.articleManagement);
      const { netUrl, index = pageIndex, size = pageSize, conditionQuery } = payload;
      const position = netUrl.lastIndexOf("/") + 1;
      const action = netUrl.substring(position);
      let response = yield call(handleArticles, { ...payload, size, index, t: Date.now() });
      if (!response) return;
      if (callback) { callback(response); return; }
      if (!action.includes("list")) {
        message.success("操作成功");
        const baseUrl = netUrl.substring(0, position - 1);
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
