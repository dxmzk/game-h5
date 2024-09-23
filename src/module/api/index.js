/**
 * Author: Meng
 * Date: 2024-03-09
 * Desc: 请求Apis
 */
import { request } from '../network/index';

// 获取首页列表
// export function test(data = {}) {
//   return request({
//     url: '/photo/list',
//     method: 'POST',
//     data,
//   });
// }

// 获取微信id
export function queryWXUnionid(data = {}) {
  return request({
    url: '/account/wxUnionid',
    method: 'GET',
    data,
  });
}

// 微信登录
export function wechatLogin(data = {}) {
  return request({
    url: '/account/wxLogin',
    method: 'POST',
    data,
  });
}

// 微信登录
export function updateAccount(data = {}) {
  return request({
    url: '/account/update',
    method: 'POST',
    data,
  });
}
// 获取管理商家
export function queryShopByUid(uid=0) {
  return request({
    url: `/shop/list?uid=${uid}`,
    method: 'GET',
    data:{},
  });
}

// 添加商家
export function createShop(data = {}) {
  return request({
    url: '/shop/create',
    method: 'POST',
    data,
  });
}

// 获取商家角色
export function queryShopRole(uid = 0) {
  return request({
    url: `/staff/queryByUid?uid=${uid}`,
    method: 'GET',
    data: {},
  });
}

// 获取店员
export function queryShopStaff(sid = 0) {
  return request({
    url: `/staff/list?sid=${sid}`,
    method: 'GET',
    data: {},
  });
}

// 新加消息模版
export function createStaff(data={}) {
  return request({
    url: '/staff/create',
    method: 'POST',
    data,
  });
}

// 修改消息模版
export function updateStaff(data={}) {
  return request({
    url: '/staff/update',
    method: 'POST',
    data,
  });
}

// 获取消息模版
export function queryShopEvent(sid = 0) {
  return request({
    url: `/event/list?sid=${sid}`,
    method: 'GET',
    data: {},
  });
}

// 创建/更改座位
export function updateOrCreateEvent(data = {}) {
  let url = '/event/create';
  if(data.id) {
    url = '/event/update'
  }
  return request({
    url,
    method: 'POST',
    data,
  });
}

// 获取商家桌位
export function queryShopTables(sid = 0) {
  return request({
    url: `/seat/list?sid=${sid}`,
    method: 'GET',
    data: {},
  });
}


// 更改座位状态 
export function updateTabelStatus(data = {}) {
  return request({
    url: '/seat/update',
    method: 'POST',
    data,
  });
}

// 创建/更改座位
export function createShopTable(data = {}) {
  let url = '/seat/create';
  if(data.id) {
    url = '/seat/update'
  }
  return request({
    url,
    method: 'POST',
    data,
  });
}

// 意见反馈 
export function addFeedback(data = {}) {
  return request({
    url: '/client/feedback',
    method: 'POST',
    data,
  });
}