import axios from 'axios';
import { stringify } from 'qs';
import $store from '../vuex';
import $router from '../router';
import { Modal } from 'ant-design-vue';
const $error = Modal.error;

axios.defaults.withCredentials = true;

export default function request(url, data = {}, method = "post") {
  let paramObj = { method, data: { ...data, t: Date.now() }, url };
  if (method === "get") paramObj = { method, url: `${url}?${stringify(data)}` };
  return axios(paramObj)
    .then(res => res.data)
    .catch(e => {
      // const {response,request,message,config}=e;
      const { status, data: { message, needRedirect } } = e.response;
      $error({ title: message });
      if (status === 401) {
        if (needRedirect) {
          $store.dispatch({ type: "login/logout" });
        } else {
          $router.push("/homepage");
        }
      }
    });
}
