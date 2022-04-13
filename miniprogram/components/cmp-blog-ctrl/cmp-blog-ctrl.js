const tempId = 'HLZiPux2sZs_fMWLt9FyVuYR4ZV4n9M_f1iGxGrwspA';
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blogContent: String,
    blog: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false,
    userInfo: null,
    commentShow: false,
    content: '',
  },

  lifetimes: {
    attached(){
      this.getUserInfo();
    },
    
  },

  pageLifetimes: {
    onShow(){
      this.getUserInfo();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    getUserInfo(){
      const userInfo = wx.getStorageSync('userInfo');
      if(userInfo){
        this.setData({
          userInfo
        });
      }
    },
  
    async comment(){
      // const subRes =  await this.subscribeMsg();
      // if(!subRes){
      //   return wx.showToast({
      //     title: '请先订阅消息再进行评论',
      //     icon: 'none'
      //   })
      // }
      if(!this.data.userInfo){
        this.setData({
          loginShow: true
        });
      } else {
        this.showCommentModal();
      }
    },

    async subscribeMsg(){
      const res = await wx.requestSubscribeMessage({
        tmplIds: [tempId],
      });
      if(res[tempId] === 'accept'){
        return true;
      }
      return false;
    },

    showCommentModal(){
      this.setData({
        commentShow: true
      });
    },
    onGetUserInfoSuccess(e){
      this.setData({
        userInfo: e.detail
      });
      this.showCommentModal();
    },
    closeModal(){
      this.setData({
        loginShow: false
      });
    },
    onGetUserInfoFail(){
      wx.showModal({
        content: '只有授权用户才能进行评论',
        showCancel: false
      });
    },
    closeCommentModal(){
      this.setData({
        commentShow: false
      });
    },
    onInput(e){
      this.setData({
        content: e.detail.value
      });
    },
    async onSend(){
      if(!this.data.content.trim()){
        wx.showModal({
          content: '评论内容不能为空',
          showCancel: false,
        });
        return;
      }
      wx.showLoading({
        title: '评论发表中...',
        mask: true
      });
      await wx.cloud.callFunction({
        name: 'blog',
        data: {
          $url: 'commentBlog',
          content: this.data.content,
          blogId: this.properties.blogId,
          nickName: this.data.userInfo.nickName,
          avatarUrl: this.data.userInfo.avatarUrl,
        }
      });
      wx.hideLoading();
      wx.cloud.callFunction({
        name: 'subscribeMsg',
        data: {
          content: this.properties.blogContent,
          comment: this.data.content,
          nickName: this.data.userInfo.nickName
        }
      });
      wx.showToast({
        title: '评论成功',
        icon: 'success'
      });
      this.setData({
        commentShow: false,
      });
      this.triggerEvent('commentsuccess');
    }
  }
})
