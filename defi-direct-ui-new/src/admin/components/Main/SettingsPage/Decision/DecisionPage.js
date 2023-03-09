import React from "react";
import {Link} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import dataShare from "../../../Common/dataShare";
import "./DecisionPageStyle.css";

// const Switch_Theme = createMuiTheme({
//     palette: {
//         primary: {main: config.defaultSecondaryClr}
//     }
//  });
export default class VersionsPageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {ruleList: [], decisionPageDisplayLogic: "null", decisionPageDisplayLogicDesc: ""};
        
    }
    componentDidMount = () => {
        this.getRuleList();
    }
    componentDidUpdate = (prevProp) => {
        if(prevProp.data.settings !== this.props.data.settings){
            let _tempVar = {};
            if(Object.prototype.toString.call(this.props.data.settings.decisionPageDisplayLogic) !== "[object Undefined]")
                _tempVar.decisionPageDisplayLogic = this.props.data.settings.decisionPageDisplayLogic;
            else
                _tempVar.decisionPageDisplayLogic = "null";
            if(Object.prototype.toString.call(this.props.data.settings.decisionPageDisplayLogicDesc) !== "[object Undefined]")
                _tempVar.decisionPageDisplayLogicDesc = this.props.data.settings.decisionPageDisplayLogicDesc;
            else
                _tempVar.decisionPageDisplayLogicDesc = "";
            
            this.setState(_tempVar);
        }
        /*console.log(this.props.data.settings);*/
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
    
    fillRuleDesc = (ruleID) => {
        dataShare.getRuleByID(ruleID, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching rules information, please try after sometime.');
                return;
            }
            try{
                this.setState({decisionPageDisplayLogicDesc: JSON.stringify(response.ruleDetail.desc)});
            }catch(e){
                this.setState({decisionPageDisplayLogicDesc: JSON.stringify({})});
                console.error(e);
            }
        });
    }
    
    onInputChanged = (event) => {
        let _tempVar = {};
        _tempVar[event.target.name] = event.target.value;
        this.setState(_tempVar);
        
        if(event.target.name === "decisionPageDisplayLogic" && event.target.value !== "null"){
            this.fillRuleDesc(event.target.value);
        }
        else if (event.target.name === "decisionPageDisplayLogic" && event.target.value === "null"){
            this.setState({decisionPageDisplayLogicDesc: ''});
            this.state.decisionPageDisplayLogicDesc='';
        }
        this.props.handleDataChange();
    }
    saveDecisionPage = (event) => {
        event.preventDefault();
        let _postData = this.props.data.settings;
        _postData.decisionPageDisplayLogic = this.state.decisionPageDisplayLogic;
        _postData.decisionPageDisplayLogicDesc = this.state.decisionPageDisplayLogicDesc;
        this.props.saveSettings(this.props.data.title, _postData);
    }
    render(){
        const { anchorEl } = this.state;
        return(
            <div className="decisionPage">
                <form autoComplete="off" onSubmit={this.saveDecisionPage}>
                    <Grid container>
                        <Grid item sm={12} xs={12}>
                            <FormControl>
                                <InputLabel>Select Rule</InputLabel>
                                <Select className="selectBox" value={this.state.decisionPageDisplayLogic} name="decisionPageDisplayLogic" onChange={this.onInputChanged} fullWidth disabled={this.state.displayLogic === false}>
                                    <MenuItem value="null">None</MenuItem>
                                    {
                                        this.state.ruleList.map( (rule, index) => {
                                          return (
                                            <MenuItem value={rule.id} key={index}>{rule.ruleName}</MenuItem>
                                          )
                                        })
                                    }
                                </Select>
                                <FormHelperText>Please select a rule to conditionally display Decision page. By default, the application will route to Pending page but if the conditions in the selected rule are met, then the application will route to Decision page</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
            
                    <div className="footerBtnCnt">
                        <Button className="cancelBtn appSecondaryClr">
                            <Link to="/main/sites">Cancel</Link>
                        </Button>
                        <Button type="submit" variant="contained" className="saveBtn appSecondaryBGClr">Save Settings</Button>
                    </div>
                </form>
            </div>
        )
    }
}