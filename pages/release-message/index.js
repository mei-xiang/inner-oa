const App = getApp();
var host_url = App.globalData.host_url;
Page({
  data: {
    navH: '',
    title:'发布消息',
    messageTitle: '',
    message: '',
  },

  onLoad: function (options) {
    this.setData({
      navH: App.globalData.navHeight * 2,
    })
  },

  navBack: function (event) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  //解决输入空格问题
  checkBlankSpace(str) {
    while (str.lastIndexOf(' ') >= 0) {
      str = str.replace(' ', '');
    }
    if (str.length == 0) {
      return false;
    } else {
      return true;
    }
  },
  // 提交,checkformat.filterEmoji 过滤表情
  formSubmit(e) {
    console.log("标题",e.detail.value.title)
    console.log("详情",e.detail.value.message)
    // 验证手机号格式
    var self = this;
    var warn = '';
    var flag = true;
    if (e.detail.value.title == '') {
      warn = '请输入标题';
    } else if (!this.checkBlankSpace(e.detail.value.title)) {
      warn = '请输入标题';
    } else if (e.detail.value.message == '') {
      warn = '请输入消息内容';
    } else if (!this.checkBlankSpace(e.detail.value.message)) {
      warn = '请输入消息内容';
    } else {
      flag = false;
      App.doPost({
        url: host_url + "oa/ajax/bulletinPush",
        data: {
          title: e.detail.value.title,
          userId:App.globalData.userInfo.id,
          content:e.detail.value.message,
        },
        success: (res) => {
          if (res.data && res.data.status == "1") {
            wx.showToast({
              title: "发布成功",
              icon: 'none',
              duration: 1500
            });
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }, 1500);
          }

        }
      })
    }
    if (flag) {
      wx.showModal({
        content: warn,
        showCancel: false
      });
    }
  }

})