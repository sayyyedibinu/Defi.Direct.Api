import React from "react";
import './EditClientModalStyle.css';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import config from "../../../resources/config.json";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const Switch_Theme = createMuiTheme({
    palette: {
        primary: { main: config.defaultSecondaryClr }
    }
});
export default class EditClientModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <Modal aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" open={this.props.showEditModal} onClose={this.props.closeEditModal} >
                <div style={{ width: "100%" }}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={10} md={9} lg={6} className="createModalWrapper">
                            <div className="createModalContainer">
                                <span className="createModalCloseBtn" onClick={this.props.closeEditModal}>
                                    <i className="material-icons">clear</i>
                                </span>
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <h2 className="createModalHeader1">Edit Client</h2>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className="createModalTitleBox">
                                            <TextField name="clientName" value={this.props.clientName} label="Client Name" fullWidth margin="normal" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className="createModalTitleBox">
                                            <TextField name="hostName" value={this.props.hostName} label="Host Name" fullWidth margin="normal" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className="createModalTitleBox">
                                            <TextField name="clientId" value={this.props.clientId} label="Client Id" fullWidth margin="normal" />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className="createModalTitleBox">
                                            <MuiThemeProvider theme={Switch_Theme}>
                                                Is Active <Switch name="isActive" defaultChecked={this.props.isActive} onChange={this.props.editChangeHandler} color="primary" />
                                            </MuiThemeProvider>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={0}>
                                            {
                                                <Grid item xs={12} md={6}>
                                                    <div className="createModalFooter">
                                                        <Button className="cancelFieldBtn appSecondaryClr" onClick={this.props.closeEditModal}>Cancel</Button>
                                                        &nbsp;&nbsp;
                                                        <Button className="saveFieldBtn appSecondaryBGClr" onClick={this.props.updateBtnClicked}>Update</Button>
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