var util = require('../../utils/util.js')
var area = require('../../utils/area.js')
const App = getApp();
// modelTest.js
var model = require('../../model/model.js')

var show = false;
var item = {};
var host_url = App.globalData.host_url;
Page({
	data: {
		title: ' ',
		index: 0,
		item: {
			show: show
		},
		userName: '',
		myFieldList: [],
		myPickers: {},
		multiArrayList: [],
		multiArray: [],
		k: 0,
		typeId: '',
		picker: {},
		picker_value: {},
		fieldList: [],
		fileList: {},
		datePicker: {},
		fileParam: {},
		isSureList: [],
		fillTipList: {},
		areaList: {},
		buttonShow: true,
		hideModal: false, //模态框的状态  true-隐藏  false-显示
		animationData: {},
		typeList: [],
		moreSelect: [],
		typeSelect: '',
		checked_value: {},
		check: [],
		checkId: '',
		area: {},
		radio_value: {},
		area_value: {},
		contact_value: {},
		areaValue: false,
		checked: false,
		checkedList: {},
		dateTimeArray: [],
		dateTime: '',
		startYear: 2000,
		endYear: 2050,
		dataTime: '',
		days: '',
		newRadio: {},
		multiIndex: [18, 0, 0],
		provinceindex: 18,
		cityindex: 0,
		districtindex: 0,
		disabled: false,
		fieldKeyDateList: [],
		contactList: [],
		showTextarea: {},
		textValue: {},
		isFocus: false,
		conut: 0,
		conutList: {},
		addList:{},
		newUpload: []
	},
	showTextarea: function (e) {
		console.log(e)
		this.data.showTextarea[e.currentTarget.id] = false
		this.setData({
			showTextarea: this.data.showTextarea,
			isFocus: true
		})
	},
	focusblur: function (e) {
		console.log(e)
		var value = e.detail.value
		this.data.textValue[e.currentTarget.id] = value
		this.data.showTextarea[e.currentTarget.id] = true
		this.setData({
			textValue: this.data.textValue,
			showTextarea: this.data.showTextarea
		})
	},
	addTicket: function () {
		// receipt通用发票
		// trainTicket
		// quotaInvoice定额发票
	},
	add: function (newUpload) {

	},
	addFor: function (filedKey) {
		const add = new Promise((resolve, reject) => {
			var that = this;
			var isGo = true;
			var i = 0;
			that.data.addList = []
			function add() {
				isGo = false
				wx.uploadFile({
					url: host_url + '/oa/api/vatInvoice',
					filePath: that.data.newUpload[i],
					name: 'file',
					header: {
						"Content-Type": "multipart/form-data"
					},
					success: (result) => {
						var data = JSON.parse(result.data)
            if (data.status==="1"){
              var list = JSON.parse(data.object.words_result)
            }
            console.log("json:",list)
    
            if (data.status === "0") {
							that.data.addList.push({
								src:that.data.newUpload[i],
								count:false
							})
							i++
							add(that.data.newUpload[i])
						} else {
               
							if (list.result.total != '') {
                let num = list.result.total;
                let arr = num.split('');
                arr.splice(0,1);
                num = arr.join('');
                console.log('数字',num)
								that.data.addList.push({
									src:that.data.newUpload[i],
                  count: Number(num)
								})
							} else {
								that.data.addList.push({
									src:that.data.newUpload[i],
									count:0
								})
							}
							i++
							add(that.data.newUpload[i])
						}
						if (i === that.data.newUpload.length) {
							resolve(result)
						}
					}
				})
			}
			add();
		})
		add.then(res => {
			var that = this;
			var i = 0
			var conutList = []
			function addTicket() {
				if (that.data.addList[i].count === false) {
					wx.uploadFile({
						url: host_url + '/oa/api/trainTicket',
						filePath: that.data.newUpload[i],
						name: 'file',
						header: {
							"Content-Type": "multipart/form-data"
						},
						success: (result) => {
							console.log(result)
							var data = JSON.parse(result.data)
							if (data.status === "1") {
								var rates = data.object.words_result.ticket_rates
								rates = rates.slice(1, rates.length - 1)
								rates = Number(rates)
								if (isNaN(rates)) {
									conutList.push({
										src:that.data.newUpload[i],
										count:0
									})
								} else {
									conutList.push({
										src:that.data.newUpload[i],
										count:rates
									})
								}
							}
							else {
								conutList.push({
									src:that.data.newUpload[i],
									count:0
								})
							}
							i++
							if (i === that.data.newUpload.length) {
								that.data.addList = conutList
								wx.hideLoading();
								if(that.data.conutList[filedKey].length){
									for(var j = 0; j < that.data.addList.length;j++){
										that.data.conutList[filedKey].push(that.data.addList[j])
									}  
								}else{
									that.data.conutList[filedKey] = that.data.addList
								}
								for(var j = 0; j < that.data.addList.length;j++){
									that.data.conut += Number(that.data.addList[j].count)
									that.data.conut = parseFloat((that.data.conut).toFixed(2))
								}
								that.uploadImage(filedKey);
								that.setData({
									conutList: that.data.conutList,
									conut:that.data.conut
								})
							} else {
								addTicket()
							}
						}
					})
				} else {
					conutList.push(that.data.addList[i])
					i++
					if (i === that.data.newUpload.length) {
						that.data.addList = conutList
						wx.hideLoading();
						if(that.data.conutList[filedKey].length){
							for(var j = 0; j < that.data.addList.length;j++){
								that.data.conutList[filedKey].push(that.data.addList[j])
							}  
						}else{
							that.data.conutList[filedKey] = that.data.addList
						}
						for(var j = 0; j < that.data.addList.length;j++){
							that.data.conut += Number(that.data.addList[j].count)
							that.data.conut = parseFloat((that.data.conut).toFixed(2))
						}
						that.uploadImage(filedKey);
						that.setData({
							conutList: that.data.conutList,
							conut:that.data.conut
						})
					} else {
						addTicket()
					}
				}
			}
			addTicket()
		})
	},
	//上传图片
	upload(e) {
		var that = this;
		var filedKey = e.currentTarget.dataset.field;
		that.data.fileParam[filedKey] = '';
		var newUpload = []
		wx.chooseImage({
			count: 9,
			sizeType: ['original', 'compressed'],//支持原图和压缩
			sourceType: ['album', 'camera'],
			success(res) {
				const tempFilePaths = res.tempFilePaths
				if (that.data.fileList[filedKey].length === 0) {
					that.data.fileList[filedKey] = tempFilePaths

				} else {
					for (var i = 0; i < tempFilePaths.length; i++) {
						that.data.fileList[filedKey].push(tempFilePaths[i])
					}
				}
				if (that.data.title === '报销申请') {
					that.data.newUpload = tempFilePaths
				}
				// 计算报销金额
				if (that.data.title === '报销申请' && that.data.newUpload.length > 0) {
					wx.showLoading({
						title: '识别中'
					})
					that.addFor(filedKey);
				} else {
					that.uploadImage(filedKey)
				}

			}
		})
	},
	uploadImage: function (filedKey) {
		var that = this;
		var aa = [];
		that.data.fillTipList[filedKey] = '';
		if (that.data.fileList[filedKey].length > 0) {
			for (var i = 0; i < that.data.fileList[filedKey].length; i++) {
				wx.uploadFile({
					url: host_url + 'sys/ajax/file/compressionUpload.json',
					filePath: that.data.fileList[filedKey][i],
					name: "file",
					header: {
						"Content-Type": "multipart/form-data"
					},
					formData: {
						"model": "oaInput",
					},
					success: function (res) {
						var data = JSON.parse(res.data);
						aa.push(data.relativeFilePath);
						that.data.fileParam[filedKey] = aa.join(',');
					}
				})
			}
		}
		that.setData({
			fileList: that.data.fileList,
			fillTipList: that.data.fillTipList
		})
	},
	deleteImage: function (e) {
		var that = this;
		var src = e.currentTarget.dataset.src;
		var filedKey = e.currentTarget.dataset.data;
		console.log(e)
		var index = that.data.fileList[filedKey].indexOf(src)
		if (index != -1) {
			that.data.fileList[filedKey].splice(index, 1)
			console.log(that.data.fileList[filedKey])
			that.data.fileParam[filedKey] = that.data.fileList[filedKey].join(',');
			if (that.data.title === '报销申请') {
				that.data.conut = that.data.conut - Number(that.data.conutList[filedKey][index].count)
				that.data.conut = parseFloat((that.data.conut).toFixed(2))
				console.log(that.data.conut)
				that.data.conutList[filedKey].splice(index, 1)
				console.log(that.data.conutList)
				that.setData({
					conut: that.data.conut,
					conutList: that.data.conutList
				})
			}
			that.setData({
				fileList: that.data.fileList,
				fileParam: that.data.fileParam
			})
		}
	},
	//预览图片
	previewImage: function (e) {
		var current = e.target.dataset.src;
		var filedKey = e.currentTarget.dataset.field;
		wx.previewImage({
			current: current, // 当前显示图片的http链接  
			urls: this.data.fileList[filedKey] // 需要预览的图片http链接列表  
		})
	},
	bindPickerChange: function (e) {
		var picker_id = e.currentTarget.id;
		this.data.picker[picker_id] = e.detail.value;
		for (var i = 0; i < this.data.fieldList.length; i++) {
			if (this.data.fieldList[i].fieldKey == picker_id) {
				var _selected = this.data.fieldList[i].selectList[e.detail.value];
				this.data.picker_value[picker_id] = _selected.id;
			}
		}
		this.setData({
			myPickers: this.data.picker
		})
	},
	DateDiff: function (sDate1, sDate2) { //sDate1和sDate2是2017-9-25格式 
		var aDate, oDate1, oDate2, iDays
		aDate = sDate1.split("-")
		oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
		aDate = sDate2.split("-")
		oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
		iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)
		return iDays
	},
	// 请假申请日期选择
	changeDateTime(e) {
		var id = e.currentTarget.id
		var fieldKey = id.slice(0, id.indexOf('.'))
		var fieldAttribute = id.slice(id.indexOf('.') + 1)
		var value = e.detail.value
		console.log(value)
		var arr = this.data.datePicker[fieldKey].dateArr
		console.log(value)
		function remove(n) {
			return n.slice(0, n.length - 1)
		}
		if (fieldAttribute === "yyyy-MM-dd HH:mm:ss") {
			var time = [arr[0][value[0]], arr[1][value[1]], arr[2][value[2]]].map(remove).join('-') + ' ' + [arr[3][value[3]], arr[4][value[4]], arr[5][value[5]]].map(remove).join(':')
			this.data.datePicker[fieldKey].date = time
			this.data.datePicker[fieldKey].dateVaule = value
			this.data.picker_value[fieldKey] = time
		}
		if (fieldAttribute === "HH:mm:ss") {
			var time = [arr[0][value[0]], arr[1][value[1]], arr[2][value[2]]].map(remove).join(':')
			this.data.datePicker[fieldKey].date = time
			this.data.datePicker[fieldKey].dateVaule = value,
				this.data.picker_value[fieldKey] = time
		}
		if (fieldAttribute === "yyyy-MM-dd-d") {
			var time = [arr[0][value[0]], arr[1][value[1]], arr[2][value[2]]].join('-') + ' ' + arr[3][value[3]]
			this.data.datePicker[fieldKey].date = time
			this.data.datePicker[fieldKey].dateVaule = value
			this.data.picker_value[fieldKey] = time
			var fieldKeyDateList = this.data.fieldKeyDateList
			if (fieldKeyDateList.length === 2 && this.data.days != '' && this.data.title === '请假申请') {
				console.log(fieldKeyDateList)
				var start = this.data.picker_value[fieldKeyDateList[0]].slice(this.data.picker_value[fieldKeyDateList[0]].indexOf(' ') + 1)
				var end = this.data.picker_value[fieldKeyDateList[1]].slice(this.data.picker_value[fieldKeyDateList[1]].indexOf(' ') + 1)
				var s1 = this.data.picker_value[fieldKeyDateList[0]].slice(0, this.data.picker_value[fieldKeyDateList[0]].indexOf(' '))
				var s2 = this.data.picker_value[fieldKeyDateList[1]].slice(0, this.data.picker_value[fieldKeyDateList[1]].indexOf(' '))
				var date = this.DateDiff(s2, s1)
				if (start === '上午') {
					if (end === '上午') {
						date += 0.5
					} else {
						date += 1
					}
				} else {
					if (end === '上午') {
						date += 1
					} else {
						date += 0.5
					}
				}
				this.setData({
					days: date
				})
			}
		}
		this.setData({
			datePicker: this.data.datePicker,
			picker_value: this.data.picker_value
		})

	},
	changeDateTimeColumn(e) {
		var id = e.currentTarget.id
		var fieldKey = id.slice(0, id.indexOf('.'))
		var fieldAttribute = id.slice(id.indexOf('.') + 1)
		var value = e.detail.value
		var column = e.detail.column
		var arr = this.data.datePicker[fieldKey].dateArr
		function remove(n) {
			return n.slice(0, n.length - 1)
		}
		if (fieldAttribute === "yyyy-MM-dd HH:mm:ss") {
			if (column === 0) {
				var year = parseInt(remove(arr[column][value]))
				var month = remove(arr[1][this.data.datePicker[fieldKey].dateVaule[1]])
				this.data.datePicker[fieldKey].dateVaule[column] = value
				var date = util.getMonthDay(year, month)
				date = date.map(function (n) { return n + '日' })
				this.data.datePicker[fieldKey].dateArr[2] = date
				console.log(date)
				this.setData({
					datePicker: this.data.datePicker
				})
			}
			if (column === 1) {
				var year = parseInt(remove(arr[0][this.data.datePicker[fieldKey].dateVaule[0]]))
				var month = remove(arr[column][value])
				this.data.datePicker[fieldKey].dateVaule[column] = value
				var date = util.getMonthDay(year, month)
				date = date.map(function (n) { return n + '日' })
				console.log(date)
				this.data.datePicker[fieldKey].dateArr[2] = date
				this.setData({
					datePicker: this.data.datePicker
				})
			}
		}
		if (fieldAttribute === "yyyy-MM-dd-d") {
			var date = []
			if (column === 0) {
				var year = parseInt(arr[column][value])
				var month = arr[1][this.data.datePicker[fieldKey].dateVaule[1]]
				this.data.datePicker[fieldKey].dateVaule[column] = value
				date = util.getMonthDay(year, month)
				console.log(date)
				this.data.datePicker[fieldKey].dateArr[2] = date
				this.setData({
					datePicker: this.data.datePicker
				})
			}
			if (column === 1) {
				var year = parseInt(arr[0][this.data.datePicker[fieldKey].dateVaule[0]])
				var month = arr[column][value]
				this.data.datePicker[fieldKey].dateVaule[column] = value
				date = util.getMonthDay(year, month)
				console.log(date)
				this.data.datePicker[fieldKey].dateArr[2] = date
				this.setData({
					datePicker: this.data.datePicker
				})
			}

		}
	},
	checkboxChange: function (e) {
		console.log(e)
		var list = e.detail.value;
		this.setData({
			moreSelect: list
		})
	},
	getValue: function () {
		var list = this.data.moreSelect;
		var newList = []
		var newType = []
		var newChecked = []
		var checkId = this.data.checkId
		if (list.length) {
			for (var i = 0; i < list.length; i++) {
				newList.push(list[i].slice(0, list[i].indexOf('.')))
				newType.push(list[i].slice(list[i].indexOf('.') + 1))
			}
			for (var j = 0; j < this.data.check.length; j++) {
				var check = false
				for (var i = 0; i < list.length; i++) {
					if (newList[i] === this.data.check[j].name) {
						check = true
					}
				}
				if (check) {
					newChecked.push({
						name: this.data.check[j].name,
						id: this.data.check[j].id,
						checked: true
					})
				} else {
					newChecked.push({
						name: this.data.check[j].name,
						id: this.data.check[j].id,
						checked: false
					})
				}
			}
			this.data.typeList[checkId] = newChecked
			this.data.checkedList[checkId] = newList.join(',')
			this.data.checked_value[checkId] = newType.join(',')
		} else {
			for (var j = 0; j < this.data.check.length; j++) {
				newChecked.push({
					name: this.data.check[j].name,
					id: this.data.check[j].id,
					checked: false
				})
			}
			this.data.typeList[checkId] = newChecked
			this.data.checkedList[checkId] = ''
			this.data.checked_value[checkId] = ''
		}
		this.setData({
			typeList: this.data.typeList,
			checkedList: this.data.checkedList,
			checked_value: this.data.checked_value
		})
		this.hideModal();
		this.setData({
			check: ''
		})
	},
	gocansel: function () {
		this.hideModal();
		this.setData({
			check: ''
		})
	},
	radioChange: function (e) {
		var value = e.detail.value.slice(e.detail.value.indexOf('.') + 1);
		this.data.radio_value[e.currentTarget.id] = value
		this.setData({
			newRadio: this.data.radio_value
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
	bindMultiPickerChange: function (e) {
		var value = e.detail.value
		var fieldAttribute = 0
		var multiArray = []
		var data = ''
		for (var i = 0; i < this.data.fieldList.length; i++) {
			if (this.data.fieldList[i].fieldKey === e.currentTarget.id) {
				fieldAttribute = this.data.fieldList[i].fieldAttribute
				multiArray = this.data.multiArrayList[this.data.fieldList[i].index - 1]
			}
		}
		if (multiArray.length === 1) {
			if (fieldAttribute === 1 || fieldAttribute === 0) {
				data = multiArray[0][value[0]]
			}
		}
		if (multiArray.length === 2) {
			if (fieldAttribute = 2) {
				if (multiArray[1].length) {
					data = multiArray[0][value[0]] + ',' + multiArray[1][value[1]]
				} else {
					data = multiArray[0][value[0]]
				}
			}
		}
		if (multiArray.length === 3) {
			if (fieldAttribute = 3) {
				if (multiArray[1].length === 0 && multiArray[2].length === 0) {
					data = multiArray[0][value[0]]
				}
				else if (multiArray[1].length != 0 && multiArray[2].length === 0) {
					data = multiArray[0][value[0]] + ',' + multiArray[1][value[1]]
				}
				else {
					data = multiArray[0][value[0]] + ',' + multiArray[1][value[1]] + ',' + multiArray[2][value[2]]
				}

			}
		}
		this.data.areaList[e.currentTarget.id] = data
		this.data.area_value[e.currentTarget.id] = data
		console.log()
		this.setData({
			areaList: this.data.areaList,
			area_value: this.data.area_value,
			provinceindex: 0,
			cityindex: 0,
			districtindex: 0
		})
	},
	bindMultiPickerColumnChange: function (e) {
		var provinceindex = this.data.provinceindex;
		var cityindex = this.data.cityindex;
		var districtindex = this.data.districtindex;
		var column = e.detail.column;
		var value = e.detail.value;
		var fieldAttribute = 0;
		var index = 0;
		for (var i = 0; i < this.data.fieldList.length; i++) {
			if (this.data.fieldList[i].fieldKey === e.currentTarget.id) {
				fieldAttribute = this.data.fieldList[i].fieldAttribute
				index = this.data.fieldList[i].index - 1
			}
		}
		if (fieldAttribute === 2) {
			if (column === 0) {
				this.data.multiArrayList[index] = this.province(fieldAttribute, value, cityindex)
				this.setData({
					provinceindex: value,
					multiArrayList: this.data.multiArrayList
				})
			}
			if (column === 1) {
				this.data.multiArrayList[index] = this.province(fieldAttribute, provinceindex, value)
				this.setData({
					cityindex: value,
					multiArrayList: this.data.multiArrayList
				})
			}
		}
		if (fieldAttribute === 3) {
			if (column === 0) {
				this.data.multiArrayList[index] = this.province(fieldAttribute, value, cityindex, districtindex)
				console.log(this.data.multiArrayList[index])
				this.setData({
					provinceindex: value,
					multiArrayList: this.data.multiArrayList
				})
			}
			if (column === 1) {
				this.data.multiArrayList[index] = this.province(fieldAttribute, provinceindex, value, districtindex)
				this.setData({
					cityindex: value,
					multiArrayList: this.data.multiArrayList
				})
			}
			if (column === 2) {
				this.data.multiArrayList[index] = this.province(fieldAttribute, provinceindex, cityindex, value)
				this.setData({
					districtindex: value
				})
			}
		}
	},
	//自定义表单提交
	submitCustomForm: function (e) {
		console.log(e)
		var isSureList = this.data.isSureList;
		var input_value = e.detail.value;
		var contact = []
		this.data.contact_value['contact'] = ''
		if (this.data.contactList.length) {
			for (var i = 0; i < this.data.contactList.length; i++) {
				contact.push(this.data.contactList[i].id)
			}
			this.data.contact_value['contact'] = contact.join()
		}
		var form_value = Object.assign(e.detail.value, this.data.picker_value);
		form_value = Object.assign(form_value, this.data.fileParam);
		form_value = Object.assign(form_value, this.data.checked_value);
		form_value = Object.assign(form_value, this.data.newRadio);
		form_value = Object.assign(form_value, this.data.area_value)
		form_value = Object.assign(form_value, this.data.textValue)
		var _typeId = this.data.typeId;
		console.log(form_value)
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
		wx.showLoading({
			title: '提交中',
			mask: true
		});
		console.log(this.data.contact_value['contact'])
		App.doPost({
			url: host_url + "oa/ajax/custom/submitAudit/" + _typeId,
			data: {
				fieldSet: JSON.stringify(form_value),
				contact: this.data.contact_value['contact']
			},
			success: (res) => {
				wx.hideLoading();
				if (res.data && res.data.status == "1") {
					wx.showToast({
						title: '提交成功',
						icon: 'success',
						duration: 800,
						success: function () {
							wx.reLaunch({
								url: '/pages/declarationExamine/index',
							});
						}
					});
        } else if (res.data.status == 0) {
          wx.redirectTo({
            url: '../login/index'
          })
        } else {
					wx.showToast({
						title: '提交失败',
						icon: 'none',
						duration: 3000
					});
				}
			}
		})
	},
	navBack: function (event) {
		wx.navigateBack({

		})
	},

	goNext: function (event) {
		wx.reLaunch({
			url: '../workBench/index',
		})
	},
	onLoad: function (options) {
		var userName = App.globalData.userInfo.name
		if (userName === '超级管理员') {
			userName = ''
		}
		this.setData({
			navH: App.globalData.navHeight,
			typeId: options.typeId,
			buttonShow: true,
			title: options.name,
			userName: userName
		})
		//请求数据
		wx.request({
			url: host_url + "oa/ajax/custom/getInputFormBytypeId",
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				typeId: options.typeId
			},
			method: "POST",
			success: (res) => {
				// console.log(res)
				if (res.data && res.data.status == "1") {
					var modules = res.data.object.modules;
					console.log(modules)
					if (modules.length != 0) {
						for (var i = 0; i < modules.length; i++) {
							for (var j = 0; j < modules[i]['fieldList'].length; j++) {
								var inputType = modules[i]['fieldList'][j]['inputType'];
								var fieldKey = modules[i]['fieldList'][j]['fieldKey'];
								var selectList = modules[i]['fieldList'][j]['selectList'];
								var isSure = modules[i]['fieldList'][j]['isSure'];
								var fieldAttribute = modules[i]['fieldList'][j]['fieldAttribute']
								if (isSure) {
									this.data.isSureList.push(fieldKey);
								}
								//判断picker
								if (inputType == "select") {
									this.data.picker[fieldKey] = 0;
									this.data.picker_value[fieldKey] = selectList[0].id;
								}
								if (inputType == "upload") {
									this.data.fileList[fieldKey] = []
									if(this.data.title === '报销申请'){
									this.data.conutList[fieldKey] = []
									}
								}
								if (inputType == "textarea") {
									this.data.showTextarea[fieldKey] = true
								}
								// if (inputType == "text" && modules[i]['fieldList'][j]['fieldUnit'] === '天') {
								// 	this.setData({
								// 		days: 0.5
								// 	})
								// }
								if (inputType == "date") {
									var _curren_date = ''
									var arr = util.datePicker(this.data.startYear, this.data.endYear).dateTimeArray;
									var value = util.datePicker(this.data.startYear, this.data.endYear).dateTime;
									if (fieldAttribute === "yyyy-MM-dd-d") {
										var obj = util.dateTimePicker(this.data.startYear, this.data.endYear).dateTimeArray;
										var dateTime = util.dateTimePicker(this.data.startYear, this.data.endYear).dateTime;
										_curren_date = obj[0][dateTime[0]] + '-' + obj[1][dateTime[1]] + '-' + obj[2][dateTime[2]] + ' ' + obj[3][dateTime[3]]
										this.data.datePicker[fieldKey] = {
											dateArr: obj,
											dateVaule: dateTime,
											date: _curren_date,
										}
										this.data.fieldKeyDateList.push(fieldKey)
									}
									if (fieldAttribute === "yyyy-MM-dd") {
										_curren_date = util.formatTime(new Date()).substr(0, 10);
									}
									if (fieldAttribute === "yyyy-MM-dd HH:mm:ss") {
										_curren_date = util.formatTime(new Date()).substr(0);
										this.data.datePicker[fieldKey] = {
											dateArr: arr,
											dateVaule: value,
											date: _curren_date
										}
									}
									if (fieldAttribute === "HH:mm:ss") {
										_curren_date = util.formatTime(new Date()).substr(11);
										this.data.datePicker[fieldKey] = {
											dateArr: [arr[3], arr[4], arr[5]],
											dateVaule: [value[3], value[4], value[5]],
											date: _curren_date
										}

									}
									this.data.picker[fieldKey] = _curren_date;
									this.data.picker_value[fieldKey] = _curren_date;
								}
								if (inputType == "checkBox") {
									this.data.checked_value[fieldKey] = '';
									var temp1 = []
									var temp = selectList
									for (var k = 0; k < temp.length; k++) {
										temp1.push({
											name: temp[k].name,
											id: temp[k].id,
											checked: false
										})
									}
									this.data.typeList[fieldKey] = temp1
								}

								this.data.fillTipList[fieldKey] = 'fff';
								if (inputType == "area") {
									this.data.area[fieldKey] = ''
									this.data.area_value[fieldKey] = ''
									if (modules[i]['fieldList'][j]['fieldAttribute'] === '3') {
										var arr = this.province(3, this.data.provinceindex, this.data.cityindex, this.data.districtindex)
									}
									if (modules[i]['fieldList'][j]['fieldAttribute'] === '2') {
										var arr = this.province(2, this.data.provinceindex, this.data.cityindex)
									}
									if (modules[i]['fieldList'][j]['fieldAttribute'] === '1') {
										var arr = this.province(1, this.data.cityindex)
									}
									if (modules[i]['fieldList'][j]['fieldAttribute'] === '0') {
										var arr = this.province(0, this.data.provinceindex)
									}
									this.data.k = this.data.k + 1
									this.data.fieldList.push({
										fieldKey: fieldKey,
										fieldValue: modules[i]['fieldList'][j]['fieldValue'],
										inputType: inputType,
										selectList: selectList,
										isSure: isSure,
										fieldAttribute: parseInt(fieldAttribute),
										index: this.data.k
									});
									this.setData({
										k: this.data.k
									})
									this.data.multiArray.push(arr)
								}
								else {
									this.data.fieldList.push({
										fieldKey: fieldKey,
										fieldValue: modules[i]['fieldList'][j]['fieldValue'],
										inputType: inputType,
										selectList: selectList,
										isSure: isSure,
										fieldUnit: modules[i]['fieldList'][j]['fieldUnit'],
										fieldAttribute: fieldAttribute
									});
								}
							}
						}
						this.data.fieldList.push({
							fieldKey: 'contacts',
							fieldValue: '抄送',
							inputType: 'contact'
						});
						this.setData({
							myFieldList: this.data.fieldList,
							myPickers: this.data.picker,
							datePicker: this.data.datePicker,
							fillTipList: this.data.fillTipList,
							areaList: this.data.area,
							multiArrayList: this.data.multiArray,
							checkedList: this.data.checked_value,
							typeList: this.data.typeList,
							fieldKeyDateList: this.data.fieldKeyDateList,
							showTextarea: this.data.showTextarea,
							fileList: this.data.fileList
						})
						if(this.data.title === '报销申请'){
							this.setData({
								conutList:this.data.conutList
							})
						}
					} else {
						return
					}
				} else {
					wx.showToast({
						title: '获取失败',
						icon: 'none',
						duration: 3000
					});
				}
			}
		})
	},
	province: function () {
		var getProveince = area.getProveince()
		var getCity = area.getCity()
		var getDistrict = area.getDistrict()
		// console.log(arguments)
		var province = []
		var city = []
		var district = []
		var region = []
		if (arguments[0] === 3) {
			for (var i = 0; i < getProveince.length; i++) {
				province.push(getProveince[i].name)
			}
			for (var i = 0; i < getCity.length; i++) {
				if (getCity[i].sheng === getProveince[arguments[1]].sheng) {
					city.push(getCity[i].name)
				}
			}
			for (var i = 0; i < getDistrict.length; i++) {
				if (getDistrict[i].sheng === getProveince[arguments[1]].sheng && getDistrict[i].di === getCity[arguments[2]].di) {
					district.push(getDistrict[i].name)
				}
			}
			region = [province, city, district];
		}
		if (arguments[0] === 2) {
			for (var i = 0; i < getProveince.length; i++) {
				province.push(getProveince[i].name)
			}
			for (var i = 0; i < getCity.length; i++) {
				if (getCity[i].sheng === getProveince[arguments[1]].sheng) {
					city.push(getCity[i].name)
				}
			}
			region = [province, city];
		}
		if (arguments[0] === 1) {
			for (var i = 0; i < getCity.length; i++) {
				if (getCity[i].name != '市辖区' && getCity[i].name != '县') {
					city.push(getCity[i].name)
				}
			}
			region = [city];
		}
		if (arguments[0] === 0) {
			for (var i = 0; i < getProveince.length; i++) {
				province.push(getProveince[i].name)
			}
			region = [province];
		}
		return region
	},
	//生命周期函数--监听页面初次渲染完成
	onReady: function (e) {
		var that = this;
		//请求数据
		model.updateAreaData(that, 0, e);
	},
	//点击选择城市按钮显示picker-view
	translate: function (e) {
		model.animationEvents(this, 0, true, 400);
	},
	//隐藏picker-view
	hiddenFloatView: function (e) {
		// console.log("id = " + e.target.dataset.id)
		model.animationEvents(this, 200, false, 400);
		//点击确定按钮更新数据(id=444是背后透明蒙版 id=555是取消按钮)
		if (e.target.dataset.id == 666) {
			this.updateShowData()
		}
	},
	//滑动事件
	bindChange: function (e) {
		model.updateAreaData(this, 1, e);
		//如果想滑动的时候不实时更新，只点确定的时候更新，注释掉下面这行代码即可。
		// this.updateShowData()
	},
	//更新顶部展示的数据
	updateShowData: function (e) {
		item = this.data.item;
		this.setData({
			province: item.provinces[item.value[0]].name,
			city: item.citys[item.value[1]].name,
			county: item.countys[item.value[2]].name
		});
	},
	onReachBottom: function () {
	},
	nono: function () { },


	// 显示遮罩层
	showModal: function (e) {
		this.setData({
			checkId: e.currentTarget.id,
			check: this.data.typeList[e.currentTarget.id]
		})
		var animation = wx.createAnimation({
			duration: 50,
			timingFunction: "linear",
			delay: 0
		})
		this.animation = animation
		animation.translateY(300).step()
		this.setData({
			animationData: animation.export(),
			showModalStatus: true
		})
		setTimeout(function () {
			animation.translateY(0).step()
			this.setData({
				animationData: animation.export()
			})
		}.bind(this), 200)
		this.setData({
			checkBoxid: e.target.id,
			buttonShow: false,
			disabled: true
		})
	},
	hideModal: function () {
		// 隐藏遮罩层
		var animation = wx.createAnimation({
			duration: 50,
			timingFunction: "linear",
			delay: 0
		})
		this.animation = animation
		animation.translateY(300).step()
		this.setData({
			animationData: animation.export(),
		})
		setTimeout(function () {
			animation.translateY(0).step()
			this.setData({
				animationData: animation.export(),
				showModalStatus: false
			})
		}.bind(this), 200)
		this.setData({
			buttonShow: true,
			disabled: false
		})
	},
	goContacts: function () {
		wx.navigateTo({
			url: '/pages/contacts/index?newList=' + JSON.stringify(this.data.contactList)
		})
	},
	deleteContact: function (e) {
		// console.log(e)
		var _id = e.currentTarget.dataset.id;
		var hasId = []
		for (var i = 0; i < this.data.contactList.length; i++) {
			hasId.push(this.data.contactList[i].id)
		}
		var index = hasId.indexOf(_id)
		this.data.contactList.splice(index, 1)
		console.log(this.data.contactList)
		this.setData({
			contactList: this.data.contactList
		})
	},
	show: function () {

	}

})

