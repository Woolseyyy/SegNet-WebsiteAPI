/**
 * Created by haoqian on 17-7-11.
 */
var path = require('path');
var fs = require('fs');

module.exports = function (name, id, target_path, next) {
    var filePath = path.resolve(__dirname, '../models/'+id+'/TempTestInterface');
    var filename = filePath + '/' + name + '.tig';

    var content = filename + '\t' + filename;

    fs.open(target_path, 'w', function (err, fd) {
        fs.write(fd, content, function (err, written, string) {
            next(err);
        })
    })
};