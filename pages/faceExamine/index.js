const App = getApp();
var host_url = App.globalData.host_url;
Page({

  /**
   * 页面的初始数据
   */
  navBack: function (event) {
    wx.navigateBack({
      url: '/pages/login/index'
    })
      
  },
  goError:function () {
    wx.showToast({
      title: '请打开摄像头权限',
      icon: 'none',
      duration: 800
    })
  },
  getTaskNum:function () {
    App.doPost({
      url: host_url + "/oa/ajax/workflow/getTasksByUserId",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
      	userId: App.globalData.userInfo.id
      },
      method: "POST",
      success: (res) => {
      	if(res.data.status === "1"){
          if (res.data.object.hasPermission === true) {
            App.doPost({
              url: host_url + "oa/ajax/workflow/getTaskNum",
              success:function (result) {
                if(result.data.object.taskNum != 0){
                  wx.setTabBarBadge({
                    index: 1,
                    text: result.data.object.taskNum.toString()
                  })
                }else{
                  return
                }
              }
            })
          }else{
            return
        }
        }else{
          wx.showToast({
            title: '获取数据失败',
            icon: 'none',
            duration: 800
          })
        }
    }
    })
  },
  takePhoto: function(e){
    // console.log(e.target.id)
    var that = this
    const ctx = wx.createCameraContext();
    // console.log(ctx);
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
      	// console.log(res.tempImagePath);
        if(e.target.id === "bangding"){
          if(that.data.updata === ''){
            wx.showLoading({
              title: '正在登录',
            })
          }
          if(that.data.updata === "1"){
            wx.showLoading({
              title: '正在修改',
            })
          }
          wx.uploadFile({
            url: host_url + 'oa/ajax/workflow/faceRegister.json',
            filePath: res.tempImagePath,
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data"
            },
            formData: {
              "userId": App.globalData.userInfo.id,
            },
            success: (result) => {
              console.log(result)
              var data = JSON.parse(result.data)
              console.log(JSON.parse(result.data))
              wx.hideLoading();
              if(data.status === "1"){
                if(that.data.updata === ''){
                  wx.showToast({
                    title: data.message,
                    icon: 'none',
                    duration: 800,
                    success:function () {
                      setTimeout(function () {
                        that.doLogin()
                      }, 1000)
                    }
                  })
                }
                if(that.data.updata === "1"){
                  wx.showToast({
                    icon: 'none',
                    duration: 800,
                    success:function () {
                      setTimeout(function () {
                        that.doLogin()
                      }, 1000)
                    }
                  })
                }
                
              }else{
                if(that.data.updata === ''){
                  wx.showToast({
                    title: '登录失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
                if(that.data.updata === "1"){
                  wx.showToast({
                    title: '修改失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            }
          })
        }
        if(e.target.id === "denglu"){
          wx.showLoading({
            title: '正在验证',
          })
          wx.uploadFile({
            url: host_url + 'oa/ajax/workflow/faceIdentify',
            filePath: res.tempImagePath,
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data"
            },
            formData: {
              "code": that.data.userName,
            },
            success: (result) => {
              console.log(result)
              var data = JSON.parse(result.data)
              wx.hideLoading();
              if(data.status === "1"){
                wx.showToast({
                  title: data.message,
                  icon: 'none',
                  duration: 800,
                  success:function () {
                    setTimeout(function () {
                      that.doLogin()
                    }, 1000)
                  }
                })
              }else{
                wx.hideLoading();
                wx.showToast({
                  title: data.message,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
        
      }
    })
    
  },
  doLogin: function(e){
    var that = this
    that.getTaskNum()
    if(that.data.updata === ''){
      wx.reLaunch({
        url: '/pages/workBench/index'
      });
    }
    if(that.data.updata === "1"){
      wx.redirectTo({
        url: '/pages/setting/index',
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      userName: wx.getStorageSync('userName'),
      })
    if(options.updata){
      that.setData({
        updata:options.updata
      })
    }
      // console.log(that.data.userName)
    if(options.fist === 'true'){
      that.setData({
        isFist:true
      })
    }
    if(options.fist === 'false'){
      that.setData({
        isFist:false
      })
    }
     that.setData({
      navH: App.globalData.navHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})