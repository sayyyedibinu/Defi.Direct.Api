import React from "react";
import './ReportsPageStyle.css';
import dataShare from "../../Common/dataShare";
import Notifications, {notify} from 'react-notify-toast';

export default class ReportsPageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {embeddedUrl:""};
    }
    componentDidMount = () => {
        this.getAnalyticsUrl();
    }
    showNotification(type, message){
        let errorMessageStyle = { background: '#d50000', text: "#FAFAFA" };
        let warningMessageStyle = { background: '#F57F17', text: "#FAFAFA" };
        let successMessageStyle = { background: '#4CAF50', text: "#FAFAFA" };
        notify.show(message, "custom", 5000, (type === 'success' ? successMessageStyle : (type === 'error' ? errorMessageStyle :  warningMessageStyle)) );
    }
    getAnalyticsUrl = () => {
        dataShare.getAnalyticsUrl((error, response) => {
            if(error){
                this.showNotification('error', 'Internal server error while fetching site information, please try after sometime.');
                return;
            }
            this.setState({embeddedUrl:response.embeddedUrl});
        });
    }
    render(){
        return(
            <div>
                <iframe id="embed-iframe" scrolling="no" style={{ width: '100%', height: 'calc(100vh - 80px)', marginTop: '70px' }} frameBorder="0" src={this.state.embeddedUrl}></iframe>
            </div>
        )
    }
}