// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false,
    userInfo: null,
    blogList: [],
    total: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBlogList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo
      });
    }
  },

  onModalClose() {
    this.setData({
      modalShow: false,
    });
  },

  async onPublish() {
    if (this.data.userInfo) {
      this.toBlogEditPage();
    } else {
      this.setData({
        modalShow: true,
      });
    }
  },

  async getBlogList(keyword = '') {
    wx.showLoading({
      title: '加载中...',
    });
    const res = await wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'blogList',
        start: this.data.blogList.length,
        pageSize: 10,
        keyword
      }
    });
    this.setData({
      blogList: this.data.blogList.concat(res.result.list),
      total: res.result.count
    });
    wx.hideLoading();
  },

  toBlogEditPage() {
    wx.navigateTo({
      url: '/pages/blog-edit/blog-edit',
      events: {
        publish:()=>{
          this.onPullDownRefresh();
        }
      }
    })
  },

  goComment(e) {
    const dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/blog-comment/blog-comment?blogId=${dataset.blogId}`,
    });
  },

  onSearch(e){
    this.setData({
      total: 0,
      blogList: [],
    });
    this.getBlogList(e.detail.keyword);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    this.setData({
      total: 0,
      blogList: [],
    });
    await this.getBlogList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.total !== 0 && this.data.blogList.length >= this.data.total) {
      return;
    }
    this.getBlogList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    const blog = e.target.dataset.blog;
    return {
      title: blog.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blog._id}`,
      imageUrl: blog.images[0]
    }
  }
})