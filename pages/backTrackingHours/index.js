// pages/backTrackingHours/index.js
const App = getApp();
var host_url = App.globalData.host_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: [],
    projectArray: [],
    projectObjArray: [],
    foreModularArray: ['暂无项目模块'],
    foreModularObjArray: [],
    afterModularArray: ['暂无项目模块'],
    afterModularObjArray: [],
    mornIndex: 0,
    foreModular: 0,
    afterIndex: 0,
    afterModular: 0,
    morningVal: '',
    afterVal: '',
    throughTheReason: '',
    textFore: false,
    textAfter: false,
    textReason: false,
    isFocusFore: false,
    isFocusAfter: false,
    isFocusReason: false,
    projectForeName:'',
    projectAfterName:'',
    foreModularName:'',
    afterModularName:''
  },
  navBack: function(event) {
    wx.navigateBack({

    })
  },
  bindInp: function(e) {
    this.setData({
      throughTheReason: e.detail.value
    })
  },
  bindInpMorning(e) {
    this.setData({
      morningVal: e.detail.value
    })
  },
  bindInpAfter(e) {
    this.setData({
      afterVal: e.detail.value
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  getSubmit: function() {
    let self = this;
    let warn = '';
    let projectObjArray = self.data.projectObjArray;
    let foreModularObjArray = self.data.foreModularObjArray;
    let afterModularObjArray = self.data.afterModularObjArray;
    if(this.data.mornIndex == 0 && this.data.afterIndex == 0) {
      warn = "请选择至少一个项目"
      wx.showToast({
        title: warn,
        icon: 'none'
      })
      return;
    }
    if (!this.data.throughTheReason) {
      warn = "补录原因不能为空"
      wx.showToast({
        title: warn,
        icon: 'none'
      })
      return;
    }
    let newMornIndex = self.data.mornIndex <= 0 ? -999 : self.data.mornIndex;
    let newForeModular = -999;
    if(foreModularObjArray instanceof Array && foreModularObjArray.length !== 0) {
      newForeModular = self.data.foreModular < 0 ? -999 : self.data.foreModular;
    }
    let newAfterIndex = self.data.afterIndex <= 0 ? -999 : self.data.afterIndex;
    let newAfterModular = -999;
    if(afterModularObjArray instanceof Array && afterModularObjArray.length !== 0) {
      newAfterModular = self.data.afterModular < 0 ? -999 : self.data.afterModular;
    }
    App.doPost({
      url: host_url + "/oa/admin/manhour/oaManhour/backTracking",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        state: false,
        date: self.data.date,
        projectFore: newMornIndex === -999 ? '' : projectObjArray[newMornIndex - 1].id,
        foreModular: newForeModular === -999 ? '' : foreModularObjArray[newForeModular].id,
        projectForeremarks: self.data.morningVal,
        projectAfter: newAfterIndex === -999 ? '' : projectObjArray[newAfterIndex - 1].id,
        afterModular: newAfterModular === -999 ? '' : afterModularObjArray[newAfterModular].id,
        projectForeName:newMornIndex === -999 ? '' : projectObjArray[newMornIndex - 1].name,
        projectAfterName:newAfterIndex === -999 ? '' : projectObjArray[newAfterIndex - 1].name,
        foreModularName:newForeModular === -999 ? '暂无模块选项' : foreModularObjArray[newForeModular].name,
        afterModularName:newAfterModular === -999 ? '暂无模块选项' : afterModularObjArray[newAfterModular].name,
        projectAfterremarks: self.data.afterVal,
        throughTheReason: self.data.throughTheReason
      },
      method: "POST",
      success: (res) => {
        // console.log(res)
        if (res.data.status == 'success') {
          wx.showToast({
            title: '提交成功！',
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else if(res.data.status == 'no_login') {
          wx.showToast({
            title: "登录超时",
            icon: 'none'
          })
          wx.reLaunch({
            url: '/pages/login/index'
          });
        }else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
    
   
  },
  bindMornChange: function(e) {
    let self = this;
    this.data.mornIndex =e.detail.value;
    this.setData({
      mornIndex: e.detail.value,
      foreModular: 0
    })
    if(e.detail.value >= 1) {
      let id = self.data.projectObjArray[e.detail.value - 1].id;
      App.doPost({
        url: host_url + "/oa/admin/manhour/oaRecordProject/getAllModular?typeId="+id,
        success: (res) => {
          let arr = [];
          let brr = [];
          res.data.objs[0].forEach(data => {
            arr.push({
              id: data.key,
              name: data.value
            });
            brr.push(data.value);
          })
          /*
            判断arr是否有值，如果没值，说明未有模块，数组添加 暂无项目模块 选项
            如果有值，则不出现改字样，模块选项变成必填项
          */
         if(brr instanceof Array && brr.length === 0) {
            brr = [];
            brr.push('暂无项目模块');
          }
          self.setData({
            foreModularArray: brr,
            foreModularObjArray: arr
          })
          wx.hideLoading()
        }
      })
    } else if(e.detail.value <= 0) {
      self.setData({
        foreModularArray: ['暂无项目模块'],
        foreModularObjArray: []
      })
    }

  },
  bindModularChange: function(e){
    let self = this;
    this.data.foreModular = e.detail.value;
    this.setData({
      foreModular: e.detail.value
    })
  },
  bindAfterChange: function(e) {
    let self = this;
    this.data.afterIndex = e.detail.value;
    this.setData({
      afterIndex: e.detail.value,
      afterModular: 0
    })
    if(e.detail.value >= 1) { 
      let id = self.data.projectObjArray[e.detail.value - 1].id;
      App.doPost({
        url: host_url + "/oa/admin/manhour/oaRecordProject/getAllModular?typeId=" + id,
        success: (res) => {
          let arr = [];
          let brr = [];
          res.data.objs[0].forEach(data => {
            arr.push({
              id: data.key,
              name: data.value
            });
            brr.push(data.value);
          })
          /*
            判断arr是否有值，如果没值，说明未有模块，数组添加 暂无项目模块 选项
            如果有值，则不出现改字样，模块选项变成必填项
          */
         if(brr instanceof Array && brr.length === 0) {
            brr.push('暂无项目模块');
            self.setData({
              foreModular: 0
            })
          }
          self.setData({
            afterModularArray: brr,
            afterModularObjArray: arr
          })
          wx.hideLoading()
        }
      })
    } else if(e.detail.value <= 0) {
      self.setData({
        afterModularArray: ['暂无项目模块'],
        afterModularObjArray: []
      })
    }
  },
  bindAfterModularChange: function (e) {
    let self = this;
    this.data.afterModular = e.detail.value;
    let id = self.data.afterModularObjArray[e.detail.value - 1].id;
    this.setData({
      afterModular: e.detail.value
    })
  },
  showTextarea() {
    this.setData({
      textReason: true,
      isFocusReason: true
    })
  },
  showTextareaMorning() {
    this.setData({
      textFore: true,
      isFocusFore: true
    })
  },
  showTextareaAfter() {
    this.setData({
      textAfter: true,
      isFocusAfter: true
    })
  },
  focusblurMorning() {
    this.setData({
      textFore: false,
      isFocusFore: false
    })
  },
  focusblurAfter() {
    this.setData({
      textAfter: false,
      isFocusAfter: false
    })
  },
  focusblur() {
    this.setData({
      textReason: false,
      isFocusReason: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getAllProject() {
    let self = this;
    App.doPost({
      url: host_url + "/oa/admin/manhour/oaRecordProject/getAllPrjoect",
      success: (res) => {
        let arr = [];
        let brr = ['点击选择项目'];
        res.data.objs[0].forEach(data => {
          arr.push({
            id: data.key,
            name: data.value
          });
          brr.push(data.value);
        })
        self.setData({
          projectArray: brr,
          projectObjArray: arr
        })
        wx.hideLoading()
      }
    })
  },
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...'
    })
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month.toString()
    }
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day.toString()
    }
    this.setData({
      navH: App.globalData.navHeight,
      date: `${year}-${month}-${day}`
    })
    this.getAllProject();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})