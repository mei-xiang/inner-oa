const App = getApp();
Page({
  data: {
    
    title: '设置',
    
  },
  navBack: function (event) {
    wx.navigateBack({
      url: '/pages/my/index',
    })
  },
  onLoad: function (options) {
    this.setData({
      navH: App.globalData.navHeight
    })
  },

})

