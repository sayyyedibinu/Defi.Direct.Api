import React from "react";
import Grid from '@material-ui/core/Grid';
import { draftToRaw } from 'react-wysiwyg-typescript';

import dataShare from "../Common/dataShare";
import common from "../Common/common";
import './BuilderPageStyle.css';
import Header from './Header/Header';
import Config from '../../resources/config.json';
import BuilderContainer from './BuilderContainer/BuilderContainer';
import AddPageModal from "./AddPageModal/AddPageModal";
//import Hidden from '@material-ui/core/Hidden';

export default class BuilderPageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {showInsertField: false, showInsertText: false,showInsertImage:false, showAddPageModal: false, newPagetitle: '', selectedPage: 'Application', pages: ['Application', 'Decision', 'Pending'], selectedStep: 0, steps: ['Step1'], displayMode: 'default', showSideMenu: false, siteData: {site: {steps: [], fieldData: [], settings: {}}},siteTitle:'',invokeSaveSite:false, publishInfo:{},unPublishedChanges:false, isPublished:false,customUrl:''};
    }   
    componentDidMount = () => {
        this.getSiteData();
    }
    openInsertField = () => {
        this.setState({showInsertField: true});
    }
    openInsertText = () => {
        this.setState({showInsertText: Math.random()});
    }
    openInsertImage = () => {
        this.setState({showInsertImage: Math.random()});
    }
    closeInsertField = () => {
        this.setState({showInsertField: false});
    }
    
    getSiteData = () => {
        dataShare.getSiteDetails(this.props.match.params.prjID, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
                return;
            }
            this.setState({siteData: response.site, siteTitle:response.site.site.title,unPublishedChanges:response.actionStatus == "Saved"?true:false,isPublished:response.isPublished,customUrl:response.customUrl});
        });
    
        /*document.dispatchEvent(new CustomEvent("showAppLoader"));
        axios.get(config.API_BASE_URL+'Sites/'+this.props.match.params.prjID).then( (response) => {
            if(response.status !== 200) {
                this.props.showNotification('error', response.data);
                return;
            }
            this.setState({siteData: response.data});
        }, (error) => {
            this.props.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
        }).finally( () => {
            document.dispatchEvent(new CustomEvent("hideAppLoader"));
        });*/
    }
    getSiteData_refresh = () => {
        dataShare.getSiteDetails(this.props.match.params.prjID, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
                return;
            }
            this.setState({siteData: response.site, siteTitle:response.site.site.title,unPublishedChanges:true,isPublished:response.isPublished,customUrl:response.customUrl});
        });
    }
    refreshSite = () =>{
        console.log(this.state);
        dataShare.refreshSite(this.props.match.params.prjID, (error, response) => {
           if(error){
               this.props.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
               return;
           }
           if(response.statusText == "OK"){
              console.log(this.state);
             // this.getSiteData();
              this.getSiteData_refresh();
              this.setState({unPublishedChanges:true});
              console.log(this.state);
           }
       });
   }
   publishSite = (obj) =>{
    let versionObj = {};
    versionObj.siteId = this.props.match.params.prjID;
    versionObj.versionTitle = obj.title;
    versionObj.versionComments = obj.comments;
    versionObj.customUrl=obj.customUrl;
    this.setState({invokeSaveSite:true, publishInfo : versionObj});
   }
   previewSite = (url) => {
       let _siteData = JSON.parse(JSON.stringify(this.state.siteData));
        for(let i = 0; i < this.state.siteData.site.fieldData.length; i++){
            for(let j = 0; j < this.state.siteData.site.fieldData[i].fields.length; j++){
                for(let k = 0; k < this.state.siteData.site.fieldData[i].fields[j].length; k++){
                    if(this.state.siteData.site.fieldData[i].fields[j][k].inputType === "Text Area"){
                        try{
                            if(typeof this.state.siteData.site.fieldData[i].fields[j][k].text === 'object')
                                _siteData.site.fieldData[i].fields[j][k].text = draftToRaw(this.state.siteData.site.fieldData[i].fields[j][k].text);
                        }catch (e){
                            _siteData.site.fieldData[i].fields[j][k].text = '';
                            console.warn(e);
                        }
                    }
                }
            }
        }
       for (let i = 0; i < this.state.siteData.site.pendingPageFieldData.length; i++) {
           if (this.state.siteData.site.pendingPageFieldData[i].inputType === "Text Area") {
               try {
                   if (typeof this.state.siteData.site.pendingPageFieldData[i].decisionText === 'object')
                       _siteData.site.pendingPageFieldData[i].decisionText = draftToRaw(this.state.siteData.site.pendingPageFieldData[i].decisionText);
               } catch (e) {
                   _siteData.site.pendingPageFieldData[i].decisionText = "";
                   console.warn(e);
               }
           }
       }
       for (let i = 0; i < this.state.siteData.site.decisionPageFieldData.length; i++){
            if(this.state.siteData.site.decisionPageFieldData[i].inputType === "Text Area"){
                try{
                    if(typeof this.state.siteData.site.decisionPageFieldData[i].decisionText === 'object')
                        _siteData.site.decisionPageFieldData[i].decisionText = draftToRaw(this.state.siteData.site.decisionPageFieldData[i].decisionText);
                }catch (e){
                    _siteData.site.decisionPageFieldData[i].decisionText = "";
                    console.warn(e);
                }
            }
        }
       
       
       _siteData = JSON.stringify(_siteData);
       let _siteDataLength = common.getByteLen(_siteData);
       let _previewDataDetails = [];
       let maxCutoffLimit = Config.localStorageLimit; 
       /*4500000 = 4.5MB*/
       /*1000000 = 1MB*/
       
       let count = 0;
       for(let i = 0; i < _siteDataLength; i = i+maxCutoffLimit){
           _previewDataDetails.push(count);
           let _data = _siteData.slice(i, i+maxCutoffLimit);
           localStorage.setItem('_previewData'+count, _data);
           count++;
       }
       
       localStorage.setItem('_previewDataDetails', JSON.stringify(_previewDataDetails));
        window.open(url);  
   }
   
   clearPreviewSite = () => {
       try{
           let _previewDataDetails = localStorage.getItem('_previewDataDetails');
           _previewDataDetails = JSON.parse(_previewDataDetails);
           for(let i = 0; i < _previewDataDetails.length; i++){
               localStorage.removeItem('_previewData'+_previewDataDetails[i]);
           }
           localStorage.setItem('_previewDataDetails', JSON.stringify([]));
       }catch(e){
           console.warn(e);
       }
   }
   
   componentWillUnmount = (event) => {
       this.clearPreviewSite();
    }
   
   onSaveComplete = (isInvoked) =>{
    console.log(this.state);
    if(isInvoked){
        dataShare.publishSite(this.state.publishInfo, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
                return;
            }
            if(response.statusText == "OK"){
                this.props.showNotification('success', 'Site changes published successfully.');
                this.setState({invokeSaveSite:false,publishInfo:{},unPublishedChanges:false,isPublished:true});
                this.getSiteData();
            }
        });
    }
    else{
        console.log(this.state);
        this.setState({unPublishedChanges:true});
    }
   }
    openModal = () => {
        this.setState({showAddPageModal: true});
    }
    closeModal = () => {
        this.setState({showAddPageModal: false});
    }
    changePage = (_pageName) => {
        let _tempVar = this.state;
        _tempVar.selectedPage = _pageName;
        /*_tempVar.selectedPage = event.target.value;*/
        this.setState(_tempVar);
    }
    inputOnChange = (event) => {
        let _tempvar = this.state;
        _tempvar[event.target.name] = event.target.value;
        this.setState(_tempvar);
    }
    addPage = () => {
        if(this.state.newPagetitle === '') return;
        let _tempvar = this.state;
        _tempvar.pages.push(_tempvar.newPagetitle);
        if(this.state.selectedPage === '') _tempvar.selectedPage = _tempvar.newPagetitle;
        _tempvar.newPagetitle = '';
        this.setState(_tempvar);
        this.closeModal();
    }
    changeDisplayMode = (_mode) => {
        let _tempVar = this.state;
        _tempVar.displayMode = _mode;
        this.setState(_tempVar);
    }    
    /*toggleSideMenu = () => {
        let _tempVar = this.state;
        _tempVar.showSideMenu = !_tempVar.showSideMenu;
        this.setState(_tempVar);
    }*/
    goToSettings = () => {
        this.props.history.push('/main/site/'+this.props.match.params.prjID+'/settings/general');
    }
    
    render(){
        return(
            <div>
                <Header sitId={this.props.match.params.prjID} siteTitle={this.state.siteTitle} selectedPage={this.state.selectedPage} pages={this.state.pages} changePage={this.changePage} displayMode={this.state.displayMode} changeDisplayMode={this.changeDisplayMode} goToSettings={this.goToSettings} showNotification={this.props.showNotification}  refreshSite={this.refreshSite} publishSite={this.publishSite} unPublishedChanges={this.state.unPublishedChanges} isPublished={this.state.isPublished} previewSite={this.previewSite} customUrl={(this.state.customUrl)?this.state.customUrl:this.props.match.params.prjID}/>
                <AddPageModal addPage={this.addPage} newPagetitle={this.state.newPagetitle} inputOnChange={this.inputOnChange} showModal={this.state.showAddPageModal} openModal={this.openModal} closeModal={this.closeModal}/>
                <Grid container spacing={0} className="sideMenuWrapper">
                    <Grid item xs={12} sm={12} md={12} lg={12} className="mainCntWrapper">
                        <BuilderContainer showInsertText={this.state.showInsertText} showInsertImage={this.state.showInsertImage} showInsertField={this.state.showInsertField} openInsertField={this.openInsertField} closeInsertField={this.closeInsertField} displayMode={this.state.displayMode} siteData={this.state.siteData} pages={this.state.pages} selectedPage={this.state.selectedPage} openModal={this.openModal} steps={this.state.steps} selectedStep={this.state.selectedStep} showNotification={this.props.showNotification} invokeSaveSite={this.state.invokeSaveSite} onSaveComplete = {this.onSaveComplete} saveCallback={this.clearPreviewSite} />
                    </Grid>
                </Grid>
            </div>
        )
    }
}



/*<Hidden only={['xs']}>
                        <span className={this.state.showSideMenu ? "sideMenuOpenCnt hideElement" : "sideMenuOpenCnt"} onClick={this.toggleSideMenu}>
                            <i className="material-icons">{this.state.showSideMenu ? 'keyboard_arrow_left' : 'keyboard_arrow_right'}</i>
                        </span>
                    </Hidden>
            
                    <Grid item xs={12} sm={3} md={3} lg={2} className={this.state.showSideMenu ? "sideMenuCnt" : "sideMenuCnt hideElement"}>
                        <SideMenu openInsertField={this.openInsertField} openInsertText={this.openInsertText} openInsertImage={this.openInsertImage} openModal={this.openModal} pagesLength={this.state.pages.length} goToSettings={this.goToSettings}/>
                        <Hidden only={['xs']}>
                            <span className="sideMenuCloseCnt" onClick={this.toggleSideMenu}>
                                <i className="material-icons">{this.state.showSideMenu ? 'keyboard_arrow_left' : 'keyboard_arrow_right'}</i>
                            </span>
                        </Hidden>
                    </Grid>*/