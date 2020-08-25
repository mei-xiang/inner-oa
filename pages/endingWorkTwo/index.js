const App = getApp();

Page({
  data: {
    title: '已完结任务',  
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

