/**
 * Created by haoqian on 17-7-14.
 */
$('document').ready(function () {
    $("#TestSubmit").click(function(){
        var file = $("#TestData")[0].files[0];
        var formData = new FormData();
        formData.append("id", 0);
        formData.append("files", file);
        $.ajax({
            url: "/api/test",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false
        });
    });

    $("#NewTrainSubmit").click(function () {
        var id = $("#NewTrainID")[0].value;
        var pwd = $("#NewTrainPWD")[0].value;
        $.ajax({
            url: "/api/train/create",
            type: "POST",
            data: {
                id:id,
                pwd:pwd
            }
        });
    });

    $("#TrainDataSubmit").click(function(){
        var file = $("#TrainData")[0].files;
        var id = $("#TrainID4Data")[0].value;
        var pwd = $("#TrainDataPWD")[0].value;
        var formData = new FormData();
        formData.append("id", id);
        formData.append("pwd", pwd);
        for(var i=0; i<file.length; i++){
            formData.append("files", file[i]);
        }
        $.ajax({
            url: "api/train/prepare/data",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false
        });
    });

    $("#TrainLabelSubmit").click(function(){
        var file = $("#TrainLabel")[0].files;
        var id = $("#TrainID4Label")[0].value;
        var pwd = $("#TrainLabelPWD")[0].value;
        var formData = new FormData();
        formData.append("id", id);
        formData.append("pwd", pwd);
        for(var i=0; i<file.length; i++){
            formData.append("files", file[i]);
        }
        $.ajax({
            url: "api/train/prepare/label",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false
        });
    });

    $("#TrainRelationSubmit").click(function(){
        var file = $("#TrainRelation")[0].files;
        var id = $("#TrainID4Relation")[0].value;
        var pwd = $("#TrainRelationPWD")[0].value;
        var formData = new FormData();
        formData.append("id", id);
        formData.append("pwd", pwd);
        formData.append("files", file[0]);
        $.ajax({
            url: "api/train/prepare/relation",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false
        });
    });
    $("#StartTrainSubmit").click(function () {
        var id = $("#StartTrainID")[0].value;
        var pwd = $("#StartTrainPWD")[0].value;
        $.ajax({
            url: "/api/train/run",
            type: "POST",
            data: {
                id:id,
                pwd:pwd
            }
        });
    });
    $("#StopTrainSubmit").click(function () {
        var id = $("#StopTrainID")[0].value;
        var pwd = $("#StopTrainPWD")[0].value;
        $.ajax({
            url: "/api/train/stop",
            type: "POST",
            data: {
                id:id,
                pwd:pwd
            }
        });
    });
    $("#GetTrainSubmit").click(function () {
        var id = $("#GetTrainID")[0].value;
        var range = [-1, -1];
        var small = $("#Range0")[0].value;
        var big = $("#Range1")[0].value;
        if(small){
            range[0] = small;
        }
        if(big){
            range[1] = big;
        }
        $.ajax({
            url: "/api/train/procedure",
            type: "POST",
            data: {
                id:id,
                range: range
            },
            success: function (res) {
                console.log(res.result);
            }
        });
    });
    $("#ClearTrainSubmit").click(function () {
        var id = $("#ClearTrainID")[0].value;
        var pwd = $("#ClearTrainPWD")[0].value;
        $.ajax({
            url: "/api/train/clear",
            type: "POST",
            data: {
                id:id,
                pwd:pwd
            }
        });
    });
});
