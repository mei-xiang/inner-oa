const App = getApp();

Page({
  data: {
    title: '在途查询',
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
  },
  goDetails: function (e) {
    var that = this;
    var viewText = e.currentTarget.dataset.businesstype;
    console.log('业务类型:' + viewText);
    wx.navigateTo({
      url: '/pages/incomeMsg/index?businessType=' + viewText,
    })
  },
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTab == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  navBack: function (event) {
    wx.navigateBack({

    })
  },
  
  onLoad: function (options) {
    var that = this;
    this.setData({
      navH: App.globalData.navHeight
    });
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight;
        var scrollHeight = clientHeight - 110;
        that.setData({
          winHeight: scrollHeight
        });
      },
    })
  },
  
  
})

