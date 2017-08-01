import React from  'react';
import css from './Train.css';
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


class Train extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            stepIndex: 0,
            id:null,
            pwd:null
        };
    }
    componentDidMount(){

    }
    handleNext(){
        const {stepIndex} = this.state;
        if (stepIndex < 6) {
            this.setState({stepIndex: stepIndex + 1});
        }
    };

    handlePrev(){
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    };

    setModel(id, pwd){
        this.setState({id, pwd});
    }

    getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return <NewTrain
                    stepIndex={0}
                    handleNext={this.handleNext.bind(this)}
                    handlePrev={this.handlePrev.bind(this)}
                    setModel={this.setModel.bind(this)}
                    max = {5}
                />;
            case 1:
                return <UploadDataSet
                    stepIndex={1}
                    handleNext={this.handleNext.bind(this)}
                    handlePrev={this.handlePrev.bind(this)}
                    setModel={this.setModel.bind(this)}
                    id={this.state.id}
                    pwd={this.state.pwd}
                    max = {5}
                />;
            case 2:
                return <StartTrain
                    stepIndex={2}
                    handleNext={this.handleNext.bind(this)}
                    handlePrev={this.handlePrev.bind(this)}
                    setModel={this.setModel.bind(this)}
                    id={this.state.id}
                    pwd={this.state.pwd}
                    max = {5}
                />;
            case 3:
                return <WatchTrain
                    stepIndex={3}
                    handleNext={this.handleNext.bind(this)}
                    handlePrev={this.handlePrev.bind(this)}
                    setModel={this.setModel.bind(this)}
                    id={this.state.id}
                    pwd={this.state.pwd}
                    max = {5}
                />;
            case 4:
                return <StopTrain
                    stepIndex={4}
                    handleNext={this.handleNext.bind(this)}
                    handlePrev={this.handlePrev.bind(this)}
                    setModel={this.setModel.bind(this)}
                    id={this.state.id}
                    pwd={this.state.pwd}
                    max = {5}
                />;
            case 5:
                return <FinishTrain
                    stepIndex={5}
                    handleNext={this.handleNext.bind(this)}
                    handlePrev={this.handlePrev.bind(this)}
                    setModel={this.setModel.bind(this)}
                    id={this.state.id}
                    pwd={this.state.pwd}
                    max = {5}
                />;
            default:
                return 'You\'re a long way from home sonny jim!';
        }
    }

    render() {
        const {stepIndex} = this.state;
        const contentStyle = {margin: '0 16px'};

        return (
            <div style={{width: '100%', maxWidth: 800, margin: 'auto'}}>
                <Stepper linear={false} activeStep={stepIndex}>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: 0})}>
                           创建训练模型
                        </StepButton>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: 1})}>
                            上传数据集
                        </StepButton>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: 2})}>
                            开始训练
                        </StepButton>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: 3})}>
                            查看训练进度
                        </StepButton>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: 4})}>
                            停止训练
                        </StepButton>
                    </Step>
                    <Step>
                        <StepButton onClick={() => this.setState({stepIndex: 5})}>
                            完成训练
                        </StepButton>
                    </Step>
                </Stepper>
                <div style={contentStyle}>
                    {this.getStepContent(stepIndex)}
                </div>
            </div>
        );
    }
}

module.exports=Train;

