const App = getApp();

Page({
  data: {
    date: '2018-12-12',
  },

  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  goNext: function (e) {
    var that = this;
    var viewText = e.currentTarget.dataset.businesstype;
    console.log('业务类型:' + viewText);
    wx.navigateTo({
      url: '/pages/examineFullSix/index?businessType=' + viewText,
    })
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

