const App = getApp();
Page({
  data: {
    title: '进件消息',
    foreclosureName: '王策宇',
    foreclosurePhone: '13000000000',
    foreclosureBus: '交易赎楼审核中',
    foreclosureIco: 'icon-transaction',
    redeemName: '王策宇',
    redeemPhone: '13000000000',
    redeemBus: '转贷赎楼审核中',
    redeemIco: 'icon-redeem',
    payName: '王策宇',
    payPhone: '13000000000',
    payBus: '首付款垫资审核中',
    payIco: 'icon-pay',
    loanName: '王策宇',
    loanPhone: '13000000000',
    loanBus: '贷前垫资审核中',
    loanIco: 'icon-loan',
    loanList: [
      {
        name: '回款确认',
        state: '正在进行',
        time: '2017-07-26 17:31:32',
        active: 1
      }
    ],
    payList:[
      {
        name: '回款确认',
        state: '正在进行',
        time: '2017-07-26 17:31:32',
        active: 1
      }
    ],
    redeemList:[
      {
        name: '建档',
        state: '正在进行',
        time: '2017-07-26 17:31:32',
        active: 1
      },
      {
        name: '回访',
        state: 'ok',
        time: '2017-07-26 17:31:32',
        active: 0
      },
      {
        name: '业务主管派单',
        state: 'ok',
        time: '2017-07-26 17:31:32',
        active: 0
      }
    ],
    foreclosureList: [
      {
        name: '回款确认',
        state: '正在进行',
        time: '2017-07-26 17:31:32',
        active: 1
      },
      {
        name: '回款单确认',
        state: 'ok',
        time: '2017-07-26 17:31:32',
        active: 0
      },
      {
        name: '银行放款',
        state: 'ok',
        time: '2017-07-26 17:31:32',
        active: 0
      },
      {
        name: '回款申请',
        state: 'ok',
        time: '2017-07-26 17:31:32',
        active: 0
      },
      {
        name: '银行取(新)证',
        state: 'ok',
        time: '2017-07-26 17:31:32',
        active: 0
      },
      {
        name: '取旧证、注销抵押',
        state: 'ok',
        time: '2017-07-26 17:31:32',
        active: 0
      },
      {
        name: '分配赎楼人员',
        state: 'ok',
        time: '2017-07-26 17:31:32',
        active: 0
      },
      {
        name: '财物审批',
        state: 'ok',
        time: '2017-07-26 17:31:32',
        active: 0
      },
      {
        name: '总经理审批',
        state: 'ok',
        time: '2017-07-26 17:31:32',
        active: 0
      },
      {
        name: '决策',
        state: 'ok',
        time: '2017-07-26 17:31:32',
        active: 0
      },
      {
        name: '业务经理审批',
        state: 'ok',
        time: '2017-07-26 17:31:32',
        active: 0
      },
      {
        name: '赎楼审批表',
        state: 'ok',
        time: '2017-07-26 17:31:32',
        active: 0
      },

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
        businessType: '收付款垫资',
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
  goDetails: function (e) {
    var that = this;
    var viewText = e.currentTarget.dataset.businesstype;
    console.log('业务类型:' + viewText);

  },
  navBack: function (event) {
    wx.navigateBack({

    })
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      navH: App.globalData.navHeight,
      business: options.businessType,
    })
  },
})

