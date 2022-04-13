// components/cmp-login-modal/cmp-login-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCloseModal(){
      this.triggerEvent('close');
    },
    async onGetUserInfo(){
      try {
        const res = await wx.getUserProfile({
          desc: '获取用户头像和昵称',
        })
        console.log(res);
        if(res.userInfo){
          this.triggerEvent('getuserinfosuccess', res.userInfo);
          wx.setStorageSync('userInfo', res.userInfo);
        } else {
          this.triggerEvent('getuserinfofail', res);
        }
      } catch(e){
        console.log(e);
        this.triggerEvent('getuserinfofail', e);
      }
      this.onCloseModal();
    }
  }
})
