/**
 * 日期工具类 - 简化版本，兼容小程序
 */

var lunar = require('./lunar.js')

// 星座计算
function getConstellation(month, day) {
  var constellations = [
    "摩羯座", "水瓶座", "双鱼座", "白羊座", "金牛座", "双子座",
    "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座"
  ]
  
  var dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 22, 22]
  
  var index = month - 1
  if (day < dates[index]) {
    index = index === 0 ? 11 : index - 1
  }
  
  return constellations[index]
}

// 生肖计算
function getZodiac(year) {
  var zodiacs = ["猴", "鸡", "狗", "猪", "鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊"]
  return zodiacs[year % 12]
}

// 生肖emoji映射
function getZodiacEmoji(zodiacText) {
  var zodiacEmojis = {
    "鼠": "🐭",
    "牛": "🐮", 
    "虎": "🐯",
    "兔": "🐰",
    "龙": "🐲",
    "蛇": "🐍",
    "马": "🐎",
    "羊": "🐑",
    "猴": "🐵",
    "鸡": "🐔",
    "狗": "🐶",
    "猪": "🐷"
  }
  return zodiacEmojis[zodiacText] || "🐾"
}

// 计算距离下次生日的天数
function calculateDaysLeft(birthday) {
  var today = new Date()
  var currentYear = today.getFullYear()
  
  var birthDate
  
  if (birthday.type === 'lunar') {
    // 农历生日需要转换为当年的公历日期
    var lunarToSolar = lunar.lunar2solar(currentYear, birthday.month, birthday.day, false)
    if (!lunarToSolar) {
      // 如果转换失败，使用简单估算
      birthDate = new Date(currentYear, birthday.month - 1, birthday.day)
    } else {
      birthDate = new Date(lunarToSolar.cYear, lunarToSolar.cMonth - 1, lunarToSolar.cDay)
    }
    
    // 如果今年的农历生日已过，计算明年的
    if (birthDate < today) {
      var nextYearLunarToSolar = lunar.lunar2solar(currentYear + 1, birthday.month, birthday.day, false)
      if (nextYearLunarToSolar) {
        birthDate = new Date(nextYearLunarToSolar.cYear, nextYearLunarToSolar.cMonth - 1, nextYearLunarToSolar.cDay)
      } else {
        birthDate = new Date(currentYear + 1, birthday.month - 1, birthday.day)
      }
    }
  } else {
    // 公历生日
    birthDate = new Date(currentYear, birthday.month - 1, birthday.day)
    
    // 如果今年的生日已过，计算明年的
    if (birthDate < today) {
      birthDate = new Date(currentYear + 1, birthday.month - 1, birthday.day)
    }
  }
  
  var timeDiff = birthDate.getTime() - today.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

// 计算年龄
function calculateAge(birthYear) {
  var currentYear = new Date().getFullYear()
  return currentYear - birthYear
}

// 获取生日祝福语
function getBirthdayBlessing() {
  var blessings = [
    "愿你岁岁平安，年年有今日",
    "生日快乐，愿所有美好都与你同在",
    "愿你前程似锦，生日快乐",
    "祝你生日快乐，心想事成",
    "愿你永远年轻，生日快乐",
    "生日快乐，愿你幸福满满",
    "祝你生日快乐，天天开心",
    "愿你生日快乐，笑口常开"
  ]
  
  return blessings[Math.floor(Math.random() * blessings.length)]
}

// 计算详细的生日信息
function calculateBirthdayInfo(birthday) {
  var today = new Date()
  var currentYear = today.getFullYear()
  
  // 基础信息
  var info = {
    name: birthday.name,
    type: birthday.type || 'solar',
    year: birthday.year,
    month: birthday.month,
    day: birthday.day,
    tags: birthday.tags || []
  }
  
  // 根据生日类型处理星座、生肖等信息
  if (birthday.type === 'lunar') {
    // 农历生日，需要转换为公历来计算星座
    var lunarToSolar = lunar.lunar2solar(birthday.year, birthday.month, birthday.day, false)
    if (lunarToSolar) {
      info.constellation = lunarToSolar.astro
      info.solarDate = lunarToSolar.cYear + '年' + lunarToSolar.cMonth + '月' + lunarToSolar.cDay + '日'
      info.lunarInfo = '农历' + lunarToSolar.lYear + '年' + lunarToSolar.IMonthCn + lunarToSolar.IDayCn
      info.gzYear = lunarToSolar.gzYear
      info.zodiac = lunarToSolar.Animal
      info.zodiacEmoji = getZodiacEmoji(lunarToSolar.Animal)
    } else {
      // 转换失败时的备选方案
      info.constellation = getConstellation(birthday.month, birthday.day)
      info.solarDate = '转换失败'
      info.lunarInfo = '农历' + birthday.year + '年' + birthday.month + '月' + birthday.day + '日'
      info.zodiac = getZodiac(birthday.year)
      info.zodiacEmoji = getZodiacEmoji(getZodiac(birthday.year))
    }
  } else {
    // 公历生日，可以转换为农历显示更多信息
    var solarToLunar = lunar.solar2lunar(birthday.year, birthday.month, birthday.day)
    if (solarToLunar) {
      info.constellation = solarToLunar.astro
      info.solarDate = birthday.year + '年' + birthday.month + '月' + birthday.day + '日'
      info.lunarInfo = '农历' + solarToLunar.lYear + '年' + solarToLunar.IMonthCn + solarToLunar.IDayCn
      info.gzYear = solarToLunar.gzYear
      info.zodiac = solarToLunar.Animal
      info.zodiacEmoji = getZodiacEmoji(solarToLunar.Animal)
    } else {
      info.constellation = getConstellation(birthday.month, birthday.day)
      info.solarDate = birthday.year + '年' + birthday.month + '月' + birthday.day + '日'
      info.lunarInfo = '转换失败'
      info.zodiac = getZodiac(birthday.year)
      info.zodiacEmoji = getZodiacEmoji(getZodiac(birthday.year))
    }
  }
  
  // 计算年龄和距离生日天数
  info.currentAge = calculateAge(birthday.year)
  info.daysLeft = calculateDaysLeft(birthday)
  info.blessing = getBirthdayBlessing()
  
  // 下次生日信息
  info.nextBirthdayAge = info.currentAge + 1
  info.nextYear = currentYear + 1
  info.nextMonth = birthday.month
  info.nextDay = birthday.day
  info.nextAge = info.currentAge + 2
  
  return info
}

// 数据排序 - 按距离生日天数排序
function sortBirthdaysByDays(birthdays) {
  return birthdays.sort(function(a, b) {
    var daysA = calculateDaysLeft(a)
    var daysB = calculateDaysLeft(b)
    return daysA - daysB
  })
}

// 数据过滤 - 按标签过滤
function filterBirthdaysByTag(birthdays, tag) {
  if (!tag || tag === '全部') {
    return birthdays
  }
  
  var result = []
  for (var i = 0; i < birthdays.length; i++) {
    var birthday = birthdays[i]
    var tags = birthday.tags || []
    for (var j = 0; j < tags.length; j++) {
      if (tags[j] === tag) {
        result.push(birthday)
        break
      }
    }
  }
  return result
}

// 获取所有使用的标签
function getAllTags(birthdays) {
  var tagSet = {}
  for (var i = 0; i < birthdays.length; i++) {
    var birthday = birthdays[i]
    var tags = birthday.tags || []
    for (var j = 0; j < tags.length; j++) {
      tagSet[tags[j]] = true
    }
  }
  
  var result = []
  for (var tag in tagSet) {
    if (tagSet.hasOwnProperty(tag)) {
      result.push(tag)
    }
  }
  return result
}

module.exports = {
  getConstellation: getConstellation,
  getZodiac: getZodiac,
  getZodiacEmoji: getZodiacEmoji,
  calculateDaysLeft: calculateDaysLeft,
  calculateAge: calculateAge,
  getBirthdayBlessing: getBirthdayBlessing,
  calculateBirthdayInfo: calculateBirthdayInfo,
  sortBirthdaysByDays: sortBirthdaysByDays,
  filterBirthdaysByTag: filterBirthdaysByTag,
  getAllTags: getAllTags
}