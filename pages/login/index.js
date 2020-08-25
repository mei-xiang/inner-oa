const App = getApp();
var host_url = App.globalData.host_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '登录',
    userName: '',
    userPassword: '',
    isFist: false
  },
  goPassLogin: function(params) {
    // console.log('账户密码登录')
    wx.clearStorageSync()
    this.setData({
      userName: '',
      userPassword: '',
      isFist: true
    })
  },
  doLogin: function(e) {
    var that = this
    // console.log(e.detail.value)
    wx.showLoading({
      title: '正在登录',
      mask: true
    });
    App.doPost({
      url: host_url + "sys/admin/layout/login",
      data: this.data.isFist ? e.detail.value : {
        loginName: wx.getStorageSync('userName'),
        loginPass: wx.getStorageSync('userPassword')
      },
      success: function(res) {
        // console.log(res)
        if (res.data && res.data.status == "success") {
          console.log(res);
          console.log("登入成功");
          // console.log(e.detail.value)

          var userName = that.data.isFist ? e.detail.value.loginName : wx.getStorageSync('userName')
          var userPassword = that.data.isFist ? e.detail.value.loginPass : wx.getStorageSync('userPassword')
          // console.log(userName,userPassword)
          // 第一次登录
          console.log(that)
          if ((that.data.userName === '' && that.data.userPassword === '') || !(userName != that.data.userName || userPassword != that.data.userPassword)) { //判断是否需要记住密码
            wx.setStorage({
              key: 'userName',
              data: userName,
            });
            wx.setStorage({
              key: 'userPassword',
              data: userPassword,
            });
            App.globalData.userInfo = res.data.objs[0];
            console.log(App.globalData.userInfo);
            wx.hideLoading();
            wx.reLaunch({
              url: '/pages/workBench/index'
            });


          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000
          });
        }
      }
    })
  },
  getValue: function() {
    var that = this;
    //  console.log(wx.getStorageSync('userName'))
    that.setData({
      userName: wx.getStorageSync('userName')
    });
    //  console.log(wx.getStorageSync('userPassword'))
    that.setData({
      userPassword: wx.getStorageSync('userPassword')
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.getValue();
    if (that.data.userName === '' && that.data.userPassword === '') {
      that.setData({
        isFist: true
      })
    } else {
      that.setData({
        isFist: false
      })
    }
    that.setData({
      navH: App.globalData.navHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})