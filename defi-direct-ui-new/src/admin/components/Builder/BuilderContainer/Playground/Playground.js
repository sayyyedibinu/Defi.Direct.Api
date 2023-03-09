import React from "react";
import axios from 'axios';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import LinearProgress from '@material-ui/core/LinearProgress';
import ReactDragList from 'react-drag-list';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import BeforeUnload from 'react-beforeunload';
import Hidden from '@material-ui/core/Hidden';
import { /*BrowserRouter as Router, Route, Link,*/ Prompt } from "react-router-dom";
//import deepcopy from 'deepcopy';
import Draft, { rawToDraft, draftToRaw/*, draftToHtml*/ } from 'react-wysiwyg-typescript';
/*import { Draft,rawToDraft, draftToRaw } from 'react-draft-wysiwyg';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';*/

import config from "../../../../resources/config.json";
import "./style/PlaygroundStyle.css";
import "./style/PlaygroundDesktopStyle.css";
import "./style/PlaygroundMobileStyle.css";
import "./style/PlaygroundTabStyle.css";
import dataShare from "../../../Common/dataShare";
import generateGUID from "../../../Common/generateGUID";
import ModifyStepsModal from "../StepsModal/ModifyStepsModal";
import SelectComponentModal from "../SelectComponentModal/SelectComponentModal";
import AddFieldsModal from "../../AddFieldsModal/AddFieldsModal";
import DeleteFieldConfirmation from "../DeleteFieldConfirmation/DeleteFieldConfirmation";
import FieldConfiguration from "../../FieldConfiguration/FieldConfiguration";
import SelectImageModal from "../../SelectImageModal/SelectImageModal";
import ColumnConfig from "../ColumnConfig/ColumnConfig";
import FieldLogicInfoModal from "../../FieldLogicInfo/FieldLogicInfoModal";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

