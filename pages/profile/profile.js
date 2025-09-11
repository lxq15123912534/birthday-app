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
      gradient: 'linear-gradient(135deg, #ff6b9d 0%, #ffa726 100%)'
    },
    themeList: [
      {
        key: 'classic',
        name: '经典主题',
        desc: '温暖的生日色彩',
        gradient: 'linear-gradient(135deg, #ff6b9d 0%, #ffa726 100%)'
      },
      {
        key: 'ocean',
        name: '海洋主题',
        desc: '清新的蓝色调',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      {
        key: 'forest',
        name: '森林主题',
        desc: '自然的绿色调',
        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
      },
      {
        key: 'sunset',
        name: '晚霞主题',
        desc: '浪漫的紫色调',
        gradient: 'linear-gradient(135deg, #9796f0 0%, #fbc7d4 100%)'
      }
    ]
  },

  onLoad() {
    this.loadUserInfo();
    this.loadTheme();
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
        // 应用主题
        this.applyTheme(theme);
      }
    } catch (error) {
      console.error('加载主题失败:', error);
    }
  },

  // 应用主题
  applyTheme(theme) {
    // 这里可以通过事件或全局方法来应用主题
    // 暂时先保存到storage，后续可以扩展
    try {
      wx.setStorageSync('currentTheme', theme);
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