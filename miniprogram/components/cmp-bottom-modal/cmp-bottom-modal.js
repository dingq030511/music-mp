// components/cmp-bottom-modal/cmp-bottom-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  options: {
    styleIsolation: 'apply-shared',
    multipleSlots: true,
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
    closeModal(){
      this.triggerEvent('close');
    }
  }
})
