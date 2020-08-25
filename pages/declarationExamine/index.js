const App = getApp();
var util = require('../../utils/util.js')
var host_url = App.globalData.host_url;
var flag = true;
Page({
  data: {
    title: '报单审批',
    functionList: [{
        fn: 'goApply',
        ico: 'icon-folderSuccess_full',
        color: '#2b8ec8',
        name: '完结单'
      },
      {
        fn: 'goQuery',
        ico: 'icon-search_full',
        color: '#2b8ec8',
        name: '在途查询'
      },
      {
        fn: 'goExamine',
        ico: 'icon-entrySuccess_full',
        color: '#2b8ec8',
        name: '已处理'
      }
    ],
    incomeList: [],
    audittingNum: 0,
    completeNum: 0,
    haveCompleteNum: false,
    haveAudittingNum: false
  },

  // {
  //   fn: 'goWarning',
  //   ico: 'icon-tips_full',
  //   color: '#2b8ec8',
  //   name: '逾期预警'
  // },
  goDetails: function (e) {
    var id = e.currentTarget.id;
    var insId = e.currentTarget.dataset.instanceid
    console.log("e",e)
    var instanceId = id.slice(0, id.indexOf("."))
    var inputTitle = id.slice(id.indexOf(".") + 1, id.length)
    wx.navigateTo({
      url: '/pages/examineFull/index?taskId=' + instanceId + '&inputTitle=' + inputTitle + '&instanceId=' + insId,
    })
  },
  goApply: function (e) {
    var that = this
    that.setData({
      haveCompleteNum: false
    })
    wx.navigateTo({
      url: '/pages/instance/index?Num=' + that.data.completeNum,
    })
  },
  goExamine: function (e) {
    wx.navigateTo({
      url: '/pages/examineTwo/index',
    })
  },
  goWarning: function (e) {
    return;
    wx.navigateTo({
      url: '/pages/warning/index',
    })
  },
  goQuery: function (e) {
    var that = this
    this.setData({
      haveAudittingNum: false
    })
    wx.navigateTo({
      url: '/pages/process/index?Num=' + that.data.audittingNum,
    })
  },
  navBack: function (event) {
    wx.reLaunch({
      url: '../workBench/index',
    })
  },
  upData: function () {
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
        // console.log(res)
        if (res.data && res.data.status == "1" && res.data.object.hasPermission === true) {
          var tasks = res.data.object.tasks;
          var that = this;
          var taskList = [];
          console.log(tasks)
          for (var i = 0; i < tasks.length; i++) {
            taskList.push({
              fn: 'goDetails',
              ico: 'icon-loan',
              time: util.formatTime(new Date(tasks[i].createTime)),
              //name: App.globalData.userInfo.name + "的" + tasks[i].typeName ,
              name: tasks[i].customerName + "的" + tasks[i].typeName,
              businessType: tasks[i].name,
              state: 'icon-details',
              id: tasks[i].id + '.' + tasks[i].customerName + "的" + tasks[i].typeName,
              instanceId: tasks[i].instanceId
            });
          }
          that.setData({
            incomeList: taskList,
            audittingNum: res.data.object.audittingNum,
            completeNum: res.data.object.completeNum
          })
          if (res.data.object.audittingNum != 0) {
            that.setData({
              haveAudittingNum: true
            })
          }
          if (res.data.object.completeNum != 0) {
            that.setData({
              haveCompleteNum: true
            })
          }
        } else {
          wx.showToast({
            // title: res.data.message ? res.data.message : "系统错误",
            title: '没有权限',
            icon: 'none',
            duration: 1000
          });
          setTimeout(
            function () {
              wx.switchTab({
                url: '/pages/my/index',
              })
            }, 1000)
        }
      }
    })
  },
  onLoad: function (optons) {
    wx.removeTabBarBadge({
      index: 1
    })
    if (App.globalData.userInfo === null) {
      wx.redirectTo({
        url: '/pages/login/index',
      })
    } else {
      this.upData();
    }
    this.setData({
      navH: App.globalData.navHeight,
    })
  },

  onShow: function () {
    this.upData();
    // this.limit()
  }
})