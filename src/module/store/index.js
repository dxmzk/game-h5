/**
 * Author: Meng
 * Date: 2024-03-09
 * Desc: 存储数据 -
 */

const ACCOUNT = 'account_data_info'; // 账号
const OPEN_DATE = 'app_open_date'; // 
const CHAT = 'app_chat_list'; // 
const SHOP = 'cur_shop_info'; // 店铺
const TOKEN = 'account_token'; //


function formatNum(num) {
  return `${num > 9 ? '':'0'}${num}`;
}

// 获取登录信息
export function getAccountInfo() {
  return wx.getStorageSync(ACCOUNT);
}
// 设置登录信息
export function saveAccountInfo(data) {
  wx.setStorageSync(ACCOUNT, data);
  if (data && data.token) {
    wx.setStorageSync(TOKEN, data.token);
  }
}

// 判断是否登录
export function hasLogin() {
  return wx.getStorageSync(ACCOUNT);
}

/**
 * 检测是否登录
 * @param {*} isLogin
 * @param {*} params {action: '', data: {}}
 */
export function checkLogin(isLogin, params) {
  const login = hasLogin();
  if (!login && isLogin) {
    let url = '/pages/my/login/login';
    if (typeof params == 'string') {
      url += `?action=${params}`;
    } else if (typeof params == 'object') {
      let querys = [];
      for (const key in params) {
        const value = params[key];
        querys.push(`key=${value}`);
      }
      url += `?${querys.join('&')}`;
    }
    wx.navigateTo({ url });
  }
  return login;
}

// 获取Token
export function getAppToken() {
  return wx.getStorageSync(TOKEN);
}

// 获取聊天信息
export function getChatList() {
  return wx.getStorageSync(CHAT)||[];
}
// 设置聊天信息
export function saveChatList(data = {}) {
  wx.setStorage({ key: CHAT, data });
}


// 获取聊天信息
export function updateChats() {
  const lastDate = wx.getStorageSync(OPEN_DATE);
  
  const date = new Date();
  const year = date.getFullYear();
  const month = formatNum(date.getMonth()+1);
  const day = formatNum(date.getDate());
  const newDate = `${year}${month}${day}`;
  if(lastDate != newDate) {
    saveChatList([])
  }
  wx.setStorage({ key: OPEN_DATE, data: newDate });
}

// 获取店铺信息
export function getShopInfo() {
  return wx.getStorageSync(SHOP);
}
// 设置店铺信息
export function saveShopInfo(data) {
  wx.setStorage({ key: SHOP, data });
}

export function clearAccount() {
  wx.removeStorage({ key: ACCOUNT });
  wx.removeStorage({ key: TOKEN });
}