class NewTrain extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username:null,
            userPWD:null,
            pwd:null,
            pwdConfirm:null,
            error:false,
            state:0,
            id:null
        };
    }
    componentDidMount(){

    }
    handlePrev(){
        this.props.handlePrev();
    }
    handleNext(){
        let username = this.state.username,
            userpwd = this.state.userPWD,
            pwd = this.state.pwd,
            modelPasswordConfirm = this.state.pwdConfirm;

        if(pwd===modelPasswordConfirm){
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
                    <div className={css['primary-text']}>创建一个新的模型，开始我们的训练。</div>
                    <div>
                        <div className={css['text']}>首先，请允许我校验您的身份。您需要事先向管理员取得权限。</div>
                        <TextField
                            value={this.state.username}
                            hintText="请输入用户名"
                            floatingLabelText="用户名"
                            onChange={(e,v)=>this.setState({username:v})}
                        /><br />
                        <TextField
                            value={this.state.userPWD}
                            hintText="请输入密码"
                            floatingLabelText="密码"
                            type="password"
                            onChange={(e,v)=>this.setState({userPWD:v})}
                        /><br />
                    </div>
                    <div>
                        <div className={css['text']}>现在，让我们设置模型的密码。<br/>这将用于后续操作的权限校验，防止坏人操作属于您的模型。</div>
                        <TextField
                            value={this.state.pwd}
                            hintText="请设置模型密码 这将用于校验权限"
                            floatingLabelText="设置密码"
                            type="password"
                            onChange={(e,v)=>this.setState({pwd:v})}
                        /><br />
                        <TextField
                            value={this.state.pwdConfirm}
                            ref="model-password-confirm"
                            hintText="请确认密码"
                            floatingLabelText="确认密码"
                            type="password"
                            errorText={this.state.error?"密码不一致":null}
                            onChange={(e,v)=>this.setState({pwdConfirm:v})}
                            onBlur={()=>{
                                if(this.state.pwd !== this.state.pwdConfirm){
                                    this.setState({error:true});
                                }
                                else{
                                    this.setState({error:false});
                                }
                            }}
                        /><br />
                    </div>

                </Paper>
                <div style={{marginTop: 12}}>
                    <FlatButton
                        label="Back"
                        disabled={stepIndex === 0}
                        onTouchTap={this.handlePrev.bind(this)}
                        style={{marginRight: 12}}
                    />
                    <RaisedButton
                        label="Next"
                        disabled={stepIndex === this.props.max}
                        primary={true}
                        onTouchTap={this.handleNext.bind(this)}
                    />
                </div>
                {Dialogs}
            </div>
        );
    }
}

