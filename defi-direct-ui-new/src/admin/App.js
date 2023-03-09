import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Notifications, {notify} from 'react-notify-toast';

import './App.css';
import dataShare from './components/Common/dataShare';
import AppLoader from './components/Loader/AppLoader';
import PageNotFound from './components/404/404';
import PageError from './components/500/500';
import LoginPage from './components/Auth/LoginPage/LoginPage';
import LoginModalPage from './components/Auth/LoginPage/LoginModalPage';
import ForgotPasswordPage from './components/Auth/ForgotPasswordPage/ForgotPasswordPage';
import MainPage from './components/Main/MainPage';
import BuilderPage from './components/Builder/BuilderPage';
import axios from 'axios';
import cookie from 'cookie-machine';
import config from "./resources/config.json";
import QueryString from 'qs';

let _sessionTimer;
axios.interceptors.request.use(function(axiosConfig) {
    const tokenString = cookie.get('tokenResponse');
    if ( axiosConfig.url !== config.AUTH_URL && tokenString != null ) {
        const token = JSON.parse(tokenString);
        axiosConfig.headers.Authorization = `Bearer ${token.access_token}`;

        const tokenClientId = cookie.get('ClientId');
        if (tokenClientId) {
            axiosConfig.url = axiosConfig.url + '?ClientId=' + tokenClientId;
        }
        let body = {
            grant_type: 'refresh_token',
            refresh_token: token.refresh_token
        };
        axios.post(config.AUTH_URL,QueryString.stringify(body),{'Content-Type': 'application/x-www-form-urlencoded'}).then((response) => {
            if (response.status !== 200) {
                /*window.localtion = '/admin';*/
                triggerLoginModal();
                return;
            }
            const tokenResponse = { created: Date.now(), ...token, ...response.data};
            cookie.remove('tokenResponse');
            cookie.set('tokenResponse', JSON.stringify(tokenResponse),{ path: '/', maxAge: 20 * 60 });
            
            if(_sessionTimer){
                clearTimeout(_sessionTimer);
                _sessionTimer = undefined;
            }
            
            _sessionTimer = setTimeout(function(){
                triggerLoginModal();
            }, 20 * 60 * 1000);
            
            
        })
        .catch( err => { 
            cookie.remove('tokenResponse');
            /*window.localtion = '/admin';*/
            triggerLoginModal();
        } );
    }
    else if (axiosConfig.url !== config.AUTH_URL) {
        //window.location = '/admin';
    }
  
    return axiosConfig;
  }, function(err) {
    return Promise.reject(err);
  });

  axios.interceptors.response.use((response) => { // intercept the global error
    return response;
  }, function (error) {
    let originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) { // if the error is 401 and hasent already been retried
        /*window.location.href = '/admin';*/
        triggerLoginModal();
        return Promise.reject(error);
    }
//    if (error.response.status === 404 && !originalRequest._retry) {
//      /*window.location.href = '/admin';*/
//        triggerLoginModal();
//      return Promise.reject(error);
//    }
    // Do something with response error
    return Promise.reject(error);
  })

let triggerLoginModal = function(){
    console.log("you called the default trigger login modal function.");
};

const theme = createMuiTheme({typography: {fontFamily: '"inter_uiregular"'}});
export default class AppComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {hasError: false, showLoginModal: false};
        if (this.props.location.search) {
            this.state.queryString = QueryString.parse(this.props.location.search, { ignoreQueryPrefix: true });
            if (this.state.queryString) {
                cookie.set('ClientId',this.state.queryString.ClientId);
            }
        }
        
        triggerLoginModal = this.triggerLoginModal;
    }
    componentWillMount(){
        this.startErrorLog();
    }
    triggerLoginModal = () => {
        if(this.state.showLoginModal === false)
            this.setState({showLoginModal: true});
    }
    loginCompleated = () => {
        this.setState({showLoginModal: false});
    }
    startErrorLog = () => {
        window.onerror = (message,file,line,column,errorObject) => {
            column = column || (window.event && window.event.errorCharacter);
            var stack = errorObject ? errorObject.stack : null;

            //trying to get stack from IE
            if(!stack)
            {
                stack = [];
                var f = arguments.callee.caller;
                while (f)
                {
                    stack.push(f.name);
                    f = f.caller;
                }
                errorObject['stack'] = stack;
            }
            var data = {
                url: window.location.href,
                message:message,
                file:file,
                line:line,
                column:column,
                errorStack:stack,
            };
            dataShare.postLog('Log/Error', data);
            return false;
        }
    }
    componentDidCatch(error, info){
        let _postData = {
            url: window.location.href,
            message: error.toString(),
            errorStack: info.componentStack.toString()
        }
        dataShare.postLog('Log/Error', _postData);
        this.setState({hasError: true});
    }
    showNotification(type, message){
        let errorMessageStyle = { background: '#d50000', text: "#FAFAFA" };
        let warningMessageStyle = { background: '#F57F17', text: "#FAFAFA" };
        let successMessageStyle = { background: '#4CAF50', text: "#FAFAFA" };
        notify.show(message, "custom", 5000, (type === 'success' ? successMessageStyle : (type === 'error' ? errorMessageStyle :  warningMessageStyle)) );
    }
    render(){
        if(this.state.hasError === true){
            return <PageError />
        }else{
            return(
                <Router basename="/admin" >
                    <MuiThemeProvider theme={theme}>
                        <Notifications options={{zIndex: 9999, top: '50px'}} />
                        <AppLoader/>
                        <LoginModalPage showModal={this.state.showLoginModal} closeModal={this.loginCompleated} showNotification={this.showNotification} />
                        <Switch>
                            <Route exact path="/" component={(args) => <LoginPage showNotification={this.showNotification} source="loginpage" {...args}/>} />
                            <Route exact path="/ForgotPassword" component={(args) => <ForgotPasswordPage showNotification={this.showNotification} {...args}/>} />
                            <Route path="/main" component={(args) => <MainPage showNotification={this.showNotification} {...args}/>} />
                            <Route path="/builder/:prjID" component={(args) => <BuilderPage showNotification={this.showNotification} {...args}/>} />
                            <Route component={(args) => <PageNotFound showNotification={this.showNotification} {...args}/>} />
                        </Switch>
                    </MuiThemeProvider>
                </Router>
            )
        }        
    }
}

//ReactDOM.render( < AppComponent / > , document.getElementById('root'));
//
//registerServiceWorker();