// components/playlist/cmp-playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playItem: {
      type: Object,
      value: {}
    }
  },

  observers: {
    ['playItem.playCount'](val) {
      this.setData({
        count: this.formatCount(val)
      });
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    formatCount(num, point = 2) {
      const numStr = num.toFixed(0);
      const len = numStr.length;
      if (len < 6) {
        return numStr;
      }
      if (len <= 8) {
        let decimal = numStr.substring(len - 4, len - 4 + point);
        return numStr.substring(0, len - 4) + '.' + decimal + '万';
      }
      let decimal = numStr.substring(len - 8, len - 8 + point);
      return numStr.substring(0, len - 8) + '.' + decimal + '亿';
    }
  }
})