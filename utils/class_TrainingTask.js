/**
 * Created by haoqian on 17-7-20.
 */
var path = require('path');
var config = require('./config.js');

var TrainingTask = {
    list: [],
    checkPid: null,
    checking: false,
    add : function (id) {
        this.list.push(id);
        this.reset();
        this.check();
    },
    check: function(){
        if(this.list.length>0 && !this.checking){
            this.checking = true;

            var exec = require('child_process').exec;
            exec('nvidia-smi', function (error, stdout, stderr) {
                if(error){
                    console.error(error);
                }
                else{
                    //parse the text
                    var lines = stdout.split('\n');
                    var gpus = [];
                    for(var i=7; i<lines.length-8; i+=3){
                        var temp = lines[i+1].split('|');
                        if(temp[2]){
                            temp = temp[2].split('/');
                            var gpu = {
                                occupied: parseInt(temp[0]),
                                all: parseInt(temp[1]),
                                left: parseInt(temp[1]) - parseInt(temp[0])
                            };
                            gpus.push(gpu);
                        }
                        else{
                            console.err("Some error happens when parse gpu!\nline: " + i + "\n"+stdout);
                        }
                    }

                    //choose the gpu
                    //use worst-fit strategy
                    var biggest = null;
                    for(var j=0; j<gpus.length; j++){
                        if(biggest===null){
                            biggest = {
                                num: j,
                                value: gpus[j].left
                            }
                        }
                        else{
                            if(gpus[j].left>biggest.value){
                                biggest = {
                                    num: j,
                                    value: gpus[j].left
                                }
                            }
                        }
                    }

                    if(biggest.value > config.blockSize){
                        this.pop(biggest.num);
                    }
                }
                this.checking = false;
            }.bind(this));
        }
    },
    pop: function (gpu) {
        var id = this.list.pop();
        //run model training
        var trainPath = path.resolve(__dirname, '../models') + '/' + id + '/train/';
        var exec = require('child_process').exec;
        var process = exec('caffe train -gpu ' + gpu + ' -solver ' + trainPath + 'solver.prototxt &> '+trainPath+'trainingProcedure.txt',
            function(error, stdout, stderr){
                if(error) {
                    console.info('stderr : '+stderr);
                    //send error
                    //todo
                }
                else{
                    //todo handle the stdout

                    var pid = process.pid;
                    //todo store the pid

                    this.check();
                }
            }
        );
    },
    run: function () {
        setInterval(this.check, 60*60*1000);
    },
    stop: function(){
        if(this.checkPid){
            clearInterval(this.checkPid);
        }
    },
    reset: function () {
        this.stop();
        this.run();
    }

};

module.exports = TrainingTask;