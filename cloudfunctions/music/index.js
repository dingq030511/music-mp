// 云函数入口文件
const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router');
const axios = require('axios');

const BASE_URL = 'https://apis.imooc.com';
const ICODE = 'icode=DD6292E141DCEEA1';

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const playlistCollection = db.collection('playlist');
const logger = cloud.logger();
// 云函数入口函数
exports.main = async (event) => {
  const app = new TcbRouter({event});
  app.router('playlist', async (ctx)=>{
    const countResult = await playlistCollection.count();
    const count = countResult.total;
    const res = await playlistCollection.skip(event.start).limit(event.pageSize).orderBy('createTime', 'desc').get();
    ctx.body = {
      list: res.data,
      count
    }
  });

  app.router('musiclist',async (ctx)=>{
    const res = await axios.get(`${BASE_URL}/playlist/detail?id=${event.id}&${ICODE}`);
    ctx.body = res.data;
  });

  app.router('musicUrl',async (ctx)=>{
    const res = await axios.get(`${BASE_URL}/song/url?id=${event.id}&${ICODE}`);
    ctx.body = res.data;
  });

  app.router('lyric',async (ctx)=>{
    const res = await axios.get(`${BASE_URL}/lyric?id=${event.id}&${ICODE}`);
    ctx.body = res.data;
  });
  
  return app.serve();
}