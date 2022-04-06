const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listInfo: {},
    playingId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMusiclist(options.id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.playingId){
      this.setData({
        playingId: Number(app.globalData.playingId)
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  async getMusiclist(id){
    wx.showLoading({
      title: '加载中',
    })
    const { result } = await wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'musiclist',
        id
      }
    });
    wx.hideLoading();
    console.log(result);
    const playlist = result.playlist
    this.setData({
      musiclist: playlist.tracks,
      listInfo: {
        coverImgUrl: playlist.coverImgUrl,
        name: playlist.name
      }
    });
    app.globalData.musiclist = this.data.musiclist;
    wx.setStorageSync('musiclist', this.data.musiclist)
  },
  selectMusic(e){
    const dataset = e.currentTarget.dataset;
    const id = dataset.id;
    this.setData({
      playingId: id
    });
    wx.navigateTo({
      url: '/pages/player/player?id='+id,
    })
  }
})