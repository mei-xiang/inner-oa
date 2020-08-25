const App = getApp();
var util = require('../../utils/util.js')
var host_url = App.globalData.host_url;
Page({
  data: {
    title: '审批中',  
    incomeList: [],
		inputTitle: "",
		num:''
  },

  goDetails: function (e) { 
		var id = e.currentTarget.id;
		console.log(id)
		var instanceId = id.slice(0,id.indexOf("."))
		var inputTitle = id.slice(id.indexOf(".")+1,id.length)
    wx.navigateTo({
      url: '/pages/instanceDetail/index?instanceId=' + instanceId + '&inputTitle=' + inputTitle,
    })
  },
  
  navBack: function (event) {
    wx.reLaunch({
      url: '../declarationExamine/index',
    })
  },
  
	onLoad: function (options) {//getCompletes
		this.setData({
			num:'(' + options.Num + ')'
		})
		App.doPost({
      url: host_url + "/oa/ajax/workflow/getInstances",
      data:{
      	status: 2
      },
      success: (res) => {
				// console.log(res)
      	if (res.data && res.data.status == "1") {
					var instanceList = res.data.object.instanceList;
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
	        		id: instanceList[i].id + '.' + instanceList[i].customerName + '的' +instanceList[i].name
	        	});
						inputTitle = instanceList[i].customerName + instanceList[i].name;
	        }
	        incomeList
	        that.setData({
			      navH: App.globalData.navHeight,
			      incomeList: incomeList,
			      inputTitle: inputTitle
			    })
				}else{
					wx.showToast({
						  title: res.data.message ? res.data.message : "系统错误",
						  icon: 'none',
						  duration: 3000
						});
						wx.navigateBack({
							delta:1
						})
				}
      }
    })
  },
  
})

