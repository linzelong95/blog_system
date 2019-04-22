import JSEncrypt from 'jsencrypt';
import md5 from 'crypto-js/md5';
import utf8 from 'crypto-js/enc-utf8';
import hex from 'crypto-js/enc-hex';
import { parse} from 'qs';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function serialize(value) {
  return md5(value.toString(utf8)).toString(hex).replace('-', '');
}

export function rsa(value, publicKey) {
  const Encrypt = new JSEncrypt();
  Encrypt.setPublicKey(publicKey);
  return Encrypt.encrypt(value);
}