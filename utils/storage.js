/**
 * 本地存储工具类 - 简化版本，兼容小程序
 */

var dateUtils = require('./dateUtils.js')

var STORAGE_KEY = 'birthdays'

// 获取所有生日数据
function getAllBirthdays() {
  try {
    var birthdays = wx.getStorageSync(STORAGE_KEY) || []
    console.log('存储中的原始数据:', birthdays)
    
    // 检查并为没有ID的老数据补充ID
    var needUpdate = false
    for (var i = 0; i < birthdays.length; i++) {
      if (!birthdays[i].id) {
        birthdays[i].id = 'birthday_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        needUpdate = true
        console.log('为老数据补充ID:', birthdays[i].id)
      }
    }
    
    // 如果有数据更新，保存回去
    if (needUpdate) {
      wx.setStorageSync(STORAGE_KEY, birthdays)
      console.log('更新后的存储数据:', birthdays)
    }
    
    // 为每个生日数据计算最新信息
    var result = []
    for (var i = 0; i < birthdays.length; i++) {
      result.push(dateUtils.calculateBirthdayInfo(birthdays[i]))
    }
    
    console.log('计算后的生日数据:', result)
    return result
  } catch (error) {
    console.error('读取生日数据失败:', error)
    return []
  }
}

// 保存生日数据
function saveBirthday(birthday) {
  try {
    var birthdays = wx.getStorageSync(STORAGE_KEY) || []
    
    // 计算完整的生日信息
    var fullBirthdayInfo = dateUtils.calculateBirthdayInfo(birthday)
    
    // 添加唯一ID
    fullBirthdayInfo.id = 'birthday_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    fullBirthdayInfo.createTime = Date.now()
    fullBirthdayInfo.updateTime = Date.now()
    
    console.log('保存生日数据，ID:', fullBirthdayInfo.id)
    
    birthdays.push(fullBirthdayInfo)
    
    // 按距离生日天数排序
    var sortedBirthdays = dateUtils.sortBirthdaysByDays(birthdays)
    
    wx.setStorageSync(STORAGE_KEY, sortedBirthdays)
    return true
  } catch (error) {
    console.error('保存生日数据失败:', error)
    return false
  }
}

// 更新生日数据
function updateBirthday(index, birthday) {
  try {
    var birthdays = wx.getStorageSync(STORAGE_KEY) || []
    
    if (index >= 0 && index < birthdays.length) {
      // 保留原有的创建时间
      var originalCreateTime = birthdays[index].createTime
      
      // 计算完整的生日信息
      var fullBirthdayInfo = dateUtils.calculateBirthdayInfo(birthday)
      
      fullBirthdayInfo.createTime = originalCreateTime || Date.now()
      fullBirthdayInfo.updateTime = Date.now()
      
      birthdays[index] = fullBirthdayInfo
      
      // 重新排序
      var sortedBirthdays = dateUtils.sortBirthdaysByDays(birthdays)
      
      wx.setStorageSync(STORAGE_KEY, sortedBirthdays)
      return true
    }
    return false
  } catch (error) {
    console.error('更新生日数据失败:', error)
    return false
  }
}

// 删除生日数据
function deleteBirthday(index) {
  try {
    var birthdays = wx.getStorageSync(STORAGE_KEY) || []
    
    if (index >= 0 && index < birthdays.length) {
      birthdays.splice(index, 1)
      wx.setStorageSync(STORAGE_KEY, birthdays)
      return true
    }
    return false
  } catch (error) {
    console.error('删除生日数据失败:', error)
    return false
  }
}

// 通过ID删除数据
function deleteBirthdayById(id) {
  try {
    var birthdays = wx.getStorageSync(STORAGE_KEY) || []
    console.log('所有生日数据:', birthdays)
    console.log('要删除的ID:', id)
    
    // 找到匹配的项目索引
    var indexToDelete = -1
    for (var i = 0; i < birthdays.length; i++) {
      var birthday = birthdays[i]
      if (birthday.id === id) {
        indexToDelete = i
        console.log('找到匹配项目，索引:', i)
        break
      }
    }
    
    if (indexToDelete >= 0) {
      var deletedItem = birthdays[indexToDelete]
      birthdays.splice(indexToDelete, 1)
      wx.setStorageSync(STORAGE_KEY, birthdays)
      console.log('删除成功，删除的项目:', deletedItem)
      console.log('剩余数据:', birthdays)
      return true
    } else {
      console.log('未找到匹配的项目')
      return false
    }
  } catch (error) {
    console.error('删除生日数据失败:', error)
    return false
  }
}

