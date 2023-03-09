import React from "react";
import Draft, { rawToDraft, draftToRaw/*, draftToHtml*/ } from 'react-wysiwyg-typescript';
import axios from 'axios';
import config from "../../../../resources/config.json";
import Button from '@material-ui/core/Button';
import "./style/PlaygroundStyle.css";
import "./style/PlaygroundDesktopStyle.css";
import "./style/PlaygroundMobileStyle.css";
import "./style/PlaygroundTabStyle.css";
import SelectComponentModal from "../SelectComponentModal/SelectComponentModal";
import CustomSlider from "../../../Common/CustomSlider/CustomSlider";
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import ReactDragList from 'react-drag-list'
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import TextField from '@material-ui/core/TextField';
import { EditorState, Modifier } from 'draft-js';
import dataShare from "../../../Common/dataShare";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import BeforeUnload from 'react-beforeunload';
import generateGUID from "../../../Common/generateGUID";
import SelectImageModal from "../../SelectImageModal/SelectImageModal";
import SelectSliderModal from "../../SelectSliderModal/SelectSliderModal";
import DeleteFieldConfirmation from "../DeleteFieldConfirmation/DeleteFieldConfirmation";
import FieldConfiguration from "../../FieldConfiguration/FieldConfiguration";
import { /*BrowserRouter as Router, Route, Link, */Prompt } from "react-router-dom";
/*import { SSL_OP_MICROSOFT_SESS_ID_BUG } from "constants";*/
import ButtonConfiguration from "../../ButtonConfiguration/ButtonConfiguration";
import SelectTableModal from "../../SelectTableModal/SelectTableModal";
import EditTableModal from "../../EditTableModal/EditTableModal";
import AddFieldsModal from "../../AddFieldsModal/AddFieldsModal";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class CustomOption extends React.Component {
    constructor(props) {
        super(props);
        this.state = { setOutputFields: null};
        this.getOutputFields = this.getOutputFields.bind(this);
    }
    static propTypes = {
        onChange: PropTypes.func,
        editorState: PropTypes.object,
    };

    componentDidMount = () => {
       
        this.getOutputFields();
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
            this.setState({ setOutputFields: arrOptions });
        })
    }
    AddField = (event, child) => {
        const {editorState, onChange } = this.props;
        const contentState = Modifier.replaceText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        '{{' + event.target.value.options.id + '}}',
        editorState.getCurrentInlineStyle(),
        );
        onChange(EditorState.push(editorState, contentState, 'insert-characters'));
    }
   

    emptyOption = () => { return (
        <option key={0} name={0} value={0}>Insert Field</option>
    )}
  
    render() {
        let xx = this.state.setOutputFields;
        let optionItems=null;
        if(xx!=null)
        {
         optionItems = [ ...xx.map((x) =>
                <option key={x.value.id} name={x.value.id} value={x.value}>{x.label}</option>
            )];
        }       
        return (
            <FormControl fullWidth>
            <InputLabel htmlFor="OutputFieldSelector">Insert Field</InputLabel>
            <Select onChange={this.AddField.bind(this)} value=""
                inputProps={{
                    name: 'OutputFieldSelector',
                    id: 'OutputFieldSelector',
                  }}
            >
            {optionItems}        
        </Select>
              
            
          </FormControl>
        
            
        );
    }
}
class PlaygroundWithoutStepsComponent extends React.Component {
    constructor(props) {
        super(props);
        let _themePatter = {
            primary: {main: (this.props.siteData.site.settings.defaultPrimary ? this.props.siteData.site.settings.defaultPrimary : "#7068e2")},
            secondary: {main: (this.props.siteData.site.settings.defaultSecondary ? this.props.siteData.site.settings.defaultSecondary : "#7068e2")}
        }
        this.state = { tableRowCount: 0, tableColCount: 0, tableToggleValues: {}, tableCellValues: {}, fields: [], showEditTableModal: false, showTableModal: false, showSliderModal: false, showSelectComponent: false, showChooseImage: false, showDeleteConfirmation: false, logo: window.clientLogo, primaryColor: window.primaryColor, secondaryColor: window.secondaryColor, backgroundColor: window.backgroundColor, showFieldConfiguration: false, configureFieldType: "", fieldConfigurationObjIndex: -1, fieldConfigurationObj: {}, askToLeave: (localStorage.getItem("askToLeave") === 'true' ? true : false), showButtonConfig: false, buttonEditMode:false, buttonConfigurationObj: {title:"",action:"",routeUrl:""},theme: createMuiTheme({palette: _themePatter}) };
        if (this.props.siteData)
            this.state.siteData = this.props.siteData;
            this.convertDraftObj();
          }
    openSelectComponent = (event, currentIndex) => {
        let _tempVar = {};
            _tempVar.showSelectComponent = true;
        if(Object.prototype.toString.call(currentIndex) === "[object Number]")
            _tempVar.floatingIndex = currentIndex;
        else _tempVar.floatingIndex = -1;
        this.setState(_tempVar);
    }
    cancelSelectComponentWithout = () => {
        this.setState({showSelectComponent: false, floatingIndex: -1});
    }
    openEditSliderModal = (_fieldObj, _fieldIndex) => {
        this.getFields(true);
        this.setState({ sliderIndex:_fieldIndex,sliderId: _fieldObj.id,sliderTitle: _fieldObj.title,
             sliderMinValue: _fieldObj.minValue,sliderMinToggle: _fieldObj.minToggle, sliderMinValueFrom: _fieldObj.minValuefrom,sliderMinValueType: _fieldObj.minValueType,
             sliderMaxValue: _fieldObj.maxValue,sliderMaxToggle: _fieldObj.maxToggle, sliderMaxValueFrom: _fieldObj.maxValuefrom,sliderMaxValueType: _fieldObj.maxValueType,
             sliderStepValue: _fieldObj.stepValue, sliderStepToggle: _fieldObj.stepToggle, sliderStepValueFrom: _fieldObj.stepValuefrom,sliderSteoValueType: _fieldObj.stepValueType,
             sliderCurrentValue: _fieldObj.currentValue,sliderCurrentToggle: _fieldObj.currentToggle, sliderCurrentValueFrom: _fieldObj.currentValuefrom,sliderCurrentValueType: _fieldObj.currentValueType, 
             sliderMode:'edit', showSliderModal: true });
    }
    configureField = (_fieldObj, _fieldIndex) => {
        if(Object.prototype.toString.call(_fieldObj.fieldWidth) === '[object Undefined]')
            _fieldObj.fieldWidth = this.state.columnSplit;
        this.setState({askToLeave: true,configureFieldType: _fieldObj.inputType, fieldConfigurationObjIndex: _fieldIndex, fieldConfigurationObj: _fieldObj, showFieldConfiguration: true});
    }
    confirmFieldConfiguration = (_data) => {
        let tempVar = this.state.siteData;
        if (this.props.isPending)
            tempVar.site.pendingPageFieldData[this.state.fieldConfigurationObjIndex] = _data;
        else
            tempVar.site.decisionPageFieldData[this.state.fieldConfigurationObjIndex] = _data;
        this.setState({askToLeave: true,showFieldConfiguration: false, siteData: tempVar});
    }
    
