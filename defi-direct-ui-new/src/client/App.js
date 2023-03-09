import React from 'react';
import axios from 'axios';
import config from "./resources/config.json";
import './App.css';
import PageError from './components/500/500';
import PageNotFound from './components/404/404';
import AppLoader from './components/Loader/AppLoader';
import HeaderComponent from './components/Header-Component/HeaderComponent';
import FooterComponent from './components/Footer-Component/FooterComponent';
import HomePageComponent from './components/HomePage-Component/HomePageComponent';
import PersonalLoanComponent from './components/PersonalLoan-Component/PersonalLoanComponent';
import PendingComponent from './components/PendingComponent/PendingComponent';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import GetAppData from './components/Common/GetAppData';
import Notifications, {notify} from 'react-notify-toast';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import QueryString from 'qs';
import DecisionComponent from './components/DecisionComponent/DecisionComponent';
import UserLoginPage from './components/UserLogIn/UserLoginPageComponent';
import dataShare from '../admin/components/Common/dataShare';

import TestInputMaskComponent from './components/testInputMaskComponent';


export default class AppComponent extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {hasError: false, pageID: '',siteVersionId: '', AppData: GetAppData.fromLocal(), flgVersion: false, isActive:false ,theme: createMuiTheme({typography: {fontFamily: '"inter_uiregular"'}}), color: {primary: "#7068e2", secondary: "#5bd36d", background: "#FCFCFD", backgroundClass: "lg1"}, queryString: '',appId:''};
        this.state.defaultLogo = this.state.AppData.logo;
        if (this.props.location.search) {

            this.state.queryString = QueryString.parse(this.props.location.search, { ignoreQueryPrefix: true });
        }
        
        if(this.props.match.isExact)
            this.state.pageID = this.props.location.search.replace('?', '');
        else{
            if(this.props.location.pathname.indexOf('/p/') !== -1)
                this.state.pageID = this.props.location.pathname.replace('/p/', '');
            if(this.props.location.pathname.indexOf('/Application/WorkingCopy/') !== -1){
                this.state.queryString = "WorkingCopy";
            }
            
            if(this.props.location.pathname.indexOf('/Application/') !== -1 && this.props.location.pathname.indexOf('/Application/WorkingCopy/') == -1 && this.props.location.pathname.indexOf('/Application/Version/') == -1){
                this.state.pageID = this.props.location.pathname.replace('/Application/', '');
                this.state.flgVersion = true;
                this.state.isActive = true;
                axios.get(config.API_BASE_URL+'sites/getSiteId/'+this.state.pageID).then( (response) => {
                    //console.info(null, response.data);
                    this.setState({pageID:response.data});
                    this.getApplicationData();
                }, (error) => {
                    console.error(error);
                });  
            }
            if(this.props.location.pathname.indexOf('/Application/WorkingCopy/') !== -1){
                this.state.pageID = this.props.location.pathname.replace('/Application/WorkingCopy/', '');
                this.state.flgVersion = false;
                this.state.isActive = false;
            }
            if(this.props.location.pathname.indexOf('/Success/') !== -1)
                this.state.pageID = this.props.location.pathname.replace('/Success/', '');
            if(this.props.location.pathname.indexOf('/Pending/') !== -1)
                this.state.pageID = this.props.location.pathname.replace('/Pending/', '');
            if(this.props.location.pathname.indexOf('/Application/Version/') !== -1)
                {
                    this.state.pageID = this.props.location.pathname.replace('/Application/Version/', '');
                    this.state.flgVersion=true;
                    this.state.isActive = false;
                }
            
            let _urlPath = this.props.location.pathname;
            _urlPath = _urlPath.toLowerCase();
            if(_urlPath.indexOf('/userlogin/') !== -1)
                {
                    this.state.appId = _urlPath.replace('/userlogin/', '');
                    dataShare.getSiteInfo(this.state.appId, (error, response) => {
                        if (!error)
                         {
                            this.state.pageID=response.siteId; 
                            this.setState({appId: _urlPath.replace('/userlogin/', ''),pageID:response.siteId, AppData: response.siteDetails});

                         }
                    });                
                }

				
        }
    }
    
    componentWillMount(){
        this.startErrorLog();
    }
    startErrorLog = () => {
        
        window.onerror = (message,file,line,column,errorObject) => {
            column = column || (window.event && window.event.errorCharacter);
            var stack = errorObject ? errorObject.stack : null;

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
            axios.post(config.API_BASE_URL+'Log/Error', data).then( (response) => {
                console.info(null, response.data);
            }, (error) => {
                console.error(error);
            });
            return false;
        }        
    }
    
    componentDidCatch(error, info){
        this.setState({hasError: true});
        let _postData = {
            url: window.location.href,
            message: error.toString(),
            errorStack: info.componentStack.toString()
        }
        axios.post(config.API_BASE_URL+'Log/Error', _postData).then( (response) => {
            console.info(null, response.data);
        }, (error) => {
            console.error(error);
        });
    }
    getApplicationData = () => {
        GetAppData.fromAPI(this.state.pageID, this.state.flgVersion, this.state.isActive, this.state.queryString, (error, response) => {
            if(error){
                alert('Internal server error, please try after sometime.');
                return;
            }
            this.setState({AppData: response,siteVersionId: response.id});
            if(response.site.settings){
                let _color = this.state.color;
                
                if(response.site.settings.defaultPrimary){
                    let _p_color = response.site.settings.defaultPrimary.replace('#', '');
                    if(_p_color.length === 3)
                        _color.primary = response.site.settings.defaultPrimary;
                    else if(_p_color.length === 6)
                        _color.primary = response.site.settings.defaultPrimary;
                }
                if(response.site.settings.defaultSecondary){
                    let _s_color = response.site.settings.defaultSecondary.replace('#', '');
                    if(_s_color.length === 3)
                        _color.secondary = response.site.settings.defaultSecondary;
                    else if(_s_color.length === 6)
                        _color.secondary = response.site.settings.defaultSecondary;
                }
                if(response.site.settings.defaultBackground){
                    let _b_color = response.site.settings.defaultBackground.replace('#', '');
                    if(_b_color.length === 3)
                        _color.background = response.site.settings.defaultBackground;
                    else if(_b_color.length === 6)
                        _color.background = response.site.settings.defaultBackground;
                    
                    if(_color.background === "#FCFCFD") _color.backgroundClass = "lg1";
                    if(_color.background === "#E5E5E5") _color.backgroundClass = "lg2";
                    if(_color.background === "#E8E8E8") _color.backgroundClass = "lg3";
                    if(_color.background === "#DFDFDF") _color.backgroundClass = "lg4";
                }
                
                let _themePatter = {
                    primary: {main: _color.primary},
                    secondary: {main: _color.secondary}
                }
                let typography = {
                    fontFamily: '"inter_uiregular"'
                }
                try{
                    this.setState({color: _color, theme: createMuiTheme({palette: _themePatter, typography: typography}) });
                }catch (e) {
                    this.componentDidCatch(e, {componentStack: e});
                }
            }
        });
    }
    componentDidMount = () =>{
        let _urlPath = this.props.location.pathname;
        _urlPath = _urlPath.toLowerCase();
        
        if (_urlPath.indexOf('/userlogin/') !== -1) return;
        if(!(_urlPath.indexOf('/application/') !== -1 && (_urlPath.indexOf('/application/workingcopy/') == -1 && _urlPath.indexOf('/application/version/') == -1)))
        {
            this.getApplicationData();
        }        
       
    }
    getAppData = () => {
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
            return (
                <Router>
                    <MuiThemeProvider theme={this.state.theme}>
                        <div className={this.state.color.backgroundClass}>
                            <AppLoader />
                            <Notifications options={{zIndex: 9999, top: '50px'}} />

                            <Route component={(args) => <HeaderComponent pageID={this.state.pageID} logo={this.state.AppData.logo} title={this.state.AppData.site.title} 
                                customLogoUrl={(this.state.AppData.site.settings && this.state.AppData.site.settings.customLogoUrl) ? this.state.AppData.site.settings.customLogoUrl : ''} 
                                openNewTab={(this.state.AppData.site.settings && this.state.AppData.site.settings.openNewTab) ? this.state.AppData.site.settings.openNewTab : true}
                                defaultLogo={this.state.defaultLogo} showNotification={this.showNotification} color={this.state.color} {...args} />} />

                            

                            <div className="mainCnt">

                                <Switch>
                                    <Route exact path="/" component={() => <Redirect to={"/p/"+this.state.pageID} />} />
            
                                    <Route exact path="/test" component={(args) => <TestInputMaskComponent />} />

                                    <Route exact path="/Application/:pID" component={(args) => <PersonalLoanComponent pageID={this.state.pageID} updateAppData={this.getAppData} fromVersion="false" AppData={this.state.AppData.site} showNotification={this.showNotification} versionId='null' color={this.state.color} {...args} queryString={this.state.queryString} dobSafariIssueFixARP62964 = {this.state.AppData.dobSafariIssueFixARP62964} mandatoryFieldBugARP65007 = {this.state.AppData.mandatoryFieldBugARP65007}/>} />

                                    <Route exact path="/Success/:pID" component={(args) => <DecisionComponent  pageID={this.state.pageID} color={this.state.color} AppData={this.state.AppData} {...args} />} />
                                    <Route exact path="/Pending/:pID" component={(args) => <PendingComponent pageID={this.state.pageID} color={this.state.color} AppData={this.state.AppData} {...args} />} />
                                    <Route exact path="/Application/Version/:pID" component={(args) => <PersonalLoanComponent pageID={this.state.siteVersionId} updateAppData={this.getAppData} fromVersion="true" AppData={this.state.AppData.site} showNotification={this.showNotification} versionId={this.state.pageID} color={this.state.color} {...args}  dobSafariIssueFixARP62964 = {this.state.AppData.dobSafariIssueFixARP62964} mandatoryFieldBugARP65007 = {this.state.AppData.mandatoryFieldBugARP65007}/>} />
                                    <Route exact path="/Application/WorkingCopy/:pID" component={(args) => <PersonalLoanComponent pageID={this.state.pageID} updateAppData={this.getAppData} fromVersion="false" AppData={this.state.AppData.site} showNotification={this.showNotification} versionId='null' color={this.state.color} {...args}  dobSafariIssueFixARP62964 = {this.state.AppData.dobSafariIssueFixARP62964} mandatoryFieldBugARP65007 = {this.state.AppData.mandatoryFieldBugARP65007}/>} />
                                    <Route exact path="/UserLogin/:pID" component={(args) => <UserLoginPage appId={this.state.appId} pageID={this.state.pageID} color={this.state.color} {...args} />} showNotification={this.showNotification}/>
                                        
                                    <Route component={(args) => <PageNotFound {...args}/>} />
                                </Switch>
                                
                                <Route component={(args) => <FooterComponent data={this.state.AppData.site.settings} {...args} />} />

                            </div>
                        </div>
                    </MuiThemeProvider>

                </Router>
            );
        }
        
    }
}
