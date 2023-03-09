import React from "react";
import {Link} from "react-router-dom";
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import config from "../../../resources/config.json";
import dataShare from "../../Common/dataShare";
import './RulePageStyle.css';

const Switch_Theme = createMuiTheme({
   palette: {
       primary: {main: config.defaultSecondaryClr}
   }
});
export default class RulePageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {fieldsList: [], ruleName: "", ruleDetail: {isActive: true, desc: { if: [], then: []}}, field1: "Select Criteria Field", field2: "isActive", field3: "Select Criteria Field", activeRuleRHS: "field"};
    }
    componentDidMount = () => {
        dataShare.getFieldList(false, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
                return;
            }
            if(response.length > 0){
                let fieldList = response.filter((_field) => {
                    if(_field.options) return _field.options.isActive === true;
                })
                this.setState({fieldsList: fieldList});
            }
            
        } );
    }
    inputOnChange = (event) => {
        let _tempVar = {};
        _tempVar[event.target.name] = event.target.value;
        this.setState(_tempVar);
    }
    toggeleStatus = () => {
        let _tempVar = this.state.ruleDetail;
        _tempVar.isActive = !_tempVar.isActive;
        this.setState(_tempVar);
    }
    saveField = () => {
        
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
                                    <Switch className="toggleBtn" checked={this.state.ruleDetail.isActive} onChange={this.toggleStatus} color="primary" />
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
                            <Grid container className="ruleMainCnt">
                                <Grid item sm={1} className="ruleIndicatorCnt">
                                    <Button variant="contained" className="rulesIndicatorBtn appSecondaryBGClr">
                                        IF
                                    </Button>
                                </Grid>
                                <Grid item sm={11} className="ruleDescCnt">
            
                                    <Grid container>
            
                                        <Grid item xs={12} sm={2} className="ruleItems">
                                            {/*<InputLabel>Select Field *</InputLabel>*/}
                                            <Select className="selectBox" name="fieldType" fullWidth name="field1" title={this.state.field1} value={this.state.field1} onChange={this.inputOnChange}>
                                                <MenuItem value="Select Criteria Field">Select Criteria Field</MenuItem>
                                                {
                                                    this.state.fieldsList.map( (_field) => {
                                                        return <MenuItem value={_field.options.id}>{_field.options.title}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </Grid>
            
                                        <Grid item xs={12} sm={2} className="ruleItems">
                                            {/*<InputLabel>Select Operator *</InputLabel>*/}
                                            <Select className="selectBox" name="fieldType" fullWidth name="field2" title={this.state.field2} value={this.state.field2} onChange={this.inputOnChange}>
                                                <MenuItem value="isActive">is Active</MenuItem>
                                                <MenuItem value="isInActive">is InActive</MenuItem>
                                                <MenuItem value="equalto">Equal to</MenuItem>
                                                <MenuItem value="notEqualTo">Not Equal to</MenuItem>
                                                <MenuItem value="isGreaterThan">is greater than</MenuItem>
                                                <MenuItem value="isgreaterThanOrEqualTo">is greater than or equal to</MenuItem>
                                                <MenuItem value="isLessThan">is less than</MenuItem>
                                                <MenuItem value="isLessThanOrEqualTo">is less than or equal to</MenuItem>
                                            </Select>
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={2} className="ruleItems">
                                            <span className="ruleIconCnt">
                                                <i className="material-icons useField" onClick={() => this.setState({activeRuleRHS: "field"})}>note_add</i>
                                                <i className="useStatic" onClick={() => this.setState({activeRuleRHS: "static"})}>123</i>
                                                <i className={this.state.activeRuleRHS === "field" ? "material-icons fieldActive" : "material-icons staticActive"}>check</i>
                                            </span>
                                            {
                                                this.state.activeRuleRHS === "field" && 
                                                <Select className="selectBox" name="fieldType" fullWidth name="field3" title={this.state.field3} value={this.state.field3} onChange={this.inputOnChange}>
                                                    <MenuItem value="Select Criteria Field">Select Criteria Field</MenuItem>
                                                    {
                                                        this.state.fieldsList.map( (_field) => {
                                                            return <MenuItem value={_field.options.id}>{_field.options.title}</MenuItem>
                                                        })
                                                    }
                                                </Select>
                                            }
                                            {
                                                this.state.activeRuleRHS === "static" && 
                                                <TextField type="number" className="inputBox" value={0}/>
                                            }
                                        </Grid>
            
                                    </Grid>
            
                                    <Button variant="contained" className="rulesIndicatorBtn appSecondaryBGClr addGroupBnt">
                                        + Group 
                                    </Button>
                                </Grid>{/*End of ruleDescCnt*/}
                                
                            </Grid>{/*End of ruleCnt*/}
            
                            <Button variant="contained" className="rulesIndicatorBtn appSecondaryBGClr addConditionBnt">
                                + Condition 
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
