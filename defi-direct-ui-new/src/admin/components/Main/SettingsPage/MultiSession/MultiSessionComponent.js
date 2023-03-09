import React from "react";
import { Link } from "react-router-dom";
import "./MultiSessionStyle.css";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Draft, { rawToDraft, draftToRaw } from 'react-wysiwyg-typescript';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import config from "../../../../resources/config.json";
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import dataShare from "../../../Common/dataShare";

const Switch_Theme = createMuiTheme({
    palette: {
        primary: { main: config.defaultSecondaryClr }
    }
});

export default class MultiSessionComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = { settings: {}, createLogin: false, createManLogin: false, editApplication: false ,ruleList: [], editButtonDisplayLogic: "null", editButtonDisplayLogicDesc: ""};
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps.data !== this.props.data) {
            this.setState({
                title: this.props.data.title,
                settings: this.props.data.settings,
                editorState: (this.props.data.settings.footerText ? rawToDraft(this.props.data.settings.footerText) : ''),
                createLogin: ((Object.prototype.toString.call(this.props.data.settings.createLogin) !== '[object Undefined]') ? this.props.data.settings.createLogin : this.state.createLogin),
                createManLogin: ((Object.prototype.toString.call(this.props.data.settings.createManLogin) !== '[object Undefined]') ? this.props.data.settings.createManLogin : this.state.createManLogin),
                originalCreateManLogin: ((Object.prototype.toString.call(this.props.data.settings.createManLogin) !== '[object Undefined]') ? this.props.data.settings.createManLogin : this.state.createManLogin),
                disableCreateManLogin: (((Object.prototype.toString.call(this.props.data.settings.editApplication) !== '[object Undefined]') ? this.props.data.settings.editApplication : this.state.editApplication) === true &&
                    ((Object.prototype.toString.call(this.props.data.settings.createManLogin) !== '[object Undefined]') ? this.props.data.settings.createManLogin : this.state.createManLogin) === true) ? true : false,
                editApplication: ((Object.prototype.toString.call(this.props.data.settings.editApplication) !== '[object Undefined]') ? this.props.data.settings.editApplication : this.state.editApplication),
                editButtonDisplayLogic: ((Object.prototype.toString.call(this.props.data.settings.editButtonDisplayLogic) !== '[object Undefined]') ?  this.props.data.settings.editButtonDisplayLogic:this.state.editButtonDisplayLogic),
                editButtonDisplayLogicDesc: ((Object.prototype.toString.call(this.props.data.settings.editButtonDisplayLogicDesc) !== '[object Undefined]') ? this.props.data.settings.editButtonDisplayLogicDesc:this.state.editButtonDisplayLogicDesc)

            });
        }
       
    }
    componentDidMount = () => {
        this.getRuleList();
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
                this.setState({editButtonDisplayLogicDesc: JSON.stringify(response.ruleDetail.desc)});
                let _tempVar=this.state;
                _tempVar.settings["editButtonDisplayLogicDesc"]=this.state.editButtonDisplayLogicDesc;
                this.setState({_tempVar});
            }catch(e){
                this.setState({editButtonDisplayLogicDesc: JSON.stringify({})});
                console.error(e);
            }
        });
    }
    onInputChange = (event) => {
        this.props.handleDataChange();
        let _tempVar = this.state;
        if(event.target.name === 'createLogin')
        {
            this.state.createLogin=!this.state.createLogin
            _tempVar.settings[event.target.name] = this.state.createLogin;               
        }
        else if (event.target.name === 'editApplication') {
            this.state.disableCreateManLogin = false;
            this.state.editApplication = !this.state.editApplication
            _tempVar.settings[event.target.name] = this.state.editApplication;
            if (this.state.originalCreateManLogin === false) {
                this.state.createManLogin = this.state.editApplication;
                _tempVar.settings['createManLogin'] = this.state.editApplication;
            }
            if (this.state.editApplication === true && this.state.createManLogin === true) {
                this.state.disableCreateManLogin = true;
            }
            if (this.state.editApplication===false)
            {
                this.state.editButtonDisplayLogic="null";
                this.state.editButtonDisplayLogicDesc="";
                _tempVar.settings["editButtonDisplayLogicDesc"]='';
                _tempVar.settings["editButtonDisplayLogic"]="null";                         
                this.setState(_tempVar);;
            }
        }
        else if (event.target.name === 'createManLogin') {
            this.state.createManLogin = !this.state.createManLogin
            _tempVar.settings[event.target.name] = this.state.createManLogin;
            this.state.originalCreateManLogin = this.state.createManLogin;
        }

        if(event.target.name === "editButtonDisplayLogic" && event.target.value !== "null"){
            this.fillRuleDesc(event.target.value);
            this.state.editButtonDisplayLogic=event.target.value;
            _tempVar.settings["editButtonDisplayLogicDesc"]=this.state.editButtonDisplayLogicDesc;
            _tempVar.settings["editButtonDisplayLogic"]=event.target.value;
            this.setState({editButtonDisplayLogic: event.target.value});
            this.setState(_tempVar);
        }
        else if (event.target.name === "editButtonDisplayLogic" && event.target.value === "null"){
            _tempVar.settings["editButtonDisplayLogicDesc"]='';
            _tempVar.settings["editButtonDisplayLogic"]="null";
            this.state.editButtonDisplayLogic="null";           
            this.setState(_tempVar);
        }

   

    }
    saveMultiSession = (event, data) => {
        event.preventDefault();

        let _tempVar = this.state;
        if(Object.prototype.toString.call(_tempVar.settings["editButtonDisplayLogicDesc"]) === "[object Undefined]")
        {   
             _tempVar.settings["editButtonDisplayLogicDesc"]='';
            _tempVar.settings["editButtonDisplayLogic"]="null";
            this.state.editButtonDisplayLogic="null";
            this.state.editButtonDisplayLogicDesc='';
            this.setState(_tempVar);
    
        }
        this.setState(_tempVar, () => {
            this.props.saveSettings(this.props.data.title, this.state.settings);
        });
    }
    render(){
        return(
            <div className="MSPage">
                <form autoComplete="off" onSubmit={this.saveMultiSession}>
                    <div className="multisessionarea">
                        <MuiThemeProvider theme={Switch_Theme}> 
                            Do you want the user to create a login during app submission process? <Switch color="primary" name="createLogin" checked={this.state.createLogin} onChange={(event) => { this.onInputChange(event) }} />
                            <p className="tab"><sub>Enabling this option will let users save applications during the app submission process. If this option is disabled and the user quits the application during the submission process, application info will be lost. However, without enabling this option, you can still choose one of the below options to enable user logins.</sub></p>
                        </MuiThemeProvider>
                        <MuiThemeProvider theme={Switch_Theme}>
                            Do you want the user to create a mandatory login after submitting an app and before providing a decision? <Switch color="primary" name="createManLogin" disabled={this.state.disableCreateManLogin} checked={this.state.createManLogin} onChange={(event) => { this.onInputChange(event) }} />
                            <p className="tab"><sub>Enabling this option will mandate the user to create a login after app submission process but before viewing the next page (Pending page or Decision page). This option will be helpful in case you wish to send an email later with a URL to the user asking him to check the decision. Without this option, the user can review instant (auto decision) decisions but not subsequent decisions through defi DIRECT because there will be no secured way to display the information to the user through a web page. However, please note that you can still continue to send emails from LOS with decision info.</sub></p>
                        </MuiThemeProvider>
                        <MuiThemeProvider theme={Switch_Theme}>
                            Do you want the user to edit an application after submitting an application? <Switch color="primary" name="editApplication" checked={this.state.editApplication} onChange={(event) => { this.onInputChange(event) }} />
                            <p className="tab"><sub>Enabling this option will automatically enable the above option, if it is not already enabled. This is by design because to enable the option of editing original application, defi DIRECT has to save the application info and to do so, the user has to login (and provide consent) so that the application info can be stored securely and retrieved later on.</sub></p>
                                { 
                                this.state.editApplication &&
                                    <Grid item xs={12} className="DisplayLogic">
                                    <Grid container spacing={0}>                                    
                                        <Grid item xs={6}>
                                            <InputLabel>Select Rule</InputLabel>
                                                <Select className="selectBox" value={this.state.editButtonDisplayLogic} name="editButtonDisplayLogic" onChange={(event) => { this.onInputChange(event)}} fullWidth>
                                                    <MenuItem value="null">None</MenuItem>
                                                    {
                                                        this.state.ruleList.map( (rule, index) => {
                                                            return (
                                                            <MenuItem value={rule.id} key={index}>{rule.ruleName}</MenuItem>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                                <FormHelperText className="sliderhint">Select a rule to conditionally display “Edit Application” button. If no rule is selected, then “Edit Application” button is always visible.</FormHelperText>

                                        </Grid>
                                    </Grid>
                                    </Grid>   
                                }                    
                         </MuiThemeProvider>
                    </div>
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