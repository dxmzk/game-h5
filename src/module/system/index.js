/**
 * Author: Meng
 * Date: 2024-03-09
 * Desc: 系统API
 */

import {
  authorize,
  Scope
} from "../auth/index";

const cacheData = {
  lat: 0,
  lng: 0,
  last: Date.now(),
};

export function curLocation(options={}) {
  const last = cacheData.last;
  return new Promise(async (resolve) => {
    if (cacheData.lat < 1 || DataCue.now() - last > 180000) {
      const { status } = await authorize(Scope.location);
      if (status) {
        wx.getLocation({
          ...options,
          success: (res) => {
            console.log(res);
            if (res.latitude > 0) {
              cacheData.lat = res.latitude;
              cacheData.lng = res.longitude;
            }
            resolve(cacheData);
          },
          fail: (err) => {
            console.log('getLocation', err);
            resolve(null);
          }
        });
      }else {
        console.log('getLocation', '没有权限');
        resolve(null);
      }
    } else {
      resolve(cacheData);
    }
  });
}

export function chooseLocation(options={}) {
  return new Promise(async (resolve) => {
    const { status } = await authorize(Scope.location);
    if (status) {
      wx.chooseLocation({
        ...options,
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          console.log('chooseLocation', err);
          resolve(null)
        }
      });
    }else {
      console.log('chooseLocation', '没有权限');
    }
  });
}

export function chooseImage(options={}) {
  return new Promise((resolve) => {
    wx.chooseMedia({
      ...options,
      mediaType: ['image'],
      success: (res) => {
        const files = res.tempFiles;
        resolve(files);
      },
      fail: (err) => {
        console.log('chooseImage', err);
        resolve(null);
      }
    });
  });
}