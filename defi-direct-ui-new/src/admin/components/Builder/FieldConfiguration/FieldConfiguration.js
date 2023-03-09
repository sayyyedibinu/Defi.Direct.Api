import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import NativeSelect from '@material-ui/core/NativeSelect';
import Hidden from '@material-ui/core/Hidden';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import config from "../../../resources/config.json";
import './FieldConfigurationStyle.css';
import dataShare from "../../Common/dataShare";


const Switch_Theme = createMuiTheme({
    palette: {
        primary: { main: config.defaultSecondaryClr }
    }
});
export default class FieldConfigurationComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { labelError: false, label: "", originalTitle: "", placeholder: "", hint: "", isRequired: true, isRequiredRule: "null", isRequiredRuleDesc: "", displayLogicRule: "null", displayLogicRuleDesc: "", displayLogic: true, fieldWidth: 1, isScrollable: true, inputType: "" , readonly: false, ruleList: []};
    }
    componentDidMount = () => {
        this.getRuleList();
    }
    componentWillReceiveProps=()=>{
        let _tempVar = {};
        if (Object.prototype.toString.call(this.props.configurationData.title) !== '[object Undefined]')
             _tempVar.label = this.props.configurationData.title;
        this.setState(_tempVar);
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps.configurationData === this.props.configurationData) return;
        let _tempVar = {};
        if (Object.prototype.toString.call(this.props.configurationData.title) !== '[object Undefined]')
            _tempVar.label = this.props.configurationData.title;
        
        if (Object.prototype.toString.call(this.props.configurationData.originalTitle) !== '[object Undefined]')
            _tempVar.originalTitle = this.props.configurationData.originalTitle;
        else
            _tempVar.originalTitle = this.props.configurationData.id;
        
        if (Object.prototype.toString.call(this.props.configurationData.placeholder) !== '[object Undefined]')
            _tempVar.placeholder = this.props.configurationData.placeholder;
        if (Object.prototype.toString.call(this.props.configurationData.hint) !== '[object Undefined]')
            _tempVar.hint = this.props.configurationData.hint;
        if (Object.prototype.toString.call(this.props.configurationData.isRequired) !== '[object Undefined]')
            _tempVar.isRequired = this.props.configurationData.isRequired;
        
        if (Object.prototype.toString.call(this.props.configurationData.isRequiredRule) !== '[object Undefined]')
            _tempVar.isRequiredRule = this.props.configurationData.isRequiredRule;
        else _tempVar.isRequiredRule = "null";
        
        if (Object.prototype.toString.call(this.props.configurationData.isRequiredRuleDesc) !== '[object Undefined]')
            _tempVar.isRequiredRuleDesc = this.props.configurationData.isRequiredRuleDesc;
        
        if (Object.prototype.toString.call(this.props.configurationData.displayLogicRule) !== '[object Undefined]')
            _tempVar.displayLogicRule = this.props.configurationData.displayLogicRule;
        else _tempVar.displayLogicRule = "null";
        
        if (Object.prototype.toString.call(this.props.configurationData.displayLogicRuleDesc) !== '[object Undefined]')
            _tempVar.displayLogicRuleDesc = this.props.configurationData.displayLogicRuleDesc;
        
        if (Object.prototype.toString.call(this.props.configurationData.displayLogic) !== '[object Undefined]')
            _tempVar.displayLogic = this.props.configurationData.displayLogic;
        
        if (Object.prototype.toString.call(this.props.configurationData.fieldWidth) !== '[object Undefined]')
            _tempVar.fieldWidth = this.props.configurationData.fieldWidth;
        if (Object.prototype.toString.call(this.props.configurationData.isScrollable) !== '[object undefined]')
            _tempVar.isScrollable = this.props.configurationData.isScrollable;
        if (Object.prototype.toString.call(this.props.configurationData.inputType) !== '[object undefined]')
            _tempVar.inputType = this.props.configurationData.inputType;
        if (Object.prototype.toString.call(this.props.configurationData.readonly) !== '[object undefined]')
            _tempVar.readonly = this.props.configurationData.readonly;
        /*else _tempVar.fieldWidth = 1;*/
        this.setState(_tempVar);
    }
    onInputChanged = (event) => {
        let _tempVar = {};
        _tempVar[event.target.name] = event.target.value;
        if (event.target.name === 'label' && event.target.value !== "")
            _tempVar.labelError = false;
        this.setState(_tempVar);
    }
    /*fieldWidthClicked = (width) => {
        this.setState({fieldWidth: width});
    }*/
    saveField = () => {
        if (this.state.label === "") {
            this.setState({ labelError: true });
            return;
        }
        this.props.configurationData.title = this.state.label;
        this.props.configurationData.placeholder = this.state.placeholder;
        this.props.configurationData.hint = this.state.hint;
        this.props.configurationData.isRequired = this.state.isRequired;
        this.props.configurationData.isRequiredRule = this.state.isRequiredRule;
        this.props.configurationData.displayLogic = this.state.displayLogic;
        this.props.configurationData.displayLogicRule = this.state.displayLogicRule;
        this.props.configurationData.fieldWidth = this.state.fieldWidth;
        this.props.configurationData.isScrollable = this.state.isScrollable;
        if(this.props.configurationData.inputType !== this.state.inputType)
            this.props.configurationData.text = "";
        this.props.configurationData.inputType = this.state.inputType;
        
        this.fillRuleDesc = (ruleID, objectRef, callback) => {
            this.props.configurationData[objectRef] = "";
            dataShare.getRuleByID(ruleID, (error, response) => {
                if(error){
                    this.props.showNotification('error', 'Internal server error while fetching rules information, please try after sometime.');
                    return;
                }
                try{
                    this.props.configurationData[objectRef] = JSON.stringify(response.ruleDetail.desc);
                }catch(e){
                    console.error(e);
                }
                callback();
            });
        }
        
        if(this.state.isRequiredRule !== "null" && this.state.displayLogicRule !== "null"){
            this.fillRuleDesc(this.state.isRequiredRule, "isRequiredRuleDesc", () => {
                this.fillRuleDesc(this.state.displayLogicRule, "displayLogicRuleDesc", () => {
                    this.props.confirmFieldConfiguration(this.props.configurationData);
                });
            });
        }else if(this.state.isRequiredRule !== "null" && this.state.displayLogicRule === "null"){
            this.fillRuleDesc(this.state.isRequiredRule, "isRequiredRuleDesc", () => {
                this.props.confirmFieldConfiguration(this.props.configurationData);
            });
        }else if(this.state.isRequiredRule === "null" && this.state.displayLogicRule !== "null"){
            this.fillRuleDesc(this.state.displayLogicRule, "displayLogicRuleDesc", () => {
                this.props.confirmFieldConfiguration(this.props.configurationData);
            });
        }else{
            this.props.configurationData.isRequiredRuleDesc = "";
            this.props.configurationData.displayLogicRuleDesc = "";
            this.props.confirmFieldConfiguration(this.props.configurationData);
        }
            
        /*if(this.state.isRequiredRule !== "null"){
            dataShare.getRuleByID(this.state.isRequiredRule, (error, response) => {
                if(error){
                    this.props.showNotification('error', 'Internal server error while fetching rules information, please try after sometime.');
                    return;
                }
                try{
                    this.props.configurationData.isRequiredRuleDesc = JSON.stringify(response.ruleDetail.desc);
                    this.props.confirmFieldConfiguration(this.props.configurationData);
                }catch(e){
                    console.error(e);
                }
            });
        }else{
            this.props.configurationData.isRequiredRuleDesc = "";
            this.props.confirmFieldConfiguration(this.props.configurationData);
        }*/
    }
    
    getRuleList = () => {
        dataShare.getRulesList(false, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching rules list, please try after sometime.');
                return;
            }
            let _resData = response;
            _resData = _resData.filter( (rule) => {
                return (rule.ruleDetail.isActive === true);
            });
            this.setState({ruleList: _resData});
        });
    }
    cancelAction=()=>
    
    {
       
       // console.log(this.state);      
        if (Object.prototype.toString.call(this.props.configurationData.isRequiredRule) === '[object Undefined]')
            this.props.configurationData.isRequiredRule="null";
        if (Object.prototype.toString.call(this.props.configurationData.displayLogicRule) === '[object Undefined]')
           {
            this.props.configurationData.displayLogicRule="null";
           }         
        this.setState({label:this.props.configurationData.title,placeholder:this.props.configurationData.placeholder,hint:this.props.configurationData.hint,isRequired:this.props.configurationData.isRequired,isRequiredRule:this.props.configurationData.isRequiredRule,displayLogic:this.props.configurationData.displayLogic,displayLogicRule:this.props.configurationData.displayLogicRule});
       // console.log(this.state);
        this.props.closeFieldConfiguration();
    }
    render() {
        return (
            <Modal open={this.props.showFieldConfiguration} onClose={this.props.closeFieldConfiguration} >
                <div style={{ width: "100%", overflow: "auto", height: "100vh" }}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={10} md={9} lg={6} className="FC-Wrapper">
                            <div className="FC-Container">
                                <Hidden only={['xs']}>
                                    <span className="FC-CloseBtn" onClick={this.cancelAction}>
                                        <i className="material-icons">clear</i>
                                    </span>
                                </Hidden>
                                
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <h2 className="FC-Header">Configuration Settings</h2>
                                    </Grid>
            
                                    <div className="FC-Body">
                                        {
                                            (this.props.fieldType !== "Text Area" && this.props.fieldType !== "HTML Area" && this.props.fieldType !== "Image") &&
                                            <Grid item xs={12}>
                                                <Grid container spacing={0}>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            name="label"
                                                            value={this.state.label}
                                                            onChange={this.onInputChanged}
                                                            label="Field Label *"
                                                            helperText={"This will override the actual field title \'"+this.state.originalTitle+"\' on the page."}
                                                            fullWidth
                                                            margin="normal"
                                                        />
                                                        {
                                                            this.state.labelError === true && <div className="required">Label is required.</div>
                                                        }
                                                        {
                                                            this.state.label.length >= 25 && 
                                                            <div className="required">Field labels with more than 25 characters are not optimized for mobile display.</div>
                                                        }
                                                    </Grid>
                                                    {
                                                        (this.props.fieldType !== "Checkbox" && this.props.fieldType !== "Listbox" && this.state.readonly == false) &&
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                name="placeholder"
                                                                value={this.state.placeholder}
                                                                onChange={this.onInputChanged}
                                                                label="Field Placeholder"
                                                                helperText="This is used as the default text when the user clicks on the field to enter data."
                                                                fullWidth
                                                                margin="normal"
                                                            />
                                                        </Grid>
                                                    }
                                                    {
                                                        (this.props.fieldType !== "Checkbox" && this.props.fieldType !== "Listbox") &&
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                name="hint"
                                                                value={this.state.hint}
                                                                onChange={this.onInputChanged}
                                                                label="Field Hint"
                                                                helperText="This will be displayed as a hint at the bottom of the Field just like this is shown."
                                                                fullWidth
                                                                margin="normal"
                                                            />
                                                        </Grid>
                                                    }
                                                    <Grid item xs={12}>
                                                        <Grid container spacing={0}>
                                                            {
                                                                this.state.readonly == false && 
                                                                <Grid item xs={6}>
                                                                    <MuiThemeProvider theme={Switch_Theme}>
                                                                        Mandatory
                                                                        <Switch className="toggleBtn" color="primary" checked={this.state.isRequired} onChange={() => {this.setState({ isRequired: !this.state.isRequired, isRequiredRule: "null" });} } />
                                                                    </MuiThemeProvider>
                                                                </Grid>
                                                            }
                                                            {
                                                                this.state.readonly == false && 
                                                                <Grid item xs={6}>
                                                                    <InputLabel>Select Rule</InputLabel>
                                                                    <Select className="selectBox" value={this.state.isRequiredRule} name="isRequiredRule" onChange={this.onInputChanged} fullWidth disabled={this.state.isRequired === false}>
                                                                        <MenuItem value="null">None</MenuItem>
                                                                        {
                                                                            this.state.ruleList.map( (rule, index) => {
                                                                              return (
                                                                                <MenuItem value={rule.id} key={index}>{rule.ruleName}</MenuItem>
                                                                              )
                                                                            })
                                                                        }
                                                                    </Select>
                                                                </Grid>
                                                            }

                                                        </Grid>
                                                    </Grid>

                                                    {/*<Grid item xs={12}>
                                                        <Grid container spacing={0}>
                                                            <Grid item xs={6}>

                                                                <MuiThemeProvider theme={Switch_Theme}>
                                                                    Display Logic
                                                                    <Switch className="toggleBtn" color="primary" checked={this.state.displayLogic} onChange={() => this.setState({ displayLogic: !this.state.displayLogic, displayLogicRule: "null" })} />
                                                                </MuiThemeProvider>

                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <InputLabel>Select Rule</InputLabel>
                                                                    <Select className="selectBox" value={this.state.displayLogicRule} name="displayLogicRule" onChange={this.onInputChanged} fullWidth disabled={this.state.displayLogic === false}>
                                                                        <MenuItem value="null">None</MenuItem>
                                                                        {
                                                                            this.state.ruleList.map( (rule, index) => {
                                                                              return (
                                                                                <MenuItem value={rule.id} key={index}>{rule.ruleName}</MenuItem>
                                                                              )
                                                                            })
                                                                        }
                                                                    </Select>
                                                            </Grid>
                                                        </Grid>

                                                    </Grid>*/}

                                                    {
                                                        /*<Grid item xs={12}>
                                                            <Grid container spacing={0}>
                                                                <Grid item sm={12} className="fieldWidthCnt">
                                                                    <Button variant="outlined" color="primary" className={this.state.fieldWidth === 1 ? "fieldWidthBtn selected" : "fieldWidthBtn"} onClick={() => this.fieldWidthClicked(1)}>1 Column</Button>
                                                                    <Button variant="outlined" color="primary" className={this.state.fieldWidth === 2 ? "fieldWidthBtn selected" : "fieldWidthBtn"} onClick={() => this.fieldWidthClicked(2)}>2 Column</Button>
                                                                    <Button variant="outlined" color="primary" className={this.state.fieldWidth === 3 ? "fieldWidthBtn selected" : "fieldWidthBtn"} onClick={() => this.fieldWidthClicked(3)}>3 Column</Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>*/
                                                    }

                                                </Grid>
                                            </Grid>
                                        }
                                        {
                                            (this.props.fieldType === "Text Area" || this.props.fieldType === "HTML Area") &&
                                            <Grid item xs={12}>
                                                <Grid container spacing={0}>
                                                <Grid item xs={12}>
                                                        <Grid container spacing={0}>
                                                            <Grid item xs={12}>
                                                                <MuiThemeProvider theme={Switch_Theme}>
                                                                    Scrollable
                                                                    <Switch className="toggleBtn1" color="primary" checked={this.state.isScrollable} onChange={() => this.setState({ isScrollable: !this.state.isScrollable })} />
                                                                </MuiThemeProvider>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Grid container spacing={0}>
                                                            <Grid item xs={12}>
                                                                <MuiThemeProvider theme={Switch_Theme}>
                                                                    HTML  
                                                                    <Switch className="toggleBtn2" color="primary" checked={this.state.inputType === "HTML Area"} onChange={() => {this.setState({ inputType: (this.state.inputType === "HTML Area" ? "Text Area" : "HTML Area") })}} />
                                                                </MuiThemeProvider>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>


                                                </Grid>
                                            </Grid>
                                        }

                                        <Grid item xs={12} className="DisplayLogic">
                                            <Grid container spacing={0}>
                                                <Grid item xs={6}>

                                                    <MuiThemeProvider theme={Switch_Theme}>
                                                        Display Logic
                                                        <Switch className="toggleBtn" color="primary" checked={this.state.displayLogic} onChange={() => this.setState({ displayLogic: !this.state.displayLogic, displayLogicRule: "null" })} />
                                                    </MuiThemeProvider>

                                                </Grid>
                                                <Grid item xs={6}>
                                                    <InputLabel>Select Rule</InputLabel>
                                                        <Select className="selectBox" value={this.state.displayLogicRule} name="displayLogicRule" onChange={this.onInputChanged} fullWidth disabled={this.state.displayLogic === false}>
                                                            <MenuItem value="null">None</MenuItem>
                                                            {
                                                                this.state.ruleList.map( (rule, index) => {
                                                                  return (
                                                                    <MenuItem value={rule.id} key={index}>{rule.ruleName}</MenuItem>
                                                                  )
                                                                })
                                                            }
                                                        </Select>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </div>
                                    

                                    <Grid item xs={12}>
                                        <Grid container spacing={0}>
                                            <Grid item xs={12}>
                                                <div className="FC-Footer">
                                                    <Button variant="contained" className="cancelBtn appSecondaryClr" onClick={this.cancelAction}>
                                                            Cancel
                                                    </Button>
                                                    <Button variant="contained" className="saveBtn appSecondaryBGClr" onClick={this.saveField}>
                                                        Save
                                                </Button>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Modal>
        )
    }
}
