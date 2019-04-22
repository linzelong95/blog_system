import axios from 'axios';
import { stringify } from 'qs';
import vm from '../main';

export default function request(url,data={},method="post"){
  // vm.$store.dispatch({type:"toggleSpinnig",payload:{spinning:true}});
  let paramObj={method,data,url};
  if(method==="get") paramObj={method,url:`${url}?${stringify(data)}`};
  return axios(paramObj)
    .then(res=>{
      // vm.$store.dispatch({type:"toggleSpinnig",payload:{spinning:false}});
      return res.data;
    })
    .catch(e => {
      // console.log(1111,e.response)
      // console.log(2222,e.request)
      // console.log(3333,e.message)
      // console.log(4444,e.config)
      const {status}=e.response;
      // vm.$store.dispatch({type:"toggleSpinnig",payload:{spinning:false}});
      if (status === 401) {
        // vm.$router.push("/login");
        return;
      }
      // vm.$error({title:"请求出错"});
      // alert(e.message)
    });
}
