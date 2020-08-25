const App = getApp();

Page({
  data: {
    title: '审核',
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    workingList: [
      {
        fn: 'goDetails',
        typeNo: '交易赎楼',//交易赎楼--1||转贷--2||收付款垫资--3||贷前垫资--4
        ico: 'icon-transaction',
        time: '2018年12月1日',
        name: '王策宇',
        businessType: '交易赎楼',
        state: '回款确认'
      },
      {
        fn: 'goDetails',
        typeNo: '转贷赎楼',//交易赎楼--1||转贷--2||收付款垫资--3||贷前垫资--4
        ico: 'icon-redeem',
        time: '2018年12月1日',
        name: '王策宇',
        businessType: '转贷',
        state: '回款确认'
      },
      {
        fn: 'goDetails',
        typeNo: '首付款垫资',//交易赎楼--1||转贷--2||收付款垫资--3||贷前垫资--4
        ico: 'icon-pay',
        time: '2018年12月1日',
        name: '王策宇',
        businessType: '首付款垫资',
        state: '回款确认'
      }, {
        fn: 'goDetails',
        typeNo: '贷前垫资',//交易赎楼--1||转贷--2||收付款垫资--3||贷前垫资--4
        ico: 'icon-loan',
        time: '2018年12月1日',
        name: '王策宇',
        businessType: '贷前垫资',
        state: '回款确认'
      },
    ],
    endingList: [
      {
        fn: 'goFull',
        typeNo: '交易赎楼',//交易赎楼--1||转贷--2||收付款垫资--3||贷前垫资--4
        ico: 'icon-transaction',
        time: '2018年12月1日',
        name: '王策宇',
        businessType: '交易赎楼',
        state: '回款确认'
      },
      {
        fn: 'goFull',
        typeNo: '转贷赎楼',//交易赎楼--1||转贷--2||收付款垫资--3||贷前垫资--4
        ico: 'icon-redeem',
        time: '2018年12月1日',
        name: '王策宇',
        businessType: '转贷',
        state: '回款确认'
      },
      {
        fn: 'goFull',
        typeNo: '首付款垫资',//交易赎楼--1||转贷--2||收付款垫资--3||贷前垫资--4
        ico: 'icon-pay',
        time: '2018年12月1日',
        name: '王策宇',
        businessType: '首付款垫资',
        state: '回款确认'
      }, {
        fn: 'goFull',
        typeNo: '贷前垫资',//交易赎楼--1||转贷--2||收付款垫资--3||贷前垫资--4
        ico: 'icon-loan',
        time: '2018年12月1日',
        name: '王策宇',
        businessType: '贷前垫资',
        state: '回款确认'
      },
    ]
  },
  goDetails: function (e) {
    var that = this;
    var viewText = e.currentTarget.dataset.businesstype;
    console.log('业务类型:' + viewText);
    wx.navigateTo({
      url: '/pages/workingDetails/index?businessType=' + viewText,
    })
  },
  goFull: function (e) {
    var that = this;
    var viewText = e.currentTarget.dataset.businesstype;
    console.log('业务类型:' + viewText);
    wx.navigateTo({
      url: '/pages/full/index?businessType=' + viewText,
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
    wx.reLaunch({
      url: '/pages/declarationApply/index',
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

