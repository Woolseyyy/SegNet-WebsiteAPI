import React from  'react';
import css from './Head.css';
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
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';


class Train extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            open:false
        };
    }
    componentDidMount(){

    }

    render() {

        return (
            <div>
                <AppBar
                    title="Segmentation"
                    onLeftIconButtonTouchTap={()=>{
                        this.setState({open:!this.state.open});
                    }}
                />
                <Drawer
                    open={this.state.open}
                    docked={false}
                    onRequestChange={(open) => this.setState({open})}
                >
                    <div className={css['drawer-title']}>Segmentation</div>
                    <MenuItem
                        onTouchTap={()=>{
                            window.location.href="#/"
                        }}>
                        Train</MenuItem>
                    <MenuItem
                        onTouchTap={()=>{
                            window.location.href="#/use"
                        }}
                    >Use</MenuItem>
                </Drawer>
            </div>
        );
    }
}

module.exports=Train;
