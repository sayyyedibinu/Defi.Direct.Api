import React from "react";
import './HeaderStyle.css';
import dataShare from "../../Common/dataShare";

import {Link} from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
/*import Select from '@material-ui/core/Select';*/
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import fileDownload from 'js-file-download';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import RefreshConfirmation from "./refreshConfirmation";
import PublishModal from "./publishModal";
import Select from '@material-ui/core/Select';

export default class HeaderComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {curSitId: this.props.sitId,siteName: this.props.siteTitle, previewURL: window.location.origin+'/Application/'+this.props.sitId, selectedPage: this.props.selectedPage, arrowRef: null, anchorEl: null, anchorEl_page: null, refresh:false, showPublishModal:false, workcopypreviewURL: window.location.origin+'/Application/WorkingCopy/'+this.props.sitId ,clientpreviewURL: window.location.origin+'/Application/'+this.props.customUrl,customUrl: this.props.customUrl, propsReady:false, selectedMenuItem:'Application'};
        
    }
    componentDidUpdate = (prevProps) => {        
        if (prevProps.sitId !== this.props.sitId){
            this.setState({curSitId: this.props.curSitId, previewURL: window.location.origin+'?'+this.props.sitId, workcopypreviewURL: window.location.origin+'?'+this.props.sitId});
        }
        if(prevProps.siteTitle !== this.props.siteTitle)
        { this.setState({siteName: this.props.siteTitle});
        }
        if(prevProps.customUrl !== this.props.customUrl)
        { this.setState({customUrl: this.props.customUrl,clientpreviewURL: window.location.origin+'/Application/'+this.props.customUrl});
        }
        if(prevProps.selectedPage !== this.props.selectedPage)
        { this.setState({selectedPage: this.props.selectedPage});
        }
    }
    componentWillReceiveProps = () => {
        this.setState({propsReady:true});
    }
    refreshSite = () => {
        this.setState({refresh:true});
    }
    confirmRefresh = () =>{
        this.setState({refresh:false});
        this.props.refreshSite();
    }
    publishSite = () => {
        this.setState({showPublishModal:true});
    }
    confirmPublish = (obj) =>{
        this.setState({showPublishModal:false});
        this.props.publishSite(obj);
    }
    downloadSchema = () => {
        
        if (this.state.selectedPage === "Application" || this.state.selectedPage === "Pending" || this.state.selectedPage === "Decision")
        {
         
            dataShare.getXSD(this.state.curSitId, (error, response) => {
                if(error){
                    this.props.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
                    return;
                }
                fileDownload(response.data, this.state.siteName /*+ '-'+ this.state.selectedPage*/ +'.xsd');
            });
        }
    }
    fillPageDropDown = (_array) => {
        return (
            _array.map( (_choice, _index) => {
                return <MenuItem key={_choice+_index} value={_choice} className="pagesDropdownBoxItems">{_choice}</MenuItem>
            })
        );
    }
    handleArrowRef = (node) => {
        this.setState({
          arrowRef: node,
        });
    };

    handleClick = (event) => {
        this.setState({ anchorEl: event.target });
    }
    
    handlePageMenuClick = (event) => {
        this.setState({ anchorEl_page: event.target });
    }
    
    handleClose = () => {
        this.setState({ anchorEl: null });
    }
    
    handlePageMenuClose = () => {
        this.setState({ anchorEl_page: null });
    }
    
    handlePageMenuSelect = (pageID) => {
        let _event = {target: {value: pageID}};
        this.setState({ anchorEl_page: null });
        this.inputChanged(_event);
    }
    
    preview = () => {
        this.props.previewSite(this.state.workcopypreviewURL);
        /*window.open(this.state.workcopypreviewURL);*/        
    }
    copieToClipboard = () => {
        if(!this.props.isPublished){
            this.props.showNotification('warning', 'This site is not yet published, Please publish your changes to get the URL');
        }
    }
    copiedToClipboard = () => {
        this.props.showNotification('success', 'URL Copied to Clipboard.');
    }
    inputChanged = (e) => {
        this.setState({selectedMenuItem:e.target.value});
        this.props.changePage(e.target.value);
    }
    renderURLSection = () => {
        if(this.state.propsReady){
            if(this.props.isPublished){
                return(
                    <Tooltip
                    title={
                      <React.Fragment>
                        Get URL
                        <span ref={this.handleArrowRef} />
                      </React.Fragment>
                    }
                  > 
                  <CopyToClipboard text={this.state.clientpreviewURL}
                    onCopy={this.copiedToClipboard}>
                    <i className="material-icons">link</i>
                  </CopyToClipboard>
                  </Tooltip>
                  );
            }
            else{
                return(
                    <Tooltip
                    title={
                      <React.Fragment>
                        Get URL
                        <span ref={this.handleArrowRef} />
                      </React.Fragment>
                    }
                  > 
                  <i className="material-icons">link</i>
                  </Tooltip>
                );
            }
        }
    }
    render(){
        return(
            <AppBar position="fixed" className="builder-appBar">
                <Toolbar className="appToolbar">
                    <span className="appLogo">
                        <Link to="/main/dashboard">
                            <img src={require('../../../assets/img/logo.png')} alt="Difi Direct" width="150" height="35" />
                        </Link>
                    </span>
                    {
                        this.props.pages.length > 0 && 
                        <Hidden only={['xs']}>
                            <span className="pagesDropdown">
                                <Link to="/main/sites">Sites</Link> / <span className="builderPageTitle">{this.props.siteTitle}</span> / 
                                <Select style={{color:"#AAA29E",height:"39px",fontSize:"16px",paddingLeft:"10px"}} value={this.state.selectedMenuItem} name="pageMenu" onChange={(e)=>this.inputChanged(e)}>
                                    <MenuItem value="Application">Application</MenuItem>
                                    <MenuItem value="Decision">Decision</MenuItem>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                </Select>
                            </span>
                        </Hidden>
                    }
                    
                    <Hidden only={['xs', 'sm']}>
                        <span className="centerMenuItems">
                            <span className={this.props.pages.length === 0 ? 'disabled':''} onClick={ () => this.props.changeDisplayMode('mobile')}>
                                <i className={this.props.displayMode === 'mobile' ? "material-icons selected" : "material-icons"}>smartphone</i>
                            </span>
                            <span className={this.props.pages.length === 0 ? 'disabled':''} onClick={ () => this.props.changeDisplayMode('tab')}>
                                <i className={this.props.displayMode === 'tab' ? "material-icons selected" : "material-icons"}>tablet</i>
                            </span>
                            <span className={this.props.pages.length === 0 ? 'disabled':''} onClick={ () => this.props.changeDisplayMode('default')}>
                                <i className={this.props.displayMode === 'default' ? "material-icons selected" : "material-icons"}>computer</i>
                            </span>
                        </span>
                    </Hidden>
                    
                    <Hidden only={['xs','sm']}>
                        <span className="rightMenuItems">
                          <span onClick={this.publishSite} style={{textAlign:this.props.unPublishedChanges?"right":null,width:this.props.unPublishedChanges?"62px":null}}>
                                <Tooltip
                                  title={
                                    <React.Fragment>
                                      {this.props.unPublishedChanges?"Unpublished changes detected!":"Publish"} 
                                      <span ref={this.handleArrowRef} />
                                    </React.Fragment>
                                  }
                                >
                                <i className="material-icons">publish
                                <i className="material-icons errorIcon" style={{color:"red",verticalAlign:"middle", fontSize:"20px", display: this.props.unPublishedChanges?null:"none"}}>error</i>
                                </i>
                                </Tooltip>
                          </span>
                          <span onClick={this.refreshSite}>
                                <Tooltip
                                  title={
                                    <React.Fragment>
                                      Refresh
                                      <span ref={this.handleArrowRef} />
                                    </React.Fragment>
                                  }
                                >

                                <i className="material-icons">refresh</i>
                                </Tooltip>
                            </span>
                            <span onClick={this.downloadSchema}>
                                <Tooltip
                                  title={
                                    <React.Fragment>
                                      Download XSD
                                      <span ref={this.handleArrowRef} />
                                    </React.Fragment>
                                  }
                                >

                                <i className="material-icons">settings_ethernet</i>
                                </Tooltip>
                            </span>
                            <span onClick={this.copieToClipboard}>
                                {this.state.propsReady &&
                                   this.renderURLSection()
                                }
                            </span>
                            <span onClick={this.preview}>
                                <Tooltip
                                  title={
                                    <React.Fragment>
                                      Preview
                                      <span ref={this.handleArrowRef} />
                                    </React.Fragment>
                                  }
                                >
                                  <i className="material-icons">visibility</i>

                                </Tooltip>
                            </span>
                            <span onClick={this.props.goToSettings}>
                                <Tooltip
                                  title={
                                    <React.Fragment>
                                      Settings
                                      <span ref={this.handleArrowRef} />
                                    </React.Fragment>
                                  }
                                >
                                  <i className="material-icons">settings</i>
                                </Tooltip>
                            </span>
                        </span>
                    </Hidden>
                    
                    <Hidden only={['md', 'lg', 'xl']}>
                        <span className="rightMenuItems2">
                            <IconButton color="inherit" className="hambergerMenu" aria-label="Menu" aria-owns={this.state.anchorEl_page ? 'simple-menu' : null} aria-haspopup="true" onClick={this.handlePageMenuClick}>
                                <i className="material-icons">settings</i>
                            </IconButton>
                        </span>
                    </Hidden>

                    <Menu anchorEl={this.state.anchorEl_page} open={Boolean(this.state.anchorEl_page)} onClose={this.handlePageMenuClose} className="mobileNavItem" >
                        <MenuItem onClick={(event) => {this.handlePageMenuSelect('Application')}} className={this.state.selectedMenuItem === "Application" ? "selectedPage" : ""}>
                            Application 
                        </MenuItem>
                        <MenuItem onClick={(event) => {this.handlePageMenuSelect('Decision')}} className={this.state.selectedMenuItem === "Decision" ? "selectedPage" : ""}>
                            Decision 
                        </MenuItem>
                        <MenuItem onClick={(event) => {this.handlePageMenuSelect('Pending')}} className={this.state.selectedMenuItem === "Pending" ? "selectedPage" : ""}>
                            Pending 
                        </MenuItem>
                    </Menu>

                    <Hidden only={['md', 'lg', 'xl']}>
                        <span className="rightMenuItems">
                            <IconButton color="inherit" className="hambergerMenu" aria-label="Menu" aria-owns={this.state.anchorEl ? 'simple-menu' : null} aria-haspopup="true" onClick={this.handleClick}>
                                <MenuIcon />
                            </IconButton>
                        </span>
                    </Hidden>

                    <Menu anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)} onClose={this.handleClose} className="mobileNavItem" >
                        <MenuItem onClick={(event) => {this.handleArrowRef(event);this.publishSite()}}>
                            Publish 
                        </MenuItem>
                        <MenuItem onClick={(event) => {this.handleArrowRef(event);this.refreshSite()}}>
                            Refresh 
                        </MenuItem>
                        <MenuItem onClick={(event) => {this.handleArrowRef(event);this.downloadSchema()}}>
                            Download XSD 
                        </MenuItem>
                        <MenuItem onClick={(event) => {this.handleArrowRef(event);this.copieToClipboard()}}>
                            <div>
                                <input type="hidden" id="CopyToClipboardBox" value={this.state.previewURL} />
                                Get URL
                            </div>
                        </MenuItem>
                        <MenuItem onClick={(event) => {this.handleArrowRef(event);this.preview()}}>
                            Preview 
                        </MenuItem>
                        <MenuItem onClick={(event) => {this.handleArrowRef(event);this.props.goToSettings()}}>
                            Settings 
                        </MenuItem>
                    </Menu>

                    
                    
                    <div id="dummyContainer"></div>
                    
                </Toolbar>
                <RefreshConfirmation showDeleteConfirmation={this.state.refresh} closeRefreshConfirmation={() => this.setState({refresh: false})} confirmRefresh={this.confirmRefresh} />
                <PublishModal showPublishModal={this.state.showPublishModal} closePublishModal={() => this.setState({showPublishModal: false})}  confirmPublish={this.confirmPublish}  siteTitle={this.state.siteName} customUrl={this.state.customUrl} siteId={this.props.sitId} showNotification={this.props.showNotification}/>
            </AppBar>
        )
    }
}

