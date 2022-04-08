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
    onGetUserInfo(e){
      if(e.detail.userInfo){
        this.triggerEvent('getuserinfosuccess', e.detail.userInfo);
        wx.setStorageSync('userInfo', e.detail.userInfo);
      } else {
        this.triggerEvent('getuserinfofail', e.detail.errMsg);
      }
      this.onCloseModal();
    }
  }
})
