const App = getApp();
var host_url = App.globalData.host_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    buttonName:'拍照识别',
    idNumber:'',
    newList:[],
    cameraHight:190,
    class:'',
    image:'',
    active:'',
    imageHight:0,
    listType:"row",
    buttonActive:'',
    addclass:''
  },
  navBack: function (event) {
    wx.navigateBack({
      url: '/pages/tool/index'
    })
      
  },
  preTakePhoto:function () {
    this.setData({
      active:'',
      image:'',
      imageHight:0,
      buttonActive:''
    })
  },
  takePhoto: function(e){
    var that = this
    if(that.data.idNumber === "7"){
      wx.chooseImage({
        count: 1, 
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function(res){
          console.log(res.tempFilePaths)
          wx.uploadFile({
            url: host_url + '/oa/api/vatInvoice',
            filePath: res.tempFilePaths[0],
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: (result) => {
              console.log(result)
              var data = JSON.parse(result.data)
              console.log(JSON.parse(result.data))
              var list = JSON.parse(data.object.words_result)
              console.log(list)
              wx.hideLoading();
              that.setData({
                active:'active',
                cameraHight:0,
                addclass:'addclass',
                newList:[
                  {
                    name:'发票类型',
                    value:list.words_result.InvoiceType
                  },
                  {
                    name:'发票代码',
                    value:list.words_result.InvoiceCode
                  },
                  {
                    name:'发票号码',
                    value:list.words_result.InvoiceNum
                  },
                  {
                    name:'开票日期',
                    value:list.words_result.InvoiceDate
                  },
                  {
                    name:'校验码',
                    value:list.words_result.CheckCode
                  },
                  {
                    name:'购买方',
                    value:list.words_result.PurchaserName
                  },
                  {
                    name:'合计大写',
                    value:list.words_result.AmountInWords
                  },
                  {
                    name:'合计小写',
                    value:list.words_result.AmountInFiguers
                  },
                  {
                    name:'销售方',
                    value:list.words_result.SellerName
                  },
                  {
                    name:'销售方纳税人识别码',
                    value:list.words_result.SellerRegisterNum
                  },
                  {
                    name:'销售方地址及电话',
                    value:list.words_result.SellerAddress
                  },
                  {
                    name:'销售方开户行及账号',
                    value:list.words_result.SellerBank
                  },
                  {
                    name:'收款人',
                    value:list.words_result.Payee
                  },
                  {
                    name:'复核',
                    value:list.words_result.Checker
                  },
                  {
                    name:'开票人',
                    value:list.words_result.NoteDrawer
                  },
                ]
              })
          }
          })
        }
      })
      
    }else{
      const ctx = wx.createCameraContext();
      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          // console.log(res.tempImagePath);
            wx.showLoading({
              title: '正在识别',
            })
            if(that.data.idNumber === "1"){
              wx.uploadFile({
                url: host_url + '/oa/api/idcard',
                filePath: res.tempImagePath,
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                success: (result) => {
                  console.log(result)
                  var data = JSON.parse(result.data)
                  console.log(JSON.parse(result.data))
                  wx.hideLoading();
                    if(data.status === "1"){
                      var list = data.object.words_result
                      console.log(list)
                      that.setData({
                        image:res.tempImagePath,
                        active:'active',
                        imageHight:that.data.cameraHight,
                        buttonActive:'1',
                        newList:[
                          {
                            name:"住址",
                            value: list.住址.words
                          },
                          {
                            name:"公民身份号码",
                            value: list.公民身份号码.words
                          },
                          {
                            name:"出生",
                            value: list.出生.words
                          },
                          {
                            name:"姓名",
                            value: list.姓名.words
                          },
                          {
                            name:"性别",
                            value: list.性别.words
                          },
                          {
                            name:"民族",
                            value: list.民族.words
                          }
                        ]
                      })
                  }else{
                    wx.showToast({
                      title: data.message,
                      icon: 'none',
                      duration: 2000
                    })
                  }
              }
              })
            }
            if(that.data.idNumber === "2"){
              wx.uploadFile({
                url: host_url + '/oa/api/bankcard',
                filePath: res.tempImagePath,
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                success: (result) => {
                  console.log(result)
                  var data = JSON.parse(result.data)
                  console.log(JSON.parse(result.data))
                  wx.hideLoading();
                    if(data.status === "1"){
                      var list = data.object.words_result
                      var cardType = "未识别出卡的类型"
                      if(list.bank_card_type === "0"){
                        cardType = "未识别出卡的类型"
                      }
                      if(list.bank_card_type === "1"){
                        cardType = "借记卡"
                      }
                      if(list.bank_card_type === "2"){
                        cardType = "信用卡"
                      }
                      that.setData({
                        image:res.tempImagePath,
                        active:'active',
                        imageHight:that.data.cameraHight,
                        buttonActive:'1',
                        newList:[
                          {
                            name:"银行",
                            value: list.bank_name
                          },
                          {
                            name:"卡号",
                            value: list.bank_card_number
                          },
                          {
                            name:"卡类型",
                            value: cardType
                          },
                          {
                            name:"日期",
                            value: list.valid_date
                          }
                        ]
                      })
                  }else{
                    wx.showToast({
                      title: data.message,
                      icon: 'none',
                      duration: 2000
                    })
                  }
              }
              })
            }
            if(that.data.idNumber === "3"){
              wx.uploadFile({
                url: host_url + '/oa/api/drivingLicense',
                filePath: res.tempImagePath,
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                success: (result) => {
                  console.log(result)
                  var data = JSON.parse(result.data)
                  console.log(JSON.parse(result.data))
                  wx.hideLoading();
                    if(data.status === "1"){
                      var list = data.object.words_result
                      that.setData({
                        image:res.tempImagePath,
                        active:'active',
                        imageHight:that.data.cameraHight,
                        buttonActive:'1',
                        newList:[
                          {
                            name:"姓名",
                            value: list.姓名.words
                          },
                          {
                            name:"性别",
                            value: list.性别.words
                          },
                          {
                            name:"出生日期",
                            value: list.出生日期.words
                          },
                          {
                            name:"住址",
                            value: list.住址.words
                          },
                          {
                            name:"国籍",
                            value: list.国籍.words
                          },
                          {
                            name:"证号",
                            value: list.证号.words
                          },
                          {
                            name:"准驾车型",
                            value: list.准驾车型.words
                          },
                          {
                            name:"初次领证日期",
                            value: list.初次领证日期.words
                          },
                          {
                            name:"有效期限",
                            value: list.有效期限.words
                          },
                          {
                            name:"至",
                            value: list.至.words
                          }
                        ]
                      })
                  }else{
                    wx.showToast({
                      title: data.message,
                      icon: 'none',
                      duration: 2000
                    })
                  }
              }
              })
            }
            if(that.data.idNumber === "4"){
              wx.uploadFile({
                url: host_url + '/oa/api/businessLicense',
                filePath: res.tempImagePath,
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                success: (result) => {
                  console.log(result)
                  var data = JSON.parse(result.data)
                  console.log(JSON.parse(result.data))
                  wx.hideLoading();
                    if(data.status === "1"){
                      var list = data.object.words_result
                      that.setData({
                        image:res.tempImagePath,
                        active:'active',
                        imageHight:that.data.cameraHight,
                        buttonActive:'1',
                        newList:[
                          {
                            name:"单位名称",
                            value: list.单位名称.words
                          },
                          {
                            name:"地址",
                            value: list.地址.words
                          },
                          {
                            name:"成立日期",
                            value: list.成立日期.words
                          },
                          {
                            name:"有效期",
                            value: list.有效期.words
                          },
                          {
                            name:"法人",
                            value: list.法人.words
                          },
                          {
                            name:"注册资本",
                            value: list.注册资本.words
                          },
                          {
                            name:"社会信用代码",
                            value: list.社会信用代码.words
                          },
                          {
                            name:"类型",
                            value: list.类型.words
                          },
                          {
                            name:"组成形式",
                            value: list.组成形式.words
                          },
                          {
                            name:"证件编号",
                            value: list.证件编号.words
                          }
                        ]
                      })
                  }else{
                    wx.showToast({
                      title: data.message,
                      icon: 'none',
                      duration: 2000
                    })
                  }
              }
              })
            }
            if(that.data.idNumber === "5"){
              wx.uploadFile({
                url: host_url + '/oa/api/licensePlate',
                filePath: res.tempImagePath,
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                success: (result) => {
                  console.log(result)
                  var data = JSON.parse(result.data)
                  console.log(JSON.parse(result.data))
                  wx.hideLoading();
                    if(data.status === "1"){
                      var list = data.object.words_result
                      that.setData({
                        image:res.tempImagePath,
                        active:'active',
                        imageHight:that.data.cameraHight,
                        buttonActive:'1',
                        newList:[
                          {
                            name:"车牌颜色",
                            value: list.words_result.color
                          },
                          {
                            name:"车牌号",
                            value: list.words_result.number
                          }
                        ]
                      })
                  }else{
                    wx.showToast({
                      title: data.message,
                      icon: 'none',
                      duration: 2000
                    })
                  }
              }
              })
            }
            if(that.data.idNumber === "6"){
              wx.uploadFile({
                url: host_url + '/oa/api/trainTicket',
                filePath: res.tempImagePath,
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                success: (result) => {
                  console.log(result)
                  var data = JSON.parse(result.data)
                  console.log(JSON.parse(result.data))
                  wx.hideLoading();
                    if(data.status === "1"){
                      var list = data.object.words_result
                      that.setData({
                        image:res.tempImagePath,
                        active:'active',
                        imageHight:that.data.cameraHight,
                        buttonActive:'1',
                        newList:[
                          {
                            name:"乘坐人",
                            value: list.name
                          },
                          {
                            name:"日期",
                            value: list.date
                          },
                          {
                            name:"车次",
                            value: list.train_num
                          },
                          {
                            name:"起始站",
                            value: list.starting_station
                          },
                          {
                            name:"终点站",
                            value: list.destination_station
                          },
                          {
                            name:"座位",
                            value: list.seat_category
                          },
                          {
                            name:"票价",
                            value: list.ticket_rates
                          }
                        ]
                      })
                  }else{
                    wx.showToast({
                      title: data.message,
                      icon: 'none',
                      duration: 2000
                    })
                  }
              }
              })
            }
            if(that.data.idNumber === "8"){
              wx.uploadFile({
                url: host_url + '/oa/api/accurateBasic',
                filePath: res.tempImagePath,
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                success: (result) => {
                  console.log(result)
                  var data = JSON.parse(result.data)
                  console.log(JSON.parse(result.data))
                  wx.hideLoading();
                    if(data.status === "1"){
                      var list = data.object.words_result
                      console.log(list)
                      that.setData({
                        image:res.tempImagePath,
                        active:'active',
                        imageHight:that.data.cameraHight,
                        buttonActive:'1',
                        listType:'block',
                        newList:list
                      })
                  }else{
                    wx.showToast({
                      title: data.message,
                      icon: 'none',
                      duration: 2000
                    })
                  }
              }
              })
            }
            if(that.data.idNumber === "9"){
              wx.uploadFile({
                url: host_url + '/oa/api/handwriting',
                filePath: res.tempImagePath,
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                success: (result) => {
                  console.log(result)
                  var data = JSON.parse(result.data)
                  console.log(JSON.parse(result.data))
                  wx.hideLoading();
                    if(data.status === "1"){
                      var list = data.object.words_result
                      that.setData({
                        image:res.tempImagePath,
                        active:'active',
                        imageHight:that.data.cameraHight,
                        buttonActive:'1',
                        listType:'block',
                        newList:list
                      })
                  }else{
                    wx.showToast({
                      title: data.message,
                      icon: 'none',
                      duration: 2000
                    })
                  }
              }
              })
            }
            if(that.data.idNumber === "10"){
              wx.uploadFile({
                url: host_url + '/oa/api/classify',
                filePath: res.tempImagePath,
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                formData: {
                  "type": 'dish',
                },
                success: (result) => {
                  console.log(result)
                  var data = JSON.parse(result.data)
                  console.log(JSON.parse(result.data))
                  wx.hideLoading();
                    if(data.status === "1"){
                      var list = data.object.result[0]
                      var image_url = list.baike_info.image_url
                      if(list.name === '非菜'){
                        image_url = res.tempImagePath
                      }
                        that.setData({
                          image:image_url,
                          active:'active',
                          imageHight:that.data.cameraHight,
                          buttonActive:'1',
                          listType:'rowBlock',
                          newList:[
                            {
                              name:'菜品名字',
                              value:list.name,
                              id:'1'
                            },
                            {
                              name:'菜品详情',
                              value:list.baike_info.description,
                              id:'2'
                            }
                          ]
                        }) 
                  }else{
                    wx.showToast({
                      title: data.message,
                      icon: 'none',
                      duration: 2000
                    })
                  }
              }
              })
            }
            if(that.data.idNumber === "11"){
              wx.uploadFile({
                url: host_url + '/oa/api/classify',
                filePath: res.tempImagePath,
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                formData: {
                  "type": 'animal',
                },
                success: (result) => {
                  console.log(result)
                  var data = JSON.parse(result.data)
                  console.log(JSON.parse(result.data))
                  wx.hideLoading();
                    if(data.status === "1"){
                      var list = data.object.result[0]
                      var image_url = list.baike_info.image_url
                      if(list.name === "非动物"){
                        image_url = res.tempImagePath
                      }
                      that.setData({
                        image:image_url,
                        active:'active',
                        imageHight:that.data.cameraHight,
                        buttonActive:'1',
                        listType:'rowBlock',
                        newList:[
                          {
                            name:'动物名字',
                            value:list.name,
                            id:'1'
                          },
                          {
                            name:'动物详情',
                            value:list.baike_info.description,
                            id:'2'
                          }
                        ]
                      })
                  }else{
                    wx.showToast({
                      title: data.message,
                      icon: 'none',
                      duration: 2000
                    })
                  }
              }
              })
            }
            if(that.data.idNumber === "12"){
              wx.uploadFile({
                url: host_url + '/oa/api/classify',
                filePath: res.tempImagePath,
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                formData: {
                  "type": 'plant',
                },
                success: (result) => {
                  console.log(result)
                  var data = JSON.parse(result.data)
                  console.log(JSON.parse(result.data))
                  wx.hideLoading();
                    if(data.status === "1"){
                      var list = data.object.result[0]
                      var image_url = list.baike_info.image_url
                      if(list.name === "非植物"){
                        image_url = res.tempImagePath
                      }
                      that.setData({
                        image:image_url,
                        active:'active',
                        imageHight:that.data.cameraHight,
                        buttonActive:'1',
                        listType:'rowBlock',
                        newList:[
                          {
                            name:'植物名字',
                            value:list.name,
                            id:'1'
                          },
                          {
                            name:'植物详情',
                            value:list.baike_info.description,
                            id:'2'
                          }
                        ]
                      })
                  }else{
                    wx.showToast({
                      title: data.message,
                      icon: 'none',
                      duration: 2000
                    })
                  }
              }
              })
            }
            if(that.data.idNumber === "13"){
              wx.uploadFile({
                url: host_url + '/oa/api/classify',
                filePath: res.tempImagePath,
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                formData: {
                  "type": 'car',
                },
                success: (result) => {
                  console.log(result)
                  var data = JSON.parse(result.data)
                  console.log(JSON.parse(result.data))
                  wx.hideLoading();
                    if(data.status === "1"){
                      var list = data.object.result[0]
                      var image_url = list.baike_info.image_url
                      if(list.name === '非车类'){
                        image_url = res.tempImagePath
                      }
                      that.setData({
                        image:image_url,
                        active:'active',
                        imageHight:that.data.cameraHight,
                        buttonActive:'1',
                        listType:'rowBlock',
                        newList:[
                          {
                            name:'车型名称',
                            value:list.name,
                            id:'1'
                          },
                          {
                            name:'车型详情',
                            value:list.baike_info.description,
                            id:'2'
                          }
                        ]
                      })
                  }else{
                    wx.showToast({
                      title: data.message,
                      icon: 'none',
                      duration: 2000
                    })
                  }
              }
              })
            }
            if(that.data.idNumber === "14"){
              wx.uploadFile({
                url: host_url + '/oa/api/classify',
                filePath: res.tempImagePath,
                name: 'file',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                formData: {
                  "type": 'landmark',
                },
                success: (result) => {
                  console.log(result)
                  var data = JSON.parse(result.data)
                  console.log(JSON.parse(result.data))
                  wx.hideLoading();
                    if(data.status === "1"){
                      var list = data.object.result[0]
                      that.setData({
                        image:res.tempImagePath,
                        active:'active',
                        imageHight:that.data.cameraHight,
                        buttonActive:'1',
                        listType:'row',
                        newList:[
                          {
                            name:'地标名字',
                            value:JSON.parse(list).result.landmark
                          }
                  
                        ]
                      })
                  }else{
                    wx.showToast({
                      title: data.message,
                      icon: 'none',
                      duration: 2000
                    })
                  }
              }
              })
            }
        }
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options.idNumber)
    that.setData({
      navH: App.globalData.navHeight,
      idNumber:options.idNumber
    })
    if(options.idNumber === "1"){
      that.setData({
        title:'身份证识别'
      })
    }
    if(options.idNumber === "2"){
      that.setData({
        title:'银行卡识别'
      })
    }
    if(options.idNumber === "3"){
      that.setData({
        title:'驾驶证识别'
      })
    }
    if(options.idNumber === "4"){
      that.setData({
        title:'营业执照识别',
        cameraHight:400
      })
    }
    if(options.idNumber === "5"){
      that.setData({
        title:'车牌识别'
      })
    }
    if(options.idNumber === "6"){
      that.setData({
        title:'火车票识别'
      })
    }
    if(options.idNumber === "7"){
      that.setData({
        title:'增值税发票识别',
        // cameraHight:300,
        buttonName:'请选择图片识别',
        active:'active'     
       })
    }
    if(options.idNumber === "8"){
      that.setData({
        title:'通用文字识别',
        cameraHight:400
      })
    }
    if(options.idNumber === "9"){
      that.setData({
        title:'手写文字识别',
        cameraHight:300
      })
    }
    if(options.idNumber === "10"){
      that.setData({
        title:'菜品识别',
        cameraHight:400
      })
    }
    if(options.idNumber === "11"){
      that.setData({
        title:'动物识别',
        cameraHight:400
      })
    }
    if(options.idNumber === "12"){
      that.setData({
        title:'植物识别',
        cameraHight:400
      })
    }
    if(options.idNumber === "13"){
      that.setData({
        title:'车型识别',
        cameraHight:400
      })
    }
    if(options.idNumber === "14"){
      that.setData({
        title:'地标识别',
        cameraHight:400
      })
    }
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