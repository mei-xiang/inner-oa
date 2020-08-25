const App = getApp();
var util = require('../../utils/util.js')
var host_url = App.globalData.host_url;
Page({
	data: {
		title: '申请信息',
		ifShow: false,
		myOptions: {},
		modules: [],
		inputTitle: "",
		src: '/img/jrzh.png',
		imgUrl: [],
		previewUrl: [],
		orginUrl: [],
		canReback: false, //能否撤回
		instanceId: '',
		hasReback:false //判断是否已经撤回审核
	},
	goPreviewImage: function (e) {
		var that = this
		// console.log(e)
		var src = e.target.dataset.src
		var url = src.slice(0, src.length - 1);
		var index = src.slice(src.length - 1)
		if (url === "/img/download.png") {
			var fileUrl = that.data.orginUrl[index]
			wx.downloadFile({
				url: host_url + fileUrl,
				success(result) {
					if (result.statusCode === 200) {
						const filePath = result.tempFilePath
						wx.openDocument({
							filePath,
							success(res) {
								if (res.errMsg === 'openDocument:ok') {
									wx.showToast({
										title: '打开文档成功',
										icon: 'none',
										duration: 2000
									})
								} else {
									wx.showToast({
										title: '打开文档失败',
										icon: 'none',
										duration: 2000
									})
								}
							}
						})
					} else {
						wx.showToast({
							title: '下载失败',
							icon: 'none',
							duration: 2000
						})
					}
				}
			})
		} else {
			wx.previewImage({
				current: url, // 当前显示图片的链接，不填则默认为 urls 的第一张
				urls: that.data.previewUrl,
			})
		}


	},
	goDetails: function (e) {
		var that = this;
		var viewText = e.currentTarget.dataset.businesstype;
	},
	navBack: function (event) {
		wx.navigateBack({

		})
	},
	showMsg: function (e) {
		this.setData({
			ifShow: true,
			content: this.data.myOptions[e.currentTarget.id],
		})
	},
	hideBody: function (e) {
		this.setData({
			ifShow: false,
		})
	},
	//撤回申请
	rebackFLow: function () {
		App.doPost({
			url: host_url + "oa/ajax/workflow/suspension",
			data: {
				instanceId: this.data.instanceId
			},
			success: (res) => {
				if (res.data && res.data.status == "1") {
					wx.showToast({
						title: "撤回成功",
						icon: 'none',
						duration: 2000
					});
					setTimeout(() => {
						wx.navigateBack({
							delta: 1
						  })
					}, 2000);
				}
				
			}
		})
		console.log("撤回审批")
	},
	onLoad: function (options) {
		this.setData({
			instanceId: options.instanceId
		})
		var that = this;
		that.setData({
			navH: App.globalData.navHeight,
		})
		var histories = [];
		var myOptions = {};
		var inputTitle = options.inputTitle;
		console.log("申请",inputTitle)
		App.doPost({
			url: host_url + "oa/ajax/workflow/instanceDetails",
			data: {
				instanceId: options.instanceId
			},
			success: (res) => {
				console.log(res)
				if (res.data && res.data.status == "1") {
					if (res.data.object.suspensionState == 1) {
						this.setData({
							canReback: true
						})
					} else {
						this.setData({
							canReback: false
						})
					}

					if(res.data.object.instance.result == 3){
						this.setData({
							hasReback:true
						})
					}else{
						this.setData({
							hasReback:false
						})
					}
					var instance = res.data.object.instance;
					var modules = res.data.object.modules;
					var imgUrl = []
					var imgSrc = []
					var previewUrl = []
					for (var i = 0; i < modules[0].fieldList.length; i++) {
						if (modules[0].fieldList[i].inputType === "upload") {
							if (modules[0].fieldList[i].fieldContent != '') {
								imgUrl = modules[0].fieldList[i].fieldContent.split(",")
								that.setData({
									orginUrl: imgUrl
								})
								console.log(imgUrl)
								for (var j = 0; j < imgUrl.length; j++) {
									var imgLast = imgUrl[j].slice(imgUrl[j].length - 3)
									console.log(imgLast)
									if (imgLast === 'jpg' || imgLast === 'jpg' || imgLast === 'png' || imgLast === 'PNG') {
										imgSrc.push({
											url: host_url + imgUrl[j],
											index: j
										})
										previewUrl.push(
											host_url + imgUrl[j]
										)
									} else {
										imgSrc.push({
											url: "/img/download.png",
											index: j
										})
									}
								}
							} else {
								this.setData({
									imgSrc: []
								})
							}
						}
					}

					var historyList = instance['historyList'];
					var time = "";
					for (var i = 0; i < historyList.length; i++) {
						histories.push({
							name: historyList[i].name,
							time: !historyList[i]['createTime'] ? "" : util.formatTime(new Date(historyList[i]['createTime'])).substring(0, 10),
							createBy: historyList[i].createBy.split(".")[1],
							options: historyList[i]['options']
						});
						myOptions[historyList[i].id] = historyList[i]['options'];
					}
					console.log(modules)
					that.setData({
						histories: histories,
						myOptions: myOptions,
						modules: modules,
						inputTitle: inputTitle,
						imgUrl: imgSrc,
						previewUrl: previewUrl
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
	},
})