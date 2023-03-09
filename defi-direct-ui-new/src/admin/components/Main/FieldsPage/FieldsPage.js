import React from "react";
import {Link} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import _ from 'lodash';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './FieldsPageStyle.css';
import dataShare from "../../Common/dataShare";
import DisableModal from "../disableModal/disableModal";
import FooterPagination from "../../Common/FooterPagination/FooterPagination";
import ManageList from "../ManageList/ManageList";
import config from "../../../resources/config.json";
import axios from 'axios';

const Switch_Theme = createMuiTheme({
   palette: {
       primary: {main: config.defaultSecondaryClr}
   }
});
let startIndex = 0
let endIndex = 0
export default class FieldsPageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {fields: [], originalFields: JSON.stringify({}), showDisableModal: false, disableIndex: -1, searchText: "", showingFields: "All", currentPage: 0, recordsPerPage: '10', pageCount: 10,showManageList: false};
    }
    componentDidMount = () => {
        this.getFields(false);
    }
    /*componentWillUnmount = () => {
        this.setState({fields: []});
    }*/
    getFields = (_force) => {
        dataShare.getFieldList(_force, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
                return;
            }
            this.setState({fields: response, originalFields: JSON.stringify(response)}, () => this.filterData());
        } );
    }
    editField = (event, id) => {
        event.stopPropagation();
        this.props.history.push('/main/field/update/'+id);
    }
    toggleField = (_obj, index) => {
        let _tempVar = this.state.fields;
        if(_obj.options.isActive === true){
            this.setState({disableIndex: index, showDisableModal: true});
            return;
            /*if(window.confirm('Are you sure to disable the field?')){
                _obj.isActive = false;
                _tempVar[index] = _obj;
            }*/
        }else{
            _obj.options.isActive = true;
            _tempVar[index] = _obj;
        }
        this.setState(_tempVar);
        this.updateDB(_tempVar[index]);
    }
    disableField = () => {
        let _tempVar = this.state.fields;
        _tempVar[this.state.disableIndex].options.isActive = false;
        this.updateDB(_tempVar[this.state.disableIndex]);
        this.setState({fields: _tempVar, index: -1, showDisableModal: false});
    }
    updateDB = (data) => {
        dataShare.updateField(data, (error, response) => {
            if(error){
                console.error(error);
                return;
            }
            this.getFields(true);
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
        
        if(this.state.showingFields === "All") _tempVar.fields = JSON.parse(this.state.originalFields);
        if(this.state.showingFields === "Active"){
            let originalFields = JSON.parse(this.state.originalFields);
            let fields = [];
            for(let i = 0; i < originalFields.length; i++){
                if(originalFields[i].options.isActive === true)
                    fields.push(originalFields[i]);
            }
            _tempVar.fields = fields;
        }
        if(this.state.showingFields === "Inactive"){
            let originalFields = JSON.parse(this.state.originalFields);
            let fields = [];
            for(let i = 0; i < originalFields.length; i++){
                if(originalFields[i].options.isActive === false)
                    fields.push(originalFields[i]);
            }
            _tempVar.fields = fields;
        }
        
        try{
            _tempVar.fields = _tempVar.fields.filter((item) => {
                let _dataType = ( item.options.dataType === 'string' ? 'Alphanumeric' : item.options.dataType );
                let _readonly = ( item.options.readonly === true ? 'Output' : 'Input' );
              return (item.options.title.toLowerCase().search(
                this.state.searchText.toLowerCase()) !== -1 || _dataType.toLowerCase().search(
                this.state.searchText.toLowerCase()) !== -1 || _readonly.toLowerCase().search(
                this.state.searchText.toLowerCase()) !== -1 || item.options.inputType.toLowerCase().search(
                this.state.searchText.toLowerCase()) !== -1 );
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
            ( this.state.recordsPerPage === 'All' ? this.state.fields.length : (this.state.currentPage === 0 ? (1 * this.state.recordsPerPage) : ((this.state.currentPage + 1) * this.state.recordsPerPage)) ) > this.state.fields.length ? this.state.fields.length : ( this.state.recordsPerPage === 'All' ? this.state.fields.length : (this.state.currentPage === 0 ? (1 * this.state.recordsPerPage) : ((this.state.currentPage + 1) * this.state.recordsPerPage)) ) - 1
        )
    }
    getFieldLists = () => {
        axios.get(config.API_BASE_URL+'FieldLists').then( (response) => {
            let _tempvar = {};
            _tempvar.FieldLists = response.data;
            if(response.data.length > 0) _tempvar.dropdownList = response.data[0].id;
            this.setState(_tempvar);
        }, (error) => {
            console.error(error);
        });
    }
    toggleManageList = () => {
        this.setState({showManageList: !this.state.showManageList});
    }
    render(){
        return(
            <div className="MainWrapper">
                <DisableModal showModal={this.state.showDisableModal} closeModal={() => this.setState({index: -1, showDisableModal: false})} submitModal={this.disableField} entity={"field"} />
                <ManageList refreshFieldList={this.getFieldLists} showManageList={this.state.showManageList} toggleManageList={this.toggleManageList} showNotification={this.props.showNotification} />

                <div className="fieldsContainer">
                    
                    <Grid container className="FSP-paginationWrapper">
                        <Grid item xs={12}>
                            <span className="FSP-paginationCnt">
                                <span><Link to="/main/configuration">Configuration </Link>/ </span>
                                Fields
                            </span>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item sm={8} xs={12} className="FP-filterCnt">
                            <TextField
                                name="searchText"
                                value={this.state.searchText}
                                onChange={this.filterChanged}
                                placeholder="Search Fields"
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
                                    <MenuItem value="All">All Fields</MenuItem>
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Inactive">Inactive</MenuItem>
                                </Select>
                            </span>                            
                            
                        </Grid>
                       
                        <Grid item sm={4} xs={12}  className="FP-actionCnt">                                                      
                            <Link to="/main/field/create/new">
                                <Button variant="contained" className="newFieldBtn appSecondaryBGClr">
                                    <i className="material-icons">add_circle</i>  New Field
                                </Button>
                            </Link> 
                            <Button variant="contained" className="manageListFieldBtn appSecondaryBGClr" onClick={this.toggleManageList}>
                                Manage Lists
                            </Button> 
                        </Grid>                       
                    </Grid>
                    
                </div>
                
                <div className="FP-tableCnt">
                    <Grid container>
                        
                        {
                            this.state.fields.length === 0 && 
                            <Grid item xs={12} className="FP-tableRow">
                                <Grid container>
                                    <Grid item xs={12} className="infoWrapper" style={{'textAlign': 'center'}}>
                                        <p className="infoHeader" style={{'marginTop': '10px'}}>No Fields Found</p>
                                    </Grid>
                                </Grid>
                            </Grid>
                        }
                        
                        {
                            this.state.fields.map( (_data, index) => {
                                
                                if(this.state.recordsPerPage !== 'All'){
                                    if(index < this.getFrom() || index > this.getTo()) return ""
                                }
                                _data.options.isActive = ( Object.prototype.toString.call(_data.options.isActive) === '[object Undefined]' ? true : _data.options.isActive)
                                
                                return <Grid item xs={12} className={_data.options.isActive === true ? "FP-tableRow" : "FP-tableRow fadeit"} key={_data.id}>
                                    <Grid container>
                                        <Grid item xs={12}  sm={1} className="iconWrapper">
                                            <span className="iconCnt">
                                                {
                                                    _data.options.inputType === "Text Input" && 
                                                    <i className="material-icons">text_fields</i>
                                                }
                                                {
                                                    _data.options.inputType === "Dropdown" && 
                                                    <i className="material-icons">arrow_drop_down_circle</i>
                                                }
                                                {
                                                    _data.options.inputType === "Checkbox" && 
                                                    <i className="material-icons">check_circle</i>
                                                }
                                                {
                                                    _data.options.inputType === "Listbox" && 
                                                    <i className="material-icons">check_box</i>
                                                }
                                                
                                            </span>

                                        </Grid>
                                        <Grid item xs={12} sm={8} className="infoWrapper">
                                            <p className="infoHeader">{_data.options.title}</p>
                                            <p className="infoDetails">Data type: {_data.options.dataType === 'string' ? 'Alphanumeric' : _.startCase(_data.options.dataType)} &nbsp; &nbsp; Field Type: {_data.options.readonly ? 'Output' : 'Input'}</p>
                                        </Grid>
                                        <Grid item xs={12} sm={3} className="actionWrapper">
                                            <span className="actionCnt" onClick={(event) => event.stopPropagation()}>
                                                <MuiThemeProvider theme={Switch_Theme}>
                                                    <Switch className="toggleBtn" checked={_data.options.isActive} onChange={() => this.toggleField(_data, index)} color="primary" />
                                                </MuiThemeProvider>
                                                <span className="actionIconCnt">
                                                    <i className="material-icons" onClick={(event) => this.editField(event, _data.id)}>edit</i>  
                                                </span>
                                            </span>
                                            
                                        </Grid>
                                    </Grid>
                                </Grid>
                            } )
                        }

                    </Grid>
                </div>

                <FooterPagination pageCount={this.state.pageCount} dataSet={this.state.fields} recordsPerPage={this.state.recordsPerPage} currentPage={this.state.currentPage} handlePageChange={this.handlePageChange} changeRecordsPerPage={this.changeRecordsPerPage} />
                      
            </div>
        )
    }
}

/*{
                                                    _data.fieldType === "DateTime" && 
                                                    <i className="material-icons">insert_invitation</i>
                                                }*/
/*<span className="actionCnt" onClick={(event) => this.editField(event, _data.id)}>
                                                <i className="material-icons">edit</i>
                                            </span>*/

/*<Grid item xs={12} className="FP-tableRow">
                            <Grid container>
                                <Grid item xs={12}  sm={1} className="iconWrapper">
                                    <span className="iconCnt">
                                        <i className="material-icons">insert_invitation</i>
                                    </span>
                                    
                                </Grid>
                                <Grid item xs={12} sm={8} className="infoWrapper">
                                    <p className="infoHeader">Field Title Example</p>
                                    <p className="infoDetails">Data type: String &nbsp; &nbsp; Field Type: Input</p>
                                </Grid>
                                <Grid item xs={12} sm={3} className="actionWrapper">
                                    <span className="actionCnt2">
                                        <i className="material-icons">visibility_off</i>
                                    </span>
                                    <span className="actionCnt">
                                        <i className="material-icons">edit</i>
                                    </span>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} className="FP-tableRow">
                            <Grid container>
                                <Grid item xs={12}  sm={1} className="iconWrapper">
                                    <span className="iconCnt">
                                        <i className="material-icons">text_fields</i>
                                    </span>
                                    
                                </Grid>
                                <Grid item xs={12} sm={8} className="infoWrapper">
                                    <p className="infoHeader">Field Title Example</p>
                                    <p className="infoDetails">Data type: String &nbsp; &nbsp; Field Type: Input</p>
                                </Grid>
                                <Grid item xs={12} sm={3} className="actionWrapper">
                                    <span className="actionCnt2">
                                        <i className="material-icons">visibility</i>
                                    </span>
                                    <span className="actionCnt">
                                        <i className="material-icons">edit</i>
                                    </span>
                                </Grid>
                            </Grid>
                        </Grid>
                        
                        <Grid item xs={12} className="FP-tableRow">
                            <Grid container>
                                <Grid item xs={12}  sm={1} className="iconWrapper">
                                    <span className="iconCnt">
                                        <i className="material-icons">arrow_drop_down_circle</i>
                                    </span>
                                    
                                </Grid>
                                <Grid item xs={12} sm={8} className="infoWrapper">
                                    <p className="infoHeader">Field Title Example</p>
                                    <p className="infoDetails">Data type: String &nbsp; &nbsp; Field Type: Input</p>
                                </Grid>
                                <Grid item xs={12} sm={3} className="actionWrapper">
                                    <span className="actionCnt2">
                                        <i className="material-icons">visibility</i>
                                    </span>
                                    <span className="actionCnt">
                                        <i className="material-icons">edit</i>
                                    </span>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} className="FP-tableRow">
                            <Grid container>
                                <Grid item xs={12}  sm={1} className="iconWrapper">
                                    <span className="iconCnt">
                                        <i className="material-icons">arrow_drop_down_circle</i>
                                    </span>
                                    
                                </Grid>
                                <Grid item xs={12} sm={8} className="infoWrapper">
                                    <p className="infoHeader">Field Title Example</p>
                                    <p className="infoDetails">Data type: String &nbsp; &nbsp; Field Type: Input</p>
                                </Grid>
                                <Grid item xs={12} sm={3} className="actionWrapper">
                                    <span className="actionCnt2">
                                        <i className="material-icons">visibility</i>
                                    </span>
                                    <span className="actionCnt">
                                        <i className="material-icons">edit</i>
                                    </span>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} className="FP-tableRow">
                            <Grid container>
                                <Grid item xs={12}  sm={1} className="iconWrapper">
                                    <span className="iconCnt">
                                        <i className="material-icons">insert_invitation</i>
                                    </span>
                                    
                                </Grid>
                                <Grid item xs={12} sm={8} className="infoWrapper">
                                    <p className="infoHeader">Field Title Example</p>
                                    <p className="infoDetails">Data type: String &nbsp; &nbsp; Field Type: Input</p>
                                </Grid>
                                <Grid item xs={12} sm={3} className="actionWrapper">
                                    <span className="actionCnt2">
                                        <i className="material-icons">visibility_off</i>
                                    </span>
                                    <span className="actionCnt">
                                        <i className="material-icons">edit</i>
                                    </span>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} className="FP-tableRow">
                            <Grid container>
                                <Grid item xs={12}  sm={1} className="iconWrapper">
                                    <span className="iconCnt">
                                        <i className="material-icons">text_fields</i>
                                    </span>
                                    
                                </Grid>
                                <Grid item xs={12} sm={8} className="infoWrapper">
                                    <p className="infoHeader">Field Title Example</p>
                                    <p className="infoDetails">Data type: String &nbsp; &nbsp; Field Type: Input</p>
                                </Grid>
                                <Grid item xs={12} sm={3} className="actionWrapper">
                                    <span className="actionCnt2">
                                        <i className="material-icons">visibility</i>
                                    </span>
                                    <span className="actionCnt">
                                        <i className="material-icons">edit</i>
                                    </span>
                                </Grid>
                            </Grid>
                        </Grid>
                        
                        <Grid item xs={12} className="FP-tableRow">
                            <Grid container>
                                <Grid item xs={12}  sm={1} className="iconWrapper">
                                    <span className="iconCnt">
                                        <i className="material-icons">arrow_drop_down_circle</i>
                                    </span>
                                    
                                </Grid>
                                <Grid item xs={12} sm={8} className="infoWrapper">
                                    <p className="infoHeader">Field Title Example</p>
                                    <p className="infoDetails">Data type: String &nbsp; &nbsp; Field Type: Input</p>
                                </Grid>
                                <Grid item xs={12} sm={3} className="actionWrapper">
                                    <span className="actionCnt2">
                                        <i className="material-icons">visibility</i>
                                    </span>
                                    <span className="actionCnt">
                                        <i className="material-icons">edit</i>
                                    </span>
                                </Grid>
                            </Grid>
                        </Grid>*/