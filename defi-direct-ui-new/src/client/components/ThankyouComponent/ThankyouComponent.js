import React from 'react';
import '../PersonalLoan-Component/FormContainer-Component/FormContainerComponent.css';

import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

class ThankyouComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {appNo: this.getParameterByName('appNo', this.props.location.search), loanAmount: this.getParameterByName('loanAmount', this.props.location.search), fName: this.getParameterByName('fName', this.props.location.search), lName: this.getParameterByName('lName', this.props.location.search), D: this.getParameterByName('D', this.props.location.search)};
        if (this.props.location.state.Results)
            this.state.Results = this.props.location.state.Results;
        console.log(this.props.location);
        if (this.props.location.state.Results)
            this.state.Results = this.props.location.state.Results;
        
        this.redirectToHome = this.redirectToHome.bind(this);
        console.log(this.state);
        console.log(this.props);
        console.log(this.props.location.state.Results);
    }
    
    redirectToHome(){
         window.location = '/';
    }
    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    render(){
        return (
            <div className="formContainer">
                
                <div className="finalStepCnt">
                    <img src={require("../../assets/img/holdingMoney.png")} alt="Congrats" /> 
                     <Typography className="bigHiglightText">
                        Thank You!
                     </Typography>

                    <Card className={this.state.policyCheck ? "policyCheckCnt checked" : "policyCheckCnt"}>
                        <CardContent style={{"padding": "5px"}}>
                            <Table>

                                <TableBody className="borderNone">

                                    <TableRow>
                                        <TableCell>Application No.</TableCell>
                                        <TableCell>
                                            <span className="higlightText">
                                                {this.state.appNo}
                                            </span>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow style={{"backgroundColor": "#F5F5F5"}}>
                                        <TableCell>Applicant Name</TableCell>
                                        <TableCell>
                                            <span className="higlightText">
                                                {this.state.fName} {this.state.lName}
                                            </span>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>Loan Amount</TableCell>
                                        <TableCell>
                                            <span className="higlightText">
                                                $ {this.state.loanAmount}
                                            </span>
                                        </TableCell>
                                    </TableRow>

                                </TableBody>

                            </Table>
                        </CardContent>
                    </Card>

                    <Typography className="descText">
                        Your funding is on it's way! A copy of all loan document and terms has been sent to your email.
                     </Typography>
                    <Typography className="extraDetailsText">
                        Contact us for any questions you may have toll-free at (800) 123-4567.
                     </Typography>
                </div>
                    
            </div>
        );
    }
}

export default compose(withWidth())(ThankyouComponent);
