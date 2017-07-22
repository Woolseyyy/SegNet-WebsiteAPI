/**
 * Created by haoqian on 17-7-14.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
module.exports = mongoose.model('model', new Schema({
    pwd:String,
    id:{type:String, unique:true},
    test:{
        ready: {type:Boolean, default:false},
        iter:{type:Number, default:0}
    },
    train:{
        base:{type:Boolean, default:false},
        data:{type:Boolean, default:false},
        label:{type:Boolean, default:false},
        relation:{type:Boolean, default:false},
        pid:{type:Number, default:-1}
    }
}));