import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import NativeSelect from '@material-ui/core/NativeSelect';
import Hidden from '@material-ui/core/Hidden';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import config from "../../../resources/config.json";
import dataShare from "../../Common/dataShare";
import './ButtonConfiguration.css';


const Switch_Theme = createMuiTheme({
    palette: {
        primary: { main: config.defaultSecondaryClr }
    }
});
export default class ButtonConfigurationComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { title: "", titleError: false, action: 'Close page', actionError:false, routeUrl: "", urlError: false, ruleList: [], displayLogic: true, displayLogicRule: "null", displayLogicRuleDesc: "", displayPositionDetails: "Center" };
       
    }
    componentDidMount = () => {
        this.getRuleList();
    }
    componentDidUpdate = (prevProps) => {
        if (this.props.configurationData !== prevProps.configurationData){
            let _tempVar = {};
            _tempVar.title = this.props.configurationData.title;
            _tempVar.routeUrl = this.props.configurationData.routeUrl;
            
            if(Object.prototype.toString.call(this.props.configurationData.displayLogic) !== "[object Undefined]")
                _tempVar.displayLogic = this.props.configurationData.displayLogic;
            else
                _tempVar.displayLogic = true;
            
            if(Object.prototype.toString.call(this.props.configurationData.displayLogicRule) !== "[object Undefined]")
                _tempVar.displayLogicRule = this.props.configurationData.displayLogicRule;
            else
                _tempVar.displayLogicRule = "null";
            
            if(Object.prototype.toString.call(this.props.configurationData.displayLogicRuleDesc) !== "[object Undefined]")
                _tempVar.displayLogicRuleDesc = this.props.configurationData.displayLogicRuleDesc;
            else
                _tempVar.displayLogicRuleDesc = "";
            
            if(Object.prototype.toString.call(this.props.configurationData.displayPositionDetails) !== "[object Undefined]")
                _tempVar.displayPositionDetails = this.props.configurationData.displayPositionDetails;
            else
                _tempVar.displayPositionDetails = "Center";
            
            _tempVar.titleError = false;
            _tempVar.actionError = false;
            _tempVar.urlError = false;
            _tempVar.action = (this.props.configurationData.action ?this.props.configurationData.action:'Close page');
            
            this.setState(_tempVar);
        }
        
        /*if (this.props.showFieldConfiguration === true && prevProps.showFieldConfiguration === false){
            this.setState({ title: this.props.configurationData.title, titleError: false,actionError: false, action: (this.props.configurationData.action)?this.props.configurationData.action:'Close page', routeUrl: this.props.configurationData.routeUrl, urlError: false });
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
    onInputChanged = (event) => {
        let _tempVar = {};
        _tempVar[event.target.name] = event.target.value;
        if (event.target.name === 'title') {
            if (event.target.value !== "")
                _tempVar.titleError = false;
            else
                _tempVar.titleError = true;
        }
        else if (event.target.name === 'routeUrl') {
            if (event.target.value !== "")
                _tempVar.urlError = false;
            else
                _tempVar.urlError = true;
        }
        
        if(event.target.name === "displayLogicRule" && event.target.value !== "null"){
            this.fillRuleDesc(event.target.value);
        }
        
        this.setState(_tempVar);
    }
    
    fillRuleDesc = (ruleID) => {
        dataShare.getRuleByID(ruleID, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching rules information, please try after sometime.');
                return;
            }
            try{
                this.setState({displayLogicRuleDesc: JSON.stringify(response.ruleDetail.desc)});
            }catch(e){
                this.setState({displayLogicRuleDesc: JSON.stringify({})});
                console.error(e);
            }
        });
    }
    
    handleChange = (event) => {
        let _tempVar = {};
        _tempVar[event.target.name] = event.target.value;
        _tempVar.actionError = false;
        this.setState(_tempVar);
    };
    saveField = () => {
        if (this.state.title === "" || this.state.action === "" || (this.state.action === "Routing" && this.state.routeUrl === "")) {
            if (this.state.title === "")
                this.setState({ titleError: true });
            if(this.state.action === "")
                this.setState({actionError : true});
            if (this.state.action === "Routing" && this.state.routeUrl === "")
                this.setState({ urlError: true });
            return;
        }
        else {
            let btnConfig = {};
            btnConfig.title = this.state.title;
            btnConfig.action = this.state.action;
            btnConfig.routeUrl = this.state.routeUrl;
            btnConfig.inputType = "Button";
            btnConfig.displayLogic = this.state.displayLogic;
            btnConfig.displayLogicRule = this.state.displayLogicRule;
            btnConfig.displayLogicRuleDesc = this.state.displayLogicRuleDesc;
            btnConfig.displayPositionDetails = this.state.displayPositionDetails;
            
            this.props.saveBtnConfiguration(btnConfig);
        }
    }
    closeBtnConfig = () => {
        this.setState({ title: "", titleError: false, action: "", actionError:false, routeUrl: "", urlError: false });
        this.props.closeBtnConfig();
    }
    
    getButtonHelperText = () => {
        if(this.state.displayPositionDetails === "Center") return "Place the button in the Center of the page, at the bottom.";
        if(this.state.displayPositionDetails === "TopRight") return "Place the button top right side of page.";
        if(this.state.displayPositionDetails === "BottomRight") return "Place the button bottom right side of page.";
        if(this.state.displayPositionDetails === "BottomLeft") return "Place the button bottom left side of page.";
        return "";
    }
    render() {
        return (
            <Modal open={this.props.showFieldConfiguration} onClose={this.closeBtnConfig} >
                <div style={{ width: "100%", overflow: "auto", height: "100vh" }}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={10} md={9} lg={6} className="FC-Wrapper">
                            <div className="FC-Container">
                                <Hidden only={['xs']}>
                                    <span className="FC-CloseBtn" onClick={this.closeBtnConfig}>
                                        <i className="material-icons">clear</i>
                                    </span>
                                </Hidden>

                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <h2 className="FC-Header">Configure Button</h2>
                                    </Grid>
                                    <Grid item xs={12} className="FC-Body">
                                        <Grid container spacing={0}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="title"
                                                    value={this.state.title}
                                                    onChange={this.onInputChanged}
                                                    label="Title *"
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                {
                                                    this.state.titleError === true && <span className="required">Title is required.</span>
                                                }
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl component="fieldset" style={{ width: "100%", marginTop: "10px", marginBottom: "20px", textAlign: "left" }}>
                                                    <InputLabel>Button Position</InputLabel>
                                                    <Select className="selectBox" value={this.state.displayPositionDetails} name="displayPositionDetails" onChange={this.onInputChanged} fullWidth>
                                                        <MenuItem value="Center">Center</MenuItem>
                                                        <MenuItem value="TopRight">Top Right</MenuItem>
                                                        <MenuItem value="BottomRight">Bottom Right</MenuItem>
                                                        <MenuItem value="BottomLeft">Bottom Left</MenuItem>
                                                    </Select>
                                                    <FormHelperText>{this.getButtonHelperText()}</FormHelperText>
                                                </FormControl> 
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl component="fieldset">
                                                    {/* <FormLabel component="legend" style={{ fontSize: "14px" }}>Action *</FormLabel> */}
                                                    {/* <RadioGroup
                                                        aria-label="Actions"
                                                        name="action"
                                                        value={this.state.action}
                                                        onChange={this.handleChange}
                                                    >
                                                        <FormControlLabel value="Close page" control={<Radio className="appSecondaryClr" />} label="Close page" />
                                                        <FormControlLabel value="Routing" control={<Radio className="appSecondaryClr" />} label="Routing" />
                                                    </RadioGroup> */}
                                                    <span className="select_Box" >
                                                        <span className="BC-label">Action * : </span>                                                        
                                                        <Select className="select_Boxitem"  value={this.state.action} name="action" onChange={this.handleChange}>
                                                            {/*<MenuItem value="Close page"> Close page</MenuItem>*/}
                                                            <MenuItem value="Routing">Routing</MenuItem>
                                                            <MenuItem value="Submit to LOS">Submit to LOS</MenuItem>
                                                        </Select>
                                                    </span>  
                                                    {
                                                    this.state.actionError === true && <span className="required">Action is required.</span>
                                                    }
                                                </FormControl>    
                                            </Grid>
                                            {
                                                this.state.action === "Routing" &&
                                                <Grid item xs={12}>
                                                    <TextField
                                                        name="routeUrl"
                                                        value={this.state.routeUrl}
                                                        onChange={this.onInputChanged}
                                                        label="URL *"
                                                        fullWidth
                                                        margin="normal"
                                                    />
                                                    {
                                                        this.state.urlError === true && <span className="required">URL is required.</span>
                                                    }
                                                </Grid>
                                            }
                                        </Grid>
                                        
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

                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid container spacing={0}>
                                            <Grid item xs={12}>
                                                <div className="FC-Footer">
                                                    <Button variant="contained" className="cancelBtn appSecondaryClr" onClick={this.closeBtnConfig}>
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
