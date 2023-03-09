import React from "react";
import {Route, Redirect} from "react-router-dom";

import SettingsPage from './page/SettingsPage';

export default class SettingsPageRouteComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {data: {}};
    }
    goToBuilder = () => {
        this.props.history.push('/builder/'+this.props.match.params.sitId);
    }
    switchTab = (_params) => {
        this.props.history.push('/main/site/'+this.props.match.params.sitId+'/settings/'+_params);
    }
   
    render(){
        return(
            <div>
                <Route exact path={this.props.match.url+"/general" } component={(args) => <SettingsPage sitId={this.props.match.params.sitId} data={this.state.data} goToBuilder={this.goToBuilder} switchTab={this.switchTab} showNotification={this.props.showNotification} {...args}/>} />
                <Route exact path={this.props.match.url+"/branding" } component={(args) => <SettingsPage sitId={this.props.match.params.sitId} data={this.state.data} goToBuilder={this.goToBuilder} switchTab={this.switchTab} showNotification={this.props.showNotification} {...args}/>} />
                <Route exact path={this.props.match.url+"/application" } component={(args) => <SettingsPage sitId={this.props.match.params.sitId} data={this.state.data} goToBuilder={this.goToBuilder} switchTab={this.switchTab} showNotification={this.props.showNotification} {...args}/>} />               
                <Route exact path={this.props.match.url+"/versions" } component={(args) => <SettingsPage sitId={this.props.match.params.sitId} data={this.state.data} goToBuilder={this.goToBuilder} switchTab={this.switchTab} showNotification={this.props.showNotification} {...args}/>} />              
                <Route exact path={this.props.match.url+"/decision" } component={(args) => <SettingsPage sitId={this.props.match.params.sitId} data={this.state.data} goToBuilder={this.goToBuilder} switchTab={this.switchTab} showNotification={this.props.showNotification} {...args}/>} /> 
                <Route exact path={this.props.match.url+"/multisession" } component={(args) => <SettingsPage sitId={this.props.match.params.sitId} data={this.state.data} goToBuilder={this.goToBuilder} switchTab={this.switchTab} showNotification={this.props.showNotification} {...args}/>} />             
                <Route exact path={this.props.match.url+"/" } component={() => <Redirect to={this.props.match.url+"/general"} />} />
            </div>
        )
    }
}