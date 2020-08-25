const App = getApp();
var host_url = App.globalData.host_url;
Page({
  data: {

    title: '消息详情',
    nodes: '',
    noticTitle:'',
    id:'',
    name:'',

  },
  navBack: function (event) {
    wx.navigateBack({
      url: '/pages/index/index',
    })
  },
  onLoad: function (options) {
    this.setData({
      id:options.noticeId,
      navH: App.globalData.navHeight
    })

    // 获取富文本信息
    let self = this
    App.doPost({
      url: host_url + "oa/ajax/noticeLoadData",
      data: {
        id:this.data.id
      },
      success: (res) => {
        console.log("富文本信息", res)
        if (res.data.status == "success") {
          self.setData({
            nodes:res.data.objs[0].content,
            noticTitle:res.data.objs[0].title,
            name:res.data.objs[0].userName
          })
        }
      },
    })
  },

})