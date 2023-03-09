import React from 'react';
import './UserLoginModalStyle.css';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import config from  "../../resources/config.json";
import dataShare from "../../../admin/components/Common/dataShare";
import generateGUID from "../../../admin/components/Common/generateGUID";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import MaskedInput from 'react-text-mask';
import FormControl from '@material-ui/core/FormControl';
import Notifications, {notify} from 'react-notify-toast';
import { Redirect } from 'react-router';
import RuleHelper from '../Common/RuleHelper';
import 'date-input-polyfill-react';



export default class UserLogInPageComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {BorrowerFirstName: '', BorrowerLastName: '', BorrowerEmail:'',BorrowerSSN:'',BorrowerDOB:'',dataToSave:'',borrowerData:'',loginMode:false,versionMisMatch:false,siteData:'',appId:'',siteId:'',oldversionactualData:'',latestSite:''};
        this.formSubmitHandler = this.formSubmitHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.SaveApp=this.SaveApp.bind(this);
        this.state.borrowerData = {            
            BorrowerLastName:'',
            BorrowerEmail:'',
            BorrowerSSN:'',
            BorrowerDOB:''          
        }
    
    } 

    componentDidUpdate = (prevProps) => {
       // if (this.props.data === prevProps.data) return;
        //this.setState({versionMisMatch: this.props.dataversionMisMatch});
       
    } 
    btnCloseHandler = () => {
        this.setState({ BorrowerFirstName: '', BorrowerLastName: '', BorrowerEmail:'',BorrowerSSN:'',BorrowerDOB:'' });
           } 
    btnStartOverHandler = () => {
        
        this.setState({versionMisMatch:false});
        this.versionMismatchHandler('startover');
    }
    btnContinueHandler = () => {
      
       this.setState({versionMisMatch:false});
       this.versionMismatchHandler('continue');
    }

    handleChange = (event) => {  
         let _temp = this.state.borrowerData;
        _temp[event.target.name] = event.target.value;
        this.setState(_temp);
       }
    
    versionMismatchHandler = (userInput,_borrowerdata) => {
            if (userInput === "continue") {

                 this.UpdateAppsfromUserLogin("continue");
            }
            else
            {                              
                this.UpdateAppsfromUserLogin("startover");
            }
    }

    UpdateAppsfromUserLogin(startoverflag){
        let updatedData={};
        updatedData=this.state.siteData.data;
        dataShare.updateApplicationData(updatedData,this.state.appId,startoverflag, (error, response) => {
            if(error){
                if (error.response && error.response.status === 403) 
                {
                    this.props.showNotification('error', error.response.data);
                    return;
                }
                else
                 {
                     this.props.showNotification('error', 'Internal server error while fetching information, please try after sometime.');
                    return;
                }     
            } 
            else
            {
                
                this.setState({latestSite: response.data});
                if (this.state.latestSite)
                {
                    this.setState({ redirect : {
                        now: true,
                        pathname: '/Application/'+ this.state.siteId,
                        state: {AppData: this.state.latestSite,siteId:this.state.siteId,appId:this.state.appId,createNewApp:true}
                  
                    }});
            }
                
            }   
           
        } )

    }

    getFinalDecission = (_data,_result) => {
        if(!_data) return false;
        
        if(Object.prototype.toString.call(_data.settings.decisionPageDisplayLogic) === "[object Undefined]") return false;
        if(_data.settings.decisionPageDisplayLogic === "null") return false;
        
        let _tempVar = {};
        _tempVar.displayLogic = true;
        _tempVar.displayLogicRule = _data.settings.decisionPageDisplayLogic;
        _tempVar.displayLogicRuleDesc = _data.settings.decisionPageDisplayLogicDesc;
        return RuleHelper.getConditionalDecisionDisplay(_tempVar, {Results: _result}) ;
    }
    
    SaveApp = () => {
        if(this.state.BorrowerLastName === ''|| this.state.BorrowerSSN === ''||this.state.BorrowerDOB===''||this.state.Email===''){
            return;
        }
        let _datainput = {};
            
        _datainput.borrowerData=this.state.borrowerData;
        _datainput.pageID=this.props.appId;
    
        this.redirect(_datainput) 

    }
    showNotification = (type, message) => {
        let errorMessageStyle = { background: '#d50000', text: "#FAFAFA" };
        let warningMessageStyle = { background: '#F57F17', text: "#FAFAFA" };
        let successMessageStyle = { background: '#4CAF50', text: "#FAFAFA" };
        notify.show(message, "custom", 5000, (type === 'success' ? successMessageStyle : (type === 'error' ? errorMessageStyle :  warningMessageStyle)) );
    }
    redirect = (_datainput) => {
        dataShare.viewDecision(_datainput, (error, response) => {
            if (error)
            {
                if (error.response && error.response.status === 403) this.showNotification('error', error.response.data);
                else this.props.showNotification('error', error.response.data);
                return;
            }
            else
            {
               
                if (response.message === 'Version match') 
                {
                
                        this.setState({ redirect : {
                            now: true,
                            pathname: '/Application/'+ response.siteId,
                            state: {AppData: response.appData.site,siteId:response.siteId,appId:response.appId,createNewApp:true}
                        }});  
                }
                else if (response.message === 'Version mismatch')
                {
                        this.setState({versionMisMatch:true,siteData:response.appData.site,
                            siteId:response.siteId,appId:response.appId
                        });
                    
                }
                else if (response.message === 'Decision received')
                {
                    let _resultData = JSON.parse(response.decision);
                    let _result=_resultData.custom_ack;

                    if(this.getFinalDecission(response.appData.site,_result) === true ) {
                        this.setState({ askToLeave: false, redirect : {
                            now: true,
                            pathname: '/Success/'+this.props.pageID,
                            state: {Results: _result, AppData: response.appData.site,siteId:this.props.pageID}
                        }});
                    }               
                    else {
                        this.setState({ redirect : {
                            now: true,
                            pathname: '/Pending/'+this.props.pageID,
                            state: {appId:response.appId, AppData: response.appData.site,Results:_result,siteId:this.props.pageID}
                        }});
                    }

                }



            }
            
             } );


    }
   
    formSubmitHandler = (event) => {
        
        this.SaveApp();
        event.preventDefault();
    }
    buildConditionalProps = () => {
        let conditionalProps = {};
        conditionalProps.InputProps={  inputComponent: this.TextMaskCustom([/\d/, /\d/, /\d/,'-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]) };
        return conditionalProps;
    }
    TextMaskCustom = (mask) => {        
        return (props) => {
          let { inputRef, type, onChange,id, ...other } = props;          
          return (
            <MaskedInput
              {...other}
              ref={inputRef}
              id={id+"_MaskedInput"}  
              mask={mask}
              type={type}
              onBlur={this.handleChange}
              placeholderChar={'\u2000'}
            />
          );
        }
      }
      buildValidators = (type) => {
        let errorMessages = [];
        let validators = [];
        validators.push("required");
        errorMessages.push("This field is required");

        validators.push("matchRegexp:^[\\d]{3}-[\\d]{2}-[\\d]{4}$");
        errorMessages.push("Invalid ssn")
        if (type === "errorMessages") {
            return errorMessages;
        }
        return validators;
      }
    render() {

        if (this.state.redirect && this.state.redirect.now) {
            return (
                <Redirect to={this.state.redirect} />
            );
        }

        const conditionalProps = this.buildConditionalProps();
        return (
            
            
                <div style={{ width: "100%" }}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={10} md={9} lg={6} className="ULM-Wrapper ULPC">
                            <div className="ULM-Container">
                                <Grid container spacing={0}>
                                
                                    <Grid item xs={12} className="ULM-Mismatch">
                                        <h2 className="ULM-Header">Please confirm the following information to retrieve your application</h2>
                                    
                                    <Grid item xs={12}>
                                        <div className="ULM-Footer" >
                                            {
                                                this.state.versionMisMatch === true &&
                                                <div>
                                                <p className="Mismatchtxt"> The application format has been updated since you saved your application. Choose 'STARTOVER' to ignore saved application and start with a new application. Choose 'CONTINUE' to continue with your saved application and we will port over relevant data from your saved application.
                                                    <br />
                                                </p>
                                                <p>
                                                <Button variant="contained" className="appSecondaryClr" onClick={this.btnStartOverHandler}>
                                                StartOver
                                            </Button>&nbsp;&nbsp;
                                            <Button variant="contained" className="appSecondaryBGClr" onClick={this.btnContinueHandler}>
                                                Continue
                                            </Button>
                                            </p>
                                            </div>
                                                
                                            }
                                            </div>
                                        </Grid>
                                        </Grid>
                                        <Grid item xs={12}>                                    
                                        <div className="Text-Section" >                                            { 
                                                                                              
                                                    <ValidatorForm ref="form" autoComplete="off" instantValidate={true} onSubmit={this.formSubmitHandler} onError={errors => console.log(errors)}>

                                                        <Grid item xs={12}>
                                                            <TextValidator
                                                                label="LastName"
                                                                placeholder="LastName"
                                                                onChange={this.handleChange}
                                                                name="BorrowerLastName"
                                                                value={this.state.BorrowerLastName}
                                                                validators={['required']}
                                                                errorMessages={['This field is required']}
                                                                fullWidth
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextValidator
                                                                type="date"
                                                                label="DOB"
                                                                onChange={this.handleChange}
                                                                InputLabelProps={{ shrink: true }}
                                                                name="BorrowerDOB"
                                                                value={this.state.BorrowerDOB}
                                                                validators={['required']}
                                                                errorMessages={['This field is required']}
                                                                fullWidth
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextValidator
                                                                 {...conditionalProps}
                                                                placeholder="SSN"
                                                                label="SSN"
                                                                onChange={this.handleChange}
                                                                name="BorrowerSSN"
                                                                value={this.state.BorrowerSSN}
                                                                validators={['required', 'matchRegexp:^[\\d]{3}-[\\d]{2}-[\\d]{4}$']}
                                                                errorMessages={['This field is required']}
                                                                fullWidth
                                                                validators={this.buildValidators("validators")} errorMessages={this.buildValidators("errorMessages")}  
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextValidator
                                                                fullWidth
                                                                placeholder="Email"
                                                                label="Email"
                                                                onChange={this.handleChange}
                                                                name="BorrowerEmail"
                                                                value={this.state.BorrowerEmail}
                                                                validators={['required', 'isEmail']}
                                                                errorMessages={['This field is required', 'Email is not valid']}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <div className="ULM-Footer">
                                                                <Button variant="contained" className="cancelBtn appSecondaryClr" onClick={this.btnCloseHandler}>
                                                                    Cancel
                                                                </Button>
                                                                <Button variant="contained" className="insertBtn appSecondaryBGClr" type="submit">
                                                                     Confirm
                                                                </Button>
                                                            </div>
                                                        </Grid>
                                                    </ValidatorForm>
                                            }
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        </div>

    )
    }
}
