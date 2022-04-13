import formatTime from "../../utils/formatTime";

// pages/blog-comment/blog-comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogId: null,
    blog: null,
    commentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      blogId: options.blogId
    });
    this.getBlogDetail();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },

  async getBlogDetail(){
    wx.showLoading({
      title: '加载中...',
    });
    const res = await wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'detail',
        blogId: this.data.blogId
      }
    }).then(res=>res.result);
    wx.hideLoading();
    this.setData({
      blog: res.blog,
      commentList: res.commentList.map(e=>({
        ...e,
        createTime: formatTime(e.createTime)
      }))
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    const blog = this.data.blog;
    return {
      title: blog.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blog._id}`,
      imageUrl: blog.images[0]
    }
  }
})