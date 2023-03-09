import React from 'react';
import '../PersonalLoan-Component/FormContainer-Component/FormContainerComponent.css';
import './ModalLoaderStyle.css';

import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';

class ModalLoaderComponent extends React.Component{
    
    render(){
        return (
            <Modal open={this.props.open} className="modalContainer" >
                {/* <div style={{"width": "100%"}}>
                    <div className="modalSignCnt">
                        <CircularProgress className="loaderSpinner" />
                    </div>
                </div> */}
                <div className="spinner-container" style={{"background":"rgb(245, 245, 245)"}}>
                    <div className="spinner-0"></div>
                    <div className="spinner"></div>
                    <div className="spinner-2"></div> 
                </div>
            </Modal>
        );
    }
}

export default compose(withWidth())(ModalLoaderComponent);