    closeSelectComponent = () => {
        this.setState({showSelectComponent: false});
    }
    componentSelected = (_name) => {
        if(_name === 'Text') this.insertTextArea();
        if (_name === 'Image') this.openSelectImage();
        if (_name === 'Slider') this.openSliderModal();
        if (_name === 'Button') this.openButtonConfig();
        if (_name === 'Table') this.openTableModal();
        if(_name === 'Field') this.props.openInsertField();
    }
    openButtonConfig = () => {
        this.setState({ showButtonConfig: true });
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
        
    }  
    componentWillUnmount = (event) => {
        localStorage.setItem("askToLeave", this.state.askToLeave);
    }
    insertImage = () => {    
        
        this.setState({askToLeave: true, showChooseImageModal: false});  
        this.setState({showChooseImage: false}); 
             
        let _imgObj = {dataType : "string", defaultValue : "",inputType : "Image" };
        let fillObj = (_imgObj) => {
            let _curStepDetails = this.props.isPending ? this.state.siteData.site.pendingPageFieldData : this.state.siteData.site.decisionPageFieldData
            _imgObj.placeholder = "";
            _imgObj.id="Image " + generateGUID();
            _imgObj.title="Image";
            _imgObj.hint = "";
            _imgObj.isRequired = false;
            _imgObj.displayLogic = true;
            _imgObj.imgSelected = this.state.imgSelected;
            if(this.state.floatingIndex >= 0){
                _curStepDetails.splice(this.state.floatingIndex+1, 0, _imgObj);

            }else {
                _curStepDetails.push(_imgObj);
            }
            this.setState({floatingIndex: -2});
        }
        fillObj(_imgObj);
    }
    configureField = (_fieldObj, _fieldIndex, _columnIndex) => {
        if(Object.prototype.toString.call(_fieldObj.fieldWidth) === '[object Undefined]')
            _fieldObj.fieldWidth = this.state.columnSplit;
        if(_fieldObj.inputType === "Button")
            this.setState({configureFieldType: _fieldObj.inputType, fieldConfigurationObjIndex: _fieldIndex, fieldConfigurationObjColumnIndex: _columnIndex, buttonConfigurationObj: _fieldObj, showButtonConfig: true, buttonEditMode:true});
        else
            this.setState({configureFieldType: _fieldObj.inputType, fieldConfigurationObjIndex: _fieldIndex, fieldConfigurationObjColumnIndex: _columnIndex, fieldConfigurationObj: _fieldObj, showFieldConfiguration: true});
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
    insertTextArea = () => {
        let _textObj = {dataType : "string", defaultValue : "",inputType : "Text Area" };
        let fillText = (_textObj) => {
            let _curStepDetails = this.props.isPending ? this.state.siteData.site.pendingPageFieldData : this.state.siteData.site.decisionPageFieldData;//this.getCurrentStepDetails();       
            _textObj.placeholder = "";
            _textObj.id="TextArea " + generateGUID();
            _textObj.title="Textarea";
            _textObj.hint = "";
            _textObj.isRequired = false;
            _textObj.isScrollable = true;
            _textObj.displayLogic = true;    
            _textObj.text="";    
            _textObj.textAreaIndex = -1;
            _textObj.decisionTextId = "";
            _textObj.decisionTextFields = [];
            _textObj.decisionText = "";   
            if(this.state.floatingIndex >= 0){
                _curStepDetails.splice(this.state.floatingIndex+1, 0, _textObj);

            }else {
                _curStepDetails.push(_textObj);
            }
            
            this.setState({askToLeave: true,floatingIndex: -2});
        }
        fillText(_textObj);
    }

    openTableModal = () => {
        this.getFields(true);
        this.setState({ showTableModal: true });
    }
    closeTableModal = () => {
        this.setState({ showTableModal: false });
    }
    insertTable = (rowCount, colCount, toggleValues, cellValues) => {
        let _tableObj = { dataType: "string", inputType: "Table" };
        let fieldIdList = this.getTableFieldIds();
        let fillText = (_tableObj) => {
            let _curStepDetails = this.props.isPending ? this.state.siteData.site.pendingPageFieldData : this.state.siteData.site.decisionPageFieldData;
            _tableObj.id = "Table " + generateGUID();
            _tableObj.title = "Table";
            _tableObj.rowcount = rowCount;
            _tableObj.colcount = colCount;
            _tableObj.toggleValues = toggleValues;
            _tableObj.cellValues = cellValues;
            let cellFields = {};
            for (let i = 0; i < rowCount; i++) {
                for (let j = 0; j < colCount; j++) {
                    if (toggleValues[i + ',' + j] === true) {
                        cellFields[i + ',' + j] = fieldIdList[cellValues[i + ',' + j]];
                    }
                }
            }
            _tableObj.cellFields = JSON.stringify(cellFields);

            if (this.state.floatingIndex >= 0) {
                _curStepDetails.splice(this.state.floatingIndex + 1, 0, _tableObj);
            } else {
                _curStepDetails.push(_tableObj);
            }
            this.setState({ askToLeave: true, floatingIndex: -2 });
        }
        fillText(_tableObj);
        this.closeTableModal();
    }
    displayTable = (rowcount, colcount, toggles, cells, tableid) => {
        let table = [];
        let row = [];
        for (let i = 0; i < rowcount; i++) {
            let children = [];
            for (let j = 0; j < colcount; j++) {
                children.push(<td key={i + ',' + j}> {cells[i + ',' + j]}</td>);
            }
            row.push(<tr key={i}>{children}</tr>);
        }
        table.push(<table key={tableid} border='1'><tbody>{row}</tbody></table>);
        return table;
    }
    handleTableChange = (rows, cols, toggles, cells) => {
        this.setState({ tableRowCount: rows, tableColCount: cols, tableToggleValues: toggles, tableCellValues: cells });
    }
    updateTable = () => {
        if (this.state.tableRowCount === '' || this.state.tableColCount === '' || this.state.tableRowCount === 0 || this.state.tableColCount === 0
            || this.state.tableToggleValues === 'undefined' || Object.keys(this.state.tableToggleValues).length <= 0
            || this.state.tableCellValues === 'undefined' || Object.keys(this.state.tableCellValues).length <= 0
        ) {
            this.setState({ error: true });
            return;
        }
        this.state.fieldConfigurationObj.rowcount = this.state.tableRowCount;
        this.state.fieldConfigurationObj.colcount = this.state.tableColCount;
        this.state.fieldConfigurationObj.toggleValues = this.state.tableToggleValues;
        this.state.fieldConfigurationObj.cellValues = this.state.tableCellValues;

        let fieldIdList = this.getTableFieldIds();
        let cellFields = {};
        for (let i = 0; i < this.state.tableRowCount; i++) {
            for (let j = 0; j < this.state.tableColCount; j++) {
                if (this.state.tableToggleValues[i + ',' + j] === true) {
                    cellFields[i + ',' + j] = fieldIdList[this.state.tableCellValues[i + ',' + j]];
                }
            }
        }

        this.state.fieldConfigurationObj['cellFields'] = JSON.stringify(cellFields);

        this.confirmFieldConfiguration(this.state.fieldConfigurationObj);
        this.closeEditTableModal();
    }
    openEditTableModal = (_fieldObj, _fieldIndex) => {
        this.getFields(true);
        this.setState({ tableId: _fieldObj.id, fieldConfigurationObjIndex: _fieldIndex, fieldConfigurationObj: _fieldObj, tableRowCount: _fieldObj.rowcount, tableColCount: _fieldObj.colcount, tableToggleValues: _fieldObj.toggleValues, tableCellValues: _fieldObj.cellValues, error: false, showEditTableModal: true });
    }
    closeEditTableModal = () => {
        this.setState({ showEditTableModal: false });
    }
   
    openSliderModal = () => {

        this.getFields(true);        
        this.setState({ sliderMinValue: '', sliderMaxValue: '', sliderStepValue: '', sliderCurrentValue: '', showSliderModal: true,sliderMode:'new' });
    }
    closeSliderModal = () => {
        this.setState({ showSliderModal: false });
    }
    // 
    insertSlider = (sliderValues) => {
        if (this.state.sliderMode==='new')
        {

            let _slideObj = { dataType: "number", inputType: "Slider" };
            let fillText = (_slideObj) => {
            let _curStepDetails = this.props.isPending ? this.state.siteData.site.pendingPageFieldData : this.state.siteData.site.decisionPageFieldData;
            // _slideObj.id = "Slider_" + generateGUID();
            _slideObj.id = sliderValues['sliderName'].split(" ").join("");
            _slideObj.title = sliderValues['sliderName'];
            _slideObj.minValueType = sliderValues['minValueType'];
            _slideObj.minValue = sliderValues['minValue'];
            _slideObj.minValuefielddetails = sliderValues['minValuefielddetails'];
            _slideObj.minValuefrom = sliderValues['minValuefrom'];
            _slideObj.minToggle = sliderValues['minToggle'];  
            _slideObj.maxValueType = sliderValues['maxValueType'];
            _slideObj.maxValuefielddetails = sliderValues['maxValuefielddetails'];
            _slideObj.maxValue = sliderValues['maxValue'];
            _slideObj.maxToggle = sliderValues['maxToggle'];
            _slideObj.maxValuefrom = sliderValues['maxValuefrom'];            
            _slideObj.stepValueType = sliderValues['stepValueType'];
            _slideObj.stepValue = sliderValues['stepValue'];
            _slideObj.stepToggle = sliderValues['stepToggle'];
            _slideObj.stepValuefrom = sliderValues['stepValuefrom'];
            _slideObj.stepValuefielddetails = sliderValues['stepValuefielddetails'];
            _slideObj.currentValueType = sliderValues['currentValueType'];
            _slideObj.currentValue = sliderValues['currentValue'];
            _slideObj.currentValuefielddetails = sliderValues['currentValuefielddetails'];
            _slideObj.currentToggle = sliderValues['currentToggle'];
            _slideObj.currentValuefrom = sliderValues['currentValuefrom'];
            if (this.state.floatingIndex >= 0) {
                _curStepDetails.splice(this.state.floatingIndex + 1, 0, _slideObj);

            } else {
                _curStepDetails.push(_slideObj);
            }

            this.setState({ askToLeave: true, floatingIndex: -2 });
            }
            fillText(_slideObj);
            this.closeSliderModal();  
        }
    else
    {
        let tempVar = this.state.siteData;
        if (this.props.isPending)
            {
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].currentValue = sliderValues['currentValue'];
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].currentValueType = sliderValues['currentValueType'];
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].currentValuefrom = sliderValues['currentValuefrom'];
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].currentToggle = sliderValues['currentToggle'];
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].currentValuefielddetails = sliderValues['currentValuefielddetails'];

                tempVar.site.pendingPageFieldData[this.state.sliderIndex].minValue = sliderValues['minValue'];
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].minValueType = sliderValues['minValueType'];
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].minValuefrom = sliderValues['minValuefrom'];
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].minToggle = sliderValues['minToggle'];
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].minValuefielddetails = sliderValues['minValuefielddetails'];

                tempVar.site.pendingPageFieldData[this.state.sliderIndex].maxValue = sliderValues['maxValue'];
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].maxValueType = sliderValues['maxValueType'];
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].maxValuefrom = sliderValues['maxValuefrom'];
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].maxToggle = sliderValues['maxToggle'];
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].maxValuefielddetails = sliderValues['maxValuefielddetails'];

                tempVar.site.pendingPageFieldData[this.state.sliderIndex].stepValue = sliderValues['stepValue'];
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].stepValueType = sliderValues['stepValueType'];
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].stepValuefrom = sliderValues['stepValuefrom'];
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].stepToggle = sliderValues['stepToggle'];
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].stepValuefielddetails = sliderValues['stepValuefielddetails'];

                tempVar.site.pendingPageFieldData[this.state.sliderIndex].id = sliderValues['sliderName'].split(" ").join("");
                tempVar.site.pendingPageFieldData[this.state.sliderIndex].title = sliderValues['sliderName'];

            }
        else
            
        {
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].currentValue = sliderValues['currentValue'];
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].currentValueType = sliderValues['currentValueType'];
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].currentValuefrom = sliderValues['currentValuefrom'];
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].currentToggle = sliderValues['currentToggle'];
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].currentValuefielddetails = sliderValues['currentValuefielddetails'];

            tempVar.site.decisionPageFieldData[this.state.sliderIndex].minValue = sliderValues['minValue'];
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].minValueType = sliderValues['minValueType'];
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].minValuefrom = sliderValues['minValuefrom'];
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].minToggle = sliderValues['minToggle'];
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].minValuefielddetails = sliderValues['minValuefielddetails'];

            tempVar.site.decisionPageFieldData[this.state.sliderIndex].maxValue = sliderValues['maxValue'];
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].maxValuefrom = sliderValues['maxValuefrom'];
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].maxValueType = sliderValues['maxValueType'];
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].maxToggle = sliderValues['maxToggle'];
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].maxValuefielddetails = sliderValues['maxValuefielddetails'];

            tempVar.site.decisionPageFieldData[this.state.sliderIndex].stepValue = sliderValues['stepValue'];
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].stepValueType = sliderValues['stepValueType'];
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].stepValuefrom = sliderValues['stepValuefrom'];
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].stepToggle = sliderValues['stepToggle'];
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].stepValuefielddetails = sliderValues['stepValuefielddetails'];

            tempVar.site.decisionPageFieldData[this.state.sliderIndex].id = sliderValues['sliderName'].split(" ").join("");
            tempVar.site.decisionPageFieldData[this.state.sliderIndex].title = sliderValues['sliderName'];
            }
        this.setState({ siteData: tempVar ,showSliderModal:false,sliderId:sliderValues['sliderName'].split(" ").join(""),sliderTitle:sliderValues['sliderName']});
    }
    this.setState({sliderId:sliderValues['sliderName'].split(" ").join(""),sliderTitle:sliderValues['sliderName']});
    //this.closeSliderModal();  
    }
    
    
    handleSliderChange = (event, value, index) => {
        
        let tempVar = this.state.siteData;
        if (this.props.isPending)
            tempVar.site.pendingPageFieldData[index].currentValue = value;
        else
            tempVar.site.decisionPageFieldData[index].currentValue = value;
        this.setState({ siteData: tempVar });
    };

    componentDidUpdate = (prevProps) => {
        if (prevProps.siteData !== this.props.siteData) {
            this.setState({askToLeave: true, siteData: this.props.siteData});
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
            this.setState({askToLeave: true, floatingIndex: -1}, () => this.componentSelected('Text'));
        }
        if (prevProps.showInsertImage !== this.props.showInsertImage) {
            this.setState({askToLeave: true, floatingIndex: -1}, () => this.componentSelected('Image'));
        }
        if(prevProps.invokeSaveSite === false && this.props.invokeSaveSite === true){
            this.saveSite(true);
        }
    }
    
    componentDidMount = () => {

    }
    getFields = (_force) => {
        dataShare.getFieldList(_force, (error, response) => {
            if (error) {
                this.props.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
                return;
            }
            this.setState({ fields: response });
        });
    }
    getTableFieldIds = () => {
        var arrOptions = [];
        dataShare.getFieldList(false, (error, res) => {
            if (error) {
                console.log(error);
                return;
            }

            res.forEach(element => {
                if (element.options.readonly)
                    arrOptions[element.options.id] = { id: element.id, label: element.options.id, xpath: element.options.xPath, inputType: element.options.inputType, dataType: element.options.dataType, displayFormat: element.options.displayFormat };
            });
        });
        return arrOptions;
    }
    getFieldIds = () => {
        var arrOptions = [];
        dataShare.getFieldList(false, (error, res) => {
            if (error) {
                console.log(error);
                return;
            }
            res.forEach(element => {
                if (element.options.readonly)
                    arrOptions.push({ id: element.id, label: element.options.id, xpath: element.options.xPath, inputType: element.options.inputType, dataType: element.options.dataType, displayFormat: element.options.displayFormat });
            });
        });
        return arrOptions;
    }
    emptyPage = () => {
        return (
            <div className="AP-emptyWrapper">
                <img src={require('../../../../assets/img/empty-component.png')} alt="Empty" width="200px"/>
                <h3 className="AP-emptyHeader">Looks like you have an empty page!</h3>
                <p className="AP-emptyDesc">
                    Add a component below or using the left side bar to get started building this step
                </p>
            </div>
        );
    }

   
    addComponentCnt = () => {
        return (
            <div className="DP-addNewComponent">
                <span className="DP-addNewLine"></span>
                <span className="DP-addNewIcon" onClick={this.openSelectComponent}>
                    <i className="material-icons appSecondaryClr">add_circle</i>
                </span>
            </div>
        );
    }
    
    removeField = (_index) => {        
        this.setState({askToLeave: true,deleteFieldIndex: _index, showDeleteConfirmation: true});
    }
    confirmDelete = () => {
        if (this.props.isPending) {
            delete this.state.siteData.site.pendingPageFieldData[this.state.deleteFieldIndex];
            this.state.siteData.site.pendingPageFieldData.splice(this.state.deleteFieldIndex, 1);
        }
        else {
            delete this.state.siteData.site.decisionPageFieldData[this.state.deleteFieldIndex];
            this.state.siteData.site.decisionPageFieldData.splice(this.state.deleteFieldIndex, 1);
        }
        this.setState({ askToLeave: true, showDeleteConfirmation: false });
    }
    emptyDecisionPage = () => {
        if (this.props.isPending) {
            delete this.state.siteData.site.pendingPageFieldData[this.state.deleteFieldIndex];
            this.state.siteData.site.pendingPageFieldData.splice(this.state.deleteFieldIndex, 1);
        }
        else {
            delete this.state.siteData.site.decisionPageFieldData[this.state.deleteFieldIndex];
            this.state.siteData.site.decisionPageFieldData.splice(this.state.deleteFieldIndex, 1);
        }
        this.setState({ showDeleteConfirmation: false });
    }

    fieldsDragCompleted = (updatedValue) =>{
        let tempVar = this.state.siteData;
        if (this.props.isPending) {
            tempVar.site.pendingPageFieldData = [];
               this.setState({siteData: tempVar}, () => {
                   tempVar.site.pendingPageFieldData = updatedValue;
                    this.setState({askToLeave: true, siteData: tempVar});
               });
        }
        else {
            tempVar.site.decisionPageFieldData = [];
            this.setState({ siteData: tempVar }, () => {
                tempVar.site.decisionPageFieldData = updatedValue;
                this.setState({ askToLeave: true, siteData: tempVar });
            });
        }
               return;
    }
    
    convertDraftObj = () => {
        if (this.props.isPending) {
            for (let i = 0; i < this.props.siteData.site.pendingPageFieldData.length; i++) {
                if (this.props.siteData.site.pendingPageFieldData[i].inputType === "Text Area") {
                    try {
                        if (typeof this.props.siteData.site.pendingPageFieldData[i].decisionText !== 'object') this.props.siteData.site.pendingPageFieldData[i].decisionText = rawToDraft(this.props.siteData.site.pendingPageFieldData[i].decisionText);
                    } catch (e) {
                        this.props.siteData.site.pendingPageFieldData[i].decisionText = "";
                        console.warn(e);
                    }
                }
            }
        }
        else {
            for(let i = 0; i < this.props.siteData.site.decisionPageFieldData.length; i++){
            if(this.props.siteData.site.decisionPageFieldData[i].inputType === "Text Area"){
                try {
                    if (typeof this.props.siteData.site.decisionPageFieldData[i].decisionText !== 'object') this.props.siteData.site.decisionPageFieldData[i].decisionText = rawToDraft(this.props.siteData.site.decisionPageFieldData[i].decisionText);
                } catch (e) {
                    this.props.siteData.site.decisionPageFieldData[i].decisionText = "";
                    console.warn(e);
                      }
                }
            }
        }
    }
    getDraftContent = (data) => {
        try{
            draftToRaw(data.decisionText);
            return data.decisionText;
        }catch(error){
            console.warn(error);
            try{
                return rawToDraft(data.decisionText ? data.decisionText : '');
            }catch(e){
                return rawToDraft('');
                console.warn(e);
            }
        }
        /*if(typeof data.decisionText === 'object') return data.decisionText;
        try{
            return rawToDraft(data.decisionText ? data.decisionText : '');
        }catch(e){
            return rawToDraft('');
            console.warn(e);
        }*/
    }
    onInputChange = (editorState, index) => {  
        let _tempVar = null;
        if (this.props.isPending) {
            _tempVar = this.state.siteData.site.pendingPageFieldData;
        }
        else {
            _tempVar = this.state.siteData.site.decisionPageFieldData;
        }
        _tempVar[index].decisionText = editorState;
        this.setState(_tempVar, () => this.setState({askToLeave: true}));
    }
    getButtonId() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    saveBtnConfiguration = (btn) => {
        btn.id = this.getButtonId();
        let tempVar = this.state.siteData;
        if(this.props.isPending){
            if(this.state.buttonEditMode){
                tempVar.site.pendingPageFieldData[this.state.fieldConfigurationObjIndex] = btn;
            }
            else{

                if(this.state.floatingIndex >= 0 && !btn.action === "Submit to LOS"){

                    tempVar.site.pendingPageFieldData.splice(this.state.floatingIndex+1, 0, btn);

                }else {
                    tempVar.site.pendingPageFieldData.push(btn);
                }
            }
        }
        else{ 
            if(this.state.buttonEditMode){
                tempVar.site.decisionPageFieldData[this.state.fieldConfigurationObjIndex] = btn;
            }
            else{

                if(this.state.floatingIndex >= 0 && !btn.action === "Submit to LOS"){

                    tempVar.site.decisionPageFieldData.splice(this.state.floatingIndex+1, 0, btn);

                }else {
                    tempVar.site.decisionPageFieldData.push(btn);
                }
            }
        }
        this.setState({askToLeave: true,floatingIndex: -2, showButtonConfig: false, siteData: tempVar, buttonEditMode:false, buttonConfigurationObj:{title:"",action:"",routeUrl:""}});
    }

   // saveSite = () => {
    saveSite = (isPublishInvoke=false) => {

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
        let fieldIdList = this.getFieldIds();
        for(let i = 0; i < this.state.siteData.site.decisionPageFieldData.length; i++){
            if(this.state.siteData.site.decisionPageFieldData[i].inputType === "Text Area"){
                try{
                    _siteData.site.decisionPageFieldData[i].decisionText = draftToRaw(this.state.siteData.site.decisionPageFieldData[i].decisionText);
                    var decisionTextFields = [];
                    let decisionTextId = _siteData.site.decisionPageFieldData[i].decisionText;
                    for (let j = 0; j < fieldIdList.length; j++) {
                        decisionTextId = decisionTextId.replace("{{" + fieldIdList[j].label + "}}", "{{" + fieldIdList[j].id + "}}");
                        if (decisionTextId.indexOf(fieldIdList[j].id) !== -1) {
                            decisionTextFields.push(fieldIdList[j]);
                        }
                    }
                    _siteData.site.decisionPageFieldData[i].decisionTextId = decisionTextId;
                    _siteData.site.decisionPageFieldData[i].decisionTextFields = JSON.stringify(decisionTextFields);

                }catch (e){
                    console.warn(e);
                }
            }
        }
        for (let i = 0; i < this.state.siteData.site.pendingPageFieldData.length; i++) {
            if (this.state.siteData.site.pendingPageFieldData[i].inputType === "Text Area") {
                try {
                    _siteData.site.pendingPageFieldData[i].decisionText = draftToRaw(this.state.siteData.site.pendingPageFieldData[i].decisionText);
                    var decisionTextFields = [];
                    let decisionTextId = _siteData.site.pendingPageFieldData[i].decisionText;
                    for (let j = 0; j < fieldIdList.length; j++) {
                        decisionTextId = decisionTextId.replace("{{" + fieldIdList[j].label + "}}", "{{" + fieldIdList[j].id + "}}");
                        if (decisionTextId.indexOf(fieldIdList[j].id) !== -1) {
                            decisionTextFields.push(fieldIdList[j]);
                        }
                    }
                    _siteData.site.pendingPageFieldData[i].decisionTextId = decisionTextId;
                    _siteData.site.pendingPageFieldData[i].decisionTextFields = JSON.stringify(decisionTextFields);

                } catch (e) {
                    console.warn(e);
                }
            }
        }
        document.dispatchEvent(new CustomEvent("showAppLoader"));
        axios.post(config.API_BASE_URL + 'Sites', _siteData).then((response) => {
            if (response.status !== 200) {
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
                this.setState({askToLeave: false});
            }
           // this.props.showNotification('success', 'Information saved successfully.');
           
        }, (error) => {
            this.props.showNotification('error', 'Internal server error while saving information, please try after sometime.');
        }).finally(() => {
            document.dispatchEvent(new CustomEvent("hideAppLoader"));
        });
    }
    
    updateHTMLValue = (event, rowID) => {
        let tempVar = this.state.siteData;
        if (this.props.isPending)
            tempVar.site.pendingPageFieldData[rowID].text = event.target.value;
        else
            tempVar.site.decisionPageFieldData[rowID].text = event.target.value;
        this.setState({askToLeave: true, siteData: tempVar});
    }
   
    fieldSelected = (fieldObj) => {
        let _fieldObj = {};
        let fillField = (_fieldObj) => {
            let _curStepDetails = this.props.isPending ? this.state.siteData.site.pendingPageFieldData : this.state.siteData.site.decisionPageFieldData

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
            
            if(this.state.floatingIndex >= 0){
                _curStepDetails.splice(this.state.floatingIndex+1, 0, _fieldObj);

            }else {
                _curStepDetails.push(_fieldObj);
            }
            this.setState({floatingIndex: -2});
            /*setTimeout(() => this.configureField(_fieldObj, _curStepDetails.fields.length-1), 300);*/
        }
        dataShare.getFieldById(fieldObj.id, (error, data) => {
            if(error !== null){
                this.props.showNotification('error', 'Internal server error while fetching dropdown information, please try after sometime.');
                return;
            }
            _fieldObj = JSON.parse(JSON.stringify(data.options));           
                fillField(_fieldObj);
           
        });
    }
    render() {
        return (
            <div className={this.props.parentClass} style={{ "textAlign": "center" }}>  
            
                <FieldConfiguration fieldType={this.state.configureFieldType} showFieldConfiguration={this.state.showFieldConfiguration} configurationData={this.state.fieldConfigurationObj} closeFieldConfiguration={() => this.setState({showFieldConfiguration: false})} confirmFieldConfiguration={this.confirmFieldConfiguration} />
            
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
                <ButtonConfiguration showFieldConfiguration={this.state.showButtonConfig} closeBtnConfig={() => this.setState({ showButtonConfig: false, buttonConfigurationObj:{title:"",action:"",routeUrl:""}})} saveBtnConfiguration={this.saveBtnConfiguration} configurationData={this.state.buttonConfigurationObj} />
                <SelectComponentModal showModal={this.state.showSelectComponent} openModal={this.openSelectComponent} closeModal={this.closeSelectComponent} cancelModal={this.cancelSelectComponentWithout} componentSelected={this.componentSelected} showButton={true} showSlider={true} showTable={true}  />
                <SelectImageModal showChooseImageModal={this.state.showChooseImage} showChooseImageCloseModal={() => this.setState({ showChooseImage: false })} insertImage={this.insertImage} SelectedImage={this.SelectedImage} />
                <SelectSliderModal showNotification={this.props.showNotification} fieldList={this.state.fields} 
                sliderMinValue={this.state.sliderMinValue} sliderMinToggle={this.state.sliderMinToggle} sliderMinValueFrom={this.state.sliderMinValueFrom} sliderMinValueType={this.state.sliderMinValueType} 
                sliderMaxValue={this.state.sliderMaxValue} sliderMaxToggle={this.state.sliderMaxToggle} sliderMaxValueFrom={this.state.sliderMaxValueFrom} sliderMaxValueType={this.state.sliderMaxValueType}  
                 sliderStepValue={this.state.sliderStepValue} sliderStepToggle={this.state.sliderStepToggle} sliderStepValueFrom={this.state.sliderStepValueFrom} sliderStepValueType={this.state.sliderStepValueType} 
                 sliderCurrentValue={this.state.sliderCurrentValue} sliderCurrentToggle={this.state.sliderCurrentToggle} sliderCurrentValueFrom={this.state.sliderCurrentValueFrom} sliderCurrentValueType={this.state.sliderCurrentValueType} 
                 showModal={this.state.showSliderModal} openModal={this.openSliderModal} closeModal={this.closeSliderModal} insertSlider={this.insertSlider} sliderMode={this.state.sliderMode} sliderName={this.state.sliderId} sliderTitle={this.state.sliderTitle}
                 />               
                  <SelectTableModal fieldList={this.state.fields} showModal={this.state.showTableModal} openModal={this.openTableModal} closeModal={this.closeTableModal} insertTable={this.insertTable} />
                
                <EditTableModal rowcount={this.state.tableRowCount} colcount={this.state.tableColCount} toggles={this.state.tableToggleValues} cells={this.state.tableCellValues} tableId={this.state.tableId}
                    fields={this.state.fields} showModal={this.state.showEditTableModal} closeModal={this.closeEditTableModal} updateTable={this.updateTable} handleTableChange={this.handleTableChange} />
                <DeleteFieldConfirmation showDeleteConfirmation={this.state.showDeleteConfirmation} closeDeleteConfirmation={() => this.setState({ showDeleteConfirmation: false })} confirmDelete={this.confirmDelete} />
                <AddFieldsModal siteData={this.state.siteData} showModal={this.props.showInsertField} closeModal={this.props.closeInsertField} fieldSelected={this.fieldSelected} showNotification={this.props.showNotification} selectedPage={this.props.selectedPage}/>

                <div className="componentsWrapperFullWidth">
                {       
                        this.props.isPending ? this.state.siteData.site.pendingPageFieldData.length === 0 && this.emptyPage() : this.state.siteData.site.decisionPageFieldData.length === 0 && this.emptyPage()
                }
                <Grid container spacing={0} className="fieldListWrapper withoutSteps">                    
                    <ReactDragList 
                        className="insertedFields"
                        handles={false}
                            dataSource={this.props.isPending ? this.state.siteData.site.pendingPageFieldData : this.state.siteData.site.decisionPageFieldData}
                        row={(data, index) => {
                            
                            return (
                                <Grid item xs={12} key={index} className="fieldListCnt" >                                    
                                    {
                                        data.inputType === "Text Area" && 
                                        <Draft style={{ marginTop: "50px", maxHeight: "100px" }}
                                            editorState={this.getDraftContent(data)} 
                                            onEditorStateChange={(editorState) => this.onInputChange(editorState, index) }
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
                                            toolbarCustomButtons={[<CustomOption />]}
                                        />
                                    }
                                    {
                                        data.inputType === "Slider" && 
                                        <div>
                                            <div  className="sliderlbl">{data.title}</div>
                                            <CustomSlider minValue={parseFloat(data.minValue)} maxValue={parseFloat(data.maxValue)} currentValue={parseFloat(data.currentValue)} step={parseFloat(data.stepvalue)} disable={true} sliderChanged={(newValue) => console.log(newValue)} />
                                        
                                         </div>
                                    }
                                    {
                                        data.inputType === "Table" &&
                                        <div>
                                            {this.displayTable(data.rowcount, data.colcount, data.toggleValues, data.cellValues, data.id)}
                                        </div>
                                    }
                                    {
                                        data.inputType === "HTML Area" && 
                                        <TextField
                                          label="HTML Area"
                                          name={data.id}
                                          multiline
                                          rows="6"
                                          value={data.text}
                                          onChange={(event) => {this.updateHTMLValue(event, index);}}
                                          margin="normal"
                                          variant="outlined"
                                            fullWidth
                                        />
                                    }
                                    {
                                        data.inputType === "Button" &&
                                        <Button className="clearTextTransform" variant="contained" style={{ color: 'white', backgroundColor: this.state.siteData.site.settings.defaultPrimary }}>{data.title}</Button>
                                    }
                                    {
                                        data.inputType === "Image" && 
                                        <div className="imgCnt"><img  src={data.imgSelected !== "" ? data.imgSelected :""} alt="Logo" /></div>
                                        
                                    }
                                    {
                                        data.inputType === "Checkbox" && 
                                        <div className="checkboxCnt">
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
                                        </div>
                                    }
                                    <span className="fieldListActionCnt">
                                        {
                                            data.inputType === "Table" &&
                                            <i className="material-icons update appSecondaryClr" onClick={this.openEditTableModal.bind(null, data, index)} title="Edit Table">edit</i>
                                        }
                                        {
                                            data.inputType === "Slider" &&
                                            <i className="material-icons update appSecondaryClr" onClick={this.openEditSliderModal.bind(null, data, index)} title="Edit Slider">edit</i>
                                        }
                                        <i className="material-icons delete" onClick={this.removeField.bind(null, index)} title="Delete">delete</i>
                                        <i className="material-icons edit" onClick={this.configureField.bind(null, data, index)} title="Configuration" >settings</i>

                                        {/* {
                                            (data.inputType === "Image") && 
                                            <i className="material-icons edit" onClick={this.configureField.bind(null, data, index)} title="Configuration" >settings</i>
                                        }
                                        {
                                            (data.inputType === "Checkbox") && 
                                            <i className="material-icons edit" onClick={this.configureField.bind(null, data, index)} title="Configuration" >settings</i>
                                        } */}
                                        
                                    </span>
                                    <span className="insertFieldCnt-floating">
                                        <div className="AP-addNewComponent">
                                            <span className="AP-addNewLine"></span>
                                            <span className="AP-addNewIcon" onClick={() => this.openSelectComponent(null, index)}>
                                                <i className="material-icons appSecondaryClr">add_circle</i>
                                            </span>
                                        </div>
                                    </span>
                                </Grid>
                                )
                        }} 
                        onUpdate={(event, updated) => {this.fieldsDragCompleted(updated);}}
                        ghostClass="dragGhostClass"
                    />
                </Grid>
                {this.addComponentCnt()}
                                                                  
                <Tooltip title="Click to save changes" placement="top" TransitionComponent={Zoom}>
                    <Button variant="fab" onClick={()=>this.saveSite(false)} className="saveFabFieldBtn">
                      <i className="material-icons">save</i>
                    </Button>
                </Tooltip>
                </div>
            </div>
        )
    }
}

export default compose(withWidth())(PlaygroundWithoutStepsComponent);
