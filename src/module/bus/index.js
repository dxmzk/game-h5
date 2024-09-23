/**
 * Author: Meng
 * Date: 2024-03-09
 *
 */

export const BusKey = {
  login: 'app_login',
  webSocket: 'web_socket_key',
}

export default class Bus {
  static _event_list = []; // 事件集合

  // 事件注册 {key: '事件名次', callback: '事件回调函数', tag: '事件标识',type: '事件类型1单次2普通'}
  static add(key, callback, tag, type) {
    if (!key || !callback) {
      console.warn('------> bus add error key:', key);
      return;
    }
    this._event_list = this._event_list.filter(
      (e) => e.key != key || e.tag != tag
    );
    this._event_list.push({ key, callback, tag, type });
  }

  // 订阅单次事件
  static once(key, callback, tag) {
    this.add(key, callback, tag, 1);
  }

  // 发送消息
  static send(key, data, delay = 0) {
    if (delay > 0) {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        this._sendMsg(key, data);
      }, delay);
    } else {
      this._sendMsg(key, data);
    }
  }
  // 具体发送
  static _sendMsg(key, data) {
    this._event_list.forEach((e) => {
      if (e.key == key) {
        e.callback && e.callback(data);
      }
    });
    this._event_list = this._event_list.filter(
      (e) => e.key != key || e.type != 1
    );
  }

  // 移除消息
  static remove({ key, tag, callback } = {}) {
    if (key) {
      this._event_list = this._event_list.filter(
        (e) => e.key != key || e.tag != tag
      );
    } else {
      this._event_list = this._event_list.filter((e) => e.callback != callback);
    }
  }
  // 清除
  static clear() {
    Bus._event_list = [];
  }
}
