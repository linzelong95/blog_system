import axios from 'axios';

export default class UserArticle {
  list({conditionQuery={},...params}={}){
    return axios.post('http://127.0.0.1:7001/user/article/list',{
      conditionQuery,
      ...params
    })
  }
}