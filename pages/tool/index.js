const App = getApp();
var host_url = App.globalData.host_url;
Page({
  data: {
    title: '工具',
    tool:[
      {
        title:'身份证识别',
        fn:'goDetail',
        id:'1'
        
      },
      {
        title:'银行卡识别',
        fn:'goDetail',
        id:'2'
      },
      {
        title:'驾驶证识别',
        fn:'goDetail',
        id:'3'
      },
      {
        title:'营业执照识别',
        fn:'goDetail',
        id:'4'
      },
      {
        title:'车牌识别',
        fn:'goDetail',
        id:'5'
      },
      {
        title:'火车票识别',
        fn:'goDetail',
        id:'6'
      },
      {
        title:'增值税发票识别',
        fn:'goDetail',
        id:'7'
      },
      {
        title:'通用文字识别',
        fn:'goDetail',
        id:'8'
      },
      {
        title:'手写文字识别',
        fn:'goDetail',
        id:'9'
      },
      {
        title:'菜品识别',
        fn:'goDetail',
        id:'10'
      },
      {
        title:'动物识别',
        fn:'goDetail',
        id:'11'
      },
      {
        title:'植物识别',
        fn:'goDetail',
        id:'12'
      },
      {
        title:'车型识别',
        fn:'goDetail',
        id:'13'
      },
      {
        title:'地标识别',
        fn:'goDetail',
        id:'14'
      }
    ]
  },
  goDetail:function(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/credential/index?idNumber=' + e.target.id
    })
  },
  navBack: function (event) {
    wx.navigateBack({
      url: '/pages/my/index',
    })
  },
  onLoad: function (options) {
    this.setData({
      navH: App.globalData.navHeight
    })
  }
})

