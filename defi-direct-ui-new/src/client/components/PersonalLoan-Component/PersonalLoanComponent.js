import React from 'react';
import { Redirect } from 'react-router';

import axios from 'axios';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import BeforeUnload from 'react-beforeunload';
import config from  "../../resources/config.json";
import FormStepsComponent from './FormSteps-Component/FormStepsComponent';
import FormContainerComponent from './FormContainer-Component/FormContainerComponent';
import ModalLoaderComponent from '../ModalLoaderComponent/ModalLoaderComponent';
import ApplicationError from '../ApplicationErrorComponent/ApplicationErrorComponent';
import RuleHelper from '../Common/RuleHelper';
import './PersonalLoanStyle.css';

class PersonalLoanComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {openModal: false, showApplicationMessage: false, currentStep: 0, showStepper: true, formData: {}, dataSet: this.props.AppData.data, dataSetOriginal: JSON.stringify(this.props.AppData.data), ActualError: "",phnFieldarray:[],createNewApp:true, AppData:this.props.AppData};
        if(this.props.width === 'xs' || this.props.width === 'sm')
            this.state.showStepper = false;
        this.state.askToLeave = true;
        this.state.appSteps = this.props.AppData.steps;
        
        this.state.stateDetails = this.props.AppData.fieldData;
        if(this.props.AppData.settings){            
            this.state.appErr=(this.props.AppData.settings.applicationErrMessage?this.props.AppData.settings.applicationErrMessage:'');
            this.state.appErrTitle=(this.props.AppData.settings.applicationErrTitle?this.props.AppData.settings.applicationErrTitle:'');
        }else{
            this.state.appErr= ''; 
            this.state.appErrTitle='';
        }
        if(Object.prototype.toString.call(this.props.location.state) !== '[object Undefined]')        
        {  
            this.state.createNewApp=this.props.location.state.createNewApp;
            this.state.editappresult=this.props.location.state.Results;
        }
        this.state.queryString = this.props.queryString;
        this.toggleStepper = this.toggleStepper.bind(this);
        this.handleModalOpen = this.handleModalOpen.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.getSteps = this.getSteps.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.goToStep = this.goToStep.bind(this);
        this.redirectHome = this.redirectHome.bind(this);
        this.redirectThankyouPage = this.redirectThankyouPage.bind(this);
        this.postXMLData = this.postXMLData.bind(this);
        this.getFieldData = this.getFieldData.bind(this);
        this.getFinalDecission = this.getFinalDecission.bind(this);
        this.getPhoneFields=this.getPhoneFields.bind(this);
        this.setPhoneFields=this.setPhoneFields.bind(this);
        
    }
    dataSetUpdated = () => {
        this.forceUpdate();
    }
    
    componentDidUpdate = (prevProps) => {
        
        if (prevProps.AppData === this.props.AppData) return;
        let _tempvar = this.state;
        _tempvar.dataSet = this.props.AppData.data;
        _tempvar.dataSetOriginal = JSON.stringify(this.props.AppData.data);
        _tempvar.appSteps = this.props.AppData.steps;
        _tempvar.stateDetails = this.props.AppData.fieldData;
        this.setState(_tempvar);
    }
    handleModalOpen(){
        let _tempVar = this.state;
        _tempVar.openModal = true;
        this.setState(_tempVar);
    }
    
    handleModalClose(){
        let _tempVar = this.state;
        _tempVar.openModal = false;
        this.setState(_tempVar);
    }
    
    toggleStepper(){
        let _tempValue = this.state;
        _tempValue.showStepper = !_tempValue.showStepper;
        this.setState(_tempValue);
    }
    
    getSteps(){
        let validSteps = [];
        if (this.state.appSteps) {
            for(let i = 0; i < this.state.appSteps.length; i++){
                if(RuleHelper.getConditionalDisplay(this.state.appSteps[i], this.state.dataSet) === true)
                    validSteps.push(this.state.appSteps[i]);
            }
        }
        return validSteps;
    }
    
    getFieldData(_curStep){
        _curStep = this.getSteps()[this.state.currentStep];
        if(!_curStep) return {fields: []};
        let _fieldData = this.state.stateDetails;
        for(let i = 0; i < _fieldData.length; i++){
            if(_fieldData[i].id === _curStep.id) return _fieldData[i];
        }
        return {fields: []};
    }
    
    goToStep(_stepNumber){
        let _tempValue = this.state;
        
        if(_tempValue.currentStep > _stepNumber){
            _tempValue.currentStep = _stepNumber;
            this.setState(_tempValue);
        }
    }
    getPhoneFields(){
        let _phnFieldarray =[];  
        let _fieldData = this.state.stateDetails;
        for(let i = 0; i < _fieldData.length; i++){
            for(let j = 0; j < _fieldData[i].fields.length; j++){
                for(let k=0;k< _fieldData[i].fields[j].length;k++)
                {  
                    try {          
                        if(_fieldData[i].fields[j][k].displayFormat==="phoneNumber")
                        {  
                            _phnFieldarray.push(_fieldData[i].fields[j][k].id);
                        }
                    } catch (ex) { console.log("No phone number") }
                }
            }
   }
     this.setState({phnFieldarray: _phnFieldarray});
     this.state.phnFieldarray =_phnFieldarray;
     let actualData = this.setPhoneFields();
     return actualData;
   }
   setPhoneFields()
   {
      const _dataSet1={_dataset:JSON.stringify(this.state.dataSet)};        
       for(let i=0; i< this.state.phnFieldarray.length; i++)
       {          
           let tmp=this.state.dataSet;
           let newval=tmp[this.state.phnFieldarray[i]].replace(/[^\d]/g, "");
           tmp[this.state.phnFieldarray[i]]=newval;
           this.setState(tmp);
       }
       return _dataSet1
   }
   resetPhoneFields(actulVal)
   {
    try{
       for(let i=0; i< this.state.phnFieldarray.length; i++)
       {
           let tmp=this.state.dataSet;           
           let oldval=JSON.parse(actulVal._dataset)[this.state.phnFieldarray[i]];
           tmp[this.state.phnFieldarray[i]]=oldval;
           this.setState(tmp);
       }
    }
    catch(e)
    {
       console.warn(e);

    }
      
   }
    nextStep(_curStepObj,appId){
        let _tempValue = this.state;
        let _curFormFields = this.getFieldData({}).fields;
        for(let i = 0; i < _curFormFields.length; i++)
        { 
            for(let j=0;j<_curFormFields[i].length;j++)
            {
                 _tempValue.dataSet[_curFormFields[i][j].id] = _curStepObj[_curFormFields[i][j].id];
            }
        }
        
        setTimeout(function(){
            window.scrollTo(0,0);
        }, 500);
        
        if(_tempValue.currentStep+1 === this.getSteps().length)
            {   if (appId !== "")
                    _tempValue.dataSet["AppId"] = appId;
                 this.postXMLData();
            }

        else{
            _tempValue.currentStep = _tempValue.currentStep + 1;           
            this.setState(_tempValue);
            }
    }
    
    redirectHome(){
        window.location = '/?'+this.props.pageID;
    }
    cancelEdit =(selectPage,PageId,results,appdata) =>{
        if (selectPage==="Decision")

         {  
              this.setState({ redirect : {now: true,
                pathname: '/Success/'+PageId,
                state: {Results: results, AppData:appdata,siteId:PageId}
            }});
        }
        else
        {
            this.setState({ redirect : {
                now: true,
                pathname: '/Pending/'+this.props.pageID,
                state: {Results: results, AppData:appdata ,siteId:PageId}
            }});

        }

    }
    
    redirectThankyouPage = () => {
        let _data=this.props.AppData;
        if(Object.prototype.toString.call(this.props.location.state) !== '[object Undefined]')
        {
            _data=this.props.location.state.AppData;

        }
        if(this.getFinalDecission() === true ) {
            this.setState({ askToLeave: false, AppData: _data, redirect : {
                now: true,
                pathname: '/Success/'+this.props.pageID,
                state: {Results: this.state.Results, /*AppData: _data,*/siteId:this.props.pageID}
            }});
        }
        else {
            this.setState({ AppData: _data, redirect : {
                now: true,
                pathname: '/Pending/'+this.props.pageID,
                state: {Results: this.state.Results, /*AppData: _data,*/siteId:this.props.pageID}
            }});
        }
    }
    
    postXMLData(){
       
        this.handleModalOpen();
        let _self = this;
        let acutalValues=this.getPhoneFields();
        let _postURL;
        if (this.props.versionId==='null')
        {
            _postURL = config.API_BASE_URL+'Sites/sendToLos/'+this.props.pageID+'/'+ this.state.createNewApp ;
        }
        else
        { 
            _postURL = config.API_BASE_URL+'Sites/submitFromVersion/'+this.props.pageID +'/'+this.props.versionId ;
        }
        if (this.state.queryString && (this.state.queryString.id ||this.state.queryString.Id )) {
            let _clientid= this.state.queryString.id;
            _postURL = _postURL + "?dealerIdOverride=" + _clientid;
        }
        axios.post(_postURL, this.state.dataSet ,{ headers: { 'Content-Type': 'application/json' } }).then(function(response){
               _self.resetPhoneFields(acutalValues);
              
                if(response.data.Results.result === "true" || response.data.Results.result === "True"){
                    let _tempValue = _self.state;
                    _tempValue.Decision = 'Success';
                    _tempValue.openModal = false;
                    _self.setState({Results: response.data.Results}, () => { _self.redirectThankyouPage() } );
                }else{
                    let _errorMsg = "";
                    if(Object.prototype.toString.call(response.data.Results.errors.error) === "[object Array]"){
                        for(let i = 0; i < response.data.Results.errors.error.length; i++) _errorMsg += (i + 1)+': '+response.data.Results.errors.error[i].message + ' ';
                    }else{
                        _errorMsg = response.data.Results.errors.error.message;                            
                    } 
                    
                    let _tmpValue=_self.state;                  
                    _tmpValue.showApplicationMessage=true;                  
                    _tmpValue.ActualError=_errorMsg;                  
                    _self.setState(_tmpValue);
                    _self.handleModalClose();
                    
                }
            
        }).catch(function (error) {
            _self.resetPhoneFields(acutalValues);
            let _tempValue=_self.state;
            _tempValue.showApplicationMessage=true;                  
            _self.setState(_tempValue);
           
            console.log(error);
            _self.handleModalClose();
        });
    }
    
    getFinalDecission(){
        if(Object.prototype.toString.call(this.props.location.state) === '[object Undefined]')
        {
        
                if(!this.props.AppData) return false;
                
                if(Object.prototype.toString.call(this.props.AppData.settings.decisionPageDisplayLogic) === "[object Undefined]") return false;
                if(this.props.AppData.settings.decisionPageDisplayLogic === "null") return false;
                
                let _tempVar = {};
                _tempVar.displayLogic = true;
                _tempVar.displayLogicRule = this.props.AppData.settings.decisionPageDisplayLogic;
                _tempVar.displayLogicRuleDesc = this.props.AppData.settings.decisionPageDisplayLogicDesc;
                return RuleHelper.getConditionalDecisionDisplay(_tempVar, {Results: this.state.Results}) ;
                }
        else{

                if(!this.props.location.state.AppData) return false;
                
                if(Object.prototype.toString.call(this.props.location.state.AppData.site.settings.decisionPageDisplayLogic) === "[object Undefined]") return false;
                if(this.props.location.state.AppData.site.settings.decisionPageDisplayLogic === "null") return false;
                
                let _tempVar = {};
                _tempVar.displayLogic = true;
                _tempVar.displayLogicRule = this.props.location.state.AppData.site.settings.decisionPageDisplayLogic;
                _tempVar.displayLogicRuleDesc = this.props.location.state.AppData.site.settings.decisionPageDisplayLogicDesc;
                return RuleHelper.getConditionalDecisionDisplay(_tempVar, {Results: this.state.Results}) ;

        }
    }
    render(){   
        let currentStep = (this.state.appSteps) && (this.state.currentStep +1 > this.state.appSteps.length) ? this.getSteps().length : this.state.currentStep +1
        if (this.state.redirect && this.state.redirect.now) {
            return (
                <Redirect to={this.state.redirect} />
            );
        }
        return (
            <Grid container spacing={0} className="personalLoanWrapper">
                <BeforeUnload onBeforeunload={() => "Are you sure you want to leave?  You could lose your data."} />
                <Hidden only={['xs', 'sm']}>
                    <Grid item xs={12} style={{"height": "25px"}} ></Grid>                    
                </Hidden>
            
                <Hidden only={['md', 'lg', 'xl']}>
                    <Grid item xs={12} className="mobileProgressBar" onClick={this.toggleStepper}>
                        <Grid container spacing={0}>
                            <Grid item xs={1} style={{"textAlign": "center", "fontSize": "12px", "padding": "0"}} >
                                { currentStep } / {this.getSteps().length}
                            </Grid>
                            <Grid item xs={10} style={{"paddingLeft": "7px", "paddingRight": "7px"}}>
                                <LinearProgress id="C_LinearProgressBar" variant="determinate" value={( (this.state.currentStep + 1 ) / (this.getSteps().length) )* 100} className="LinearProgressBar" />
                            </Grid>
                            <Grid item xs={1} style={{"textAlign": "center", "marginTop": "-4px"}}>
                                <i className="material-icons" style={{color: this.props.color.secondary}}>{this.state.showStepper ? "arrow_drop_up" : "arrow_drop_down"}</i>
                            </Grid>
                        </Grid>
                    </Grid>                   
                    {
                        this.state.showStepper && 
                        <div className="mobileStepperMenu">
                            <Grid item xs={12} sm={12} md={3}>
                                <FormStepsComponent color={this.props.color} currentState={this.state.currentStep} getSteps={this.getSteps} goToStep={this.goToStep} />
                            </Grid>
                            <Grid item xs={12} style={{"backgroundColor": "#fff", "borderBottom": "2px solid #fff", "marginTop": "0px"}}>
                                <p style={{"textAlign": "center"}}>
                                    <Button  variant="outlined" color="secondary" style={{ "width": "300px"}} onClick={this.toggleStepper} >
                                        Close
                                        <i className="material-icons" style={{"right": "20px", "position": "absolute", "width": "10px", "color": this.props.color.secondary}}>arrow_drop_up</i>
                                    </Button>
                                </p>
                            </Grid>
                        </div>
                    }
                    
                </Hidden>
                
            
                <Hidden only={['xs', 'sm']}>
                    <Grid item xs={2} sm={4} md={1} lg={1} xl={1}>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3}  xl={2}>
                        <FormStepsComponent color={this.props.color} currentState={this.state.currentStep} getSteps={this.getSteps} goToStep={this.goToStep} />
                    </Grid>
                </Hidden>
                
                <Grid item xs={12} sm={12} md={7} lg={7} xl={7} style={{'marginTop': '20px'}}>
                    
                    {
                         (this.props.location) && (this.props.location.state) &&                      
                            <FormContainerComponent 
                                goToStep={this.goToStep} 
                                color={this.props.color} 
                                currentStep={this.state.currentStep+1} 
                                totalSteps={this.getSteps().length} 
                                nextStep={this.nextStep} 
                                fieldData={this.getFieldData({})} 
                                dataSet={this.state.dataSet} 
                                title={this.state.stateDetails[this.state.currentStep]? this.state.stateDetails[this.state.currentStep].title : ""} 
                                subTitle={this.state.stateDetails[this.state.currentStep]? this.state.stateDetails[this.state.currentStep].subTitle : ""} 
                                getFinalDecission={this.getFinalDecission} 
                                settings={this.state.AppData.settings} 
                                dataSetUpdated={this.dataSetUpdated} 
                                showNotification={this.props.showNotification} 
                                pageID={this.props.pageID} 
                                appId={this.props.location.state.appId} 
                                createNewApp={this.props.location.state.createNewApp} 
                                selectedPage={this.props.location.state.selectedPage} 
                                cancelEdit={this.cancelEdit} 
                                Appresult={this.state.editappresult} 
                                AppData={this.props.AppData}
                                dobSafariIssueFixARP62964 = {this.props.dobSafariIssueFixARP62964}
                                mandatoryFieldBugARP65007 = {this.props.mandatoryFieldBugARP65007}/>
                   
                    }
                    {
                      (!(this.props.location && this.props.location.state)) &&
                            <FormContainerComponent 
                                goToStep={this.goToStep} 
                                color={this.props.color} 
                                currentStep={this.state.currentStep+1} 
                                totalSteps={this.getSteps().length} 
                                nextStep={this.nextStep} 
                                fieldData={this.getFieldData(this.state.appSteps[this.state.currentStep])} 
                                dataSet={this.state.dataSet} 
                                title={this.state.stateDetails[this.state.currentStep]? this.state.stateDetails[this.state.currentStep].title : ""} 
                                subTitle={this.state.stateDetails[this.state.currentStep]? this.state.stateDetails[this.state.currentStep].subTitle : ""} 
                                getFinalDecission={this.getFinalDecission} 
                                settings={this.state.AppData.settings} 
                                dataSetUpdated={this.dataSetUpdated} 
                                showNotification={this.props.showNotification} 
                                pageID={this.props.pageID} 
                                createNewApp={true}
                                dobSafariIssueFixARP62964 = {this.props.dobSafariIssueFixARP62964}
                                mandatoryFieldBugARP65007 = {this.props.mandatoryFieldBugARP65007}/>
                   
                    }
                </Grid>
                <ModalLoaderComponent open={this.state.openModal} handleClose={this.handleModalClose} />
                <ApplicationError showApplicationMessage={this.state.showApplicationMessage} closeApplicationMessage={() => this.setState({showApplicationMessage: false})} AppErrMsg={this.state.appErr} AppErrTitle={this.state.appErrTitle} ActualError={this.state.ActualError}/>  
            </Grid>
        );
    }
}

export default compose(withWidth())(PersonalLoanComponent);