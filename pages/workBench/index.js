const App = getApp();
var host_url = App.globalData.host_url;
Page({
  data: {
    title: '工作台'
  },
  /*goBuild: function(event){
    wx.navigateTo({
      url: '/pages/buildApply/index',
    })
  },
  goDeclaration: function (event) {
    wx.navigateTo({
      url: '/pages/declarationApply/index',
    })
  },
  goExamine: function (event) {
    wx.navigateTo({
      url: '../declarationExamine/index',
    })
  },*/
  navBack: function (event) {
    wx.navigateBack({

    })
  },
  goWorkingHours: function () {
    wx.navigateTo({
      url: '../workingHours/index'
    })
  },
  goBackTrackingHours: function () {
    wx.navigateTo({
      url: '../backTrackingHours/index'
    })
  },
  goInput: function (event) {
    var _id = event.currentTarget.id;
    var idNumber = _id.slice(0,_id.indexOf("."))
    // console.log(_id)
    var name = _id.slice(_id.indexOf(".")+1,_id.length)
    wx.navigateTo({
      url: '../input/index?typeId='+idNumber + '&name=' + name,
    })
  },
  onLoad: function (options) {
    this.setData({
      navH: App.globalData.navHeight
    })
    if(App.globalData.userInfo === null){
      wx.redirectTo({
        url: '/pages/login/index',
      })
    }else{
   	App.doPost({
      url: host_url + "/oa/ajax/workflow/getVersions",
      success: (res) => {
        // console.log(res)
      	if (res.data && res.data.status == "1") {
          var versionList = res.data.object.versions;
	        var myVersions = [];
	        for (var i = 0; i < versionList.length; i++){
	          myVersions.push({
	          	fn: 'goInput',
						  ico: 'icon-build_full',
						  color: '#2b8ec8',
	          	name: versionList[i].name,
	          	id: versionList[i].typeId+ '.' +versionList[i].name
	          });
	        }
	        this.setData({
	          functionList: myVersions
	        });
  			}else{
  				wx.showToast({
					  title: '获取失败',
					  icon: 'none',
					  duration: 3000
					});
  			}
      }
    })
  }
  },

})

