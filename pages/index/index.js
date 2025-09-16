var storage = require('../../utils/storage.js')
var dateUtils = require('../../utils/dateUtils.js')

Page({
  data: {
    birthdays: [],
    isEmpty: true,
    filteredBirthdays: [],
    currentTag: '全部',
    allTags: ['全部'],
    upcomingBirthday: null
  },

  onLoad() {
    // 设置自定义tabBar的选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    this.loadBirthdays()
  },

  onShow() {
    console.log('首页 onShow 调用')
    // 设置自定义tabBar的选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }

    var that = this
    // 稍微延迟一下，确保从其他页面返回时数据已经完全保存
    setTimeout(function() {
      that.loadBirthdays()
    }, 50)
  },

  loadBirthdays: function() {
    console.log('loadBirthdays 开始执行')
    var birthdays = storage.getAllBirthdays()
    var tags = storage.getAllTags()
    var allTags = ['全部'].concat(tags)
    
    console.log('加载的生日数据:', birthdays)
    console.log('生日数据数量:', birthdays.length)
    
    // 获取即将到来的生日（最近的一个）
    var upcomingBirthday = birthdays.length > 0 ? birthdays[0] : null
    
    this.setData({
      birthdays: birthdays,
      filteredBirthdays: birthdays,
      isEmpty: birthdays.length === 0,
      allTags: allTags,
      upcomingBirthday: upcomingBirthday
    })
    
    console.log('页面数据更新完成')
  },

  addBirthday: function() {
    wx.navigateTo({
      url: '/pages/add/add'
    })
  },

  viewDetail: function(e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/detail/detail?index=' + index
    })
  },

  editBirthday: function(e) {
    e.stopPropagation()
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/add/add?index=' + index
    })
  },

  deleteBirthday: function(e) {
    console.log('deleteBirthday clicked', e)
    console.log('dataset:', e.currentTarget.dataset)
    
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    var that = this
    
    console.log('要删除的ID:', id)
    console.log('要删除的姓名:', name)
    
    // 如果没有ID，使用索引作为备用方案
    if (!id) {
      console.log('没有ID，尝试使用索引删除')
      var index = parseInt(e.currentTarget.dataset.index)
      
      if (index === undefined || index < 0) {
        wx.showToast({
          title: '找不到要删除的项目',
          icon: 'error'
        })
        return
      }
      
      // 通过索引获取要删除的生日信息
      var birthdayToDelete = this.data.filteredBirthdays[index]
      if (!birthdayToDelete) {
        wx.showToast({
          title: '找不到要删除的项目',
          icon: 'error'
        })
        return
      }
      
      wx.showModal({
        title: '确认删除',
        content: '确定要删除 "' + birthdayToDelete.name + '" 的生日信息吗？',
        success: function(res) {
          if (res.confirm) {
            console.log('用户确认删除')
            
            // 使用生日信息删除
            var success = storage.deleteBirthdayByInfo(birthdayToDelete)
            
            if (success) {
              that.loadBirthdays()
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'error'
              })
            }
          }
        }
      })
      return
    }
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除 "' + name + '" 的生日信息吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户确认删除')
          
          // 使用ID删除
          var success = storage.deleteBirthdayById(id)
          
          if (success) {
            that.loadBirthdays()
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
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

  // 切换标签过滤
  switchTag: function(e) {
    var tag = e.currentTarget.dataset.tag
    var filteredBirthdays = []
    
    if (tag === '全部') {
      filteredBirthdays = this.data.birthdays
    } else {
      filteredBirthdays = storage.getBirthdaysByTag(tag)
    }
    
    this.setData({
      currentTag: tag,
      filteredBirthdays: filteredBirthdays
    })
  },

  // 搜索功能
  onSearch: function(e) {
    var keyword = e.detail.value
    var results = storage.searchBirthdays(keyword)
    
    this.setData({
      filteredBirthdays: results,
      currentTag: keyword ? '搜索结果' : '全部'
    })
  }
})