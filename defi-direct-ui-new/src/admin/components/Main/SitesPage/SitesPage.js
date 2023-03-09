import React from "react";
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import fileDownload from 'js-file-download';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
/*import AddIcon from '@material-ui/icons/Add';*/
/*import Paper from '@material-ui/core/Paper';*/

import config from "../../../resources/config.json";
import generateGUID from "../../Common/generateGUID";
import dataShare from "../../Common/dataShare";
import './SitesPageStyle.css';
import CreateModal from '../CreateModal/CreateModal';
import FooterPagination from "../../Common/FooterPagination/FooterPagination";

export default class SitesPageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {isLoading: true, siteList: [], originalSiteList: '{}', showModal: false, siteTitle: '', modalError: false, anchorEl: null, currentClickedID: null, currentClickedName: null, previewURL: window.location.origin+'?',workcopypreviewURL: window.location.origin+'?', showingFields: "All", currentPage: 0, recordsPerPage: '10', pageCount: 10, copySite: false, isPublished: false};
    }
    downloadSchema = () => {
        dataShare.getXSD(this.state.currentClickedID, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
                return;
            }
            fileDownload(response.data, this.state.currentClickedName+'.xsd');
        });
    }
    componentDidMount = () => {
        this.getSiteList();
    }
    
    handleMoreClick = (event, _obj) => {
        this.setState({ anchorEl: event.currentTarget, currentClickedID:  _obj.id, currentClickedName:  _obj.site.title, previewURL: window.location.origin+'/Application/'+(_obj.customUrl ? _obj.customUrl : _obj.id),workcopypreviewURL: window.location.origin+'/Application/WorkingCopy/'+_obj.id,isPublished:_obj.isPublished});
    };
    closeMoreMenu = () => {
        this.setState({ anchorEl: null });
    };
    siteOptionSelected = (option) =>{
        this.closeMoreMenu();
        if(option === 'Settings') this.props.history.push('/main/site/'+this.state.currentClickedID+'/settings');
        if(option === 'Preview'){
            window.open(this.state.workcopypreviewURL);
        }
        if(option === 'Download XSD') this.downloadSchema();
        if(option === 'Copy Site'){
            this.setState({copySite: true});
            this.openModal();
        }
        if(option === "Refresh"){
            dataShare.refreshSite(this.state.currentClickedID, (error, response) => {
                if(error){
                    this.props.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
                    return;
                }
                if(response.statusText == "OK"){
                    
                }
            });
        }
    }
    copiedToClipboard = () => {
        this.props.showNotification('success', 'URL Copied to Clipboard.');
    }
    getSiteList = () =>{
        dataShare.getSiteList((error, response) => {
            this.setState({isLoading: false});
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching sites, please try after sometime.');
                return;
            }
            this.setState({siteList: response, originalSiteList: JSON.stringify(response)});
        })
        /*axios.get(config.API_BASE_URL+'Sites').then( (response) => {
            if(response.status === 200) this.setState({siteList: response.data});
            else this.props.showNotification('error', response.data);
        }, (error) => {
            this.props.showNotification('error', 'Internal server error while fetching sites, please try after sometime.');
        }).finally( () => {
            this.setState({isLoading: false});
        });*/
    }
    inputChangeHandler = (event) => {
        let _tempVar = this.state;
        _tempVar[event.target.name] = event.target.value;
        this.setState(_tempVar);
    }
    openModal = () => {
        this.setState({showModal: true, siteTitle: '', modalError: false});
    }
    closeModal = () => {
        this.setState({showModal: false});
    }
    finishBtnClicked = () => {
        if(this.state.siteTitle === ''){
            this.setState({modalError: true});
            return;
        }
        this.createNewSite('settings');
    }
    starthBtnClicked = () => {
        if(this.state.siteTitle === ''){
            this.setState({modalError: true});
            return;
        }
        this.createNewSite('builder');
    }
    
    saveCopieSite = (_redirectTo) => {
        dataShare.saveCopysite({id: this.state.currentClickedID, title: this.state.siteTitle}, (error, response) => {
            if(error){
                if (error.response.status === 409)
                    this.props.showNotification('error', error.response.data);
                else
                this.props.showNotification('error', 'Internal server error while copy sites, please try after sometime.');
                return;
            }
            console.log(response);
            this.closeModal();
            if(_redirectTo === 'builder') this.props.history.push('/builder/'+response);
            else this.props.history.push('/main/site/'+response+'/settings');
        })
    }
    createNewSite = (_redirectTo) => {
        this.setState({modalError: false});
        if(this.state.copySite === true){
            this.saveCopieSite(_redirectTo);
            return;
        }
        
        /*for(let i = 0; i < this.state.siteList.length; i++){
            if(this.state.siteList[i].site.title.toLowerCase() === this.state.siteTitle.toLowerCase()){
                this.props.showNotification('warning', "Site Title '"+this.state.siteTitle+"' already exists");
                return;
            }
        }*/
        document.dispatchEvent(new CustomEvent("showAppLoader"));
        let siteId = generateGUID();
        let stepsId = generateGUID();
        let newSiteData = {
            "id": siteId,
            /*"createdDTTM": Date.now(),*/
            "site": {
                "title": this.state.siteTitle,
                "steps": [{
                    "id": stepsId,
                    "label": "Step1",
                    "no": 1,
                    "stepSubTitle": '',
                    "stepTitle": '',
                    "displayLogic": true,
                    "displayLogicRule": 'null',
                    "displayLogicRuleDesc": ''
                }],
                "fieldData": [{
                    "name": "Step1",
                    "id": stepsId,
                    "fields": []
                }],
                "data": {},
                "decisionPageFieldData": [],
                "pendingPageFieldData": [],
                "settings": {
                    "submitUrl": "",
                    "updateUrl": "",
                    "ssc": "",
                    "appSave": false,
                    "createLogin": false,
                    "createManLogin": false,
                    "editApplication": false,
                    "defaultPrimary": "#7068E2",
                    "defaultSecondary": "#83CAFD",
                    "defaultBackground": "#FCFCFD",
                    "applicationErrTitle": ""
                }
            },
            "isPublished": false
        };
        
        axios.post(config.API_BASE_URL+'Sites', newSiteData).then( (response) => {
            if(response.status !== 200) {
                this.props.showNotification('error', response.data);
                return;
            }
            this.closeModal();
            if(_redirectTo === 'builder') this.props.history.push('/builder/'+newSiteData.id);
            else this.props.history.push('/main/site/'+newSiteData.id+'/settings');
        }, (error) => {
            console.error(error.response.data);
            if (error.response.status === 409)
                this.props.showNotification('error', error.response.data);
            else
                this.props.showNotification('error', 'Internal server error while creating sites, please try after sometime.');
        }).finally( () => {
            document.dispatchEvent(new CustomEvent("hideAppLoader"));
        });
    }
    editBtnClicked = (_sitID) => {
        this.props.history.push('/builder/'+_sitID);
    }
    getSiteLoader = () =>{
        return (
            <Grid  item xs={12}>
                <div className="dashboardCards create">
                    <span className="createSiteBntCnt">
                        <CircularProgress style={{ color: config.loaderColor }} size={50} />
                    </span>
                </div>
            </Grid>
        );
    }
    getSitesContainer = () => {
        return this.state.siteList
            /*.sort((a, b) => a.createdDTTM < b.createdDTTM)*/
            .map ( (_site, index) => {
                if(this.state.recordsPerPage !== 'All'){
                    if(index < this.getFrom() || index > this.getTo()) return ""
                }
                return (
                    <Grid item xs={12} key={_site.id} className="siteListWrapper">
                        <div className="siteListCnt">
                            <span className="siteTitle">{_site.site.title}</span>
                            
                            <span className="actionBtn" onClick={(event) => this.handleMoreClick(event, _site)}>
                                <i className="material-icons">more_vert</i>
                            </span>
                            <span className="actionBtn editBtn" onClick={() => this.editBtnClicked(_site.id)}>
                                <i className="material-icons material-icons--outline">edit</i>
                            </span>
                        </div>
                      </Grid>
                )
            })
    }
    getNewSiteContainer = () => {
        return (
            <Grid  item xs={12} sm={6} md={4}>
                <div className="dashboardCards create" onClick={() => {this.setState({copySite: false}); this.openModal()}}>
                    <span className="createSiteBntCnt">
                        <img src={require('../../../assets/icon/icon-addOutline.png')} alt="New" />
                        <p>New Site</p>
                    </span>
                </div>
            </Grid>
        );
    }
    searchSite = (event) => {
        let updatedList = JSON.parse(this.state.originalSiteList);
        updatedList = updatedList.filter(function(item){
          return item.site.title.toLowerCase().search(
            event.target.value.toLowerCase()) !== -1;
        });
        
        this.setState({siteList: updatedList, recordsPerPage: "All", pageCount: 0});
    }
    handlePageChange = (_obj) => {
        console.log(_obj.selected);
        this.setState({currentPage: _obj.selected});
    }
    changeRecordsPerPage = (event) => {
        let _tempVar = {};
        _tempVar.recordsPerPage = event.target.value;
        if(_tempVar.recordsPerPage === 'All'){
            _tempVar.pageCount = 0;
            _tempVar.currentPage = 0;
        }else _tempVar.pageCount = 10;
        this.setState(_tempVar);
    }
    getFrom = () => {
        return (this.state.recordsPerPage === 'All' ? 0 : this.state.currentPage * this.state.recordsPerPage)
    }
    getTo = () => {
        return (
            ( this.state.recordsPerPage === 'All' ? this.state.siteList.length : (this.state.currentPage === 0 ? (1 * this.state.recordsPerPage) : ((this.state.currentPage + 1) * this.state.recordsPerPage)) ) > this.state.siteList.length ? this.state.siteList.length : ( this.state.recordsPerPage === 'All' ? this.state.siteList.length : (this.state.currentPage === 0 ? (1 * this.state.recordsPerPage) : ((this.state.currentPage + 1) * this.state.recordsPerPage)) ) - 1
        )
    }
    render(){
        const { anchorEl } = this.state;
        return(
            <div className="MainWrapper">
            
                <CreateModal copySite={this.state.copySite} showModal={this.state.showModal} openModal={this.openModal} closeModal={this.closeModal} finishBtnClicked={this.finishBtnClicked} starthBtnClicked={this.starthBtnClicked} inputChangeHandler={this.inputChangeHandler} modalError={this.state.modalError} />
            
                
            
                <div className="dashboardContainer">
                    <div className="searchCnt">
                        <Grid container>
                            <Grid item xs={12}>
                                <TextField
                                    className="siteSearchCnt"
                                    placeholder="Search Site..."
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start" className="siteSearchIconCnt">
                                          <i className="material-icons blueColor">search</i>
                                        </InputAdornment>
                                      ),
                                    }} onChange={this.searchSite}
                                  />
                                <Button variant="contained" className="newSiteBtn appSecondaryBGClr" onClick={this.openModal}>
                                    <i className="material-icons">add_circle</i>  New Site
                                </Button>
                            </Grid>
                            
                        </Grid>
                    </div>
                    <Grid container spacing={32} className="SP-tableCnt">
                        
                        
                        {
                            this.state.isLoading && this.getSiteLoader()
                        }
                        
                        {
                            this.getSitesContainer()
                        }
            
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.closeMoreMenu} >
                            <MenuItem onClick={() => this.siteOptionSelected('Settings')}>Settings</MenuItem>
                            <MenuItem onClick={() => this.siteOptionSelected('Preview')}>Preview</MenuItem>
                            <MenuItem onClick={() => this.siteOptionSelected('Get URL')}>
                                {this.state.isPublished?
                                <CopyToClipboard text={this.state.previewURL}
                                  onCopy={this.copiedToClipboard}>
                                  <span>Get URL</span>
                                </CopyToClipboard>:<span onClick={()=>this.props.showNotification('warning', 'This site is not yet published, Please publish your changes to get the URL')}>Get URL</span>
                                }
                            </MenuItem>
                            <MenuItem onClick={() => this.siteOptionSelected('Download XSD')}>Download XSD</MenuItem>
                            <MenuItem onClick={() => this.siteOptionSelected('Copy Site')}>Copy Site</MenuItem>
                            <MenuItem onClick={() => this.siteOptionSelected('Refresh')}>Refresh</MenuItem>
                        </Menu>
                    </Grid>
                </div>

                <FooterPagination pageCount={this.state.pageCount} dataSet={this.state.siteList} recordsPerPage={this.state.recordsPerPage} currentPage={this.state.currentPage} handlePageChange={this.handlePageChange} changeRecordsPerPage={this.changeRecordsPerPage} />
                    
            </div>
        )
    }
}

