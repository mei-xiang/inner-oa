const App = getApp();
var util = require('../../utils/util.js')
var host_url = App.globalData.host_url;
Page({
  data: {

    title: '审批进度',
    incomeList: [],
    inputTitle: ""

  },
  goDetails: function(e) {
    console.log("eee",e)
    var instanceId = e.currentTarget.id;
    let inputTitle = e.currentTarget.dataset.inputtitle
    wx.navigateTo({
      url: '/pages/instanceDetail/index?instanceId=' + instanceId + '&inputTitle=' + inputTitle,
    })
  },
  navBack: function(event) {
    wx.navigateBack({
      url: '/pages/my/index',
    })
  },
  onLoad: function(options) { //getCompletes
    this.upData()
  },
  onshow: function(params) {
    this.upData()
  },
  upData: function(params) {
    App.doPost({
      url: host_url + "/oa/ajax/workflow/getUserInstances",
      data: {
        status: 2
      },
      success: (res) => {
        if (res.data && res.data.status == "1") {
          var instanceList = res.data.object.instanceList;
          console.log("aaaaaaa",instanceList)
          var that = this;
          var incomeList = [];
          var inputTitle = "";
          for (var i = 0; i < instanceList.length; i++) {
            incomeList.push({
              fn: 'goDetails',
              ico: 'icon-loan',
              time: util.formatTime(new Date(instanceList[i].createTime)),
              //name: App.globalData.userInfo.name + "的" + tasks[i].typeName ,
              name: instanceList[i].customerName,
              businessType: instanceList[i].name,
              state: 'icon-details',
              id:instanceList[i].id,
              inputTitle:instanceList[i].customerName + instanceList[i].name
            });
           
          }
          incomeList
          that.setData({
            navH: App.globalData.navHeight,
            incomeList: incomeList,
            inputTitle: inputTitle
          })
        } else if (res.data.status == 0){
          wx.redirectTo({
            url: '../login/index'
          })
        } else {
          wx.showToast({
            title: res.data.message ? res.data.message : "系统错误",
            icon: 'none',
            duration: 3000
          });
        }
      }
    })
  }
})