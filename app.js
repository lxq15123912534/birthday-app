App({
  globalData: {
    userInfo: null,
    currentTheme: {
      key: 'classic',
      name: '经典主题',
      desc: '温暖的生日色彩',
      gradient: 'linear-gradient(145deg, #ff6ba6 0%, #fdba74 25%, #9ae6b4 50%, #63b3ed 75%, #d946ef 100%)',
      colors: {
        primary: '#ff6ba6',
        secondary: '#fdba74',
        accent: '#9ae6b4',
        headerBg: 'linear-gradient(145deg, #ff6ba6 0%, #fdba74 25%, #9ae6b4 50%, #63b3ed 75%, #d946ef 100%)',
        contentBg: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'
      }
    }
  },

  // 初始化主题
  initTheme() {
    try {
      const savedTheme = wx.getStorageSync('currentTheme');
      if (savedTheme) {
        this.globalData.currentTheme = savedTheme;
      }
    } catch (error) {
      console.error('初始化主题失败:', error);
    }
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 初始化主题
    this.initTheme();

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  }
})