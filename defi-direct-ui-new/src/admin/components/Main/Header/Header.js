import React from "react";
import './HeaderStyle.css';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';
import {Link} from "react-router-dom";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default class HeaderComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {anchorEl: null};
    }
    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    }
    handleClose = () => {
        this.setState({ anchorEl: null });
    }
    checkSiteURL = () => {
        if(this.props.location.pathname.indexOf('/main/site/') !== -1) return true;
        if(this.props.location.pathname === '/main/sites') return true;
        return false;
    }
    goTo = (url) => {
        this.props.history.push(url);
    }
    getConfigMenu = () => {
        if(this.props.location.pathname === "/main/configuration" || this.props.location.pathname === "/main/integrations" || this.props.location.pathname === "/main/fields" || this.props.location.pathname.indexOf('/main/field/') !== -1 || this.props.location.pathname === "/main/rules" || this.props.location.pathname.indexOf('/main/rule/') !== -1 === true) return true;
        return false;
    }
    render(){
        return(
            <div>
                <AppBar position="fixed" className="appBar">
                    <Toolbar>
                      <Hidden only={['md', 'lg', 'xl']}>
                        <IconButton color="inherit" className="hambergerMenu" aria-label="Menu" aria-owns={this.state.anchorEl ? 'simple-menu' : null} aria-haspopup="true" onClick={this.handleClick}>
                            <MenuIcon />
                          </IconButton>
                        <Typography variant="title" color="inherit" style={{flex: 1}}>
                            <Link to="/main/dashboard">
                                <img src={require('../../../assets/img/logo.png')} alt="Difi Direct" width="150" />
                            </Link>
                        </Typography>
                      </Hidden>
                      
                        <Menu anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)} onClose={this.handleClose} className="mobileNavItem" >
                            <MenuItem onClick={this.handleClose} className={this.props.location.pathname === "/main/dashboard"?"Selected":""}>
                                <Link to="/main/dashboard">Dashboard</Link>  
                            </MenuItem>
                            <MenuItem onClick={this.handleClose} className={this.checkSiteURL() ? "Selected" : ""}>
                                <Link to="/main/sites">Sites</Link>  
                            </MenuItem>
                            <MenuItem onClick={this.handleClose} className={this.props.location.pathname === "/main/users"?"Selected":""}>
                                <Link to="/main/users">Users</Link>
                            </MenuItem>
                            <MenuItem onClick={this.handleClose} className={this.getConfigMenu() === true ? "Selected" : ""}>
                                <Link to="/main/configuration">Configuration</Link>
                            </MenuItem>
                            <MenuItem onClick={this.handleClose} className={this.props.location.pathname === "/main/reports"?"Selected":""}>
                                <Link to="/main/reports">Reports</Link>
                            </MenuItem>
                            <MenuItem onClick={this.handleClose} className={this.props.location.pathname === "/"?"Selected":""}>
                                <Link to="/" className="imgCnt">
                                    <img src={require('../../../assets/icon/icon-userOutline.png')} alt="username" width="20" height="20" />
                                </Link>
                            </MenuItem>
                        </Menu>
                      
                      
                        <Hidden only={['xs', 'sm']}>
                            <Typography variant="title" color="inherit" style={{flex: 1, textAlign: 'left'}}>
                                <Link to="/main/dashboard">
                                    <img src={require('../../../assets/img/logo.png')} alt="Difi Direct" width="150" />
                                </Link>
                            </Typography>
                            <Button color="inherit" onClick={this.goTo.bind(null, "/main/dashboard")} className={this.props.location.pathname === "/main/dashboard"?"naveMenuItem Selected":"naveMenuItem"}>
                                Dashboard
                            </Button>
                            <Button color="inherit" onClick={this.goTo.bind(null, "/main/sites")} className={this.checkSiteURL() ? "naveMenuItem Selected" : "naveMenuItem"}>
                                Sites    
                            </Button>
                            <Button color="inherit" onClick={this.goTo.bind(null, "/main/users")} className={this.props.location.pathname === "/main/users"?"naveMenuItem Selected":"naveMenuItem"}>
                                Users
                            </Button>
                            <Button color="inherit" onClick={this.goTo.bind(null, "/main/configuration")} className={this.getConfigMenu() === true ? "naveMenuItem Selected" : "naveMenuItem"}>
                                Configuration
                            </Button>
                            <Button color="inherit" onClick={this.goTo.bind(null, "/main/reports")} className={this.props.location.pathname === "/main/reports"?"naveMenuItem Selected":"naveMenuItem"}>
                                Reports
                            </Button>
                            <Button color="inherit" onClick={this.goTo.bind(null, "/")} className={this.props.location.pathname === "/main/profile"?"naveMenuItem Selected":"naveMenuItem"}>
                                <img src={require('../../../assets/icon/icon-userOutline.png')} alt="username" width="20" height="20" />
                            </Button>
                          </Hidden>
                      
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

/*<MenuItem onClick={this.handleClose} className={this.props.location.pathname === "/main/integrations"?"Selected":""}>
                                <Link to="/main/integrations">Integrations</Link>
                            </MenuItem>
<Button color="inherit" className={this.props.location.pathname === "/main/integrations"?"naveMenuItem Selected":"naveMenuItem"}>
                                <Link to="/main/integrations">Integrations</Link>
                            </Button>*/