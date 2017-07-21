/**
 * Created by haoqian on 17-7-11.
 */
var path = require('path');
var fs = require('fs');

module.exports = function (id, next) {
    var trainPath = path.resolve(__dirname, '../models')+'/'+id+'/train';
    var target_path = trainPath+'/solver.prototxt';

    //copy the template to target path
    var templatePath = path.resolve(__dirname, '../res/solver_template.prototxt');
    var read = fs.createReadStream(templatePath);
    var write = fs.createWriteStream(target_path);
    read.pipe(write);
    write.on('close', function () {

       //replace the content of the template
        var train_prototxt_path = trainPath + '/train.prototxt';
        var result_dir_path = trainPath + '/result/result';
        train_prototxt_path = train_prototxt_path.replace(/\//g, '\\/');
        result_dir_path = result_dir_path.replace(/\//g, '\\/');

        var exec = require('child_process').exec;
        exec('sed -i \'s/<%=train_prototxt%>/'+train_prototxt_path+'/g\' '+target_path
            + ' ; sed -i \'s/<%=result_dir%>/'+result_dir_path+'/g\' '+target_path,
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