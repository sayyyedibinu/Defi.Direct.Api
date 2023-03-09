import React from "react";
import './AppLoaderStyle.css';
import config from "../../resources/config.json";

import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';

export default class AppLoaderComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {showLoader: false};
        
        document.addEventListener('showAppLoader', (e) => {
          this.setState({showLoader: true});
        }, false);
        document.addEventListener('hideAppLoader', (e) => {
          this.setState({showLoader: false});
        }, false);
        
    }
    render(){
        return(
            <Modal open={this.state.showLoader} style={{zIndex: 99999}}>
                <div className="appLoaderCnt">
                    <CircularProgress className="loader" style={{ color: config.loaderColor }} size={75} />
                </div>
            </Modal>
        )
    }
}

/*<div className="createModalCnt">
                </div>*/