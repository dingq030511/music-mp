const app = getApp();
const backgroundAudioManager = wx.getBackgroundAudioManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    musicDetail: {},
    isPlaying: false,
    isLyricShow: false,
    lyric: '',
    isSameSong: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id;
    this.bindBGMEvent();
    this.getMusicInfo(id);
  },

  getMusicInfo(id) {
    const musicDetail = this.getMusicDetail(id);
    let isSameSong = String(id) === String(app.globalData.playingId)
    if(!isSameSong){
      backgroundAudioManager.stop();
      app.globalData.playingId = id;
    } else {
      if(backgroundAudioManager.paused){
        backgroundAudioManager.play();
      }
    }
    this.setData({
      id,
      musicDetail,
      isPlaying: false,
      isSameSong
    });
    this.getMusicUrl(id);
    wx.setNavigationBarTitle({
      title: musicDetail.name,
    })
  },

  getMusicDetail(id) {
    let musiclist = app.globalData.musiclist;
    if (musiclist.length === 0) {
      musiclist = wx.getStorageSync('musiclist') || [];
    }
    return musiclist.find(e => String(e.id) === String(id));
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

  async getMusicUrl(id) {
    if(!this.data.isSameSong){
      wx.showLoading({
        title: '歌曲加载中',
      })
      const {
        result
      } = await wx.cloud.callFunction({
        name: 'music',
        data: {
          $url: 'musicUrl',
          id
        }
      });
      const music = result.data[0];
      if(!music.url){
        wx.showToast({
          title: '当前歌曲无权限播放',
        })
        return;
      }
      backgroundAudioManager.src = music.url;
      backgroundAudioManager.title = this.data.musicDetail.name;
      backgroundAudioManager.coverImgUrl = this.data.musicDetail.al.picUrl;
      backgroundAudioManager.singer = this.data.musicDetail.ar[0].name;
      backgroundAudioManager.epname = this.data.musicDetail.al.name;
    }
    this.setData({
      isPlaying: true
    });
    this.getLyric(id);
  },
  togglePlay() {
    this.setData({
      isPlaying: !this.data.isPlaying
    });
    if (this.data.isPlaying) {
      backgroundAudioManager.play();
    } else {
      backgroundAudioManager.pause();
    }
  },
  onPrev(){
    let musiclist = app.globalData.musiclist;
    if (musiclist.length === 0) {
      musiclist = wx.getStorageSync('musiclist') || [];
    }
    let index = musiclist.findIndex(e => String(this.data.id) === String(e.id));
    index--;
    if(index < 0){
      index += musiclist.length;
    }
    this.getMusicInfo(musiclist[index].id);
  },
  onNext(){
    let musiclist = app.globalData.musiclist;
    if (musiclist.length === 0) {
      musiclist = wx.getStorageSync('musiclist') || [];
    }
    let index = musiclist.findIndex(e => String(this.data.id) === String(e.id));
    index++;
    if(index >= musiclist.length){
      index -= musiclist.length;
    }
    this.getMusicInfo(musiclist[index].id);
  },
  bindBGMEvent(){
    backgroundAudioManager.onEnded(()=>{
      this.onNext();
    });
    backgroundAudioManager.onPause(()=>{
      this.setData({
        isPlaying: false
      });
    });
    backgroundAudioManager.onPlay(()=>{
      wx.hideLoading()
      this.setData({
        isPlaying: true
      });
    });

    backgroundAudioManager.onWaiting(()=>{
      wx.showLoading({
        title: '歌曲加载中'
      });
    });
  },
  toggleLyricShow(){
    this.setData({
      isLyricShow: !this.data.isLyricShow
    });
  },
  async getLyric(id){
    const {result} = await wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'lyric',
        id
      }
    });
    let lyric = '暂无歌词';
    let lrc = result.lrc;
    if(lrc){
      lyric = lrc.lyric;
    }
    this.setData({
      lyric
    });
  },
  onTimeupdate(e){
    if(this.data.isLyricShow){
      this.selectComponent('#lyric').update(e.detail);
    }
  }
})