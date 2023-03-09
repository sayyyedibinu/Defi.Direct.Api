import React from "react";
import {Link} from "react-router-dom";
import Grid from '@material-ui/core/Grid';

import dataShare from "../../Common/dataShare";
import './DashboardPageStyle.css';

export default class DashboardComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    componentDidMount = () => {
        this.getSiteList();
    }
    getSiteList = () => {
        dataShare.getForcedSiteList((error, response) => {});
    }
    getReferer = () => {
        var parser = document.createElement('a');
        parser.href = document.referrer;
        return parser.hostname;
    }
    
    render(){
        return(
            <div className="db-MainWrapper">
                <div className="db-Container">
                    <Grid container>
            
                        <Grid item md={4} sm={6} xs={12} className="db-gridContainer">
                            <Link to="/main/sites">
                                <div className="db-gridItems">
                                    <img src={require('../../../assets/img/sites.png')} alt="SITES" />
                                    <p className="header1">SITES</p>
                                    <p className="desc">Manage sites. Create a new site or edit an existing site.</p>
                                </div>
                            </Link>
                            
                        </Grid>
                        
                        <Grid item md={4} sm={6} xs={12} className="db-gridContainer">
                            <Link to="/main/users">
                                <div className="db-gridItems">
                                    <img src={require('../../../assets/img/users.png')} alt="USERS" />
                                    <p className="header1">USERS</p>
                                    <p className="desc">Manage users. Add new users or edit existing users.</p>
                                </div>
                            </Link>
                        </Grid>
                      
                        <Grid item md={4} sm={6} xs={12} className="db-gridContainer">
                            <Link to="/main/configuration">
                                <div className="db-gridItems">
                                    <img src={require('../../../assets/img/configuration.png')} alt="CONFIGURATION" />
                                    <p className="header1">CONFIGURATION</p>
                                    <p className="desc">Create new or edit existing Fields, Integrations, and Rules.</p>
                                </div>
                            </Link>
                        </Grid>
                        {
                            (this.getReferer() === "baseline-qa.defidirect.com" || this.getReferer() === "baseline.defidirect.com") &&
                            <Grid item md={4} sm={6} xs={12} className="db-gridContainer">
                                <Link to="/main/clients">
                                    <div className="db-gridItems">
                                        <img src={require('../../../assets/img/clients.png')} alt="CLIENTS" />
                                        <p className="header1">CLIENTS</p>
                                        <p className="desc">Manage clients. Add new clients or edit existing clients.</p>
                                    </div>
                                </Link>
                            </Grid>
                        }                 

                        <Grid item md={4} sm={6} xs={12} className="db-gridContainer">
                            <Link to="/main/reports">
                                <div className="db-gridItems">
                                    <img src={require('../../../assets/img/reports.png')} alt="REPORTS" />
                                    <p className="header1">REPORTS</p>
                                    <p className="desc">Explore data for your applications.</p>
                                </div>
                            </Link>
                        </Grid> 
            
                    </Grid>
                </div>
            </div>
        )
    }
}
