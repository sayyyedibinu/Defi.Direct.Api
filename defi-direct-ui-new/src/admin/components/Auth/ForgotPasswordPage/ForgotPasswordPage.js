import React from "react";
import './ForgotPasswordPageStyle.css';

//import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';
//import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
/*import TextField from '@material-ui/core/TextField';*/
import Button from '@material-ui/core/Button';
/*import FormControlLabel from '@material-ui/core/FormControlLabel';*/
/*import Checkbox from '@material-ui/core/Checkbox';*/
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
/*import Icon from '@material-ui/core/Icon';*/

export default class LoginComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {username: '', isLoading: false};
    }
    onFieldChange = (event) => {
        let _tempVar = this.state;
        _tempVar[event.target.id] = event.target.value;
        this.setState(_tempVar);
    }
    doForgotPwd = (event) => {
        event.preventDefault();
        let _tempVar = this.state;
        _tempVar.isLoading = true;
        this.setState(_tempVar);
        /*this.props.history.push('/');
        console.log(this.props.history);*/
        axios.get('https://jsonplaceholder.typicode.com/posts/1').then( (response) => {
            _tempVar.isLoading = true;
            this.setState(_tempVar);
            if(this.state.username === 'admin'){
                _tempVar.username = '';
                this.setState(_tempVar);
                this.props.showNotification('success', 'Reset password link sent to your registered email.');
            }else{
                this.props.showNotification('error', 'Invaild username!');
            }
        });
        
    }
    goToLogin = () => {
        this.props.history.push('/');
    }
    render(){
        return(
            <div className="loginWrapper">
                <Grid container spacing={0}>
                    <Grid item xs={11} sm={5} md={4} lg={3} className="loginOuterContainer">
                        <div className="loginContainer">
                            <form onSubmit={this.doForgotPwd}>
                                <img src={require('../../../assets/img/logo-directLogo.png')} alt="Difi Direct" width="225" />

                                <FormControl fullWidth={true} className="loginFields">
                                    <InputLabel htmlFor="username">Username *</InputLabel>
                                    <Input
                                      id="username"
                                      startAdornment={
                                        <InputAdornment position="start">
                                           <img src={require('../../../assets/icon/icon-userOutline.png')} alt="username" width="15" />
                                        </InputAdornment>
                                      } require="true" onChange={this.onFieldChange}
                                    />
                                </FormControl>

                                <FormControl fullWidth={true}>
                                    {
                                        this.state.isLoading === false && <Button variant="contained" color="primary" className="loginBtn" type="submit" disabled={this.state.username !== '' ? false:true}>Submit</Button>
                                    }
                                    {
                                        this.state.isLoading === true && <Button variant="contained" color="primary" className="loginBtn" type="button" disabled={true}><CircularProgress className="loginLoader" /></Button>
                                    }

                                </FormControl>
                                <FormControl fullWidth={true} className="forgotPwdLink" onClick={this.goToLogin} >
                                    Login
                                </FormControl>
                            </form>
                        </div>
                    </Grid>
                </Grid>

                <Grid container spacing={0}>
                    <Grid item xs={11} sm={5} md={4} lg={3} className="loginFooter">
                        POWERED BY <span className="cmpName">defi SOLUTIONS</span>
                    </Grid>
                </Grid>
            </div>
        )
    }
}
                                /*<Icon style={{color: '#00B2E3'}}>account_circle</Icon>*/
                                
//                                <FormControl fullWidth={true}>
//                                <TextField label="Username" margin="normal" required />
//                            </FormControl>
//                                <FormControl fullWidth={true}>
//                                <TextField type="password" label="Password" margin="normal" required />
//                            </FormControl>