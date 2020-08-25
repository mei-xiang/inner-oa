const App = getApp();
var util = require('../../utils/util.js')
var host_url = App.globalData.host_url;

Page({
  data: {
    title: '已处理',
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    incomeList: [],
    inputTitle: ""
  },
  goDetails: function (e) {
		var id = e.currentTarget.id;
		var instanceId = id.slice(0,id.indexOf("."))
		var inputTitle = id.slice(id.indexOf(".")+1,id.length)
		
    wx.navigateTo({
      url: '/pages/instanceDetail/index?instanceId=' + instanceId + '&inputTitle=' + inputTitle,
    })
  },
  navBack: function (event) {
    wx.reLaunch({
      url: '/pages/declarationExamine/index',
    })
  },

  onLoad: function (options) {
    var that = this;
    this.setData({
      navH: App.globalData.navHeight
    });
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight;
        var scrollHeight = clientHeight - 110;
        that.setData({
          winHeight: scrollHeight
        });
      },
    })
    App.doPost({
      url: host_url + "oa/ajax/workflow/getHistories",
      success: (res) => {
        console.log(res)
      	if (res.data && res.data.status == "1") {
					var instanceList = res.data.object.instanceList;
	        var that = this;
	        var incomeList = [];
	        var inputTitle = '';
	        if(instanceList.length > 0){
            for (var i = 0; i < instanceList.length; i++) {
              incomeList.push({
                fn: 'goDetails',
                ico: 'icon-loan',
                time: util.formatTime(new Date(instanceList[i].createTime)),
                //name: App.globalData.userInfo.name + "的" + tasks[i].typeName ,
                name: instanceList[i].customerName,
                businessType: instanceList[i].name,
                state: 'icon-details',
                id: instanceList[i].id + '.' + instanceList[i].customerName + '的' +instanceList[i].name,
              });
              // inputTitle = instanceList[i].customerName + instanceList[i].name;
            }
            that.setData({
              navH: App.globalData.navHeight,
              incomeList: incomeList,
              inputTitle: inputTitle
            })
          }
        }else if (res.data.status == 0) {
          wx.redirectTo({
            url: '../login/index'
          })
        } else{
					wx.showToast({
						  title: res.data.message ? res.data.message : "系统错误",
						  icon: 'none',
						  duration: 3000
						});
				}
      }
    })
  },


})

