var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var multiparty = require('multiparty');

var prototxtFactory = require('../utils/interface_prototxt_factory.js');
var txtFactory = require('../utils/test_text_factory.js');
var train_txt_modify = require('../utils/train_txt_modify.js');
var solver_prototxt_factory = require('../utils/solver_prototxt_factory.js');
var train_prototxt_factory = require('../utils/train_prototxt_factory.js');
var model_id_generator = require('../utils/model_id_generator.js');
var config = require('../utils/config.js');

var Model = require('../db/Model.js');

var temp = path.resolve(__dirname, '../temp');

var TrainingTask = require('../utils/class_TrainingTask.js');
TrainingTask.run();

/* post the test image*/
router.post('/test', function(req, res, next){

    var form = new multiparty.Form({uploadDir: temp});
    form.parse(req, function (err, fields, files) {
        var id = fields['id'][0];
        if(id===null){id = 0;}
        
        //check if it is tested ready
        Model.findOne({id:id}, function (err, model) {
            if(model === null){
                res.json({
                    code:404,
                    msg:'id error'
                })
            }
            else if(model.test.ready){
                var name = new Date().getTime().toString() + Math.ceil(Math.random()*1000).toString();
                var filePath = path.resolve(__dirname, '../models/'+id);

                //change the temp images' name to name.tif
                if(err){
                    console.log('parse error: ' + err);
                } else {
                    var rename = function(i, length, next){
                        if(i<length){
                            var inputFile = files.files[i];
                            var uploadedPath = inputFile.path;
                            var dstPath = filePath+'/TempTestInterface/'+name+i+'.tig';
                            fs.rename(uploadedPath, dstPath, function(err) {
                                if(err){
                                    console.log('rename error: ' + err);
                                    next(err);
                                } else {
                                    console.log('rename ok');
                                    rename(i+1, length, next);
                                }
                            });
                        }
                        else{
                            next(null);
                        }
                    };
                    rename(0, files.files.length, function (err) {
                        if(err){
                            //todo handle error
                        }
                        else{
                            //create specific name.txt and name.prototxt
                            var txtPath = filePath+'/TempTestInterface/'+name+'.txt';
                            txtFactory(name, id, txtPath, files.files.length, function(err) {
                                if(err){
                                    console.log('rename error: ' + err);
                                } else {
                                    console.log('rename ok');

                                    //create specific name.txt and name.prototxt
                                    var txtPath = filePath+'/TempTestInterface/'+name+'.txt';
                                    txtFactory(name, id, txtPath, function (err) {
                                        if(err){
                                            console.log('error when write' + name + '.txt!\n' + err);
                                        }
                                        else{
                                            var prototxtPath = filePath+'/TempTestInterface/'+name+'.prototxt';
                                            prototxtFactory(name, id, prototxtPath, function (err) {
                                                if(err){
                                                    console.log('error when write' + name + '.prototxt!\n' + err);
                                                }
                                                else{
                                                    //check if every thing is ok (especially check if all the files exit
                                                    //todo

                                                    //start test
                                                    var scritpPath = config.TestScritpPath;
                                                    var exec = require('child_process').exec;
                                                    var weightsPath = filePath+'/test_weights.caffemodel';
                                                    var num = 1;
                                                    exec('python '+ scritpPath + ' --model ' + prototxtPath + ' --weights ' + weightsPath + ' --iter '+ model.test.iter,
                                                        function(error, stdout, stderr){
                                                            if(stdout==='ok'){
                                                                //todo send image
                                                            } else {
                                                                //todo send error
                                                            }
                                                            if(error) {
                                                                console.info('stderr : '+stderr);
                                                                //todo send error
                                                            }
                                                        }
                                                    );

                                                }

                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                    /*
                    var inputFile = files.files[0];
                    var uploadedPath = inputFile.path;
                    var dstPath = filePath+'/TempTestInterface/'+name+'.tig';
                    fs.rename(uploadedPath, dstPath, function(err) {
                        if(err){
                            console.log('rename error: ' + err);
                        } else {
                            console.log('rename ok');

                            //create specific name.txt and name.prototxt
                            var txtPath = filePath+'/TempTestInterface/'+name+'.txt';
                            txtFactory(name, id, txtPath, function (err) {
                                if(err){
                                    console.log('error when write' + name + '.txt!\n' + err);
                                }
                                else{
                                    var prototxtPath = filePath+'/TempTestInterface/'+name+'.prototxt';
                                    prototxtFactory(name, id, prototxtPath, function (err) {
                                        if(err){
                                            console.log('error when write' + name + '.prototxt!\n' + err);
                                        }
                                        else{
                                            //check if every thing is ok (especially check if all the files exit
                                            //todo

                                            //start test
                                            var scritpPath = config.TestScritpPath;
                                            var exec = require('child_process').exec;
                                            var weightsPath = filePath+'/test_weights.caffemodel';
                                            var num = 1;
                                            exec('python '+ scritpPath + ' --model ' + prototxtPath + ' --weights ' + weightsPath + ' --iter '+ model.test.iter,
                                                function(error, stdout, stderr){
                                                    if(stdout==='ok'){
                                                        //todo send image
                                                    } else {
                                                        //todo send error
                                                    }
                                                    if(error) {
                                                        console.info('stderr : '+stderr);
                                                        //todo send error
                                                    }
                                                }
                                            );

                                        }

                                    });
                                }
                            });
                        }
                    });
                    */
                }
            }
            else{
                res.json({
                    code:412,
                    msg:'The model cann`t be used to test yet.'
                })
            }
        });

    });

});

/* create a new models */
router.post('/train/create', function (req, res, next) {
    //todo authorization

    var pwd = req.body.pwd;

    //create model in database
    model_id_generator(function (id) {
        var train = {
            base: true,
            data:false,
            label:false,
            relation:false,
            pid:-1
        };
        Model.create({id:id, pwd:pwd, train:train}, function (err, model) {
            if(err){
                //todo handle error
            }
            else{
                //create directory
                var rootPath = path.resolve(__dirname, '../models');
                var modelPath = rootPath+'/'+id;
                fs.mkdir(modelPath, function (err) {
                    if(err){
                        //todo handle err
                        console.error("error when create train model directory! "+ err);
                    }
                    else{
                        fs.mkdir(modelPath+'/TempTestInterface', function (err) {
                            if(err){
                                //todo handle err
                                console.error("error when create train model directory! "+ err);
                            }
                            else{
                                fs.mkdir(modelPath+'/TempTestResult', function (err) {
                                    if(err){
                                        //todo handle err
                                        console.error("error when create train model directory! "+ err);
                                    }
                                    else {
                                        //create train directory
                                        fs.mkdir(modelPath+'/train', function (err) {
                                            if(err){
                                                //todo handle err
                                            }
                                            else{
                                                fs.mkdir(modelPath+'/train/data', function (err) {
                                                    if(err){
                                                        //todo handle err
                                                    }
                                                    else{
                                                        fs.mkdir(modelPath+'/train/label', function (err) {
                                                            if(err){
                                                                //todo handle err
                                                            }
                                                            else{
                                                                fs.mkdir(modelPath+'/train/result', function (err) {
                                                                    if(err){
                                                                        //todo handle err
                                                                    }
                                                                    else{
                                                                        solver_prototxt_factory(id, function (err) {
                                                                            if(err){
                                                                                //todo handle err
                                                                            }
                                                                            else{
                                                                                train_prototxt_factory(id, function (err) {
                                                                                    if(err){
                                                                                        //todo handle err
                                                                                    }
                                                                                    else{
                                                                                        //todo send success
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        });
    });

});

//upload train data, label, train.txt
/* upload train data */
router.post('/train/prepare/data', function (req, res, next) {
    //todo authorization

    var form = new multiparty.Form({uploadDir:temp});
    form.parse(req, function(err, fields, files) {
        var id = fields['id'][0];
        var pwd = fields['pwd'][0];

        //find the model and check pwd
        Model.findOne({id:id, pwd:pwd}, function (err, model) {
            if(err){
                //todo handle err
            }
            else if(model===null){
                //todo handle error id or pwd
            }
            else if(!model.train.base){
                //todo handle not train prepared
            }
            else{
                var trainPath = path.resolve(__dirname, '../models/'+id+'/train');

                if(err){
                    console.log('parse error: ' + err);
                    //todo handle error
                } else {
                    var rename = function(i, length, next){
                        if(i<length){
                            var inputFile = files.files[i];
                            var uploadedPath = inputFile.path;
                            var dstPath = trainPath+'/data/' + inputFile.originalFilename;
                            fs.rename(uploadedPath, dstPath, function(err) {
                                if(err){
                                    console.log('rename error: ' + err);
                                    next(err);
                                } else {
                                    console.log('rename ok');
                                    rename(i+1, length, next);
                                }
                            });
                        }
                        else{
                            next(null);
                        }
                    };

                    rename(0, files.files.length, function (err) {
                        if(err){
                            //todo handle error
                        }
                        else{
                            //update the state
                            model.train.data = true;
                            model.save(function (err, model) {
                                if(err){
                                    //todo handle error
                                }
                                else{
                                    //todo send success response
                                }
                            })
                        }
                    })
                }
            }
        });

    });
});

/* upload labels */
router.post('/train/prepare/label', function (req, res, next) {

     //todo authorization

    var form = new multiparty.Form({uploadDir:temp});
    form.parse(req, function(err, fields, files) {
        var id = fields['id'][0];
        var pwd = fields['pwd'][0];

        //find the model and check pwd
        Model.findOne({id:id, pwd:pwd}, function (err, model) {
            if (err) {
                //todo handle err
            }
            else if (model === null) {
                //todo handle error id or pwd
            }
            else if (!model.train.base) {
                //todo handle not train prepared
            }
            else {
                var trainPath = path.resolve(__dirname, '../models/'+id+'/train');

                if(err){
                    console.log('parse error: ' + err);
                    //todo handle error
                } else {
                    var rename = function(i, length, next){
                        if(i<length){
                            var inputFile = files.files[i];
                            var uploadedPath = inputFile.path;
                            var dstPath = trainPath+'/label/' + inputFile.originalFilename;
                            fs.rename(uploadedPath, dstPath, function(err) {
                                if(err){
                                    console.log('rename error: ' + err);
                                    next(err);
                                } else {
                                    console.log('rename ok');
                                    rename(i+1, length, next);
                                }
                            });
                        }
                        else{
                            next(null);
                        }
                    };

                    rename(0, files.files.length, function (err) {
                        if(err){
                            //todo handle error
                        }
                        else{
                            //update the state
                            model.train.label = true;
                            model.save(function (err, model) {
                                if(err){
                                    //todo handle error
                                }
                                else{
                                    //todo send success response
                                }
                            })
                        }
                    })
                }
            }
        });
    });
});

/* upload train train.txt */
router.post('/train/prepare/relation', function (req, res, next) {

    //todo authorization

    var form = new multiparty.Form({uploadDir: temp});
    form.parse(req, function(err, fields, files) {
        var id = fields['id'][0];
        var pwd = fields['pwd'][0];

        //find the model and check pwd
        Model.findOne({id:id, pwd:pwd}, function (err, model) {
            if (err) {
                //todo handle err
            }
            else if (model === null) {
                //todo handle error id or pwd
            }
            else if (!model.train.base) {
                //todo handle not train prepared
            }
            else {
                var trainPath = path.resolve(__dirname, '../models/'+id+'/train');

                if(err){
                    console.log('parse error: ' + err);
                    //todo handle error
                } else {

                    var inputFile = files.files[0];
                    var uploadedPath = inputFile.path;
                    var dstPath = trainPath+'/train.txt';
                    fs.rename(uploadedPath, dstPath, function(err) {
                        if(err){
                            console.log('rename error: ' + err);
                            //todo handle error
                        } else {
                            var data = trainPath + '/data';
                            var label = trainPath + '/label';
                            train_txt_modify(data, label, dstPath, function (err) {
                                if(err){
                                    //todo handle error
                                }
                                else{
                                    //update the state
                                    model.train.relation = true;
                                    model.save(function (err, model) {
                                        if(err){
                                            //todo handle error
                                        }
                                        else{
                                            //todo send success response
                                        }
                                    })
                                }
                            })
                        }
                    });
                }
            }
        });
    });
});

/* start training */
router.post('/train/run', function(req, res, next){
    //todo authorization

    var id = req.body.id;
    var pwd = req.body.pwd;

    Model.findOne({id:id, pwd:pwd}, function (err, model) {
        if(err){
            //todo handle error
        }
        else if(model.train.data && model.train.label && model.train.relation){
            //check if running
            if(model.train.pid===-1){
                TrainingTask.add(id);
                //todo response
            }
            else if(model.train.pid === 0){
                res.json({
                    code:204,
                    msg:'The training task has been put into queue!'
                })
            }
            else if(model.train.pid > 0){
                res.json({
                    code:204,
                    msg:'The training task has been running!'
                })
            }
        }
        else {
            res.json({
                code:412,
                msg:'Missing pre conditions',
                train:model.train
            })
        }
    })

});

/*get the training procedure*/
router.post('/train/procedure', function (req, res, next) {
    var id = req.body.id;
    var range = req.body['range[]'];

    //todo authorization

    //return procedure of the page
    if(range[0] && range[1] && range[1]>range[0]){
        range[0] = Math.floor(range[0] / 20)*20;
        range[1] = Math.ceil(range[1] / 20)*20;

        var filePath = path.resolve(__dirname, '../models') + '/' + id + '/train/trainingProcedure.txt';
        var exec = require('child_process').exec;
        if(range[0]>=0){
            exec('grep \'Iteration ' +range[0]+', loss = \' -n '+filePath,
                function(error, stdout, stderr){
                    if(error) {
                        console.info('stderr : '+stderr);
                        //send error
                        //todo
                    }
                    else if (stdout.length>0){
                        var begin = stdout.split(':')[0];
                        if(range[1]>0 && range[1]>range[0]){
                            exec('grep \'Iteration ' +range[1]+', lr = \' -n '+filePath,
                                function(error, stdout, stderr){
                                    if(error) {
                                        console.info('stderr : '+stderr);
                                        //send error
                                        //todo
                                    }
                                    else if (stdout.length>0){
                                        var end = stdout.split(':')[0];
                                        exec('sed -n \''+begin+', '+end+'p\' '+filePath,
                                            function(error, stdout, stderr){
                                                if(error) {
                                                    console.info('stderr : '+stderr);
                                                    //send error
                                                    //todo
                                                }
                                                else if (stdout.length>0){
                                                    //send result
                                                    res.json({
                                                        result:stdout
                                                    })
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                        else if(range[1]===-1){
                            exec('more +'+begin+' '+filePath,
                                function(error, stdout, stderr){
                                    if(error) {
                                        console.info('stderr : '+stderr);
                                        //send error
                                        //todo
                                    }
                                    else if (stdout.length>0){
                                        //send result
                                        res.json({
                                            result:stdout
                                        })
                                    }
                                }
                            );
                        }
                        else{
                            //todo handle error
                        }
                    }
                    else {
                        //todo handle error
                    }
                }
            );
        }
        else{
            //todo handle error
        }
    }
    else{
        //todo handle error
    }
});

/*stop training*/
router.post('/train/stop', function(req,res,next){
    var id = req.body.id;
    var pwd = req.body.pwd;

    Model.findOne({id:id, pwd:pwd}, function (err, model) {
        if(err){
            //todo handle err
        }
        else{
            var pid = model.train.pid;
            if(pid>0){
                //stop training
                var exec = require('child_process').exec;
                exec('kill '+pid,
                    function(error, stdout, stderr){
                        if(error) {
                            console.info('stderr : '+stderr);
                            //send error
                            //todo
                        }
                        else{
                            //todo handle the stdout
                        }
                    }
                );
            }
            else{
                res.json({
                    code:204,
                    msg:'It is not running!'
                })
            }
        }
    })

});

/*finish training*/
router.post('/train/finish', function(req, res, next){
    var id = req.body.id;
    var pwd = req.body.pwd;

    Model.findOne({id:id, pwd:pwd}, function (err, model) {
        if(err){
            //todo handle err
        }
        else{
            var iter_t = req.body.iter_t;
            var iter = req.body.iter;
            var trainPath = path.resolve(__dirname, '../models') + '/' + id + '/train/';
            var trainprotxtPath = trainPath+'/segnet_train.prototxt';
            var caffemodelPath = trainPath+'/result/segnet_iter_'+iter_t+'.caffemodel ';
            var targetPath = path.resolve(trainPath, '..');
            var exec = require('child_process').exec;
            exec('python '+config.FinishTrainScripPath+" "+trainprotxtPath+" "+caffemodelPath+" "+targetPath,
                function(error, stdout, stderr){
                    if(error) {
                        console.info('stderr : '+stderr);
                        //send error
                        //todo
                    }
                    else{
                        //todo handle the stdout
                        //store the iter and update the state
                        model.test.ready = true;
                        model.test.iter = iter;
                        model.save(function (err, model) {
                            if(err){
                                //todo handle err
                            }
                            else{
                                //todo response success
                            }
                        })
                    }
                }
            );
        }
    })

});

/*clear training*/
router.post('/train/clear', function(req, res, next){
    var id = req.body.id;
    var pwd = req.body.pwd;

    Model.findOne({id:id, pwd:pwd}, function(err, model){
        if(err){
            //todo handle err
        }
        else{
            //clear training directory
            var rootPath = path.resolve(__dirname, '../models');
            var modelPath = rootPath+'/'+id;
            var exec = require('child_process').exec;
            //remove train directory
            exec('rm -r '+modelPath+'/train',
                function(error, stdout, stderr){
                    if(error) {
                        console.info('stderr : '+stderr);
                        //send error
                        //todo
                    }
                    else{
                        //create new train directory
                        fs.mkdir(modelPath+'/train', function (err) {
                            if(err){
                                //todo handle err
                            }
                            else{
                                fs.mkdir(modelPath+'/train/data', function (err) {
                                    if(err){
                                        //todo handle err
                                    }
                                    else{
                                        fs.mkdir(modelPath+'/train/label', function (err) {
                                            if(err){
                                                //todo handle err
                                            }
                                            else{
                                                fs.mkdir(modelPath+'/train/result', function (err) {
                                                    if(err){
                                                        //todo handle err
                                                    }
                                                    else{
                                                        solver_prototxt_factory(id, function (err) {
                                                            if(err){
                                                                //todo handle err
                                                            }
                                                            else{
                                                                train_prototxt_factory(id, function (err) {
                                                                    if(err){
                                                                        //todo handle err
                                                                    }
                                                                    else{
                                                                        //todo send success
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
            );
        }
    });

});

module.exports = router;

