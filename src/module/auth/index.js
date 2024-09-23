/**
 * Author: Meng
 * Date: 2024-03-09
 * Desc: 权限申请
 */

export const Scope = {
  /** 是否授权用户信息 */
  userInfo: 'scope.userInfo',
  /** 是否授权地理位置 */
  location: 'scope.userLocation',
  /** 是否授权保存到相册 */
  writePhotosAlbum: 'scope.writePhotosAlbum'
}

const ScopeText = {
  'scope.userInfo': '您已拒绝获取获取昵称权限，请手动打开',
  'scope.userLocation': '您已拒绝位置信息，请手动打开',
  'scope.writePhotosAlbum': '您已拒绝位置信息，请手动打开'
}

export function authorize(scope) {
  // 检查是否已授权
  // 发起授权
  return new Promise((resolve) => {
    wx.getSetting({
      withSubscriptions: true,
      success: (result) => {
        let status = result.authSetting[scope]
        if (status == null) { // 未授权
          auth(scope, resolve);
        } else if (!status) { // 拒绝授权
          // 弹出打开设置界面
          wx.showModal({
            cancelText: '取消',
            confirmText: '确认',
            content: ScopeText[scope],
            showCancel: true,
            title: '打开设置',
            success: (res) => {
              if (res.confirm) {
                openSetting()
              }
            }
          })
          resolve({
            message: '已拒绝授权',
            status: false
          });
        } else {
          resolve({
            message: '授权成功',
            status: true
          });
        }
      },
      fail: (res) => {
        resolve({
          message: '授权失败',
          status: false
        });
      }
    });
  });
}

function auth(scope, resolve) {
  wx.authorize({
    scope,
    success: (res) => {
      resolve({
        message: '授权成功',
        status: true
      });
    },
    fail: (res) => {
      resolve({
        message: '授权失败',
        status: false
      });
    }
  })
}

function openSetting() {
  wx.openSetting({
    withSubscriptions: true,
    success: (result) => {

    }
  })
}