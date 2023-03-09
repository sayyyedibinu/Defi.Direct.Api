import React from "react";
import './ManageOptionModalStyle.css';

import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

export default class ManageOptionModalComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {title: '', value: '', error: {}};
    }
    inputChangeHandler = (event) => {
        let _tempvar = {};
        _tempvar[event.target.name] = event.target.value;
        this.setState(_tempvar);
    }
    componentDidUpdate = (prevProps) => {
        if (this.props.data === prevProps.data) return;
        this.setState({title: this.props.data.title, value: this.props.data.value, error: {}})
        if (this.props.showManageList === true) this.getDropdownList();
    }
    submitData = () =>{
        if(this.state.title === ''){
            this.setState({error: {title: true}});
            return;
        }
        if(this.state.value === ''){
            this.setState({error: {value: true}});
            return;
        }
        this.setState({error: {}});
        this.props.saveBtnClicked({title: this.state.title, value: this.state.value});
    }
    render(){
        return(
            <Modal open={this.props.showModal} onClose={this.props.closeModal} style={{zIndex: 9999}} >
              <div style={{width: "100%", height: "100vh"}}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={10} md={9} lg={6} className="MOM-Wrapper">
                        <div className="MOM-Container">
                            <span className="MOM-CloseBtn" onClick={this.props.closeModal}>
                                <i className="material-icons">clear</i>
                            </span>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <h2 className="MOM-Header1">Manage Option</h2>
                                </Grid>
                                {
                                    this.props.modalMode === "delete" && 
                                    <Grid item xs={12}>
                                        <p className="MOM-Header2">
                                            Are you sure to remove this options?
                                        </p>
                                    </Grid>
                                }
                                
                                {
                                    this.props.modalMode !== "delete" && 
                                    <Grid item xs={12}>
                                        <Grid container spacing={0}>
                                            <Grid item xs={12} className="MOM-TitleBox">
                                                <TextField name="title" label="Label" InputLabelProps={{ shrink: true }} placeholder="Enter Label" fullWidth margin="normal" value={this.state.title} onChange={this.inputChangeHandler} helperText="Title of the option." />
                                                {
                                                    this.state.error.title && <span className="errorMessage">Title Required</span>
                                                }
                                            </Grid>
                                            <Grid item xs={12} className="MOM-TitleBox">
                                                <TextField name="value" label="Value" InputLabelProps={{ shrink: true }} placeholder="Enter Value" fullWidth margin="normal" value={this.state.value} onChange={this.inputChangeHandler} helperText="Value of the option." />
                                                {
                                                    this.state.error.value && <span className="errorMessage">Value Required</span>
                                                }
                                            </Grid>
                                        </Grid>
                                        
                                    </Grid>
                                }
                                
                                <Grid item xs={12}>
                                    {
                                        this.props.modalMode === "create" && 
                                        <div className="MOM-Footer" onClick={this.submitData}>
                                            <Button variant="contained" className="cancelBtn appSecondaryClr" onClick={this.props.closeModal}>
                                                Cancel
                                            </Button>
                                            <Button variant="contained" className="createBtn appSecondaryBGClr">Add</Button>
                                        </div>
                                    }
                                    {
                                        this.props.modalMode === "update" && 
                                        <div className="MOM-Footer" onClick={this.submitData}>
                                            <Button variant="contained" className="cancelBtn appSecondaryClr" onClick={this.props.closeModal}>
                                                Cancel
                                            </Button>
                                            <Button variant="contained" className="updateBtn appSecondaryBGClr">Update</Button>
                                        </div>
                                    }
                                    {
                                        this.props.modalMode === "delete" && 
                                        <div className="MOM-Footer" onClick={this.props.saveBtnClicked.bind({})}>
                                            <Button variant="contained" className="cancelBtn appSecondaryClr" onClick={this.props.closeModal}>
                                                Cancel
                                            </Button>
                                            <Button variant="contained" className="deleteBtn">Delete</Button>
                                        </div>
                                    }
                                    
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

/*<div className="createModalCnt">
                </div>*/