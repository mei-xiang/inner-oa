// pages/index-new/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form_: {}, array:[1,2,3]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindDateChange:function(e){
    var from_new = this.data.form_;
    from_new.time = e.detail.value;
    this.setData({
      form_: from_new
    })
  },
  bindDateChange2: function (e) {
    console.log(e)
    var from_new = this.data.form_;
    from_new.sw_xm = e.detail.value;
    this.setData({
      form_: from_new
    })
  },
  Submit:function(e){
    console.log(e.detail.value)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})