// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const url = 'https://apis.imooc.com/personalized?icode=8A48F9E7227EDF44';
const logger = cloud.logger();
const db = cloud.database();
const playlistCollection = db.collection('playlist');
// const MAX_LIMIT = 100;
// 云函数入口函数
exports.main = async () => {
  const {
    data
  } = await axios.get(url);
  if (data.code >= 1000) {
    logger.error({
      msg: data.msg
    });
  }
  const playlist = data.result;
  let existList = [];
  const countResult = await playlistCollection.count();
  const total = countResult.total;
  // const times = Math.ceil(total / MAX_LIMIT);
  // const tasks = [];
  // for (let i = 0; i < times; i++) {
  //   tasks.push(playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get());
  // }
  // const results = await Promise.all(tasks);
  // existList = results.reduce((acc, cur) => {
  //   return acc.concat(cur.data)
  // }, []);
  existList = (await playlistCollection.limit(total).get()).data;
  const todoAddList = playlist.filter(item => !existList.some(e => e.id === item.id));
  todoAddList.forEach(item => item.createTime = db.serverDate());
  try {
    await playlistCollection.add({
      data: todoAddList
    });
  } catch (e) {
    logger.error({
      error: e
    });
  }
}