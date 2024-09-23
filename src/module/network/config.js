/**
 * Author: Meng
 * Date: 2024-03-09
 * 网络配置项
 */

import Configs from "../../config/index";
import { getAppToken } from "../store/index";

// 获取地址
export function getWebPath(host='api', env = Configs.env) {
  const url = HostConfig[env][host];
  return url;
}

// 设置环境 0prod, 1test, 2dev
export function setAppEnv(num = 0) {
  const index = num > 2 ? 0 : num;
  Configs.env = index == 0 ? 'prod' : index == 1 ? 'test' : 'dev';
}

// 获取对应请求地址
export function requestHost(host = 'api', env = Configs.env) {
  const url = HostConfig[env][host];
  return url;
}

// 请求头设置
export function mergeHeaders(header = {}) {
  header.token = getAppToken();
  return header;
}

// 请求参数设置
export function mergeParams(params = {}, host) {
  return params;
}

// 数据服务地址
const HostConfig = {
  prod: {
    ws: 'wss://test.com/demo/link',
    def: 'https://test.com/demo',
    auth: 'https://localhost.com',
  },
  test: {
    ws: 'ws://localhost:8080/link',
    def: 'http://localhost:8080', // localhost
    auth: 'http://localhost.com',
  },
};
