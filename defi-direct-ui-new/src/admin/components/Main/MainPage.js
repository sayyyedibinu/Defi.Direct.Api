import React from "react";
import {Route, Redirect} from "react-router-dom";
import './MainPageStyle.css';

import Header from './Header/Header';
import Dashboard from './DashboardPage/DashboardPage';
import Sites from './SitesPage/SitesPage';
import Configuration from './ConfigurationPage/ConfigurationPage';
import FieldsPage from './FieldsPage/FieldsPage';
import FieldPage from './FieldPage/FieldPage';
import UsersPage from './UsersPage/UsersPage';
import IntegrationsPage from './IntegrationsPage/IntegrationsPage';
import ReportsPage from './ReportsPage/ReportsPage';
import ProfilePage from './ProfilePage/ProfilePage';
import SettingsPageRoute from './SettingsPage/SettingsPageRoute';
import Clients from './ClientsPage/ClientsPage';
import RulesPage from './RulesPage/RulesPage';
import RulePage from './RulePage/RulePage';

export default class MainComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    getReferer = () => {
        var parser = document.createElement('a');
        parser.href = document.referrer;
        return parser.hostname;
    }

    render(){
        return(
            <div>
                <Route component={Header} />
                <Route exact path={this.props.match.url+"/dashboard" } component={(args) => <Dashboard showNotification={this.props.showNotification} {...args}/>}/>
                <Route exact path={this.props.match.url+"/sites" } component={(args) => <Sites showNotification={this.props.showNotification} {...args}/>}/>
                <Route exact path={this.props.match.url+"/configuration" } component={(args) => <Configuration showNotification={this.props.showNotification} {...args}/>} />
                <Route exact path={this.props.match.url+"/fields" } component={(args) => <FieldsPage showNotification={this.props.showNotification} {...args}/>} />
                <Route exact path={this.props.match.url+"/rules" } component={(args) => <RulesPage showNotification={this.props.showNotification} {...args}/>} />
                <Route exact path={this.props.match.url+"/field/:mode/:id" } component={(args) => <FieldPage showNotification={this.props.showNotification} {...args}/>} />
                <Route exact path={this.props.match.url+"/rule/:mode/:id" } component={(args) => <RulePage showNotification={this.props.showNotification} {...args}/>} />
                <Route exact path={this.props.match.url+"/users" } component={(args) => <UsersPage showNotification={this.props.showNotification} {...args} />} />
                <Route exact path={this.props.match.url+"/integrations" } component={IntegrationsPage} />
                <Route exact path={this.props.match.url+"/reports" } component={ReportsPage} />
                <Route exact path={this.props.match.url+"/profile" } component={ProfilePage} />
                <Route path={this.props.match.url+"/site/:sitId/settings" } component={(args) => <SettingsPageRoute showNotification={this.props.showNotification} {...args}/>} />
                <Route exact path={this.props.match.url + "/"} component={() => <Redirect to={this.props.match.url + "/dashboard"} />} />
                {
                    (this.getReferer() === "baseline-qa.defidirect.com" || this.getReferer() === "baseline.defidirect.com") &&
                    <Route exact path={this.props.match.url + "/clients"} component={(args) => <Clients showNotification={this.props.showNotification} {...args} />} />
                }
           </div>
    )
}
}