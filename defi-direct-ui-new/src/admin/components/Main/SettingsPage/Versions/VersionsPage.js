import React from "react";
import "./VersionsPageStyle.css";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Draft, { rawToDraft, draftToRaw } from 'react-wysiwyg-typescript';
import dataShare from "../../../Common/dataShare";
import Grid from '@material-ui/core/Grid';
import {Link} from "react-router-dom";
import InputAdornment from '@material-ui/core/InputAdornment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import config from "../../../../resources/config.json";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import FooterPaginationTab from "../../../Common/FooterPagination/FooterPaginationTab";
import ActionConfirmation from './ActionConfirmation';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
// const Switch_Theme = createMuiTheme({
//     palette: {
//         primary: {main: config.defaultSecondaryClr}
//     }
//  });
export default class VersionsPageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {isLoading: true, showingFields: "All" ,versionsList: [],  currentPage: 0, recordsPerPage: '10', pageCount: 10, originalVersionsList: '{}',  searchText: "",previewURL: window.location.origin+'?'};
    }
    componentDidMount = () => {
        this.getVersions();
    }
    handleMoreClick = (event, _obj) => {
        // this.setState({previewURL: window.location.origin+'/Version/'+_obj.siteId +'/'+_obj.id}); 
        this.setState({previewURL: window.location.origin+'/Application/Version/'+_obj}); 
        this.state.previewURL = window.location.origin+'/Application/Version/'+_obj;
        this.openApp();       
    };
    openApp = () =>
    {
         window.open(this.state.previewURL);
    }

    getVersions = () =>{       
        dataShare.getVersionsList(this.props.data,(error, response) => {
            this.setState({isLoading: false});
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching sites, please try after sometime.');
                return;
            }
            this.setState({versionsList: response, originalVersionsList: JSON.stringify(response)}, () => this.filterData());
        })       
    }
    
    // makeVersionActive = (versionid,versiontitle) =>{        
    //     dataShare.setVersionToActive({siteId: this.props.data, versionId: versionid}, (error, response) => {
    //         if(error){
    //             this.props.showNotification('error', 'Internal server error while setting values for site, please try after sometime.');
    //             return;
    //         } 
    //        this.getVersions();
    //        this.props.showNotification('success', versiontitle + ' has been published.');
    //     } );
       
    // }
    makeVersionActive = (_id) =>{        
        dataShare.setVersionToActive({siteId: this.props.data, versionId: _id}, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while setting values for site, please try after sometime.');
                return;
            } 
           this.getVersions();          
           this.props.goToBuilder();         
        } );
       
    }
    
    
    filterChanged = (event) => {
        let _tempVar = {};
        _tempVar[event.target.name] = event.target.value;
        _tempVar.recordsPerPage = "All";
        _tempVar.pageCount = 0;
        this.setState(_tempVar, () => this.filterData());
    }
    handlePageChange = (_obj) => {       
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
            ( this.state.recordsPerPage === 'All' ? this.state.versionsList.length : (this.state.currentPage === 0 ? (1 * this.state.recordsPerPage) : ((this.state.currentPage + 1) * this.state.recordsPerPage)) ) > this.state.versionsList.length ? this.state.versionsList.length : ( this.state.recordsPerPage === 'All' ? this.state.versionsList.length : (this.state.currentPage === 0 ? (1 * this.state.recordsPerPage) : ((this.state.currentPage + 1) * this.state.recordsPerPage)) ) - 1
        )
    }
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [year, month, day].join('-');
    }
    
    filterData = () => {
        let _tempVar = {};
        
        if(this.state.showingFields === "All") _tempVar.versions = JSON.parse(this.state.originalVersionsList);
        if(this.state.showingFields === "Active"){
            let originalVersions = JSON.parse(this.state.originalVersionsList);
            let versions = [];
            for(let i = 0; i < originalVersions.length; i++){
                if(originalVersions[i].active === true || originalVersions[i].active === 1)
                versions.push(originalVersions[i]);
            }
            _tempVar.versions = versions;
        }
        if(this.state.showingFields === "Inactive"){
            let originalVersions = JSON.parse(this.state.originalVersionsList);
            let versions = [];
            for(let i = 0; i < originalVersions.length; i++){
                if(originalVersions[i].active === false || originalVersions[i].active === 0)
                versions.push(originalVersions[i]);
            }
            _tempVar.versions = versions;
        }
        
        try{
            let searchStr = this.state.searchText.toLowerCase();            
            _tempVar.versionsList = _tempVar.versions.filter(item => item.title.toLowerCase().indexOf(searchStr) >= 0 ||
                                                                     item.version.toLowerCase().indexOf(searchStr) >= 0 ||
                                                                     item.updatedDate.indexOf(searchStr) >= 0);
            }catch(e) {
            console.error(e);
        }

        this.setState(_tempVar);
    }
    render(){
        const { anchorEl } = this.state;
        return(
            <div className="MainWrapper" >  
             {/* <ActionConfirmation showModal={this.state.showActionModal} closeModal={() => this.setState({showActionModal: false})} makeVersionActive={this.makeVersionActive} /> */}
          
               <div className="VersionContainer">              

                    <Grid container>
                        <Grid item sm={8} xs={12} className="VP-filterCnt">
                            <TextField
                                name="searchText"
                                value={this.state.searchText}
                                onChange={this.filterChanged}
                                placeholder="Search Versions"
                                className="VP-filterCntMain"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start" className="VP-filterIconCnt">
                                      <i className="material-icons blueColor">search</i>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            <span className="selectBoxCnt">
                                <span className="VP-label">Showing: </span>
                                
                                <Select className="selectBox" value={this.state.showingFields} name="showingFields" onChange={this.filterChanged}>
                                    <MenuItem value="All">All Versions</MenuItem>
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Inactive">Inactive</MenuItem>
                                </Select>
                            </span> 
                        </Grid>                                                                   
                    </Grid>                    
                </div>
                <div className="VP-tableCnt" >
                <Grid container>
                        
                        {
                            this.state.versionsList.length === 0 && 
                            <Grid item xs={12} className="VP-tableRow">
                                <Grid container>
                                    <Grid item xs={12} className="infoWrapper" style={{'textAlign': 'center'}}>
                                        <p className="infoHeader" style={{'marginTop': '10px'}}>No Versions Found</p>
                                    </Grid>
                                </Grid>
                            </Grid>
                        }
                        {
                            this.state.versionsList.map((_data, index) => {
                                if(this.state.recordsPerPage !== 'All'){
                                    if(index < this.getFrom() || index > this.getTo()) return ""
                                }
                            return (
                            <Grid item xs={12} key={_data.id} className="VP-tableRow" >
                             <Grid container>
                                <Grid item xs={12} sm={9} className="infoWrapper">
                                    <p className="infoHeader">{_data.title}</p>
                                    <p className="infoDetails">Version: {_data.version} &nbsp; &nbsp; Published Date: {_data.updatedDate} </p>                          
                                   
                                </Grid>                                
                                <Grid item xs={12} sm={3} className="actionWrapper">
                                    <span className="actionIconCnt_info" >
                                        <Tooltip title={(_data.comments)?_data.comments:'Comments'} placement="bottom" TransitionComponent={Zoom}>
                                            <i className="material-icons">info</i>                                
                                        </Tooltip>   
                                    </span>
                                    <span className="actionIconCnt_visibl" onClick={(event) => this.handleMoreClick(event, _data.id)}>
                                        <Tooltip  title="Preview" placement="bottom" TransitionComponent={Zoom} >
                                            <i className="material-icons">visibility</i>                                
                                        </Tooltip>
                                    </span>  
                                    <span className="actionIconCnt_vp" onClick={() => this.makeVersionActive(_data.id)}>
                                        <Tooltip  title="Use This Version" placement="bottom" TransitionComponent={Zoom} >
                                            <i className="material-icons">publish</i>                                
                                        </Tooltip>  
                                    </span>                               
                                </Grid>                                                      
                            </Grid>  
                            </Grid>                             
                            )
                            
                            })
                            
                        }
                </Grid>
                </div>
                <FooterPaginationTab pageCount={this.state.pageCount} dataSet={this.state.versionsList} recordsPerPage={this.state.recordsPerPage} currentPage={this.state.currentPage} handlePageChange={this.handlePageChange} changeRecordsPerPage={this.changeRecordsPerPage} />


            </div>
            
             
        )
    }
}