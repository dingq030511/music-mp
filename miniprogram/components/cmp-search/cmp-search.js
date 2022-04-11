// components/cmp-search/cmp-search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:{
      type: String,
      value: '请输入关键字'
    }
  },

  externalClasses: [
    'iconfont',
    'icon-sousuo'
  ],

  /**
   * 组件的初始数据
   */
  data: {
    keyword: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(e){
      this.setData({
        keyword: e.detail.value
      });
    },
    onSearch(){
      this.triggerEvent('search', {
        keyword: this.data.keyword
      });
    }
  }
})
