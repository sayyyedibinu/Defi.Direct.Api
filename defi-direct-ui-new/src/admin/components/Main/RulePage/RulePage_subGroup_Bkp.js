import React from "react";
import {Link} from "react-router-dom";
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
let defaultStructure = {
    operator: "IF",
    ruleGroupOperator: "",
    criteria: [
        {
            c1: "Select Criteria Field",
            c2: "equalto",
            c3: "Select Criteria Field",
            c3Details: "field",
            subGroup: []
        }
    ]
};
export default class RulePageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {id: this.props.match.params.id, componentMode: this.props.match.params.mode, anchorEl_condition: null, anchorEl_group: null, anchorIndex_group: -1, fieldsList: [], dropdownList: [], ruleName: "", ruleDetail: {desc: []}, level1Operator: "", field1: "Select Criteria Field", field2: "isEmpty", field3: "Select Criteria Field", activeRuleRHS: "field", random: 0};
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
        let _ruleDetail = this.state.ruleDetail;
        _ruleDetail.isActive = !_ruleDetail.isActive;
        console.log(_ruleDetail.isActive);
        this.setState({ruleDetail: _ruleDetail});
    }
    getLevel1Operator = () => {
        if(this.state.ruleDetail.desc.length < 2) return "";
        return this.state.ruleDetail.desc[1].operator;
    }
    
    getLevel2Operator = (index) => {
        try{
            if(this.state.ruleDetail.desc[index].criteria.length < 2) return "";
            return this.state.ruleDetail.desc[index].ruleGroupOperator;
        }catch(e){
            return "";
        }
    }
    
    setDefaultRuleObj = () => {
        let _ruleDetail = {
            isActive: true,
            desc: []
        };
        _ruleDetail.desc.push(defaultStructure);
        this.setState({ruleName: "", ruleDetail: _ruleDetail});    
    }
    
    addGroup = (index, operator) => {
        let _ruleDetails = this.state.ruleDetail;
        _ruleDetails.desc[index].ruleGroupOperator = (this.getLevel2Operator(index) === "" ? "AND" : this.getLevel2Operator(index));
        _ruleDetails.desc[index].criteria.push({
            c1: "Select Criteria Field",
            c2: "isEmpty",
            c3: "Select Criteria Field",
            c3Details: "field",
            subGroup: []
        });
        this.setState({
            ruleDetail: _ruleDetails
        });
    }
    
    addSubGroup = (_obj) => {
        let defaultStructureCopie = JSON.parse(JSON.stringify(defaultStructure));
        defaultStructureCopie.operator = _obj.operator;
        defaultStructureCopie.ruleGroupOperator = _obj.ruleGroupOperator;
        _obj.criteria[_obj.criteria.length-1].subGroup.push(defaultStructureCopie);
        /*console.log(_obj);*/
        /*let ruleDetail = this.state.ruleDetail;*/
        this.setState({random: Math.random()});
        
        /*this.setState({ruleDetail: {...this.state.ruleDetail, _obj}}, () => {
            console.log(this.state.ruleDetail);
        });*/
    } 
    
    addCondition = (operator) => {
        let _ruleDetails = this.state.ruleDetail;
        _ruleDetails.desc.push({
            operator: (this.getLevel1Operator() === "" ? "AND" : this.getLevel1Operator()),
            ruleGroupOperator: "",
            criteria: [
                    {
                        c1: "Select Criteria Field",
                        c2: "isEmpty",
                        c3: "Select Criteria Field",
                        c3Details: "field",
                        subGroup: []
                    }
                ]
        });
        this.setState({
            ruleDetail: _ruleDetails
        });
    }
    changeRHS = (_details, row, column) => {
        let _ruleDetails = this.state.ruleDetail;
        _ruleDetails.desc[row].criteria[column].c3Details = _details;
        if(_details === "field") _ruleDetails.desc[row].criteria[column].c3 = "Select Criteria Field";
        else if(_details === "static") _ruleDetails.desc[row].criteria[column].c3 = 0;
        else  _ruleDetails.desc[row].criteria[column].c3 = "";
        this.setState({ruleDetail: _ruleDetails});
    }
    inputOnChangeForTextNumber = (event, row, column) => {
        let _ruleDetails = this.state.ruleDetail;
        _ruleDetails.desc[row].criteria[column][event.target.name] = event.target.value;
        this.setState({ruleDetail: _ruleDetails});
    }
    inputOnChange = (event, row, column) => {
        if(event.target.name === "ruleName"){
            this.setState({ruleName: event.target.value});
            return;
        }
        let _ruleDetails = this.state.ruleDetail;
        
        if(event.target.name === "c1"){
           let _fieldObj = this.getFieldObj(event.target.value);
            if(_fieldObj.dataType === "string" && (_fieldObj.inputType === "Text Input" || _fieldObj.inputType === "Dropdown" || _fieldObj.inputType === "Listbox")){
                _ruleDetails.desc[row].criteria[column].c2 = "isEmpty";
                _ruleDetails.desc[row].criteria[column].c3Details = "staticString";
                _ruleDetails.desc[row].criteria[column].c3 = "";
            }
            if(_fieldObj.dataType === "boolean"){
                _ruleDetails.desc[row].criteria[column].c2 = "equalto";
                _ruleDetails.desc[row].criteria[column].c3Details = "field";
                _ruleDetails.desc[row].criteria[column].c3 = "true";
            }
            if(_fieldObj.dataType === "number" || _fieldObj.dataType === "date"){
                _ruleDetails.desc[row].criteria[column].c2 = "equalto";
                _ruleDetails.desc[row].criteria[column].c3Details = "field";
                _ruleDetails.desc[row].criteria[column].c3 = "Select Criteria Field";
            }
        }
           
        if(event.target.name === "c2" && (event.target.value === "isEmpty" || event.target.value === "isNotEmpty" || event.target.value === "isActive" || event.target.value === "isInActive")){
            _ruleDetails.desc[row].criteria[column].c3Details = "staticString";
            if(event.target.value === "isActive")
                _ruleDetails.desc[row].criteria[column].c3 = "Active";
            else if(event.target.value === "isInActive")
                _ruleDetails.desc[row].criteria[column].c3 = "InActive";
            else _ruleDetails.desc[row].criteria[column].c3 = "";
        }else{
            _ruleDetails.desc[row].criteria[column].c3Details = "field";
            _ruleDetails.desc[row].criteria[column].c3 = "Select Criteria Field";
        }
        _ruleDetails.desc[row].criteria[column][event.target.name] = event.target.value;
        this.setState({ruleDetail: _ruleDetails});
    }
    toggeleStatus = () => {
        let _tempVar = this.state.ruleDetail;
        _tempVar.isActive = !_tempVar.isActive;
        this.setState(_tempVar);
    }
    saveField = () => {
        console.log(this.state.ruleDetail);
        if(this.state.ruleName === ''){
            this.props.showNotification('warning', 'Enter Rule Name.');
            return;
        }
        for(let i = 0; i < this.state.ruleDetail.desc.length; i++){
            for(let j = 0; j < this.state.ruleDetail.desc[i].criteria.length; j++){
                if(this.state.ruleDetail.desc[i].criteria[j].c1 === "Select Criteria Field"){
                    this.props.showNotification('warning', 'Invalid Rule.');
                    return;
                }
                if(this.state.ruleDetail.desc[i].criteria[j].c3Details === "field" && this.state.ruleDetail.desc[i].criteria[j].c3 === "Select Criteria Field"){
                    this.props.showNotification('warning', 'Invalid Rule.');
                    return;
                }
            }
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
                this.props.showNotification('success', 'Rule Updated Successfully.');
            }
        } )
    }
    
    handleConditionMenuClick = (event) => {
        this.setState({ anchorEl_condition: event.currentTarget });
    };

    handleConditionMenuItemClick = (event, selected) => {
        let _ruleDetails = this.state.ruleDetail;
        for(let i = 1; i < _ruleDetails.desc.length; i++){
            _ruleDetails.desc[i].operator = selected;
        }
        this.setState({ ruleDetail: _ruleDetails, anchorEl_condition: null });
    }
    handleConditionMenuClose = () => {
        this.setState({ anchorEl_condition: null });
    };

    handleGroupMenuClick = (event, index) => {
        this.setState({ anchorEl_group: event.currentTarget, anchorIndex_group: index });
    };

    handleGroupMenuItemClick = (event, selected) => {
        let _ruleDetails = this.state.ruleDetail;
        _ruleDetails.desc[this.state.anchorIndex_group].ruleGroupOperator = selected;
        this.setState({ ruleDetail: _ruleDetails, anchorEl_group: null, anchorIndex_group: -1 });
    }
    handleGroupMenuClose = () => {
        this.setState({ anchorEl_group: null, anchorIndex_group: -1 });
    };
    removeCriteria = (rowIndex, columnIndex) => {
        let _ruleDetail = this.state.ruleDetail;
        _ruleDetail.desc[rowIndex].criteria.splice(columnIndex, 1);
        this.setState({ruleDetail: _ruleDetail});
    };

    removeRule = (rowIndex) => {
        let _ruleDetail = this.state.ruleDetail;
        _ruleDetail.desc.splice(rowIndex, 1);
        this.setState({ruleDetail: _ruleDetail});
    };

    getFieldID = (_field) => {
        if(_field.options.readonly === true && _field.options.xPath !== "")
            return (_field.options.xPath.replace(new RegExp('/', 'g'), '.'));
        else return _field.options.id;
    }
    getFieldObj = (_fieldID) => {
        if(_fieldID === "Select Criteria Field") return {};
        for(let i = 0; i < this.state.fieldsList.length; i++){
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
        if(_fieldObj.inputType === "Dropdown" && !this.state.dropdownList[_obj.c1]){ 
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
                value: "true",
                display: "Yes"
            },{
                value: "false",
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
    
    getRuleContent = (rule, _index) => {
        return (
            <Grid container className="ruleMainCnt" key={_index}>
                <Grid item sm={1} className="ruleIndicatorCnt">
                    <Button variant="contained" className="rulesIndicatorBtn appSecondaryBGClr" onClick={this.handleConditionMenuClick} disabled={_index === 0}>
                        {rule.operator}
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
                            return this.getRuleCriteria(rule, criteria, _index, _c_index)
                        } ) 
                    }


                    <Button variant="contained" className="rulesIndicatorBtn appSecondaryBGClr addConditionBnt" onClick={this.addGroup.bind(null, _index)}>
                        {this.getLevel2Operator(_index) === "" ? '+ Condition' : '+ '+this.getLevel2Operator(_index)}
                    </Button>
                    <Button variant="contained" className="rulesIndicatorBtn appSecondaryBGClr addGroupBnt" onClick={this.addSubGroup.bind(null, rule)}>
                        + Group
                    </Button>
                </Grid>

            </Grid>
        );
    }
    
    getRuleCriteria = (rule, criteria, _index, _c_index) => {
        return(
            <Grid container key={_c_index} className="ruleDescCnt">
                {
                    _c_index !== 0 && 
                    <Grid item xs={12} sm={1} className="ruleItems">
                        <Button variant="contained" className="rulesIndicatorBtn appSecondaryBGClr" onClick={(event) => this.handleGroupMenuClick(event, _index)}>
                            {this.getLevel2Operator(_index) === "" ? 'AND' : '+ '+this.getLevel2Operator(_index)}
                        </Button>
                    </Grid>
                }
                <Grid item xs={12} sm={2} className="ruleItems">
                    <span className="tagCnt Autocomplete">
                        <Autocomplete
                            shouldItemRender={(item, value) => item.options.title.toLowerCase().indexOf(value.toLowerCase()) > -1}
                          getItemValue={(item) => item.options.valueForRule}
                          items={this.state.fieldsList}
                          renderItem={(item, isHighlighted, _index) => 
                            <div className="sugestions" style={{ background: isHighlighted ? 'lightgray' : 'white', zIndex: 1 }} key={Math.random()}>
                              {item.options.title}
                            </div>
                          }
                          inputProps={{ placeholder: 'Select Criteria Field' }}
                          value={criteria.c1 === "Select Criteria Field" ? "" : this.getFieldObj(criteria.c1).title}
                          onChange={(event) => this.inputOnChange({target: {name: 'c1', value: event.target.value}}, _index, _c_index)}
                          onSelect={(val) => this.inputOnChange({target: {name: 'c1', value: val}}, _index, _c_index)}
                        />
                    </span>

                </Grid>

                {
                    criteria.c1 !== "Select Criteria Field" && 
                    <Grid item xs={12} sm={2} className="ruleItems">
                        <Select className="selectBox" fullWidth name="c2" title={criteria.c2} value={criteria.c2} onChange={(event) => this.inputOnChange(event, _index, _c_index)}>
                            {
                                this.getOperator(criteria).map( (_operator, index) => {
                                    return <MenuItem key={index} value={_operator.value}>{_operator.label}</MenuItem>
                                })
                            }
                        </Select>
                    </Grid>
                }
                {
                    (criteria.c1 !== "Select Criteria Field" && (this.getFieldObj(criteria.c1).inputType === "Dropdown" || this.getFieldObj(criteria.c1).dataType === "boolean") && criteria.c2 !== "isEmpty" && criteria.c2 !== 'isNotEmpty') && 
                        <Grid item xs={12} sm={2} className="ruleItems">
                            <Select className="selectBox" fullWidth name="c3" title={criteria.c3} value={criteria.c3} onChange={(event) => this.inputOnChange(event, _index, _c_index)}>
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
                    (criteria.c1 !== "Select Criteria Field" && this.getFieldObj(criteria.c1).inputType !== "Dropdown" && this.getFieldObj(criteria.c1).dataType !== "boolean" && criteria.c2 !== "isEmpty" && criteria.c2 !== "isNotEmpty") && 
                    <Grid item xs={12} sm={2} className="ruleItems">
                        <span className="ruleIconCnt">
                            <i className="useField" onClick={() => this.changeRHS("field", _index, _c_index)}>Field</i>
                            <i className="useStatic" onClick={() => this.changeRHS("static", _index, _c_index)}>123</i>
                            {
                                this.getFieldObj(criteria.c1).dataType !== 'number' && 
                                <i className="useStaticString" onClick={() => this.changeRHS("staticString", _index, _c_index)}>String</i>
                            }
                            <i className={criteria.c3Details === "field" ? "material-icons fieldActive" : (criteria.c3Details === "static" ? "material-icons staticActive" : "material-icons staticStringActive")}>check</i>
                        </span>

                        {
                            criteria.c3Details === "field" && 
                            <span className="tagCnt Autocomplete">
                                <Autocomplete
                                    shouldItemRender={(item, value) => item.options.title.toLowerCase().indexOf(value.toLowerCase()) > -1}
                                  getItemValue={(item) => item.options.valueForRule}
                                  items={this.getRHSFields(this.getFieldObj(criteria.c1).dataType)}
                                  renderItem={(item, isHighlighted, _index) => 
                                    <div className="sugestions" style={{ background: isHighlighted ? 'lightgray' : 'white', zIndex: 1 }} key={Math.random()}>
                                      {item.options.title}
                                    </div>
                                  }
                                  inputProps={{ placeholder: 'Select Criteria Field' }}
                                  value={criteria.c3 === "Select Criteria Field" ? "" : this.getFieldObj(criteria.c3).title}
                                  onChange={(event) => this.inputOnChange({target: {name: 'c3', value: event.target.value}}, _index, _c_index)}
                                  onSelect={(val) => this.inputOnChange({target: {name: 'c3', value: val}}, _index, _c_index)}
                                />
                            </span>

                        }
                        
                        {
                            criteria.c3Details === "static" && 
                            <TextField type="number" className="inputBox" value={criteria.c3}  name="c3" onChange={(event) => this.inputOnChangeForTextNumber(event, _index, _c_index)} placeholder="Enter Value"/>
                        }
                        {
                            criteria.c3Details === "staticString" && 
                            <TextField type="text" className="inputBox" value={criteria.c3}  name="c3" onChange={(event) => this.inputOnChangeForTextNumber(event, _index, _c_index)} placeholder="Enter Value"/>
                        }
                    </Grid>
                }

                {
                    rule.criteria.length > 1 && 
                    <span onClick={this.removeCriteria.bind(null, _index, _c_index)}>
                        <i className="material-icons removeRuleCriteriaBtn">close</i>
                    </span>
                }

                {
                    criteria.subGroup.map( (subGroup, _s_index) => {
                        return(
                            <Grid item xs={12} className="subGroup ruleItems">
                                {this.getRuleContent(subGroup, _s_index)}
                            </Grid>
                        );
                        /*return this.getRuleCriteria(criteria, subCriteria, _c_index, _s_index);*/
                    } ) 
                }
            </Grid>
        )
    }
    render(){
        return(
            <div className="MainWrapper">
                <div className="ruleWrapper">
                    
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

                                <Button className="cancelFieldBtn appSecondaryClr">
                                    <Link to="/main/rules">Cancel</Link>
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
                                <MenuItem onClick={event => this.handleGroupMenuItemClick(event, 'AND')}>AND</MenuItem>
                                <MenuItem onClick={event => this.handleGroupMenuItemClick(event, 'OR')}>OR</MenuItem>
                            </Menu>

                            {
                                this.state.ruleDetail.desc.map( (rule, _index) => {
                                    return this.getRuleContent(rule, _index)
                                })
                            }
            
                            <Button variant="contained" className="rulesIndicatorBtn appSecondaryBGClr addConditionBnt" onClick={this.addCondition}>
                                {this.getLevel1Operator() === "" ? '+ Condition' : '+ '+this.getLevel1Operator()}
                            </Button>
                        </div>

                        {/*<div className="ruleCnt">
                            <Grid container>
                                <Grid item sm={1} className="ruleIndicatorCnt">
                                    <Button variant="contained" className="rulesIndicatorBtn appSecondaryBGClr">
                                        THEN
                                    </Button>
                                </Grid>
                                <Grid item sm={11} className="ruleDescCnt">
                                </Grid>
                            </Grid>
                        </div>*/}

                        <Grid container className="footerCnt">
                            <Grid item sm={12} xs={12} className="actionCnt">
                                <Button className="cancelFieldBtn appSecondaryClr">
                                    <Link to="/main/rules">Cancel</Link>
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
