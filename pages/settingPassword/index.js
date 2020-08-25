const App = getApp();
var host_url = App.globalData.host_url;
Page({
  data: {
    
    title: '设置',
    
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
  },
  getPassword:function (e) {
    var oldPassword = e.detail.value.oldName
    var newPassword = e.detail.value.newName
    var surePassword = e.detail.value.sureName
    if (oldPassword === '' && newPassword === '' && surePassword === '') {
      wx.showToast({
        title: '内容不能为空',
        icon:'none',
        duration: 2000
      })
      return
    }else if (oldPassword === '') {
      wx.showToast({
        title: '旧密码不能为空',
        icon:'none',
        duration: 2000
      })
      return
    }else if (newPassword === '') {
      wx.showToast({
        title: '新密码不能为空',
        icon:'none',
        duration: 2000
      })
      return
    }else if (surePassword === '') {
      wx.showToast({
        title: '确认密码不能为空',
        icon:'none',
        duration: 2000
      })
      return
    }else if (newPassword.length < 6) {
      wx.showToast({
        title: '新密码必须六位或六位以上',
        icon:'none',
        duration: 2000
      })
      return
    }else if (surePassword != newPassword) {
      wx.showToast({
        title: '密码不一致',
        icon:'none',
        duration: 2000
      })
      return
    }else{
      console.log('判断成功')
      App.doPost({
        url: host_url + "/sys/admin/layout/changepassword",
        data:{
          oldPassword:oldPassword,
          newPassword:newPassword,
          repeatPassword:surePassword
        },
        success: (resulte) => {
          console.log(resulte)
          if(resulte.data.status === "success"){
            console.log('修改成功')
            wx.showToast({
              title: '修改成功',
              icon:'success',
              duration: 800,
              success:function () {
                setTimeout(function () {
                  wx.redirectTo({
                    url:'/pages/setting/index'
                  })
                }, 1000)
              }
            })
          }else{
            wx.showToast({
              title: resulte.data.msg,
              icon:'none',
              duration: 2000
            })
          }
        },
        fail:(resulte) => {
          wx.showToast({
            title: '修改失败',
            icon:'none',
            duration: 2000
          })
        }
      })
    }
  }
})