class UploadDataSet extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            pwd:this.props.pwd,
            id:this.props.id,
            state:0,
            data:[],
            label:[],
            relation:null,
            res:{
                title:'',
                msg:''
            }
        };
    }
    componentDidMount(){

    }
    handlePrev(){
        this.props.handlePrev();
    }
    handleNext(){
        let id = this.state.id,
            pwd = this.state.pwd,
            data = this.state.data,
            label = this.state.label,
            relation = this.state.relation;

        let FileCommit = (file, type, next) => {
            let formData = new FormData();
            if(file.length>0){
                formData.append("id", id);
                formData.append("pwd", pwd);
                for(let i=0; i<file.length; i++){
                    formData.append("files", file[i]);
                }
                console.log(formData.get('files'));
                $.ajax({
                    url: window.gloable.url + "/api/train/prepare/"+type,
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: (res)=>{
                        console.log(res);
                        //res = JSON.parse(res);
                        next(res);
                    }
                });
            }
            else{
                next(null);
            }
        };

        let AuMsg = '';
        let msg = '';
        let next = true;
        let error = false;
        FileCommit(data, 'data', (res)=>{
            if(res!==null){
                switch (res.code){
                    case 200:{
                        msg += '数据上传成功！\n';
                        break;
                    }
                    case 401:{
                        AuMsg = '模型ID或密码错误，请查证后重试！\n';
                        error = true;
                        next = false;
                        break;
                    }
                    case 412:{
                        AuMsg = '该训练创建未初始化！\n';
                        error = true;
                        next = false;
                        break;
                    }
                    default:{
                        msg += '数据上传失败！发生未知错误，请稍后重试或联系管理员！\n';
                        error = true;
                        break;
                    }
                }
            }
            if(next){
                FileCommit(label, 'label', (res)=>{
                    if(res!==null){
                        switch (res.code){
                            case 200:{
                                msg += '标签上传成功！\n';
                                break;
                            }
                            case 401:{
                                AuMsg = '模型ID或密码错误，请查证后重试！\n';
                                error = true;
                                next = false;
                                break;
                            }
                            case 412:{
                                AuMsg = '该训练创建未初始化！\n';
                                error = true;
                                next = false;
                                break;
                            }
                            default:{
                                msg += '标签上传失败！发生未知错误，请稍后重试或联系管理员！\n';
                                error = true;
                                break;
                            }
                        }
                    }
                    if(relation && next){
                        let formData = new FormData();
                        formData.append("id", id);
                        formData.append("pwd", pwd);
                        formData.append("files", relation);
                        $.ajax({
                            url: window.gloable.url + "/api/train/prepare/relation",
                            type: "POST",
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: (res)=>{
                                //res = JSON.parse(res);
                                switch (res.code){
                                    case 200:{
                                        msg += '对应关系上传成功！\n';
                                        break;
                                    }
                                    case 401:{
                                        AuMsg = '模型ID或密码错误，请查证后重试！\n';
                                        error = true;
                                        next = false;
                                        break;
                                    }
                                    case 412:{
                                        AuMsg = '该训练创建未初始化！\n';
                                        error = true;
                                        next = false;
                                        break;
                                    }
                                    default:{
                                        msg += '对应关系上传失败！发生未知错误，请稍后重试或联系管理员！\n';
                                        error = true;
                                        break;
                                    }
                                }
                                if(!error){
                                    let res = {
                                        title:'上传成功',
                                        msg:AuMsg+msg
                                    };
                                    this.setState({state:1, res:res});
                                }
                                else{
                                    let res = {
                                        title:'上传失败',
                                        msg:AuMsg+msg+'请重试。'
                                    };
                                    this.setState({state:2, res:res});
                                }
                            }
                        });
                    }
                    else{
                        if(!error){
                            let res = {
                                title:'上传成功',
                                msg:AuMsg+msg
                            };
                            this.setState({state:1, res:res});
                        }
                        else{
                            let res = {
                                title:'上传失败',
                                msg:AuMsg+msg+'请重试。'
                            };
                            this.setState({state:2, res:res});
                        }
                    }
                })
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
                key={0}
                title={this.state.res.title}
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
                {this.state.res.msg}
            </Dialog>,
            <Dialog
                key={1}
                title={this.state.res.title}
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
                {this.state.res.msg.split('\n').map((item, index)=>{
                    return(
                        <div key={index}>
                            {item}
                        </div>
                    )
                })}
            </Dialog>
        ];
        return (
            <div style={contentStyle}>
                <Paper style={{padding:'20px', width:'100%'}} zDepth={1}>
                    <div className={css['primary-text']}>现在让我们准备好数据集，分别上传数据、标签以及他们之间的关系。</div>
                    <div>
                        <div className={css['text']}>这是您要上传数据的模型</div>
                        <TextField
                            value={this.state.id}
                            hintText="请输入模型ID"
                            floatingLabelText="模型ID"
                            onChange={(e,v)=>this.setState({id:v})}
                        /><br />
                        <TextField
                            value={this.state.pwd}
                            hintText="请输入模型密码"
                            floatingLabelText="模型密码"
                            type="password"
                            onChange={(e,v)=>this.setState({pwd:v})}
                        /><br />
                    </div>
                    <div>
                        <div className={css['text']}>首先让我们选择数据。他们应该是您的输入图片。</div>
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
                    <div>
                        <div className={css['text']}>现在让我们选择标签。他们应是图片对应的类别图。</div>
                        <RaisedButton label="选择标签" secondary={true} onTouchTap={()=>{
                            this.refs['label-file'].click();
                        }}/>
                        <div className={css['file-hint']}>选择了{this.state.label.length}个文件</div>
                        <input type="file" multiple="multiple" ref="label-file" style={{display:'none'}}
                               onChange={()=>{
                                   this.setState({
                                       label:this.refs['label-file'].files
                                   })
                               }}
                        />
                    </div>
                    <div>
                        <div className={css['text']}>最后让我们选择对应关系。他们指明了每幅图对应于哪副标签。</div>
                        <RaisedButton label="对应关系" secondary={true} onTouchTap={()=>{
                            this.refs['relation-file'].click();
                        }}/>
                        <div className={css['file-hint']}>{(this.state.relation)?'选择了'+this.state.relation.name:'未选择任何文件'}</div>
                        <input type="file" ref="relation-file" style={{display:'none'}}
                               onChange={()=>{
                                   this.setState({
                                       relation:this.refs['relation-file'].files[0]
                                   })
                               }}
                        />
                    </div>

                </Paper>
                <div style={{marginTop: 12}}>
                    <FlatButton
                        label="Back"
                        disabled={stepIndex === 0}
                        onTouchTap={this.handlePrev.bind(this)}
                        style={{marginRight: 12}}
                    />
                    <RaisedButton
                        label="Next"
                        disabled={stepIndex === this.props.max}
                        primary={true}
                        onTouchTap={this.handleNext.bind(this)}
                    />
                </div>
                {Dialogs}
            </div>
        );
    }
}

class StartTrain extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            pwd:this.props.pwd,
            id:this.props.id,
            state:0,
            res:{
                title:'',
                msg:''
            }
        };
    }
    componentDidMount(){

    }
    handlePrev(){
        this.props.handlePrev();
    }
    handleNext(){
        let id = this.state.id,
            pwd = this.state.pwd;

        $.ajax({
            url: window.gloable.url + "/api/train/run",
            type: "POST",
            data: {
                id:id,
                pwd:pwd
            },
            success: (res)=>{
                //res = JSON.parse(res);
                if(res.code===200){
                    let stateRes = {
                        title:'开始训练',
                        msg:'操作成功，模型已加入队列，当GPU空闲时即开始训练。点击下一步查看训练进度。'
                    };
                    this.setState({res:stateRes, state:1});
                }
                else{
                    this.setState({state:2});
                    if(res.code===401){
                        let stateRes = {
                            title:'没有权限',
                            msg:'ID或密码填写错误，请查证后再试！'
                        };
                        this.setState({res:stateRes});
                    }
                    else if(res.code===204){
                        let stateRes = {
                            title:'已在队列',
                            msg:'该模型已在等待队列或在运行，请勿重复提交'
                        };
                        this.setState({res:stateRes});
                    }
                    else if(res.code===412){
                        let msg = '';
                        if(!res.base){
                            msg += '模型未创建';
                        }
                        else{
                            if(!res.data){
                                msg += '请上传训练数据集的数据\n';
                            }
                            if(!res.label){
                                msg += '请上传训练数据集的标记\n';
                            }
                            if(!res.relation){
                                msg += '请上传训练数据集的数据与标记\n';
                            }
                        }
                        let stateRes = {
                            title:'前提条件未满足',
                            msg:msg
                        };
                        this.setState({res:stateRes});
                    }
                    else{
                        let stateRes = {
                            title:'未知错误',
                            msg:'请稍后再试或联系管理员'
                        };
                        this.setState({res:stateRes});
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
                key={0}
                title={this.state.res.title}
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
                {this.state.res.msg}
            </Dialog>,
            <Dialog
                key={1}
                title={this.state.res.title}
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
                {this.state.res.msg}
            </Dialog>
        ];
        return (
            <div style={contentStyle}>
                <Paper style={{padding:'20px', width:'100%'}} zDepth={1}>
                    <div className={css['primary-text']}>按下这个按钮，模型即会被添加入队列中准备训练。</div>
                    <div>
                        <div className={css['text']}>请允许我校验您是否有操作该模型的权限</div>
                        <TextField
                            value={this.state.id}
                            hintText="请输入模型ID"
                            floatingLabelText="模型ID"
                            onChange={(e,v)=>this.setState({id:v})}
                        /><br />
                        <TextField
                            value={this.state.pwd}
                            hintText="请输入模型密码"
                            floatingLabelText="模型密码"
                            type="password"
                            onChange={(e,v)=>this.setState({pwd:v})}
                        /><br />
                    </div>
                </Paper>
                <div style={{marginTop: 12}}>
                    <FlatButton
                        label="Back"
                        disabled={stepIndex === 0}
                        onTouchTap={this.handlePrev.bind(this)}
                        style={{marginRight: 12}}
                    />
                    <RaisedButton
                        label="Next"
                        disabled={stepIndex === this.props.max}
                        primary={true}
                        onTouchTap={this.handleNext.bind(this)}
                    />
                </div>
                {Dialogs}
            </div>
        );
    }
}

class WatchTrain extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            stepIndex: this.props.stepIndex,
            id:this.props.id,
            latest:null,
            keepAsk:false,
            msg:'点击发起对训练进度的查看',
            range:[-1,-1],
            result:null,
            askMsg:null
        };
    }
    componentDidMount(){
        setInterval(this.latest.bind(this), 30*1000);
    }
    handlePrev(){
        this.props.handlePrev();
    }
    handleNext(){
        this.props.handleNext();
    }
    handleClose(){
        this.setState({state:0});
    }
    latest(force){
        if(this.state.keepAsk || force){
            $.ajax({
                url: window.gloable.url + "/api/train/procedure",
                type: "POST",
                data: {
                    id:this.state.id,
                    range: [-1, -1]
                },
                success: (res) => {
                    //res = JSON.parse(res);
                    if(res.code===200){
                        this.setState({latest:res.result});
                    }
                    else{
                        this.setState({msg:res.msg});
                        //stop asking
                        this.setState({keepAsk:false});
                    }
                }
            });
        }
    }
    ask(){
        let range = [Number(this.state.range[0]),Number(this.state.range[1])];
        $.ajax({
            url: window.gloable.url + "/api/train/procedure",
            type: "POST",
            data: {
                id:this.state.id,
                range: range
            },
            success: (res) => {
                //res = JSON.parse(res);
                if(res.code===200){
                    console.log(res.result);
                    this.setState({result:res.result});
                }
                else{
                    this.setState({askMsg:res.msg, result:null});
                }
            }
        });
    }
    render() {
        const stepIndex = this.state.stepIndex;
        const contentStyle = {margin: '0 16px'};
        let latestWindow=()=>{
            if(this.state.keepAsk){
                return(
                    <pre>
                        <div className={css["keep-ask-window"]}>
                            {this.state.latest}
                        </div>
                        <RaisedButton label="停止查看" secondary={true} onTouchTap={()=>{
                            this.setState({keepAsk:false});
                        }}/>
                    </pre>
                )
            }
            else{
                return(
                    <div>
                        <div className={css["keep-ask-window"]}>
                            {this.state.msg}
                        </div>
                        <RaisedButton label="开始查看" secondary={true} onTouchTap={()=>{
                            this.setState({keepAsk:true, latest:"waiting..."});
                            this.latest(true);
                        }}/>
                    </div>
                )
            }
        };
        return (
            <div style={contentStyle}>
                <Paper style={{padding:'20px', width:'100%'}} zDepth={1}>
                    <div className={css['primary-text']}>您的模型正在训练，让我们来看看它的结果。</div>
                    <div>
                        <div className={css['text']}>这是您正在查看的模型：</div>
                        <TextField
                            value={(this.state.id===null)?'':this.state.id}
                            hintText="模型ID"
                            floatingLabelText="模型ID"
                            onChange={(e,v)=>this.setState({id:v})}
                        /><br />
                    </div>
                    <div>
                        <div className={css['text']}>最新百次训练结果：</div>
                        {
                            latestWindow()
                        }
                    </div>
                    <div>
                        <div className={css['text']}>也许您想查询特定训练结果</div>
                        <TextField
                            value={this.state.range[0]}
                            hintText="您希望从哪次训练迭代查起"
                            floatingLabelText="查询范围下界"
                            onChange={(e,v)=>this.setState({range:[v, this.state.range[1]]})}
                        /><br />
                        <TextField
                            value={this.state.range[1]}
                            hintText="您希望查到哪次训练迭代"
                            floatingLabelText="查询范围上界"
                            onChange={(e,v)=>this.setState({range:[this.state.range[0], v]})}
                        /><br />
                        {(this.state.result!==null || this.state.askMsg!==null)?
                            <pre className={css["keep-ask-window"]}>
                                {(this.state.result)?this.state.result:this.state.askMsg}
                            </pre>
                            :null
                        }
                        <RaisedButton label="发起查询" secondary={true} onTouchTap={()=>{
                            this.ask();
                        }}/>
                    </div>
                </Paper>
                <div style={{marginTop: 12}}>
                    <FlatButton
                        label="Back"
                        disabled={stepIndex === 0}
                        onTouchTap={this.handlePrev.bind(this)}
                        style={{marginRight: 12}}
                    />
                    <RaisedButton
                        label="Next"
                        disabled={stepIndex === this.props.max}
                        primary={true}
                        onTouchTap={this.handleNext.bind(this)}
                    />
                </div>

            </div>
        );
    }
}

