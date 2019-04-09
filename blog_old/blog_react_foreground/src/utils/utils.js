import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';
import md5 from 'crypto-js/md5';
import utf8 from 'crypto-js/enc-utf8';
import hex from 'crypto-js/enc-hex';
import JSEncrypt from 'jsencrypt';
import ExportJsonExcel from "js-export-excel";

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          styles={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            lineHeight: 20,
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}


// md5序列化
export function serialize(value) {
  return md5(value.toString(utf8)).toString(hex).replace('-', '');
}

// RSA加密
export function rsa(value, publicKey) {
  const Encrypt = new JSEncrypt();
  Encrypt.setPublicKey(publicKey);
  return Encrypt.encrypt(value);
}

// RSA解密
// export function rsa_back(value, publicKey) {
//   const Encrypt = new JSEncrypt();
//   Encrypt.setPrivateKey(PrivateKey);
//   return Encrypt.decrypt(value);
// }


export const getRandomColor=()=>{
  const colorArr=["#f50","#2db7f5","#87d068","#108ee9","#6fa1d1","#f84d78","#de7b5d","#4c9447"];
  return colorArr[Math.floor(Math.random()*(colorArr.length-1))];
}




/**
 * 导出数据
 *
 * @export
 * @param {Array} sheetHeader 标题行(别名)
 * @param {Array} sheetFilter 标题行（属性，用于过滤内容,当sheetData子元素为object时，才起作用）
 * @param {Array} sheetData 数据行
 * @param {String} fileName 生成的文件名
 * @param {String} sheetName 表名
 */
export const exportToExcel = (sheetHeader, sheetFilter = [], sheetData, fileName, sheetName, ) => {
  const option = { fileName, datas: [{ sheetData, sheetName, sheetFilter, sheetHeader }] };
  new ExportJsonExcel(option).saveExcel();
}

/**
 * 格式化时间
 *
 * @export
 * @param {Number} value 毫秒数，为0时表示获取此刻时间
 */
export const timeFormat = (value) => {
  const dd = value ? new Date(value) : new Date();
  const y = dd.getFullYear();
  let m = dd.getMonth() + 1;
  let d = dd.getDate();
  let h = dd.getHours();
  let mm = dd.getMinutes()
  m = m.toString().length === 1 ? `0${m}` : m;
  d = d.toString().length === 1 ? `0${d}` : d;
  h = h.toString().length === 1 ? `0${h}` : h;
  mm = mm.toString().length === 1 ? `0${mm}` : mm;
  return `${y}-${m}-${d} ${h}:${mm}`;
}

