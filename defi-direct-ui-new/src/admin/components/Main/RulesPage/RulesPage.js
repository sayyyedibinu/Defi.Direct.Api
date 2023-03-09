import React from "react";
import {Link} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './RulesPageStyle.css';
import dataShare from "../../Common/dataShare";
import DisableModal from "../disableModal/disableModal";
import FooterPagination from "../../Common/FooterPagination/FooterPagination";
import config from "../../../resources/config.json";

const Switch_Theme = createMuiTheme({
   palette: {
       primary: {main: config.defaultSecondaryClr}
   }
});
let startIndex = 0
let endIndex = 0
export default class RulesPageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {rules: [], originalRules: JSON.stringify({}), showDisableModal: false, disableIndex: -1, searchText: "", showingFields: "All", currentPage: 0, recordsPerPage: '10', pageCount: 10,showManageList: false};
    }
    componentDidMount = () => {
        this.getRules(false);
    }
    getRules = (_force) => {
        dataShare.getRulesList(_force, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
                return;
            }
            this.setState({rules: response, originalRules: JSON.stringify(response)}, () => this.filterData());
        } );
    }
    editRule = (event, id) => {
        event.stopPropagation();
        this.props.history.push('/main/rule/update/'+id);
    }
    toggleRule = (_obj, index) => {
        let _tempVar = this.state.rules;
        if(_obj.ruleDetail.isActive === true){
            this.setState({disableIndex: index, showDisableModal: true});
            return;
        }else{
            _obj.ruleDetail.isActive = true;
            _tempVar[index] = _obj;
        }
        this.setState(_tempVar);
        this.updateDB(_tempVar[index]);
    }
    disableField = () => {
        let _tempVar = this.state.rules;
        _tempVar[this.state.disableIndex].ruleDetail.isActive = false;
        this.updateDB(_tempVar[this.state.disableIndex]);
        this.setState({rules: _tempVar, index: -1, showDisableModal: false});
    }
    updateDB = (data) => {
        dataShare.updateRule(data, (error, response) => {
            if(error){
                console.error(error);
                return;
            }
            this.getRules(true);
        } )
    }
    
    filterChanged = (event) => {
        let _tempVar = {};
        _tempVar[event.target.name] = event.target.value;
        _tempVar.recordsPerPage = "All";
        _tempVar.pageCount = 0;
        this.setState(_tempVar, () => this.filterData());
    }
    
    filterData = () => {
        let _tempVar = {};
        
        if(this.state.showingFields === "All") _tempVar.rules = JSON.parse(this.state.originalRules);
        if(this.state.showingFields === "Active"){
            let originalRules = JSON.parse(this.state.originalRules);
            let rules = [];
            for(let i = 0; i < originalRules.length; i++){
                if(originalRules[i].ruleDetail === null) originalRules[i].ruleDetail = {};
                if(originalRules[i].ruleDetail.isActive === true)
                    rules.push(originalRules[i]);
            }
            _tempVar.rules = rules;
        }
        if(this.state.showingFields === "Inactive"){
            let originalRules = JSON.parse(this.state.originalRules);
            let rules = [];
            for(let i = 0; i < originalRules.length; i++){
                if(originalRules[i].ruleDetail === null) originalRules[i].ruleDetail = {};
                if(originalRules[i].ruleDetail.isActive === false)
                    rules.push(originalRules[i]);
            }
            _tempVar.rules = rules;
        }
        
        try{
            _tempVar.rules = _tempVar.rules.filter((item) => {
              return (item.ruleName.toLowerCase().search(this.state.searchText.toLowerCase()) !== -1 );
            });
        }catch(e) {
            console.error(e);
        }

        this.setState(_tempVar);
    }
    
    handlePageChange = (_obj) => {
        console.log(_obj.selected);
        this.setState({currentPage: _obj.selected});
    }
    changeRecordsPerPage = (event) => {
        let _tempVar = {};
        _tempVar.recordsPerPage = event.target.value;
        if(_tempVar.recordsPerPage === 'All'){
            _tempVar.pageCount = 0;
            _tempVar.currentPage = 0;
        }else _tempVar.pageCount = 10;
        this.setState(_tempVar);
    }
    updateFromTo = (from, to) => {
        startIndex = (from === 1 ? 0 : from);
        endIndex = to -1;
        console.log(startIndex, endIndex)
    }
    getFrom = () => {
        return (this.state.recordsPerPage === 'All' ? 0 : this.state.currentPage * this.state.recordsPerPage)
    }
    getTo = () => {
        return (
            ( this.state.recordsPerPage === 'All' ? this.state.rules.length : (this.state.currentPage === 0 ? (1 * this.state.recordsPerPage) : ((this.state.currentPage + 1) * this.state.recordsPerPage)) ) > this.state.rules.length ? this.state.rules.length : ( this.state.recordsPerPage === 'All' ? this.state.rules.length : (this.state.currentPage === 0 ? (1 * this.state.recordsPerPage) : ((this.state.currentPage + 1) * this.state.recordsPerPage)) ) - 1
        )
    }
    
    toggleManageList = () => {
        this.setState({showManageList: !this.state.showManageList});
    }
    render(){
        return(
            <div className="MainWrapper">
                <DisableModal showModal={this.state.showDisableModal} closeModal={() => this.setState({index: -1, showDisableModal: false})} submitModal={this.disableField} entity={"rule"}/>

                <div className="fieldsContainer">
                    
                    <Grid container className="FSP-paginationWrapper">
                        <Grid item xs={12}>
                            <span className="FSP-paginationCnt">
                                <span><Link to="/main/configuration">Configuration </Link>/ </span>
                                Rules
                            </span>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item sm={8} xs={12} className="FP-filterCnt">
                            <TextField
                                name="searchText"
                                value={this.state.searchText}
                                onChange={this.filterChanged}
                                placeholder="Search Rules"
                                className="FP-filterCntMain"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start" className="FP-filterIconCnt">
                                      <i className="material-icons blueColor">search</i>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            <span className="selectBoxCnt">
                                <span className="FP-label">Showing: </span>
                                
                                <Select className="selectBox" value={this.state.showingFields} name="showingFields" onChange={this.filterChanged}>
                                    <MenuItem value="All">All Rules</MenuItem>
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Inactive">Inactive</MenuItem>
                                </Select>
                            </span>                            
                            
                        </Grid>
                       
                        <Grid item sm={4} xs={12}  className="FP-actionCnt">                                                      
                            <Link to="/main/rule/create/0">
                                <Button variant="contained" className="newFieldBtn appSecondaryBGClr">
                                    <i className="material-icons">add_circle</i>  New Rule
                                </Button>
                            </Link> 
                        </Grid>                       
                    </Grid>
                    
                </div>
                
                <div className="FP-tableCnt">
                    <Grid container>
                        
                        {
                            this.state.rules.length === 0 && 
                            <Grid item xs={12} className="FP-tableRow">
                                <Grid container>
                                    <Grid item xs={12} className="infoWrapper" style={{'textAlign': 'center'}}>
                                        <p className="infoHeader" style={{'marginTop': '10px'}}>No Rules Found</p>
                                    </Grid>
                                </Grid>
                            </Grid>
                        }
                        
                        {
                            this.state.rules.map( (_data, index) => {
                                if(this.state.recordsPerPage !== 'All'){
                                    if(index < this.getFrom() || index > this.getTo()) return ""
                                }
                                if(Object.prototype.toString.call(_data.ruleDetail) === "[object Object]"){
                                    _data.ruleDetail.isActive = ( Object.prototype.toString.call(_data.ruleDetail.isActive) === '[object Undefined]' ? true : _data.ruleDetail.isActive)
                                }else{
                                    _data.ruleDetail = {};
                                }
                                
                                return <Grid item xs={12} className={_data.ruleDetail.isActive === true ? "FP-tableRow" : "FP-tableRow fadeit"} key={_data.id}>
                                    <Grid container>
                                        
                                        <Grid item xs={12} sm={9} className="infoWrapper">
                                            <p className="infoHeader">{_data.ruleName}</p>
                                        </Grid>
                                        <Grid item xs={12} sm={3} className="actionWrapper">
                                            <span className="actionCnt" onClick={(event) => event.stopPropagation()}>
                                                <MuiThemeProvider theme={Switch_Theme}>
                                                    <Switch className="toggleBtn" checked={_data.ruleDetail.isActive} onChange={() => this.toggleRule(_data, index)} color="primary" />
                                                </MuiThemeProvider>
                                                <span className="actionIconCnt">
                                                    <i className="material-icons" onClick={(event) => this.editRule(event, _data.id)}>edit</i>  
                                                </span>
                                            </span>
                                            
                                        </Grid>
                                    </Grid>
                                </Grid>
                            } )
                        }

                    </Grid>
                </div>

                <FooterPagination pageCount={this.state.pageCount} dataSet={this.state.rules} recordsPerPage={this.state.recordsPerPage} currentPage={this.state.currentPage} handlePageChange={this.handlePageChange} changeRecordsPerPage={this.changeRecordsPerPage} />
                      
            </div>
        )
    }
}
