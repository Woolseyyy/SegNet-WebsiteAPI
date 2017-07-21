/**
 * Created by haoqian on 17-7-11.
 */
var path = require('path');
var fs = require('fs');

module.exports = function (data, label, target_path, next) {


    //replace the content of the input data
    var dataContent = data.replace(/\//g, '\\/');
    var labelContent = label.replace(/\//g, '\\/');
    var exec = require('child_process').exec;
    exec('sed -i \'s/<%=data_path%>/'+dataContent+'/g\' '+target_path,
        function(error, stdout, stderr){
            if(error) {
                next(stderr);
            }
            else{
                exec('sed -i \'s/<%=label_path%>/'+labelContent+'/g\' '+target_path,
                    function(error, stdout, stderr){
                        if(error) {
                            next(stderr);
                        }
                        else{
                            next(null);
                        }
                    }
                );
            }
        }
    );

};