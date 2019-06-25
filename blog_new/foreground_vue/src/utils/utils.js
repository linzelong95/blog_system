import JSEncrypt from 'jsencrypt';
import md5 from 'crypto-js/md5';
import utf8 from 'crypto-js/enc-utf8';
import hex from 'crypto-js/enc-hex';
import { parse } from 'qs';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function isMobile() {
  return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
}


export function serialize(value) {
  return md5(value.toString(utf8)).toString(hex).replace('-', '');
}

export function rsa(value, publicKey) {
  const Encrypt = new JSEncrypt();
  Encrypt.setPublicKey(publicKey);
  return Encrypt.encrypt(value);
}

export function getRandomColor(){
  const colorArr=["#f50","#2db7f5","#87d068","#108ee9","#6fa1d1","#f84d78","#de7b5d","#4c9447"];
  return colorArr[Math.floor(Math.random()*(colorArr.length-1))];
}