export const generateUrls = (baseUrl,urlNameArr) => {
  const {zh_CN,en_US,BASE_URL}=baseUrl;
  const itemAPI={BASE_URL};
  urlNameArr.forEach(i=>{
    switch(i){
      case "LIST":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`,desc: { zh_CN, en_US }};break;
      case "FORM":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`,desc: { zh_CN: "编辑", en_US: "edit" },actionTip: { zh_CN: "将处于可编辑状态，编辑时请注意核对！", en_US: "will be under editing. Please pay attention for information!" }};break;
      case "INSERT":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`, desc: { zh_CN: "添加", en_US: "insert" }, actionTip: { zh_CN: "", en_US: "" }};break;
      case "UPDATE":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`, desc: { zh_CN: "更新", en_US: "update" }, actionTip: { zh_CN: "", en_US: "" }};break;
      case "DELETE":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`, desc: { zh_CN: "删除", en_US: "delete" }, actionTip: { zh_CN: "将被删除", en_US: "will be deleted!" }};break;
      case "REMOVE":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`, desc: { zh_CN: "永删", en_US: "remove" }, actionTip: { zh_CN: "将被删除，且删除后无法恢复！", en_US: "will be removed,and can not be recovered!" } };break;
      case "REVERT":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`, desc: { zh_CN: "还原", en_US: "revert" }, actionTip: { zh_CN: "将被还原！", en_US: "will be recovered!" }};break;
      case "LOCK":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`,desc: { zh_CN: "锁定", en_US: "lock" }, actionTip: { zh_CN: "将被锁定，锁定后可以解锁和删除，但不可编辑！", en_US: "will be lock,and then  can be released  or deleted, but can not be edited!" }};break;
      case "UNLOCK":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`,desc: { zh_CN: "解锁", en_US: "unlock" }, actionTip: { zh_CN: "将被解锁，解锁后可编辑和锁定,但不可删除！", en_US: "will be released,and then can be edited or locked,but can not be deleted!" }};break;
      case "SALEON":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`,desc: { zh_CN: "上架", en_US: "saleon" }, actionTip: { zh_CN: "将被上架！", en_US: "will be put on sale!" }};break;
      case "SALEOFF":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`, desc: { zh_CN: "下架", en_US: "saleoff" }, actionTip: { zh_CN: "将被下架", en_US: "will be pulled off shelves!" }};break;
      case "CHECKPASS":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`,desc: { zh_CN: "过审", en_US: "approve" }, actionTip: { zh_CN: "将审核通过！", en_US: "will be approved" }};break;
      case "CHECKUNPASS":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`, desc: { zh_CN: "拒审", en_US: "reject" }, actionTip: { zh_CN: "将审核不通过", en_US: "will be rejected" }};break;
      case "RECORD":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`,desc: { zh_CN: "备案", en_US: "record" }, actionTip: { zh_CN: "将申请备案！", en_US: "prepare for putting on a record!" } };break;
      case "RE_RECORD":itemAPI[i]={url:`${BASE_URL}/record}`,desc: { zh_CN: "重新备案", en_US: "re-record" }, actionTip: { zh_CN: "将重新申请备案！", en_US: "will prepare for putting on a record again!" } };break;
      case "RECORDPASS":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`, desc: { zh_CN: "备案通过", en_US: "recordpass" }, actionTip: { zh_CN: "备案通过！", en_US: "will be approved" } };break;
      case "RECORDUNPASS":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`, desc: { zh_CN: "备案不过", en_US: "recordunpass" }, actionTip: { zh_CN: "备案不通过！", en_US: "will be rejected" }};break;
      case "ACT":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`, desc: { zh_CN: "启用", en_US: "act" }, actionTip: { zh_CN: "将被启用，启用后在活动未开始前可停用！", en_US: "will be used,and then can be stop before the activity starting!" } };break;
      case "UNACT":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`,desc: { zh_CN: "停用", en_US: "unact" }, actionTip: { zh_CN: "将被停用，停用后可编辑、启用和删除！", en_US: "will be stop,and then can be edited,used or deleted!" }};break;
      case "CLOSE":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`,  desc: { zh_CN: "关闭", en_US: "close" }, actionTip: { zh_CN: "将被关闭，关闭后不可恢复！", en_US: "will be closed,and then can not be recovered!" }};break;
      case "SEND":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`,desc: { zh_CN: "发货", en_US: "delivery" }, actionTip: { zh_CN: "将发货！", en_US: "will be sent out!" }};break;
      case "CONFIRM":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`,desc: { zh_CN: "确认", en_US: "confirm" }, actionTip: { zh_CN: "将被确认！", en_US: "will be confirmed!" } };break;
      case "COMPLETE":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`, desc: { zh_CN: "完成", en_US: "complete" }, actionTip: { zh_CN: "将完成！", en_US: "will be complete!" } };break;
      case "READ":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`, desc: { zh_CN: "置为已读", en_US: "make read" } , actionTip: { zh_CN: "", en_US: "" }};break;
      case "DETAIL":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`,desc: { zh_CN: "详情", en_US: "detail" }, actionTip: { zh_CN: "", en_US: "" }};break;
      case "TOP":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`,desc: { zh_CN: "置顶", en_US: "up" }, actionTip: { zh_CN: "将被置顶，置顶后，在评论显示的状态下可取消置顶！", en_US: "will be stuck,and then can be downed when being shown!" }};break;
      case "UNTOP":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`, desc: { zh_CN: "取置", en_US: "down" }, actionTip: { zh_CN: "将被取消置顶，取消置顶后，在评论显示的状态下可重新置顶！", en_US: "will be downed,and then can be stuck when being shown!" }};break;
      case "SHOW":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`, desc: { zh_CN: "显示", en_US: "show" }, actionTip: { zh_CN: "将被展示，展示后可重新隐藏！", en_US: "will be shown,and then can be hidden after being shown!" } };break;
      case "UNSHOW":itemAPI[i]={url:`${BASE_URL}/${i.toLowerCase()}`, desc: { zh_CN: "隐藏", en_US: "hide" }, actionTip: { zh_CN: "将被隐藏，隐藏后可重新设置显示！", en_US: "will be hidden,and then can be shown after being hidden!" }};break;

      default:break;
    }
  });
  return itemAPI;
}

