/**
 * Created by haoqian on 17-7-11.
 */
var path = require('path');
var fs = require('fs');

module.exports = function (name, id, target_path, next) {
    var filePath = path.resolve(__dirname, '../models/'+id+'/TempTestInterface');
    var filename = filePath + '/' + name + '.txt';

    //copy the template to target path
    var templatePath = path.resolve(__dirname, '../res/interface_template.prototxt');
    var read = fs.createReadStream(templatePath);
    var write = fs.createWriteStream(target_path);
    read.pipe(write);
    write.on('close', function () {
       //replace the content of the template
        var content = filename.replace(/\//g, '\\/');
        var exec = require('child_process').exec;
        exec('sed -i \'s/<%=test_data_source%>/'+content+'/g\' '+target_path,
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