class StopTrain extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            stepIndex: this.props.stepIndex,
            pwd:this.props.pwd,
            id:this.props.id,
            state:0,
            res:{
                title:'',
                msg:''
            }
        };
    }
    componentDidMount(){

    }
    handlePrev(){
        this.props.handlePrev();
    }
    handleNext(){
        let id = this.state.id,
            pwd = this.state.pwd;

        $.ajax({
            url: window.gloable.url + "/api/train/stop",
            type: "POST",
            data: {
                id:id,
                pwd:pwd
            },
            success: (res)=>{
                //res = JSON.parse(res);
                if(res.code===200){
                    let stateRes = {
                        title:'成功',
                        msg:'训练已结束。若您对本次训练满意，请点击NEXT完成训练。否则上传训练数据重新训练。'
                    };
                    this.setState({res:stateRes, state:1});
                }
                else{
                    this.setState({state:2});
                    if(res.code===401){
                        let stateRes = {
                            title:'没有权限',
                            msg:'ID或密码填写错误，请查证后再试！'
                        };
                        this.setState({res:stateRes});
                    }
                    else if(res.code===204){
                        let stateRes = {
                            title:'未在训练',
                            msg:'该模型未在训练，无需停止。'
                        };
                        this.setState({res:stateRes});
                    }
                    else{
                        let stateRes = {
                            title:'未知错误',
                            msg:'请稍后再试或联系管理员'
                        };
                        this.setState({res:stateRes});
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
                key={0}
                title={this.state.res.title}
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
                {this.state.res.msg}
            </Dialog>,
            <Dialog
                key={1}
                title={this.state.res.title}
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
                {this.state.res.msg}
            </Dialog>
        ];
        return (
            <div style={contentStyle}>
                <Paper style={{padding:'20px', width:'100%'}} zDepth={1}>
                    <div className={css['primary-text']}>按下这个按钮，模型即会停止训练。</div>
                    <div>
                        <div className={css['text']}>请允许我校验您是否有操作该模型的权限</div>
                        <TextField
                            value={this.state.id}
                            hintText="请输入模型ID"
                            floatingLabelText="模型ID"
                            onChange={(e,v)=>this.setState({id:v})}
                        /><br />
                        <TextField
                            value={this.state.pwd}
                            hintText="请输入模型密码"
                            floatingLabelText="模型密码"
                            type="password"
                            onChange={(e,v)=>this.setState({pwd:v})}
                        /><br />
                    </div>
                </Paper>
                <div style={{marginTop: 12}}>
                    <FlatButton
                        label="Back"
                        disabled={stepIndex === 0}
                        onTouchTap={this.handlePrev.bind(this)}
                        style={{marginRight: 12}}
                    />
                    <RaisedButton
                        label="Next"
                        disabled={stepIndex === 2}
                        primary={true}
                        onTouchTap={this.handleNext.bind(this)}
                    />
                </div>
                {Dialogs}
            </div>
        );
    }
}

class FinishTrain extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            stepIndex: this.props.stepIndex,
            pwd:this.props.pwd,
            id:this.props.id,
            iter:0,
            state:0,
            res:{
                title:'',
                msg:''
            }
        };
    }
    componentDidMount(){

    }
    handlePrev(){
        this.props.handlePrev();
    }
    handleNext(){
        let id = this.state.id,
            pwd = this.state.pwd,
            iter = this.state.iter;

        $.ajax({
            url: window.gloable.url + "/api/train/finish",
            type: "POST",
            data: {
                id:id,
                pwd:pwd,
                iter:iter
            },
            success: (res)=>{
                //res = JSON.parse(res);
                if(res.code===200){
                    let stateRes = {
                        title:'成功',
                        msg:'训练完成！您现在可以利用该模型进行图像分割了'
                    };
                    this.setState({res:stateRes, state:1});
                }
                else{
                    this.setState({state:2});
                    if(res.code===401){
                        let stateRes = {
                            title:'没有权限',
                            msg:'ID或密码填写错误，请查证后再试！'
                        };
                        this.setState({res:stateRes});
                    }
                    else{
                        let stateRes = {
                            title:'未知错误',
                            msg:'请稍后再试或联系管理员'
                        };
                        this.setState({res:stateRes});
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
                key={0}
                title={this.state.res.title}
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
                {this.state.res.msg}
            </Dialog>,
            <Dialog
                key={1}
                title={this.state.res.title}
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
                {this.state.res.msg}
            </Dialog>
        ];
        return (
            <div style={contentStyle}>
                <Paper style={{padding:'20px', width:'100%'}} zDepth={1}>
                    <div className={css['primary-text']}>按下这个按钮，模型训练过程将会完成。我们将会将您选择的迭代序号的模型参数转换为最终参数，以允许用户使用模型。</div>
                    <div>
                        <div className={css['text']}>请允许我校验您是否有操作该模型的权限</div>
                        <TextField
                            value={this.state.id}
                            hintText="请输入模型ID"
                            floatingLabelText="模型ID"
                            onChange={(e,v)=>this.setState({id:v})}
                        /><br />
                        <TextField
                            value={this.state.pwd}
                            hintText="请输入模型密码"
                            floatingLabelText="模型密码"
                            type="password"
                            onChange={(e,v)=>this.setState({pwd:v})}
                        /><br />
                    </div>
                    <div>
                        <div className={css['text']}>请告诉我您将采用哪次迭代的参数</div>
                        <TextField
                            value={this.state.iter}
                            hintText="请输入迭代序号"
                            floatingLabelText="迭代序号"
                            onChange={(e,v)=>this.setState({iter:v})}
                        /><br />
                    </div>
                </Paper>
                <div style={{marginTop: 12}}>
                    <FlatButton
                        label="Back"
                        disabled={stepIndex === 0}
                        onTouchTap={this.handlePrev.bind(this)}
                        style={{marginRight: 12}}
                    />
                    <RaisedButton
                        label="Complete"
                        primary={true}
                        onTouchTap={this.handleNext.bind(this)}
                    />
                </div>
                {Dialogs}
            </div>
        );
    }
}