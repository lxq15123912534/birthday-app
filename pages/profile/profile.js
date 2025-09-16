// pages/profile/profile.js
Page({
  data: {
    userInfo: {
      avatar: '🐱',
      nickname: '生日守护者'
    },
    showAvatarModal: false,
    showNicknameModal: false,
    showThemeModal: false,
    tempNickname: '',
    avatarList: [
      '🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
      '🐨', '🐯', '🦁', '🐸', '🐵', '🐺', '🦄', '🐷',
      '🐮', '🐗', '🦔', '🐾', '🐙', '🐠', '🐳', '🦆'
    ],
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
    },
    themeList: [
      {
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
      },
      {
        key: 'ocean',
        name: '海洋主题',
        desc: '清新的蓝色调',
        gradient: 'linear-gradient(145deg, #0891b2 0%, #0ea5e9 25%, #3b82f6 50%, #6366f1 75%, #8b5cf6 100%)',
        colors: {
          primary: '#0891b2',
          secondary: '#0ea5e9',
          accent: '#3b82f6',
          headerBg: 'linear-gradient(145deg, #0891b2 0%, #0ea5e9 25%, #3b82f6 50%, #6366f1 75%, #8b5cf6 100%)',
          contentBg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)'
        }
      },
      {
        key: 'forest',
        name: '森林主题',
        desc: '自然的绿色调',
        gradient: 'linear-gradient(145deg, #059669 0%, #10b981 25%, #34d399 50%, #6ee7b7 75%, #a7f3d0 100%)',
        colors: {
          primary: '#059669',
          secondary: '#10b981',
          accent: '#34d399',
          headerBg: 'linear-gradient(145deg, #059669 0%, #10b981 25%, #34d399 50%, #6ee7b7 75%, #a7f3d0 100%)',
          contentBg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)'
        }
      },
      {
        key: 'sunset',
        name: '晚霞主题',
        desc: '浪漫的紫色调',
        gradient: 'linear-gradient(145deg, #c084fc 0%, #e879f9 25%, #f472b6 50%, #fb7185 75%, #fbbf24 100%)',
        colors: {
          primary: '#c084fc',
          secondary: '#e879f9',
          accent: '#f472b6',
          headerBg: 'linear-gradient(145deg, #c084fc 0%, #e879f9 25%, #f472b6 50%, #fb7185 75%, #fbbf24 100%)',
          contentBg: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 50%, #f3e8ff 100%)'
        }
      }
    ]
  },

  onLoad() {
    // 设置自定义tabBar的选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    this.loadUserInfo();
    this.loadTheme();
  },

  onShow() {
    // 设置自定义tabBar的选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  // 加载用户信息
  loadUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.setData({ userInfo });
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },

  // 保存用户信息
  saveUserInfo() {
    try {
      wx.setStorageSync('userInfo', this.data.userInfo);
    } catch (error) {
      console.error('保存用户信息失败:', error);
    }
  },

  // 加载主题
  loadTheme() {
    try {
      const theme = wx.getStorageSync('currentTheme');
      if (theme) {
        this.setData({ currentTheme: theme });
        // 更新全局数据
        getApp().globalData.currentTheme = theme;
      } else {
        // 如果没有保存的主题，使用默认主题
        const defaultTheme = this.data.themeList.find(t => t.key === 'classic');
        if (defaultTheme) {
          this.setData({ currentTheme: defaultTheme });
        }
      }
    } catch (error) {
      console.error('加载主题失败:', error);
    }
  },

  // 应用主题
  applyTheme(theme) {
    try {
      // 保存主题到存储
      wx.setStorageSync('currentTheme', theme);

      // 广播主题变更事件给其他页面
      getApp().globalData.currentTheme = theme;

      // 立即更新当前页面显示
      this.setData({ currentTheme: theme });

    } catch (error) {
      console.error('应用主题失败:', error);
    }
  },

  // 选择头像
  selectAvatar() {
    this.setData({ showAvatarModal: true });
  },

  hideAvatarModal() {
    this.setData({ showAvatarModal: false });
  },

  chooseAvatar(e) {
    const avatar = e.currentTarget.dataset.avatar;
    this.setData({
      'userInfo.avatar': avatar,
      showAvatarModal: false
    });
    this.saveUserInfo();
  },

  // 编辑昵称
  editNickname() {
    this.setData({ 
      showNicknameModal: true,
      tempNickname: this.data.userInfo.nickname
    });
  },

  hideNicknameModal() {
    this.setData({ showNicknameModal: false });
  },

  onNicknameInput(e) {
    this.setData({ tempNickname: e.detail.value });
  },

  saveNickname() {
    const nickname = this.data.tempNickname.trim();
    if (!nickname) {
      wx.showToast({
        title: '昵称不能为空',
        icon: 'none'
      });
      return;
    }
    
    this.setData({
      'userInfo.nickname': nickname,
      showNicknameModal: false
    });
    this.saveUserInfo();
  },

  // 选择主题
  selectTheme() {
    this.setData({ showThemeModal: true });
  },

  hideThemeModal() {
    this.setData({ showThemeModal: false });
  },

  chooseTheme(e) {
    const theme = e.currentTarget.dataset.theme;
    this.setData({
      currentTheme: theme,
      showThemeModal: false
    });
    this.applyTheme(theme);
    
    wx.showToast({
      title: `已切换到${theme.name}`,
      icon: 'success'
    });
  },

  // 导出数据
  exportData() {
    wx.showLoading({ title: '正在导出...' });
    
    try {
      // 获取所有生日数据
      const birthdays = wx.getStorageSync('birthdays') || [];
      const userInfo = wx.getStorageSync('userInfo') || {};
      const currentTheme = wx.getStorageSync('currentTheme') || {};
      
      const exportData = {
        version: '1.0.0',
        exportTime: new Date().toISOString(),
        userInfo,
        theme: currentTheme,
        birthdays,
        count: birthdays.length
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      
      // 微信小程序中无法直接保存文件到本地，可以复制到剪贴板
      wx.setClipboardData({
        data: jsonString,
        success: () => {
          wx.hideLoading();
          wx.showModal({
            title: '导出成功',
            content: `已导出${birthdays.length}条生日数据到剪贴板，您可以粘贴到文本编辑器中保存为JSON文件`,
            confirmText: '好的',
            showCancel: false
          });
        },
        fail: () => {
          wx.hideLoading();
          wx.showToast({
            title: '导出失败',
            icon: 'error'
          });
        }
      });
      
    } catch (error) {
      wx.hideLoading();
      console.error('导出数据失败:', error);
      wx.showToast({
        title: '导出失败',
        icon: 'error'
      });
    }
  },

  // 导入数据
  importData() {
    wx.showModal({
      title: '导入数据',
      content: '请先将JSON数据复制到剪贴板',
      confirmText: '开始导入',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.processImportData();
        }
      }
    });
  },

  processImportData() {
    wx.getClipboardData({
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          
          // 验证数据格式
          if (!data.birthdays || !Array.isArray(data.birthdays)) {
            throw new Error('数据格式不正确');
          }

          wx.showModal({
            title: '确认导入',
            content: `将导入${data.birthdays.length}条生日数据，是否覆盖现有数据？`,
            confirmText: '确认导入',
            cancelText: '取消',
            success: (modalRes) => {
              if (modalRes.confirm) {
                this.executeImport(data);
              }
            }
          });
          
        } catch (error) {
          console.error('解析数据失败:', error);
          wx.showToast({
            title: '数据格式错误',
            icon: 'error'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '读取剪贴板失败',
          icon: 'error'
        });
      }
    });
  },

  executeImport(data) {
    try {
      // 导入生日数据
      if (data.birthdays) {
        wx.setStorageSync('birthdays', data.birthdays);
      }
      
      // 导入用户信息（可选）
      if (data.userInfo) {
        wx.setStorageSync('userInfo', data.userInfo);
        this.setData({ userInfo: data.userInfo });
      }
      
      // 导入主题（可选）
      if (data.theme) {
        wx.setStorageSync('currentTheme', data.theme);
        this.setData({ currentTheme: data.theme });
      }

      wx.showToast({
        title: '导入成功',
        icon: 'success'
      });
      
    } catch (error) {
      console.error('导入数据失败:', error);
      wx.showToast({
        title: '导入失败',
        icon: 'error'
      });
    }
  }
});