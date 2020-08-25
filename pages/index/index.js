const App = getApp();
var util = require('../../utils/util.js')
var host_url = App.globalData.host_url;
Page({
  data: {
    title: '通知',
    incomeList:[],
    toView:'',
    height:'',
    canPublish:false,
    
  },
  navBack: function (event) {
    wx.navigateBack({
      url: '',
    })
  },
  onLoad: function (options) {
    if(App.globalData.userInfo === null){
      wx.redirectTo({
        url: '/pages/login/index',
      })
    }else{
      this.getItem()
      this.getWindowInfo()
    }
    this.setData({
      navH: App.globalData.navHeight,
      // noticeId:options.noticeId
    })
  },
  onShow:function (options) {
    this.getItem()
  },
  getWindowInfo:function (params) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        // console.log(res.windowHeight)
        that.setData({
          height:res.windowHeight-40
        })
      }
    })
  },
  getItem:function(){
    var that = this;
    App.doPost({
      url: host_url + "/oa/ajax/userNotice/getUserNotices",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: App.globalData.userInfo.id
        
      },
      method: "GET",
      success: (res) => {
        var that = this;
        console.log(res)
        if (res.data && res.data.status == "success") {
          if(res.data.object.state == 1 ){
            that.setData({
              canPublish:true
            })
          }else{
            that.setData({
              canPublish:false
            })
          }
          var notices = res.data.object.noticeList;
          var that = this;
          if(notices.length >= 0){
          var noticeList = [];
          for (var i = 0; i < notices.length; i++) {
            noticeList.push({
              fn:"goDetail",
              name: notices[i].createBy.slice(notices[i].createBy.indexOf(".")+1,notices[i].createBy.length),
              text: notices[i].title,
              time: util.formatTime(new Date(notices[i].createTime)),
              id: notices[i].id,
              content:notices[i].content,
              viewId:"viewId"+ notices[i].id,
              userPhoto:host_url + notices[i].userPhoto,
              noticeId:notices[i].noticeId
            });
          }
          that.setData({
            incomeList: noticeList,
            toView: noticeList[noticeList.length-1].viewId,
            notice:true
          })
          }else{
            wx.showToast({
              title: '没有消息',
              icon: 'none',
              duration: 3000
            });
          }
          
        } else if(res.data.status == 0){
          wx.redirectTo({
            url:'../login/index'
          })
        }else{
          wx.showToast({
              title: res.data.message ? res.data.message : "系统错误",
              icon: 'none',
              duration: 3000
            });
        } 
        // console.log(noticeList[noticeList.length-1].viewId)
      }
    })  
  },
  goDetail:function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.wid
    console.log("id",id)
    wx.navigateTo({
      url:'/pages/noticeDetail/index?noticeId=' + id
    })
  },
  toReleaseMessage:function(){
    wx.navigateTo({
      url:'/pages/release-message/index'
    })
  }
})

