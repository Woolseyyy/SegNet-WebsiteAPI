/**
 * Created by haoqian on 17-7-14.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
module.exports = mongoose.model('model', new Schema({
    password:String,
    test:Boolean,
    train:{
        data:Boolean,
        lable:Boolean,
        traintxt:Boolean
    }
}));