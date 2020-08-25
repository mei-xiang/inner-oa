const App = getApp();
var util = require('../../utils/util.js')
var host_url = App.globalData.host_url;
Page({
  data: {
    title: '选择联系人',
    oldList:[],
    list:[]
  },
  navBack: function (event) {
    wx.navigateBack({
      
    })
  },
  onShow:function (options) {
    
  },
  chooseContact:function (e) {
    var id = e.currentTarget.dataset.id
    if(this.data.oldList.length){
      var hasId = []
      for(var i = 0; i < this.data.oldList.length; i++){
        hasId.push(this.data.oldList[i].id)
      }
      if(hasId.indexOf(id) === -1){
      this.data.oldList.push(e.currentTarget.dataset)
      }else{
        this.navBack()
        return
      }
    }else{
      this.data.oldList.push(e.currentTarget.dataset)
    }
    this.setData({
      oldList:this.data.oldList
    })
    let pages = getCurrentPages();   //更新上一页的数据
      let prevPage = null;
      if(pages.length >= 2){
        prevPage = pages[pages.length - 2]; //上一个页面
      }
      if (prevPage) {
        prevPage.setData({
          contactList: this.data.oldList
        });
        this.navBack()
      }
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      navH: App.globalData.navHeight
    })
    App.doPost({
      url:host_url+"/sys/ajax/user/list",
      success: function(res) {
        console.log(res)
        var data = res.data
        var list = []
        if(data.length>0){
          for(var i = 0;i<data.length;i++){
            if(data[i].photoFile){
              list.push({
                id:data[i].id,
                name:data[i].name,
                src:host_url + data[i].photoFile,
                roles:data[i].roles
              })
            }else{
              list.push({
                id:data[i].id,
                name:data[i].name,
                src:'/img/photo.png',
                roles:data[i].roles
              })
            }
          }
          that.setData({
            list:list
          })
        }else{
          that.setData({
            list:[]
          })
        }
      }
    })
    if(options.newList){
      that.setData({
        oldList:JSON.parse(options.newList)
      })
    }else{
      that.setData({
        oldList:[]
      })
    }
  }
})

