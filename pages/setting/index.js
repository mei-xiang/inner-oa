const App = getApp();
var host_url = App.globalData.host_url;
Page({
  data: {
    title: '设置',
    password:'修改密码',
    loginOut:'退出',
    showVal:false
  },
  navBack: function (event) {
    wx.navigateBack({
      url: '/pages/my/index',
    })
  },
  onLoad: function (options) {
    if(wx.getStorageSync('userName') != 'test'){
      this.setData({
        showVal:true
      })
    }
    this.setData({
      navH: App.globalData.navHeight
    })
  },
  SettingPassword:function () {
    wx.navigateTo({
      url: '/pages/settingPassword/index'
    })
  },
  // goUpdataFace:function () {
  //   wx.navigateTo({
  //     url: '/pages/faceExamine/index?fist=' + true + '&updata=' + '1'
  //   })
  // },
  goOut:function () {
    wx.showModal({
      title: '你确定退出登录?',
      content: '',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          App.doPost({
            url: host_url + "/sys/admin/layout/loginout",
            success: (resulte) => {
              if(resulte.data.status === "success"){
             //   App.globalData.userInfo = null;
                // console.log(App.globalData.userInfo)
                wx.navigateTo({
                  url: '/pages/login/index'
                })
              }
              // console.log(resulte)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  }
})

