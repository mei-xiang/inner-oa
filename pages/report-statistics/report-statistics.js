// pages/report-statistics/report-statistics.js
const App = getApp();
var host_url = App.globalData.host_url;
Page({

  data: {
    navH: '',
    title: '报表统计',
    tabs: ['请假报表', '报销报表'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: '15%',
    startTime: '',
    endTime: '',
    selectStartTime: false,
    selectEndTime: false,
    scrollHeight: '',
    isSelectWorker: false, //控制选择员工遮罩
    leaveList: [], //请假数组
    baoxiaoList: [], //报销数组
    workerList: [],
    selectWorkerIdList: [], //选择的员工id数组。用于后台传值
    selectWorkerList: [], //选择的员工数组,用于渲染
    selectAll: true, //员工全选
  },

  tabClick(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    })
  },
  bindSelectALl: function () {
    let selectWorkerList = []
    let selectWorkerIdList = []
    if (this.data.selectAll) {
      this.data.workerList.forEach(item => {
        item.isSelect = true
        selectWorkerList.push(item.name)
        selectWorkerIdList.push(item.id)
      });
    } else {
      this.data.workerList.forEach(item => {
        item.isSelect = false
        selectWorkerList = []
        selectWorkerIdList = []
      });
    }
    this.setData({
      selectAll: !this.data.selectAll,
      workerList: this.data.workerList,
      selectWorkerList: selectWorkerList,
      selectWorkerIdList: selectWorkerIdList
    })
  },
  //点击选择员工
  bindSelectWorker: function (e) {
    let id = e.currentTarget.dataset.wid
    console.log(e, "id", id)
    let selectWorkerList = []
    let selectWorkerIdList = []
    this.data.workerList.forEach(item => {
      if (item.id == id) {
        item.isSelect = !item.isSelect
      }
      if (item.isSelect) {
        selectWorkerList.push(item.name)
        selectWorkerIdList.push(item.id)
      }
    });
    this.setData({
      workerList: this.data.workerList,
      selectWorkerList: selectWorkerList,
      selectWorkerIdList: selectWorkerIdList
    })
    console.log("员工数组", this.data.workerList)
    console.log("选择的员工数组", this.data.selectWorkerList)
    console.log("选择的员工id数组", this.data.selectWorkerIdList)
  },

  //点击选择员工
  selectWoker: function () {
    this.setData({
      isSelectWorker: true
    })
  },
  //点击阴影关闭选择
  closeShade: function () {
    this.setData({
      isSelectWorker: false
    })
  },

  //选择员工确认按钮
  bindEnsure: function () {
    this.setData({
      isSelectWorker: false
    })
    if (this.data.endTime == '' && this.data.startTime == '') {
      this.getReportList()
    } else if (this.data.endTime != '' && this.data.startTime != '') {
      this.getReportList()
    }
  },

  selectStart: function () {
    this.setData({
      selectStartTime: true
    })
    console.log(this.data.selectStartTime)
  },

  selectEnd: function () {
    this.setData({
      selectEndTime: true
    })
  },

  bindStartDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startTime: e.detail.value
    })
    if (this.data.endTime != '') {
      this.getReportList()
    }
  },

  bindEndDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endTime: e.detail.value
    })
    if (this.data.startTime != '') {
      this.getReportList()
    }
  },

  navBack: function (event) {
    wx.switchTab({
      url: '/pages/my/index',
    })
  },

  toLeaveReportDet: function () {
    wx.navigateTo({
      url: '/pages/report-statistics/report-statistics-leaveDetail/report-statistics-leaveDetail'
    })
  },
  toBaoxiaoReportDet: function () {
    wx.navigateTo({
      url: '/pages/report-statistics/report-statistics-baoxiaoDetail/report-statistics-baoxiaoDetail'
    })
  },

  getReportList() {
    let self = this
    App.doPost({
      url: host_url + "oa/ajax/workflow/leaveList",
      data: {
        ids: this.data.selectWorkerIdList,
        startTime: this.data.startTime,
        endTime: this.data.endTime
      },
      success: (res) => {
        if (res.data.status == "1") {
          self.setData({
            leaveList: res.data.data[0],
            baoxiaoList: res.data.data[1],
          })
        }
        console.log("报表列表", res)
      },
    })
  },
  onLoad: function (options) {
    this.setData({
      navH: App.globalData.navHeight * 2,
      scrollHeight: wx.getSystemInfoSync().windowHeight
    })

    let self = this
    //获取员工列表
    App.doPost({
      url: host_url + "oa/ajax/employeeList",
      data: {},
      success: (res) => {
        if (res.data.status == "1") {
          let workerLists = []
          res.data.object.forEach(item => {
            workerLists.push({
              name: item.name,
              id: item.id,
              isSelect: false,
            })
          });
          //默认选择一个员工
          self.data.selectWorkerList[0] = workerLists[0].name
          self.data.selectWorkerIdList[0] = workerLists[0].id
          workerLists[0].isSelect = true
          self.setData({
            selectWorkerList: self.data.selectWorkerList,
            selectWorkerIdList: self.data.selectWorkerIdList,
            workerList: workerLists
          })
          self.getReportList()
        }
        console.log("员工列表", res)
      },
    })
  },

})