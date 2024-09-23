/**
 * Author: Meng
 * Date: 2024-03-09
 * Socket 封装
 */
import Bus, { BusKey } from '../bus/index';
import Configs from '../../config/index';
import Constants from '../../config/constants';
import { getChatList, saveChatList } from '../store/index';
import { requestHost } from './config';

let isOpen = false; // 状态
let pingTimer = -1;
let count = 0; // 尝试连接次数
const max = 30; // 最大重连次数

function connect(params = {}) {
  if(isOpen) {
    return
  }
  const {userId, userRole, shopId, seatNum} = Configs;
  if(userId < 1) {
    return
  }
  
  let url = requestHost('ws');
  
  url = `${url}?id=${userId}&room=${shopId}&role=${userRole}&num=${seatNum}`;
  console.log(url)
  wx.connectSocket({
    url,
    header: { 'content-type': 'application/json' },
    data: JSON.stringify(params),
    // protocols: ['protocol1'],
    success: function (res) {
      _log('connect', res);
      _open();
      Constants.chatList = getChatList();
      
    },
    fail: function (err) {
      isOpen = false
      _log('connect err', err.errMsg);
      // _reconnection(); //
    },
  });
}

// 打开
function _open() {
  isOpen = true;
  // 连接成功
  wx.onSocketOpen((res) => {
    // isOpen = true;
    count = 0;
    _log('open', res);
    _ping(`{"tag":0,"pid":${Configs.userId}}`);
  });

  // 消息接收
  wx.onSocketMessage((res) => {
    _log('message', res);
    let data = res.data || ''; // 消息内容
    if (data.includes('pid')) {
      _ping(data);
    } else {
      const msg = JSON.parse(data);
      Bus.send(BusKey.webSocket, msg);
      Constants.chatList.push(msg);
      saveChatList(Constants.chatList);
    }
  });

  // 连接失败 - 尝试重新连接max次
  wx.onSocketError((err) => {
    _log('socketError', err.errMsg);
    _reconnection(); // 关闭
  });

  // 连接关闭
  wx.onSocketClose((res) => {
    isOpen = false;
    _log('WebSocket 已关闭！');
    _reconnection(); // 关闭
  });
}

function _reconnection() {
  close(); // 关闭
  if (count < max) {
    let timer = setTimeout(() => {
      count += 1;
      clearTimeout(timer);
      connect();
    }, 10000);
  }
}

// 心跳
function _ping(data = '') {
  clearTimeout(pingTimer);
  // 
  const timer = setTimeout(() => {
    clearTimeout(timer);
    try {
      wx.sendSocketMessage({ data });
    } catch (error) {
      _log('ping error', error);
    }
  }, 60 * 1000);

  // 3分钟服务器未响应认为连接断开
  pingTimer = setTimeout(() => {
    clearTimeout(pingTimer);
    _log('ping', '服务未响应');
    _reconnection(); // 关闭
  }, 180 * 1000);
}

// 关闭
function close() {
  // wx.closeSocket();
  isOpen = false;
  wx.closeSocket({
    code: 1000,
    success: (res) => {
      _log('close', res);
    },
    fail: (err) => {
      _log('close err', err.errMsg);
    },
  });
}

// 发送
function send(data = {}) {
  if (isOpen) {
    const msg = { ...data, fromId: Configs.userId };
    Constants.chatList.push(msg);
    saveChatList(Constants.chatList);
    wx.sendSocketMessage({
      data: JSON.stringify(msg),
      success: (res) => {
        _log('send', res);
      },
      fail: (err) => {
        _log('send err', err.errMsg);
      },
    });
  } else {
    connect();
    _log('send', '服务尚未连接');
  }
}

// 打印日志
function _log(tag, msg) {
  console.log(tag, msg);
}

const WS = {
  connect,
  close,
  send,
};

export default WS;
