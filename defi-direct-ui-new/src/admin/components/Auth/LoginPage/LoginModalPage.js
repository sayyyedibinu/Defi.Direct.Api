import React from 'react';
import Modal from '@material-ui/core/Modal';

import LoginPage from './LoginPage';
import './LoginModalPageStyle.css';

export default class LoginModalPageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    render(){
        return (
            <Modal aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" open={this.props.showModal} onClose={this.props.closeModal} >
                <div className="loginModalWrapper">
                    <LoginPage showNotification={this.props.showNotification} closeModal={this.props.closeModal} source="loginmodal" />
                </div>
            </Modal>
        );
    }
}