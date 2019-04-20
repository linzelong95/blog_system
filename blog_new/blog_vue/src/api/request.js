import axios from 'axios';
import vm from '../main';

console.log(111,vm);//第一次发起网络请求是undefined。 

export default function request(url,data={},method="post"){
  // vm.$store.dispatch({type:"toggleSpinnig",payload:{spinning:true}});
  let newUrl=url;
  const paramObj={method,data};
  if(method==="get"){
    delete paramObj.data;
    let queryStr="";
    Object.keys(data).forEach(key=>{
      queryStr+=`${key}=${data[key]}&`;
    });
    if(queryStr) newUrl=`${url}?${queryStr.substring(0,queryStr.length-1)}`;
  }
  return axios(newUrl,paramObj)
    .then(res=>{
      // vm.$store.dispatch({type:"toggleSpinnig",payload:{spinning:false}});
      return res.data;
    })
    .catch(e => {
      console.log(e)
      // Error: Request failed with status code 404
      //   at createError (createError.js?8774:16)
      //   at settle (settle.js?268d:18)
      //   at XMLHttpRequest.handleLoad (xhr.js?9456:77)
      const status = e.name;
      // vm.$store.dispatch({type:"toggleSpinnig",payload:{spinning:false}});
      if (status === 401) {
        // vm.$router.push("/login");
        return;
      }
      // vm.$message.error("请求出错");
    });
}
