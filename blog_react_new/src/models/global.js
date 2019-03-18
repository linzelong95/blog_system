import { common } from '@/services/api';
import { UrlEnum, MessageEnum, OrderEnum } from '@/assets/Enum';
import LangConfig from '@/assets/LangConfig';

const { LetterAPI, ReviewAPI, OrderAPI } = UrlEnum;
const { LetterType } = MessageEnum;
const { OrderStatus } = OrderEnum;
const {
  ReviewLang: { REVIEW_GIVE_FIRST_COMMENT, REVIEW_GIVE_SECOND_COMMENT },
  OrderLang: { ORDER_NO },
} = LangConfig;

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    notifyCount:0,
    currentUser: {},
  },

  effects: {
    *fetchNotices(_, { call, put, all, select }) {
      const { lang } = yield select(models => models.common);
      const params = { is_wait_deal: 1, t: new Date().getTime() };
      const [letters = {}, reviews = {}, orders = {}] = yield all([
        call(common, { ...params, netUrl: LetterAPI.LIST.url }),
        call(common, { ...params, netUrl: ReviewAPI.LIST.url }),
        call(common, { ...params, netUrl: OrderAPI.LIST.url })
      ]);
      const { total: letterTotal = 0, list: letterList = [] } = letters;
      const { total: reviewTotal = 0, list: reviewList = [] } = reviews;
      const { total: orderTotal = 0, list: orderList = [] } = orders;
      const notifyCount = letterTotal + reviewTotal + orderTotal;
      const newLetters = letterList.map(i => ({
          ...i,
          type: "letter",
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          datetime: i.send_date,
          extra: LetterType[i.msg_type][lang],
          status: 'processing',
      }));
      const newReviews = reviewList.map(i => ({
          ...i,
          type: "review",
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          datetime: i.ins_date,
          title: `${i.user_name}${i.has_add_to ? REVIEW_GIVE_SECOND_COMMENT[lang] : REVIEW_GIVE_FIRST_COMMENT[lang]}${i.product_name}`,
          description: `${i.level}☆，${i.text}`,
      }));
      const newOrders = orderList.map(i => ({
          ...i,
          type: "order",
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
          datetime: i.add_date,
          title: `${ORDER_NO[lang]}${i.order_no}`,
          // description: "",
          extra: OrderStatus[i.order_status][lang],
          status: 'processing',
      }));
      const notices = [...newLetters, ...newReviews, ...newOrders];
      yield put({ type: 'save', payload: {notices,notifyCount} });
    },

    // 清空某种类型的消息，在layouts/Header.js
    // *clearNotices({ payload }, { put, select }) {
    //   yield put({
    //     type: 'saveClearedNotices',
    //     payload,
    //   });
    //   const count = yield select(state => state.global.notices.length);
    //   yield put({
    //     type: 'changeNotifyCount',
    //     payload: count,
    //   });
    // },
  },

  reducers: {
    save(state,action){
      return {...state,...action.payload}
    },

    // saveClearedNotices(state, { payload }) {
    //   return {
    //     ...state,
    //     notices: state.notices.filter(item => item.type !== payload),
    //   };
    // },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
