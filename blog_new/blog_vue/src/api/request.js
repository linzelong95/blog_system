import axios from 'axios';
import { stringify } from 'qs';
import $store from '../vuex';
import $router from '../router';
import { Modal} from 'ant-design-vue';
const $error=Modal.error;

export default function request(url,data={},method="post"){
  $store.dispatch({type:"toggleSpinnig",payload:{spinningFlag:true}});
  let paramObj={method,data,url};
  if(method==="get") paramObj={method,url:`${url}?${stringify(data)}`};
  return axios(paramObj)
    .then(res=>{
      $store.dispatch({type:"toggleSpinnig",payload:{spinningFlag:false}});
      return res.data;
    })
    .catch(e => {
      // console.log(1111,e.response)
      // console.log(2222,e.request)
      // console.log(3333,e.message)
      // console.log(4444,e.config)
      const {status,data:{message,needRedirect}}=e.response;
      $store.dispatch({type:"toggleSpinnig",payload:{spinningFlag:false}});
      if (status === 401) {
        $error({title:message});
        if(needRedirect) $router.push('/login');
      }
    });
}
