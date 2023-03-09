import React from 'react';
import './UserLoginModalStyle.css';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import config from  "../../resources/config.json";
import dataShare from "../../../admin/components/Common/dataShare";
import generateGUID from "../../../admin/components/Common/generateGUID";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import MaskedInput from 'react-text-mask';
import FormControl from '@material-ui/core/FormControl';
import UserLoginComponent from "../LoginComponent/UserLoginComponent";


export default class UserLogInModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {BorrowerFirstName: '', BorrowerLastName: '', BorrowerEmail:'',BorrowerSSN:'',BorrowerDOB:'',dataToSave:'',borrowerData:'',loginMode:false, clearData: 0 };        
           this.state.borrowerData = {            
            BorrowerLastName:'',
            BorrowerEmail:'',
            BorrowerSSN:'',
            BorrowerDOB:''          
        }
    
    } 
    componentDidUpdate = (prevProps) => {
       // if (this.props.data === prevProps.data) return;
       // this.setState({title: this.props.data.title, value: this.props.data.value, error: {}})

       
    } 
    componentWillReceiveProps=()=>{      
        if (this.props.userMode==="newuser")       
        { 
            this.setState({BorrowerLastName: this.props.dataSet.LastName, BorrowerEmail: this.props.dataSet.Email, BorrowerSSN:this.props.dataSet.SSN,BorrowerDOB:this.props.dataSet.DOB});
            this.state.borrowerData = {            
                BorrowerLastName:this.props.dataSet.LastName,
                BorrowerEmail:this.props.dataSet.Email,
                BorrowerSSN:this.props.dataSet.SSN,
                BorrowerDOB:this.props.dataSet.DOB          
            }
         } 
         else
         {
            this.setState({BorrowerLastName: '', BorrowerEmail: '', BorrowerSSN:'',BorrowerDOB:''});
            this.state.borrowerData = {            
                BorrowerLastName:'',
                BorrowerEmail:'',
                BorrowerSSN:'',
                BorrowerDOB:''          
            }
         }
    }

    btnCloseHandler = () => {
        this.setState({ BorrowerFirstName: '', BorrowerLastName: '', BorrowerEmail:'',BorrowerSSN:'',BorrowerDOB:'',borrowerData:'' });
        this.props.closeLogInModal();
    } 
    buildConditionalProps(){
        let conditionalProps = {};
        conditionalProps.InputProps={  inputComponent: this.TextMaskCustom([/\d/, /\d/, /\d/,'-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]) };
        return conditionalProps;
    }
    TextMaskCustom = (mask) => {        
        return (props) => {
          let { inputRef, type, onChange,id, ...other } = props;          
          return (
            <MaskedInput
              {...other}
              ref={inputRef}
              id={id+"_MaskedInput"}  
              mask={mask}
              type={type}
              onBlur={this.handleChange}
              placeholderChar={'\u2000'}
            />
          );
        }
      }
      buildValidators = (type) => {
        let errorMessages = [];
        let validators = [];
        validators.push("required");
        errorMessages.push("This field is required");
        validators.push("matchRegexp:^[\\d]{3}-[\\d]{2}-[\\d]{4}$");
        errorMessages.push("Invalid ssn")
        if (type === "errorMessages") {
            return errorMessages;
        }
        return validators;
      }
    render() {
        const conditionalProps = this.buildConditionalProps();
        return (
            
            <Modal open={this.props.showLogInModal} onClose={this.props.closeLogInModal} >
                <div style={{ width: "100%" }}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={10} md={9} lg={6} className="ULM-Wrapper">
                            <div className="ULM-Container">
                                <span className="ULM-CloseBtn"  onClick={() => {this.setState({clearData: Math.random()});this.btnCloseHandler()}}>
                                    <i className="material-icons">clear</i>
                                </span>
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <UserLoginComponent oldVersionData={this.props.oldVersionData} saveApplication={this.props.saveApplication} versionMismatchHandler={this.props.versionMismatchHandler} setNewDataSetVal={this.props.setNewDataSetVal} userMode={this.props.userMode} versionMisMatch={this.props.versionMisMatch} showNotification={this.props.showNotification} dataSet={this.props.dataSet} pageID={this.props.pageID} btnCloseHandler={this.btnCloseHandler} clearData={this.state.clearData} forceSubmitApp={this.props.forceSubmitApp} />
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
