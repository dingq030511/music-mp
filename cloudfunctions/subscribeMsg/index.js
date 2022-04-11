// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const tempId = 'HLZiPux2sZs_fMWLt9FyVuYR4ZV4n9M_f1iGxGrwspA';

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        "touser": wxContext.OPENID,
        "page": `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
        "lang": 'zh_CN',
        "data": {
          "thing1": {
            "value": event.content
          },
          "thing2": {
            "value": event.comment
          },
          "time3": {
            "value": new Date()
          },
          "thing4": {
            "value": event.nickName
          }
        },
        "templateId": tempId,
        "miniprogramState": 'developer'
      })
    return result
  } catch (err) {
    return err
  }
}