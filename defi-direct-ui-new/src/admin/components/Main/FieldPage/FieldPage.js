import React from "react";
import {BrowserRouter as Router, Route, Link, Prompt, Redirect} from "react-router-dom";
import axios from 'axios';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Switch from '@material-ui/core/Switch';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MaskedInput from 'react-text-mask';

import config from "../../../resources/config.json";
import generateGUID from "../../Common/generateGUID";
import ManageList from "../ManageList/ManageList";
import FieldLogicModal from "../FieldLogicModal/FieldLogicModal";
import DateMinMax from "../../Builder/BuilderContainer/DateMinMax/DateMinMax";
import './FieldPageStyle.css';

const Switch_Theme = createMuiTheme({
   palette: {
       primary: {main: config.defaultSecondaryClr}
   }
});
export default class FieldPageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {existingRawData: {}, isActive: true, FieldLists: [], fieldName: "", fieldType: "Input", inputType: "Text Input", dataType: "string", displayFormat: "N/A", b_defaultValue: "N/A", minValue: "", maxValue: "", defaultValue: "", dropdownList: "States", xPath: "", showManageList: false,openDateMinMax: false, newDate: '', isMin: false, selMinOption: "custom", selMaxOption: "custom", selMinType: "Days", selMaxType: "Days", selMinDate: '', selMaxDate: '',chosenMinDays: "",chosenMaxDays:"",minErrMsg:"",maxErrMsg:"", fieldLogic: "", showFieldLogicModal: false, askToLeave: false};
        this.getFieldLists();
        if(this.props.match.params.mode === "update")
            this.state.fieldId = this.props.match.params.id;
        this.openDateMinMax = this.openDateMinMax.bind(this);
    }
    handleDataChange = () => {
        this.setState({askToLeave: true});
    }
    componentDidMount = () => {
        if(this.props.match.params.mode === "update")
            this.getFieldData();
    }
    openDateMinMax = (event) => {
        this.handleDataChange();
        this.setState({ openDateMinMax: true });
         var date_today=new Date();
         if(event.target.id === "min")
         {
             if (this.state.minValue)
             {
             this.setState({isMin: true,selDate:this.state.minValue?this.formatDate(this.state.minValue):'',chosenDays:this.state.chosenMinDays,selOption:this.state.selMinOption});
             }
            else
            {
                this.setState({isMin: true,selDate:this.formatDate(date_today),chosenDays:'',selOption:this.state.selMinOption});
            }
        }
        else
         {
             if (this.state.maxValue)
             {
             this.setState({isMin: false,selDate:this.state.maxValue?this.formatDate(this.state.maxValue):'',chosenDays:this.state.chosenMaxDays,selOption:this.state.selMaxOption});
            }
            else
            { this.setState({isMin: false,selDate:this.formatDate(date_today),chosenDays:'',selOption:this.state.selMaxOption});
        }
    }
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
    closeModal = () => {
        this.setState({ openDateMinMax: false });
    }

    setCalculatedDate = (newDate, isMin, option, type,cntDays) => {
        this.handleDataChange();

        if (isMin) {
            this.setState({ minValue: newDate, openDateMinMax: false, selMinOption: option, selMinType: type,chosenMinDays: cntDays });

        }
        else {
            this.setState({ maxValue: newDate, openDateMinMax: false ,selMaxOption: option, selMaxType: type,chosenMaxDays: cntDays });

        }
    }
    getFieldData = () => {
        document.dispatchEvent(new CustomEvent("showAppLoader"));
        axios.get(config.API_BASE_URL+'Fields/'+this.state.fieldId).then( (response) => {
            let _tempVar = this.state;
            let _options = response.data.options;
            
            if(Object.prototype.toString.call(_options.isActive) !== '[object Undefined]')
                _tempVar.isActive = _options.isActive;
            
            if(Object.prototype.toString.call(_options.readonly) !== '[object Undefined]'){
                if(_options.readonly === true)
                    _tempVar.fieldType =  "Output";
                else
                    _tempVar.fieldType =  "Input";
            }
               
            
            if(Object.prototype.toString.call(_options.title) !== '[object Undefined]')
                _tempVar.fieldName = _options.title;
            
            if(Object.prototype.toString.call(_options.inputType) !== '[object Undefined]')
                _tempVar.inputType = _options.inputType;
            
            if(Object.prototype.toString.call(_options.dataType) !== '[object Undefined]')
                _tempVar.dataType = _options.dataType;
            
            if(Object.prototype.toString.call(_options.fieldListId) !== '[object Undefined]')
                _tempVar.dropdownList = _options.fieldListId;
            
            if(Object.prototype.toString.call(_options.defaultValue) !== '[object Undefined]')
                _tempVar.defaultValue = _options.defaultValue;
            
            if(Object.prototype.toString.call(_options.displayFormat) !== '[object Undefined]')
                _tempVar.displayFormat = _options.displayFormat;
            
            if(Object.prototype.toString.call(_options.minValue) !== '[object Undefined]')
                _tempVar.minValue = _options.minValue;
            
            if(Object.prototype.toString.call(_options.maxValue) !== '[object Undefined]')
                _tempVar.maxValue = _options.maxValue;
                
            if(Object.prototype.toString.call(_options.minErrMsg) !== '[object Undefined]')
                _tempVar.minErrMsg = _options.minErrMsg;
            
            if(Object.prototype.toString.call(_options.maxErrMsg) !== '[object Undefined]')
                _tempVar.maxErrMsg = _options.maxErrMsg;
            
            if (Object.prototype.toString.call(_options.selMinOption) !== '[object Undefined]')
                _tempVar.selMinOption = _options.selMinOption;
            if (Object.prototype.toString.call(_options.selMaxOption) !== '[object Undefined]')
                _tempVar.selMaxOption = _options.selMaxOption;
            if (Object.prototype.toString.call(_options.selMinType) !== '[object Undefined]')
            _tempVar.selMinType = _options.selMinType;
            if (Object.prototype.toString.call(_options.selMaxType) !== '[object Undefined]')
            _tempVar.selMaxType = _options.selMaxType;
                
            if (Object.prototype.toString.call(_options.chosenMinDays) !== '[object Undefined]')
                _tempVar.chosenMinDays = _options.chosenMinDays;
            if (Object.prototype.toString.call(_options.chosenMaxDays) !== '[object Undefined]')
                _tempVar.chosenMaxDays = _options.chosenMaxDays;
            
            if(Object.prototype.toString.call(_options.defaultValue) !== '[object Undefined]')
                _tempVar.defaultValue = _options.defaultValue;
                _tempVar.b_defaultValue = _options.defaultValue;
            
            if(Object.prototype.toString.call(_options.xPath) !== '[object Undefined]')
                _tempVar.xPath = _options.xPath;
            
            if(Object.prototype.toString.call(_options.fieldLogic) !== '[object Undefined]')
                _tempVar.fieldLogic = _options.fieldLogic;
            
            _tempVar.existingRawData = response.data;
            this.setState(_tempVar);
        }, (error) => {
            console.error(error);
            this.props.showNotification('error', 'Internal server error while getting field details, please try again.');
        }).finally( () => document.dispatchEvent(new CustomEvent("hideAppLoader")) );
    }
    inputChanged = (event) => {
        
        this.handleDataChange();
        
        let _tempVar = {};
        
        if(event.target.name === 'minValue' || event.target.name === 'maxValue' || event.target.name === 'defaultValue'){
            if(this.state.displayFormat === 'percentage'){
                if(event.target.value){
                    if(/^\d+$/.test(event.target.value)) _tempVar[event.target.name] = event.target.value;
                }else _tempVar[event.target.name] = event.target.value;
            }else _tempVar[event.target.name] = event.target.value;
        }else _tempVar[event.target.name] = event.target.value;
        
        if(event.target.name === "fieldType"){
            if(event.target.value === "Output"){
                _tempVar['inputType'] = "Text Input";
                _tempVar['dataType'] = "string";
                _tempVar['displayFormat'] = "N/A";
            }
        }
        
        if(event.target.name === "inputType"){
            if(event.target.value === "Text Input")
                _tempVar['dataType'] = "string";
            if(event.target.value === "Dropdown" || event.target.value === "Listbox")
                _tempVar['dataType'] = "default_alphanumeric";
            if(event.target.value === "Checkbox")
                _tempVar['dataType'] = "boolean";
                _tempVar['b_defaultValue'] = "N/A";
        }
        if(event.target.name === "displayFormat"){
            if(event.target.value === "N/A"){
                _tempVar['minValue'] = "";
                _tempVar['maxValue'] = "";
                _tempVar['defaultValue'] = "";
                _tempVar['maxErrMsg'] = "";
                _tempVar['minErrMsg'] = "";
            }
            if(event.target.value === "currency"){
                _tempVar['minValue'] = "";
                _tempVar['maxValue'] = "";
                _tempVar['defaultValue'] = "";
                _tempVar['maxErrMsg'] = "";
                _tempVar['minErrMsg'] = "";
            }
            if(event.target.value === "percentage"){
                _tempVar['minValue'] = "";
                _tempVar['maxValue'] = "";
                _tempVar['defaultValue'] = "";
                _tempVar['maxErrMsg'] = "";
                _tempVar['minErrMsg'] = "";
            }
            if(event.target.value === "percentageWithDec"){
                _tempVar['minValue'] = "";
                _tempVar['maxValue'] = "";
                _tempVar['defaultValue'] = "";
                _tempVar['maxErrMsg'] = "";
                _tempVar['minErrMsg'] = "";
            }
        }
        
        if(event.target.name === "dataType"){
            if(event.target.value === "date"){ 
                _tempVar['displayFormat'] = "format1";
                _tempVar['minValue'] = "";
                _tempVar['maxValue'] = "";
                _tempVar['minErrMsg'] = "";
                _tempVar['maxErrMsg'] = "";
                _tempVar['defaultValue'] = "";
                _tempVar['selMinOption'] = "custom";
                _tempVar['selMaxOption'] = "custom";
                _tempVar['selMinType'] = "Days";
                _tempVar['selMaxType'] = "Days";
                _tempVar['chosenMinDays'] = '';
                _tempVar['chosenMaxDays'] = '';
            }else _tempVar['displayFormat'] = "N/A";
        }
        this.setState(_tempVar);
    }
    
    getFieldLists = () => {
        axios.get(config.API_BASE_URL+'FieldLists').then( (response) => {
            let _tempvar = {};
            _tempvar.FieldLists = response.data;
            if(this.props.match.params.mode !== "update"){
                if(response.data.length > 0) _tempvar.dropdownList = response.data[0].id;
            }
            this.setState(_tempvar);
        }, (error) => {
            console.error(error);
        });
    }
    
    CalcCustomDates = (days,type,dateRange) => {
       
       function add_years(dt,n) 
       {
       return new Date(dt.setFullYear(dt.getFullYear() + n));      
       }
       function minus_years(dt,n)
        {
            return new Date(dt.setFullYear(dt.getFullYear() - n));      
        }
       var today=new Date();
        var calcDate;
        if (type === "Days")
        {  
            calcDate = new Date(today.setTime(today.getTime() + days * 86400000 ));               
            calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
        }
        if (type === "Weeks")
        {  
            calcDate = new Date(today.setDate(today.getDate() + (days * 7)));               
            calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
        }
        if (type === "Months")
        {  
            calcDate = new Date(today.setMonth(today.getMonth()+parseInt(days)));          
            calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
        }
        if (type === "Years")
        {  
            if(dateRange === "mindate"){
                calcDate =minus_years(today,parseInt(days));
            }
            else{
                calcDate =add_years(today,parseInt(days)); 
            } 
            calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
        }
        var dt1=new Date(calcDate);
        return dt1;
    }
    
    cancelField = (event) => {
        event.stopPropagation();
        this.setState({askToLeave: false}, () => {
            this.props.history.push('/main/fields');
        });
    }
    saveField = (event) => {
        event.stopPropagation();
        
        let _options = {isActive: this.state.isActive};
        if(this.state.fieldName === ""){
            this.props.showNotification('warning', 'Enter Field Name.');
            return;
        }
        if (this.state.dataType === "date" && this.state.selMaxOption === "static" && this.state.selMinOption === "static") 
        {
            if (this.state.minValue && this.state.maxValue) {
                let dateOne = new Date(this.state.minValue); 
                let dateTwo = new Date(this.state.maxValue)
                if (dateTwo < dateOne) {
                    this.props.showNotification('warning', 'Max value should be greater than Min value.');
                    return;
                }
            }
        }
        if (this.state.dataType === "date" && this.state.selMaxOption === "custom" && this.state.selMinOption === "custom") 
        {
            if (this.state.minValue && this.state.maxValue) {                
                let dateOne =  this.CalcCustomDates(this.state.chosenMinDays,this.state.selMinType,'mindate');
                let dateTwo = this.CalcCustomDates(this.state.chosenMaxDays,this.state.selMaxType,'maxdate');
                dateOne.setHours(0, 0, 0, 0);            
                dateTwo.setHours(0, 0, 0, 0);  
                if (dateTwo < dateOne) {
                    this.props.showNotification('warning', 'Max value should be greater than Min value.');
                    return;
                }
            }
        }
        if(this.state.fieldName.match(/^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/) === null){
            this.props.showNotification('warning', 'Enter Valid Field Name Without Any Special Characters.');
            return;
        }
        
        if(this.state.fieldType === "Input") _options.readonly = false;
        else{
            _options.readonly = true;
            if(this.state.dataType === "number"){
                if(this.state.xPath === "" && this.state.fieldLogic === ""){
                    this.props.showNotification('warning', 'X-Path Required for Field Type Output.');
                    return;
                }
            }else{
                if(this.state.xPath === ""){
                    this.props.showNotification('warning', 'X-Path Required for Field Type Output.');
                    return;
                }
            }
            
            _options.xPath = this.state.xPath;
        }
        _options.title = this.state.fieldName;
        _options.id = this.state.fieldName.split(" ").join("");
        _options.inputType = this.state.inputType;
        
        if(this.state.inputType === "Dropdown" || this.state.inputType === "Listbox"){
            _options.fieldListId = this.state.dropdownList;
            _options.dataType = "string";
        }else if(this.state.inputType === "Text Input"){
            _options.dataType = this.state.dataType;
            if(this.state.dataType === "boolean"){
                _options.defaultValue = this.state.b_defaultValue;
            }else if(this.state.dataType === "number"){
                _options.displayFormat = this.state.displayFormat;
                _options.minValue = this.state.minValue;
                _options.maxValue = this.state.maxValue;
                _options.minErrMsg = this.state.minErrMsg;
                _options.maxErrMsg = this.state.maxErrMsg;
                _options.defaultValue = this.state.defaultValue;
                _options.fieldLogic = this.state.fieldLogic;
            }else if (this.state.dataType === "date") {
                _options.displayFormat = this.state.displayFormat;
                _options.minValue = this.state.minValue;
                _options.maxValue = this.state.maxValue;
                _options.minErrMsg = this.state.minErrMsg;
                _options.maxErrMsg = this.state.maxErrMsg;
                _options.defaultValue = this.state.defaultValue;                
                _options.selMinOption = this.state.selMinOption;
                _options.selMaxOption = this.state.selMaxOption;               
                _options.selMinType = this.state.selMinType;
                _options.selMaxType = this.state.selMaxType;
                _options.chosenMinDays = this.state.chosenMinDays;
                _options.chosenMaxDays = this.state.chosenMaxDays;
                if (this.state.selMinOption === "static")
                {   
                    _options.selMinType = "Days";
                    _options.chosenMinDays = '';
                }
                if (this.state.selMaxOption === "static")
                {
                    _options.selMaxType = "Days";               
                  _options.chosenMaxDays = '';
                }
                
                
            }
            else if(this.state.dataType === "string"){
                _options.displayFormat = this.state.displayFormat;
                if(this.state.displayFormat === "N/A"){
                    _options.minValue = this.state.minValue;
                    _options.maxValue = this.state.maxValue;
                    _options.minErrMsg = this.state.minErrMsg;
                    _options.maxErrMsg = this.state.maxErrMsg;
                }
            }
        }else if(this.state.inputType === "Checkbox"){
            _options.defaultValue = this.state.b_defaultValue;
            _options.dataType = "boolean";
        }
        if(this.state.dataType !== "date" && _options.minValue !== "" && _options.maxValue !== "" ){
            if(parseFloat(_options.minValue) > parseFloat(_options.maxValue)){
                this.props.showNotification('warning', 'Min Value is greater than Max Value.');
                return;
            }
        }
            
        if(_options.defaultValue !== ""){
            if(_options.minValue !== ""){
                if(parseFloat(_options.defaultValue) < parseFloat(_options.minValue)){
                    this.props.showNotification('warning', 'Default Value should be between Min Value and Max Value.');
                    return;
                }
            }
            if(_options.maxValue !== ""){
                if(parseFloat(_options.defaultValue) > parseFloat(_options.maxValue)){
                    this.props.showNotification('warning', 'Default Value should be between Min Value and Max Value.');
                    return;
                }
            }
        }
        
        let _saveData = {};
        let _apiUrl = config.API_BASE_URL+'Fields';
        let _apiMode = 'post';
        
        if(this.props.match.params.mode === "update"){
            _saveData = this.state.existingRawData;
            _saveData.options = _options;
            _apiUrl = config.API_BASE_URL+'Fields/savepatch';
            _apiMode = 'patch';
        }else{
            _saveData = {
                id: generateGUID(),
                isExtended: true,
                isSystem: false,
                options: _options
            }
            _apiUrl = config.API_BASE_URL+'Fields/save';
            _apiMode = 'post';
        }
        
        document.dispatchEvent(new CustomEvent("showAppLoader"));
        
        axios[_apiMode](_apiUrl, _saveData).then( (response) => {
            this.setState({askToLeave: false});
            if(this.props.match.params.mode !== "update"){
                this.props.showNotification('success', 'New Field Created Successfully.');
                this.props.history.push('/main/fields');
            }else{
                this.props.showNotification('success', 'Field Updated Successfully.');
            }
        }, (error) => {
            console.error(error.response.data);
            if (error.response.status === 409)
                this.props.showNotification('error', error.response.data);
            else
                this.props.showNotification('error', 'Internal server error while creating field, please try again.');
        }).finally( () => document.dispatchEvent(new CustomEvent("hideAppLoader")) );
    }
    TextMask_Percentage = (props) => {
      const { inputRef, ...other } = props;

      return (
        <MaskedInput
          {...other}
          ref={inputRef}
          mask={[/[0-9]/, /\d/,'%']}
          placeholderChar={'\u2000'}
          showMask
        />
      );
    }
    TextMask_PercentageWithDec = (props) => {
      const { inputRef, ...other } = props;

      return (
        <MaskedInput
          {...other}
          ref={inputRef}
          mask={[/[0-9]/, /\d/,'.', /\d/, /\d/,'%']}
          placeholderChar={'\u2000'}
          showMask
        />
      );
    }
    
    toggleManageList = () => {
        this.setState({showManageList: !this.state.showManageList});
    }
    
    openFieldLogicModal = () => {
        this.setState({showFieldLogicModal: true});
    }
    submitFieldLogic = (data) => {
        let fieldLogic = "";
        if(data !== ""){
            try{
                fieldLogic = JSON.stringify(data);
            }catch(e){
                console.error(e);
            }
        }
        this.setState({showFieldLogicModal: false, fieldLogic: fieldLogic});
        this.handleDataChange();
    }
    closeFieldLogicModal = () => {
        this.setState({showFieldLogicModal: false})
    }
    
    getLogicToDisplay = () => {
        if(this.state.fieldLogic === "") return "";
        try {
            let fieldLogic = JSON.parse(this.state.fieldLogic);
            let fieldLogicString = "";
            for(let i = 0; i < fieldLogic.length; i++){
                fieldLogicString += fieldLogic[i].text +' ';
            }
            return fieldLogicString;
            
        } catch(e){
            console.warn(e);
            return "";
        }
    }
    render(){
        return(
            <div className="MainWrapper">
                <div className="fieldWrapper">
            
                    <Prompt
                        when={this.state.askToLeave === true && this.props.match.params.mode === "update"}
                        message={() => {
                            return `Are you sure you want to leave?  You could lose your data.`;
                            }
                        }
                    />

                    <FieldLogicModal showFieldLogicModal={this.state.showFieldLogicModal} submitFieldLogic={this.submitFieldLogic} closeFieldLogicModal={this.closeFieldLogicModal} fieldLogic={this.state.fieldLogic} showNotification={this.props.showNotification} />
                    <ManageList refreshFieldList={this.getFieldLists} showManageList={this.state.showManageList} toggleManageList={this.toggleManageList} showNotification={this.props.showNotification} />
                    <DateMinMax selDateVal={this.state.isMin?this.formatDate(this.state.minValue):this.formatDate(this.state.maxValue)} selOption={this.state.isMin?this.state.selMinOption:this.state.selMaxOption} selType={this.state.isMin?this.state.selMinType:this.state.selMaxType} showModal={this.state.openDateMinMax} closeModal={this.closeModal} setCalculatedDate={this.setCalculatedDate} isMin={this.state.isMin} chosenDays={this.state.isMin? this.state.chosenMinDays:this.state.chosenMaxDays}/>

                    <form className="fieldPageForm" autoComplete="off">
            
                    <Grid container>
                        <Grid item sm={6} xs={12}>
                            <span className="FP-paginationCnt">
                                <span><Link to="/main/configuration">Configuration </Link>/ </span>
                                <span><Link to="/main/fields">All Fields </Link>/ </span>
                                 {this.props.match.params.mode === 'create' ? 'New' : 'Update'}
                            </span>
                        </Grid>
                        <Grid item sm={6} xs={12} className="actionCnt">
                            {
                                ( this.state.inputType === "Dropdown" || this.state.inputType === "Listbox" ) && 
                                <Button variant="contained" className="manageListBtn appSecondaryBGClr" onClick={this.toggleManageList}>
                                    Manage Lists
                                </Button>
                            }
                            Active: 
                            <MuiThemeProvider theme={Switch_Theme}>
                                <Switch className="toggleBtn" checked={this.state.isActive} onChange={() => {this.setState({isActive: !this.state.isActive});this.handleDataChange();}} color="primary" />
                            </MuiThemeProvider>
                            <Button className="cancelFieldBtn appSecondaryClr" onClick={this.cancelField}>
                                Cancel
                            </Button>
                            <Button variant="contained" className="saveFieldBtn appSecondaryBGClr" onClick={this.saveField}>
                                Save Field
                            </Button>
                        </Grid>
                    </Grid>
                
                    <div className="fieldCnt">
                        
                        <Grid container>
            
                            <Grid item sm={4} xs={12} className="inputBoxCnt">
                                <TextField className="inputBox" label="Field Name *" name="fieldName" value={this.state.fieldName} onChange={this.inputChanged} fullWidth/>
                            </Grid>
            
                            <Grid item sm={4} xs={12}>
                                <FormControl className="formCtrl">
                                    <InputLabel>Field Type *</InputLabel>
                                    <Select className="selectBox" value={this.state.fieldType} name="fieldType" onChange={this.inputChanged} fullWidth>
                                        <MenuItem value="Input">Input</MenuItem>
                                        <MenuItem value="Output">Output</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
            
                            {
                                this.state.fieldType === "Input" && 
                                <Grid item sm={4} xs={12}>
                                    <FormControl className="formCtrl">
                                        <InputLabel>Input Type *</InputLabel>
                                        <Select className="selectBox" value={this.state.inputType} name="inputType" onChange={this.inputChanged}>
                                            <MenuItem value="Text Input">Text Box</MenuItem>
                                            <MenuItem value="Dropdown">Dropdown</MenuItem>
                                            <MenuItem value="Checkbox">Checkbox</MenuItem>
                                            <MenuItem value="Listbox">Listbox</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            }
                            
                        </Grid>

                        <hr className="divider" />
                            
                        <Grid container>
                            
                            {
                                this.state.inputType === "Text Input" && 
                                <Grid item sm={4} xs={12}>
                                    <FormControl className="formCtrl">
                                        <InputLabel>Data Type *</InputLabel>
                                        <Select className="selectBox" value={this.state.dataType} name="dataType" onChange={this.inputChanged}>
                                            <MenuItem value="string">Alphanumeric</MenuItem>
                                            <MenuItem value="number">Number</MenuItem>
                                            <MenuItem value="date">Date</MenuItem>
                                            <MenuItem value="boolean">Boolean</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            }
            
                            {
                                (this.state.inputType === "Text Input" && this.state.dataType === "string") && 
                                <Grid item sm={4} xs={12}>
                                    <FormControl className="formCtrl">
                                        <InputLabel>Display Format</InputLabel>
                                        <Select className="selectBox" value={this.state.displayFormat} name="displayFormat" onChange={this.inputChanged}>
                                            <MenuItem value="N/A">
                                              <em>None</em>
                                            </MenuItem>
                                            <MenuItem value="email">Email-abc@xyz.com</MenuItem>
                                            <MenuItem value="phoneNumber">Phone Number-(___)___-____</MenuItem>
                                            <MenuItem value="ssn">SSN/SIN-___-__-____</MenuItem>
                                            <MenuItem value="zip">Zipcode-12345</MenuItem>
                                            <MenuItem value="zip4">Zipcode-12345-0000</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            }
            
                            {
                                this.state.dataType === "number" && 
                                <Grid item sm={4} xs={12}>
                                    <FormControl className="formCtrl">
                                        <InputLabel>Display Format</InputLabel>
                                        <Select className="selectBox" value={this.state.displayFormat} name="displayFormat" onChange={this.inputChanged}>
                                            <MenuItem value="N/A">
                                              <em>None</em>
                                            </MenuItem>
                                            <MenuItem value="currency">Currency-$00.00</MenuItem>
                                            <MenuItem value="percentage">Percentage-00%</MenuItem>
                                            <MenuItem value="percentageWithDec">Percentage-00.00%</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            }
                            
                            {
                                this.state.dataType === "date" && 
                                <Grid item sm={4} xs={12}>
                                    <FormControl className="formCtrl">
                                        <InputLabel>Display Format</InputLabel>
                                        <Select className="selectBox" value={this.state.displayFormat} name="displayFormat" onChange={this.inputChanged}>
                                            <MenuItem value="format1">Mar 14th, 2018</MenuItem>
                                            <MenuItem value="format2">3/14/2018</MenuItem>
                                            <MenuItem value="format3">Mar 14th, 2018 6 PM</MenuItem>
                                            <MenuItem value="format4">3/14/2018 6 PM</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            }
                            
                            
                            {
                                (this.state.inputType === "Dropdown" || this.state.inputType === "Listbox") && 
                                <Grid item sm={4} xs={12}>
                                    <FormControl className="formCtrl">
                                        <InputLabel>Dropdown Display Items</InputLabel>
                                        <Select className="selectBox" value={this.state.dropdownList} name="dropdownList" onChange={this.inputChanged}>
                                            {
                                                this.state.FieldLists.map( (_data) => {
                                                    return <MenuItem key={_data.id} value={_data.id}>{_data.name}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                            }
                            
                            <Grid item xs={12}>
                                <hr className="divider" />
                            </Grid>

                            {
                                ( this.state.fieldType !== "Output" &&  this.state.inputType === "Text Input" && this.state.dataType !== "boolean" && (this.state.dataType === "date" || this.state.displayFormat === "N/A" || this.state.displayFormat === "currency" || this.state.displayFormat === "percentage" || this.state.displayFormat === "percentageWithDec") ) && 
                                <Grid item xs={12}>
                                    <Grid container className="innerCnt">
                                        <Grid item sm={4} xs={12} className="inputBoxCnt">
                                            {
                                                (this.state.displayFormat !== "currency" && this.state.dataType !== "date" && this.state.displayFormat !== "percentage" && this.state.displayFormat !== "percentageWithDec") && 
                                                <TextField type="number" className="inputBox" label={this.state.dataType === "string" ? "Min Length" : "Min Value"} value={this.state.minValue} name="minValue" margin="normal" fullWidth onChange={this.inputChanged} />
                                            }
                                            {
                                                    (this.state.dataType === "date") &&
                                                    <div className="minValueCnt">
                                                        <TextField InputProps={{readOnly: true}} id="min" className="inputBox" label="Min Value" value={this.state.minValue} name="minValue" margin="normal" fullWidth onChange={this.inputChanged} onClick={this.openDateMinMax} />
                                                        {
                                                            this.state.minValue !== '' && <i className="material-icons" onClick={() => this.setState({minValue: ""})}>close</i>
                                                        }
                                                    </div>
                                                    
                                                }
                                            {
                                                this.state.displayFormat === "currency" && 
                                                <FormControl fullWidth>
                                                  <InputLabel htmlFor="minValue">Min Value</InputLabel>
                                                  <Input 
                                                    type="number"
                                                    id="minValue"
                                                    name="minValue"
                                                    value={this.state.minValue}
                                                    onChange={this.inputChanged}
                                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                  />
                                                </FormControl>
                                            }
                                            {
                                                (this.state.displayFormat === "percentage" || this.state.displayFormat === "percentageWithDec") && 
                                                <FormControl fullWidth>
                                                  <InputLabel htmlFor="minValue">Min Value</InputLabel>
                                                  <Input 
                                                    type="number"
                                                    id="minValue"
                                                    name="minValue"
                                                    value={this.state.minValue}
                                                    onChange={this.inputChanged}
                                                    endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                                  />
                                                </FormControl>
                                            }
                                            {  
                                                (this.state.minValue) && 
                                                <FormControl fullWidth> 
                                                    <TextField className="inputBox" label="Min Error" name="minErrMsg" value={this.state.minErrMsg} onChange={this.inputChanged} fullWidth/>
                                                </FormControl>
                                            }
                                            
                                        </Grid>
                                        <Grid item sm={4} xs={12} className="inputBoxCnt">
                                            {
                                                (this.state.displayFormat !== "currency" && this.state.dataType !== "date" && this.state.displayFormat !== "percentage" && this.state.displayFormat !== "percentageWithDec") && 
                                                <TextField type="number" className="inputBox" label={this.state.dataType === "string" ? "Max Length" : "Max Value"} value={this.state.maxValue} name="maxValue" margin="normal" fullWidth onChange={this.inputChanged} />
                                            }
                                            {
                                                    (this.state.dataType === "date") &&
                                                    <div className="maxValueCnt">
                                                        <TextField InputProps={{readOnly: true}} id="max" className="inputBox" label="Max Value" value={this.state.maxValue} name="maxValue" margin="normal" fullWidth onChange={this.inputChanged} onClick={this.openDateMinMax} />
                                                        {
                                                            this.state.maxValue !== '' && <i className="material-icons" onClick={() => this.setState({maxValue: ""})}>close</i>
                                                        }
                                                    </div>
                                                    
                                                }
                                            {
                                                this.state.displayFormat === "currency" && 
                                                <FormControl fullWidth>
                                                  <InputLabel htmlFor="maxValue">Max Value</InputLabel>
                                                  <Input 
                                                    type="number"
                                                    id="maxValue"
                                                    name="maxValue"
                                                    value={this.state.maxValue}
                                                    onChange={this.inputChanged}
                                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                  />
                                                </FormControl>
                                            }
                                            {
                                                (this.state.displayFormat === "percentage" || this.state.displayFormat === "percentageWithDec") && 
                                                <FormControl fullWidth>
                                                  <InputLabel htmlFor="maxValue">Max Value</InputLabel>
                                                  <Input 
                                                    type="number"
                                                    id="maxValue"
                                                    name="maxValue"
                                                    value={this.state.maxValue}
                                                    onChange={this.inputChanged}
                                                    endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                                  />
                                                </FormControl>
                                            }
                                            {  
                                                (this.state.maxValue) && 
                                                <FormControl fullWidth>                                                 
                                                  <TextField id="maxErr" className="inputBox" label="Max Error" value={this.state.maxErrMsg} name="maxErrMsg" margin="normal" fullWidth onChange={this.inputChanged} />

                                                </FormControl>
                                            }
                                        </Grid>
                                        {
                                            this.state.dataType !== "string" && 
                                            <Grid item sm={4} xs={12} className="inputBoxCnt">
                                            </Grid>
                                        }
                                        
                                    </Grid>
                                </Grid>
                            }
                            {
                                this.state.fieldType === "Output" && 
                                <Grid item xs={12}>
                                    <TextField label="X-Path *" multiline rows="1" name="xPath" value={this.state.xPath} onChange={this.inputChanged} helperText="LOS X-Path is required if there is no field logic." fullWidth/>
                                </Grid>
                            }
                            
                        </Grid>

                    </div>

                    <Grid container className="footerCnt">
                        <Grid item sm={6} xs={12}>
                            {
                                (this.state.fieldType === "Output" && this.state.dataType === "number") && 
                                <div className="editDisplayLogicCnt" onClick={this.openFieldLogicModal}>
                                    <span className="line1">
                                        <i className="material-icons">edit</i> Edit Field Logic (Edit)
                                    </span>
                                    <p className="line2">
                                        Use field logic to dynamically set field value or visibility based on other fields 
                                    </p>
                                    {
                                        this.state.fieldLogic !== "" && 
                                            <p className="line3">
                                                {this.getLogicToDisplay()}
                                            </p>
                                    }
                                    
                                </div>
                            }
                            
                        </Grid>
                        <Grid item sm={6} xs={12} className="actionCnt">
                            <Button className="cancelFieldBtn appSecondaryClr" onClick={this.cancelField}>
                                Cancel
                            </Button>
                            <Button variant="contained" className="saveFieldBtn appSecondaryBGClr" onClick={this.saveField}>
                                Save Field
                            </Button>
                        </Grid>
                    </Grid>
            
                    </form>
                </div>
            </div>
        )
    }
}