/*<Button variant="fab" color="primary" aria-label="Add" title="New Site" className="fabIcon" onClick={this.openModal}>
                    <AddIcon />
                </Button>*/

/*<Grid item>
                                <i className="material-icons" style={{color: '#00B2E3', marginTop: '4px'}}>search</i>
                            </Grid>
                            <Grid xs={11} item>
                                <TextField placeholder="Search Site..." fullWidth onChange={this.searchSite} />
                            </Grid>*/

/*
<Grid item xs={12} sm={6} md={4}>
                            <div className="dashboardCards ocupied">
                                <div className="dOverlay">
                                    <Button variant="contained" className="editSiteBtn" onClick={() => this.editBtnClicked('121')}>
                                        Edit/View Site
                                    </Button>
                                </div>
                                <div className="dFooter">
                                    <span className="title">
                                        Site Title
                                        <div className="line2">8 Steps</div>
                                    </span>
                                    <span className="actionBtn">
                                        <i className="material-icons">more_vert</i>
                                    </span>
                                </div>
                            </div>
                          </Grid>
                        <Grid  item xs={12} sm={6} md={4}>
                            <div className="dashboardCards ocupied">
                                <div className="dOverlay">
                                    <Button variant="contained" className="editSiteBtn" onClick={() => this.editBtnClicked('122')}>
                                        Edit/View Site
                                    </Button>
                                </div>
                                <div className="dFooter">
                                    <span className="title">
                                        Site Title
                                        <div className="line2">8 Steps</div>
                                    </span>
                                    <span className="actionBtn">
                                        <i className="material-icons">more_vert</i>
                                    </span>
                                </div>
                            </div>
                          </Grid>*/