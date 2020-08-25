const App = getApp();
var util = require('../../utils/util.js')
var host_url = App.globalData.host_url;
Page({
  data: {
    userName: '',
    title: '我的',
    imgUrl: '',
    canReport:false, //是否能看到报表
  },
  settingImage: function (e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['从手机相册选择', '手机拍照', '图片预览'],
      success: function (res) {
        // console.log(res.tapIndex)
        if (res.tapIndex === 0) {
          wx.chooseImage({
            count: 1, //选择数量
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              const src = res.tempFilePaths[0]
              wx.navigateTo({
                url: '/pages/settingImage/index?src=' + src,
              })
            },
          })
        }
        if (res.tapIndex === 1) {
          wx.chooseImage({
            count: 1, //选择数量
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              const src = res.tempFilePaths[0]
              wx.navigateTo({
                url: '/pages/settingImage/index?src=' + src,
              })
            },
          })
        }
        if (res.tapIndex === 2) {
          wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: [that.data.imgUrl] // 需要预览的图片http链接列表
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  goTool: function (e) {
    wx.navigateTo({
      url: '/pages/tool/index',
    })
  },
  goSetting: function (event) {
    wx.navigateTo({
      url: '/pages/setting/index',
    })
  },
  goApprovalProgress: function (event) {
    wx.navigateTo({
      url: '/pages/approvalProgress/index',
    })
  },
  navBack: function (event) {
    wx.navigateBack({

    })
  },


  goReport: function () {
    wx.navigateTo({
      url: '/pages/report-statistics/report-statistics',
    })
  },

  onShow: function (options) {

  },
  onLoad: function (options) {
    let self = this
    App.doPost({
      url: host_url + "oa/ajax/loadRole",
      data: {
        id:App.globalData.userInfo.id
      },
      success:function(res){
        console.log("报表",res)
        if (res.data && res.data.status == "success") {
          if(res.data.objs[0] == 1){
            self.setData({
              canReport:true
            })
          }else{
            self.setData({
              canReport:false
            })
          }
        
      }
    }
    })
    this.setData({
      navH: App.globalData.navHeight
    })
    if (App.globalData.userInfo === null) {
      wx.redirectTo({
        url: '/pages/login/index',
      })
    } else {
      const url = host_url + App.globalData.userInfo.photo;
      this.setData({
        userName: App.globalData.userInfo.name,
        imgUrl: url
      })
    }
  }
})