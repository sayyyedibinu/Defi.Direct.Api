import React from "react";
import {BrowserRouter as Router, Route, Link, Prompt, Redirect} from "react-router-dom";
/*import Modal from '@material-ui/core/Modal';*/
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
/*import InputLabel from '@material-ui/core/InputLabel';*/
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import generateGUID from "../../Common/generateGUID";
import Autocomplete from "react-autocomplete";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import config from "../../../resources/config.json";
import dataShare from "../../Common/dataShare";
import './RulePageStyle.css';

const Switch_Theme = createMuiTheme({
   palette: {
       primary: {main: config.defaultSecondaryClr}
   }
});
let defaultStructure = JSON.stringify({
    operator: "AND",
    ruleGroupOperator: "",
    criteria: [
        {
            c1: "Select Criteria Field",
            c1ID: "",
            c2: "equalto",
            c3: "Select Criteria Field",
            c3Details: "field",
            c3ID: "",
            subGroup: []
        }
    ]
});
export default class RulePageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {id: this.props.match.params.id, componentMode: this.props.match.params.mode, anchorEl_condition: null, anchorEl_group: null, anchor_group_obj: {}, anchorEl_subGroup: null, anchor_subGroup_obj: {}, fieldsList: [], dropdownList: [], ruleName: "", ruleDetail: {desc: []}, level1Operator: "", field1: "Select Criteria Field", field2: "isEmpty", field3: "Select Criteria Field", activeRuleRHS: "field", random: 0, askToLeave: false};
    }
    
    handleDataChange = () => {
        this.setState({askToLeave: true});
    }
    
    componentWillMount = () => {
        if(this.state.componentMode === "update") this.getRule(this.state.id);
        else this.setDefaultRuleObj();
    }
    
    componentDidMount = () => {
        dataShare.getFieldList(false, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching fields, please try after sometime.');
                return;
            }
            if(response.length > 0){
                let fieldList = response.filter((_field) => {
                    _field.options.valueForRule = this.getFieldID(_field);
                    if(_field.options) return _field.options.isActive === true;
                    else return false;
                })
                this.setState({fieldsList: fieldList});
            }
            
        } );
    }
    getRule = (id) => {
        dataShare.getRuleByID(id, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching rule information, please try after sometime.');
                return;
            }
            console.log(response.ruleDetail);
            this.setState({ruleName: response.ruleName, ruleDetail: response.ruleDetail});
        } );
    }
    toggleStatus = () => {
        this.handleDataChange();
        let _ruleDetail = this.state.ruleDetail;
        _ruleDetail.isActive = !_ruleDetail.isActive;
        console.log(_ruleDetail.isActive);
        this.setState({ruleDetail: _ruleDetail});
    }
    getLevel1Operator = () => {
        if(this.state.ruleDetail.desc.length < 2) return "";
        return this.state.ruleDetail.desc[1].operator;
    }
    
    getLevel2Operator = (_obj) => {
        return _obj.ruleGroupOperator;
        /*try{
            if(this.state.ruleDetail.desc[index].criteria.length < 2) return "";
            return this.state.ruleDetail.desc[index].ruleGroupOperator;
        }catch(e){
            return "";
        }*/
    }
    
    setDefaultRuleObj = () => {
        let _ruleDetail = {
            isActive: true,
            desc: []
        };
        _ruleDetail.desc.push(JSON.parse(defaultStructure));
        this.setState({ruleName: "", ruleDetail: _ruleDetail});    
    }
    
    
    
    addCondition = (operator) => {
        let _ruleDetails = this.state.ruleDetail;
        _ruleDetails.desc.push({
            operator: (this.getLevel1Operator() === "" ? "AND" : this.getLevel1Operator()),
            ruleGroupOperator: "",
            criteria: [
                {
                    c1: "Select Criteria Field",
                    c1ID: "",
                    c2: "isEmpty",
                    c3: "Select Criteria Field",
                    c3Details: "field",
                    c3ID: "",
                    subGroup: []
                }
            ]
        });
        this.setState({
            ruleDetail: _ruleDetails
        });
        this.handleDataChange();
    }
    
    addGroup = (_obj) => {
        /*index, operator*/
        /*let _ruleDetails = this.state.ruleDetail;
        _ruleDetails.desc[index].ruleGroupOperator = (this.getLevel2Operator(index) === "" ? "AND" : this.getLevel2Operator(index));
        _ruleDetails.desc[index].criteria.push({
            c1: "Select Criteria Field",
            c2: "isEmpty",
            c3: "Select Criteria Field",
            c3Details: "field",
            subGroup: []
        });*/
        
        _obj.ruleGroupOperator = _obj.ruleGroupOperator === "" ? "AND" : _obj.ruleGroupOperator;
        _obj.criteria.push({
            c1: "Select Criteria Field",
            c1ID: "",
            c2: "isEmpty",
            c3: "Select Criteria Field",
            c3Details: "field",
            c3ID: "",
            subGroup: []
        });
        this.setState({
            ruleDetail: this.state.ruleDetail
        });
        this.handleDataChange();
    }
    
    addSubGroup = (_obj) => {
        let _subGroup = JSON.parse(defaultStructure);
        _subGroup.ruleGroupOperator = _obj.ruleGroupOperator === "" ? "AND" : _obj.ruleGroupOperator;
        /*console.log(_obj.criteria[_obj.criteria.length-1], _subGroup);*/
        _obj.criteria[_obj.criteria.length-1].subGroup.push(_subGroup);
        this.setState({ruleDetail: this.state.ruleDetail});
        this.handleDataChange();
    }
    changeRHS = (_details, _obj, _index) => {
        /*let _ruleDetails = this.state.ruleDetail;*/
        _obj.criteria[_index].c3Details = _details;
        _obj.criteria[_index].c3ValidaField = false;
        if(_details === "field") _obj.criteria[_index].c3 = "Select Criteria Field";
        else if(_details === "static") _obj.criteria[_index].c3 = 0;
        else  _obj.criteria[_index].c3 = "";
        this.setState({ruleDetail: this.state.ruleDetail});
        this.handleDataChange();
    }
    inputOnChangeForTextNumber = (event, _obj, _index) => {
        /*let _ruleDetails = this.state.ruleDetail;*/
        _obj.criteria[_index][event.target.name] = event.target.value;
        _obj.criteria[_index].c3ValidaField = false;
        this.setState({ruleDetail: this.state.ruleDetail});
        this.handleDataChange();
    }
    inputOnChange = (event, _obj, _index) => {
        this.handleDataChange();
        if(event.target.name === "ruleName"){
            this.setState({ruleName: event.target.value});
            return;
        }
        /*let _ruleDetails = this.state.ruleDetail;*/
        
        if(event.target.name === "c1"){
            
            let _value = event.target.value.split('***DIRECT***');
            if(_value.length === 2) _obj.criteria[_index].c1ID = _value[1];
            event.target.value = _value[0];
            
           let _fieldObj = this.getFieldObj(event.target.value);
            if(_fieldObj.dataType === "string" && (_fieldObj.inputType === "Text Input" || _fieldObj.inputType === "Dropdown" || _fieldObj.inputType === "Listbox")){
                _obj.criteria[_index].c2 = "isEmpty";
                _obj.criteria[_index].c3Details = "staticString";
                _obj.criteria[_index].c3 = "";
                _obj.criteria[_index].c3ID = "";
            }
            if(_fieldObj.dataType === "boolean"){
                _obj.criteria[_index].c2 = "equalto";
                _obj.criteria[_index].c3Details = "staticString";
                _obj.criteria[_index].c3 = "true";
                _obj.criteria[_index].c3ID = "";
            }
            if(_fieldObj.dataType === "number" || _fieldObj.dataType === "date"){
                _obj.criteria[_index].c2 = "equalto";
                _obj.criteria[_index].c3Details = "field";
                _obj.criteria[_index].c3 = "Select Criteria Field";
                _obj.criteria[_index].c3ValidaField = false;
                _obj.criteria[_index].c3ID = "";
            }
            _obj.criteria[_index].c1ValidaField = event.target.fromOnSelect;
        }
           
        if(event.target.name === "c2" && (event.target.value === "isEmpty" || event.target.value === "isNotEmpty" || event.target.value === "isActive" || event.target.value === "isInActive")){
            _obj.criteria[_index].c3Details = "staticString";
            if(event.target.value === "isActive")
                _obj.criteria[_index].c3 = "Active";
            else if(event.target.value === "isInActive")
                _obj.criteria[_index].c3 = "InActive";
            _obj.criteria[_index].c3 = "";
            _obj.criteria[_index].c3ID = "";
        }else{
            _obj.criteria[_index].c3Details = "field";
            _obj.criteria[_index].c3 = "Select Criteria Field";
            _obj.criteria[_index].c3ValidaField = false;
            _obj.criteria[_index].c3ID = "";
        }
        
        let _parsedValue = [];
        if(Object.prototype.toString.call(event.target.value) === "[object String]"){
            _parsedValue = event.target.value.split('***DIRECT***');
            event.target.value = _parsedValue[0];
        }
        
        _obj.criteria[_index][event.target.name] = event.target.value;
        
        if(event.target.name === "c3" && _obj.criteria[_index].c3Details === "field"){
            _obj.criteria[_index].c3ValidaField = event.target.fromOnSelect;
            if(_parsedValue.length === 2) _obj.criteria[_index].c3ID = _parsedValue[1];
            else _obj.criteria[_index].c3ID = "";
        }else if(event.target.name === "c3" && _obj.criteria[_index].c3Details !== "field"){
            _obj.criteria[_index].c3ValidaField = false;
        }
        /*if(event.target.name === "c1" || event.target.name === "c3"){
            console.log(_obj.criteria[_index])
        }*/
        this.setState({ruleDetail: this.state.ruleDetail});
    }
    toggeleStatus = () => {
        let _tempVar = this.state.ruleDetail;
        _tempVar.isActive = !_tempVar.isActive;
        this.setState(_tempVar);
        this.handleDataChange();
    }
    
    validateRuleDesc = (_desc) => {
        for(let i = 0; i < _desc.length; i++){
            for(let j = 0; j < _desc[i].criteria.length; j++){
                if(_desc[i].criteria[j].c1 === "Select Criteria Field"){
                    return 'Please select field';
                }
                if(_desc[i].criteria[j].c1ValidaField === false){
                    return 'Invalid field '+_desc[i].criteria[j].c1;
                }
                if((_desc[i].criteria[j].c2 !== "isEmpty" && _desc[i].criteria[j].c2 !== "isNotEmpty" && _desc[i].criteria[j].c2 !== "isActive" && _desc[i].criteria[j].c2 !== "isInActive") && _desc[i].criteria[j].c3Details === "field" && this.state.ruleDetail.desc[i].criteria[j].c3 === "Select Criteria Field"){
                    return 'Please select field';
                }
                if((_desc[i].criteria[j].c2 !== "isEmpty" && _desc[i].criteria[j].c2 !== "isNotEmpty" && _desc[i].criteria[j].c2 !== "isActive" && _desc[i].criteria[j].c2 !== "isInActive") && _desc[i].criteria[j].c3Details === "field" && _desc[i].criteria[j].c3ValidaField === false){
                    return 'Invalid field '+_desc[i].criteria[j].c3;
                }
                /*if(_desc[i].criteria[j].subGroup.length > 0){
                    if(this.validateRuleDesc(_desc[i].criteria[j].subGroup) === false) return false;
                }else if(i+1 === _desc.length) return true;*/
            }
        }
        return true;
    }
    saveField = () => {
        if(this.state.ruleName === ''){
            this.props.showNotification('warning', 'Enter Rule Name.');
            return;
        }
        let validationResult = this.validateRuleDesc(this.state.ruleDetail.desc)
        if(validationResult !== true){
            this.props.showNotification('warning', validationResult);
            return;
        }
        let data = {
            id: (this.state.componentMode === "update" ? this.state.id : generateGUID()),
            ruleName: this.state.ruleName,
            ruleDetail: this.state.ruleDetail
        }
        dataShare.updateRule(data, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching saving rule information, please try after sometime.');
                return;
            }
            
            if(this.state.componentMode !== "update"){
                this.props.showNotification('success', 'New Rule Created Successfully.');
                this.props.history.push('/main/rules');
            }else{
                this.setState({askToLeave: false});
                this.props.showNotification('success', 'Rule Updated Successfully.');
            }
        } )
    }
    
    /*START: Condition related operator selection*/
    handleConditionMenuClick = (event) => {
        this.setState({ anchorEl_condition: event.currentTarget });
    };

    handleConditionMenuItemClick = (event, selected) => {
        let _ruleDetails = this.state.ruleDetail;
        for(let i = 1; i < _ruleDetails.desc.length; i++){
            _ruleDetails.desc[i].operator = selected;
        }
        this.setState({ ruleDetail: _ruleDetails, anchorEl_condition: null });
        this.handleDataChange();
    }
    handleConditionMenuClose = () => {
        this.setState({ anchorEl_condition: null });
    };
    /*END: Condition related operator selection*/

    /*START: Group related operator selection*/
    handleGroupMenuClick = (event, _obj) => {
        this.setState({ anchorEl_group: event.currentTarget, anchor_group_obj: _obj });
    };

    handleGroupMenuItemClick = (event, _obj, selected) => {
        /*let _ruleDetails = this.state.ruleDetail;*/
        _obj.ruleGroupOperator = selected;
        this.setState({ ruleDetail: this.state.ruleDetail, anchorEl_group: null}, () => {
            this.setState({anchor_group_obj: {}});
            this.handleDataChange();
        });
    }
    handleGroupMenuClose = () => {
        this.setState({ anchorEl_group: null, anchor_group_obj: {}});
    };
    /*END: Group related operator selection*/

    /*START: SubGroup related operator selection*/
    handleSubGroupMenuClick = (event, _obj) => {
        this.setState({ anchorEl_subGroup: event.currentTarget, anchor_subGroup_obj: _obj });
    };

    handleSubGroupMenuItemClick = (event, _obj, selected) => {
        try{
            _obj.map((subGroup) => {
                subGroup.ruleGroupOperator = selected;
                return subGroup;
            })
        }catch(e){
            console.warn(e);
        }
        
        this.setState({ ruleDetail: this.state.ruleDetail, anchorEl_subGroup: null}, () => {
            this.setState({anchor_subGroup_obj: {}});
            this.handleDataChange();
        });
    }
    handleSubGroupMenuClose = () => {
        this.setState({ anchorEl_subGroup: null, anchor_subGroup_obj: {}});
    };
    /*END: SubGroup related operator selection*/

    removeCriteria = (_obj, index) => {
        /*let _ruleDetail = this.state.ruleDetail;*/
        _obj.criteria.splice(index, 1);
        this.setState({ruleDetail: this.state.ruleDetail});
        this.handleDataChange();
    };

    removeRule = (rowIndex) => {
        let _ruleDetail = this.state.ruleDetail;
        _ruleDetail.desc.splice(rowIndex, 1);
        this.setState({ruleDetail: _ruleDetail});
        this.handleDataChange();
    };

    getFieldID = (_field) => {
        /*console.log(_field.id);*/
        if(_field.options.readonly === true && _field.options.xPath !== "")
            return (_field.options.xPath.replace(new RegExp('/', 'g'), '.'));
        else return _field.options.id;
    }
    getFieldObj = (_fieldID, _id) => {
        if(_fieldID === "Select Criteria Field") return {};
        for(let i = 0; i < this.state.fieldsList.length; i++){
            if(this.state.fieldsList[i].id === _id) return this.state.fieldsList[i].options;
            if(this.state.fieldsList[i].options.valueForRule === _fieldID) return this.state.fieldsList[i].options;
        }
        return {dataType: "string", inputType: "Text Input", title: _fieldID};
    }
    getOperator = (_obj) => {
        let _fieldObj = this.getFieldObj(_obj.c1);
        this.getRHSDetails(_obj, _fieldObj);
        let _operators = [];
        if(_fieldObj.dataType === "string" && (_fieldObj.inputType === "Text Input" || _fieldObj.inputType === "Dropdown" || _fieldObj.inputType === "Listbox")){
            _operators.push({value: "isEmpty", label: "is Empty"});
            _operators.push({value: "isNotEmpty", label: "is Not Empty"});
            _operators.push({value: "equalto", label: "Equal to"});
            _operators.push({value: "notEqualTo", label: "Not Equal to"});
        }
        if(_fieldObj.dataType === "boolean"){
            _operators.push({value: "equalto", label: "Equal to"});
            /*_operators.push({value: "isActive", label: "is Active"});
            _operators.push({value: "isInActive", label: "is InActive"});*/
        }
        if(_fieldObj.dataType === "number" || _fieldObj.dataType === "date"){
            _operators.push({value: "equalto", label: "Equal to"});
            _operators.push({value: "notEqualTo", label: "Not Equal to"});
            
            _operators.push({value: "isGreaterThan", label: "is greater than"});
            _operators.push({value: "isgreaterThanOrEqualTo", label: "is greater than or equal to"});
            _operators.push({value: "isLessThan", label: "is less than"});
            _operators.push({value: "isLessThanOrEqualTo", label: "is less than or equal to"});
        }
        return _operators;
        /*
        return (
            <MenuItem value="isEmpty">is Empty</MenuItem>
            <MenuItem value="isNotEmpty">is Not Empty</MenuItem>
            <MenuItem value="isActive">is Active</MenuItem>
            <MenuItem value="isInActive">is InActive</MenuItem>
            <MenuItem value="equalto">Equal to</MenuItem>
            <MenuItem value="notEqualTo">Not Equal to</MenuItem>
            <MenuItem value="isGreaterThan">is greater than</MenuItem>
            <MenuItem value="isgreaterThanOrEqualTo">is greater than or equal to</MenuItem>
            <MenuItem value="isLessThan">is less than</MenuItem>
            <MenuItem value="isLessThanOrEqualTo">is less than or equal to</MenuItem>
           );
           */
    }
    getRHSDetails = (_obj, _fieldObj) => {
        if((_fieldObj.inputType === "Dropdown" || _fieldObj.inputType === "Listbox") && !this.state.dropdownList[_obj.c1]){ 
            dataShare.getDropdownListsById(_fieldObj.fieldListId, (error, response) => {
                if(error){
                    this.props.showNotification('error', 'Internal server error while fetching fields, please try after sometime.');
                    return;
                }
                let dropdownList = this.state.dropdownList;
                dropdownList[_obj.c1] = response.fieldListItems;
                /*console.log(response.fieldListItems);*/
                this.setState({dropdownList: dropdownList});
            });
        }
        if(_fieldObj.dataType === "boolean" && !this.state.dropdownList[_obj.c1]){ 
            let dropdownList = this.state.dropdownList;
            dropdownList[_obj.c1] = [{
                value: true,
                display: "Yes"
            },{
                value: false,
                display: "No"
            }];
            this.setState({dropdownList: dropdownList});
        }
    }
    getRHSFields = (lhsDataType) => {
        if(lhsDataType !== 'number') return this.state.fieldsList;
        let _fieldListCopy = JSON.parse(JSON.stringify(this.state.fieldsList));
        try{
            _fieldListCopy = _fieldListCopy.filter((_fieldObj) => {
                if(_fieldObj.options) return _fieldObj.options.dataType === 'number';
                else return false;
            });
            return _fieldListCopy;
        }catch(e){
            console.error(e);
            return _fieldListCopy;
        }
    }
    setC3Details = (criteria) => {
        criteria.c3Details = "staticString"
    }
    validateSubGroup = (criteria) => {
        if(Object.prototype.toString.call(criteria.subGroup) !== "[object Array]")
            criteria.subGroup = [];
        else
             criteria.subGroup = criteria.subGroup;
    }
    getRuleContent = (rule, _index) => {
        return (
            <Grid container className="ruleMainCnt" key={_index}>
                <Grid item sm={1} className="ruleIndicatorCnt">
                    <Button variant="contained" className="rulesIndicatorBtn appSecondaryBGClr" onClick={this.handleConditionMenuClick} disabled={_index === 0}>
                        {_index === 0 ? "IF" : (this.getLevel1Operator() === "" ? "AND" : this.getLevel1Operator())}
                    </Button>
                    <br />
                    {
                        _index !== 0 && 
                        <span onClick={this.removeRule.bind(null, _index)}>
                            <i className="material-icons removeRuleBtn">close</i>
                        </span>
                    }
                </Grid>
                <Grid item sm={11} className="ruleDescMainCnt">

                    {
                        rule.criteria.map( (criteria, _c_index) => {
                            return this.getRuleCriteria(rule, criteria, _index, _c_index, 'group')
                        } ) 
                    }


                    <Button variant="contained" className="rulesIndicatorBtn appSecondaryBGClr addConditionBnt" onClick={this.addGroup.bind(null, rule)}>
                        {this.getLevel2Operator(rule) === "" ? '+ Condition' : '+ '+this.getLevel2Operator(rule)}
                    </Button>
                    {/*<Button variant="contained" className="rulesIndicatorBtn appSecondaryBGClr addGroupBnt" onClick={this.addSubGroup.bind(null, rule)}>
                        + Group

                    </Button>*/}
                </Grid>

            </Grid>
        );
    }
    
    getRuleCriteria = (rule, criteria, _index, _c_index, _type) => {
        
        return(
            <Grid container key={_c_index} className="ruleDescCnt">
            
                

                {
                    _c_index !== 0 && 
                    <Grid item xs={12} sm={1} className="ruleItems">
                        <Button variant="contained" className="rulesIndicatorBtn appSecondaryBGClr" onClick={(event) => this.handleGroupMenuClick(event, rule)}>
                            {this.getLevel2Operator(rule) === "" ? 'AND' : this.getLevel2Operator(rule)}
                        </Button>
                    </Grid>
                }
                <Grid item xs={12} sm={2} className="ruleItems">
                    <span className="tagCnt Autocomplete">
                        <span style={{display: "none"}}>{criteria.c1 = this.getFieldObj(criteria.c1, criteria.c1ID).valueForRule}</span>
                        <Autocomplete
                            shouldItemRender={(item, value) => item.options.title.toLowerCase().indexOf(value.toLowerCase()) > -1}
                          getItemValue={(item) => item.options.valueForRule + '***DIRECT***' + item.id}
                          items={this.state.fieldsList}
                          renderItem={(item, isHighlighted, _index) => 
                            <div className="sugestions" style={{ background: isHighlighted ? 'lightgray' : 'white', zIndex: 1 }} key={Math.random()}>
                              {item.options.title}
                            </div>
                          }
                          inputProps={{ placeholder: 'Select Criteria Field' }}
                          value={criteria.c1 === "Select Criteria Field" ? "" : this.getFieldObj(criteria.c1, criteria.c1ID).title}
                          onChange={(event) => this.inputOnChange({target: {name: 'c1', value: event.target.value, fromOnSelect: false}}, rule, _c_index)}
                          onSelect={(val) => this.inputOnChange({target: {name: 'c1', value: val, fromOnSelect: true}}, rule, _c_index)}
                        />
                        <br />
                        {
                            criteria.c1ValidaField === false && <span className="invalidFieldInfo">Invalid Field</span>
                        }
                    </span>

                </Grid>

                {
                    criteria.c1 !== "Select Criteria Field" && 
                    <Grid item xs={12} sm={2} className="ruleItems">
                        <Select className="selectBox" fullWidth name="c2" title={criteria.c2} value={criteria.c2} onChange={(event) => this.inputOnChange(event, rule, _c_index)}>
                            {
                                this.getOperator(criteria).map( (_operator, index) => {
                                    return <MenuItem key={index} value={_operator.value}>{_operator.label}</MenuItem>
                                })
                            }
                        </Select>
                    </Grid>
                }
                {
                    (criteria.c1 !== "Select Criteria Field" && (this.getFieldObj(criteria.c1).inputType === "Dropdown" || this.getFieldObj(criteria.c1).inputType === "Listbox" || this.getFieldObj(criteria.c1).dataType === "boolean") && criteria.c2 !== "isEmpty" && criteria.c2 !== 'isNotEmpty') && 
                        <Grid item xs={12} sm={2} className="ruleItems">
                            {
                                this.setC3Details(criteria)
                            }
                            <Select className="selectBox" fullWidth name="c3" title={criteria.c3} value={criteria.c3} onChange={(event) => this.inputOnChange(event, rule, _c_index)}>
                                <MenuItem value="Select Criteria Field">Select</MenuItem>
                                {
                                    (this.state.dropdownList[criteria.c1] ? this.state.dropdownList[criteria.c1] : []).map( (_fieldList, index) => {
                                        return <MenuItem key={index} value={_fieldList.value}>{_fieldList.display}</MenuItem>
                                    })
                                }
                            </Select>
                        </Grid>
                }
                {
                    (criteria.c1 !== "Select Criteria Field" && this.getFieldObj(criteria.c1).inputType !== "Dropdown" && this.getFieldObj(criteria.c1).inputType !== "Listbox" && this.getFieldObj(criteria.c1).dataType !== "boolean" && criteria.c2 !== "isEmpty" && criteria.c2 !== "isNotEmpty") && 
                    <Grid item xs={12} sm={2} className="ruleItems">
                        <span className="ruleIconCnt">
                            <i className="useField" onClick={() => this.changeRHS("field", rule, _c_index)}>Field</i>
                            <i className="useStatic" onClick={() => this.changeRHS("static", rule, _c_index)}>123</i>
                            {
                                this.getFieldObj(criteria.c1).dataType !== 'number' && 
                                <i className="useStaticString" onClick={() => this.changeRHS("staticString", rule, _c_index)}>String</i>
                            }
                            <i className={criteria.c3Details === "field" ? "material-icons fieldActive" : (criteria.c3Details === "static" ? "material-icons staticActive" : "material-icons staticStringActive")}>check</i>
                        </span>

                        {
                            criteria.c3Details === "field" && 
                            <span className="tagCnt Autocomplete">
                                <span style={{display: "none"}}>{criteria.c3 = this.getFieldObj(criteria.c3, criteria.c3ID).valueForRule}</span>
                                <Autocomplete
                                    shouldItemRender={(item, value) => item.options.title.toLowerCase().indexOf(value.toLowerCase()) > -1}
                                  getItemValue={(item) => item.options.valueForRule + '***DIRECT***' + item.id}
                                  items={this.getRHSFields(this.getFieldObj(criteria.c1).dataType)}
                                  renderItem={(item, isHighlighted, _index) => 
                                    <div className="sugestions" style={{ background: isHighlighted ? 'lightgray' : 'white', zIndex: 1 }} key={Math.random()}>
                                      {item.options.title}
                                    </div>
                                  }
                                  inputProps={{ placeholder: 'Select Criteria Field' }}
                                  value={criteria.c3 === "Select Criteria Field" ? "" : this.getFieldObj(criteria.c3, criteria.c3ID).title}
                                  onChange={(event) => this.inputOnChange({target: {name: 'c3', value: event.target.value, fromOnSelect: false}}, rule, _c_index)}
                                  onSelect={(val) => this.inputOnChange({target: {name: 'c3', value: val, fromOnSelect: true}}, rule, _c_index)}
                                />
                                {
                                    (criteria.c3ValidaField === false && criteria.c3 !== "" && criteria.c3 !== "Select Criteria Field") && <span className="invalidFieldInfo">Invalid Field</span>
                                }
                            </span>

                        }
                        
                        {
                            criteria.c3Details === "static" && 
                            <TextField type="number" className="inputBox" value={criteria.c3}  name="c3" onChange={(event) => this.inputOnChangeForTextNumber(event, rule, _c_index)} placeholder="Enter Value"/>
                        }
                        {
                            criteria.c3Details === "staticString" && 
                            <TextField type="text" className="inputBox" value={criteria.c3}  name="c3" onChange={(event) => this.inputOnChangeForTextNumber(event, rule, _c_index)} placeholder="Enter Value"/>
                        }
                    </Grid>
                }

                {
                    rule.criteria.length > 1 && 
                    <span onClick={this.removeCriteria.bind(null, rule, _c_index)}>
                        <i className="material-icons removeRuleCriteriaBtn">close</i>
                    </span>
                }
                {
//                    this.validateSubGroup(criteria)
                }
                {
//                    criteria.subGroup.map( (subGroup, _sg_index) => {
//                        return subGroup.criteria.map((subGroupCriteria, _sgc_index) => {
//                            return(
//                                <Grid item xs={12} key={_sg_index} className="subGroup ruleItems">
//                                    <Grid container key={_c_index} className="ruleDescCnt">
//                                        <Grid item xs={1} sm={1} className="ruleItems">
//                                        </Grid>
//                                        <Grid item xs={12} sm={1} className="ruleItems">
//                                            <Button variant="contained" className="rulesIndicatorBtn appSecondaryBGClr" onClick={(event) => this.handleSubGroupMenuClick(event, criteria.subGroup)}>
//                                                {subGroup.ruleGroupOperator === "" ? 'AND' : subGroup.ruleGroupOperator}
//                                            </Button>
//                                        </Grid>
//                                        <Grid item xs={12} sm={8} className="ruleItems">
//                                            {this.getRuleCriteria(subGroup, subGroupCriteria, (_sg_index), (_sgc_index), 'subGroup')}
//                                            <span onClick={this.removeCriteria.bind(null, subGroup, _sgc_index)}>
//                                                <i className="material-icons removeRuleCriteriaBtn">close</i>
//                                            </span>
//                                        </Grid>
//                                    </Grid>
//                                </Grid>
//                            );
//                        })
//                    } ) 
                }
            </Grid>
        )
    }

    cancelRule = (event) => {
        event.stopPropagation();
        this.setState({askToLeave: false}, () => {
            this.props.history.push('/main/rules');
        });
    }
    
    render(){
        return(
            <div className="MainWrapper">
                <div className="ruleWrapper">
                    
                    <Prompt
                        when={this.state.askToLeave === true && this.state.componentMode === "update"}
                        message={() => {
                            return `Are you sure you want to leave?  You could lose your data.`;
                            }
                        }
                    />

                     <form className="rulePageForm" autoComplete="off">
                        <Grid container>
            
                            <Grid item sm={6} xs={12}>
                                <span className="RP-paginationCnt">
                                    <span><Link to="/main/configuration">Configuration </Link>/ </span>
                                    <span><Link to="/main/rules">All Rules </Link>/ </span>
                                     {this.props.match.params.mode === 'create' ? 'New' : 'Update'}
                                </span>
                            </Grid>
                            <Grid item sm={6} xs={12} className="actionCnt">
                                <TextField className="inputBox" label="Rule Name" value={this.state.ruleName} name="ruleName" style={{"marginRight": "15px"}} onChange={this.inputOnChange} />
            
                                Active: 
                                <MuiThemeProvider theme={Switch_Theme}>
                                    <Switch className="toggleBtn" checked={this.state.ruleDetail.isActive === true} onChange={this.toggleStatus} color="primary" />
                                </MuiThemeProvider>

                                 {/*<Link to="/main/rules">
                                    <Button className="cancelFieldBtn appSecondaryClr" onClick={this.cancelRule}>
                                        Cancel
                                    </Button>  
                                </Link>*/ } 
                                <Button className="cancelFieldBtn appSecondaryClr" onClick={this.cancelRule}>
                                    Cancel
                                </Button> 
    
                                <Button variant="contained" className="saveFieldBtn appSecondaryBGClr" onClick={this.saveField}>
                                    Save Rule
                                </Button>
                            </Grid>

                        </Grid>

                        <div className="ruleCnt">
            
                            <Menu
                              anchorEl={this.state.anchorEl_condition}
                              open={Boolean(this.state.anchorEl_condition)}
                              onClose={this.handleConditionMenuClose}
                            >
                                <MenuItem onClick={event => this.handleConditionMenuItemClick(event, 'AND')}>AND</MenuItem>
                                <MenuItem onClick={event => this.handleConditionMenuItemClick(event, 'OR')}>OR</MenuItem>
                            </Menu>

                            <Menu
                              anchorEl={this.state.anchorEl_group}
                              open={Boolean(this.state.anchorEl_group)}
                              onClose={this.handleGroupMenuClose}
                            >
                                <MenuItem onClick={event => this.handleGroupMenuItemClick(event, this.state.anchor_group_obj, 'AND')}>AND</MenuItem>
                                <MenuItem onClick={event => this.handleGroupMenuItemClick(event, this.state.anchor_group_obj, 'OR')}>OR</MenuItem>
                            </Menu>

                            <Menu
                              anchorEl={this.state.anchorEl_subGroup}
                              open={Boolean(this.state.anchorEl_subGroup)}
                              onClose={this.handleSubGroupMenuClose}
                            >
                                <MenuItem onClick={event => this.handleSubGroupMenuItemClick(event, this.state.anchor_subGroup_obj, 'AND')}>AND</MenuItem>
                                <MenuItem onClick={event => this.handleSubGroupMenuItemClick(event, this.state.anchor_subGroup_obj, 'OR')}>OR</MenuItem>
                            </Menu>

                            {
                                this.state.ruleDetail.desc.map( (rule, _index) => {
                                    return this.getRuleContent(rule, _index)
                                })
                            }
            
                            <Button variant="contained" className="rulesIndicatorBtn appSecondaryBGClr addConditionBnt" onClick={this.addCondition}>

                                + Group

                            </Button>
                        </div>


                        <Grid container className="footerCnt">
                            <Grid item sm={12} xs={12} className="actionCnt">
                                <Button className="cancelFieldBtn appSecondaryClr" onClick={this.cancelRule}>
                                    Cancel
                                </Button>
                                <Button variant="contained" className="saveFieldBtn appSecondaryBGClr" onClick={this.saveField}>
                                    Save Rule
                                </Button>
                            </Grid>
                        </Grid>
                    </form>            
                </div>
            </div>
        )
    }
}
