const IMG_COUNT_LIMIT = 9;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    blogCotent: '',
    footerBottom: 0,
    images: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  onInput(e) {
    this.setData({
      blogCotent: e.detail.value,
      wordsNum: e.detail.value.length
    });
  },

  setFooterBottom(e) {
    this.setData({
      footerBottom: e.detail.height || 0
    });
  },

  async selectPhoto() {
    try {
      const res = await wx.chooseImage({
        count: IMG_COUNT_LIMIT - this.data.images.length,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
      });
      this.setData({
        images: this.data.images.concat(res.tempFilePaths).slice(-9)
      });
    } catch (error) {
      console.warn(error);
    }
  },

  onDelete(e) {
    const dataset = e.currentTarget.dataset;
    const index = dataset.index;
    const arr = [...this.data.images];
    arr.splice(index, 1);
    this.setData({
      images: arr
    });
  },

  onPreviewImage(e) {
    wx.previewImage({
      urls: this.data.images,
      current: e.currentTarget.dataset.img
    })
  },

  async uploadFiles() {
    const tasks = [];
    for (let i = 0, len = this.data.images.length; i < len; i++) {
      const item = this.data.images[i];
      const fileName = /\w+\.\w+$/.exec(item)[0];
      tasks.push(wx.cloud.uploadFile({
        cloudPath: `blog/${fileName}`,
        filePath: item,
      }));
    }
    return Promise.all(tasks).then(results=>results.map(result=>result.fileID));
  },

  async send() {
    wx.showLoading({
      title: '发布中...',
    });
    const fileIds = await this.uploadFiles();
    // wx.cloud.
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})