/*import FormSteps from "../FormSteps/FormSteps";*/
/*import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';*/
/*let draftState = {};*/
class PlaygroundComponent extends React.Component{
    constructor(props){
        super(props);
       let _themePatter = {
            primary: {main: (this.props.siteData.site.settings.defaultPrimary ? this.props.siteData.site.settings.defaultPrimary : "#7068e2")},
            secondary: {main: (this.props.siteData.site.settings.defaultSecondary ? this.props.siteData.site.settings.defaultSecondary : "#7068e2")}
        }
       
        this.state = {updateState: 0, floatingIndex: -1, siteData: this.props.siteData, showSelectComponent: false, showFieldConfiguration: false, configureFieldType: "Text Input", showChooseImage: false, fieldConfigurationObjIndex: -1, fieldConfigurationObjColumnIndex: 0, fieldConfigurationObj: {}, showDeleteConfirmation:false, deleteFieldIndex: -1, deleteFieldColIndex: 0, showAddFieldModal: this.props.showInsertField, showModifyStepsModal: false, ModifyStepsModalAction: 'add', ModifyStepsModalData_id: -1, ModifyStepsModalData_obj: {}, ModifyStepsModalData_name: "", selectedStep: 1, logo: window.clientLogo, showMobileSteps: true, primaryColor: '#7068E2', secondaryColor: '#83CAFD', backgroundColor: '#FCFCFD', steps: [], stepsBkp: [{id: 1, name: 'What kind of Loan'},{id: 2, name: 'What Vehicle'},{id: 3, name: 'Personal Information'}], theme: createMuiTheme({palette: _themePatter}), columnSplit: 1, ColumnConfigAction: 'new', showColumnConfiguration: false, columnInsert: false, deletePopFor: 'Field', stepTitle: "",stepSubTitle: "", askToLeave: (localStorage.getItem("askToLeave") === 'true' ? true : false), showFieldLogicInfoModal: false, invalidFieldLogicField: false, insertedFieldLogicDetails: {}, fieldLogicInfoMsg: ""};
       
       if(document.getElementById("LinearProgressBar")) (document.getElementById("LinearProgressBar")).getElementsByTagName("div")[0].style.backgroundColor = window.primaryColor;
       
       this.convertDraftObj();
       
       
    }
    openSelectComponent = (event, currentIndex, currentColIndex) => {
        let _tempVar = {};
        _tempVar.columnInsert = false;
        if(currentColIndex > 0)
            _tempVar.showSelectComponent = false;
        else{
            _tempVar.columnSplit = 1;
            _tempVar.showColumnConfiguration = false;
            _tempVar.ColumnConfigAction = 'new';
        }
        if(Object.prototype.toString.call(currentIndex) === "[object Number]")
            _tempVar.floatingIndex = currentIndex;
        else _tempVar.floatingIndex = -1;
        if(Object.prototype.toString.call(currentColIndex) === "[object Number]")
            _tempVar.fieldConfigurationObjColumnIndex = currentColIndex;
        else _tempVar.fieldConfigurationObjColumnIndex = 0;
        this.setState(_tempVar, () => {
            this.afterColumnSelect(1);
        });
    }
    openUpdateColumn = (currentIndex, fieldWidth) => {
        this.setState({columnSplit: fieldWidth, ColumnConfigAction: 'update', showColumnConfiguration: true, floatingIndex: currentIndex});
    }
    afterColumnSelect = (_column) => {
        if(this.state.ColumnConfigAction === 'new') this.setState({columnSplit: _column, showSelectComponent: true, showColumnConfiguration: false});
        else{
            let _curStepDetails = this.getCurrentStepDetails();
            for(let i = 0; i < _curStepDetails.fields[this.state.floatingIndex].length; i++)
                _curStepDetails.fields[this.state.floatingIndex][i].fieldWidth = _column;
            _curStepDetails.fields[this.state.floatingIndex] = _curStepDetails.fields[this.state.floatingIndex].splice(0, _column);
            this.setState({showColumnConfiguration: false});
        }
    }
    openSelectComponentFromColumn = (event, currentIndex, currentColIndex, fieldWidth) => {
        let _tempVar = {};
        _tempVar.showSelectComponent = true;
        _tempVar.columnSplit = fieldWidth;
        _tempVar.columnInsert = true;
        if(Object.prototype.toString.call(currentIndex) === "[object Number]")
            _tempVar.floatingIndex = currentIndex;
        else _tempVar.floatingIndex = -1;
        if(Object.prototype.toString.call(currentColIndex) === "[object Number]")
            _tempVar.fieldConfigurationObjColumnIndex = currentColIndex;
        else _tempVar.fieldConfigurationObjColumnIndex = 0;
        this.setState(_tempVar);
    }
    cancelSelectComponentWithout = () => {
        this.setState({showSelectComponent: false, floatingIndex: -1});
    }
    closeSelectComponent = () => {
        this.setState({showSelectComponent: false});
    }
    componentSelected = (_name) => {
        /*console.log('Selected component: ', _name);*/
        if(_name === 'Field') this.props.openInsertField();
        if(_name === 'Text') this.insertTextArea();
        if(_name === 'Image') this.openSelectImage();
    }
    openSelectImage = () => {
        this.setState({showChooseImage: true});
    }
    SelectedImage = (objImg) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            this.setState({imgSelected: event.target.result});
        };
        reader.readAsDataURL(objImg);
        // if(objImg=="")
        // {
        //     this.props.showNotification('error', 'Please Choose an Image');
        //     return;
        // }
       
        /*this.setState({imgSelected: objImg}, () => {
            
        });*/
       // this.insertImage;
    }
    insertTextArea = () => {
        let _textObj = {dataType : "string", defaultValue : "",inputType : "Text Area" };
        let fillText = (_textObj) => {
            let _curStepDetails = this.getCurrentStepDetails();       
            _textObj.placeholder = "";
            _textObj.id="TextArea " + generateGUID();
            _textObj.title="Textarea";
            _textObj.hint = "";
            _textObj.isRequired = false;
            _textObj.isScrollable = true;
            _textObj.displayLogic = true;    
            _textObj.text="";    
            _textObj.textAreaIndex = -1;       
            _textObj.fieldWidth = this.state.columnSplit;  
            if(this.state.columnInsert === true){
                _curStepDetails.fields[this.state.floatingIndex][this.state.fieldConfigurationObjColumnIndex] = _textObj;
            }else{
                if(this.state.floatingIndex >= 0){
                    _curStepDetails.fields.splice(this.state.floatingIndex+1, 0, [_textObj]);
                }else {
                    _curStepDetails.fields.push([_textObj]);
                }
            }
            
            this.setState({askToLeave: true, floatingIndex: -2});
        }
        fillText(_textObj);
    }
    insertImage = () => {  
        
        this.setState({askToLeave: true,showChooseImageModal: false});  
        this.setState({showChooseImage: false});  
             
        let _imgObj = {dataType : "string", defaultValue : "",inputType : "Image" };
        let fillObj = (_imgObj) => {
            let _curStepDetails = this.getCurrentStepDetails();       
            _imgObj.placeholder = "";
            _imgObj.id="Image " + generateGUID();
            _imgObj.title="Image";
            _imgObj.hint = "";
            _imgObj.isRequired = false;
            _imgObj.displayLogic = true;
            _imgObj.imgSelected = this.state.imgSelected;
            _imgObj.fieldWidth = this.state.columnSplit; 
            if(this.state.columnInsert === true){
                _curStepDetails.fields[this.state.floatingIndex][this.state.fieldConfigurationObjColumnIndex] = _imgObj;
            }else{
                if(this.state.floatingIndex >= 0){
                    _curStepDetails.fields.splice(this.state.floatingIndex+1, 0, [_imgObj]);

                }else {
                    _curStepDetails.fields.push([_imgObj]);
                }
            }
            
            this.setState({floatingIndex: -2});
        }
        fillObj(_imgObj);
    }
    openModal = (_obj, _action) => {
        let _tempVar = {};
        _tempVar.showModifyStepsModal = true;
        _tempVar.ModifyStepsModalAction = _action;
        if(_action === 'add'){
            _tempVar.ModifyStepsModalData_id = _obj;
            _tempVar.ModifyStepsModalData_name = '';
            _tempVar.ModifyStepsModalData_obj = {};
        }else{
            _tempVar.ModifyStepsModalData_id = _obj.no;
            _tempVar.ModifyStepsModalData_name = _obj.label;
            _tempVar.ModifyStepsModalData_obj = _obj
        }
        this.setState(_tempVar);
    }
    closeModal = () => {
        this.setState({showModifyStepsModal: false});
    }
    saveStep = (_data, _action, _logicObj) => {
        var _tempVar = this.state;
        if(_action === 'add'){

            let stepArr = [];
            _tempVar.siteData.site.steps.forEach(arrObj => {
                if(arrObj.label.toLowerCase() === _data.toLowerCase()){
                    stepArr.push(arrObj.label);
                }
            });
        
            if(stepArr.length>0)
            {
                this.props.showNotification('error', 'A step with name '+ _data + ' already exist'); 
                return;
            }


            let stepId = generateGUID();
            _tempVar.siteData.site.steps.push({
                no: (_tempVar.siteData.site.steps.length ? _tempVar.siteData.site.steps.length + 1 : 1),
                label: _data,
                id: stepId,
                stepSubTitle: '',
                stepTitle: '',
                displayLogic: _logicObj.displayLogic,
                displayLogicRule: _logicObj.displayLogicRule,
                displayLogicRuleDesc: _logicObj.displayLogicRuleDesc
            });
            _tempVar.siteData.site.fieldData.push({
                id: stepId,
                name: _data,                            
                fields: []
            });
        }
        if(_action === 'edit'){

                            
            if ( _tempVar.siteData.site.steps[_tempVar.ModifyStepsModalData_id - 1].label.toLowerCase() != _data.toLowerCase())
            {
                let stepArr = [];
                _tempVar.siteData.site.steps.forEach(arrObj => {
                    if(arrObj.label.toLowerCase() === _data.toLowerCase()){
                        stepArr.push(arrObj.label);
                    }
                });            
                if(stepArr.length>0)
                {
                    this.props.showNotification('error', 'A step with name '+ _data + ' already exist'); 
                    return;
                }

            }

            _tempVar.siteData.site.steps[_tempVar.ModifyStepsModalData_id - 1].label = _data;                                 
            _tempVar.siteData.site.steps[_tempVar.ModifyStepsModalData_id - 1].displayLogic = _logicObj.displayLogic;                                 
            _tempVar.siteData.site.steps[_tempVar.ModifyStepsModalData_id - 1].displayLogicRule = _logicObj.displayLogicRule;                                 
            _tempVar.siteData.site.steps[_tempVar.ModifyStepsModalData_id - 1].displayLogicRuleDesc = _logicObj.displayLogicRuleDesc;                                 
            for(let i = 0; i < _tempVar.siteData.site.fieldData.length; i++){
                if(_tempVar.siteData.site.fieldData[i].id === _tempVar.siteData.site.steps[_tempVar.ModifyStepsModalData_id - 1].id){
                    _tempVar.siteData.site.fieldData[i].name = _data;                                      
                    break;
                }
            }
        }
        if(_action === 'delete'){
            if(_tempVar.ModifyStepsModalData_id === _tempVar.selectedStep)
                _tempVar.selectedStep = 1;
            for(let i = 0; i < _tempVar.siteData.site.fieldData.length; i++){
                if(_tempVar.siteData.site.fieldData[i].id === _tempVar.siteData.site.steps[_tempVar.ModifyStepsModalData_id - 1].id){
                    _tempVar.siteData.site.fieldData.splice(i, 1);
                    break;
                }
            }
            _tempVar.siteData.site.steps.splice(_tempVar.ModifyStepsModalData_id - 1, 1);

            let _id = 1;
            for(let i = 0; i < _tempVar.siteData.site.steps.length; i++){
                if(_tempVar.siteData.site.steps[i]){
                    _tempVar.siteData.site.steps[i].no = _id;
                    _id = _id + 1;
                }
            }
        }
        _tempVar.showModifyStepsModal = false;
        /*console.log(JSON.stringify(_tempVar.siteData.site.steps));
        console.log(JSON.stringify(_tempVar.siteData.site.fieldData));*/
        _tempVar.askToLeave = true;
        this.setState(_tempVar);
        /*return;
        document.dispatchEvent(new CustomEvent("showAppLoader"));
        axios.post(config.API_BASE_URL+'Sites', _tempVar.siteData).then( (response) => {
            if(response.status !== 200) {
                this.props.showNotification('error', response.data);
                return;
            }
            this.props.showNotification('success', 'Information saved successfully.');
        }, (error) => {
            this.props.showNotification('error', 'Internal server error while saving information, please try after sometime.');
        }).finally( () => {
            document.dispatchEvent(new CustomEvent("hideAppLoader"));
        });*/
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps.siteData !== this.props.siteData) {
            this.setState({/*askToLeave: true,*/siteData: this.props.siteData});
            this.convertDraftObj();
        }
        if (prevProps.siteData.site.settings !== this.props.siteData.site.settings) {
            let _themePatter = {
                primary: {main: (this.props.siteData.site.settings.defaultPrimary ? this.props.siteData.site.settings.defaultPrimary : "#7068e2")},
                secondary: {main: (this.props.siteData.site.settings.defaultSecondary ? this.props.siteData.site.settings.defaultSecondary : "#7068e2")}
            }
            this.setState({/*askToLeave: true,*/theme: createMuiTheme({palette: _themePatter})});
        }
        if (prevProps.showInsertText !== this.props.showInsertText) {
            this.setState({askToLeave: true,floatingIndex: -1}, () => this.componentSelected('Text'));
        }
        if (prevProps.showInsertImage !== this.props.showInsertImage) {
            this.setState({askToLeave: true,floatingIndex: -1}, () => this.componentSelected('Image'));
        }
        if(document.getElementById("LinearProgressBar")) (document.getElementById("LinearProgressBar")).getElementsByTagName("div")[0].style.backgroundColor = (this.state.siteData.site.settings.defaultPrimary ? this.state.siteData.site.settings.defaultPrimary : this.state.primaryColor);
        if(this.props.parentClass !== 'mobileMode') document.getElementById("stepsCnt").style.display = "block";
        if(prevProps.invokeSaveSite === false && this.props.invokeSaveSite === true){
            this.saveSite(true);
        }
    }
    
    convertDraftObj = () => {
        for(let i = 0; i < this.props.siteData.site.fieldData.length; i++){
            for(let j = 0; j < this.props.siteData.site.fieldData[i].fields.length; j++){
                if(this.props.siteData.site.fieldData[i].fields[j].inputType === "Text Area"){
                    try{
                        /*console.log(draftToRaw( this.props.siteData.site.fieldData[i].fields[j].text))*/
                        if(typeof this.props.siteData.site.fieldData[i].fields[j].text !== 'object') this.props.siteData.site.fieldData[i].fields[j].text = rawToDraft(this.props.siteData.site.fieldData[i].fields[j].text);
                    }catch (e){
                        this.props.siteData.site.fieldData[i].fields[j].text = "";
                        console.warn(e);
                    }
                }
                    
            }
        }
    }
    
    

    componentWillUnmount = (event) => {
        localStorage.setItem("askToLeave", this.state.askToLeave);
        /*if(this.state.askToLeave === true){
            if(window.confirm("Are you sure you want to leave?  You could lose your data.")) return true;
            else return false;
        }*/
    }
    
    componentDidMount = () => {
        /*this.unregisterLeaveHook = Router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));*/
        /*console.log(this.props)
        console.log(Router)*/
    }
    
    toggleMenu = () => {
       if(!this.state.showMobileSteps) document.getElementById("stepsCnt").style.display = "block";
       else document.getElementById("stepsCnt").style.display = "none";
       this.setState({showMobileSteps: !this.state.showMobileSteps});
    }
    getStepElement = (_row) => {
        return (
            <div key={_row.id} className={this.state.selectedStep === _row.no ? "_eachStep selected" : "_eachStep"}>
                <span className="stepNoCnt" style={{'background': (this.state.selectedStep !== _row.no ? '' : this.state.siteData.site.settings.defaultPrimary)}} onClick={() => this.setState({selectedStep: _row.no})}>{_row.no}</span>    
                <span className="stepTitle" onClick={() => this.setState({selectedStep: _row.no})}>{_row.label}</span>
                <span className="stepActions">
                    <i className="material-icons edit" onClick={() => this.openModal(_row, 'edit')}>settings</i>
                    {
                        this.state.siteData.site.steps.length > 1 && 
                        <i className="material-icons delete" onClick={() => this.openModal(_row, 'delete')}>delete</i>
                    }
                    
                </span>
            </div>
        );
    }
    stepsDragCompleted = (updateValue) => {
       let _id = 1;
       for(let i = 0; i < updateValue.length; i++){
           if(updateValue[i]){
               updateValue[i].no = _id;
            _id = _id + 1;
           }
       }
        let _tempVar = this.state.siteData;
        _tempVar.site.steps = [];
       this.setState(_tempVar, ()=>{
           let _tempVar = this.state;
           _tempVar.selectedStep = 1;
           _tempVar.siteData.site.steps = updateValue;
           this.setState(_tempVar, () => {this.setState({askToLeave: true})});
       });
    }
    getCurrentStepDetails = () => {
        //debugger;
        if(this.state.siteData.site.steps.length === 0) return {};
        for(let i = 0; i < this.state.siteData.site.fieldData.length; i++){
           if(this.state.siteData.site.fieldData[i].id === this.state.siteData.site.steps[this.state.selectedStep - 1].id)
               return this.state.siteData.site.fieldData[i];
        }
        return [];
    }
    emptyApplicationPage = () => {
        return (
            <div className="AP-emptyWrapper">
                <img src={require('../../../../assets/img/empty-component.png')} alt="Empty" width="200px"/>
                <h3 className="AP-emptyHeader">Looks like you have an empty step!</h3>
                <p className="AP-emptyDesc">
                    Add a component below or using the left side bar to get started building this step
                </p>
            </div>
        );
    }
    addComponentCnt = () => {
        return(
            <div className="AP-addNewComponent">
                <span className="AP-addNewLine"></span>
                <span className="AP-addNewIcon" onClick={this.openSelectComponent}>
                    <i className="material-icons appSecondaryClr">add_circle</i>
                </span>
            </div>
        );
    }
    fieldSelected = (fieldObj) => {
        let _fieldObj = {};
        let fillField = (_fieldObj) => {
            let _curStepDetails = this.getCurrentStepDetails();
            _fieldObj.fieldID = fieldObj.id;
            _fieldObj.originalTitle = fieldObj.options.title;
            _fieldObj.placeholder = "";
            _fieldObj.hint = "";
            _fieldObj.isRequired = true;
            _fieldObj.displayLogic = true;
            _fieldObj.fieldWidth = this.state.columnSplit;
            this.props.closeInsertField();
            let indexDetails = {
                row: -1,
                column: -1
            };
            
            if(this.state.columnInsert === true){
                _curStepDetails.fields[this.state.floatingIndex][this.state.fieldConfigurationObjColumnIndex] = _fieldObj;
                indexDetails.row = this.state.floatingIndex;
                indexDetails.column = this.state.fieldConfigurationObjColumnIndex;
            }else{
               if(this.state.floatingIndex >= 0){
                    _curStepDetails.fields.splice(this.state.floatingIndex+1, 0, [_fieldObj]);
                    if(_fieldObj.fieldLogic === "" || _fieldObj.fieldLogic === undefined)
                        this.configureField(_fieldObj, this.state.floatingIndex+1, 0);
                    indexDetails.row = this.state.floatingIndex+1;
                    this.setState({floatingIndex: -1});
                }else {
                    _curStepDetails.fields.push([_fieldObj]);
                    if(_fieldObj.fieldLogic === "" || _fieldObj.fieldLogic === undefined)
                        this.configureField(_fieldObj, _curStepDetails.fields.length-1, 0);
                    indexDetails.row = _curStepDetails.fields.length-1;
                } 
                indexDetails.column = 0;
            }
            
            let data = this.state.siteData.site.data;
            data[_fieldObj.id] = "";
            if(_fieldObj.fieldLogic !== "" && _fieldObj.fieldLogic !== undefined){
                setTimeout(() => {this.showFieldLogicInfo(_fieldObj)}, 500);
            }
            this.setState({siteData: {...this.state.siteData, site: {...this.state.siteData.site,data}}, insertedFieldLogicDetails: indexDetails});
            /*setTimeout(() => this.configureField(_fieldObj, _curStepDetails.fields.length-1), 300);*/
        }
        dataShare.getFieldById(fieldObj.id, (error, data) => {
            if(error !== null){
                this.props.showNotification('error', 'Internal server error while fetching dropdown information, please try after sometime.');
                return;
            }
            _fieldObj = JSON.parse(JSON.stringify(data.options));
            if(fieldObj.options.inputType === "Dropdown" || fieldObj.options.inputType === "Listbox"){
                //_fieldObj = deepcopy(fieldObj.options);
                _fieldObj.choices = [];
                dataShare.getFieldListItems(fieldObj.options.fieldListId, (error, data) => {
                    if(error !== null){
                        console.error(error);
                        this.props.showNotification('error', 'Internal server error while fetching dropdown information, please try after sometime.');
                        return;
                    }
                    
                    data.sort( (a, b) => {
                        return a.ordinal - b.ordinal;
                    }).map( (option) => {
                        return _fieldObj.choices.push({
                            Value: (option.value ? option.value : option.display),
                            Description: option.display
                        })
                    });
                    fillField(_fieldObj);
                });
            }else{
                //_fieldObj = deepcopy(fieldObj.options);
                fillField(_fieldObj);
            }
        });
    }
    
    showFieldLogicInfo = (_fieldObj) => {
        try{
            let _fieldLogic = JSON.parse(_fieldObj.fieldLogic);
            let _invalidField = "";
            let _msg = _fieldObj.title + " field has dependency on the following fields: \n";
            for(let i = 0; i < _fieldLogic.length; i++){
                if(_fieldLogic[i].isField){
                    _msg += _fieldLogic[i].text + " \n";
                    let foundIt = false;
                    for(let j = 0; j < this.state.siteData.site.fieldData.length; j++){
                        for(let k = 0 ; k < this.state.siteData.site.fieldData[j].fields.length; k++){
                            for(let l = 0; l < this.state.siteData.site.fieldData[j].fields[k].length; l++){
                                if(_fieldLogic[i].text === this.state.siteData.site.fieldData[j].fields[k][l].title || _fieldLogic[i].text === this.state.siteData.site.fieldData[j].fields[k][l].originalTitle){
                                    foundIt = true;
                                    break;
                                }
                            }
                            if(foundIt) break;
                        }
                        if(foundIt) break;
                    }
                    _invalidField += foundIt+','
                }
            }
            this.showFieldLogicInfoModal((_invalidField.indexOf('false') === -1 ? false : true), _msg);
        }catch (e){
            console.warn(e);
        }
    }
    
    showFieldLogicInfoModal = (flag, _msg) => {
        this.setState({askToLeave: true, invalidFieldLogicField: flag, fieldLogicInfoMsg: _msg, showFieldLogicInfoModal: true});
    }
    
    closeFieldLogicInfoModal = () => {
        if(this.state.invalidFieldLogicField === true){
            let indexDetails = {
                row: -1,
                column: -1
            };
            let _curStepDetails = this.getCurrentStepDetails();
            _curStepDetails.fields[this.state.insertedFieldLogicDetails.row].splice(this.state.insertedFieldLogicDetails.column,1);
            if(_curStepDetails.fields[this.state.insertedFieldLogicDetails.row].length === 0)
                _curStepDetails.fields.splice(this.state.insertedFieldLogicDetails.row, 1);
            this.setState({siteData: {...this.state.siteData}, insertedFieldLogicDetails: indexDetails, fieldLogicInfoMsg: "", showFieldLogicInfoModal: false});
        }else{
            this.setState({fieldLogicInfoMsg: "", showFieldLogicInfoModal: false });
        }
    }
    saveSite = (isPublishInvoke=false) => {

        var _tempVar = this.state;
        for(let i = 0; i < _tempVar.siteData.site.fieldData.length; i++)
        {
            if(_tempVar.siteData.site.fieldData[i].id === _tempVar.siteData.site.steps[this.state.selectedStep - 1].id)
            {
                _tempVar.siteData.site.fieldData[i].stepTitle =  _tempVar.siteData.site.steps[this.state.selectedStep - 1].stepTitle;
                _tempVar.siteData.site.fieldData[i].stepSubTitle = _tempVar.siteData.site.steps[this.state.selectedStep - 1].stepSubTitle ;                   
                break;
            }
        }
        _tempVar.siteData.site.data=_tempVar.siteData.site.data;
        _tempVar.askToLeave = false;
        this.setState(_tempVar);
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
        for(let i = 0; i < this.state.siteData.site.decisionPageFieldData.length; i++){
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
        document.dispatchEvent(new CustomEvent("showAppLoader"));
        axios.post(config.API_BASE_URL+'Sites', _siteData).then( (response) => {
            if(response.status !== 200) {
                this.props.showNotification('error', response.data);
                return;
            }
            this.props.saveCallback();
            if(isPublishInvoke){
                this.props.onSaveComplete(true);
            }
            else{
                this.props.onSaveComplete(false);
                this.props.showNotification('success', 'Information saved successfully.');
            }
        }, (error) => {
            this.props.showNotification('error', 'Internal server error while saving information, please try after sometime.');
        }).finally( () => {
            document.dispatchEvent(new CustomEvent("hideAppLoader"));
        });
    }
    
    fieldsDragCompleted = (updatedValue) =>{
        let tempVar = this.state.siteData;
        for(let i = 0; i < this.state.siteData.site.fieldData.length; i++){
           if(this.state.siteData.site.fieldData[i].id === this.state.siteData.site.steps[this.state.selectedStep - 1].id){
               tempVar.site.fieldData[i].fields = [];
               this.setState({siteData: tempVar}, () => {
                   tempVar.site.fieldData[i].fields = updatedValue;
                    this.setState({askToLeave: true,siteData: tempVar});
               });
               return;
           }
        }
    }
    /*columnDragCompleted = (rowID, updatedValue) =>{
        console.log(updatedValue);
        let tempVar = this.state.siteData;
        for(let i = 0; i < this.state.siteData.site.fieldData.length; i++){
           if(this.state.siteData.site.fieldData[i].id === this.state.siteData.site.steps[this.state.selectedStep - 1].id){
               tempVar.site.fieldData[i].fields[rowID] = [];
               this.setState({siteData: tempVar}, () => {
                   tempVar.site.fieldData[i].fields[rowID] = updatedValue;
                    this.setState({siteData: tempVar});
               });
               return;
           }
        }
    }*/
    configureField = (_fieldObj, _fieldIndex, _columnIndex) => {
        if(Object.prototype.toString.call(_fieldObj.fieldWidth) === '[object Undefined]')
            _fieldObj.fieldWidth = this.state.columnSplit;
        this.setState({askToLeave: true,configureFieldType: _fieldObj.inputType, fieldConfigurationObjIndex: _fieldIndex, fieldConfigurationObjColumnIndex: _columnIndex, fieldConfigurationObj: _fieldObj, showFieldConfiguration: true});
    }
    confirmFieldConfiguration = (_data) => {
        /*console.log(_data);
        console.log(this.state.fieldConfigurationObjIndex);*/
        this.getCurrentStepDetails().fields[this.state.fieldConfigurationObjIndex][this.state.fieldConfigurationObjColumnIndex] = _data;
        this.setState({askToLeave: true,showFieldConfiguration: false});
    }
    removeField = (_index, colIndex) => {
        this.setState({askToLeave: true,deleteFieldIndex: _index, deleteFieldColIndex: colIndex, showDeleteConfirmation: true, deletePopFor: 'Field'});
    }
    removeRow = (_index) => {
        this.setState({askToLeave: true,deleteFieldIndex: _index, showDeleteConfirmation: true, deletePopFor: 'Row'});
    }
    confirmDelete = () => {
        if(this.state.deletePopFor === 'Field'){
           // console.log(this.state.deleteFieldIndex);
           // console.log(this.state.deleteFieldColIndex);
           // let p2=this.getCurrentStepDetails();
            let p=this.getCurrentStepDetails().fields[this.state.deleteFieldIndex][this.state.deleteFieldColIndex].id;
            delete this.state.siteData.site.data[this.getCurrentStepDetails().fields[this.state.deleteFieldIndex][this.state.deleteFieldColIndex].id];
            console.log(this.state.siteData.site.data);
            this.getCurrentStepDetails().fields[this.state.deleteFieldIndex].splice(this.state.deleteFieldColIndex, 1);
            if(this.getCurrentStepDetails().fields[this.state.deleteFieldIndex].length === 0 )
                this.getCurrentStepDetails().fields.splice(this.state.deleteFieldIndex, 1);
        }
        if(this.state.deletePopFor === 'Row'){
            for(let i = 0; i < this.getCurrentStepDetails().fields[this.state.deleteFieldIndex].length; i++) delete this.state.siteData.site.data[this.getCurrentStepDetails().fields[this.state.deleteFieldIndex][i].id];
            this.getCurrentStepDetails().fields.splice(this.state.deleteFieldIndex, 1);
        }
        this.setState({askToLeave: true,showDeleteConfirmation: false});
    }
    
    onInputChange = (editorState, index, columIndex) => {   
         let _tempVar=this.getCurrentStepDetails().fields;
         _tempVar[index][columIndex].text = editorState;
         /*_tempVar[index].text=draftToRaw(editorState);*/
         this.setState(_tempVar, () => this.setState({askToLeave: true}));
     }
    
    getDraftContent = (data) => {
        /*console.log(data.id);
        console.log(draftToRaw(data.text));*/
        /*console.log(data);*/
        /*console.log(typeof data.text);*/
        
        try{
            draftToRaw(data.text);
            return data.text;
        }catch(error){
            console.warn(error);
            try{
                return rawToDraft(data.text ? data.text : '');
            }catch(e){
                return rawToDraft('');
                console.warn(e);
            }
        }
        
        /*if(typeof data.text === 'object') return data.text;
        return rawToDraft(data.text ? data.text : '');*/
        /*return (typeof data.text === 'object' ? data.text : '');*/
    }
    
    getListBox = (data) => {
        const higlightCSS = {backgroundColor: (this.state.siteData.site.settings.defaultPrimary ? this.state.siteData.site.settings.defaultPrimary  : '#7068E2')}
        if(Object.prototype.toString.call(data.choices) !== "[object Array]") data.choices = [];
        return (
            <MuiThemeProvider theme={this.state.theme}>
                <RadioGroup
                    aria-label="Gender"
                    name={data.id}
                    value={data.choices[0].Value}
                    className="RadioGroupCnt"
                  >
                {
                    data.choices.map( (data, index) =>{
                        return <FormControlLabel className={index === 0 ? "radioBtnLabel checked" : "radioBtnLabel"} key={index} value={data.Value} control={<Radio />} label={data.Description} style={index === 0 ? higlightCSS : {}}/>
                    } )
                }
                 </RadioGroup>
             </MuiThemeProvider>
        );
         
    }
    
    
    onDragOver = (event) => {
        console.log('dragover funciton triggered');
        event.preventDefault();
    }
    onDrop = (event, rowIndex, columnIndex) => {
        if(typeof this.state.dragStartRow === 'undefined') return;
        if(this.state.dragStartRow !== rowIndex) return;
        
        let tempVar = this.state.siteData;
        for(let i = 0; i < this.state.siteData.site.fieldData.length; i++){
           if(this.state.siteData.site.fieldData[i].id === this.state.siteData.site.steps[this.state.selectedStep - 1].id){
               
               let _tempRow = tempVar.site.fieldData[i].fields[rowIndex];
               let _tempColumn1 = _tempRow[this.state.dragStartColumn];
               let _tempColumn2 = _tempRow[columnIndex];
               
               _tempRow[this.state.dragStartColumn] = _tempColumn2;
               _tempRow[columnIndex] = _tempColumn1;
               
               tempVar.site.fieldData[i].fields[rowIndex] = [];
               
               this.setState({siteData: tempVar}, () => {
                   tempVar.site.fieldData[i].fields[rowIndex] = _tempRow;
                    this.setState({askToLeave: true,siteData: tempVar});
               });
               return;
           }
        }
    }

    inputChanged = (event) =>
    { 
         this.getCurrentStepDetails();
        var _tempVar = this.state;
        _tempVar.askToLeave = true;
        if (event.target.name=== "Title")
        {           
            _tempVar.siteData.site.steps[this.state.selectedStep - 1].stepTitle = event.target.value;
            _tempVar.siteData.site.fieldData[this.state.selectedStep - 1].stepTitle =  event.target.value;
            this.setState(_tempVar);
        }
        else
        {
            _tempVar.siteData.site.steps[this.state.selectedStep - 1].stepSubTitle = event.target.value;
            _tempVar.siteData.site.fieldData[this.state.selectedStep - 1].stepSubTitle =  event.target.value;
            this.setState(_tempVar);
        }
    }
    onDragStart = (event, rowIndex, columnIndex) => {
        /*console.log(event, rowIndex, columnIndex);*/
        this.setState({askToLeave: true,dragStartRow: rowIndex, dragStartColumn: columnIndex});
        /*event.dataTransfer.setDate("rowIndex", rowIndex);
        event.dataTransfer.setDate("columnInde", columnIndex);*/
    }
    
    updateHTMLValue = (event, rowID, columnID) => {
        let tempVar = this.state.siteData;
        for(let i = 0; i < this.state.siteData.site.fieldData.length; i++){
           if(this.state.siteData.site.fieldData[i].id === this.state.siteData.site.steps[this.state.selectedStep - 1].id){
               tempVar.site.fieldData[i].fields[rowID][columnID].text = event.target.value;
               this.setState({askToLeave: true,siteData: tempVar});
               return;
           }
        }
    }
    
    getFieldListCnt = (_obj, index) => {
        let fieldWidth = 0, emptyColumn = []
         return (
             <Grid item xs={12} key={index} className="fieldListCnt">
                <Grid container spacing={0} 

                >
                {

                    _obj.map((data, _colIndex) => {

                        data.fieldWidth = Object.prototype.toString.call(data.fieldWidth) === '[object Undefined]' ? 3 : data.fieldWidth;
                        if(_colIndex === 0){
                            fieldWidth = data.fieldWidth;
                            if(fieldWidth === 2 && _obj.length === 1 ) emptyColumn.push("");
                            if(fieldWidth === 3 && _obj.length === 1 ) emptyColumn.push("","");
                            if(fieldWidth === 3 && _obj.length === 2 ) emptyColumn.push("");
                         }
                         return (
                            <Grid item xs={12} sm={data.fieldWidth === 1 ? 12 : (data.fieldWidth === 2 ? 6 : 4)} 
                                key={_colIndex} 
                                className="fieldListCntCol">
                                <div 
                                    className="fieldListCntCol-inner"
                                    draggable
                                    onDragStart = {(e) => this.onDragStart(e, index, _colIndex)}
                                    onDragOver={(e)=>this.onDragOver(e)}                    
                                    onDrop={(e)=>{this.onDrop(e, index, _colIndex)}}
                                >
                                {
                                    data.inputType === "Text Input" && 
                                    <TextField label={data.title + (data.isRequired === true ? ' *' : '')} value={data.placeholder ? data.placeholder : data.title} fullWidth readOnly/>
                                }
                                {
                                    data.inputType === "Dropdown" && 
                                    <Select value={data.title} fullWidth>
                                        <option value={data.title}>{data.title + (data.isRequired === true ? ' *' : '')}</option>
                                      </Select>
                                }
                                {
                                    data.inputType === "Checkbox" && 
                                    <MuiThemeProvider theme={this.state.theme}>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              color="primary"
                                              checked={true}/>
                                          }
                                          label={data.title}
                                        />
                                    </MuiThemeProvider>

                                }
                                {
                                    data.inputType === "Listbox" && this.getListBox(data)
                                }
                                {

                                    data.inputType === "Text Area" && 
                                    <Draft style={{maxHeight: "100px"}}
                                        editorState={this.getDraftContent(data)} 
                                        onEditorStateChange={(editorState) => this.onInputChange(editorState, index, _colIndex) }
                                        toolbar ={
                                            {
                                                options:['inline', 'blockType', 'fontSize', 'list', 'history', 'textAlign', 'colorPicker' ], 
                                                // This is where you can specify what options you need in
                                                //the toolbar and appears in the same order as specified
                                                inline:
                                                {
                                                options:['bold', 'italic', 'underline', 'strikethrough'] 
                                                // this can be specified as well, toolbar wont have
                                                //'monospace', 'superscript', 'subscript'
                                                },
                                                fontSize: {
                                                    options: ["8", "10", "12", "14", "16", "18", "20", "22", "24", "26", "28", "30", "32", "34", "36", "38", "40", "44", "48", "52", "56", "60", "70", "80", "90"]
                                                }
                                            }
                                        }
                                    />
                                }
                                {

                                    data.inputType === "HTML Area" && 
                                    <TextField
                                      label="HTML Area"
                                      name={data.id}
                                      multiline
                                      rows="6"
                                      value={data.text}
                                      onChange={(event) => {this.updateHTMLValue(event, index, _colIndex);}}
                                      margin="normal"
                                      variant="outlined"
                                        fullWidth
                                    />
                                }
                                {
                                    data.inputType === "Image" && 
                                    <div className="imgCnt"><img  src={data.imgSelected !== "" ? data.imgSelected :""} alt="Logo" /></div>

                                }
                              <span className="fieldListActionCnt">
                                    <i className="material-icons delete" onClick={this.removeField.bind(null, index, _colIndex)}>delete</i>
                                    <i className="material-icons edit" onClick={this.configureField.bind(null, data, index, _colIndex)} >settings</i>
                                    {
                                        /*(data.inputType !== "Image") && 
                                        <i className="material-icons edit" onClick={this.configureField.bind(null, data, index, _colIndex)} >settings</i>*/
                                    }

                              </span>

                                </div>
                            </Grid>
                        )
                     })
                }
                {

                    emptyColumn.map( (_data, _colRemainIndex) =>{
                        return (
                            <Grid item xs={12} sm={fieldWidth === 2 ? 6 : 4} key={_obj.length + _colRemainIndex} className="fieldListCntColAdd">
                                <div className="addColCnt" onClick={() => this.openSelectComponentFromColumn(null, index, _obj.length, fieldWidth)}>
                                    <i className="material-icons">add_circle</i>
                                </div>
                            </Grid>
                        )
                    })
                }
                 </Grid>
                <span className="insertFieldCnt-floating">
                    <div className="AP-addNewComponent">
                        <span className="AP-addNewLine"></span>
                        <span className="AP-addNewIcon" onClick={() => this.openSelectComponent(null, index, 0)}>
                            <i className="material-icons appSecondaryClr">add_circle</i>
                        </span>
                        <span className="AP-updateIcon" onClick={() => this.openUpdateColumn(index, fieldWidth)}>
                            <i className="material-icons appSecondaryClr">view_column</i>
                        </span>
                        <span className="AP-deleteIcon" onClick={() => {this.removeRow(index)}}>
                            <i className="material-icons">delete</i>
                        </span>
                    </div>
                </span>
             </Grid>
         )
    }
    render(){
        return(
            <div className={this.props.parentClass}>
                <FieldLogicInfoModal showFieldLogicInfoModal={this.state.showFieldLogicInfoModal} fieldLogicInfoMsg={this.state.fieldLogicInfoMsg} closeFieldLogicInfoModal={this.closeFieldLogicInfoModal} invalidFieldLogicField={this.state.invalidFieldLogicField} />
                <ColumnConfig showColumnConfiguration={this.state.showColumnConfiguration} columnSplit={this.state.columnSplit} confirmColumnConfiguration={this.afterColumnSelect} closeColumnConfiguration={() => this.setState({showColumnConfiguration: false})} />
                <BeforeUnload onBeforeunload={() => {
                    if (this.state.askToLeave === true) {
                        return "Are you sure you want to leave?  You could lose your data.";
                    }
                }} />
                <Prompt
                    when={this.state.askToLeave === true}
                    message={() => {
                        return `Are you sure you want to leave?  You could lose your data.`;
                    }
                    }
                />
                <FieldConfiguration fieldType={this.state.configureFieldType} showFieldConfiguration={this.state.showFieldConfiguration} configurationData={this.state.fieldConfigurationObj} closeFieldConfiguration={() => this.setState({showFieldConfiguration: false})} confirmFieldConfiguration={this.confirmFieldConfiguration} showNotification={this.props.showNotification} />
            
                <DeleteFieldConfirmation showDeleteConfirmation={this.state.showDeleteConfirmation} closeDeleteConfirmation={() => this.setState({showDeleteConfirmation: false})} confirmDelete={this.confirmDelete} deletePopFor={this.state.deletePopFor} />
            
                <SelectComponentModal showModal={this.state.showSelectComponent} openModal={this.openSelectComponent} closeModal={this.closeSelectComponent} cancelModal={this.cancelSelectComponentWithout} componentSelected={this.componentSelected} showButton={false} showSlider={false} showTable={false}/>
                {/* <ModifyStepsModal ModifyStepsModalData_obj={this.state.ModifyStepsModalData_obj} data={this.state.ModifyStepsModalData_name} action={this.state.ModifyStepsModalAction} showModal={this.state.showModifyStepsModal} openModal={this.openModal} closeModal={this.closeModal} saveStep={this.saveStep} stepTitle={this.state.stepTitle} stepSubTitle={this.state.stepSubTitle} showNotification={this.props.showNotification}/> */}
                <ModifyStepsModal ModifyStepsModalData_obj={this.state.ModifyStepsModalData_obj} data={this.state.ModifyStepsModalData_name} action={this.state.ModifyStepsModalAction} showModal={this.state.showModifyStepsModal} openModal={this.openModal} closeModal={this.closeModal} saveStep={this.saveStep} stepTitle={this.state.stepTitle} stepSubTitle={this.state.stepSubTitle} showNotification={this.props.showNotification} siteId={this.state.siteData.id}/>

                <SelectImageModal showChooseImageModal={this.state.showChooseImage} showChooseImageCloseModal={() => this.setState({showChooseImage: false})} insertImage={this.insertImage} SelectedImage={this.SelectedImage}/>               
                <AddFieldsModal siteData={this.state.siteData} showModal={this.props.showInsertField} closeModal={this.props.closeInsertField} fieldSelected={this.fieldSelected} showNotification={this.props.showNotification} selectedPage={this.props.selectedPage}/>
            
                <div className="mobileNavBar">
                    {/*<span className="hamburgerMenuCnt">
                        <i className="material-icons">menu</i>
                    </span>*/}
                    
                    {
                        !this.state.logo && <img src={require('../../../../assets/img/sample_client_logo.jpg')} alt="ACME"/>
                    }
                    {
                        this.state.logo && <img src={this.state.logo} alt="ACME" width="190" height="45"/>
                    }
                    
                </div>
                        
                <div className="progressBarCnt" onClick={this.toggleMenu}>
                    <div className="counter">
                        {this.state.selectedStep}/{this.state.siteData.site.steps.length}
                    </div>
                    <div className="progressBar">
                        <LinearProgress id="LinearProgressBar" variant="determinate" value={(this.state.selectedStep / this.state.siteData.site.steps.length) * 100} style={{"backgroundColor": "#000 !important", "background": "#CBCCD0", "width": "100%", "height": "10px", "borderRadius": "5px", "marginTop": "4px"}} />
                    </div>
                    <div className="icon">
                        <i className="material-icons" style={{"color": (this.state.siteData.site.settings.defaultSecondary ? this.state.siteData.site.settings.defaultSecondary : this.state.secondaryColor)}}>{this.state.showMobileSteps ? 'arrow_drop_up' : 'arrow_drop_down'}</i>
                    </div>
                </div>

                <div className="stepsCnt" id="stepsCnt">
                    <ReactDragList 
                        handles={false}
                        dataSource={this.state.siteData.site.steps} 
                        row={(record, index) => this.getStepElement(record)} 
                        onUpdate={(event, updated) => {this.stepsDragCompleted(updated);}}
                        ghostClass="dragGhostClass"
                    />
                    {
                        this.state.siteData.site.steps.length === 0 && <div>Looks like you have empty steps</div>  
                    }
                    <div className="addNewStepCnt" onClick={() => this.openModal(this.state.steps.length, "add")}>
                        <i className="material-icons edit appSecondaryClr">add_circle</i>
                        <span className="_title">Insert Step</span>
                    </div>
                </div>
                {
                    this.state.siteData.site.steps.length > 0 && 
                    <div className="componentsWrapper" style={{paddingBottom: "25px"}}>
                        {
                            this.getCurrentStepDetails().fields.length === 0 && this.emptyApplicationPage()
                        }
                        <Grid container spacing={0} className="fieldListWrapper">
                        { 
                            this.getCurrentStepDetails().fields.length !== 0 &&                             
                            <Grid item xs={12} style={{"marginBottom": "10px"}}>
                                <Grid container spacing={0}>
                                    <TextField label="Title" name="Title" value={this.state.siteData.site.steps[this.state.selectedStep-1].stepTitle ? this.state.siteData.site.steps[this.state.selectedStep-1].stepTitle : ''} onChange={this.inputChanged} fullWidth/>                                       
                                    <TextField label="Subtitle" name="Subtitle" value={this.state.siteData.site.steps[this.state.selectedStep-1].stepSubTitle ? this.state.siteData.site.steps[this.state.selectedStep-1].stepSubTitle : ''} onChange={this.inputChanged} fullWidth/>

                                </Grid>
                            </Grid>
                            }
                            <Hidden only={['xs']}>
                                <ReactDragList 
                                    className="insertedFields"
                                    handles={false}
                                    dataSource={this.getCurrentStepDetails().fields} 
                                    onUpdate={(event, updated) => {this.fieldsDragCompleted(updated);}}
                                    ghostClass="dragGhostClass"
                                    row={(_obj, index) => this.getFieldListCnt(_obj, index)} 
                                />
                            </Hidden>
                            
                            <Hidden only={['sm', 'md', 'lg', 'xl']}>
                                {
                                    this.getCurrentStepDetails().fields.map( (_obj, index) => this.getFieldListCnt(_obj, index) )
                                }
                            </Hidden>

                        </Grid>
                        {this.addComponentCnt()}

                        <Tooltip title="Click to save changes" placement="top" TransitionComponent={Zoom}>
                            <Button variant="fab" onClick={()=>this.saveSite(false)} className="saveFabFieldBtn">
                              <i className="material-icons">save</i>
                            </Button>
                        </Tooltip>
                    </div>
                }
                
            </div>
        )
    }
}

