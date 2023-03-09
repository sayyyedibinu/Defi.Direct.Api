import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import /*Draft, */{ /*rawToDraft, draftToRaw, */draftToHtml } from 'react-wysiwyg-typescript';
import ReactHtmlParser from 'react-html-parser';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
/*import Slider from '@material-ui/lab/Slider';*/

import dataShare from "../../../admin/components/Common/dataShare";
import ApplicationError from '../ApplicationErrorComponent/ApplicationErrorComponent';
import ModalLoaderComponent from '../ModalLoaderComponent/ModalLoaderComponent';
import RuleHelper from '../Common/RuleHelper';
import Formatter from '../Common/formatter';
import CustomSlider from "../Common/CustomSlider/CustomSlider";
import config from  "../../resources/config.json";
import '../PersonalLoan-Component/FormContainer-Component/FormContainerComponent.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';

class DecisionComponent extends React.Component{
    constructor(props){
        super(props); 
        let _appData = this.props.AppData;
        if (!this.props.AppData) {
            _appData = this.props.location.state.AppData;
        }   
        this.state = { Results : {}, decisionPageDataSet: {} ,showApplicationMessage: false,openModal:false,chkboxVal:true};
        if (this.props.location.state.Results)
            this.state.Results = this.props.location.state.Results;
        if (_appData) {
            let _themePatter = {
                primary: {main: (_appData.site.settings.defaultPrimary ? _appData.site.settings.defaultPrimary : "#7068e2")},
                secondary: {main: (_appData.site.settings.defaultSecondary ? _appData.site.settings.defaultSecondary : "#7068e2")}
            }
            this.state.AppData = _appData;
            this.state.decisionPageFieldData = { fields: _appData.site.decisionPageFieldData };
            this.state.chkboxVal=true;
            this.state.theme = createMuiTheme({palette: _themePatter})
        }
        if (this.props.location.state.siteId) {
            this.state.siteId = this.props.location.state.siteId;
        }
        else {
            this.state.siteId = _appData.siteId;
        }
        if (this.props.location.state.AppData && this.state.AppData)
            this.state.AppData.site = this.props.location.state.AppData;
        this.redirectToHome = this.redirectToHome.bind(this);
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
                /*if(settings)*/
                return RuleHelper.getConditionalDecisionDisplay(_tempVar, {Results: this.state.Results}) ;
                }
        else{

                if(!this.props.location.state.AppData) return false;
                if(Object.prototype.toString.call(this.props.location.state.AppData.site) === "[object object]")
                {
                
                if(Object.prototype.toString.call(this.props.location.state.AppData.site.settings.decisionPageDisplayLogic) === "[object Undefined]") return false;
                if(this.props.location.state.AppData.site.settings.decisionPageDisplayLogic === "null") return false;
                
                let _tempVar = {};
                _tempVar.displayLogic = true;
                _tempVar.displayLogicRule = this.props.location.state.AppData.site.settings.decisionPageDisplayLogic;
                _tempVar.displayLogicRuleDesc = this.props.location.state.AppData.site.settings.decisionPageDisplayLogicDesc;
                /*if(settings)*/
                return RuleHelper.getConditionalDecisionDisplay(_tempVar, {Results: this.state.Results}) ;
                }
                else{
                    if(Object.prototype.toString.call(this.props.location.state.AppData.settings.decisionPageDisplayLogic) === "[object Undefined]") return false;
                    if(this.props.location.state.AppData.settings.decisionPageDisplayLogic === "null") return false;
                    let _tempVar = {};
                    _tempVar.displayLogic = true;
                    _tempVar.displayLogicRule = this.props.location.state.AppData.settings.decisionPageDisplayLogic;
                    _tempVar.displayLogicRuleDesc = this.props.location.state.AppData.settings.decisionPageDisplayLogicDesc;
                    return RuleHelper.getConditionalDecisionDisplay(_tempVar, {Results: this.state.Results}) ;
                }

        }
        /*return this.state.Decision;*/
    }

    getEditButton(){
        if(Object.prototype.toString.call(this.props.location.state) === '[object Undefined]')
        {
        
                if(!this.props.AppData) return false;
                if (!this.props.location.state.AppData) return false;
                if (this.props.location.state.AppData.site.settings.editApplication === false) return false;
                if(Object.prototype.toString.call(this.props.AppData.settings.editButtonDisplayLogic) === "[object Undefined]") return false;
                if(this.props.AppData.settings.editButtonDisplayLogic === "null") 
                {
                   if (this.props.AppData.settings.editButtonDisplayLogic) return true;
                }
               
                let _tempVar = {};
                _tempVar.displayLogic = true;
                _tempVar.displayLogicRule = this.props.AppData.settings.editButtonDisplayLogic;
                _tempVar.displayLogicRuleDesc = this.props.AppData.settings.editButtonDisplayLogicDesc;                
                return RuleHelper.getConditionalDecisionDisplay(_tempVar, {Results: this.state.Results}) ;
                }
        else{

            if(!this.state.AppData.site.settings) return false;
            let _base = this.state.AppData.site.settings;
            if (_base.editApplication === false) return false;
            if(Object.prototype.toString.call(_base.editButtonDisplayLogic) === "[object Undefined]") return false;
            //if(this.props.location.state.AppData.settings.editButtonDisplayLogic === "null") return false;

            if(_base.editButtonDisplayLogic === "null") 
             {
                if (_base.editApplication) return true;
             }
            let _tempVar = {};
            _tempVar.displayLogic = true;
            _tempVar.displayLogicRule = _base.editButtonDisplayLogic;
            _tempVar.displayLogicRuleDesc = _base.editButtonDisplayLogicDesc;
            /*if(settings)*/
            return RuleHelper.getConditionalDecisionDisplay(_tempVar, {Results: this.state.Results}) ;

        }
        
    }
    componentDidMount = () => {
       
        //this.getOutputFields();

    }
    componentWillUnmount = () => {
        this.isCancelled = true;
    }
    redirectToHome(){
        this.props.history.push('/');
    }
      getSliderField=(objfield)=>
    {
        let sliderResult= JSON.parse(objfield);
        const fields = sliderResult.xpath.split('/');
        /*console.log(sliderResult);
        console.log(sliderResult.xpath);*/
        let field = {};
        for (let j = 0; j < fields.length; j++) {
            if (fields[j] !== "" && fields[j] !== "Results") {
                try {
                    field = fields[j];
                    return field;
                }
                catch (error) { 
                    field = null;
                }
            }
        }
    }
    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    getOutputFields = () => {
        dataShare.getFieldList(false, (error, res) => {
            if (error) {
                console.log(error);
                return;
            }
            var arrOptions = [];
            res.forEach(element => {
                if (element.options.readonly)
                    arrOptions.push({ value: element, label: element.options.id });
            });
            !this.isCancelled && this.setState({ setOutputFields: arrOptions });
        })
    }
    insertOutputFields = (text, decisionFields, results) => {
        if (typeof (decisionFields)==='undefined') return;
        try {
            text = JSON.parse(text);
            decisionFields = JSON.parse(decisionFields);
        } catch(error) {}
        let html = draftToHtml(text);
        //console.log(html);
        //if (!outputFields) {
        //    return {};
        //}
        if ( decisionFields === "[]" ) return;
        if (!results) {
            return {};
        }
        for (let i = 0; i < decisionFields.length; i++) {
         
            const fields = decisionFields[i].xpath.split('/');
            let field = results;
            
            for (let j = 0; j < fields.length; j++) {
                if (fields[j] !== "" && fields[j] !== "Results") {
                    try {
                        let _formatedValueAdded = false;
                        if(decisionFields[i].displayFormat === 'currency'){
                            _formatedValueAdded = true;
                            field = '$ '+Formatter.currency(field[fields[j]])
                        }
                        if(decisionFields[i].displayFormat === 'phoneNumber'){
                            _formatedValueAdded = true;
                            field = Formatter.phoneNumber(field[fields[j]])
                        }
                        if(decisionFields[i].displayFormat === 'percentage' || decisionFields[i].displayFormat === 'percentageWithDec'){
                            _formatedValueAdded = true;
                            field = field[fields[j]] + '%';
                        }
                        if(_formatedValueAdded === false) field = field[fields[j]];
                    }
                    catch (error) { 
                        field = null;
                    }
                }
            }
            if (field) {
                html = html.replace(new RegExp("{{" + decisionFields[i].label + "}}","g"), field);
            }
        }
        return html
    }
    getTextArea = (_obj) =>{
        try{
            /*console.log(_obj);*/
            let htmlText = this.insertOutputFields(_obj.decisionText, _obj.decisionTextFields, this.state.Results);
           
            return ReactHtmlParser( htmlText );
        }catch(e){
            console.error('error:::', e);
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
    handleSliderChange = (value, index) => {

        let tempVar = this.state.decisionPageFieldData;
        tempVar.fields[index].currentValue = value;
        this.setState({ decisionPageFieldData: tempVar });
    };
    handleCheckboxchanged= (event,index) => {

        let tempVar = this.state.decisionPageFieldData;
        tempVar.fields[index].currentValue = event.target.checked;
        this.setState({ decisionPageFieldData: tempVar });
    };

    getTableData = (_curObj, _fieldID) => {
        /*console.log(_curObj, _fieldID, this.state.Results[_fieldID]);*/
        if(Object.prototype.toString.call(this.state.Results[_fieldID]) === "[object Object]" || Object.prototype.toString.call(this.state.Results[_fieldID]) === "[object Array]") return JSON.stringify(this.state.Results[_fieldID]);
        else this.state.Results[_fieldID];
    }
    
    getFormatedValue_table = (_curObj, _fieldID, _value) => {
        try{
            let _cellFields = JSON.parse(_curObj.cellFields);
            if(_cellFields[_fieldID].displayFormat === "currency") return '$ '+Formatter.currency(_value);
            else if(_cellFields[_fieldID].displayFormat === "phoneNumber") return Formatter.phoneNumber(_value);
            else return _value;
        }catch(e){
            return _value;
        }
    }
    generateTable = (rowcount, colcount, toggleValues, cellValues, cellFields, _curObj) => {

        let newtable = [];
        let row = [];
        if (typeof(cellFields)==='undefined') return;
        cellFields = JSON.parse(cellFields);
        for (let i = 0; i < rowcount; i++) {
            let children = [];
            for (let j = 0; j < colcount; j++) {
                if (toggleValues[i + ',' + j] === false) {
                    children.push(<td key={i+','+j}>{cellValues[i + ',' + j]}</td>);
                } else {
                    if (cellFields[i + ',' + j] != 'undefined' && cellFields[i + ',' + j] != null && cellFields[i + ',' + j] != "") {
                        const fields = cellFields[i+','+j].xpath.split('/');
                        let field = this.state.Results;

                        for (let k = 0; k < fields.length; k++) {
                            if (fields[k] !== "" && fields[k] !== "Results") {
                                try {
                                    field = this.getFormatedValue_table(_curObj, i+','+j, field[fields[k]]);
                                    /*field = field[fields[k]];*/
                                }
                                catch (error) {
                                    field = null;
                                }
                            }
                        }
                        children.push(<td key={j}>{field}</td>);
                    }
                    else {
                        children.push(<td key={j}>{this.getTableData(_curObj, cellValues[i + ',' + j])}</td>);
                    }
                }
            }
            row.push(<tr key={i}>{children}</tr>);
        }
        newtable.push(<table key={colcount}><tbody>{row}</tbody></table>);
        return newtable;
    }


    getButton = (_obj) => {
        /*if(RuleHelper.getConditionalDisplay(_obj, this.state.Results) !== true) return "";*/
     
        if(Object.prototype.toString.call(_obj.displayPositionDetails) !== "[object Undefined]")
            _obj.displayPositionDetails = _obj.displayPositionDetails;
        else
            _obj.displayPositionDetails = "Center";
        
        try{
            if(_obj.action === "Routing"){
                let routeUrl = _obj.routeUrl ? _obj.routeUrl.toLowerCase().indexOf("http://") > -1 || _obj.routeUrl.toLowerCase().indexOf("https://") > -1 ? _obj.routeUrl:'//'+_obj.routeUrl:_obj.routeUrl;
                return(<Button className={_obj.displayPositionDetails} variant="contained" style={{color: 'white', backgroundColor: this.state.AppData.settings.defaultPrimary}} onClick={()=>window.location = routeUrl}>{_obj.title}</Button>);
            }
            else if(_obj.action === "Submit to LOS"){
                return(<Button className={_obj.displayPositionDetails} variant="contained" style={{color: 'white', backgroundColor: this.state.AppData.site.settings.defaultPrimary}} onClick={()=>this.ResubmitToLos(this.state.Results.ApplicationNumber,this.state.Results.AppId)} >{_obj.title}</Button>);
            }
            else
                return (<Button className={_obj.displayPositionDetails} variant="contained" style={{color: 'white', backgroundColor:  this.state.AppData.settings.defaultPrimary}} onClick={this.closePage}>{_obj.title}</Button>);
        }catch(e){
            return "";
        }
    }
    closePage = () => {
        window.open('', '_self', '');
        window.close();
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
    // getFinalDecission(){
    //     return this.props.getFinalDecission();
    // }
    redirectThankyouPage = () => {       
       
        if(this.getFinalDecission()) {
         
            this.setState({ Results: this.state.Results,AppData: this.state.AppData});
        }         
        else {
           
            this.setState({ redirect : {now: true,
                pathname: '/Pending/'+this.props.pageID,
                state: {Results: this.state.Results, AppData: this.state.AppData,siteId:this.props.pageID}
            }});
        }
      
    }
    ResubmitToLos(Appnum,AppId)
    {
        this.handleModalOpen();
        console.log(this.props.pageID);
        console.log(Appnum);
        let listArr = [];
        this.state.decisionPageFieldData.fields.forEach(arrObj => {
            if(arrObj.inputType === "Slider" || arrObj.inputType === "Checkbox"){
                if(arrObj.currentValue!=undefined)
                    listArr.push({id:arrObj.id,currentval:arrObj.currentValue});
            }        
        });
        let _self = this;
        let _postURL = config.API_BASE_URL+'Sites/resendToLos/' + 'Decision/' + Appnum +'/'+ AppId + '/' +this.props.pageID;
        axios.post(_postURL, listArr ,{ headers: { 'Content-Type': 'application/json' } }).then(function(response){

            if(response.data.Results.result === "true" || response.data.Results.result === "True"){
                
                let _tempValue = _self.state;
                //_tempValue.Decision = (response.data.Results.Decision === 'AA' || response.data.Results.Decision === 'A' ||response.data.Results.Decision ==='CB ERR'? 'Success' : 'Pending');
                _tempValue.Decision = 'Success';
                _tempValue.openModal = false;               
                _self.setState({Results: response.data.Results}, () => { _self.redirectThankyouPage() } );
            }else{
                let _errorMsg = "";
                 if(Object.prototype.toString.call(response.data.Results.errors.error) === "[object Array]"){
                     for(let i = 0; i < response.data.Results.errors.error.length; i++) _errorMsg += (i + 1)+': '+response.data.Results.errors.error[0].message + ' ';
                     
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
            let _tempValue=_self.state;
            _tempValue.showApplicationMessage=true;                  
            _self.setState(_tempValue);
            
            console.log(error);
            _self.handleModalClose();           
        });
    }
    showApplication = ()=>
    {
        this.setState({ redirect : {
            now: true,
            pathname: '/Application/'+ this.state.siteId,
            state: {AppData:this.state.AppData,siteId:this.state.siteId,appId:this.state.Results.AppId,createNewApp:false,selectedPage:"Decision",Results:this.state.Results}
        }}); 
    }

   
    render(){
            if (this.state.redirect && this.state.redirect.now) {
                return (
                    <Redirect to={this.state.redirect} />
                );
            }
            return (
                <div className="formContainer">
                 <ApplicationError showApplicationMessage={this.state.showApplicationMessage} closeApplicationMessage={() => this.setState({showApplicationMessage: false})} AppErrMsg={this.state.appErr} AppErrTitle={this.state.appErrTitle} ActualError={this.state.ActualError}/>  
                 <ModalLoaderComponent open={this.state.openModal} handleClose={this.handleModalClose} /> 
                
                    <Grid container spacing={0} className="personalLoanWrapper outputPageWrapper">
                        <Grid item xs={12} sm={12} md={12} style={{'marginTop': '20px'}}>
                        <Card className={this.state.policyCheck ? "policyCheckCnt checked" : "policyCheckCnt"}>
                            {
                                //this.state.AppData.settings.editApplication && this.getEditButton() &&
                                this.getEditButton() &&
                                <div className="editAppdiv">
                                    <Button  variant="contained" className="editApp" style={{color: 'white', backgroundColor: this.state.AppData.site.settings.defaultPrimary}} onClick={() => this.showApplication()}>Edit Application</Button>
                                </div>
                            }
                            <CardContent style={{"padding": "5px"}} className="resultCardCnt">
                            {
                                this.state.decisionPageFieldData.fields.map((_obj, index) => {
                                    if(RuleHelper.getConditionalDecisionDisplay(_obj, this.state) !== true ) return null;
                                
                                    if(_obj.inputType === "Text Area"){
                                        return <div key={_obj.id} className={_obj.isScrollable === true ? "textAreaCnt" : "textAreaCntNoScroll"} >{_obj.decisionTextFields?this.getTextArea(_obj):null}</div>
                                    }
                                    else if(_obj.inputType === "HTML Area"){
                                        return <div key={_obj.id} className={_obj.isScrollable === true ? "textAreaCnt" : "textAreaCntNoScroll"} >{this.getHTMLArea(_obj)}</div>
                                    }
                                    else if(_obj.inputType === "Image"){
                                        return <div key={_obj.id} className="imageCnt"><img src={_obj.imgSelected} alt={_obj.id} /></div>
                                    }
                                    else if(_obj.inputType === "Button"){
                                        return <div className="clearTextTransform" key={_obj.id} style={{marginBottom:'10px'}}>{this.getButton(_obj)}</div>
                                    }

                                    else if (_obj.inputType === "Slider") {

                                        var minValue = _obj.minValueType === "number" ? _obj.minValue : this.state.Results[this.getSliderField(_obj.minValuefielddetails)];
                                        var maxValue = _obj.maxValueType === "number" ? _obj.maxValue : this.state.Results[this.getSliderField(_obj.maxValuefielddetails)];
                                        var stepValue = _obj.stepValueType === "number" ? _obj.stepValue : this.state.Results[this.getSliderField(_obj.stepValuefielddetails)];
                                        var currentValue = _obj.currentValueType === "number" ? _obj.currentValue : this.state.Results[this.getSliderField(_obj.currentValuefielddetails)];

                                        if (isNaN(minValue) || isNaN(maxValue) || isNaN(stepValue) || isNaN(currentValue) ||
                                            Number(minValue) > Number(maxValue) || Number(currentValue) > Number(maxValue) ||
                                            Number(currentValue) < Number(minValue)) {
                                            dataShare.postLog("Log/Error", "{Invalid slider values}");
                                        }
                                        else {
                                            return <div key={_obj.id}>
                                                <div  className="sliderlbl">{_obj.title}</div>
                                                <CustomSlider helperText={_obj.title} minValue={Number(minValue)} maxValue={Number(maxValue)} currentValue={Number(currentValue)} step={Number(stepValue)} disable={false} sliderChanged={(newValue) => this.handleSliderChange(newValue, index)} />
                                                <FormHelperText className="sliderhint">{_obj.hint}</FormHelperText>
                                            </div>
                                        }                                    
                                    }
                                    
                                    else if (_obj.inputType === "Table") {
                                        return <div key={_obj.id} className="tableCnt">
                                            {this.generateTable(_obj.rowcount, _obj.colcount, _obj.toggleValues, _obj.cellValues, _obj.cellFields, _obj)}
                                        </div>

                                    }
                                    else if (_obj.inputType === "Checkbox"){
                                        if(Object.prototype.toString.call(_obj.currentValue) === "[object Undefined]")
                                        {
                                            let tempVar = this.state.decisionPageFieldData;
                                            tempVar.fields[index].currentValue=false;
                                            this.setState({tempVar});
                                        }

                                        return <div key={_obj.id} className="chkbox_right">
                                        <MuiThemeProvider theme={this.state.theme}>
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  color="primary"
                                                  checked={_obj.currentValue}   onChange={(event) =>this.handleCheckboxchanged(event,index)} />
                                              }
                                              label={_obj.title}
                                            />
                                        </MuiThemeProvider>
                                        </div>
                                    }
                                    
                                    return null;
                                }
                            )}
                            </CardContent>
                        </Card>
                        </Grid>
                    </Grid>                        
                </div>
            );
        }
}

export default compose(withWidth())(DecisionComponent);
