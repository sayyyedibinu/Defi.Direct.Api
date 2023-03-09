import React from 'react';
import './DateMinMaxStyle.css';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default class DateMinMaxComponent extends React.Component{
    constructor(props){
        super(props);
          this.state = {selectedOption:this.props.selOption,selType:this.props.selType,selDateVal:this.props.selDateVal,selectedDate:this.formatDate(new Date()),selectedType:'Days',chosenDays:this.props.chosenDays,error: false};

    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [year, month, day].join('-');
    }

       
    componentDidUpdate = (prevProps) => {
       
        if (prevProps.selOption !== this.props.selOption)     
        {
            this.setState({
                selectedOption: this.props.selOption
              });             
        }
        if (prevProps.selDateVal !== this.props.selDateVal) 
        {
            this.setState({
                selDateVal: this.props.selDateVal
              });
        }
        if (prevProps.selType !== this.props.selType) 
        {
            this.setState({
                selectedType: this.props.selType
              });
        }
        if (prevProps.chosenDays !== this.props.chosenDays) 
        {
            this.setState({
                chosenDays: this.props.chosenDays
              });
        }
       
    }
    inputChanged = (event) => {
        this.setState({
            selectedOption: event.target.value,error:false,selOption: event.target.value
          });       
    }
    closeModal = () => {       
        this.setState({error:false}); 
        this.props.closeModal(); 
    }
    onDateChange = (event) => {      
        let _tempVar = this.state;
        _tempVar.selectedDate = event.target.value;
        _tempVar.selDateVal = event.target.value;
        _tempVar.error=false;
        this.setState(_tempVar);
        this.calculateDate(false);
    }
    onSelectChange = (event) => {
        this.setState({
            selectedType: event.target.value,error:false
          });
    }
    onTextChange = (event) => {
        this.setState({
            chosenDays: event.target.value,error:false
          });
    }
   
    calculateDate = (callSetSate) => {

        var newDate = new Date(); 

        if (this.state.selectedOption==="custom")
        {
            if (this.state.chosenDays==='')
            {
                this.setState({error: true});
                return;
            }
            else {this.setState({error: false});}

            if (this.state.selectedType === "Days")
            {
                if (this.state.chosenDays === "1")
                newDate =this.state.chosenDays + " Day from system date"   
                else
                newDate =this.state.chosenDays + " Days from system date"          
            }
            else if (this.state.selectedType === "Weeks")
            {
                newDate =this.state.chosenDays + " Weeks from system date"
            }
            else if (this.state.selectedType === "Months")
            {                 
                newDate =this.state.chosenDays + " Months from system date"
            }
            else if (this.state.selectedType === "Years")
            {                 
               newDate =this.state.chosenDays + " Years from system date"
            }
            if(callSetSate === true) this.props.setCalculatedDate(newDate,this.props.isMin,this.state.selectedOption,this.state.selectedType,this.state.chosenDays);
        }
        else
        {
           this.setState({chosenDays:'',selectedType:'Days'})
           if (this.state.selectedDate){
               newDate = new Date(this.state.selectedDate);
               newDate = (newDate.getMonth() + 1)+"/"+newDate.getDate()+"/" + newDate.getFullYear();
           }
           else
           {newDate='';}
           this.setState({chosenDays:''});
            if(callSetSate === true) this.props.setCalculatedDate(newDate,this.props.isMin,this.state.selectedOption,this.state.selectedType,this.state.chosenDays);
        }
    }
   
    render(){
        return(
            <Modal open={this.props.showModal} onClose={this.props.closeModal} >
              <div  style={{width: "100%"}}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={10} md={9} lg={6} className="DMMC-Wrapper">
                        <div className="DMMC-Container">
                            <span className="DMMC-CloseBtn" onClick={this.props.closeModal}>
                                <i className="material-icons">clear</i>
                            </span>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>                                   
                                    <div className="DMMC-Input">   
                                        <span className="DMMC-Input-container">
                                            <input type="radio" value="custom" id="radio_custom1" name="radio_custom" checked={this.state.selectedOption === 'custom'} onChange={this.inputChanged} />
                                            <label className="lblcustomise" htmlFor="radio_custom1">Pick a custom date</label>
                                            <br/><label className="lblTxt">This will be measured from system date</label>
                                        </span>
                                        <br/>
                                        <br/>
                                        <span className="DMMC-Input-container">
                                            <input type="radio" value="static" name="radio-static" id="radio_custom2" checked={this.state.selectedOption === 'static'} onChange={this.inputChanged} />
                                            <label className="lblcustomise" htmlFor="radio_custom2">Pick a static date</label>
                                        </span>
                                    </div>                                   
                                </Grid>
                                <Grid item xs={12} >
                                            <hr className="DMMCdivider" />
                                        </Grid>
                                <Grid item xs={12}>                                
                                <div className="DMMC-Select">    
                                    {this.state.selectedOption ==='custom' && 
                                   <Select className="selectDays" value={this.state.selectedType} name="Days" onChange={this.onSelectChange} >
                                        <MenuItem value="Days" >Days</MenuItem>
                                        <MenuItem value="Weeks" >Weeks</MenuItem>
                                        <MenuItem value="Months" >Months</MenuItem>
                                        <MenuItem value="Years" >Years</MenuItem>
                                    </Select>} &nbsp;&nbsp;&nbsp;&nbsp;
                                    {this.state.selectedOption ==='custom' && <TextField required={true} className="DMMC-Text" type="number" label="" name="days" value={this.state.chosenDays} onChange={this.onTextChange}/>}
                                    {this.state.error === true && <p className="errorMsg">Enter days/weeks/months</p>}
                                    {this.state.selectedOption ==='static' && <TextField type="date" className="DMMC-Date" id="date_static" onChange={this.onDateChange} value={this.state.selDateVal}/>}
                                </div>
                                <div align="center">                                        
                                    <Button align="left" variant="contained" className="cancelButton" onClick={this.closeModal}> Cancel </Button>
                                    &nbsp; &nbsp;
                                    <Button align="right" variant="contained" className="okButton" onClick={() => this.calculateDate(true)}> OK </Button>

                                </div>
                                    
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
