/**
 * Created by haoqian on 17-7-11.
 */
var path = require('path');
var fs = require('fs');

module.exports = function (id, next) {
    var trainPath = path.resolve(__dirname, '../models')+'/'+id+'/train';
    var target_path = trainPath+'/train.prototxt';

    //copy the template to target path
    var templatePath = path.resolve(__dirname, '../res/train_template.prototxt');
    var read = fs.createReadStream(templatePath);
    var write = fs.createWriteStream(target_path);
    read.pipe(write);
    write.on('close', function () {

       //replace the content of the template
        var train_txt_path = trainPath + '/train.txt';
        train_txt_path = train_txt_path.replace(/\//g, '\\/');

        var exec = require('child_process').exec;
        exec('sed -i \'s/<%=train_txt%>/'+train_txt_path+'/g\' '+target_path,
            function(error, stdout, stderr){
                if(error) {
                    next(stderr);
                }
                else{
                    next(null);
                }
            }
        );
    });
};