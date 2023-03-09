import React from "react";
import {Link} from "react-router-dom";

import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import _ from 'lodash';

import "./AddFieldsModal.css";
import dataShare from "../../Common/dataShare";

export default class AddFieldsModalComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {fieldsList: [], originalFieldsList: JSON.stringify([]), searchText: ""};
        this.refreshFieldList = this.refreshFieldList.bind(this);
    }
    componentDidMount = () => {
        this.getFieldList();
        dataShare.getFieldList(false, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
                return;
            }
            this.setState({fieldsList: response, originalFieldsList: JSON.stringify(response)});
        } );
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps.siteData === this.props.siteData) return;
    }
    getFieldList = () => {
        let _fieldId = [];
        if (this.props.selectedPage==="Application")        
         {
            for(let i = 0; i < this.props.siteData.site.fieldData.length; i++){
            for(let j = 0; j < this.props.siteData.site.fieldData[i].fields.length; j++)
                for(let k = 0; k < this.props.siteData.site.fieldData[i].fields[j].length; k++)
                    _fieldId.push(this.props.siteData.site.fieldData[i].fields[j][k].id);
            }
         }
        else if (this.props.selectedPage==="Decision")
        {
            for(let i = 0; i < this.props.siteData.site.decisionPageFieldData.length; i++)               
               {  _fieldId.push(this.props.siteData.site.decisionPageFieldData[i].id);
               }
                      
        }
        else
        {
            for(let i = 0; i < this.props.siteData.site.pendingPageFieldData.length; i++)               
            {  _fieldId.push(this.props.siteData.site.pendingPageFieldData[i].id);
            }
        }
        let fieldList = JSON.parse(this.state.originalFieldsList);
        if (this.props.selectedPage==="Application")   
        {
        fieldList = fieldList.filter( (field) => {
            return _fieldId.indexOf(field.options.id) === -1;
        })
        }
        else
        {
            fieldList = fieldList.filter( (field) => {
                return _fieldId.indexOf(field.options.id) === -1 && field.options.inputType.toLowerCase()==="checkbox";
            })
        }

        
        if(this.state.searchText !== ""){
            fieldList = fieldList.filter((item) => {
                    let _dataType = ( item.options.dataType === 'string' ? 'Alphanumeric' : item.options.dataType );
                    let _readonly = ( item.options.readonly === true ? 'Output' : 'Input' );
                  return (item.options.title.toLowerCase().search(
                    this.state.searchText.toLowerCase()) !== -1 || _dataType.toLowerCase().search(
                    this.state.searchText.toLowerCase()) !== -1 || _readonly.toLowerCase().search(
                    this.state.searchText.toLowerCase()) !== -1 || item.options.inputType.toLowerCase().search(
                    this.state.searchText.toLowerCase()) !== -1 );
                });
        }
        
        return fieldList;
    }
    inputChanged = (event) =>{
        let _temp = {};
        _temp[event.target.name] = event.target.value;
        this.setState(_temp);
    }
    fieldSelected = (data) =>{
        this.props.fieldSelected(data);
        this.setState({searchText: ""});
    }
    refreshFieldList(){
        dataShare.getFieldList(false, (error, response) => {
            if(error){
                this.props.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
                return;
            }
            this.setState({fieldsList: response, originalFieldsList: JSON.stringify(response)});
        } );
    }
    render(){
        return(
            <Modal className="AFModal"  open={this.props.showModal} onClose={this.props.closeModal} >
              <div  style={{width: "100%"}}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={10} md={9} lg={6} className="modalWrapper">
                        <div className="modalContainer">
                            <span className="modalCloseBtn" onClick={this.props.closeModal}>
                                <i className="material-icons">clear</i>
                            </span>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <h2 className="modalHeader1">Insert a Field</h2>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={0} className="AFModal-body">
                                        <Grid item sm={6} xs={12} >
                                            <TextField
                                                className="searchFilter"
                                                placeholder="Search Fields"
                                                name="searchText"
                                                value={this.state.searchText}
                                                onChange={this.inputChanged}
                                                InputProps={{
                                                  startAdornment: (
                                                    <InputAdornment position="start">
                                                      <i className="material-icons appPrimaryClr">search</i>
                                                    </InputAdornment>
                                                  ),
                                                }}
                                              />
                                        </Grid>
                                        <Grid item sm={6} xs={12} >
                                            <div className="AFModal-refresh">
                                                <Button  variant="contained" className="appSecondaryBGClr" onClick={this.refreshFieldList}>Refresh</Button>
                                            </div>  
                                            <div className="AFModal-footer">
                                                <Link to="/main/field/create/new" target="_blank">
                                                    <Button variant="contained" className="createFieldBtn appSecondaryBGClr"><i className="material-icons">add_circle</i>&nbsp;New Field</Button>
                                                </Link>
                                            </div>
                                        </Grid>

                                        <Grid item xs={12} >
                                            <hr className="divider" />
                                        </Grid>
                                        
                                        <Grid item xs={12}>
                                            <Grid container spacing={0} className="fieldListWrapper">
                                                {
                                                    this.getFieldList().map( (_data, index) => {
                                                        if(_data.options.isActive === false) return ""
                                                        /*if(_data.options.inputType === "Checkbox") return ""*/
                                                        return <Grid item xs={12} key={_data.id}>
                                                                <Grid container spacing={0} className="fieldListCnt">
                                                                    <Grid item xs={2}>
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
                                                                    <Grid item xs={8} className="infoWrapper">
                                                                        <p className="infoHeader">{_data.options.title}</p>
                                                                        <p className="infoDetails">Data type: {_data.options.dataType === 'string' ? 'Alphanumeric' : _.startCase(_data.options.dataType)} &nbsp; &nbsp; Field Type: {_data.options.readonly ? 'Output' : 'Input'}</p>
                                                                    </Grid>
                                                                    <Grid item xs={2}>
                                                                    <i title="Insert field to page" className="material-icons actionIcon blue" onClick={() => { this.props.fieldSelected(_data); this.setState({ searchText: "" }); }}>exit_to_app</i>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                    })
                                                }
                                            </Grid>
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