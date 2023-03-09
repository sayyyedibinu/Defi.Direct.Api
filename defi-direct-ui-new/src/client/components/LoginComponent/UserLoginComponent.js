import React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MaskedInput from 'react-text-mask';
import FormControl from '@material-ui/core/FormControl';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import config from  "../../resources/config.json";
import dataShare from "../../../admin/components/Common/dataShare";
import generateGUID from "../../../admin/components/Common/generateGUID";
import RuleHelper from '../Common/RuleHelper';
import { Redirect } from 'react-router';
import './UserLoginStyle.css';
import 'date-input-polyfill-react';

export default class UserLoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            BorrowerFirstName: '',
            BorrowerLastName: this.props.dataSet.LastName,
            BorrowerEmail: this.props.dataSet.Email,
            BorrowerSSN: this.props.dataSet.SSN,
            BorrowerDOB: this.props.dataSet.DOB,
            dataToSave: '',
            borrowerData: {
                BorrowerLastName: this.props.dataSet.LastName,
                BorrowerEmail: this.props.dataSet.Email,
                BorrowerSSN: this.props.dataSet.SSN,
                BorrowerDOB: this.props.dataSet.DOB
            }
        };
    }
    componentDidUpdate = (prevProps) => {
        if(prevProps.clearData !== this.props.clearData){
            this.setState({
                BorrowerFirstName: '',
                BorrowerLastName: '',
                BorrowerEmail: '',
                BorrowerSSN: '',
                BorrowerDOB: ''
            });
        }
    }
    btnCloseHandler = () => {
        this.setState({
            BorrowerFirstName: '',
            BorrowerLastName: '',
            BorrowerEmail: '',
            BorrowerSSN: '',
            BorrowerDOB: ''
        });
        this.props.btnCloseHandler();
    }
    btnStartOverHandler = () => {
        this.props.versionMismatchHandler('startover', this.state.borrowerData);
    }
    btnContinueHandler = () => {
        this.setState({
            BorrowerFirstName: '',
            BorrowerLastName: '',
            BorrowerEmail: '',
            BorrowerSSN: '',
            BorrowerDOB: ''
        });
        this.props.versionMismatchHandler('continue');
    }

    handleChange = (event) => {
        let _temp = this.state.borrowerData;
        _temp[event.target.name] = event.target.value;
        this.setState(_temp);
    }

    saveApp = () => {
        if (this.state.BorrowerLastName === '' || this.state.BorrowerSSN === '' || this.state.BorrowerDOB === '' || this.state.Email === '') {
             this.props.showNotification('warning', 'All fields required.');
            return;
        }
        let _dataToSave = {};
        _dataToSave.borrowerData = this.state.borrowerData;
        _dataToSave.data = this.props.dataSet;
        _dataToSave.pageID = this.props.pageID;
        if (this.props.userMode==="newuser") {
            this.props.saveApplication(_dataToSave);
        }
        else {
            dataShare.getBorrowerAppData(_dataToSave, (error, response) => {
                if (!error && response.existingdata && response.existingdata.appsId) {
                    _dataToSave.appId = response.existingdata.appsId;
                    Object.assign(_dataToSave.data,response.existingdata.siteInfo.site.data);                             
                    this.redirect(_dataToSave);
                }
            });
        }
    }

    redirect = (_datainput) => {
        let _dataToSave = {
            borrowerData: _datainput.borrowerData,
            pageID: _datainput.appId
        };
        dataShare.viewDecision(_dataToSave, (error, response) => {
            console.log(error);
            console.log(response);
            if (error)
            {
                this.props.saveApplication(_datainput);
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
                        this.setState({ redirect : {
                            now: true,
                            pathname: '/Application/'+ response.siteId,
                            state: {AppData: response.appData.site,siteId:response.siteId,appId:response.appId,createNewApp:true,versionMisMatch:true}
                        }});  
                    
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

    formSubmitHandler = (event) => {
        this.saveApp();
        event.preventDefault();
    }
    buildConditionalProps = () => {
        let conditionalProps = {};
        conditionalProps.InputProps = {
            inputComponent: this.TextMaskCustom([/\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/])
        };
        return conditionalProps;
    }
    TextMaskCustom = (mask) => {
        return (props) => {
            let {
                inputRef,
                type,
                onChange,
                id,
                ...other
            } = props;
            return ( <
                MaskedInput { ...other
                }
                ref = {
                    inputRef
                }
                id = {
                    id + "_MaskedInput"
                }
                mask = {
                    mask
                }
                type = {
                    type
                }
                onBlur = {
                    this.handleChange
                }
                placeholderChar = {
                    '\u2000'
                }
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
    render(){
        const conditionalProps = this.buildConditionalProps();
        if (this.state.redirect && this.state.redirect.now) {
            return (
                <Redirect to={this.state.redirect} />
            );
        }      
        return(
            <Grid container spacing={0} className="ULC-Wrapper">
                <Grid item xs={12}>
                    <h3 className="ULM-Header">{this.props.userMode === "newuser" ? (this.props.forceSubmitApp === true ? "Please confirm the following information to continue with your application" : "Please confirm the following information to save your application"): "Please confirm the following information to retrieve your application"}</h3>
                </Grid>
                <Grid item xs={12}>
                    {
                        this.props.versionMisMatch === true &&
                        <div className="ULC-Footer" >
                            <p className="mismatchtext"> The application format has been updated since you saved your application. Choose 'STARTOVER' to ignore saved application and start with a new application. Choose 'CONTINUE' to continue with your saved application and we will port over relevant data from your saved application.
                                <br />
                                <Button variant="contained" className="appSecondaryClr" onClick={this.btnStartOverHandler}>
                                    StartOver
                                </Button> &nbsp;&nbsp;&nbsp;
                                <Button variant="contained" className="appSecondaryBGClr" onClick={this.btnContinueHandler}>
                                    Continue
                                </Button>
                            </p>
                        </div>

                    }
                    <div className="Text-Section" >
                        { 
                            this.props.versionMisMatch === false &&

                                <ValidatorForm ref="form" autoComplete="off" instantValidate={true} onSubmit={this.formSubmitHandler} onError={errors => console.log(errors)}>

                                    <Grid item xs={12} className="fieldItem">
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
                                        <div className="ULC-Footer">
                                            <Button variant="contained" className="cancelBtn appSecondaryClr" onClick={this.btnCloseHandler}>
                                                Cancel
                                            </Button>
                                            <Button variant="contained" className="insertBtn appSecondaryBGClr" type="submit">
                                                {this.props.userMode === "newuser" ? (this.props.forceSubmitApp === true ? 'Confirm' : 'Save') : 'Confirm'}
                                            </Button>
                                        </div>
                                    </Grid>
                                </ValidatorForm>
                            }
                    </div>
                </Grid>
            </Grid>
        );
    }
}
