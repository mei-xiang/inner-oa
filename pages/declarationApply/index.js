const App = getApp();
Page({
  data: {
    title: '报单申请',
    functionList: [
      {
        fn: 'goApply',
        ico: 'icon-text_full',
        color: '#2b8ec8',
        name: '报单申请'
      },
      {
        fn: 'goQuery',
        ico: 'icon-search_full',
        color: '#2b8ec8',
        name: '进件查询'
      },
      {
        fn: 'goWarning',
        ico: 'icon-tips_full',
        color: '#2b8ec8',
        name: '逾期预警'
      },
      {
        fn: 'goExamine',
        ico: 'icon-examine_full',
        color: '#2b8ec8',
        name: '审核'
      }
    ],
    incomeList: [
      {
        fn: 'goDetails',
        typeNo: '1',//交易赎楼--1||转贷--2||收付款垫资--3||贷前垫资--4
        ico: 'icon-transaction',
        time: '2018年12月1日',
        name: '王策宇',
        businessType: '交易赎楼',
        state: '回款确认'
      },
      {
        fn: 'goDetails',
        typeNo: '2',//交易赎楼--1||转贷--2||收付款垫资--3||贷前垫资--4
        ico: 'icon-redeem',
        time: '2018年12月1日',
        name: '王策宇',
        businessType: '转贷',
        state: '回款确认'
      },
      {
        fn: 'goDetails',
        typeNo: '3',//交易赎楼--1||转贷--2||收付款垫资--3||贷前垫资--4
        ico: 'icon-pay',
        time: '2018年12月1日',
        name: '王策宇',
        businessType: '首付款垫资',
        state: '回款确认'
      }, {
        fn: 'goDetails',
        typeNo: '4',//交易赎楼--1||转贷--2||收付款垫资--3||贷前垫资--4
        ico: 'icon-loan',
        time: '2018年12月1日',
        name: '王策宇',
        businessType: '贷前垫资',
        state: '回款确认'
      },
    ]
  }, 
  goDetails: function(e){
    var that = this;
    var viewText = e.currentTarget.dataset.businesstype;
    console.log('业务类型:' + viewText);
    wx.navigateTo({
      url: '/pages/incomeMsg/index?businessType=' + viewText,
    })
  }, 
  goApply: function(e){
    wx.navigateTo({
      url: '/pages/decApply/index',
    })
  },
  goExamine: function (e) {
    wx.navigateTo({
      url: '/pages/examine/index',
    })
  },
  goWarning: function (e) {
    wx.navigateTo({
      url: '/pages/warning/index',
    })
  },
  goQuery: function (e) {
    wx.navigateTo({
      url: '/pages/incomingQuery/index',
    })
  }, 
  navBack: function (event) {
    wx.reLaunch({
      url: '../workBench/index',
    })
  },
  onLoad: function (options) {
    this.setData({
      navH: App.globalData.navHeight
    })
  },
})

