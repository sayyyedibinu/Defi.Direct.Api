import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import config from "../../../../resources/config.json";
import './ModifyStepsModalStyle.css';
import dataShare from "../../../Common/dataShare";

const Switch_Theme = createMuiTheme({
    palette: {
        primary: { main: config.defaultSecondaryClr }
    }
});
export default class ModifyStepsModalComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {name: this.props.data, error: false, ruleList: [], displayLogic: true, displayLogicRule: "null", displayLogicRuleDesc: ""};
    }
    componentWillReceiveProps=()=>{
        this.setState({name: this.props.data,displayLogicRule:this.props.ModifyStepsModalData_obj.displayLogicRule});
    }
    componentDidMount = () => {
        this.getRuleList();
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps.data !== this.props.data) {
            this.setState({name: this.props.data, error: false});
        }
        if(this.props.action === 'add' && (prevProps.ModifyStepsModalData_obj !== this.props.ModifyStepsModalData_obj)){
            this.setState({displayLogic: true, displayLogicRule: "null", displayLogicRuleDesc: ""});
        }
        if(this.props.action !== 'add' && (prevProps.ModifyStepsModalData_obj !== this.props.ModifyStepsModalData_obj)){
            let _tempVar = {};
            
            if(Object.prototype.toString.call(this.props.ModifyStepsModalData_obj.displayLogic) !== "[object Undefined]"){
                _tempVar.displayLogic = this.props.ModifyStepsModalData_obj.displayLogic;
            }else{
                _tempVar.displayLogic = true;
            }
            
            if(Object.prototype.toString.call(this.props.ModifyStepsModalData_obj.displayLogicRule) !== "[object Undefined]"){
                _tempVar.displayLogicRule = this.props.ModifyStepsModalData_obj.displayLogicRule;
            }else{
                _tempVar.displayLogicRule = "null";
            }
            
            if(Object.prototype.toString.call(this.props.ModifyStepsModalData_obj.displayLogicRuleDesc) !== "[object Undefined]"){
                _tempVar.displayLogicRuleDesc = this.props.ModifyStepsModalData_obj.displayLogicRuleDesc;
            }else{
                _tempVar.displayLogicRuleDesc = "";
            }
            
            this.setState(_tempVar);
        }
       
    }
    inputOnChange = (event) =>{
        if (event.target.name === "name" || event.target.name === "displayLogic" || event.target.name === "displayLogicRule"){
            let _tempVar = {};
            _tempVar[event.target.name] = event.target.value;
            this.setState(_tempVar);   
        }
            
    }
    saveBtnClicked = () => {
        if(this.state.name === ''){
            this.setState({error: true});
            return;
        }
        // this.setState({name: "", error: false});
        this.setState({error: false});
        let _logicObj = {};
        _logicObj.displayLogic = this.state.displayLogic;
        _logicObj.displayLogicRule = this.state.displayLogicRule;
        if(this.state.displayLogicRule !== "null"){
            this.fillRuleDesc(this.state.displayLogicRule, (data) => {
                _logicObj.displayLogicRuleDesc = data;
                this.props.saveStep(this.state.name, this.props.action, _logicObj);
            })
        }else{
            this.props.saveStep(this.state.name, this.props.action, _logicObj);
        }
        
        
    }
    fillRuleDesc = (ruleID, callback) => {
        dataShare.getRuleByID(ruleID, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching rules information, please try after sometime.');
                return;
            }
            try{
                callback(JSON.stringify(response.ruleDetail.desc));
            }catch(e){
                console.error(e);
                callback(JSON.stringify({}));
            }
        });
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
    
    render(){
        return(
            <Modal aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" open={this.props.showModal} onClose={this.props.closeModal} >
              <div style={{width: "100%"}}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={10} md={9} lg={6} className="createModalWrapper">
                        <div className="createModalContainer">
                            <span className="createModalCloseBtn" onClick={this.props.closeModal}>
                                <i className="material-icons">clear</i>
                            </span>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <h2 className="createModalHeader1">{this.props.action === 'add' ? 'Insert Step' : (this.props.action === 'edit' ? 'Update Step' : 'Are You Sure to Delete ' + this.state.name +' ?')}</h2>
                                </Grid>
                                <Grid item xs={12}>
                                    <div className="createModalTitleBox">
                                        {
                                            this.props.action !== 'delete' &&  
                                            <TextField label="Name Your Step" InputLabelProps={{ shrink: true }} placeholder="Enter Step name" fullWidth margin="normal" value={this.state.name ? this.state.name : ''} name="name" onChange={this.inputOnChange} />
                                        } 
                                        {
                                            this.props.action === 'delete' &&
                                                <div className="alignCenter">Deleting step will delete all the components attached to it.</div>
                                        }
                                        {
                                            this.state.error && <span className="errorMessage">Step title required</span>
                                        }
                                    </div>
                                </Grid>

                                {
                                     this.props.action !== 'delete' && 
                                     <Grid item xs={12} className="displayLogicCnt">
                                        <Grid container spacing={0}>
                                            <Grid item xs={6}>

                                                <MuiThemeProvider theme={Switch_Theme}>
                                                    Display Logic
                                                    <Switch className="toggleBtn" color="primary" checked={this.state.displayLogic} onChange={() => this.setState({ displayLogic: !this.state.displayLogic, displayLogicRule: "null" })} />
                                                </MuiThemeProvider>

                                            </Grid>
                                            <Grid item xs={6}>
                                                <InputLabel>Select Rule</InputLabel>
                                                    <Select className="selectBox" value={this.state.displayLogicRule} name="displayLogicRule" onChange={this.inputOnChange} fullWidth disabled={this.state.displayLogic === false}>
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
                                }
                                

                                <Grid item xs={12}>
                                    <div className="addPageModalFooter">
                                        <Button variant="contained" className="cancelBtn appSecondaryClr" onClick={this.props.closeModal}>
                                            Cancel
                                        </Button>
                                        <Button variant="contained" className={this.props.action === 'delete'? "deleteBtn" : "startBtn appSecondaryBGClr"} onClick={this.saveBtnClicked}>
                                            {this.props.action === 'add' ? 'Insert' : (this.props.action === 'edit' ? 'Save' : 'Delete')}
                                        </Button>
                                    </div>
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
