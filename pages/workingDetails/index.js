const App = getApp();

Page({
  data: {
    
  },
  navBack: function (event) {
    wx.navigateBack({

    })
  },

  onLoad: function (options) {
    var that = this;
    this.setData({
      navH: App.globalData.navHeight,
      business: options.businessType,
    });
  },
})

