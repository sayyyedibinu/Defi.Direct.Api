import React from "react";
import {Link} from "react-router-dom";
import Grid from '@material-ui/core/Grid';

import dataShare from "../../Common/dataShare";
import './ConfigurationPageStyle.css';

export default class ConfigurationPageComponent extends React.Component{
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
    render(){
        return(
            <div className="cf-MainWrapper">
                <div className="cf-Container">
                    <Grid container>
            
                        <Grid item md={4} sm={6} xs={12} className="cf-gridContainer">
                            <Link to="/main/fields">
                                <div className="cf-gridItems">
                                    <img src={require('../../../assets/img/Fields.png')} alt="FIELDS" />
                                    <p className="header1">FIELDS</p>
                                    <p className="desc">Manage fields. Create a new field or edit an existing field.</p>
                                </div>
                            </Link>
                            
                        </Grid>
                        
                        <Grid item md={4} sm={6} xs={12} className="cf-gridContainer">
                            <Link to="/main/integrations">
                                <div className="cf-gridItems">
                                    <img src={require('../../../assets/img/integrations.png')} alt="INTEGRATIONS" />
                                    <p className="header1">INTEGRATIONS</p>
                                    <p className="desc">Manage integrations. Create a new integration or edit an existing integration.</p>
                                </div>
                            </Link>
                        </Grid>
                      
                        <Grid item md={4} sm={6} xs={12} className="cf-gridContainer">
                            <Link to="/main/rules">
                                <div className="cf-gridItems">
                                    <img src={require('../../../assets/img/rules.png')} alt="RULES" />
                                    <p className="header1">RULES</p>
                                    <p className="desc">Manage rules. Create new rules or edit an existing rule.</p>
                                </div>
                            </Link>
                        </Grid>
            
                    </Grid>
                </div>
            </div>
        )
    }
}