export default compose(withWidth())(PlaygroundComponent);



/*<Button variant="contained" className="saveFieldBtn" onClick={this.saveSite}>Save & Continue</Button>*/

/*<Grid item xs={12} key={index} className={data.inputType === "Image" ? "fieldListCnt fullWidth" : "fieldListCnt"} >*/
    
/*<span className="addNewSpan" onClick={() => this.openModal(this.state.steps.length, "", "add")}>
                            <i className="material-icons edit">add_circle</i>
                            <span className="_title">Insert Step</span>
                        </span>*/

/*{
                                this.getCurrentStepDetails().fields.map( (data, index) => {
                                    return <Grid item xs={12} key={index} className="fieldListCnt" >
                                            {
                                                data.inputType === "Text Input" && 
                                                <TextField label={data.title} value={data.title} fullWidth readOnly/>
                                            }
                                            {
                                                data.inputType === "Dropdown" && 
                                                <Select value={data.title} fullWidth>
                                                    <option value={data.title}>{data.title}</option>
                                                  </Select>
                                            }
                                            {
                                                data.inputType === "Checkbox" && 
                                                <FormControlLabel
                                                  control={
                                                    <Checkbox
                                                      checked={true}/>
                                                  }
                                                  label={data.title}
                                                />
                                            }
                                            
                                            
                                        </Grid>
                                })
                            }*/
                                                                        

/*<FormSteps steps={this.props.steps} selectedStep={this.props.selectedStep} primaryColor={this.state.primaryColor} secondaryColor={this.state.secondaryColor} />*/
    
/*<Grid container spacing={0}>
                    <Hidden only={['xs', 'sm']}>
                        <Grid item md={1}>
                        </Grid>
                    </Hidden>
                    <Grid item xs={12} sm={4} md={3}>
                        <Hidden only={['md', 'lg', 'xl']}>
                            <LinearProgress variant="determinate" value={1 * 100} style={{"height": "10px", "borderRadius": "5px", "marginTop": "4px"}} />
                        </Hidden>
                        <Hidden only={['xs', 'sm']}>
                            <FormSteps pages={this.props.pages} selectedPage={this.props.selectedPage} />
                        </Hidden>
                    </Grid>
                    <Grid item xs={12} sm={8} md={7} className="workingArea">
                        {this.props.selectedPage} Container
                    </Grid>
                </Grid>*/