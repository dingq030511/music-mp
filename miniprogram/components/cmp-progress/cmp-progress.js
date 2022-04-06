const backgroundAudioManager = wx.getBackgroundAudioManager();
Component({
  options: {
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isSameSong: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentTime: '00:00',
    totalTime: '00:00',
    moveDis: 0,
    percent: 0,
    _movableAreaWidth: 0,
    _movableViewWidth: 0,
    _currentSec: 0,
    _tempX: 0,
    _isMoving: false
  },

  lifetimes: {
    ready(){
      this.getMovableDis();
      this.bindBgAudioEvent();
      if(this.properties.isSameSong && this.data.totalTime === '00:00'){
        this.setTime();
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getMovableDis(){
      const query = this.createSelectorQuery();
      query.select('.movable-area').boundingClientRect();
      query.select('.progress-track').boundingClientRect();
      query.exec((res)=>{
        this.setData({
          _movableAreaWidth: res[0].width,
          _movableViewWidth: res[1].width
        });
      });
    },
    bindBgAudioEvent(){
      backgroundAudioManager.onCanplay(()=>{
        wx.hideLoading();
        if(backgroundAudioManager.duration !== undefined){
          this.setTime();
        } else {
          setTimeout(()=>{
            this.setTime();
          },1000);
        }
      });
      backgroundAudioManager.onTimeUpdate(()=>{
        const currentTime = backgroundAudioManager.currentTime;
        this.triggerEvent('timeupdate', currentTime);
        if(this.data._currentSec === Math.floor(currentTime)){
          return;
        }
        const duration = backgroundAudioManager.duration;
        const movableAreaWidth = this.data._movableAreaWidth;
        const movableViewwidth = this.data._movableViewWidth;
        const ratio = currentTime / duration;
        const percent = ratio * 100;
        const moveDis = (movableAreaWidth - movableViewwidth) * ratio;
        const updateObj = {
          currentTime: this.formatTime(currentTime),
          percent,
          _currentSec: Math.floor(currentTime)
        }
        if(!this.data._isMoving){
          updateObj.moveDis = moveDis;
        }
        this.setData(updateObj);
      });
      backgroundAudioManager.onError((err)=>{
        wx.showToast({
          title: err.errMsg,
        })
      });
    },
    setTime(){
      const duration = backgroundAudioManager.duration;
      const totalTime = this.formatTime(duration);
      this.setData({
        totalTime
      });
    },
    formatTime(seconds){
      const min = this.fillZero(Math.floor(seconds/60));
      const sec = this.fillZero(Math.floor(seconds % 60));
      return `${min}:${sec}`
    },
    fillZero(num){
      if( num < 10){
        return '0'+ num;
      }
      return num;
    },
    onChange(e){
      if(e.detail.source){
        this.setData({
          _tempX: e.detail.x
        });
      }
    },
    onMoveStart(){
      this.setData({
        _isMoving: true
      });
    },
    onMoveEnd(){
      const x = this.data._tempX;
      const ratio = x / (this.data._movableAreaWidth - this.data._movableViewWidth);
      const percent = ratio * 100;
      const moveDis = x;
      const currentTime = ratio * backgroundAudioManager.duration;
      this.setData({
        _isMoving: false,
        percent,
        moveDis,
        currentTime: this.formatTime(currentTime)
      });
      backgroundAudioManager.seek(currentTime);
    }
  }
})
