// pages/profile-bloghistory/profile-bloghistory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList: [],
    total: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBlogList();
  },

  async getBlogList(){
    const res = await wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'getListByOpenId',
        start: this.data.blogList.length,
        pageSize: 10
      }
    }).then(res=>res.result);
    this.setData({
      blogList: this.data.blogList.concat(res.list),
      total: res.total
    });
  },

  goComment(e){
    const dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/blog-comment/blog-comment?blogId=${dataset.blogId}`,
    });
  },

  onReachBottom(){
    if (this.data.total !== 0 && this.data.blogList.length >= this.data.total) {
      return;
    }
    this.getBlogList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})