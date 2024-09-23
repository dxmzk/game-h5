
wx.onShow((res) => {
  const options = wx.getLaunchOptionsSync();
  const options2 = wx.getEnterOptionsSync();
  console.log('-----> show', res);

  console.log(options, options2);
})

wx.onHide((res) => {
  console.log('-----> show', res)
})

wx.offShow((res) => {
  console.log('-----> show', res)
})

wx.offHide((res) => {
  console.log('-----> show', res)
})

wx.offError((res) => {
  console.log('-----> show', res)
})

wx.onError((res) => {
  console.log('-----> show', res)
})