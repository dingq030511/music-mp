// 云函数入口文件
const cloud = require('wx-server-sdk');

const TcbRouter = require('tcb-router');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();

const blogCollection = db.collection('blog');
const blogCommentCollection = db.collection('blog-comment');
const logger = cloud.logger();

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  });

  app.router('blogList', async (ctx, next) => {
    const keyword = event.keyword && event.keyword.trim();
    let w = {};
    if (keyword) {
      w = {
        content: db.RegExp({
          regexp: keyword,
          options: 'i'
        }),
      }
    }
    const blogListResult = blogCollection.where(w).skip(event.start).limit(event.pageSize).orderBy('createTime', 'desc').get();
    const countResult = blogCollection.count();
    const result = await Promise.all([blogListResult, countResult]);
    ctx.body = {
      list: result[0].data,
      count: result[1].total
    };
  })

  app.router('commentBlog', async (ctx, next) => {
    ctx.body = await blogCommentCollection.add({
      data: {
        content: event.content,
        blogId: event.blogId,
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        createTime: db.serverDate(),
        _openid: cloud.getWXContext().OPENID
      }
    });
  });

  app.router('detail', async (ctx, next)=>{
    const blogId = event.blogId;
    const list = await blogCollection.where({
      _id: blogId
    }).get().then(res=>res.data);
    if(!list || list.length === 0){
      ctx.body = {
        message: '未查到该博客',
      }
      return;
    }
    const blogItem = list[0]
    const commentCount = await blogCommentCollection.count().then(res=>res.total);
    const commnetRes = await blogCommentCollection.limit(commentCount).get();
    const detail = {
      blog: blogItem,
      commentList: commnetRes.data
    };
    ctx.body = detail;
  });

  return app.serve();
}