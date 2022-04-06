// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperUrls: [{
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ],
    playlist: [],
    pageSize: 15,
    count: 0,
    showNoMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.getPlaylist();
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
  async onPullDownRefresh() {
    this.setData({
      playlist: [],
      showNoMore: false
    });
    await this.getPlaylist();
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.getPlaylist();
  },

  async getPlaylist() {
    if(this.data.showNoMore){
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    const res = await wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'playlist',
        start: this.data.playlist.length,
        pageSize: this.data.pageSize
      }
    });
    wx.hideLoading()
    console.log(res);
    const result = res.result;
    this.setData({
      playlist: this.data.playlist.concat(result.list),
      count: result.count
    });
    this.setData({
      showNoMore:  this.data.playlist.length === this.data.count
    });
  },
  goToMusiclist(e){
    const dataset = e.currentTarget.dataset;
    const id = dataset.id;
    wx.navigateTo({
      url: '/pages/musiclist/musiclist?id=' + id,
    })
  }
})