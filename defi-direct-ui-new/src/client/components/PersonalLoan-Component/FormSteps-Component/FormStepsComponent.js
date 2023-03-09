import React from 'react';

//import AppConfig from '../../resources/config.json';

/*import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';*/
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';

import './FormStepsStyle.css';
import Empty from './Empty';

export default class FormStepsComponent extends React.Component{
    constructor(props){
        super(props);
        
        this.goBack = this.goBack.bind(this);
        
    }
    componentDidMount = () => {
        /*console.log(this.props.color);*/
    }
    goBack(index){
        this.props.goToStep(index);
    }
    render(){
        return (
            <Stepper activeStep={this.props.currentState} orientation="vertical" className="formStepCnt" connector={<Empty />}>
              {this.props.getSteps().map((_obj, index) => {
                return (
                  <Step key={_obj.id} className={this.props.currentState === index ? "formSteps active" : "formSteps"}>
                    <StepLabel onClick={this.goBack.bind(null, index)} className="formSteps-label">
                        {_obj.label}
                    </StepLabel>
                    <StepContent></StepContent>
                  </Step>
                );
              })}
            </Stepper>
        );
    }
}