import axios from 'axios';

export default class UserArticle {
  list({conditionQuery={},...params}={}){
    return axios.post(`/api/user/article/list`,{
      conditionQuery,
      ...params
    })
  }
  content(params){
    return axios.post(`/api/user/article/content`,{
      ...params
    })
  }
}