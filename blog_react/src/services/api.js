import request from '@/utils/request';
import {apiPrefix} from '@/defaultSettings'
import { stringify } from 'qs';


export const beforeAccount = async ({netUrl,...body}) => request(`${apiPrefix}${netUrl}`, { body },false);

export const common = async ({netUrl,...body}) => request(netUrl, { body })



// 获取模块信息
export async function getModuleInfo() {
  return request( `/activity/module/index.json`, { method: 'GET' }, false)
}

// 获取模块
export async function getModule(name) {
  return request(`/activity/module/${name}.html`, { method: 'GET' }, false);
}

export async function getIconFont() {
  return request(`http://at.alicdn.com/t/font_965969_x0cmuwsde9.css`, { method: 'GET',credentials:"same-origin" }, false);
}

export async function getArticles(body) {
  return request(`/api/index`, { method: 'POST',body}, false);
}


export async function handleArticles({netUrl,...body}) {
  return request(netUrl, { body}, false);
}
