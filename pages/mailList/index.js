const App = getApp();
Page({
  data: {
    title: '通讯录',
    
  },
  navBack: function (event) {
    wx.navigateBack({

    })
  },
  onLoad: function (options) {
    this.setData({
      navH: App.globalData.navHeight
    })
  },

})

