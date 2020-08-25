var util = require('../../utils/util.js')
const App = getApp();
const taskId = "";
/*const picker = {};
const picker_value = {};
const fieldList = [];*/
var host_url = App.globalData.host_url;
Page({
	data: {
		taskId: "",
		myFieldList: [],
		myPickers: {},
		fieldList: [],
		picker_value: {},
		picker: {},
		buttons: [],
		params: {},
		hidden: true,
		toastList: {
			ifShow: false,
		},
		options: "",
		ifBtnShow: false,
		moreList: [],
		fileList: [],
		fileParam: {},
		host_url: '',
		lastHis: {},
		isSureList: [],
		fillTipList: {},
		tasksName: '',
		orginUrl: [],
		textarea_value: {},
		histories:[]
	},
	setValue: function (e) {
		this.setData({
			options: e.detail.value
		})
	},
	
	bindPickerChange: function (e) {
		var fieldList = this.data.myFieldList;
		var picker_value = this.data.picker_value;
		var picker_id = e.currentTarget.id;
		this.data.picker[picker_id] = e.detail.value;
		for (var i = 0; i < fieldList.length; i++) {
			if (fieldList[i].fieldKey == picker_id) {
				var _selected = fieldList[i].selectList[e.detail.value];
				picker_value[picker_id] = _selected.id;
			}
		}
		this.setData({
			myPickers: this.data.picker
		})
	},
	bindDateChange(e) {
		var picker_id = e.currentTarget.id;
		this.data.picker[picker_id] = e.detail.value;
		this.data.picker_value[picker_id] = e.detail.value;
		this.setData({
			myPickers: this.data.picker
		})
	},
	goNext: function (e) {
		var that = this;
		var viewText = e.currentTarget.dataset.businesstype;
		wx.navigateTo({
			url: '/pages/examineFullTwo/index?businessType=' + viewText,
		})

	},
	taskConfirm: function (e) {
		wx.showLoading({
			title: '提交中',
			mask: true
		});
		var _taskId = this.data.taskId;
		/*  	var input_value = e.detail.value;
      	var form_value = Object.assign(e.detail.value, this.data.picker_value);
      	
      	//form_value['typeId'] = _typeId;
      	this.data.params['fieldSet'] = JSON.stringify(form_value);
      	this.data.params['options'] = "通过";
				this.data.params['doType'] = "1";*/
		this.data.params['options'] = this.data.options;
		App.doPost({
			url: host_url + "oa/ajax/workflow/doTask/" + _taskId,
			data: this.data.params,
			success: (res) => {
				wx.hideLoading();
				if (res.data && res.data.status == "1") {
					wx.showToast({
						title: '提交成功',
						icon: 'success',
						duration: 800,
						success: function () {
							wx.reLaunch({
								url: '/pages/declarationExamine/index'
							});
						}
					});
        } else if (res.data.status == 0) {
          wx.redirectTo({
            url: '../login/index'
          })
        }  else {
					wx.showToast({
						title: res.data.message ? res.data.message : "系统错误",
						icon: 'none',
						duration: 3000
					});
				}
			}
		})
	},
	taskCancel: function () {
		this.setData({
			"toastList.ifShow": false
		})
	},
	doTask: function (e) {
		this.setData({
			ifBtnShow: false
		})
		var doType = e.currentTarget.dataset.type;
		if (!doType) {
			doType = "1";
		}
		this.data.params['doType'] = doType;
		var isSureList = this.data.isSureList;
		//保存和通过才装配数据
		if ("1" === doType || "0" === doType) {
			var form_value = Object.assign(e.detail.value, this.data.picker_value);
			form_value = Object.assign(form_value, this.data.fileParam);
			form_value = Object.assign(form_value, this.data.textarea_value);
			console.log(form_value)
			this.data.params['fieldSet'] = JSON.stringify(form_value);
			//如果是通过，则检查必填项
			if ("1" === doType) {
				if (isSureList && isSureList.length > 0) {
					var flag = false;
					for (var i = 0; i < isSureList.length; i++) {
						var filedKey = isSureList[i];
						if (!form_value[filedKey]) {
							flag = true;
							this.data.fillTipList[filedKey] = 'fillTip';
							this.setData({
								fillTipList: this.data.fillTipList,
							})
						}
					}
					if (flag) {
						wx.showToast({
							title: "请检查必填项",
							icon: 'none',
							duration: 3000
						});
						return;
					}
				}
			}
		}
		this.setData({
			"toastList.ifShow": true,
		})
	},
	navBack: function (event) {
		wx.navigateBack({

		})
	},
	moreAction: function () {
		this.setData({
			ifBtnShow: true,
		});
	},
	hideBody: function (e) {
		this.setData({
			ifBtnShow: false,
		})
	},
	//预览 图片
	previewImage: function (e) {
		var that = this
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
	onLoad: function (options) {
		var fieldList = this.data.fieldList;
		var picker = this.data.picker;
		var picker_value = this.data.picker_value;
		var that = this;
		var fileParam = {};
		var fileList = [];
		var previewUrl = [];
		var textarea_value = {}
		var histories =[]
		this.setData({
			navH: App.globalData.navHeight,
			business: '任务审批',
			taskId: options.taskId,
			hidden: true,
			host_url: host_url
		})
		var that = this
		// 获取审批历史
		App.doPost({
			url: host_url + "oa/ajax/workflow/instanceDetails",
			data: {
				instanceId: options.instanceId
			},
			success: (res) => {
				console.log(res)
				if (res.data && res.data.status == "1") {
					var instance = res.data.object.instance;
					var historyList = instance['historyList'];
					for (var i = 0; i < historyList.length; i++) {
						histories.push({
							name: historyList[i].name,
							time: !historyList[i]['createTime'] ? "" : util.formatTime(new Date(historyList[i]['createTime'])).substring(0, 10),
							createBy: historyList[i].createBy.split(".")[1],
							options: historyList[i]['options']
						});
					}
					that.setData({
						histories: histories,
					})
					console.log("历史",that.data.histories)
				} else {
					wx.showToast({
						title: res.data.message ? res.data.message : "系统错误",
						icon: 'none',
						duration: 3000
					});
				}
			}
		})
    // console.log('uuid:',App)
		wx.request({
			url: host_url + "oa/ajax/workflow/taskDetails",
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
        uuid: App.globalData.userInfo.uuid,
				taskId: options.taskId
			},
			method: "POST",
			success: (res) => {
				console.log(res)
				if (res.data && res.data.status == "1") {
					var buttonList = res.data.object.buttonList;
					var moreList = [];
					//审批记录----开始
					var lastHis = this.data.lastHis;
					var his = res.data.object.lastHis;
					if (his) {
						lastHis['name'] = his.name;
						lastHis['time'] = !his['createTime'] ? "" : util.formatTime(new Date(his['createTime']));
						lastHis['createBy'] = his.createBy.split(".")[1];
						lastHis['options'] = his.options;
					}
					//审批记录----结束
					//按钮权限----开始
					for (var i = 0; i < buttonList.length; i++) {
						if (buttonList[i]['button'] == 'save') {
							moreList.push({
								name: "保存",
								fn: "doTask",
								type: "0"
							});
						}
						if (buttonList[i]['button'] == 'abort') {
							moreList.push({
								name: "中止",
								fn: "doTask",
								type: "3"
							});
						}
						if (buttonList[i]['button'] == 'back') {
							moreList.push({
								name: "驳回",
								fn: "doTask",
								type: "2"
							});
						}
						if (buttonList[i]['button'] == 'jump_back') {
							moreList.push({
								name: "越级驳回",
								fn: "doTask",
								type: "4"
							});
						}
						if (buttonList[i]['button'] == 'line_back') {
							moreList.push({
								name: "直连驳回",
								fn: "doTask",
								type: "5"
							});
						}
					}
					//按钮权限----结束

					//字段模块拼装-----开始
					var modules = res.data.object.moduleList;
					console.log(modules)
					for (var i = 0; i < modules.length; i++) {
						for (var j = 0; j < modules[i]['fieldList'].length; j++) {
							var inputType = modules[i]['fieldList'][j]['inputType'];
							var fieldKey = modules[i]['fieldList'][j]['fieldKey'];
							var selectList = modules[i]['fieldList'][j]['selectList'];
							var content = modules[i]['fieldList'][j]['fieldContent'];
							var selectId = modules[i]['fieldList'][j]['selectId'];
							var fieldUnit = modules[i]['fieldList'][j]['fieldUnit'];
							//把必填字段装进必填字段数组isSureList-----开始
							var isSure = modules[i]['fieldList'][j]['isSure'];
							if (isSure) {
								this.data.isSureList.push(fieldKey);
							}
							this.data.fillTipList[fieldKey] = 'fff';
							//把必填字段装进必填字段数组isSureList-----完成

							//初始化下拉选的下拉选项picker_value、picker-----开始
							if (inputType == "select") {
								picker_value[fieldKey] = content;
								for (var k = 0; k < selectList.length; k++) {
									//拿到content的下标
									if (selectList[k].id == content) {
										picker[fieldKey] = k;
									}
								}
							}
							//初始化下拉选的下拉选项picker_value、picker-----完成

							//初始化日期型数据------------开始
							if (inputType == "date") {
								var _curren_date = content;
								picker[fieldKey] = _curren_date;
								picker_value[fieldKey] = _curren_date;
							}
							if (inputType == "textarea") {
								textarea_value[fieldKey] = content
							}
							//初始化日期型数据------------完成
							//初始文件数据------------开始
							if (inputType == "upload") {
								fileParam[fieldKey] = content;
								// console.log(content)
								if (content) {
									var files = content.split(',');
									that.setData({
										orginUrl: files
									})
									for (var k = 0; k < files.length; k++) {
										var imgLast = files[k].slice(files[k].length - 3)
										if (imgLast === 'jpg' || imgLast === 'jpg' || imgLast === 'png' || imgLast === 'PNG') {
											fileList.push({
												url: host_url + files[k],
												index: k
											})
											previewUrl.push(
												host_url + files[k]
											)
										} else {
											fileList.push({
												url: "/img/download.png",
												index: k
											})
										}
									}
								}

							}
							// console.log(lastHis);
							//初始文件数据------------完成
							fieldList.push({
								fieldKey: fieldKey,
								fieldValue: modules[i]['fieldList'][j]['fieldValue'],
								inputType: inputType,
								selectList: selectList,
								content: content,
								fieldUnit: fieldUnit,
								isEdit: modules[i]['fieldList'][j]['isEdit'],
								isSure: isSure,
								isShow: modules[i]['fieldList'][j]['isShow'],
							});
						}
					}
					//字段模块拼装-----结束
					this.setData({
						tasksName: options.inputTitle,
						myFieldList: fieldList,
						myPickers: picker,
						moreList: moreList,
						fileParam: fileParam,
						fileList: fileList,
						previewUrl: previewUrl,
						lastHis: lastHis,
						fillTipList: this.data.fillTipList,
						textarea_value: textarea_value
					});
				} else {
					wx.showToast({
						title: res.data.message ? res.data.message : "读取表单错误",
						icon: 'none',
						duration: 3000
					});
				}

			}
		})

	},


})