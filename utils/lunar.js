/**
 * 农历公历转换工具库
 * 支持1900年到2100年的公历农历互转
 * 基于专业农历算法实现
 */

// 农历数据表 - 每个数字代表一个农历年的信息
// 前4位代表当年闰月的月份，为0表示没有闰月
// 后13位代表正常月份（第一个月到第十二个月）及闰月的天数，1表示30天，0表示29天
var lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, // 2050-2059
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, // 2090-2099
  0x0d520 // 2100
];

// 公历每月天数 - 平年
var solarMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// 天干
var gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

// 地支
var zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 生肖
var animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];

// 农历月份
var lunarMonths = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];

// 农历日期
var lunarDays = [
  "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
  "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
  "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"
];

/**
 * 判断公历年是否为闰年
 */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * 获取公历某年某月的天数
 */
function getSolarMonthDays(year, month) {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  return solarMonth[month - 1];
}

/**
 * 获取农历某年的闰月月份 (1-12，无闰月返回0)
 */
function getLeapMonth(year) {
  return lunarInfo[year - 1900] & 0xf;
}

/**
 * 获取农历某年闰月的天数
 */
function getLeapDays(year) {
  if (getLeapMonth(year)) {
    return (lunarInfo[year - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

/**
 * 获取农历某年某月的天数
 */
function getLunarMonthDays(year, month) {
  if (month > 12 || month < 1) return -1;
  return (lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

/**
 * 获取农历某年的总天数
 */
function getLunarYearDays(year) {
  var i, sum = 348;
  for (i = 0x8000; i > 0x8; i >>= 1) {
    sum += (lunarInfo[year - 1900] & i) ? 1 : 0;
  }
  return sum + getLeapDays(year);
}

/**
 * 获取干支年
 */
function getGanZhiYear(year) {
  return gan[(year - 4) % 10] + zhi[(year - 4) % 12];
}

/**
 * 获取生肖
 */
function getAnimal(year) {
  return animals[(year - 4) % 12];
}

/**
 * 获取星座
 */
function getConstellation(month, day) {
  // 星座分界日期数组，对应每月几号开始是下一个星座
  var dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 22, 22];
  // 12个星座按照时间顺序排列
  var constellations = ["水瓶座", "双鱼座", "白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座"];
  
  var index = month - 1;
  // 如果日期小于分界日，使用前一个星座
  if (day < dates[index]) {
    index = index === 0 ? 11 : index - 1;
  }
  
  return constellations[index];
}

/**
 * 公历转农历
 * @param {number} year 公历年
 * @param {number} month 公历月 (1-12)
 * @param {number} day 公历日
 * @returns {object} 农历信息对象
 */
function solar2lunar(year, month, day) {
  if (year < 1900 || year > 2100) {
    return null;
  }
  
  if (year === 1900 && month === 1 && day < 31) {
    return null;
  }
  
  // 计算距离1900年1月31日的天数
  var offset = 0;
  for (var i = 1900; i < year; i++) {
    offset += isLeapYear(i) ? 366 : 365;
  }
  
  for (var i = 1; i < month; i++) {
    offset += getSolarMonthDays(year, i);
  }
  
  offset += day - 31;
  
  // 计算农历年份
  var lunarYear = 1900;
  var daysOfYear = 0;
  for (var i = 1900; i < 2101 && offset > 0; i++) {
    daysOfYear = getLunarYearDays(i);
    offset -= daysOfYear;
    lunarYear++;
  }
  
  if (offset < 0) {
    offset += daysOfYear;
    lunarYear--;
  }
  
  // 农历正月为true，月份从1开始
  var isLeap = false;
  var lunarMonth = 1;
  
  for (var i = 1; i < 13 && offset > 0; i++) {
    // 闰月
    if (getLeapMonth(lunarYear) > 0 && i === (getLeapMonth(lunarYear) + 1) && !isLeap) {
      --i;
      isLeap = true;
      daysOfYear = getLeapDays(lunarYear);
    } else {
      daysOfYear = getLunarMonthDays(lunarYear, i);
    }
    
    // 解除闰月
    if (isLeap && i === (getLeapMonth(lunarYear) + 1)) {
      isLeap = false;
    }
    
    offset -= daysOfYear;
    if (!isLeap) {
      lunarMonth++;
    }
  }
  
  if (offset === 0 && getLeapMonth(lunarYear) > 0 && lunarMonth === getLeapMonth(lunarYear) + 1) {
    if (isLeap) {
      isLeap = false;
    } else {
      isLeap = true;
      --lunarMonth;
    }
  }
  
  if (offset < 0) {
    offset += daysOfYear;
    --lunarMonth;
  }
  
  var lunarDay = offset + 1;
  
  return {
    // 公历信息
    cYear: year,
    cMonth: month,
    cDay: day,
    
    // 农历信息
    lYear: lunarYear,
    lMonth: lunarMonth,
    lDay: lunarDay,
    isLeap: isLeap,
    
    // 中文表示
    IMonthCn: (isLeap ? "闰" : "") + lunarMonths[lunarMonth - 1],
    IDayCn: lunarDays[lunarDay - 1],
    
    // 干支纪年
    gzYear: getGanZhiYear(lunarYear),
    
    // 生肖
    Animal: getAnimal(lunarYear),
    
    // 星座
    astro: getConstellation(month, day)
  };
}

/**
 * 农历转公历
 * @param {number} year 农历年
 * @param {number} month 农历月 (1-12)
 * @param {number} day 农历日
 * @param {boolean} isLeap 是否闰月
 * @returns {object} 公历信息对象
 */
function lunar2solar(year, month, day, isLeap) {
  isLeap = !!isLeap;
  
  if (year < 1900 || year > 2100) {
    return null;
  }
  
  if (day > (isLeap ? getLeapDays(year) : getLunarMonthDays(year, month))) {
    return null;
  }
  
  // 计算距离农历1900年正月初一的天数
  var offset = 0;
  for (var i = 1900; i < year; i++) {
    offset += getLunarYearDays(i);
  }
  
  var leap = 0;
  var isAdd = false;
  for (var i = 1; i < month; i++) {
    leap = getLeapMonth(year);
    if (!isAdd) {
      // 处理闰月
      if (leap <= i && leap > 0) {
        offset += getLeapDays(year);
        isAdd = true;
      }
    }
    offset += getLunarMonthDays(year, i);
  }
  
  // 转换当月
  if (isLeap) {
    offset += getLunarMonthDays(year, month);
  }
  
  offset += day - 1;
  
  // 1900年1月31日为农历1900年正月初一
  var solarYear = 1900;
  var solarMonth = 1;
  var solarDay = 31;
  
  // 计算公历日期
  for (var i = 0; i < offset; i++) {
    solarDay++;
    if (solarDay > getSolarMonthDays(solarYear, solarMonth)) {
      solarDay = 1;
      solarMonth++;
      if (solarMonth > 12) {
        solarMonth = 1;
        solarYear++;
      }
    }
  }
  
  return {
    // 公历信息
    cYear: solarYear,
    cMonth: solarMonth,
    cDay: solarDay,
    
    // 农历信息
    lYear: year,
    lMonth: month,
    lDay: day,
    isLeap: isLeap,
    
    // 中文表示
    IMonthCn: (isLeap ? "闰" : "") + lunarMonths[month - 1],
    IDayCn: lunarDays[day - 1],
    
    // 干支纪年
    gzYear: getGanZhiYear(year),
    
    // 生肖
    Animal: getAnimal(year),
    
    // 星座
    astro: getConstellation(solarMonth, solarDay)
  };
}

module.exports = {
  solar2lunar: solar2lunar,
  lunar2solar: lunar2solar,
  getConstellation: getConstellation,
  getAnimal: getAnimal,
  getGanZhiYear: getGanZhiYear,
  isLeapYear: isLeapYear,
  getSolarMonthDays: getSolarMonthDays,
  getLeapMonth: getLeapMonth,
  getLunarMonthDays: getLunarMonthDays,
  getLunarYearDays: getLunarYearDays
};