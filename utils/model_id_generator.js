var Id = require('../db/id.js');

module.exports = function (next) {
    Id.findOne({name:'model'}, function (err, id) {
        id.id ++;
        id.save(function (err, id) {
            next(id.id);
        })
    })
};