/*<i className="material-icons">get_app</i>*/
/*<Select className="pagesDropdownBox" value={this.props.selectedPage} onChange={this.props.changePage}>
                                    {
                                        this.fillPageDropDown(this.props.pages)
                                    }

                                </Select>*/
/*<span className="centerMenuItems">
                        <Hidden only={['xs']}>
                            <span className={this.props.pages.length === 0 ? 'disabled':''} onClick={ () => this.props.changeDisplayMode('mobile')}>
                                <i className={this.props.displayMode === 'mobile' ? "material-icons selected" : "material-icons"}>smartphone</i>
                            </span>
                            <span className={this.props.pages.length === 0 ? 'disabled':''} onClick={ () => this.props.changeDisplayMode('tab')}>
                                <i className={this.props.displayMode === 'tab' ? "material-icons selected" : "material-icons"}>tablet</i>
                            </span>
                        </Hidden>
                        <Hidden only={['xs', 'sm']}>
                            <span className={this.props.pages.length === 0 ? 'disabled':''} onClick={ () => this.props.changeDisplayMode('default')}>
                                <i className={this.props.displayMode === 'default' ? "material-icons selected" : "material-icons"}>computer</i>
                            </span>
                        </Hidden>
                    </span>*/
/*<img src={require('../../../assets/img/logo-small.png')} alt="Difi Direct" width="28" height="37" />*/