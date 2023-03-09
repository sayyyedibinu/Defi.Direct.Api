import React from "react";
import './CreateClientModalStyle.css';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import config from "../../../resources/config.json";
import NativeSelect from '@material-ui/core/NativeSelect';

const Switch_Theme = createMuiTheme({
    palette: {
        primary: { main: config.defaultSecondaryClr }
    }
});
 export default class CreateClientModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
     };

    render() {
         const { classes } = this.props;
         return (
            <Modal aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" open={this.props.showModal} onClose={this.props.closeModal} >
                <div style={{ width: "100%" }}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={10} md={9} lg={6} className="createModalWrapper">
                            <div className="createModalContainer">
                                <span className="createModalCloseBtn" onClick={this.props.closeModal}>
                                    <i className="material-icons">clear</i>
                                </span>
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <h2 className="createModalHeader1">New Client</h2>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className="createModalTitleBox">
                                             <TextField name="clientName" label="Client Name" InputLabelProps={{ shrink: true }} placeholder="Enter Client Name" fullWidth margin="normal" onChange={this.props.inputChangeHandler} helperText="This is just the name of the client for whom this instance is for. This is not used for anything other than as a reference."/>
                                            {
                                                this.props.modalError && <span className="errorMessage">Client Name required</span>
                                            }
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                         <div className="createModalTitleBox">
                                             <TextField name="hostName" label="Host Name" InputLabelProps={{ shrink: true }} placeholder="Enter Host Name" fullWidth margin="normal" onChange={this.props.inputChangeHandler} helperText={(this.props.helperTextChange && !this.props.modalUrlError) ? this.props.helperText : "For QA this should be in the format abcxyz.qa.defidirect.com and for PROD this should be in the format abcxyz.defidirect.com. DO NOT INCLUDE https:// before the host name. Also, make sure you are following the above format. Any client instance created in a diff format will result in the Host URL not working "} />
                                            {
                                                this.props.modalError && <span className="errorMessage">Host Name required</span>
                                            }
                                            {
                                                this.props.modalUrlError && <span className="errorMessage">Host Name is invalid. Please read helper text</span>
                                            }
                                         </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={0}>
                                            <Grid item sm={4} xs={12}>
                                                <div className="createModalTitleBox">
                                                     <FormControl className="formCtrl">
                                                         <InputLabel>Copy from</InputLabel>
                                                         <NativeSelect className="selectBox" name="copyFrom" defaultValue={this.props.defaultFrom} onChange={this.props.inputChangeHandler} >
                                                            {this.props.clientList.map((e, key) => {
                                                                return <option key={key} value={e.name} >{e.name}</option>
                                                            })}
                                                        </NativeSelect>
                                                    </FormControl>
                                                </div>
                                            </Grid>
                                            <Grid item sm={4} xs={12}>
                                                <div className="createModalTitleBox">
                                                    <MuiThemeProvider theme={Switch_Theme}>
                                                         Is Active <Switch className="toggleBtn" name="isActive" defaultChecked={this.props.isActive} onChange={this.props.inputChangeHandler} color="primary" />
                                                     </MuiThemeProvider>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={0}>
                                            {
                                                <Grid item xs={12} md={8}>
                                                    <div className="createModalFooter">
                                                         <Button className="cancelFieldBtn appSecondaryClr" onClick={this.props.closeModal}>Cancel</Button>
                                                        <Button className="saveFieldBtn appSecondaryBGClr" onClick={this.props.submitBtnClicked}>Submit</Button>
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