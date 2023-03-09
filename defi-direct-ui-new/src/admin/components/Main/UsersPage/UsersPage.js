import React from "react";
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import fileDownload from 'js-file-download';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
/*import AddIcon from '@material-ui/icons/Add';*/
/*import Paper from '@material-ui/core/Paper';*/

import config from "../../../resources/config.json";
import generateGUID from "../../Common/generateGUID";
import dataShare from "../../Common/dataShare";
import CreateModal from '../CreateModal/CreateModal';
import FooterPagination from "../../Common/FooterPagination/FooterPagination";
import UserPageModal from "./userPageModal";
import './UsersPageStyle.css';
var qs = require('qs');

export default class UsersPageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {isLoading: true, showModal: false, modalMode: "create", modalData: {}, userList: [], originalUserList: "[]", userInfo: {username:''}};
    }
    componentDidMount = () => {
        dataShare.getUserInfo((error, response) => {
            if(error){
                this.setState({isLoading: false});
                console.log(error);
                return;
            }
            console.log(response);
            this.setState({isLoading: false, userInfo: response});
            if(response.roles.includes('Admin')) this.getAllUser();
        });
    }
    getAllUser = () => {
        dataShare.getAllUser((error, response) => {
            if(error){
                console.log(error);
                return;
            }
            this.setState({userList: response, originalUserList: JSON.stringify(response)});
        });
    }
    searchUser = (event) => {
        let updatedList = JSON.parse(this.state.originalUserList);
        updatedList = updatedList.filter(function(item){
          return item.UserName.toLowerCase().search(
            event.target.value.toLowerCase()) !== -1 || item.Role.toLowerCase().search(
            event.target.value.toLowerCase()) !== -1;
        });
        
        this.setState({userList: updatedList});
    }
    getSiteLoader = () =>{
        return (
            <Grid  item xs={12}>
                <div className="dashboardCards create">
                    <span className="createSiteBntCnt">
                        <CircularProgress style={{ color: config.loaderColor }} size={50} />
                    </span>
                </div>
            </Grid>
        );
    }
    updatePassword = (event) => {
        event.preventDefault();
        let _tempVar = this.state;
        _tempVar.isLoading = true;
        this.setState(_tempVar);

        if (event.target.newPassword.value != event.target.newPasswordConfirm.value) {
            _tempVar.isLoading = false;
            this.setState(_tempVar); 
            this.props.showNotification('error', 'New Passwords do not match!');
            return;
        }

        if (event.target.oldPassword.value == event.target.newPassword.value) {
            _tempVar.isLoading = false;
            this.setState(_tempVar); 
            this.props.showNotification('error', 'New Password must be different than old password!');
            return;
        }

        let body = {
            username: _tempVar.userInfo.username,
            passwordnew: event.target.newPassword.value,
            passwordold: event.target.oldPassword.value
        };
        axios.post(config.API_BASE_URL + 'user/ResetPassword',body).then((response) => {
            if (response.status !== 200) {
                _tempVar.isLoading = false;
                this.setState(_tempVar);
                this.props.showNotification('error', 'Error changing password!');
            }
            else {
                _tempVar.isLoading = false;
                this.setState(_tempVar);
                this.props.showNotification('success', 'Password updated!');
            }
        })
        .catch( err => { 
            _tempVar.isLoading = false;
            this.setState(_tempVar); 
            this.props.showNotification('error', 'Error changing password!');
        } );
    }
    closeModal = () => {
        this.setState({showModal: false});
    }
    confirmModal = (_obj) => {
        if(this.state.modalMode === "create"){
            let _data = {
                "username": _obj.username,
                "password": _obj.password,
                "email": _obj.email,
                "role": _obj.role
            };
            dataShare.createUser(_data, (error, response) => {
                if(error){
                    this.props.showNotification('error', error.response.data);
                    return;
                }
                this.props.showNotification('success', 'User created successfully..');
                this.setState({showModal: false});
                this.getAllUser();
            });
        }
        
        if(this.state.modalMode === "changePassword"){
            let _data = {
                "username": this.state.modalData.UserName,
                "passwordnew": _obj.password
            };
            dataShare.resetPassword(_data, (error, response) => {
                if(error){
                    console.log(error);
                    this.props.showNotification('error', error.response.data);
                    return;
                }
                this.props.showNotification('success', 'User password rest successfully..');
                this.setState({showModal: false});
            });
        }
        
        if(this.state.modalMode === "delete"){
            let _data = {
                "username": this.state.modalData.UserName
            };
            dataShare.deleteUser(_data, (error, response) => {
                if(error){
                    console.log(error);
                    this.props.showNotification('error', error.response.data);
                    return;
                }
                this.props.showNotification('success', 'User deleted successfully..');
                this.setState({showModal: false});
                this.getAllUser();
            });
        }
        
    }
    createUser = () => {
        this.setState({showModal: true, modalMode: "create", modalData: {}});
    }
    deleteUser = (_user) => {
        this.setState({showModal: true, modalMode: "delete", modalData: _user});
    }
    resetUserPassword = (_user) => {
        this.setState({showModal: true, modalMode: "changePassword", modalData: _user});
    }
    getUserContainer = () => {
        return (
            <Grid item xs={12}>
                <form autoComplete="off" onSubmit={this.updatePassword}>
                User: {this.state.userInfo.username}
                    <TextField type="password" label="Old Password" margin="normal" helperText="Input your old password" fullWidth required={true} name="oldPassword"  />
                    <TextField type="password" label="New Password" margin="normal" helperText="Input your new password" fullWidth required={true} name="newPassword"  />
                    <TextField type="password" label="Confirm New Password" margin="normal" helperText="Input your new password" fullWidth required={true} name="newPasswordConfirm" />
                    <div className="footerBtnCnt">
                        <Button className="cancelBtn appSecondaryClr">
                            <Link to="/main/sites">Cancel</Link>
                        </Button>
                        <Button type="submit" variant="contained" className="saveBtn appSecondaryBGClr">Update Password</Button>
                    </div>
                </form>
            </Grid>
        );
    }
    getAdminContainer = () => {
        return (
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12}>
                        <TextField
                            className="siteSearchCnt"
                            placeholder="Search User..."
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start" className="siteSearchIconCnt">
                                  <i className="material-icons blueColor">search</i>
                                </InputAdornment>
                              ),
                            }} onChange={this.searchUser}
                          />
                        <Button variant="contained" className="newSiteBtn appSecondaryBGClr" onClick={this.createUser}>
                            <i className="material-icons">add_circle</i>  New User
                        </Button>
                    </Grid>
                    {
                        this.state.userList.map((_user, index) => {
                            return(
                                <Grid item xs={12} key={index} className="siteListWrapper">
                                    <div className="siteListCnt">
                                        <span className="siteTitle">{_user.UserName}</span><br></br>
                                        <span className="siteTitle2">Role: {_user.Role}</span>
                                        {/*<br></br>
                                        <b>Email:</b>{_user.Email}*/}
                                        <span className="actionBtn">
                                            <Tooltip
                                                    title={
                                                      <React.Fragment>
                                                        Delete User
                                                        <span ref={this.handleArrowRef} />
                                                      </React.Fragment>
                                                    }
                                                  > 
                                                <i className="material-icons" onClick={() => this.deleteUser(_user)}>delete_outline</i>
                                            </Tooltip>
                                        </span>
                                        <span className="actionBtn editBtn">
                                            <Tooltip
                                                    title={
                                                      <React.Fragment>
                                                        Change Password
                                                        <span ref={this.handleArrowRef} />
                                                      </React.Fragment>
                                                    }
                                                  > 
                                                <i className="material-icons material-icons--outline" onClick={() => this.resetUserPassword(_user)}>edit</i>
                                            </Tooltip>

                                        </span>
                                    </div>
                                  </Grid>
                            );
                        })
                    }
                    
                </Grid>
            </Grid>
        );
    }
    render(){
        const { anchorEl } = this.state;
        return(
            <div className="MainWrapper UP">
            
                <UserPageModal showModal={this.state.showModal} closeModal={this.closeModal} modalMode={this.state.modalMode} modalData={this.state.modalData} confirmModal={this.confirmModal} showNotification={this.props.showNotification} />
            
                <div className="dashboardContainer">
                    
                    <Grid container spacing={32} className="SP-tableCnt">
                        {
                            this.state.isLoading && this.getSiteLoader()
                        }
                        {
                            (this.state.isLoading === false && !this.state.userInfo.roles.includes('Admin')) && this.getUserContainer()
                        }
                        {
                            (this.state.isLoading === false && this.state.userInfo.roles.includes('Admin')) && this.getAdminContainer()
                        }
                        
                    </Grid>
                </div>
            </div>
        )
    }
}