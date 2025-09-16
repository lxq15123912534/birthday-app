// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    color: "#969799",
    selectedColor: "#ff6ba6",
    list: [
      {
        pagePath: "/pages/index/index",
        text: "清单",
        icon: "📋"
      },
      {
        pagePath: "/pages/profile/profile",
        text: "我",
        icon: "👤"
      }
    ]
  },

  attached() {
    // 组件初始化时获取当前页面路径并设置选中状态
    this.setTabBarIndex();
  },

  ready() {
    // 组件准备好后再次检查选中状态，确保正确显示
    this.setTabBarIndex();
  },

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      const index = data.index;

      // 添加触觉反馈
      wx.vibrateShort({
        type: 'light'
      });

      // 设置选中状态
      this.setData({
        selected: index
      });

      // 跳转页面
      wx.switchTab({
        url
      });
    },

    setTabBarIndex() {
      // 获取当前页面栈
      const pages = getCurrentPages();
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        const route = '/' + currentPage.route;

        // 查找对应的 tab 索引
        const index = this.data.list.findIndex(item => item.pagePath === route);
        if (index !== -1) {
          this.setData({
            selected: index
          });
        }
      }
    }
  }
});