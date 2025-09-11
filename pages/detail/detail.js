var storage = require('../../utils/storage.js')

Page({
  data: {
    birthday: null,
    index: -1
  },

  onLoad: function(options) {
    if (options.index !== undefined) {
      var index = parseInt(options.index)
      this.loadBirthdayDetail(index)
    }
  },

  onShow: function() {
    // 重新加载数据，以防从编辑页面返回时数据有更新
    if (this.data.index >= 0) {
      this.loadBirthdayDetail(this.data.index)
    }
  },

  loadBirthdayDetail: function(index) {
    var birthday = storage.getBirthday(index)
    if (birthday) {
      this.setData({
        birthday: birthday,
        index: index
      })
      
      wx.setNavigationBarTitle({
        title: birthday.name + '的生日'
      })
    } else {
      wx.showToast({
        title: '生日信息不存在',
        icon: 'none'
      })
      setTimeout(function() {
        wx.navigateBack()
      }, 1500)
    }
  },

  editBirthday: function() {
    wx.navigateTo({
      url: '/pages/add/add?index=' + this.data.index
    })
  },

  deleteBirthday: function() {
    var that = this
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个生日信息吗？',
      success: function(res) {
        if (res.confirm) {
          if (storage.deleteBirthday(that.data.index)) {
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
            
            setTimeout(function() {
              wx.navigateBack()
            }, 1500)
          } else {
            wx.showToast({
              title: '删除失败',
              icon: 'error'
            })
          }
        }
      }
    })
  },

  shareBirthday: function() {
    var birthday = this.data.birthday
    if (birthday) {
      wx.showShareMenu({
        withShareTicket: true
      })
    }
  },

  addToCalendar: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  goBack: function() {
    wx.navigateBack()
  }
})