import React from "react";
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import './UsersPageStyle.css';

export default class UserPageModalComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {userData: {username: "", password: "", email: "", role: "User", passwordnew: ""}};
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps.modalData === this.props.modalData) return;
        this.setState({userData: {username: "", password: "", email: "", role: "",  role: "User", passwordnew: ""}});
    }
    onInputChanged = (event) => {
        let _tempvar = this.state.userData;
        _tempvar[event.target.name] = event.target.value;
        this.setState({userData: _tempvar});
    }
    validateCreateUser = () => {
        if(this.state.userData.username === ""){
           this.props.showNotification('warning', 'Username required!');
           return;
       }
        if(this.state.userData.password === ""){
           this.props.showNotification('warning', 'Password required!');
           return;
       }
        if(this.state.userData.password.length < 6){
           this.props.showNotification('warning', 'Passwords must be at least 6 characters!');
           return;
       }
        if(this.state.userData.password !== this.state.userData.passwordnew){
           this.props.showNotification('warning', 'Password and confirm password should be same!');
           return;
       }
        if(this.state.userData.email === ""){
           this.props.showNotification('warning', 'Email required!');
           return;
       }
        this.props.confirmModal(this.state.userData);
    }
    validatePasswordReset = () => {
        if(this.state.userData.password === ""){
           this.props.showNotification('warning', 'Password required!');
           return;
       }
        if(this.state.userData.password.length < 6){
           this.props.showNotification('warning', 'Passwords must be at least 6 characters!');
           return;
       }
        if(this.state.userData.password !== this.state.userData.passwordnew){
           this.props.showNotification('warning', 'Password and confirm password should be same!');
           return;
       }
        this.props.confirmModal(this.state.userData);
    }
    getCreateUserContainer = () => {
        return(
            <Grid container spacing={0}>
                <Grid item xs={12} sm={10} md={9} lg={6} className="disableModalWrapper">
                    <div className="disableModalContainer">
                        <span className="disableModalCloseBtn" onClick={this.props.closeModal}>
                            <i className="material-icons">clear</i>
                        </span>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <h2 className="disableModalHeader1">Create User</h2>
                            </Grid>
                            <Grid item xs={12} className="upm_container">
                                <TextField
                                    name="username"
                                    label="Username"
                                    value={this.state.userData.username}
                                    onChange={this.onInputChanged}
                                    helperText=""
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} className="upm_container">
                                <TextField
                                    type="password"
                                    name="password"
                                    label="Password"
                                    value={this.state.userData.password}
                                    onChange={this.onInputChanged}
                                    helperText="Passwords must have 6 characters with atleast one non alphanumeric character, one lowercase, one uppercase."
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} className="upm_container">
                                <TextField
                                    type="password"
                                    name="passwordnew"
                                    label="Confirm Password"
                                    value={this.state.userData.passwordnew}
                                    onChange={this.onInputChanged}
                                    helperText=""
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} className="upm_container">
                                <TextField
                                    type="email"
                                    name="email"
                                    label="Email"
                                    value={this.state.userData.email}
                                    onChange={this.onInputChanged}
                                    helperText=""
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} className="upm_container">
                                <InputLabel>Select Role</InputLabel>
                                <Select className="selectBox" value={this.state.userData.role} name="role" onChange={this.onInputChanged} fullWidth>
                                    <MenuItem value="User">User</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <div className="disableModalFooter">
                                    <Button className="cencelBtn appSecondaryClr" onClick={this.props.closeModal}>Cancel</Button>
                                    <Button variant="contained" className="okayBtn appSecondaryBGClr" onClick={this.validateCreateUser}>Create</Button>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        );
    }
    getDeleteUserContainer = () => {
        return(
            <Grid container spacing={0}>
                <Grid item xs={12} sm={10} md={9} lg={6} className="disableModalWrapper">
                    <div className="disableModalContainer">
                        <span className="disableModalCloseBtn" onClick={this.props.closeModal}>
                            <i className="material-icons">clear</i>
                        </span>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <h2 className="disableModalHeader1">Are you sure to delete {this.props.modalData.UserName}?</h2>
                            </Grid>
                            <Grid item xs={12}>
                                <div className="disableModalFooter">
                                    <Button className="cencelBtn appSecondaryClr" onClick={this.props.closeModal}>Cancel</Button>
                                    <Button variant="contained" className="okayBtn appSecondaryBGClr" onClick={this.props.confirmModal}>OK</Button>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        );
    }
    getChangePasswordUserContainer = () => {
        return(
            <Grid container spacing={0}>
                <Grid item xs={12} sm={10} md={9} lg={6} className="disableModalWrapper">
                    <div className="disableModalContainer">
                        <span className="disableModalCloseBtn" onClick={this.props.closeModal}>
                            <i className="material-icons">clear</i>
                        </span>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <h2 className="disableModalHeader1">Change {this.props.modalData.UserName} Password</h2>
                            </Grid>
                            <Grid item xs={12} className="upm_container">
                                <TextField
                                    type="password"
                                    name="password"
                                    label="New Password"
                                    value={this.state.userData.password}
                                    onChange={this.onInputChanged}
                                    helperText="Passwords must have 6 characters with atleast one non alphanumeric character, one lowercase, one uppercase."
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} className="upm_container">
                                <TextField
                                    type="password"
                                    name="passwordnew"
                                    label="Confirm Password"
                                    value={this.state.userData.passwordnew}
                                    onChange={this.onInputChanged}
                                    helperText=""
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <div className="disableModalFooter">
                                    <Button className="cencelBtn appSecondaryClr" onClick={this.props.closeModal}>Cancel</Button>
                                    <Button variant="contained" className="okayBtn appSecondaryBGClr" onClick={this.validatePasswordReset}>Update</Button>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        );
    }
   /* value={this.state.hint}
                                    onChange={this.onInputChanged}*/
    render(){
        return(
            <Modal aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" open={this.props.showModal} onClose={this.props.closeModal} >
                <div  style={{width: "100%", height: "100vh"}} className="upm">
                    <Grid container spacing={0}>
                        {
                            this.props.modalMode === 'create' && this.getCreateUserContainer()
                        }
                        {
                            this.props.modalMode === 'delete' && this.getDeleteUserContainer()
                        }
                        {
                            this.props.modalMode === 'changePassword' && this.getChangePasswordUserContainer()
                        }
                    </Grid>
                </div>
            </Modal>
        );
    }
}