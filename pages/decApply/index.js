const App = getApp();

// modelTest.js
var model = require('../../model/model.js')

var show = false;
var item = {};

Page({
  data: {
    title: '报单申请',
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    date: '2018-12-12',
    index: 0,
    certificatesIndex: 0,
    bankIndex: 0,
    marriageIndex: 0,
    item: {
      show: show
    },
    certificatesArray: ['请选择证件类型', '身份证', '港澳通行证','港澳台身份证','军官证','士兵证',' 护照','其他'],
    marriageArray: ['请选择婚姻情况', '未婚', '已婚', '丧偶', '离异','其他'],
    bankArray: ['请选择原贷款机构', '中国银行', '招商银行', '平安银行', '工商银行', '其他'],
  },
  bindCertificatesChange: function (e) {
    this.setData({
      certificatesIndex: e.detail.value
    })
  },
  bindBankChange: function (e) {
    this.setData({
      bankIndex: e.detail.value
    })
  },
  bindMarriageChange: function (e) {
    this.setData({
      marriageIndex: e.detail.value
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
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
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
        var scrollHeight = clientHeight - 130;
        that.setData({
          winHeight: scrollHeight
        });
      },
    })
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    model.animationEvents(this, 0, true, 400);
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    console.log("id = " + e.target.dataset.id)
    model.animationEvents(this, 200, false, 400);
    //点击确定按钮更新数据(id=444是背后透明蒙版 id=555是取消按钮)
    if (e.target.dataset.id == 666) {
      this.updateShowData()
    }
  },
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    //如果想滑动的时候不实时更新，只点确定的时候更新，注释掉下面这行代码即可。
    // this.updateShowData()
  },
  //更新顶部展示的数据
  updateShowData: function (e) {
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
  },
  onReachBottom: function () {
  },
  nono: function () {}
})

