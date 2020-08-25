const App = getApp();

// modelTest.js
var model = require('../../model/model.js')

var show = false;
var item = {};

Page({
  data: {
    title: '赎楼申请',  
    array: ['请选择业务类型', '交易赎楼', '转贷赎楼'],
    index: 0,
    item: {
      show: show
    }
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  navBack: function (event) {
    wx.navigateBack({

    })
  },
  goNext: function (event) {
    wx.reLaunch({
      url: '../workBench/index',
    })
  },
  onLoad: function (options) {
    this.setData({
      navH: App.globalData.navHeight
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

