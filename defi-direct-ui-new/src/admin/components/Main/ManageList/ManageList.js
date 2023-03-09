import React from "react";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import ReactPaginate from 'react-paginate';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ReactDragList from 'react-drag-list';
import Grid from '@material-ui/core/Grid';

import './ManageListStyle.css';
import ManageOptionModal from './ManageOptionModal/ManageOptionModal';
import dataShare from "../../Common/dataShare";

export default class ManageListComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            mode: 'list',
            order: 'asc',
            orderBy: 'name',
            optionsOrder: 'asc',
            optionsOrderBy: 'display',
            dropdownList: [],
            originalDropdownList: JSON.stringify({}),
            currentPage: 0,
            currentOptionsPage: 0,
            recordsPerPage: 10,
            filterText: '',
            saveList: {name: '', fieldListItems: []},
            showModal: false,
            modalMode: 'create',
            modalRefIndex: -1,
            modalData: {title: '', value: ''},
            FieldNames: []
        };
    }
    openModal = () =>{
        this.setState({showModal: true});
    }
    closeModal = () =>{
        this.setState({showModal: false});
    }
    saveBtnClicked = (_data) => {
        let _tempVar =this.state.saveList;
        console.log(_data);
        console.log(this.state.modalRefIndex);
        
        if(this.state.modalMode !== 'delete') {
            for(let i = 0; i < _tempVar.fieldListItems.length; i++){
                if(this.state.modalRefIndex === i) continue;
                if(_tempVar.fieldListItems[i].display.toLowerCase() === _data.title.toLowerCase()){
                    this.props.showNotification('warning', 'Label '+ _data.title + ' already exists.');
                    return;
                }
                if(_tempVar.fieldListItems[i].value && _tempVar.fieldListItems[i].value.toLowerCase() === _data.value.toLowerCase()){
                    this.props.showNotification('warning', 'Value '+ _data.value + ' already exists.');
                    return;
                }
            }
        }
        
        /*return;
        console.log(this.state.modalMode);
        console.log(this.state.modalRefIndex);*/
        
        if(this.state.modalMode === 'create'){
            _tempVar.fieldListItems.push({
                display: _data.title, 
                value: _data.value
            });
        }
        if(this.state.modalMode === 'update'){
            console.log(_tempVar.fieldListItems[this.state.modalRefIndex])
            _tempVar.fieldListItems[this.state.modalRefIndex]['display'] = _data.title;
            _tempVar.fieldListItems[this.state.modalRefIndex]['value'] = _data.value;
        }
        if(this.state.modalMode === 'delete'){
            _tempVar.fieldListItems.splice(this.state.modalRefIndex, 1);
        }
        this.setState({saveList: _tempVar});
        this.closeModal();
    }
    componentDidMount = () => {
        this.getDropdownList();
    }
    componentDidUpdate = (prevProps) => {
        if (this.props.showManageList === prevProps.showManageList) return;
        if (this.props.showManageList === true) this.getDropdownList();
    }

    getDropdownList = () => {
        dataShare.getDropdownLists((error, response) => {
            if (error) {
                this.props.showNotification('error', 'Internal server error while fetching Field Lists.');
                return;
            }
            this.setState({
                dropdownList: response,
                originalDropdownList: JSON.stringify(response)
            });
        })
    }

    desc = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }
    getSorting = (order, orderBy) => {
        return order === 'desc' ? (a, b) => this.desc(a, b, orderBy) : (a, b) => -this.desc(a, b, orderBy);
    }
    handlePageChange = (_obj) =>{
        this.setState({currentPage: _obj.selected});
    }
    
    onFilterChange = (event) => {
        let dropdownList = JSON.parse(this.state.originalDropdownList);
        dropdownList = dropdownList.filter((item) => {
                  return (item.name.toLowerCase().search(
                    event.target.value.toLowerCase()) !== -1);
                })
        this.setState({filterText: event.target.value, dropdownList: dropdownList});
    }
    
    getViewTemplate = () => {
        return (
        <div className="ML-viewContainer">
            <div className="manageListHeader">
                Manage Lists
                <i className="material-icons" onClick={this.props.toggleManageList}>close</i>
            </div>

            <p className="ML-desc1">Manage your current lists</p>
            <p className="ML-desc2">Click on a list name in the table below to edit it </p>

            <div className="ML-tableWrapper">
                <div className="ML-tableAction">
                    <Input
                        placeholder="Filter Lists"
                        value={this.state.filterText}
                        onChange={this.onFilterChange}
                          startAdornment={
                            <InputAdornment position="start">
                              <i className="material-icons">filter_list</i>
                            </InputAdornment>
                          }
                    />
                    <Button variant="contained" className="addNewListBtn" onClick={this.initCreateFieldList} >
                        + New List
                    </Button>
                </div>


                <Table className="ML-table">
                    <TableHead className="ML-tableHead">
                        <TableRow className="ML-tableHeadRow">
                            <TableCell className="ML-tableItems" onClick={ () =>  this.setState({orderBy: 'name', order: (this.state.order === 'asc' ? 'desc' : 'asc')})}>
                                List Name <i className="material-icons">unfold_more</i>
                                {
                                    /*<i className="material-icons">{this.state.order === 'asc' ? 'arrow_downward' : 'arrow_upward'}</i>*/
                                    /*<i className="material-icons">unfold_more</i>*/
                                }
                            </TableCell>
                            <TableCell onClick={ () =>  this.setState({orderBy: 'fieldListCount', order: (this.state.order === 'asc' ? 'desc' : 'asc')})}>
                                # of options <i className="material-icons">unfold_more</i>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {
                            this.state.dropdownList
                            .sort( this.getSorting(this.state.order, this.state.orderBy))
                            .slice(this.state.currentPage * this.state.recordsPerPage, this.state.currentPage * this.state.recordsPerPage + this.state.recordsPerPage)
                            .map( (_data, index) => {
                                return(
                                    <TableRow key={_data.id} className="ML-tableClickableRow" onClick={this.getFieldListDetail.bind(null, _data.id)}>
                                         <TableCell className="ML-tableItems">{_data.name}</TableCell>
                                         <TableCell>{_data.fieldListCount}</TableCell>
                                    </TableRow>
                                )
                            })
                        }

                    </TableBody>
                    <TableFooter className="ML-tableFooter">
                        <TableRow>
                            <TableCell>
                                <ReactPaginate previousLabel={<i className="material-icons">keyboard_arrow_left</i>}
                                   nextLabel={<i className="material-icons">keyboard_arrow_right</i>}
                                   breakLabel="..."
                                   breakClassName={"break-me"}
                                   pageCount={this.state.dropdownList.length / this.state.recordsPerPage}
                                   marginPagesDisplayed={1}
                                   pageRangeDisplayed={3}
                                   onPageChange={this.handlePageChange}
                                   containerClassName={"pagination"}
                                   subContainerClassName={"pages pagination"}
                                    initialPage={this.state.currentPage}
                                   activeClassName={"active appSecondaryBGClr"} />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>

            </div>
        </div>
        
        )
    }
    getFieldListDetail = (_id) => {
        dataShare.getDropdownListsById(_id, (error, response) =>{
            if (error) {
                this.props.showNotification('error', 'Internal server error while fetching Field Lists Details.');
                return;
            }
            this.setState({currentOptionsPage: 0, mode: 'update', optionsOrderBy: (response.orderBy ? response.orderBy: 'ordinal'), order: (response.order ? response.order: 'asc'), saveList: response});
        });
        this.getGetFieldNames(_id);
    }
    initCreateFieldList = () => {
        this.setState({mode: 'create', saveList: {name: '', fieldListItems: []}});
    }
    listNameChanged = (event) => {
        let _tempVar = this.state.saveList;
        _tempVar.name = event.target.value;
        this.setState({saveList: _tempVar});
    }
    inserNewOption = () => {
        this.setState({modalMode: 'create', modalRefIndex: -1, modalData: {title: '', value: ''}});
        this.openModal();
        /*let _tempVar = this.state.saveList;
        _tempVar.fieldListItems.splice(0, 0, {title: "", value: ""});
        this.setState({saveList: _tempVar});*/
    }
    updateExistingOption = (_data, index) => {
        this.setState({modalMode: 'update', modalRefIndex: (this.state.currentOptionsPage * 10 + index), modalData: {title: _data.display, value: (_data.value ? _data.value : '')}});
        this.openModal();
    }
    
    deleteExistingOption = (index) => {
        this.setState({modalMode: 'delete', modalRefIndex: (this.state.currentOptionsPage * 10 + index), modalData: {title: '', value: ''}});
        this.openModal();
    }
    handlePageChangeOptions = (_obj) => {
        this.setState({currentOptionsPage: _obj.selected});
    }
    
    optionsChanged = (index, event) => {
        let _tempVar = this.state.saveList;
        _tempVar.fieldListItems[index][event.target.name] = event.target.value;
        this.setState({saveList: _tempVar});
    }
    getGetFieldNames = (_id) => {
        this.setState({FieldNames : []});
        dataShare.getFieldNamesById(_id, (error, response) => {
            if (error) {
                if (error.response && error.response.status === 409) this.props.showNotification('error', error.response.data);
                else this.props.showNotification('error', 'Internal server error while fetching Linked Fields.');
                return;
            }
            this.setState({FieldNames: response});
        })
    }
    getDragableTableContent = (_data, index) =>{
        return(
            <Grid container spacing={0} className={index % 2 === 0 ? "ML-tableClickableRow" : "ML-tableClickableRow odd"}>
                <Grid item xs={5} className="ML-tableItems">{_data.display}</Grid>
                <Grid item xs={5} className="ML-tableItems">{_data.value}</Grid>
                <Grid item xs={2} className="ML-tableItems icon">
                    <i className="material-icons deleteIcon" onClick={() => this.deleteExistingOption(index)}>delete</i>
                    <i className="material-icons editIcon" onClick={() => this.updateExistingOption(_data, index)}>settings</i>
                </Grid>
            </Grid>
        );
    }
    optionsDragCompleted = (_data) => {
        let _tempVar = this.state.saveList;
        let _tempVarBkp = JSON.stringify(_tempVar.fieldListItems);
        _tempVar.fieldListItems = [];
        this.setState({optionsOrderBy: 'ordinal', optionsOrder: 'asc',saveList: _tempVar}, () => {
            _tempVarBkp = JSON.parse(_tempVarBkp);
            let _count = 0;
            for(let i = (this.state.currentOptionsPage * 10); i < ((this.state.currentOptionsPage * 10) + 10); i++){
                if(_data.length <= _count) break;
                else{
                    _tempVarBkp[i] = _data[_count];
                    _count = _count + 1;
                }
            }
            
            for(let i = 0; i < _tempVarBkp.length; i++) _tempVarBkp[i].ordinal = i;
            
            _tempVar.fieldListItems = _tempVarBkp;
            this.setState({saveList: _tempVar});
        })
        /*console.log(_data);*/
    }
    saveList = (event) => {
        if(this.state.saveList.name === ''){
            this.props.showNotification('warning', 'Enter valid List Name.');
            return;
        }
        if(this.state.saveList.fieldListItems.length === 0){
            this.props.showNotification('warning', 'List requires at least one option.');
            return;
        }
        console.log(this.state.saveList);
        this.state.saveList.order = this.state.optionsOrder;
        this.state.saveList.orderBy = this.state.optionsOrderBy;
        let fieldListItems = this.state.saveList.fieldListItems;
        for(let i = 0; i < fieldListItems.length; i++){
            fieldListItems[i].ordinal = i;
        }
        this.setState({saveList: {...this.state.saveList, fieldListItems}});
        dataShare.saveDropdownLists((this.state.modalMode === 'create'? 'post' : 'post'), this.state.saveList, (error, response) => {
            if (error) {
                if (error.response && error.response.status === 409) this.props.showNotification('error', error.response.data);
                else this.props.showNotification('error', 'Internal server error while fetching Field Lists.');
                return;
            }
            this.props.refreshFieldList();
            console.log(response);
            this.setState({mode: 'list', saveList: {name: '', fieldListItems: []}});
            this.getDropdownList();
        })
    }
    getSaveTemplate = () => {
        return (
        <div className="ML-viewContainer">
            <div className="manageListHeader create">
                <i className="material-icons backBtn" onClick={() => this.setState({mode: 'list'})}>keyboard_arrow_left</i>
                {
                    this.state.mode === "create" && "New List"
                }
                {
                    this.state.mode === "update" && "Manage List"
                }
                <i className="material-icons" onClick={this.props.toggleManageList}>close</i>
            </div>

            <p className="ML-desc1" style={{'marginTop': '20px'}}>Create a new list to populate custom dropdown fields</p>
            <p className="ML-desc2">Determine the name, content and settings for your list</p>

            <div className="ML-tableWrapper" style={{'marginTop': '0px'}}>
                <div className="ML-tableAction">
                    <TextField 
                        label="List Name"
                        value={this.state.saveList.name}
                        onChange={this.listNameChanged}
                        margin="normal"
                    />
                            
                    <Button variant="contained" className="addNewListOptionsBtn" onClick={this.inserNewOption}  >
                        + Option
                    </Button>
                </div>


                <Grid container spacing={0} className="ML-table custom" style={{'marginTop': '-5px'}}>
                    <Grid item xs={12} className="ML-tableHead">
                        <Grid container spacing={0} className="ML-tableHeadRow">
                            <Grid item xs={5} title="Changing the order of the items within your list will be reflected across all of your sites where this list is displayed." className="ML-tableItems" onClick={ () =>  this.setState({optionsOrderBy: 'display', optionsOrder: (this.state.optionsOrder === 'asc' ? 'desc' : 'asc')})}>
                                Label <i className="material-icons">unfold_more</i>
                            </Grid>
                            <Grid item xs={5} title="Changing the order of the items within your list will be reflected across all of your sites where this list is displayed." className="ML-tableItems" onClick={ () =>  this.setState({optionsOrderBy: 'value', optionsOrder: (this.state.optionsOrder === 'asc' ? 'desc' : 'asc')})}>
                                Value <i className="material-icons">unfold_more</i>
                            </Grid>
                            <Grid item xs={2} className="ML-tableItems">
                                Action
                            </Grid>
                        </Grid>
                    </Grid>
                    
                     <Grid item xs={12} className="ML-tableHeadRow">
                         <ReactDragList 
                            handles={false}
                            dataSource={this.state.saveList.fieldListItems
                            .sort( this.getSorting(this.state.optionsOrder, this.state.optionsOrderBy))
                            .slice(this.state.currentOptionsPage * this.state.recordsPerPage, this.state.currentOptionsPage * this.state.recordsPerPage + this.state.recordsPerPage)} 
                            row={(record, index) => this.getDragableTableContent(record, index)} 
                            onUpdate={(event, updated) => {this.optionsDragCompleted(updated);}}
                            ghostClass="dragGhostClass"
                        />
                     </Grid>
                    
                    <Grid item xs={12}>
                        <Grid container spacing={0} className="ML-tableFooter">
                            <Grid item xs={12}>
                                <ReactPaginate previousLabel={<i className="material-icons">keyboard_arrow_left</i>}
                                   nextLabel={<i className="material-icons">keyboard_arrow_right</i>}
                                   breakLabel="..."
                                   breakClassName={"break-me"}
                                   pageCount={this.state.saveList.fieldListItems.length / this.state.recordsPerPage}
                                   marginPagesDisplayed={1}
                                   pageRangeDisplayed={3}
                                   onPageChange={this.handlePageChangeOptions}
                                   containerClassName={"pagination"}
                                   subContainerClassName={"pages pagination"}
                                   activeClassName={"active appSecondaryBGClr"} />
                            </Grid>
                        </Grid>
                    </Grid>
                    
                </Grid>

                {
                    this.state.FieldNames.length > 0 && 
                    <div className="fieldsUsingWrapper">
                        <div className="header">Fields Using this list</div>
                        {
                            this.state.FieldNames.map( (_data, index) => {
                                return <span key={index} className="tagCnt">{_data}</span>
                            })
                        }
                    </div>
                }
                

                <div>
                   <Button variant="contained" className="addNewListBtn" style={{"marginTop": "20px"}} onClick={this.saveList} >
                        Save List
                    </Button>
                </div>

            </div>
        </div>
        
        )
    }
    render(){
        return (
            <div className={this.props.showManageList === true ? "fixed-right open" : "fixed-right"}>
                <div className="fixed-inner">
            
                    <ManageOptionModal data={this.state.modalData} modalMode={this.state.modalMode} showModal={this.state.showModal} openModal={this.openModal} closeModal={this.closeModal} saveBtnClicked={this.saveBtnClicked} />
            
                    {this.state.mode === "list" && this.getViewTemplate()}
                    {(this.state.mode === "create" || this.state.mode === "update") && this.getSaveTemplate()}
                    
            
                </div>
            </div>
        )
    }
}