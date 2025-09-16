var storage = require('../../utils/storage.js')
var dateUtils = require('../../utils/dateUtils.js')

Page({
  data: {
    name: '',
    dateType: 'solar', // solar: 公历, lunar: 农历
    year: new Date().getFullYear(),
    month: 1,
    day: 1,
    selectedTags: [],
    customTag: '',
    showCustomTag: false,
    
    // 预设标签
    recommendTags: ['家人', '朋友', '闺蜜', '死党', '同学', '同事', '领导', '老师'],
    
    // 选择器数据
    years: [],
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    
    // 选择器索引
    yearIndex: 0,
    monthIndex: 0,
    dayIndex: 0,
    
    // 编辑模式
    isEdit: false,
    editIndex: -1,

    // 主题支持
    currentTheme: null
  },

  onLoad: function(options) {
    this.loadTheme();
    this.initYears()
    
    // 如果是编辑模式
    if (options.index !== undefined) {
      this.loadEditData(options.index)
    } else {
      // 只有在新增模式下才设置当前日期
      var now = new Date()
      var yearIndex = 0
      for (var i = 0; i < this.data.years.length; i++) {
        if (this.data.years[i] === now.getFullYear()) {
          yearIndex = i
          break
        }
      }
      
      this.setData({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        yearIndex: yearIndex,
        monthIndex: now.getMonth(),
        dayIndex: now.getDate() - 1
      })
    }
  },

  onShow: function() {
    this.loadTheme();
  },

  // 加载主题
  loadTheme: function() {
    try {
      const globalData = getApp().globalData;
      if (globalData.currentTheme) {
        this.setData({ currentTheme: globalData.currentTheme });
      }
    } catch (error) {
      console.error('加载主题失败:', error);
    }
  },

  initYears: function() {
    var currentYear = new Date().getFullYear()
    var years = []
    for (var i = currentYear; i >= 1900; i--) {
      years.push(i)
    }
    this.setData({ 
      years: years 
    })
  },

  loadEditData: function(index) {
    var birthday = storage.getBirthday(index)
    if (birthday) {
      // 确保years数组已经初始化
      if (this.data.years.length === 0) {
        this.initYears()
      }
      
      var yearIndex = 0
      for (var i = 0; i < this.data.years.length; i++) {
        if (this.data.years[i] === birthday.year) {
          yearIndex = i
          break
        }
      }
      
      this.setData({
        isEdit: true,
        editIndex: index,
        name: birthday.name,
        dateType: birthday.type,
        year: birthday.year,
        month: birthday.month,
        day: birthday.day,
        selectedTags: birthday.tags || [],
        yearIndex: yearIndex,
        monthIndex: birthday.month - 1,
        dayIndex: birthday.day - 1
      })
      
      wx.setNavigationBarTitle({
        title: '编辑生日信息'
      })
    }
  },

  onNameInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  onDateTypeChange: function(e) {
    var type = e.currentTarget.dataset.type
    this.setData({
      dateType: type
    })
  },

  onYearChange: function(e) {
    var index = e.detail.value
    this.setData({
      yearIndex: index,
      year: this.data.years[index]
    })
  },

  onMonthChange: function(e) {
    var index = e.detail.value
    this.setData({
      monthIndex: index,
      month: this.data.months[index]
    })
    this.updateDays()
  },

  onDayChange: function(e) {
    var index = e.detail.value
    this.setData({
      dayIndex: index,
      day: this.data.days[index]
    })
  },

  updateDays: function() {
    var year = this.data.year
    var month = this.data.month
    var daysInMonth = new Date(year, month, 0).getDate()
    var days = []
    for (var i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    this.setData({ 
      days: days 
    })
    
    // 如果当前选择的日期超过了该月的天数，调整为该月最后一天
    if (this.data.day > daysInMonth) {
      this.setData({
        day: daysInMonth,
        dayIndex: daysInMonth - 1
      })
    }
  },

  onTagTap: function(e) {
    var tag = e.currentTarget.dataset.tag
    var selectedTags = this.data.selectedTags.slice()
    var index = selectedTags.indexOf(tag)
    
    if (index > -1) {
      selectedTags.splice(index, 1)
    } else {
      selectedTags.push(tag)
    }
    
    this.setData({ 
      selectedTags: selectedTags 
    })
  },

  showCustomTagInput: function() {
    this.setData({
      showCustomTag: true
    })
  },

  onCustomTagInput: function(e) {
    this.setData({
      customTag: e.detail.value
    })
  },

  addCustomTag: function() {
    var customTag = this.data.customTag
    var selectedTags = this.data.selectedTags.slice()
    
    if (customTag.trim() && selectedTags.indexOf(customTag) === -1) {
      selectedTags.push(customTag)
      this.setData({
        selectedTags: selectedTags,
        customTag: '',
        showCustomTag: false
      })
    }
  },

  cancelCustomTag: function() {
    this.setData({
      customTag: '',
      showCustomTag: false
    })
  },

  onBack: function() {
    wx.navigateBack()
  },

  saveBirthday: function() {
    var name = this.data.name
    var dateType = this.data.dateType
    var year = this.data.year
    var month = this.data.month
    var day = this.data.day
    var selectedTags = this.data.selectedTags
    var isEdit = this.data.isEdit
    var editIndex = this.data.editIndex
    
    if (!name.trim()) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }
    
    var birthday = {
      name: name.trim(),
      type: dateType,
      year: year,
      month: month,
      day: day,
      tags: selectedTags
    }
    
    var success = false
    
    if (isEdit) {
      success = storage.updateBirthday(editIndex, birthday)
    } else {
      success = storage.saveBirthday(birthday)
    }
    
    if (success) {
      wx.showToast({
        title: isEdit ? '修改成功' : '添加成功',
        icon: 'success'
      })
      
      setTimeout(function() {
        // 获取页面栈
        var pages = getCurrentPages()
        if (pages.length > 1) {
          // 获取上一页面实例
          var prevPage = pages[pages.length - 2]
          // 如果上一页是首页，刷新数据
          if (prevPage.route === 'pages/index/index' && prevPage.loadBirthdays) {
            console.log('准备刷新首页数据')
            // 延迟一点确保数据完全保存
            setTimeout(function() {
              prevPage.loadBirthdays()
              console.log('首页数据刷新完成')
            }, 100)
          }
          wx.navigateBack()
        } else {
          // 如果没有上一页，直接跳转到首页
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
      }, 1000)
    } else {
      wx.showToast({
        title: isEdit ? '修改失败' : '添加失败',
        icon: 'error'
      })
    }
  }
})