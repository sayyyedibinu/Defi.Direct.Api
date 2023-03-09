import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';

/*import AppConfig from '../../resources/config.json';*/
import './HeaderComponentStyle.css';

export default class HeaderComponent extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {anchorEl: null};
    }
    redirectHome = () => {
        this.props.history.push('/p/'+this.props.pageID);
    }

    getLogo = () => {
        if(Object.prototype.toString.call(this.props.logo) === '[object String]' && this.props.logo !== "")
            return this.props.logo;
        return this.props.defaultLogo;
    }
    render() {
        /*const { anchorEl } = this.state;*/
        return (
            <AppBar position="static" className="headerCmp">
                <Toolbar>
                    <Grid container spacing={0}>
                        <Grid item xs={6} sm={4} md={4} className="logoCnt">
                            <a href={ this.props.customLogoUrl ? this.props.customLogoUrl.toLowerCase().indexOf("http://") > -1 || this.props.customLogoUrl.toLowerCase().indexOf("https://") > -1? this.props.customLogoUrl:'//'+this.props.customLogoUrl:this.props.customLogoUrl} className={this.props.customLogoUrl ? "activeLink" : "inactiveLink"} target={this.props.openNewTab ? "_blank" : ""}><img src={this.getLogo()} alt={this.props.title} /></a>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

        );
    }
    
}