//引入模块
const mongoose =require('mongoose');
//创建集合（表）规则Schema提要，纲要
let articleSchema = mongoose.Schema({
    title:String,
    content:String,
    createTime:Number,
    username:String
})

//创建数据集合（表）
let articleModel = mongoose.model('articles',articleSchema)

//导出数据集合
module.exports = articleModel;