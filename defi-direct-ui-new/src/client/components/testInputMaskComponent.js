import React from 'react';
import InputMask from 'react-input-mask';
import MaterialInput from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';


export default class TestInputMaskComponent extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {value1: "", value2: "", value3: "", value4: "", value5: "", value6: ""};
        
    }
    onChange = (event) => {
        let _tempVar = {};
        if(event.target.name !== "value3" && event.target.name !== "value4" && event.target.name !== "value5") _tempVar[event.target.name] = event.target.value.replace(/\D+/g, '');
        else if(event.target.name === "value3") _tempVar[event.target.name] = event.target.value.replace("$", '');
        else _tempVar[event.target.name] = event.target.value.replace("%", '');
        this.setState(_tempVar);
    }
    
    handleSubmit = () => {
        // your submit logic
        console.log(this.state)
    }
    getPercentageMask = () => {
        
    }
    render(){
        return (
            <ValidatorForm
                ref="form"
                onSubmit={this.handleSubmit}
                onError={errors => console.log(errors)}
            >
                <div>
                
                        <InputMask mask="(999) 999-9999" value={this.state.value1} onChange={this.onChange} placeholder="phone number" helperText="enter phone number in this box" label="phone number" >
                        {(inputProps) => <TextValidator name="value1" {...inputProps} type="tel" disableunderline="true" validators={["matchRegexp:^\\([0-9]{3}\\)\\s[0-9]{3}-[0-9]{4}$"]} errorMessages={['Invalid phone number']} />}
                      </InputMask>
                        <br />
                        <InputMask mask="99999" value={this.state.value2} onChange={this.onChange}>
                        {(inputProps) => <MaterialInput name="value2" {...inputProps} type="tel" disableunderline="true" />}
                      </InputMask>
                        <br />
                        <InputMask mask="99999-9999" value={this.state.value2} onChange={this.onChange}>
                        {(inputProps) => <MaterialInput name="value2" {...inputProps} type="tel" disableunderline="true" />}
                      </InputMask>
                        <br />
                        <InputMask mask="999-99-9999" value={this.state.value2} onChange={this.onChange}>
                        {(inputProps) => <MaterialInput name="value2" {...inputProps} type="tel" disableunderline="true" />}
                      </InputMask>
                        <br />
                        <InputMask mask="$ ???????????????" formatChars={{"?": "[0-9\.\-]"}} maskChar={null} value={this.state.value3} onChange={this.onChange}>
                        {(inputProps) => <MaterialInput name="value3" {...inputProps} type="tel" disableunderline="true" />}
                      </InputMask>
                        <br />
                        <InputMask mask="??????????????? %" formatChars={{"?": "[0-9]"}} maskChar={null} value={this.state.value4} onChange={this.onChange}>
                        {(inputProps) => <span><MaterialInput name="value4" {...inputProps} type="tel" disableunderline="true" />%</span>}
                      </InputMask>
                        <br />
                        <InputMask mask="????? %" formatChars={{"?": "[0-9\.]"}} maskChar={null} value={this.state.value5} onChange={this.onChange}>
                        {(inputProps) => <MaterialInput name="value5" {...inputProps} type="tel" disableunderline="true" />}
                      </InputMask>
                </div>

                <Button type="submit">Submit</Button>
            </ValidatorForm>
                
            );
        
    }
}

