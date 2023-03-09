import React from "react";
import './CreateModalStyle.css';

import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

export default class CreateModalComponent extends React.Component{
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
                                    <h2 className="createModalHeader1">New Site</h2>
                                </Grid>
                                <Grid item xs={12}>
                                    <p className="createModalHeader2">
                                        Congratulations on building your new site! Enter your site title below to get started!
                                    </p>
                                </Grid>
                                <Grid item xs={12}>
                                    <div className="createModalTitleBox">
                                        <TextField name="siteTitle" label="Site Title" InputLabelProps={{ shrink: true }} placeholder="Enter Site Title" fullWidth margin="normal" onChange={this.props.inputChangeHandler} />
                                        {
                                            this.props.modalError && <span className="errorMessage">Site title required</span>
                                        }
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={0}>
                                        {
                                            this.props.copySite === false && 
                                            <Grid item xs={12} md={6}>
                                                <div className="createModalFooter" onClick={this.props.finishBtnClicked}>
                                                    <Button className="finishBtn appSecondaryClr">Finish Configuring Settings</Button>
                                                </div>
                                            </Grid>
                                        }
                                        {
                                            this.props.copySite === true && 
                                            <Grid item xs={12} md={6}>
                                                <div className="createModalFooter fullWidth" onClick={this.props.starthBtnClicked}>
                                                    <Button variant="contained" className="startBtn appSecondaryBGClr">Finish Copy Site</Button>
                                                </div>
                                            </Grid>
                                            
                                        }
                                        {
                                            this.props.copySite === false && 
                                            <Grid item xs={12} md={6}>
                                                <div className="createModalFooter" onClick={this.props.starthBtnClicked}>
                                                    <Button variant="contained" className="startBtn appSecondaryBGClr">Start Building Your Site</Button>
                                                </div>
                                            </Grid>
                                        }
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

/*<div className="createModalCnt">
                </div>*/