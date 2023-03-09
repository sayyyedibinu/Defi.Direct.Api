import React from "react";
import './disableModalStyle.css';

import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

export default class disableModalComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    render(){
        return(
            <Modal open={this.props.showModal} onClose={this.props.closeModal} >
              <div style={{width: "100%", height: "100vh"}}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={10} md={9} lg={6} className="disableModalWrapper">
                        <div className="disableModalContainer">
                            <span className="disableModalCloseBtn" onClick={this.props.closeModal}>
                                <i className="material-icons">clear</i>
                            </span>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <h2 className="disableModalHeader1">Are you sure to disable the {this.props.entity}?</h2>
                                </Grid>
                                <Grid item xs={12}>
                                    <p className="disableModalHeader2">
                                        The selected field will be disabled. You can enable the {this.props.entity} anytime.
                                    </p>
                                </Grid>
                                <Grid item xs={12}>
                                    <div className="disableModalFooter">
                                        <Button className="cencelBtn appSecondaryClr" onClick={this.props.closeModal}>Cancel</Button>
                                        <Button variant="contained" className="okayBtn appSecondaryBGClr" onClick={this.props.submitModal}>OK</Button>
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

/*<div className="createModalCnt">
                </div>*/