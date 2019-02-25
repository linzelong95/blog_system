import { handleArticles } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { serialize, rsa ,getPageQuery} from '@/utils/utils';
import { UrlEnum } from '@/assets/Enum';

const { AccountAPI: { REGISTER } } = UrlEnum;

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const {password}=payload;
      const md5Pwd =serialize(password);
      const response = yield call(handleArticles, {...payload,password:md5Pwd,netUrl:REGISTER.url});
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
