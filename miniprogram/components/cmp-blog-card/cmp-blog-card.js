import formatTime from '../../utils/formatTime';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: {
      type: Object,
      value: {
        
      }
    },
  },

  observers: {
    'blog.createTime'(val){
      if(val){
        this.setData({
          createTime: formatTime(val)
        });
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    createTime: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    previewImg(e){
      const dataset = e.currentTarget.dataset;
      wx.previewImage({
        urls: this.properties.blog.images,
        current: dataset.img
      })
    }
  }
})
