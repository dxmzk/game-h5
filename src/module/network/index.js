/**
 * Author: Meng
 * Date: 2024-03-09
 * 网络请求封装
 */
import { mergeHeaders, requestHost, mergeParams } from './config';

let timer_id = 0; // 0可隐藏，1不可隐藏
const min_interval = 600;

// Toast提示
function _toast(title = '', icon = 'none') {
  if (title) {
    try {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        wx.showToast({ title, icon });
      }, 600);
    } catch (error) {
      console.log(error);
    }
  }
}

// 加载框
function _loading(loading, title = '加载中...') {
  if (timer_id) {
    clearTimeout(timer_id);
  }
  if (loading) {
    // 显示
    wx.showLoading({ title, mask: true });
  } else {
    timer_id = setTimeout(() => {
      clearTimeout(timer_id);
      wx.hideLoading();
    }, min_interval);
  }
}

/**  
 * 网络请求
 */
export function request({
  env,
  host,
  url,
  method = 'GET',
  data = {},
  header = {},
  toast = true,
  loading = true,
  loadStr = '加载中...',
  reload = false,
  count = 0,
  maxCount = 3,
} = {}) {
  loading && _loading(loading, loadStr);
  const url2 = requestHost(host, env) + url;
  const header2 = mergeHeaders(header);
  const data2 = mergeParams(data, host);

  const options = { url: url2, data: data2, header: header2, method };

  _pointLog('---> Request: ', options);

  return new Promise((resolve) => {
    const result = { message: '', code: -1, data: null, header: null };
    wx.request({
      ...options,
      success: (res) => {
        _pointLog('---> Response: ' + url, res);
        _parseData(res, result);
      },
      fail: (err) => {
        _pointLog('---> Error: ' + url, err);
        _parseError(err, result);
      },
      complete: () => {
        const curCount = count + 1;

        if (reload && result.code != 0 && count < maxCount) {
          request({
            url,
            data,
            method,
            header,
            loading,
            loadStr,
            toast,
            reload,
            maxCount,
            count: curCount,
          });
        } else {
          loading && _loading(false);
          toast && result.code != 0 && _toast(result.message);
          resolve(result);
          // if (result.code == -3 || result.code == -4) {}
        }
      },
    });
  });
}

// 下载文件
export function download(url) {
  _loading(true, '下载中...');

  return new Promise((resolve) => {
    wx.downloadFile({
      url,
      success: (res) => {
        _pointLog('<--- 下载成功 --->', res);
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve({ code: 0, data: res.tempFilePath });
        } else {
          resolve({
            code: -1,
            message: res.errMsg,
          });
        }
      },
      fail: (err) => {
        _pointLog('<--- 下载错误 --->', err);
        resolve({
          code: -1,
          message: '下载失败',
        });
      },
      complete: () => {
        _loading(false);
      },
    });
  });
}

// 上传多文件
export function uploads(files = []) {
  if (files && files.length > 0) {
    _loading(true, '上传中...');
    return new Promise((resolve) => {
      Promise.all(files.map((e) => upload(e)))
        .then((array) => {
          let data = { all: false, count: array.length, imgs: [] };
          if (array) {
            array.forEach((e) => {
              if (e.code == 0) {
                data.imgs.push(e);
              }
            });
            data.all = data.imgs.length == data.count;
          }
          _loading(false, '');
          resolve({ code: 0, data });
        })
        .catch((err) => {
          console.log(err);
          _loading(false, '');
          resolve({ code: -1003, data: null });
        });
    });
  }
}

// 上传文件
export function upload(file) {
  return new Promise((resolve) => {
    const url = requestHost('oss');
    wx.uploadFile({
      url,
      filePath: file,
      name: 'file',
      formData: { bucket: 'kh' },
      success: (res) => {
        // console.log(res);
        let dataStr = res.data || '{}';
        if (res.statusCode == 200 && dataStr) {
          if (dataStr.indexOf('http:') > -1) {
            dataStr = dataStr.replace('http:', 'https:');
          }
          const info = JSON.parse(dataStr) || {};
          if (info.code == 0 || info.success) {
            resolve({ code: 0, data: info.content });
          } else {
            resolve({ code: info.code, data: null, message: info.msg });
          }
        } else {
          resolve({ code: -1001, data: null });
        }
      },
      fail: (err) => {
        console.log(err);
        resolve({ code: -1002, data: null });
      },
    });
  });
}

// 解析数据
function _parseData(response, result) {
  const res = response.data || {};
  const code = res.code || 404;
  switch (code) {
    case 0:
      result.code = 0;
      result.header = response.header;
      result.data = res.data || res;
      result.message = res.message || 'ok';
      break;
    case 30010:
      result.code = res.code;
      result.message = res.message || '参数有误';
      break;
    case 20010:
      result.code = res.code;
      result.message = res.message || '请求方法错误';
      break;

    default:
      break;
  }
  // return result;
}

// 解析错误
function _parseError(data = {}, result) {
  const code = data.statusCode || 404;
  result.code = code;
  switch (code) {
    case 404:
      result.message = data.errMsg || '服务地址不正确';
      break;
    case 405:
      result.message = res.errMsg || '请求方法错误';
      break;
    case 500:
      result.message = res.errMsg || '服务升级中请稍候！';
      break;
    case 502:
      result.message = res.errMsg || '服务升级中请稍候！';
      break;
    default:
      result.message = res.errMsg || '服务连接错误';
      break;
  }
  // return result;
}

// 打印日志
function _pointLog(tag, msg) {
  console.log(tag);
  console.log(msg);
}
