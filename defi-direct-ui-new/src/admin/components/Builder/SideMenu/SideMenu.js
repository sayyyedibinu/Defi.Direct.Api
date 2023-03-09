import React from "react";
import './SideMenuStyle.css';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
//import ListSubheader from '@material-ui/core/ListSubheader';


export default class SideMenuComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    render(){
        return(
            <div>
                <List className="side-nav-list" component="nav"  >
                    
                    <ListItem button onClick={this.props.openInsertField} className={this.props.pagesLength > 0 ? "side-nav-list-item" : "side-nav-list-item disabled"}>
                        <ListItemIcon>
                          <img src={require('../../../assets/img/field_new.png')} alt="Field" width="20" />
                        </ListItemIcon>
                        <ListItemText inset primary="Field" className="sidenavLabel" />
                    </ListItem>
                    <ListItem button onClick={this.props.openInsertText} className={this.props.pagesLength > 0 ? "side-nav-list-item" : "side-nav-list-item disabled"}>
                        <ListItemIcon>
                          <img src={require('../../../assets/img/text_new.png')} alt="Field" width="20" />
                        </ListItemIcon>
                        <ListItemText inset primary="Text" className="sidenavLabel" />
                    </ListItem>
                    <ListItem button onClick={this.props.openInsertImage} className={this.props.pagesLength > 0 ? "side-nav-list-item" : "side-nav-list-item disabled"}>
                        <ListItemIcon>
                          <img src={require('../../../assets/img/image_new.png')} alt="Field" width="20" />
                        </ListItemIcon>
                        <ListItemText inset primary="Image" className="sidenavLabel" />
                    </ListItem>
                    <ListItem button className={this.props.pagesLength > 0 ? "side-nav-list-item" : "side-nav-list-item disabled"}>
                        <ListItemIcon>
                          <img src={require('../../../assets/img/button_new.png')} alt="Field" width="20" />
                        </ListItemIcon>
                        <ListItemText inset primary="Button" className="sidenavLabel" />
                    </ListItem>
                </List>
                
            </div>
        )
    }
}

/*<ListItem button className="side-nav-list-item" onClick={this.props.openModal}>
                        <ListItemIcon>
                          <i className="material-icons">description</i>
                        </ListItemIcon>
                        <ListItemText inset primary="Page" />
                    </ListItem>
                    <ListItem button className={this.props.pagesLength > 0 ? "side-nav-list-item" : "side-nav-list-item disabled"}>
                        <ListItemIcon>
                          <i className="material-icons">view_stream</i>
                        </ListItemIcon>
                        <ListItemText inset primary="Step" />
                    </ListItem>*/
/*subheader={<ListSubheader component="div">INSERT</ListSubheader>}*/

/*<List component="nav" subheader={<ListSubheader component="div">SITE SETTINGS</ListSubheader>} >
                    <ListItem button className="side-nav-list-item">
                        <ListItemIcon>
                          <i className="material-icons">description</i>
                        </ListItemIcon>
                        <ListItemText inset primary="General" onClick={this.props.goToSettings} />
                    </ListItem>
                    <ListItem button className="side-nav-list-item">
                        <ListItemIcon>
                          <i className="material-icons">view_stream</i>
                        </ListItemIcon>
                        <ListItemText inset primary="Branding" onClick={this.props.goToBranding} />
                    </ListItem>
                    <ListItem button className="side-nav-list-item">
                        <ListItemIcon>
                          <i className="material-icons">web</i>
                        </ListItemIcon>
                        <ListItemText inset primary="Site Flow" onClick={this.props.goToSiteFlow} />
                    </ListItem>
                </List>*/