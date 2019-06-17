import axios from 'axios';
import { stringify } from 'qs';
import $store from '../vuex';
import { Modal } from 'ant-design-vue';
const $error = Modal.error;

export default function request(url, data = {}, method = "post") {
  let paramObj = { method, data, url };
  if (method === "get") paramObj = { method, url: `${url}?${stringify(data)}` };
  return axios(paramObj)
    .then(res => res.data)
    .catch(e => {
      // console.log(1111,e.response)
      // console.log(2222,e.request)
      // console.log(3333,e.message)
      // console.log(4444,e.config)
      const { status, data: { message, needRedirect } } = e.response;
      $error({ title: message });
      if (status === 401 && needRedirect) $store.dispatch({ type: "login/logout" });
    });
}
