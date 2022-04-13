// components/cmp-lyric/cmp-lyric.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidden: {
      type: Boolean,
      value: true
    },
    lyric: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lyrics: [],
    hightlightIndex: -1,
    scrollTop: '0rpx'
  },

  observers: {
    lyric(lrc) {
      if (!lrc) {
        return;
      }
      this.setData({
        lyrics: this.parseLyric(lrc)
      });
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    parseLyric(str) {
      if (str === '暂无歌词') {
        return [{
          time: 0,
          lyric: '暂无歌词'
        }];
      }
      const arr = str.split('\n');
      const reg = /\[(.+)\]/;
      return arr.filter(e => e).map(line => {
        reg.lastIndex = -1;
        const matches = line.match(/\[(.+)\]/);
        if(!matches){
          return {
            time: 0,
            lyric: line
          }
        }
        const time = this.parseTime(matches[1]);
        const lyric = line.replace(reg, '');
        return {
          time,
          lyric
        }
      });
    },
    parseTime(str) {
      const matchs = str.match(/(\d{2,}):(\d{2})\.(\d{2,3})?/);
      const [, m, s, ms] = matchs;
      return m * 60 + parseInt(s) + ms / 1000;
    },
    update(time) {
      const len = this.data.lyrics.length;
      if (len === 0) {
        return;
      }
      for (let i = 0; i < len; i++) {
        const item = this.data.lyrics[i];
        if (i < len - 1 && item.time <= time && this.data.lyrics[i + 1].time > time || i === len - 1 && item.time <= time) {
          if (i !== this.data.hightlightIndex) {
            this.setData({
              hightlightIndex: i,
              scrollTop: i * 64 + 'rpx'
            });
          }
          break;
        }
      }
    }
  }
})