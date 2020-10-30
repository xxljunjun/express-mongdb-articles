//子路由书写模板
var express = require('express');
var router = express.Router();
const articleModel =require('../db/articleModel')//导入数据表
const moment =require('moment')//时间戳处理包

/* 首页路由 */
router.get('/',(req,res,next)=>{
  console.log(req.query)
  // 数据类型是number
  let page = parseInt(req.query.page||1);//如果page没有传,默认是第一页
  let size = parseInt(req.query.size||3);//如果size没有传,默认一页显示3条文章
  let username = req.session.username;
  // 第一步:查询文章总数,并计算总页数
  articleModel.find().count().then(total=>{
      // total就是文章的总条数
      // 获取总页数
      var pages = Math.ceil(total/size);
      // 第二步:分页查询
      articleModel.find().sort({'createTime':-1}).skip((page-1)*size).limit(size)
      .then(docs=>{
          // docs不是传统意义的js数组,要使用slice()方法把他转化成js数组
          var arr = docs.slice();
          for(let i=0;i<arr.length;i++){
              // 原有的文档的字段值,不能修改吗?
              // 添加一个新的字段,来表示格式化的时间
              arr[i].createTimeZH = moment(arr[i].createTime).format('YYYY-MM-DD HH:mm:ss')
          };
          res.render('index',{
              data:{
                  list:arr,
                  total:pages,
                  username
              }
          })
      })
      .catch(err=>{
          res.redirect('/')
      })
  })
  
})

/* 注册页路由 */
router.get('/regist', function(req, res, next) {
  res.render('regist', {});
});

/* 登陆页路由 */
router.get('/login', function(req, res, next) {
  res.render('login', {});
});

/* 写文章/编辑文章页路由 */
router.get('/write', function(req, res, next) {
  //只有登录之后index.ejs页面中所传的id才有
  //获取文章id
  // console.log(req.query.id)
  var id = req.query.id
  if(id){
    id= new Object(id)
    articleModel.findById(id)
    .then(doc=>{
      console.log(doc)
      res.render('write',
        {doc,username:req.session.username}
      )
    })
    .catch(err=>{
      res.redirect('/')
    })
  }else{
    //新增
    var doc ={
      _id:'',
      username:req.session.username,
      title:"",
      content:""
    }
    res.render('write',
    {doc,username:req.session.username})
  }
});

/* 详情页路由 */
router.get('/detail', function(req, res, next) {
  var id =req.query.id;
  articleModel.findById(id)
  .then(doc=>{
    doc.createTimeZH =moment(doc.createTime).format('YYYY-MM-DD HH:mm:ss')
    res.render('detail',{
      doc,
      username:req.session.username
    })
  })
  .catch(err=>{
    res.send(err)
  })
});

module.exports = router;
