var express = require('express');
var router = express.Router();
const userModel =require('../db/userModel');
const bcrypt =require('bcrypt');

/* 
注册接口
    + 业务接口说明:注册业务
    + 请求方式:post请求
    + 入参:username,password,password2
    + 返回值:重定向,注册成功重定向到/login,失败重定向到/regist
*/
router.post('/regist', function(req, res, next) {
  //接收post数据(结构赋值),通过前端请求体传递数据
  let {username,password,password2} = req.body;
  /* let username =req.body.username
  let password =req.body.password
  let password2 =req.body.password2 */
  //数据校验工作，在这里完成
  //查询是否存在这个用户

  //密码不直接存入数据，先加密，再存入数据库
    password = bcrypt.hashSync(password,10)

  userModel.find({username}).then(docs=>{
    if(docs.length>0){
      // res.send('用户已存在')这里的regist是rejist.ejs
      res.redirect('/regist')
    }else{
      //用户不存在，开始注册
      let createTime =Date.now();
      //插入数据
      userModel.insertMany({
        username,
        password,
        createTime
      }).then(docs=>{
        // res.send('注册成功')
        res.redirect('/login')
      }).catch(err=>{
        // res.send('注册失败')
        res.redirect('/regist')
      })
    }
  })
});

/* 
登录接口
    + 业务接口说明:注册业务
    + 请求方式:post请求
    + 入参:username,password
    + 返回值:重定向,注册成功重定向到/,失败重定向到/login
*/
router.post('/login',(req,res,next)=>{
  //接收post数据
  let {username,password} =req.body;
  //查询数据
  userModel.find({username})
  .then(docs=>{
    if(docs.length>0){
      //判断这个结果是否为true
      var result =bcrypt.compareSync(password,docs[0].password)
      if(result){
        // res.send('用户登陆成功')
        //登陆成功后，在服务端使用session记录用户信息
        req.session.username =username;
        req.session.isLogin =true;
        res.redirect('/') 
      }else{
        // res.send('密码错误')
        res.redirect('/login')
      }
    }else{
      res.redirect('/login') 
      // res.send('用户名不存在')
    }
  })
  .catch(function(){
    // res.send('登陆失败')
    res.redirect('/login')
  })
})

/* 
退出登陆接口
    + 业务接口说明:退出登陆业务
    + 请求方式:get请求
    + 入参:无
    + 返回值:重定向到/login
*/
router.get('/logout',(req,res,next)=>{
      //清除session设置
      req.session.username =null;
      req.session.isLogin =false;
      res.redirect('/login')
})


module.exports = router;
