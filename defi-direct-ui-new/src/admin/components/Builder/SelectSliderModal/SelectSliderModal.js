import React from "react";
import './SelectSliderModalStyle.css';
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import config from "../../../resources/config.json";
import dataShare from "../../Common/dataShare";

const Switch_Theme = createMuiTheme({
    palette: {
        primary: { main: config.defaultSecondaryClr }
    }
});
export default class SelectSliderModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            minvalue: '',
            minvaluefrom: '',
            maxvalue: '',
            maxvaluefrom: '',
            stepvalue: '',
            stepvaluefrom: '',
            currentvalue: '',
            currentvaluefrom: '',
            error: false,
            maxValError: false,
            curValError: false,
            minToggle: false,
            maxToggle: false,
            stepToggle: false,
            currentToggle: false,
            sliderName:''
        };
    }
    componentWillReceiveProps=()=>{
        if (this.props.sliderMode==='edit')
        {
            this.setState({
                sliderName:this.props.sliderTitle,
                minvalue:this.props.sliderMinValue?this.props.sliderMinValue:1,minvaluefrom:this.props.sliderMinValueFrom?this.props.sliderMinValueFrom:'',
                minvaluetype:this.props.sliderMinValueType?this.props.sliderMinValueType:"number", minToggle:this.props.sliderMinToggle?this.props.sliderMinToggle:false,
                maxvalue:this.props.sliderMaxValue?this.props.sliderMaxValue:100,maxvaluefrom:this.props.sliderMaxValueFrom?this.props.sliderMaxValueFrom:'',
                maxvaluetype:this.props.sliderMaxValueType?this.props.sliderMaxValueType:"number", maxToggle:this.props.sliderMaxToggle?this.props.sliderMaxToggle:false,
                currentvalue:this.props.sliderCurrentValue?this.props.sliderCurrentValue:50,currentvaluetype:this.props.sliderCurrentValueType?this.props.sliderCurrentValueType:"number",
                currentvaluefrom:this.props.sliderCurrentValueFrom?this.props.sliderCurrentValueFrom:'', currentToggle:this.props.sliderCurrentToggle?this.props.sliderCurrentToggle:false,
                stepvalue:this.props.sliderStepValue?this.props.sliderStepValue:1,stepvaluefrom:this.props.sliderStepValueFrom?this.props.sliderStepValueFrom:'',stepvaluetype:this.props.sliderStepValueType?this.props.sliderStepValueType:"number", stepToggle:this.props.sliderStepToggle?this.props.sliderStepToggle:false});
        }
        else
        {
            this.setState({
                minvalue: '',
                minvaluefrom: '',
                maxvalue: '',
                maxvaluefrom: '',
                stepvalue: '',
                stepvaluefrom: '',
                currentvalue: '',
                currentvaluefrom: '',
                error: false,
                maxValError: false,
                curValError: false,
                minToggle: false,
                maxToggle: false,
                stepToggle: false,
                currentToggle: false,
                sliderName:''
            });
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };
    // getFieldDetails =(fieldtitle) =>
    // {
    //     let sliderfield={};
    //     this.props.fieldList.map((_data, index) => {
    //     if (_data.options.readonly === true && _data.options.title===fieldtitle) {                   
    //         sliderfield.data=_data.options; 
    //         return sliderfield;                   
    //     }  
    //     else
    //      return null;      
    // })
    //     return sliderfield;    
    // }
    getFieldDetails = (fieldtitle) => {
        var sliderfield = {};
        dataShare.getFieldList(false, (error, res) => {
            if (error) {
                console.log(error);
                return;
            }

            res.forEach(element => {
               console.log(element);
                if (element.options.readonly && element.options.title===fieldtitle)
                {
                    sliderfield = { id: element.id, label: fieldtitle, xpath: element.options.xPath, inputType: element.options.inputType, dataType: element.options.dataType, displayFormat: element.options.displayFormat };
                    return sliderfield;
                }
                else
                    return null;

                });
               
        });
        return sliderfield;
    }
    insertSlider = () => {       
        
        if ((this.state.sliderName == '')||(this.state.minvaluefrom == '' && this.state.minvalue == '') ||
            (this.state.maxvaluefrom == '' && this.state.maxvalue == '') ||
            (this.state.stepvaluefrom == '' && this.state.stepvalue == '') ||
            (this.state.currentvaluefrom == '' && this.state.currentvalue == '')) {
            this.setState({ error: true });
            return;
        }
        // if ((Number(this.state.minvaluefrom) > Number(this.state.maxvaluefrom)) || (Number(this.state.minvalue) > Number(this.state.maxvalue))) {
        //     this.setState({ maxValError: true });
        //     return;
        // }
        // if ((Number(this.state.currentvaluefrom) > Number(this.state.maxvaluefrom)) || (Number(this.state.currentvalue) > Number(this.state.maxvalue))) {
        //     this.setState({ curValError: true });
        //     return;
        // }
        var sliderValues = [];
        sliderValues['sliderName']=this.state.sliderName;
        if (this.state.minToggle === false) {
            sliderValues['minValue'] = this.state.minvalue;
            sliderValues['minValueType'] = "number";
            sliderValues['minValuefrom']='';
            sliderValues['minToggle'] = false;
            sliderValues['minValuefielddetails']='';
        } else {
            sliderValues['minValue'] = 1;
            sliderValues['minValuefrom'] =this.state.minvaluefrom;
            sliderValues['minValueType'] = "field";
            sliderValues['minToggle'] = true;
            sliderValues['minValuefielddetails'] =JSON.stringify(this.getFieldDetails(this.state.minvaluefrom));

        }
        if (this.state.maxToggle === false) {
            sliderValues['maxValue'] = this.state.maxvalue;
            sliderValues['maxValueType'] = "number";
            sliderValues['maxValuefrom']='';
            sliderValues['maxToggle'] = false;
            sliderValues['maxValuefielddetails']='';
        } else {
            sliderValues['maxValue'] = 100;
            sliderValues['maxValuefrom'] = this.state.maxvaluefrom;
            //this.getFieldDetails();
            // let sliderfield={};
            //     this.props.fieldList.map((_data, index) => {
            //     if (_data.options.readonly === true && _data.options.title===this.state.maxvaluefrom) {                   
            //         sliderfield=_data.options;                    
            //     }
            // })
            sliderValues['maxValuefielddetails'] =JSON.stringify(this.getFieldDetails(this.state.maxvaluefrom));
            sliderValues['maxValueType'] = "field";
            sliderValues['maxToggle'] = true;
        }
        if (this.state.stepToggle === false) {
            sliderValues['stepValue'] = this.state.stepvalue;
            sliderValues['stepValueType'] = "number";
            sliderValues['stepValuefrom'] = '';
            sliderValues['stepToggle'] = false;
            sliderValues['stepValuefielddetails']='';
        } else {
            sliderValues['stepValue'] = 1;
            sliderValues['stepValuefrom'] = this.state.stepvaluefrom;
            sliderValues['stepValueType'] = "field";
            sliderValues['stepToggle'] = true;
            sliderValues['stepValuefielddetails'] =JSON.stringify(this.getFieldDetails(this.state.stepvaluefrom));

        }
        if (this.state.currentToggle === false) {
            sliderValues['currentValue'] = this.state.currentvalue;
            sliderValues['currentValueType'] = "number";
            sliderValues['currentValuefrom'] = '';
            sliderValues['currentToggle'] = false;
            sliderValues['currentValuefielddetails']='';
            
        } else {
            sliderValues['currentValue'] = 50;
            sliderValues['currentValuefrom'] = this.state.currentvaluefrom;
            sliderValues['currentValueType'] = "field";
            sliderValues['currentToggle'] = true;
            sliderValues['currentValuefielddetails'] =JSON.stringify(this.getFieldDetails(this.state.currentvaluefrom));

        }
       // console.log(this.props.sliderMode);
        //console.log(this.props.sliderName.toLowerCase());
        //console.log(sliderValues['sliderName'].toLowerCase());
        if (this.props.sliderMode==='edit') 
        {
            
            if(this.props.sliderName.toLowerCase()!==sliderValues['sliderName'].toLowerCase() )
       
            {
              dataShare.validateSliderName(sliderValues['sliderName'].split(" ").join(""), (error, response) => {
              if (error) {
                  if (error.response && error.response.status === 409) this.props.showNotification('error', error.response.data);
                  else this.props.showNotification('error', 'Internal server error while fetching values.');
                  return;
              }
              else
              {
                this.props.insertSlider(sliderValues);  
              }
                });
             }
             else
             {
                this.props.insertSlider(sliderValues);  
                  
             }
        }
        else
        {
            dataShare.validateSliderName(sliderValues['sliderName'].split(" ").join(""), (error, response) => {
                if (error) {
                    if (error.response && error.response.status === 409) this.props.showNotification('error', error.response.data);
                    else this.props.showNotification('error', 'Internal server error while fetching values.');
                    return;
                }
                else
                {
                    this.props.insertSlider(sliderValues);       
                    this.setState({
                        minvalue: '',
                        minvaluefrom: '',
                        maxvalue: '',
                        maxvaluefrom: '',
                        stepvalue: '',
                        stepvaluefrom: '',
                        currentvalue: '',
                        currentvaluefrom: '',
                        error: false,
                        maxValError: false,
                        curValError: false,
                        minToggle: false,
                        maxToggle: false,
                        stepToggle: false,
                        currentToggle: false,
                        sliderName:''                        
                    });
                }
            });

        }
            
}
  


    toggleChangeHandler = (event) => {
        if (event.target.name === "minToggle") {
            this.setState({ minToggle: !this.state.minToggle });
        }
        else if (event.target.name === "maxToggle") {
            this.setState({ maxToggle: !this.state.maxToggle });
        }
        else if (event.target.name === "stepToggle") {
            this.setState({ stepToggle: !this.state.stepToggle });
        }
        else if (event.target.name === "currentToggle") {
            this.setState({ currentToggle: !this.state.currentToggle });
        }
    }
    handleCancel=()=>
    {
        this.setState({
            minvalue: '',
            minvaluefrom: '',
            maxvalue: '',
            maxvaluefrom: '',
            stepvalue: '',
            stepvaluefrom: '',
            currentvalue: '',
            currentvaluefrom: '',
            error: false,
            maxValError: false,
            curValError: false,
            minToggle: false,
            maxToggle: false,
            stepToggle: false,
            currentToggle: false,
            sliderName:''
        });
        this.props.closeModal();

    }

    render() {
        const { classes } = this.props;
        return (
            <Modal className="scrollableModal" aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" open={this.props.showModal} onClose={this.props.closeModal} >
                <div style={{ width: "100%" }}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={10} md={9} lg={6} className="sliderModalWrapper">
                            <div className="sliderModalContainer">
                                <span className="sliderModalCloseBtn" onClick={this.props.closeModal}>
                                    <i className="material-icons">clear</i>
                                </span>
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <h2 className="sliderModalHeader1">Slider Settings</h2>
                                    </Grid>
                                    <Grid item xs={12}>  
                                    <div className="sliderName">                                   
                                    <TextField  fullWidth type="text" label="Slider Name"  margin="normal" name="sliderName" required onChange={this.handleChange} value={this.state.sliderName}/>
                                     {
                                        (this.state.error === true && this.state.sliderName === '') && <span className="errorMessage">Slider Name required</span>
                                    }
                                    </div>
                                    </Grid>
                                    <Grid item sm={4} xs={6}>
                                        <div className="sliderModalTitleBox">
                                            <MuiThemeProvider theme={Switch_Theme}>
                                                <FormControlLabel
                                                    control={
                                                    <Checkbox
                                                      name="minToggle"
                                                      checked={this.state.minToggle}
                                                      onChange={this.toggleChangeHandler}
                                                      value="checkedA"
                                                        color="primary"
                                                    />
                                                    }
                                                    label="Custom Field"
                                                />
                                            </MuiThemeProvider>
                                        </div>
                                    </Grid>
                                    {
                                        this.state.minToggle === true &&
                                        <Grid item xs={6}>
                                            <div className="sliderModalTitleBox">
                                                <FormControl className="formCtrl">
                                                    <InputLabel>Minimum Value field</InputLabel>
                                                    <NativeSelect className="selectBox" name="minvaluefrom" onChange={this.handleChange} value={this.state.minvaluefrom}>
                                                        <option value=""></option>
                                                        {this.props.fieldList.map((_data, index) => {
                                                            if (_data.options.readonly === true && _data.options.dataType === "number") {
                                                                return <option key={index} value={_data.options.title} >{_data.options.title}</option>
                                                            }
                                                        })}
                                                    </NativeSelect>
                                                    {
                                                        (this.state.error === true && this.state.minvaluefrom === '') && <span className="errorMessage">Minimum value required</span>
                                                    }
                                                </FormControl>
                                            </div>
                                        </Grid>
                                    }
                                    {
                                        this.state.minToggle === false &&
                                        <Grid item xs={6}>
                                            <div className="sliderModalTitleBox">
                                            <TextField type="number" name="minvalue" label="Min Value" value={this.state.minvalue} InputLabelProps={{ shrink: true }} placeholder="Enter minimum value" fullWidth margin="normal" onChange={this.handleChange} />
                                                {
                                                    (this.state.error === true && this.state.minvalue === '') && <span className="errorMessage">Minimum value required</span>
                                                }
                                            </div>
                                        </Grid>
                                    }
                                    <Grid item sm={4} xs={6}>
                                        <div className="sliderModalTitleBox">
                                            <MuiThemeProvider theme={Switch_Theme}>
                                                <FormControlLabel
                                                    control={
                                                    <Checkbox
                                                      name="maxToggle"
                                                      checked={this.state.maxToggle}
                                                      onChange={this.toggleChangeHandler}
                                                      value="checkedA"
                                                        color="primary"
                                                    />
                                                    }
                                                    label="Custom Field"
                                                />
                                            </MuiThemeProvider>
                                        </div>
                                    </Grid>
                                    {
                                        this.state.maxToggle === true &&
                                        <Grid item xs={6}>
                                            <div className="sliderModalTitleBox">
                                                <FormControl className="formCtrl">
                                                    <InputLabel>Maximum Value Field</InputLabel>
                                                    <NativeSelect className="selectBox" name="maxvaluefrom" value={this.state.maxvaluefrom} onChange={this.handleChange} >
                                                        <option value=""></option>
                                                        {this.props.fieldList.map((_data, index) => {
                                                            if (_data.options.readonly === true && _data.options.dataType === "number") {
                                                                return <option key={index} value={_data.options.title} >{_data.options.title}</option>
                                                            }
                                                        })}
                                                    </NativeSelect>
                                                    {/* {
                                                        (this.state.error === true && this.state.maxvalue === '') && <span className="errorMessage">Maximum value required. </span>
                                                    }
                                                    {
                                                        (this.state.maxValError === true && this.state.maxvalue !== '') && <span className="errorMessage">Min Value is greater than Max value</span>
                                                    } */}
                                                </FormControl>
                                            </div>
                                        </Grid>
                                    }
                                    {
                                        this.state.maxToggle === false &&
                                        <Grid item xs={6}>
                                            <div className="sliderModalTitleBox">
                                            <TextField type="number" name="maxvalue" label="Max Value" value={this.state.maxvalue} InputLabelProps={{ shrink: true }} placeholder="Enter maximum value" fullWidth margin="normal" onChange={this.handleChange} />
                                                {
                                                    (this.state.error === true && this.state.maxvalue === '') && <span className="errorMessage">Maximum value required. </span>
                                                }
                                                {
                                                    (this.state.maxValError === true && this.state.maxvalue !== '') && <span className="errorMessage">Min Value is greater than Max value</span>
                                                }
                                            </div>
                                        </Grid>
                                    }
                                    <Grid item sm={4} xs={6}>
                                        <div className="sliderModalTitleBox">
                                            <MuiThemeProvider theme={Switch_Theme}>
                                                <FormControlLabel
                                                    control={
                                                    <Checkbox
                                                      name="stepToggle"
                                                      checked={this.state.stepToggle}
                                                      onChange={this.toggleChangeHandler}
                                                      value="checkedA"
                                                        color="primary"
                                                    />
                                                    }
                                                    label="Custom Field"
                                                />
                                            </MuiThemeProvider>
                                        </div>
                                    </Grid>
                                    {
                                        this.state.stepToggle === true &&
                                        <Grid item xs={6}>
                                            <div className="sliderModalTitleBox">
                                                <FormControl className="formCtrl">
                                                    <InputLabel>Step Value field</InputLabel>
                                                    <NativeSelect className="selectBox" name="stepvaluefrom" value={this.state.stepvaluefrom} onChange={this.handleChange} >
                                                        <option value=""></option>
                                                        {this.props.fieldList.map((_data, index) => {
                                                            if (_data.options.readonly === true && _data.options.dataType === "number") {
                                                                return <option key={index} value={_data.options.title} >{_data.options.title}</option>
                                                            }
                                                        })}
                                                    </NativeSelect>
                                                    {
                                                        (this.state.error === true && this.state.stepvaluefrom === '') && <span className="errorMessage">Step value required</span>
                                                    }
                                                </FormControl>
                                            </div>
                                        </Grid>
                                    }
                                    {
                                        this.state.stepToggle === false &&
                                        <Grid item xs={6}>
                                            <div className="sliderModalTitleBox">
                                            <TextField type="number" name="stepvalue" label="Step" value={this.state.stepvalue} InputLabelProps={{ shrink: true }} placeholder="Enter step value" fullWidth margin="normal" onChange={this.handleChange} />
                                                {
                                                    (this.state.error === true && this.state.stepvalue === '') && <span className="errorMessage">Step value required</span>
                                                }
                                            </div>
                                        </Grid>
                                    }
                                    <Grid item sm={4} xs={6}>
                                        <div className="sliderModalTitleBox">
                                            <MuiThemeProvider theme={Switch_Theme}>
                                                <FormControlLabel
                                                    control={
                                                    <Checkbox
                                                      name="currentToggle"
                                                      checked={this.state.currentToggle}
                                                      onChange={this.toggleChangeHandler}
                                                      value="checkedA"
                                                        color="primary"
                                                    />
                                                    }
                                                    label="Custom Field"
                                                />
                                            </MuiThemeProvider>
                                        </div>
                                    </Grid>
                                    {
                                       this.state.currentToggle === true && 
                                       <Grid item xs={6}>
                                           <div className="sliderModalTitleBox">
                                               <FormControl className="formCtrl">
                                                    <InputLabel>Default Value field</InputLabel>
                                                    <NativeSelect className="selectBox" name="currentvaluefrom" value={this.state.currentvaluefrom} onChange={this.handleChange} >
                                                        <option value=""></option>
                                                        {
                                                            this.props.fieldList.map((_data, index) => {
                                                                if (_data.options.readonly === true && _data.options.dataType === "number"){
                                                                    return <option key={index} value={_data.options.title} > {_data.options.title}</option>
                                                                }
                                                            })
                                                        }
                                                    </NativeSelect>
                                                    {
                                                        (this.state.error === true && this.state.currentvaluefrom === '') && <span className="errorMessage">Default value required. </span>
                                                    }
                                                    {
                                                        (this.state.curValError === true && this.state.currentvalue !== '') && <span className="errorMessage">Default Value is greater than Max value</span>
                                                    }
                                               </FormControl>
                                           </div>
                                       </Grid>
                                    }
                                    {
                                        this.state.currentToggle === false &&
                                        <Grid item xs={6}>
                                            <div className="sliderModalTitleBox">
                                                <TextField type="number" name="currentvalue" label="Default" value={this.state.currentvalue} InputLabelProps={{ shrink: true }} placeholder="Enter default value" fullWidth margin="normal" onChange={this.handleChange} />
                                                {
                                                    (this.state.error === true && this.state.currentvalue === '') && <span className="errorMessage">Default value required</span>
                                                }
                                                {
                                                    (this.state.curValError === true && this.state.currentvalue !== '') && <span className="errorMessage">Default Value is greater than Max value</span>
                                                }
                                            </div>
                                        </Grid>
                                    }
                                       
                                    <Grid item xs={12} style={{marginTop: "15px"}}>

                                        <Grid container spacing={0}>
                                            <Grid item xs={12}>
                                                <div className="sliderModalFooter">
                                                    <Button className="cancelFieldBtn appSecondaryClr" onClick={this.handleCancel}>Cancel</Button>
                                                    <Button className="saveFieldBtn appSecondaryBGClr" onClick={this.insertSlider}>Save</Button>
                                                </div>
                                            </Grid>
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