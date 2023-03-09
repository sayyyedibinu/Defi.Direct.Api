import React from "react";
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import './FieldLogicInfoModalStyle.css';

export default class FieldLogicInfoModalComponent extends React.Component{
    render(){
        return(
            <Modal open={this.props.showFieldLogicInfoModal} onClose={this.props.closeFieldLogicInfoModal} className="FieldLogicInfoModal" >
                <div style={{width: "100%", height: "100vh"}}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={10} md={9} lg={6} className="disableModalWrapper">
                            <div className="disableModalContainer">
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        {
                                            this.props.invalidFieldLogicField === true && 
                                            <h3 className="disableModalHeader-warning">Please ensure the below fields are inserted in the page before adding this field.</h3>
                                        }
                                        <h2 className="disableModalHeader1">{this.props.fieldLogicInfoMsg}</h2>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className="disableModalFooter FLI-ModalFooter">
                                            {
                                                this.props.invalidFieldLogicField === true && 
                                                <Button className="cencelBtn appSecondaryClr" onClick={this.props.closeFieldLogicInfoModal}>Cancel</Button>
                                            }
                                            {
                                                this.props.invalidFieldLogicField === false && 
                                                <Button className="okayBtn appSecondaryBGClr" onClick={this.props.closeFieldLogicInfoModal}>Okay</Button>
                                            }
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