// 通过生日信息删除数据（保留作为备用方法）
function deleteBirthdayByInfo(birthdayInfo) {
  try {
    // 如果有ID，优先使用ID删除
    if (birthdayInfo.id) {
      return deleteBirthdayById(birthdayInfo.id)
    }
    
    var birthdays = wx.getStorageSync(STORAGE_KEY) || []
    console.log('所有生日数据:', birthdays)
    console.log('要删除的生日信息:', birthdayInfo)
    
    // 找到匹配的项目索引
    var indexToDelete = -1
    for (var i = 0; i < birthdays.length; i++) {
      var birthday = birthdays[i]
      if (birthday.name === birthdayInfo.name && 
          birthday.month === birthdayInfo.month && 
          birthday.day === birthdayInfo.day &&
          birthday.year === birthdayInfo.year) {
        indexToDelete = i
        console.log('找到匹配项目，索引:', i)
        break
      }
    }
    
    if (indexToDelete >= 0) {
      birthdays.splice(indexToDelete, 1)
      wx.setStorageSync(STORAGE_KEY, birthdays)
      console.log('删除成功，剩余数据:', birthdays)
      return true
    } else {
      console.log('未找到匹配的项目')
      return false
    }
  } catch (error) {
    console.error('删除生日数据失败:', error)
    return false
  }
}

// 获取单个生日数据
function getBirthday(index) {
  try {
    var birthdays = getAllBirthdays()
    
    if (index >= 0 && index < birthdays.length) {
      return birthdays[index]
    }
    return null
  } catch (error) {
    console.error('获取生日数据失败:', error)
    return null
  }
}

// 获取即将到来的生日（最近的几个）
function getUpcomingBirthdays(count) {
  try {
    count = count || 5
    var birthdays = getAllBirthdays()
    var sorted = dateUtils.sortBirthdaysByDays(birthdays)
    return sorted.slice(0, count)
  } catch (error) {
    console.error('获取即将到来的生日失败:', error)
    return []
  }
}

// 按标签过滤生日数据
function getBirthdaysByTag(tag) {
  try {
    var birthdays = getAllBirthdays()
    return dateUtils.filterBirthdaysByTag(birthdays, tag)
  } catch (error) {
    console.error('按标签过滤生日数据失败:', error)
    return []
  }
}

// 获取所有使用过的标签
function getAllTags() {
  try {
    var birthdays = wx.getStorageSync(STORAGE_KEY) || []
    return dateUtils.getAllTags(birthdays)
  } catch (error) {
    console.error('获取标签失败:', error)
    return []
  }
}

// 搜索生日数据
function searchBirthdays(keyword) {
  try {
    var birthdays = getAllBirthdays()
    
    if (!keyword || keyword.trim() === '') {
      return birthdays
    }
    
    var lowerKeyword = keyword.toLowerCase()
    var result = []
    
    for (var i = 0; i < birthdays.length; i++) {
      var birthday = birthdays[i]
      
      // 按姓名搜索
      if (birthday.name.toLowerCase().indexOf(lowerKeyword) >= 0) {
        result.push(birthday)
        continue
      }
      
      // 按标签搜索
      var tags = birthday.tags || []
      var tagMatch = false
      for (var j = 0; j < tags.length; j++) {
        if (tags[j].toLowerCase().indexOf(lowerKeyword) >= 0) {
          tagMatch = true
          break
        }
      }
      if (tagMatch) {
        result.push(birthday)
        continue
      }
      
      // 按星座搜索
      if (birthday.constellation && birthday.constellation.toLowerCase().indexOf(lowerKeyword) >= 0) {
        result.push(birthday)
        continue
      }
      
      // 按生肖搜索
      if (birthday.zodiac && birthday.zodiac.toLowerCase().indexOf(lowerKeyword) >= 0) {
        result.push(birthday)
        continue
      }
    }
    
    return result
  } catch (error) {
    console.error('搜索生日数据失败:', error)
    return []
  }
}

// 清空所有数据
function clearAllData() {
  try {
    wx.removeStorageSync(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('清空数据失败:', error)
    return false
  }
}

module.exports = {
  getAllBirthdays: getAllBirthdays,
  saveBirthday: saveBirthday,
  updateBirthday: updateBirthday,
  deleteBirthday: deleteBirthday,
  deleteBirthdayById: deleteBirthdayById,
  deleteBirthdayByInfo: deleteBirthdayByInfo,
  getBirthday: getBirthday,
  getUpcomingBirthdays: getUpcomingBirthdays,
  getBirthdaysByTag: getBirthdaysByTag,
  getAllTags: getAllTags,
  searchBirthdays: searchBirthdays,
  clearAllData: clearAllData
}