/**
 * Created by haoqian on 17-7-14.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
module.exports = mongoose.model('id', new Schema({
    name:String,
    id:Number
}));