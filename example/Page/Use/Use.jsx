import React from  'react';
import css from './Use.css';
//var Helmet=require("react-helmet");
import {
    Step,
    Stepper,
    StepButton,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';

import Head from '../../Common/Head/Head.jsx';


class Train extends React.Component{
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentDidMount(){

    }
    render() {
        const contentStyle = {margin: '0 16px'};

        return (
            <div>
                <Head/>
                <div style={{width: '100%', maxWidth: 800, margin: 'auto', marginTop:'20px'}}>
                    <div style={contentStyle}>
                        <Box/>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports=Train;

class Box extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username:null,
            userPWD:null,
            pwd:null,
            pwdConfirm:null,
            error:false,
            state:0,
            id:0,
            data:[],
            wait:false,
            complete:false
        };
    }
    componentDidMount(){

    }
    handlePrev(){
        this.props.handlePrev();
    }
    submit(){
        this.setState({wait:true});
        setTimeout(()=>{
            this.setState({wait:false, complete:true});
        }, 1*1000);

    }
    submit1(){
        let username = this.state.username,
            userpwd = this.state.userPWD,
            pwd = this.state.pwd,
            modelPasswordConfirm = this.state.pwdConfirm;
        $.ajax({
            url: window.gloable.url + "/api/train/create",
            type: "POST",
            data: {
                pwd:pwd,
                username:username,
                userpwd:userpwd
            },
            success:(res) => {
                //res = JSON.parse(res);
                switch(res.code){
                    case 200:{
                        this.props.setModel(res.id, pwd);
                        this.setState({id:res.id, state:1});
                        break;
                    }
                    case 401:{
                        this.setState({state:2});
                        break;
                    }
                    default:{
                        this.setState({state:-1});
                    }
                }
            }
        });


    }
    handleClose(){
        this.setState({state:0});
    }
    render() {
        const stepIndex = this.props.stepIndex;
        const contentStyle = {margin: '0 16px'};
        const Dialogs = [
            <Dialog
                title="创建成功"
                actions={[
                    <FlatButton
                        label="Cancel"
                        primary={true}
                        onTouchTap={this.handleClose.bind(this)}
                    />,
                    <FlatButton
                        label="Next"
                        primary={true}
                        keyboardFocused={true}
                        onTouchTap={this.props.handleNext}
                    />
                ]}
                modal={false}
                open={this.state.state===1}
                onRequestClose={this.handleClose.bind(this)}
            >
                模型已成功创建。您新创建的模型ID是{this.state.id}。请您记住ID和密码，方便后续操作。
            </Dialog>,
            <Dialog
                title="用户名密码错误"
                actions={[
                    <FlatButton
                        label="Confirm"
                        primary={true}
                        keyboardFocused={true}
                        onTouchTap={this.handleClose.bind(this)}
                    />
                ]}
                modal={false}
                open={this.state.state===2}
                onRequestClose={this.handleClose.bind(this)}
            >
                用户名密码错误。请您查证后重试。
            </Dialog>,
            <Dialog
                title="未知错误"
                actions={[
                    <FlatButton
                        label="Confirm"
                        primary={true}
                        keyboardFocused={true}
                        onTouchTap={this.handleClose.bind(this)}
                    />
                ]}
                modal={false}
                open={this.state.state===-1}
                onRequestClose={this.handleClose.bind(this)}
            >
                服务器发生未知错误。请稍后重试或联系管理员。
            </Dialog>
        ];
        return (
            <div style={contentStyle}>
                <Paper style={{padding:'20px', width:'100%'}} zDepth={1}>
                    <div className={css['primary-text']}>让我们来使用模型进行图像分割</div>
                    <div>
                        <div className={css['text']}>您可以指定所使用的模型，也可以留空使用我们的默认模型</div>
                        <TextField
                            value={this.state.id}
                            hintText="请输入模型ID"
                            floatingLabelText="模型ID"
                            onChange={(e,v)=>this.setState({id:v})}
                        /><br />
                    </div>
                    <div>
                        <div className={css['text']}>现在，请上传待分割图片。它们应该是1000x1000的tif</div>
                        <RaisedButton label="选择数据" secondary={true} onTouchTap={()=>{
                            this.refs['data-file'].click();
                        }}/>
                        <div className={css['file-hint']}>选择了{this.state.data.length}个文件</div>
                        <input type="file" multiple="multiple" ref="data-file" style={{display:'none'}}
                               onChange={()=>{
                                   this.setState({
                                       data:this.refs['data-file'].files
                                   })
                               }}
                        />
                    </div>
                    {
                        (this.state.complete)?
                            <div>
                                <div className={css['text']}>处理后的结果</div>
                                <img style={{maxWidth:'100%'}} src='http://i4.eiimg.com/1949/209537fa032e243a.png'/>
                            </div>
                            :null
                    }
                </Paper>
                <div style={{marginTop: 12}}>
                    <RaisedButton
                        label="Submit"
                        primary={true}
                        onTouchTap={this.submit.bind(this)}
                    />
                </div>
                {Dialogs}
            </div>
        );
    }
}
