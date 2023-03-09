import React from "react";
import './LoginPageStyle.css';

//import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';
//import Paper from '@material-ui/core/Paper';
/*import axios from 'axios';*/
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
/*import TextField from '@material-ui/core/TextField';*/
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import cookie from 'cookie-machine';
import config from "../../../resources/config.json";
var qs = require('qs');
/*import Icon from '@material-ui/core/Icon';*/

export default class LoginComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {username: '', password: '', isLoading: false};
    }
    onFieldChange = (event) => {
        let _tempVar = this.state;
        _tempVar[event.target.id] = event.target.value;
        this.setState(_tempVar);
    }
    doLogin = (event) => {
        event.preventDefault();
        let _tempVar = this.state;
        _tempVar.isLoading = true;
        this.setState(_tempVar);
        /*this.props.history.push('/main')
        console.log(this.props.history);*/
        let body = {
            grant_type: 'password',
            username: event.target.username.value,
            password: event.target.password.value
        };
        axios.post(config.AUTH_URL,qs.stringify(body),{'Content-Type': 'application/x-www-form-urlencoded'}).then((response) => {
            if (response.status !== 200) {
                _tempVar.isLoading = false;
                this.setState(_tempVar);
                this.props.showNotification('error', 'Invaild username or password!');
                return;
            }
            const tokenResponse = { created: Date.now(), ...response.data};
            cookie.remove('tokenResponse');

            axios.get(config.API_BASE_URL + 'Sites/client').then((response) => {
                let clientDetails = response.data;
                if (clientDetails.isActive == false) {
                    _tempVar.isLoading = false;
                    this.setState(_tempVar);
                    this.props.showNotification('error', 'Client deactivated. Please contact your Administrator.');
                    return;
                }
                cookie.set('tokenResponse', JSON.stringify(tokenResponse), { path: '/', maxAge: 20 * 60 });
                this.props.showNotification('success', 'You are successfully logged in.');
                if (this.props.source === "loginmodal") {
                    this.props.closeModal();
                } else {
                    this.props.history.push('/main');
                }

            }, (error) => {
                _tempVar.isLoading = false;
                this.setState(_tempVar);
            }).finally(() => {
                //document.dispatchEvent(new CustomEvent("hideAppLoader"));
            });
            
        })
        .catch( err => { 
            _tempVar.isLoading = false;
            this.setState(_tempVar); 
            this.props.showNotification('error', 'Invaild username or password!');
        } );
    }
    goToForgotPwd = () => {
        this.props.history.push('/ForgotPassword');
    }
    render(){
        return(
            <div className="loginWrapper">
                <Grid container spacing={0}>
                    <Grid item xs={11} sm={5} md={4} lg={3} className="loginOuterContainer">
                        <div className="loginContainer">
                            <form onSubmit={this.doLogin}>
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
                                    <InputLabel htmlFor="password">Password *</InputLabel>
                                    <Input
                                      id="password" type="password"
                                      startAdornment={
                                        <InputAdornment position="start">
                                          <img src={require('../../../assets/icon/icon-lockOutline.png')} alt="password" width="15" />
                                        </InputAdornment>
                                      } require="true" onChange={this.onFieldChange}
                                    />
                                </FormControl>


                                <FormControlLabel className="rememberMe" control={
                                    <Checkbox value="rememberMe" color="primary" />
                                  }
                                label="Remember me on this computer" />

                                <FormControl fullWidth={true}>

                                    {
                                        this.state.isLoading === false && <Button variant="contained" color="primary" className="loginBtn" type="submit" disabled={(this.state.username !== '' & this.state.password !== '')?false:true }>
                                        Log in
                                    </Button>
                                    }
                                    {
                                        this.state.isLoading === true && <Button variant="contained" color="primary" className="loginBtn" type="button" disabled={true}>
                                        <CircularProgress className="loginLoader" />
                                    </Button>
                                    }

                                </FormControl>
                                {
                                    this.props.source !== "loginmodal" && 
                                    <FormControl fullWidth={true} className="forgotPwdLink" onClick={this.goToForgotPwd}>
                                        Forgot Password?
                                    </FormControl>
                                }
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