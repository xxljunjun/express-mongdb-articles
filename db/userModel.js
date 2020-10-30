//引入模块
const mongoose =require('mongoose');
//集合(表)规则
let usersSchema =mongoose.Schema({
    username:String,
    password:String,
    creatTime:Number
})
//创建数据集合（表）
let userModel =mongoose.model('users',usersSchema);

//导出数据集合
module.exports =userModel