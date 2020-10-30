//引入模块
const mongoose =require('mongoose');
//连接数据库
mongoose.connect('mongodb://localhost/project',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db =mongoose.connection;


//显示数据库的状态
db.on('error',function(){
    console.log('数据库连接错误')
})
db.once('open',function(){
    console.log("数据库连接成功")
})



