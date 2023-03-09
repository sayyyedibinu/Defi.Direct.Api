import React from 'react';
import './FormContainerComponent.css';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import MaskedInput from 'react-text-mask';
import NumberFormat from 'react-number-format';
import InputMask from 'react-input-mask';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { draftToHtml } from 'react-wysiwyg-typescript';
import ReactHtmlParser from 'react-html-parser';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import RuleHelper from '../../Common/RuleHelper';
import Formatter from '../../Common/formatter';
import UserLogInModal from '../../UserLogIn/UserLoginModalComponent';
import dataShare from '../../../../admin/components/Common/dataShare';
import generateGUID from "../../../../admin/components/Common/generateGUID";
import Tooltip from '@material-ui/core/Tooltip';
import { userInfo } from 'os';
import 'date-input-polyfill-react';
 
let fieldLogicProcess;

class FormContainerComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedType: "", dataSet: this.props.dataSet, fieldLogic: {}, listBoxValid: false, phoneNumberArr: [], showLogInModal: false, userMode: 'newuser', appsId: '', versionMisMatch: false, oldVersionData: {}, forceSubmitApp: false, arrowRef: null,valuechangd:false,showSaveMsg:true,
            errorMsg:{}};
        
        this.formSubmitHandler = this.formSubmitHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getInputBox = this.getInputBox.bind(this);
        this.getDropdown = this.getDropdown.bind(this);
        this.saveApplication = this.saveApplication.bind(this);
        this.versionMismatchHandler = this.versionMismatchHandler.bind(this);
        if (this.props.appId)
            this.state.appsId=this.props.appId;
        
        let _invalidFields = [];
        let _checkTimer;
        if(document.addEventListener){
            document.addEventListener('invalid', function(e){
                _invalidFields.push(e.target.attributes.name.nodeValue);
                invalidSubmit();
            }, true);
        }
        
        let invalidSubmit = () => {
            if(_checkTimer) clearTimeout(_checkTimer);
            _checkTimer = setTimeout(() => {
                if(_invalidFields.length > 0) this.props.showNotification('warning', "Please fill this field.");
                _invalidFields = [];
            }, 500);
        }
    }
    
    
    componentWillMount = () => {
        ValidatorForm.addValidationRule('minStringLengthCustom', (field,val) => {
            if (field.length === 0)
                return true;
            return parseInt(val) <= field.length;
        });
        ValidatorForm.addValidationRule('maxStringLengthCustom', (field,val) => {
            if (field.length === 0)
                return true;
            return parseInt(val) >= field.length;
        });
        ValidatorForm.addValidationRule('minNumberCustom', (field,val) => {
            if (field.length === 0)
                return true;
            let rawField = field;
            if(Object.prototype.toString.call(rawField) === "[object String]") rawField = field.replace(/[,$%]/g,'');
            return parseFloat(val) <= parseFloat(rawField);
        });
        ValidatorForm.addValidationRule('maxNumberCustom', (field,val) => {
            if (field.length === 0)
                return true;
            let rawField = field;
            if(Object.prototype.toString.call(rawField) === "[object String]") rawField = field.replace(/[,$%]/g,'');
            return parseFloat(val) >= parseFloat(rawField);
        });
        ValidatorForm.addValidationRule('minDateStatic', (field,val) => {
            if (field.length === 0)
                return true;
            var mindt=this.formatDate(val);
            if ((new Date(mindt).getTime()) > (new Date(field).getTime())) 
             {return false;}
            else    
            {return true;}        
        });     
        ValidatorForm.addValidationRule('minDateCustom', (field,val) => {
            if (field.length === 0)
                return true;
            var [mindays, type] = val.split("*")
            var today=new Date();
            var calcDate;
            if (type === "Days")
            {  
                calcDate = new Date(today.setTime(today.getTime() + mindays * 86400000 ));               
                calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
            }
            if (type === "Weeks")
            {  
                calcDate = new Date(today.setDate(today.getDate() + (mindays * 7)));               
                calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
            }
            if (type === "Months")
            {  
                calcDate = new Date(today.setMonth(today.getMonth()+parseInt(mindays)));          
                calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
            }
            if (type === "Years")
            {                 
               calcDate = this.minus_years(today,parseInt(mindays));                     
                calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
            }
            var dt1=new Date(calcDate);
            var dt2=new Date(field); 
            dt2.setHours(0, 0, 0, 0);            
            dt1.setHours(0, 0, 0, 0);                         
           if ((new Date(dt1).getTime()) > (new Date(dt2).getTime())) 
             {
                 return false;
                }
            else    
            {
                return true;
            }      
        });
        ValidatorForm.addValidationRule('maxDateStatic', (field,val) => {
            if (field.length === 0)
                return true;
            var mindt=this.formatDate(val);
            if ((new Date(mindt).getTime()) < (new Date(field).getTime())) 
                return false;
            else
                return true;
        });
        ValidatorForm.addValidationRule('maxDateCustom', (field,val) => {
            if (field.length === 0)
                return true;
            var [maxdays, type] = val.split("*")
            var today=new Date();
            var calcDate;
            if (type === "Days")
            {  
                calcDate = new Date(today.setTime(today.getTime() + maxdays * 86400000 ));               
                calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
            }
            if (type === "Weeks")
            {  
                calcDate = new Date(today.setDate(today.getDate() + (maxdays * 7)));               
                calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
            }
            if (type === "Months")
            {  
                calcDate = new Date(today.setMonth(today.getMonth()+parseInt(maxdays)));          
                calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
            }
            if (type === "Years")
            {  
                calcDate =this.add_years(today,parseInt(maxdays));                     
                calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
            }
            var dt1=new Date(calcDate);
            var dt2=new Date(field); 
            dt2.setHours(0, 0, 0, 0);            
            dt1.setHours(0, 0, 0, 0);    
            if ((new Date(dt1).getTime()) < (new Date(dt2).getTime())) 
             {
                 return false;
                }
            else    
            {
                return true;
            }  
        });
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
    add_years(dt,n) 
    {
    return new Date(dt.setFullYear(dt.getFullYear() + n));      
    }
    minus_years(dt,n)
    {
        return new Date(dt.setFullYear(dt.getFullYear() - n));      
    }
    componentDidUpdate = (prevProps) => {
        
        if (prevProps.dataSet === this.props.dataSet) return;
        
        this.setState({dataSet: this.props.dataSet, versionMisMatch: this.props.versionMisMatch}, () => this.props.dataSetUpdated);
    }

    formSubmitHandler(event) {
        if (this.props.settings.createManLogin === true && this.props.currentStep === this.props.totalSteps && !this.state.appsId){
            this.setState({ showLogInModal: true, userMode: "newuser", forceSubmitApp: true,showSaveMsg:false });
            event.preventDefault();
            return;
        }

        if (this.state.appsId && this.state.valuechangd){this.UpdateApps("update");event.preventDefault();}
        this.state.valuechangd=false;
        this.props.nextStep(this.state.dataSet,this.state.appsId);
        event.preventDefault();
    }
    
    
    handleChange(event){        
        let _tempVar = this.state;
        if (_tempVar.dataSet[event.target.name] !== event.target.value)
        { 
            this.state.valuechangd=true;
            _tempVar.dataSet[event.target.name] = event.target.value;
            this.setState(_tempVar,() => {
                this.props.dataSetUpdated();
                this.computeFieldLogic()
            });
        }
        else
        {
            this.setState({valuechangd:false});

        }
    }
    minDateCustomValidation(field,val) {
        if (field.length === 0)
                return true;
            var [mindays, type] = val.split("*")
            var today=new Date();
            var calcDate;
            if (type === "Days")
            {  
                calcDate = new Date(today.setTime(today.getTime() + mindays * 86400000 ));               
                calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
            }
            if (type === "Weeks")
            {  
                calcDate = new Date(today.setDate(today.getDate() + (mindays * 7)));               
                calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
            }
            if (type === "Months")
            {  
                calcDate = new Date(today.setMonth(today.getMonth()+parseInt(mindays)));          
                calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
            }
            if (type === "Years")
            {                 
               calcDate =this.minus_years(today,parseInt(mindays));                     
                calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
            }
           var dt1=new Date(calcDate.replace(/-/g, "/"));
           var dt2=new Date(field.replace(/-/g, "/"));          
            dt2.setHours(0, 0, 0, 0);            
            dt1.setHours(0, 0, 0, 0);  
           if ((new Date(dt1).getTime()) > (new Date(dt2).getTime())) 
             {
                 return false;
                }
            else    
            {
                return true;
            } 
    }
    maxDateCustomValidation(field,val){
        if (field.length === 0)
        return true;
    var [maxdays, type] = val.split("*")
    var today=new Date();
    var calcDate;
    if (type === "Days")
    {  
        calcDate = new Date(today.setTime(today.getTime() + maxdays * 86400000 ));               
        calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
    }
    if (type === "Weeks")
    {  
        calcDate = new Date(today.setDate(today.getDate() + (maxdays * 7)));               
        calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
    }
    if (type === "Months")
    {  
        calcDate = new Date(today.setMonth(today.getMonth()+parseInt(maxdays)));          
        calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
    }
    if (type === "Years")
    {  
        calcDate =this.add_years(today,parseInt(maxdays));                     
        calcDate = calcDate.getFullYear() +"-"+ (calcDate.getMonth() + 1) +"-" + calcDate.getDate();
    }   
    var dt1=new Date(calcDate.replace(/-/g, "/"));
    var dt2=new Date(field.replace(/-/g, "/"));   
    dt2.setHours(0, 0, 0, 0);            
    dt1.setHours(0, 0, 0, 0); 
    if ((new Date(dt1).getTime()) < (new Date(dt2).getTime())) 
    {
         return false;
    }
    else    
    {
        return true;
    } 
    }
    maxDateStaticValidation(field,val) {
        if (field.length === 0)
            return true;
        var mindt=this.formatDate(val);
        if ((new Date(mindt).getTime()) < (new Date(field).getTime())) 
            return false;
        else
            return true;
    };
    minDateStaticValidation(field,val){
        if (field.length === 0)
            return true;
        var mindt=this.formatDate(val);
        if ((new Date(mindt).getTime()) > (new Date(field).getTime())) 
            {return false;}
        else    
            {return true;}   
    }
    handleSafariDatePkrChange(event,field){  
        this.handleChange(event);
        var validators=this.buildValidators(field,"validators");
        for (var i = 0; i < validators.length; i++) {
            var splitIdx = validators[i].indexOf(':');
            if (splitIdx !== -1) {
                var validationName = validators[i].substring(0, splitIdx);
                var validationValue = validators[i].substring(splitIdx + 1);
            }
            if(validationName === 'minDateCustom')
            {
                if(this.minDateCustomValidation(event.target.value,validationValue))
                this.state.errorMsg[event.target.name] = "";                
                else
                {this.state.errorMsg[event.target.name] =(field.minErrMsg)?field.minErrMsg:"Date not accepted"; return;}               
            }
            if(validationName === 'maxDateCustom')
            {               
                if(this.maxDateCustomValidation(event.target.value,validationValue))
                this.state.errorMsg[event.target.name] = "";                
                else
                {this.state.errorMsg[event.target.name] =(field.maxErrMsg)?field.maxErrMsg:"Date not accepted";return;}                
            }
            if(validationName === 'maxDateStatic'){
                if(this.maxDateStaticValidation(event.target.value,validationValue))
                this.state.errorMsg[event.target.name] = "";                
                else
                {this.state.errorMsg[event.target.name] =(field.maxErrMsg)?field.maxErrMsg:"Date not accepted";return;} 
            }
            if(validationName === 'minDateStatic'){
                if(this.minDateStaticValidation(event.target.value,validationValue))
                this.state.errorMsg[event.target.name] = "";                
                else
                {this.state.errorMsg[event.target.name] =(field.minErrMsg)?field.minErrMsg:"Date not accepted";return;} 
            }
           };
    }
   
    computeFieldLogic = () => {
        if(fieldLogicProcess) clearTimeout(fieldLogicProcess);
        fieldLogicProcess = setTimeout(() => {
            try{
                let _tempVar = this.state.dataSet;
                for(let key in this.state.fieldLogic){
                    _tempVar[key] = 0;
                    let _operator = "";
                    for(let i = 0; i < this.state.fieldLogic[key].length; i++){
                        if(this.state.fieldLogic[key][i].isField === true && this.state.fieldLogic[key][i].isValid === true){
                            let _fieldValue = this.state.dataSet[this.state.fieldLogic[key][i].text.split(" ").join("")];
                            if(_fieldValue === ""){
                                _tempVar[key] = "";
                                break;
                            }
                            if(Object.prototype.toString.call(_fieldValue) === "[object String]"){
                                _fieldValue = _fieldValue.split(",").join("");
                                _fieldValue = _fieldValue.split("$").join("");
                                _fieldValue = _fieldValue.split("%").join("");
                            }
                            if(_operator === "") _tempVar[key] = +_fieldValue;
                            else{
                                if(_operator === "+"){
                                    _tempVar[key] = +_tempVar[key] + +_fieldValue;
                                }
                                if(_operator === "-"){
                                    _tempVar[key] = +_tempVar[key] - +_fieldValue;
                                }
                                if(_operator === "/"){
                                    _tempVar[key] = +_tempVar[key] / +_fieldValue;
                                }
                                if(_operator === "*"){
                                    _tempVar[key] = +_tempVar[key] * +_fieldValue;
                                }
                            }
                        }
                        if(this.state.fieldLogic[key][i].isOperator === true){
                            if(this.state.fieldLogic[key][i].text === "(" || this.state.fieldLogic[key][i].text === ")")
                                _operator = "";
                            else _operator = this.state.fieldLogic[key][i].text;
                        }
                        if(this.state.fieldLogic[key][i].isField === false && this.state.fieldLogic[key][i].isOperator === false){
                            let _staticValue = +this.state.fieldLogic[key][i].text
                            if(_operator === "") _tempVar[key] = _staticValue;
                            else{
                                if(_operator === "+"){
                                    _tempVar[key] = +_tempVar[key] + +_staticValue;
                                }
                                if(_operator === "-"){
                                    _tempVar[key] = +_tempVar[key] - +_staticValue;
                                }
                                if(_operator === "/"){
                                    _tempVar[key] = +_tempVar[key] / +_staticValue;
                                }
                                if(_operator === "*"){
                                    _tempVar[key] = +_tempVar[key] * +_staticValue;
                                }
                            }
                        }
                    }
                }
                this.setState({dataSet: _tempVar}, () => this.props.dataSetUpdated);
            }catch(e){
                console.error(e);
            }
        }, 500);
    }
    
    setFieldLogic = (_fields) => {
        let fieldLogic = this.state.fieldLogic;
        for(let i = 0; i < _fields.length; i++){
            for(let j = 0; j < _fields[i].length; j++){
                if(_fields[i][j].fieldLogic !== undefined && _fields[i][j].fieldLogic !== ""){
                    try{
                        this.state.fieldLogic[_fields[i][j].id] = JSON.parse(_fields[i][j].fieldLogic);
                    }catch(e){
                        console.error(e);
                    }
                }
            }
        }
    }
    
    buildConditionalProps = (field, _index) => {
        let conditionalProps = {};
        if (field.dataType === "date") {
          conditionalProps.InputLabelProps = { shrink: true };
        }
        if (field.displayFormat === "phoneNumber") {
          conditionalProps.InputProps={  inputComponent: this.TextMaskCustom(['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]), readOnly: field.readonly };          
        }
        else if (field.displayFormat === "zip") {
          conditionalProps.InputProps={  inputComponent: this.TextMaskCustom([/\d/, /\d/, /\d/, /\d/, /\d/]), readOnly: field.readonly };
        }
        else if (field.displayFormat === "zip4") {
            conditionalProps.InputProps={  inputComponent: this.TextMaskCustom([/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]), readOnly: field.readonly };
          }
        else if (field.displayFormat === "ssn") {
          conditionalProps.InputProps={  inputComponent: this.TextMaskCustom([/\d/, /\d/, /\d/,'-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]), readOnly: field.readonly };
        }
        else if (field.displayFormat === "currency") {
            conditionalProps.InputProps={  inputComponent: this.NumberFormatter_Currency(_index), readOnly: field.readonly };
          }
          else if (field.displayFormat === "percentage") {
            conditionalProps.InputProps={  inputComponent: this.NumberFormatter_Percentage(_index), readOnly: field.readonly };
          }
          else if (field.displayFormat === "percentageWithDec") {
            conditionalProps.InputProps={  inputComponent: this.NumberFormatter_PercentageWithDec(_index), readOnly: field.readonly };
          }
        return conditionalProps;
      }
    checkNegative =(field,fieldval)=>{
      if (field.dataType==="number")
        {               
            if (fieldval<0)
                return "true";                  
            else
                return "false";
        }
      else
        return "false"
    }

      buildValidators = (field,type) => {
        let errorMessages = [];
        let validators = [];
          if (field.isRequired) {
            let errorMessages = [];
            let validators = [];
            validators.push("required");
            errorMessages.push("required");
          }
            if (field.dataType === "string") {
                switch (field.displayFormat) {
                    case "email":
                        validators.push("isEmail");
                        errorMessages.push("Invalid email format")
                        break;
                    case "phoneNumber":
                        validators.push("matchRegexp:^\\([0-9]{3}\\)\\s[0-9]{3}-[0-9]{4}$");
                        errorMessages.push("Invalid phone number")
                        break;
                    case "zip":
                        validators.push("matchRegexp:^[\\d]{5}$");
                        errorMessages.push("Invalid zip code")
                        break;
                    case "zip4":
                        validators.push("matchRegexp:^[\\d]{5}-[\\d]{4}$");
                        errorMessages.push("Invalid zip code")
                        break;
                    case "ssn":
                        validators.push("matchRegexp:^[\\d]{3}-[\\d]{2}-[\\d]{4}$");
                        errorMessages.push("Invalid ssn")
                        break;
                    default : break;
                }
            }
            if (field.minValue) {
                if (field.dataType === "string") {
                    validators.push("minStringLengthCustom:"+field.minValue);
                    errorMessages.push((field.minErrMsg)?field.minErrMsg:"Length is too short");                 
                }
                if (field.dataType === "number") {
                    validators.push("minNumberCustom:"+field.minValue);
                    errorMessages.push((field.minErrMsg)?field.minErrMsg:"Number is too small");
                }
                if (field.dataType === "date" && field.selMinOption === "static") {
                    validators.push("minDateStatic:"+field.minValue);
                    errorMessages.push((field.minErrMsg)?field.minErrMsg:"Date not accepted");
                }
                if (field.dataType === "date" && field.selMinOption === "custom") {
                    validators.push("minDateCustom:"+field.chosenMinDays +"*"+ field.selMinType);
                    errorMessages.push((field.minErrMsg)?field.minErrMsg:"Date not accepted");
                }
            }
            if (field.maxValue) {
                if (field.dataType === "string") {
                    validators.push("maxStringLengthCustom:"+field.maxValue);
                    errorMessages.push((field.maxErrMsg)?field.maxErrMsg:"Length is too long"); 
                }
                if (field.dataType === "number") {
                    validators.push("maxNumberCustom:"+field.maxValue);
                   errorMessages.push((field.maxErrMsg)?field.maxErrMsg:"Number is too large");
                }
                if (field.dataType === "date" && field.selMaxOption === "static") {
                    validators.push("maxDateStatic:"+field.maxValue);
                    errorMessages.push((field.maxErrMsg)?field.maxErrMsg:"Date not accepted");

                }
                if (field.dataType === "date" && field.selMaxOption === "custom") {
                    validators.push("maxDateCustom:"+field.chosenMaxDays +"*"+ field.selMaxType);
                    errorMessages.push((field.maxErrMsg)?field.maxErrMsg:"Date not accepted");

                }
            }
            if (type === "errorMessages") {
                return errorMessages;
            }
            return validators;
      }    
      TextMaskCustom = (mask,index) => {        
        return (props) => {
          let { inputRef, type, onChange,id, ...other } = props;
          if (type === "number")
            type = "text";
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

      NumberFormatter_Currency = (index) => (props) => {
        const { inputRef, type, onChange,id, ...other } = props;
        
        return (
          <NumberFormat
            {...other}
            type="text"
            id={id+"_NumberFormatter"}
            getInputRef={inputRef}
            onBlur={this.handleChange}
            thousandSeparator={true}
            decimalSeparator="."
            decimalScale={2}
            fixedDecimalScale={true}
            prefix="$"
            />
        );
      }

      NumberFormatter_PercentageWithDec = (index) => (props) => {
        const { inputRef, type, onChange,id, ...other } = props;
        
        return (
          <NumberFormat
            {...other}
            type="text"
            id={id+"_NumberFormatter"}
            getInputRef={inputRef}
            onBlur={this.handleChange}
            decimalSeparator="."
            decimalScale={2}
            fixedDecimalScale={true}
            suffix="%"
            />
        );
      }

      NumberFormatter_Percentage = (index) => (props) => {
        const { inputRef, type, onChange,id, ...other } = props;
        
        return (
          <NumberFormat
            {...other}
            type="text"
            id={id+"_NumberFormatter"}
            getInputRef={inputRef}
            onBlur={this.handleChange}
            decimalScale={0}
            fixedDecimalScale={true}
            suffix="%"
            />
        );
      }

      getInputMask = (_obj, mask, maskChar) => {
          return (
              <InputMask style={{marginTop: "5px"}} mask={mask} formatChars={{"9": "[0-9]", "?": "[0-9\.\-]", "#": "[0-9\,\-\.]", "*": "[0-9\.]"}} maskChar={maskChar}
                value={(this.state.dataSet[_obj.id] ? this.state.dataSet[_obj.id] : '')}
                onChange={(event) => {
              if(_obj.displayFormat === "currency" || _obj.displayFormat === "percentage" || _obj.displayFormat === "percentageWithDec"){
                  event.target.value = event.target.value.replace('$ ', '');
                  event.target.value = event.target.value.replace(new RegExp(',', 'g'), '');
                  let _customEvent = {target: {name: event.target.name, value: (event.target.value === "" ? event.target.value : parseFloat(event.target.value))}};
                  if(isNaN(_customEvent.target.value))  _customEvent.target.value = 0;
                  this.handleChange(_customEvent);
              }else{
                  this.handleChange(event);
              }
          }} placeholder={_obj.placeholder} helperText={_obj.hint} label={_obj.title} required={this.getConditionalMandatory(_obj)} readOnly={_obj.readonly} disabled={_obj.readonly}>
                        {(inputProps) => <TextValidator className={this.checkNegative(_obj, this.state.dataSet[_obj.id]) ==="true" ? "negative" : "nonnegative"} label={_obj.title} name={_obj.id} {...inputProps} required={this.getConditionalMandatory(_obj)} readOnly={_obj.readonly} disabled={_obj.readonly} type="tel" disableunderline="true" validators={this.buildValidators(_obj,"validators")} errorMessages={this.buildValidators(_obj,"errorMessages")} fullWidth/>}
                      </InputMask>
          )
      }

      userDeletedJustTheDecimalPoint = (newState, oldState) => {
        if (oldState.value !== null && newState.value !== null && oldState.value.includes(".") && !newState.value.includes(".")) {
            // Old text had a decimal and new doesn't. Was the decimal the only thing removed? If so, return true.
            var oldSplit = oldState.value.split(".");
            if (oldSplit.length >= 2 && newState.value == "" + oldSplit[0] + oldSplit[1]) {
                return true;
            }
        };
        return false;
      }

      shouldCheckForCommaChanges = (newState, oldState) => {
        return (newState.value !== null && newState.value !== "" && oldState.value !== null && oldState.value !== newState.Value);
      }

      getCommaDifference = (newState, oldState) => {
        if (newState.value === null || oldState.value === null) {
            return 0;
        }

        var oldCommaCount = this.commaCount(oldState.value);
        var newCommaCount = this.commaCount(newState.value);
        return newCommaCount - oldCommaCount;
      }

      commaCount = (numberString) => {
        return (numberString.match(/,/g) || []).length;
      }

      debugMessage = (enabled, message) => {
        if (enabled) {
            console.log(message);
        }
      }

      getCurrencyMask = (_obj, mask, maskChar) => {
        return (
            <InputMask mask={mask} style={{marginTop: "5px"}} formatChars={{"9": "[0-9]", "?": "[0-9\.\-]", "#": "[0-9\,\-\.]", "*": "[0-9\.]"}} maskChar={maskChar}
              value={Formatter.currency(this.state.dataSet[_obj.id])}

              beforeMaskedValueChange = {(newState, oldState, userInput) => {
                var { value } = newState;
                var selection = newState.selection;

                // This event fires a LOT, so check to make sure it is firing for
                // an instance we want to do something with.

                if (this.userDeletedJustTheDecimalPoint(newState, oldState)) {
                    var enableDDLogging = true;
                    this.debugMessage(enableDDLogging, "BEGIN Decimal Deleted Logging");
                    this.debugMessage(enableDDLogging, "Before - Old value: " + oldState.value);
                    this.debugMessage(enableDDLogging, "Before - New value: " + newState.value);
                    
                    // Put the decimal back
                    value = oldState.value;

                    this.debugMessage(enableDDLogging, "After  - New value: " + value);
                    this.debugMessage(enableDDLogging, "END DecimalDeletedLogging");
                }

                if (this.shouldCheckForCommaChanges(newState, oldState))
                {
                    var enableCCLogging = true;
                    var commaDifference = this.getCommaDifference(newState, oldState);

                    if (commaDifference !== 0) {
                        this.debugMessage(enableCCLogging, "BEGIN Comma-Clean-Up Logging");
                        
                        if (commaDifference > 0) {
                            this.debugMessage(enableCCLogging, "Comma was added");
                            var cursorPosition = selection.start + 1;
                            selection = { start: cursorPosition, end: cursorPosition };
                        }

                        if (commaDifference < 0) {
                            this.debugMessage(enableCCLogging, "Comma was deleted");
                            var cursorPosition = selection.start - 1;
                            selection = { start: cursorPosition, end: cursorPosition };
                        }

                        this.debugMessage(enableCCLogging, "Old value: " + oldState.value);
                        if (oldState.selection !== null)
                        {
                            this.debugMessage(enableCCLogging, "Old selection: " + oldState.selection.start);
                        }
                        this.debugMessage(enableCCLogging, "New value: " + newState.value);
                        if (newState.selection !== null)
                        {
                            this.debugMessage(enableCCLogging, "New selection: " + newState.selection.start);
                        }
                        this.debugMessage(enableCCLogging, "User input: " + userInput);
                        this.debugMessage(enableCCLogging, "Cursor position: " + cursorPosition);
                        this.debugMessage(enableCCLogging, "END Comma-Clean-Up Logging");
                    }
                }
             
                return {
                  value,
                  selection
                };
              }}

              onChange={(event) => {
            if(_obj.displayFormat === "currency" || _obj.displayFormat === "percentage" || _obj.displayFormat === "percentageWithDec"){
                event.target.value = event.target.value.replace('$ ', '');
                event.target.value = event.target.value.replace(new RegExp(',', 'g'), '');
                let _customEvent = {target: {name: event.target.name, value: (event.target.value === "" ? event.target.value : parseFloat(event.target.value))}};
                if(isNaN(_customEvent.target.value))  _customEvent.target.value = 0;
                this.handleChange(_customEvent);
            }else{
                this.handleChange(event);
            }
        }} placeholder={_obj.placeholder} helperText={_obj.hint} label={_obj.title} required={this.getConditionalMandatory(_obj)} readOnly={_obj.readonly} disabled={_obj.readonly}>
                      {(inputProps) => <TextValidator className={this.checkNegative(_obj, this.state.dataSet[_obj.id]) ==="true" ? "negative" : "nonnegative"} label={_obj.title} name={_obj.id} {...inputProps} required={this.getConditionalMandatory(_obj)} readOnly={_obj.readonly} disabled={_obj.readonly} type="tel" disableunderline="true" validators={this.buildValidators(_obj,"validators")} errorMessages={this.buildValidators(_obj,"errorMessages")} fullWidth/>}
                    </InputMask>
        )
    }

      getPerMask = (_obj, mask, maskChar) => {
          return (
              <InputMask mask={mask} formatChars={{"9": "[0-9]", "?": "[0-9\.\-]", "*": "[0-9\-]"}} maskChar={maskChar} value={this.state.dataSet[_obj.id]} onChange={(event) => {
              if(_obj.displayFormat === "currency" || _obj.displayFormat === "percentage" || _obj.displayFormat === "percentageWithDec"){
                  event.target.value = event.target.value.replace('$ ', '');
                  let _customEvent = {target: {name: event.target.name, value: (event.target.value === "" ? event.target.value : parseFloat(event.target.value))}};
                  console.log(_customEvent.target.value);
                  this.handleChange(_customEvent);
              }else{
                  this.handleChange(event);
              }
          }} placeholder={_obj.placeholder} helperText={_obj.hint} label={_obj.title} required={this.getConditionalMandatory(_obj)} readOnly={_obj.readonly} disabled={_obj.readonly}>
                        {(inputProps) => <span className="percentageField"><TextValidator className={this.checkNegative(_obj, this.state.dataSet[_obj.id]) ==="true" ? "negative" : "nonnegative"} name={_obj.id} {...inputProps} required={this.getConditionalMandatory(_obj)} readOnly={_obj.readonly} disabled={_obj.readonly} type="tel" disableunderline="true" validators={this.buildValidators(_obj,"validators")} errorMessages={this.buildValidators(_obj,"errorMessages")} fullWidth/><span className="symbal">%</span></span>}
                      </InputMask>
          )
      }
      
      
    getInputBox(_obj, _index){
        if(_obj.dataType === "date") {
         if(window.safari !== undefined){
                if(window.navigator.userAgent.indexOf("Macintosh") !== -2) return this.getSafariDateField(_obj, _index);
          }           
        }
        
        const conditionalProps = this.buildConditionalProps(_obj, _index);
        return (
            
            <FormControl fullWidth  key={_obj.id} className="formItem">
                
                {
                   (_obj.displayFormat !== "phoneNumber" && _obj.displayFormat !== "zip" && _obj.displayFormat !== "zip4" && _obj.displayFormat !== "ssn" &&  _obj.displayFormat !== "currency" &&  _obj.displayFormat !== "percentage" &&  _obj.displayFormat !== "percentageWithDec") && <TextValidator className={this.checkNegative(_obj, this.state.dataSet[_obj.id]) ==="true" ? "negative" : "nonnegative"} type={_obj.dataType} placeholder={_obj.placeholder} helperText={_obj.hint} id={_obj.id}  label={_obj.title} name={_obj.id} value={this.state.dataSet[_obj.id]} required={this.getConditionalMandatory(_obj)}  readOnly={_obj.readonly} disabled={_obj.readonly} onChange={(event) => {
                        if(_obj.dataType === 'number'){
                            let _customEvent = {target: {name: event.target.name, value: (event.target.value === "" ? event.target.value : parseFloat(event.target.value))}}
                            this.handleChange(_customEvent);
                        }else{
                            this.handleChange(event)
                        }
                        
                    }} margin="dense" fullWidth  {...conditionalProps} validators={this.buildValidators(_obj,"validators")} errorMessages={this.buildValidators(_obj,"errorMessages")} />
                }
        
                {
                    _obj.displayFormat === "phoneNumber" && this.getInputMask(_obj, "(999) 999-9999", "_")
                }
        
                {
                    _obj.displayFormat === "zip" && this.getInputMask(_obj, "99999", "_")
                }
        
                {
                    _obj.displayFormat === "zip4" && this.getInputMask(_obj, "99999-9999", "_")
                }
        
                {
                    _obj.displayFormat === "ssn" && this.getInputMask(_obj, "999-99-9999", "_")
                }
        
                {
                    _obj.displayFormat === "currency" && this.getCurrencyMask(_obj, "$ ######################", null)
                }
                {
                    _obj.displayFormat === "percentage" && this.getPerMask(_obj, "**********", null)
                }
                {
                    _obj.displayFormat === "percentageWithDec" && this.getPerMask(_obj, "???????????????", null)
                }

            </FormControl>
        )
    }
    
    getDropdown(_obj, _index){
        return (
            <FormControl style={{marginTop: "5px"}} fullWidth key={_obj.id} className="formItem">
                <InputLabel shrink htmlFor={_obj.id}>{_obj.title + (this.getConditionalMandatory(_obj) === true ? ' *' : '')}</InputLabel>

                <NativeSelect className="alignLeft" placeholder={_obj.placeholder}  value={this.state.dataSet[_obj.id]} tabIndex={_index} id={_obj.id} name={_obj.id} required={this.getConditionalMandatory(_obj)} readOnly={_obj.readonly} fullWidth onChange={this.handleChange} >

                    {
                        _obj.placeholder !== "" && 
                        <option value="" disabled>
                          {_obj.placeholder}
                        </option>
                    }
                    {
                        _obj.placeholder === "" && 
                        <option value="" disabled>
                        </option>
                    }
                    {
                        _obj.choices.map( (_choice) => {
                            return <option key={_choice.Value} value={_choice.Value}>{_choice.Description}</option>
                        })
                    }
                </NativeSelect>
                {
                    _obj.hint !== "" && <FormHelperText>{_obj.hint}</FormHelperText>
                }
                
            </FormControl>
        )
    }

    getBooleanDropdown(_obj, _index){
        return (
            <FormControl fullWidth key={_obj.id} className="formItem">
                <InputLabel shrink htmlFor={_obj.id}>{_obj.title + (this.getConditionalMandatory(_obj) === true ? ' *' : '')}</InputLabel>

                <NativeSelect value={this.state.dataSet[_obj.id]} placeholder={_obj.placeholder} tabIndex={_index} id={_obj.id} name={_obj.id} required={this.getConditionalMandatory(_obj)} readOnly={_obj.readonly} fullWidth onChange={this.handleChange} >

                    {
                        _obj.placeholder !== "" && 
                        <option value="" disabled>
                          {_obj.placeholder}
                        </option>
                    }
                    {
                        _obj.placeholder === "" && 
                        <option value="" disabled>
                        </option>
                    }
                    <option key="Yes" value="true">Yes</option>
                    <option key="No" value="false">No</option>
                </NativeSelect>
                {
                    _obj.hint !== "" && <FormHelperText>{_obj.hint}</FormHelperText>
                }
            </FormControl>
        )
    }

    getSafariDateField(_obj, _index) {
        return (
            <FormControl fullWidth  key={_obj.id} className="formItem-safari">
                <label name={_obj.id} style={this.props.dobSafariIssueFixARP62964 && this.state.errorMsg[_obj.id] !== undefined && this.state.errorMsg[_obj.id] !== "" ?
                    {color:"#f44336",fontSize:"0.8rem",textAlign:"left"}
                    :{color:"rgba(0, 0, 0, 0.54)",fontSize:"0.8rem",textAlign:"left"}}>{_obj.id}
                {
                    this.getConditionalMandatory(_obj) && <span>*</span>
                }
                </label>                    
                <input type="date" onKeyDown={(e) => e.preventDefault()} id={_obj.id} placeholder={_obj.placeholder ? _obj.placeholder : "mm/dd/yyyy"} helpertext={ _obj.hint } label={_obj.title} name={_obj.id} value={this.state.dataSet[_obj.id]} required={this.getConditionalMandatory(_obj)} readOnly={_obj.readonly} 
               onChange={(event) => {this.props.dobSafariIssueFixARP62964? this.handleSafariDatePkrChange(event,_obj) : this.handleChange(event)}}
                margin="dense" fullWidth date-format="mm/dd/yyyy" style={{border: "none", padding: "6px 0 7px", marginTop: "5px", borderBottom: "1px solid rgba(0, 0, 0, 0.42)", fontSize: "1rem"}}/>
                    {
                        _obj.hint !== "" && <FormHelperText>{_obj.hint}</FormHelperText>
                    }
                <label name={_obj.id}  style={{color:"#f44336",fontSize:"0.8rem",textAlign:"left"}}>{this.props.dobSafariIssueFixARP62964? this.state.errorMsg[_obj.id] : ""}
                </label>                
            </FormControl>
        )
    }




    getDateField(_obj, _index) {
        return (
            <FormControl fullWidth  key={_obj.id} className="formItem">
            <label name={_obj.id}  style={{color:"rgba(0, 0, 0, 0.54)",fontSize:"0.8rem",textAlign:"left"}}>{_obj.id}
                {
                    this.getConditionalMandatory(_obj) && <span>*</span>
                }
                </label>
                <input type="date" id={_obj.id} placeholder={_obj.placeholder ? _obj.placeholder : "mm/dd/yyyy"} helperText={ _obj.hint } label={_obj.title} name={_obj.id} value={this.state.dataSet[_obj.id]} required={this.getConditionalMandatory(_obj)} readOnly={_obj.readonly} onChange={this.handleChange} margin="dense" validators={this.buildValidators(_obj,"validators")} errorMessages={this.buildValidators(_obj,"errorMessages")} fullWidth date-format="mm/dd/yyyy" style={{border: "none", padding: "6px 0 7px", marginTop: "15px", borderBottom: "1px solid rgba(0, 0, 0, 0.42)", fontSize: "1rem"}}/>   
                    {
                        _obj.hint !== "" && <FormHelperText>{_obj.hint}</FormHelperText>
                    }
            </FormControl>
        )
    }
    
    getTextArea = (_obj) =>{
        try{
            return ReactHtmlParser( draftToHtml(JSON.parse(_obj.text)) );
        }catch(e){
            console.warn('error:::', e);
            return "";
        }
    }
    getHTMLArea = (_obj) =>{
        try{
            return ReactHtmlParser( _obj.text );
        }catch(e){
            console.warn('error:::', e);
            return "";
        }
    }
    
    handleCheckboxchanged = (event) => {
        let tempVar = this.state.dataSet;
        tempVar[event.target.name] = event.target.checked;
        this.setState({dataSet: tempVar}, () => {
            this.props.dataSetUpdated();
        });
    }
    handleRadioBtnchanged = (event) => {
        let tempVar = this.state.dataSet;
        tempVar[event.target.name] = event.target.value;
        this.setState({dataSet: tempVar,listBoxValid:false}, () => {
            this.forceUpdate();
            this.props.dataSetUpdated();
        } );
        
    }
    UpdateApps(startoverflag){
        let updatedData={};
        updatedData=this.state.dataSet;
        dataShare.updateApplicationData(updatedData,this.state.appsId,startoverflag, (error, response) => {
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
                if (startoverflag==="startover")
                {
                    this.setState({dataSet: response.data.data});
                }
                else if (startoverflag==="continue")
                {
                   this.setState({dataSet: response.data.data});
                }
                else
                {}            
            }   
           
        } )

    }
    showUserLogIn(e,_flag){
       console.log("login button clicked");
        if(!this.state.appsId)
             this.setState({showLogInModal:true,userMode:_flag});
        else
           {  this.setState({showLogInModal:false,userMode:_flag});
              this.UpdateApps("update");
              this.props.showNotification('success', 'Information Saved Successfully.');
              
            }
    }

    versionMismatchHandler(userInput,_borrowerdata) {
       

        if (userInput === "continue") {
            this.setState({ loginMode: true,valuechangd:true });
            this.setNewDataSetVal(this.state.oldVersionData);
            this.state.dataSet=this.state.oldVersionData.siteInfo.site.data;
            this.state.appsId=this.state.oldVersionData.appsId;
            this.UpdateApps("continue");
            this.props.goToStep(0);
          //  this.UpdateApps();
            this.setState({ showLogInModal: false, versionMisMatch: false });
        }
        else
        {   
            this.state.appsId=this.state.oldVersionData.appsId;
            this.UpdateApps("startover");
            this.setState({showLogInModal:false,versionMisMatch:false});
        }
       
       
    }

    saveApplication(_dataToSave)
    {
       
        if (this.state.userMode === "newuser")
        {  
            dataShare.saveApplication(_dataToSave,(error, response) => {
                if(error){
                    this.props.showNotification('error', 'Internal server error while fetching information, please try after sometime.');
                    
                    return;
                }
                else
                {
                    if(!this.state.versionMisMatch && this.state.showSaveMsg)
                        this.props.showNotification('success', 'Information Saved Successfully.');
                }
                this.setState({ showLogInModal: false, appsId: response.data, versionMisMatch: false });

                if (this.state.forceSubmitApp === true) {
                    this.setState({ forceSubmitApp: false });
                    this.props.nextStep(this.state.dataSet, response.data);
                }
            } );
        }
        else
        {
            dataShare.getBorrowerAppData(_dataToSave, (error, response) => {
                if (error)
                {
                    if (error.response && error.response.status === 403) 
                        this.props.showNotification('error', error.response.data);
                    else this.props.showNotification('error', 'Internal server error while fetching information, please try after sometime.');
                    return;
                }
                else
                {
                    if (response.message === 'Version mismatch') {
                        this.props.showNotification('error', 'Version mismatch');
                        this.setState({ showLogInModal: true, versionMisMatch: true, oldVersionData: response.existingdata });
                    }
                    else {

                        this.setState({ loginMode: true, showLogInModal: false });
                        this.setNewDataSetVal(response.existingdata);
                        this.props.goToStep(0);
                    }
                   
                }
                
                 } );

        }}

    setNewDataSetVal = (_newdata) => {
        let tmp={};      
        tmp =_newdata.siteInfo.site.data;  
        this.setState({dataSet:tmp,appsId:_newdata.appsId});
    }
    
    getListBox = (_obj, index) => {
        const highlighCSS = {backgroundColor: this.props.settings.defaultPrimary};
        if(Object.prototype.toString.call(_obj.choices) !== "[object Array]") _obj.choices = [];
        return (
            <FormControl fullWidth key={_obj.id} className="radioBtnCnt">
            <div key={_obj.id} id={_obj.id} className="radioBtnCnt">
            <span className="radioBtnTitle">{_obj.isRequired ? _obj.title+" *" : _obj.title}</span>   
                { 
                    _obj.isRequired && this.state.listBoxValid &&
                    <span className="errorMessage">  Please select an item from list</span>
                }  
                <RadioGroup
                    name={_obj.id}
                    value={this.state.dataSet[_obj.id]}
                    className="RadioGroupCnt"
                    onChange={this.handleRadioBtnchanged}
                    required={this.getConditionalMandatory(_obj)}
                  >
                {
                    _obj.choices.map( (data, index) =>{
                        return <FormControlLabel className={this.state.dataSet[_obj.id] === data.Value ? "radioBtnLabel checked" : "radioBtnLabel"} key={index} value={data.Value} control={<Radio />} label={data.Description} style={this.state.dataSet[_obj.id] === data.Value ? highlighCSS : {}} />
                    } )
                }
                </RadioGroup>
            </div>
            </FormControl>
        );
    }

     getOffset = ( el ) => {
        var _x = 0;
        var _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top: _y, left: _x };
    }
     
    validateSubmit(e){
        setTimeout(() => {
            try{
                window.scrollTo(this.getOffset(document.activeElement).left, this.getOffset(document.activeElement).top - 100);
            }catch(e){
                console.log(e);
            }
        }, 500);
        let listArr = [];
        this.props.fieldData.fields.forEach(arrObj => {
            if(arrObj.filter(x=>x.inputType === "Listbox" && x.isRequired === true).length > 0){
                 listArr.push(arrObj.find(x=>x.inputType === "Listbox" && x.isRequired === true).id);
            }
        });
        listArr.forEach(item => {
            var mandatoryFieldBugARP65007 = this.props.mandatoryFieldBugARP65007 ? (document.getElementById(item))!=null : true;
            if(this.state.dataSet[item]  === "" && mandatoryFieldBugARP65007)
             { 
                 this.setState({listBoxValid:true});
                  e.preventDefault();
             }
             else
             {this.setState({listBoxValid:false});}
        });
       if(this.props.dobSafariIssueFixARP62964 && window.safari !== undefined && window.navigator.userAgent.indexOf("Macintosh") !== -2){
            let listDateArr = [];
            this.props.fieldData.fields.forEach(arrObj => {
                if(arrObj.filter(x=>x.dataType === "date").length > 0){
                    listDateArr.push(arrObj.find(x=>x.dataType === "date").id);}
            });
            listDateArr.forEach(item=> {
                console.log(this.state.errorMsg[item]);
                if(this.state.errorMsg !== undefined && this.state.errorMsg !== "" && this.state.errorMsg[item] !== undefined && this.state.errorMsg[item] !==""){
                    e.preventDefault();}
            });
       }
        
    }

    
    getInnerContainer = (_obj, index) => {
        if(this.getConditionalDisplay(_obj) === false ) {
          if(!(_obj.inputType === "HTML Area" || _obj.inputType === "HTML Area"))
          {  
                this.state.dataSet[_obj.id]='';
          }
            return "";
        }
        if(_obj.inputType === "Text Input" && _obj.dataType === "boolean") return this.getBooleanDropdown(_obj, index)
        else if(_obj.inputType === "Text Input") return this.getInputBox(_obj, index)
        else if(_obj.inputType === "Dropdown") return this.getDropdown(_obj, index)
        else if(_obj.inputType === "date") return this.getDateField(_obj, index)
        else if(_obj.inputType === "Text Area"){
            return <div key={_obj.id} className={_obj.isScrollable === true ? "textAreaCnt" : "textAreaCntNoScroll"} >{this.getTextArea(_obj)}</div>
        }else if(_obj.inputType === "HTML Area"){
            return <div key={_obj.id} className={_obj.isScrollable === true ? "textAreaCnt" : "textAreaCntNoScroll"} >{this.getHTMLArea(_obj)}</div>
        } 
        else if(_obj.inputType === "Image"){
            return <div key={_obj.id} className="imageCnt"><img src={_obj.imgSelected} alt={_obj.id} /></div>
        }
        else if(_obj.inputType === "Checkbox"){
            return <div key={_obj.id} className="checkboxCnt"><FormControlLabel control={<Checkbox name={_obj.id} checked={typeof this.state.dataSet[_obj.id] !== "boolean" ? false :  this.state.dataSet[_obj.id]} onChange={this.handleCheckboxchanged} required={this.getConditionalMandatory(_obj)} title={_obj.title} color="primary" /> } label={_obj.title} /></div>
        } 
        else if(_obj.inputType === "Listbox"){
            return this.getListBox(_obj, index)
        } 
        else return ''
    }
    
    getConditionalMandatory = (_obj) => {
        
        return RuleHelper.getConditionalMandatory(_obj, this.state.dataSet);

    }
    
    getConditionalDisplay = (_obj) => {
        
        return RuleHelper.getConditionalDisplay(_obj, this.state.dataSet);
    
    }
    handleArrowRef = (node) => {
        this.setState({
          arrowRef: node,
        });
    };

    formErrorHandler = (error) => {
        console.log(error);
    }
    render(){
        {this.setFieldLogic(this.props.fieldData.fields)}
        return (
            <Paper elevation={4} className="formContainer-parent">
                <UserLogInModal oldVersionData={this.state.oldVersionData} saveApplication={this.saveApplication} versionMismatchHandler={this.versionMismatchHandler} setNewDataSetVal={this.setNewDataSetVal} userMode={this.state.userMode} versionMisMatch={this.state.versionMisMatch} showLogInModal={this.state.showLogInModal} closeLogInModal={() => this.setState({ forceSubmitApp: false, showLogInModal: false })} showNotification={this.props.showNotification} dataSet={this.state.dataSet} pageID={this.props.pageID} appsId={this.state.appsId} showSaveMsg={this.state.showSaveMsg} forceSubmitApp={this.state.forceSubmitApp} />
                {
                    !(this.props.createNewApp) &&
                    <div className="CancelEditDiv"> <Button className="CancelEdit" variant="contained" color="primary" onClick={() => this.props.cancelEdit(this.props.selectedPage,this.props.pageID,this.props.Appresult,this.props.AppData)}>Cancel Edit</Button></div>                     
                    }  
                <div className="formTitle">
                    { this.props.fieldData.stepTitle &&                
                        <Typography variant="headline" component="h3" >
                            {this.props.fieldData.stepTitle ? this.props.fieldData.stepTitle : ''}
                        </Typography> 
                    }
                    {this.props.fieldData.stepSubTitle && 
                        <p className="textDescription">{this.props.fieldData.stepSubTitle ? this.props.fieldData.stepSubTitle : ''}
                        </p>
                    }     
                     
                </div>     

                <div className="formContainer">
                    <ValidatorForm ref="form" id="ValidatorFormElement" autoComplete="off" instantValidate={true} onSubmit={this.formSubmitHandler} onError={this.formErrorHandler}>
                        {
                            this.props.fieldData.fields.length === 0 && 
                            <div className="emptyStep">Empty Step</div>
                        }
                        {
                            this.props.fieldData.fields.length !== 0 &&  (this.props.settings.createLogin||this.props.settings.editApplication) && !this.state.appsId &&
                                <Tooltip
                                title={
                                    <React.Fragment>
                                    Retrieve existing application
                                    <span ref={this.handleArrowRef} />
                                    </React.Fragment>
                                }
                                > 
                                
                                <Button className="fixedTopLoginBtn"  color="primary" onClick={(e)=>this.showUserLogIn(e,"existinguser")} > 
                                    <img src={require('../../../assets/icon/icon-userOutline.png')} alt="username" width="20" height="20"  />
                                </Button> 
                                </Tooltip>
                        
                        }
                        <Grid container spacing={0}>
                        {
                            this.props.fieldData.fields.map((_data, index) => {
                                return _data.map( (_obj, _colIndex) => {
                                    return (
                                        <Grid item xs={12} sm={_obj.fieldWidth === 1 ? 12 : (_obj.fieldWidth === 2 ? 6 : 4)} key={_colIndex} className="columns">
                                            {
                                                this.getInnerContainer(_obj, index)
                                            }
                                        </Grid>
                                    )
                                    
                                })
                            })
                        }
                        </Grid>                       
                        
                        {                           
                            this.props.currentStep <= this.props.totalSteps &&                             
                            <div className="saveBtnContainer specificBtnContainer">                           
                                    <Button variant="contained" color="primary" className="saveBtn_form" type="submit" onClick={(e)=>this.validateSubmit(e)}> {this.props.currentStep === this.props.totalSteps ? 'Submit' : 'Continue'} </Button>
                        
                                </div>

                        }
                        {
                            this.props.settings.createLogin &&
                                <div className="saveLoginBtnContainer">
                                        <Button variant="contained" className="saveBtn_form"  color="primary" onClick={(e)=>this.showUserLogIn(e,"newuser")}> Save </Button> 
                                    </div> 
                        }
                    </ValidatorForm>
                </div>
                
            </Paper>
        );
    }
}

export default compose(withWidth())(FormContainerComponent);