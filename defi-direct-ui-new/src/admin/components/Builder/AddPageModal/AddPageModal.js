import React from "react";

import "./AddPageModal.css";
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

export default class AddPageModalComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    render(){
        return(
            <Modal aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" open={this.props.showModal} onClose={this.props.closeModal} >
              <div  style={{width: "100%"}}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={10} md={9} lg={6} className="createModalWrapper">
                        <div className="createModalContainer">
                            <span className="createModalCloseBtn" onClick={this.props.closeModal}>
                                <i className="material-icons">clear</i>
                            </span>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <h2 className="createModalHeader1">Add Page</h2>
                                </Grid>
                                <Grid item xs={12}>
                                    <div className="createModalTitleBox">
                                        <TextField label="Name Your Page" InputLabelProps={{ shrink: true }} placeholder="Enter Page Name" fullWidth margin="normal" value={this.props.newPagetitle} name="newPagetitle" onChange={this.props.inputOnChange} />
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <div className="addPageModalFooter">
                                        <Button variant="contained" className="startBtn" onClick={this.props.addPage}>Save</Button>
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

/*<div className="createModalFooter" onClick={this.props.closeModal}>
    <Button className="finishBtn">Cancel</Button>
</div>
<div className="createModalFooter" onClick={this.props.starthBtnClicked}>
    <Button variant="contained" className="startBtn">Add</Button>
</div>*/