const App = getApp();
var util = require('../../utils/util.js')
var host_url = App.globalData.host_url;
Page({
  data: {
    title: '完结单',  
    incomeList: [
      {
        fn: 'goDetails',
        typeNo: '交易赎楼',//交易赎楼--1||转贷--2||收付款垫资--3||贷前垫资--4
        ico: 'icon-transaction',
        time: '2018年12月1日',
        name: '王策宇',
        businessType: '交易赎楼',
        state: 'icon-details'
      },
      {
        fn: 'goDetails',
        typeNo: '转贷赎楼',//交易赎楼--1||转贷--2||收付款垫资--3||贷前垫资--4
        ico: 'icon-redeem',
        time: '2018年12月1日',
        name: '王策宇',
        businessType: '转贷',
        state: 'icon-details'
      },
      {
        fn: 'goDetails',
        typeNo: '首付款垫资',//交易赎楼--1||转贷--2||收付款垫资--3||贷前垫资--4
        ico: 'icon-pay',
        time: '2018年12月1日',
        name: '王策宇',
        businessType: '首付款垫资',
        state: 'icon-details'
      }, {
        fn: 'goDetails',
        typeNo: '贷前垫资',//交易赎楼--1||转贷--2||收付款垫资--3||贷前垫资--4
        ico: 'icon-loan',
        time: '2018年12月1日',
        name: '王策宇',
        businessType: '贷前垫资',
        state: 'icon-details'
      },
    ]
  },

  goDetails: function (e) {
    var that = this;
    var viewText = e.currentTarget.dataset.businesstype;
    console.log('业务类型:' + viewText);
    wx.navigateTo({
      url: '/pages/examineFull/index?businessType=' + viewText,
    })
  },
  
  navBack: function (event) {
    wx.reLaunch({
      url: '../declarationExamine/index',
    })
  },
  
  onLoad: function (options) {//getCompletes
		App.doPost({
      url: host_url + "/oa/ajax/workflow/getCompletes",
      success: (res) => {
        var instanceList = res.data.object.instanceList;
        var that = this;
        var incomeList = [];
        console.log(instanceList);
        for (var i = 0; i < instanceList.length; i++) {
        	incomeList.push({
        		fn: 'goDetails',
        		ico: 'icon-loan',
        		time: util.formatTime(new Date(instanceList[i].createTime)),
        		//name: App.globalData.userInfo.name + "的" + tasks[i].typeName ,
        		name: instanceList[i].customerName,
        		businessType: instanceList[i].name,
        		state: 'icon-details',
        		id: instanceList[i].id
        	});
        }
        that.setData({
		      navH: App.globalData.navHeight,
		      incomeList: incomeList
		    })
      }
    })
  },
  
})

