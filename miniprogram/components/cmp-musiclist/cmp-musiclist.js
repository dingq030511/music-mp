const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: -1,
  },

  lifetimes: {
    attached(){
      if(app.globalData.playingId){
        this.setData({
          playingId: app.globalData.playingId,
          musiclist: app.globalData.musiclist
        });
      }
    },
  },

  pageLifetimes: {
    show(){
      if(app.globalData.playingId){
        this.setData({
          playingId: app.globalData.playingId
        });
      }
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectMusic(e){
      const dataset = e.currentTarget.dataset;
      const id = dataset.id;
      this.setData({
        playingId: id
      });
      app.globalData.musiclist = this.properties.musiclist;
      wx.setStorageSync('musiclist', this.properties.musiclist);
      wx.navigateTo({
        url: '/pages/player/player?id='+id,
      })
    }
  }
})
