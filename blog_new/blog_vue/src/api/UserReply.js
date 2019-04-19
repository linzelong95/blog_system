import axios from 'axios';

export default class UserReply {
  list({conditionQuery={},...params}={}){
    return axios.post(`/api/user/reply/list`,{
      conditionQuery,
      ...params
    })
  }
}