var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
let articleModel =require('../db/articleModel');//创建article数据集合
// const { findById } = require('../db/articleModel');
var multiparty = require('multiparty');//处理文件上传

/* 
文章修改和新增接口
    + 业务接口说明:文章修改和新增业务,登陆后才能访问
    + 请求方式:post请求
    + 入参:title,content,username,id
    + 返回值:重定向,有id是修改业务,无id是新增业务,成功重定向/,失败重定向/write
*/
router.post('/write',function(req,res,next){
  //接收post数据
  let {title,content,username,id} =req.body;
  let createTime =Date.now();
  if(id){
    //修改文章
    id = new Object(id);
    articleModel.updateOne({_id:id},{
      title,
      content,
      createTime,
      username
    }).then(data=>{
      // res.send('文章修改成功');
      res.redirect('/')
    }).catch(err=>{
      res.redirect('/write')
      // res.send('文章修改失败');
    })
  }else{
    //新增文章
    //插入数据库（只有登入之后才能）
    let username =req.session.username;
    articleModel.insertMany({
      title,
      content,
      createTime,
      username
    }).then(data=>{
      // res.send('文章写入成功')
      res.redirect('/')
    })
    .catch(err=>{
      // res.send('文章写入失败')
      res.redirect('/write')
    })
  }
});

/* 
文章删除接口
    + 业务接口说明:文章删除业务
    + 请求方式:get请求
    + 入参:id
    + 返回值:失败成功都重定向到/
*/
router.get('/delete',(req,res,next)=>{
  //获取数据id
  let id =req.query.id;
  id = new Object(id);
  //去数据库删除id这个文章
  articleModel.deleteOne({_id:id})
  .then(data=>{
      // res.send('文章删除成功');
      res.redirect('/')
  })
  .catch(err=>{
      // res.send('文章删除失败')
      res.redirect('/')
  })
})

/* 
图片上传接口
    + 业务接口说明:图片上传业务
    + 请求方式:post请求
    + 入参:file,使用的富文本编辑插件xheditor里面上次图片的文件有的name是filedata
    + 返回值:json格式,例如:{err:0,msg:'图片路径'}
*/
router.post('/upload',(req,res,next)=>{
  // 每次访问该接口,都新建一个form对象来解析文件数据
  var form =new multiparty.Form();
  form.parse(req,(err,field,files)=>{
    if(err){
      console.log('文件上传失败')
    }else{
      // console.log(field)
      var  file =files.filedata[0];
      // console.log(file)
      //读取流
      var read =fs.createReadStream(file.path);//打印file会看到file.path暂时路径
      //写入流
      var write =fs.createWriteStream(path.join(__dirname,"..","public/imgs/",file.originalFilename))//打印file会看到file.originalFilename
      //管道流，图片写入指定目录
      read.pipe(write);
      //监听写入事件
      write.on('close',function(){
        // console.log('图片上传完成')
        //图片上传完成返回前端的数据
        //返回的格式是multiparty要求的
        res.send({
          err:0,
          msg:'/imgs/'+file.originalFilename
        })
      })
    }
  })
})

module.exports = router;