import React from "react";
import './SettingsPageStyle.css';
import GeneralPage from '../General/GeneralPage';
import BrandingPage from '../Branding/BrandingPage';
import SiteflowPage from '../Siteflow/SiteflowPage';
import config from "../../../../resources/config.json";
import dataShare from "../../../Common/dataShare";
import ApplicationPage from '../Application/ApplicationPage';
import DeleteConfirmationModal from '../Modal/deleteConfirmationModal';
import VersionsPage from '../Versions/VersionsPage';
import DecisionPage from '../Decision/DecisionPage';
import MultiSessionPage from '../MultiSession/MultiSessionComponent';


import {BrowserRouter as Router, Route, Link, Prompt, Redirect} from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';

const Switch_Theme = createMuiTheme({
   palette: {
       primary: {main: '#f5bd47'},
       secondary: {main: '#f5bd47'}
   }
});

export default class SettingsPageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {redirect: false, currentTab: 0, showDeleteModal: false, data: {site:{settings:{}}},isPublished:false, askToLeave: false};
        if(this.props.location.pathname.indexOf('/settings/general') !== -1) this.state.currentTab = 0;
        else if(this.props.location.pathname.indexOf('/settings/branding') !== -1) this.state.currentTab = 1;
        else if(this.props.location.pathname.indexOf('/settings/application') !== -1) this.state.currentTab = 2;
        else if(this.props.location.pathname.indexOf('/settings/decision') !== -1) this.state.currentTab = 3;
        else if(this.props.location.pathname.indexOf('/settings/versions') !== -1) this.state.currentTab = 4;
        else if(this.props.location.pathname.indexOf('/settings/multisession') !== -1) this.state.currentTab = 5;        
        else this.state.currentTab = 0;
    }
    componentDidMount = () => {
        this.getSiteSettings();
    }
    getSiteSettings = () => {
        dataShare.getSiteDetails(this.props.sitId, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
                return;
            }
            this.setState({data: response.site, isPublished:response.isPublished});
        });
        /*document.dispatchEvent(new CustomEvent("showAppLoader"));
        axios.get(config.API_BASE_URL+'Sites/'+this.props.sitId).then( (response) => {
            if(response.status !== 200) {
                this.props.showNotification('error', response.data);
                return;
            }
            this.setState({data: response.data});
        }, (error) => {
            this.props.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
        }).finally( () => {
            document.dispatchEvent(new CustomEvent("hideAppLoader"));
        });*/
    }
    deleteSite = () => {
        /*if(!window.confirm('Are you sure to delet this site?')) return;*/
        document.dispatchEvent(new CustomEvent("showAppLoader"));
        axios.delete(config.API_BASE_URL+'Sites/'+this.props.sitId).then( (response) => {
            if(response.status !== 200) {
                this.props.showNotification('error', response.data);
                return;
            }
            this.setState({redirect: true});
        }, (error) => {
            this.props.showNotification('error', 'Internal server error while deleting site, please try after sometime.');
        }).finally( () => {
            document.dispatchEvent(new CustomEvent("hideAppLoader"));
        });
    }
    saveSettings = (title, settings, logo) => {
        /*console.log(title, settings);*/
        let _postData = this.state.data;
            _postData.site.settings = settings;
            _postData.site.title = title;
        if(Object.prototype.toString.call(logo) !== "[object Undefined]")
            _postData.logo = logo;
        document.dispatchEvent(new CustomEvent("showAppLoader"));
        axios.post(config.API_BASE_URL+'Sites', _postData).then( (response) => {
            if(response.status !== 200) {
                this.props.showNotification('error', response.data);
                return;
            }
            this.setState({askToLeave: false});
            this.props.showNotification('success', 'Settings saved successfully.');
        }, (error) => {
            console.error(error.response.data);
            if (error.response.status === 409)
                this.props.showNotification('error', error.response.data);
            else
                this.props.showNotification('error', 'Internal server error while saving site information, please try after sometime.');
        }).finally( () => {
            document.dispatchEvent(new CustomEvent("hideAppLoader"));
        });
    }
    handleDataChange = () => {
        this.setState({askToLeave: true});
    }
    handleChange = (event, value) => {
        /*this.setState({currentTab: value});*/
        let _param = 'general';
        if(value === 0) _param = 'general';
        else if(value === 1) _param = 'branding';
        else if(value === 2) _param = 'application';
        else if(value === 4) _param = 'versions'
        else if(value === 3) _param = 'decision'
        else if(value === 5) _param = 'multisession'
        else _param = 'general';
        this.props.switchTab(_param);
    }
    render(){
        if (this.state.redirect) {
            return <Redirect push to="/main/sites" />;
        }
        return(
            <Grid container spacing={0} className="settingsPageWrapper">
                
                <Prompt
                    when={this.state.askToLeave === true}
                    message={() => {
                        return `Are you sure you want to leave?  You could lose your data.`;
                    }
                    }
                />

                <DeleteConfirmationModal showModal={this.state.showDeleteModal} closeModal={() => this.setState({showDeleteModal: false})} submitModal={this.deleteSite} />
            
                <Hidden only={['xs', 'sm']}>
                    <Grid item md={1} lg={1} xl={2}></Grid>
                </Hidden>
                <Grid item xs={12} md={10} lg={10} xl={8}>
                    <Grid container spacing={0} className="headerRowCnt">
                        <Grid item xs={12} sm={4} className="breadCrumbCnt">
                            <span><Link to="/main/sites">All Sites</Link> / </span>
                            <span>{!this.state.data.site ? '':this.state.data.site.title}</span>
                        </Grid>
                        <Grid item xs={12} sm={8} className="headerBtnCnt">
                            <Button variant="contained" className="edit appSecondaryBGClr" onClick={this.props.goToBuilder}>
                                Site Editor
                            </Button>
                            {this.state.isPublished ? null:
                            <Button variant="contained" className="delete appSecondaryClr" onClick={() => this.setState({showDeleteModal: true})}>
                                Delete Site
                            </Button>
                            }
                        </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                        <Grid item xs={12} style={{'overflow': 'auto'}}>
                            <MuiThemeProvider theme={Switch_Theme}>
                                <Tabs value={this.state.currentTab} onChange={this.handleChange}>
                                    <Tab label="General" className="tabCnt" />
                                    <Tab label="Branding" className="tabCnt" />
                                    <Tab label="Application" className="tabCnt" />                                    
                                    <Tab label="Decision" className="tabCnt" />
                                    <Tab label="Version History" className="tabCnt" />
                                    <Tab label="Multi Session" className="tabCnt" />
                                </Tabs>
                            </MuiThemeProvider>
                            
                        </Grid>
                        <Grid item xs={12} className="settingMainCnt">
                        {
                            this.state.currentTab === 0 && <GeneralPage data={this.state.data.site} saveSettings={this.saveSettings} handleDataChange={this.handleDataChange} />
                        }
                        {
                            this.state.currentTab === 1 && <BrandingPage logo={this.state.data.logo} data={this.state.data.site} saveSettings={this.saveSettings} handleDataChange={this.handleDataChange} />
                        }
                        {
                            /*this.state.currentTab === 4 && <SiteflowPage data={this.state.data.site} saveSettings={this.saveSettings} handleDataChange={this.handleDataChange} />*/
                        }
                        {
                            this.state.currentTab === 2 && <ApplicationPage data={this.state.data.site} saveSettings={this.saveSettings} handleDataChange={this.handleDataChange} />
                        }                        
                        {
                            this.state.currentTab === 3 && <DecisionPage data={this.state.data.site} saveSettings={this.saveSettings} showNotification={this.props.showNotification} goToBuilder={this.props.goToBuilder} handleDataChange={this.handleDataChange} />
                        }
                        {
                            this.state.currentTab === 4 && <VersionsPage data={this.props.sitId} saveSettings={this.saveSettings} showNotification={this.props.showNotification} goToBuilder={this.props.goToBuilder} handleDataChange={this.handleDataChange} />
                        }
                        {
                            this.state.currentTab === 5 && <MultiSessionPage data={this.state.data.site} saveSettings={this.saveSettings} showNotification={this.props.showNotification} goToBuilder={this.props.goToBuilder} handleDataChange={this.handleDataChange} />
                        }
                        </Grid>
                    </Grid>
                    
                </Grid>
                <Hidden only={['xs', 'sm']}>
                    <Grid item md={1} lg={2} xl={2}></Grid>
                </Hidden>
                
            </Grid>
        )
    }
}