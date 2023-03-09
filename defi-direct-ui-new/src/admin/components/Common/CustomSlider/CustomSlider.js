import React from "react";
import Slider from '@material-ui/lab/Slider';

import './CustomSliderStyle.css';


export default class CustomSliderComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            disable: (this.props.disable ? this.props.disable : false),
            step: (this.props.step ? this.props.step : 1),
            minValue: (this.props.minValue ? this.props.minValue : 1),
            maxValue: (this.props.maxValue ? this.props.maxValue : 100),
            currentValue: (this.props.currentValue ? this.props.currentValue : 50),
        };
    }
    componentDidUpdate = (prevProps) => {
       
        let _tempVar = {};

        if (prevProps.maxValue !== this.props.maxValue) 
        {
            _tempVar.maxValue = this.props.maxValue;
            this.setState(_tempVar);

        }
       
        if (prevProps.minValue !== this.props.minValue) 
        {
          
             _tempVar.minValue = this.props.minValue;
             this.setState(_tempVar);

        }
        if (prevProps.currentValue !== this.props.currentValue) 
        {
          
             _tempVar.currentValue = this.props.currentValue;
             this.setState(_tempVar);

        } if (prevProps.currentValue !== this.props.currentValue) 
        {
          
             _tempVar.currentValue = this.props.currentValue;
             this.setState(_tempVar);

        }
        // if (prevProps.step !== this.props.step) 
        // {
          
        //      _tempVar.step = this.props.step;
        //      this.setState(_tempVar);

        // }
        
        if(JSON.stringify(_tempVar) === "{}") return;
        this.setState(_tempVar);
       

    }
    sliderOnChange = (event, value) => {
        if(this.state.disable === true) return;
        this.setState({currentValue: value});
        if(Object.prototype.toString.call(this.props.sliderChanged) === "[object Function]") this.props.sliderChanged(value);
    }
    render(){
        return(
            <span className="sliderCnt">
                <Slider min={this.state.minValue} max={this.state.maxValue} step={this.state.step} value={this.state.currentValue} 
                    onChange={this.sliderOnChange} 
                />  
                <div className="sliderInfoCnt">
                    <span className="sliderMinValue">{this.state.minValue}</span>
                    <span className="sliderCurrentValue">{this.state.currentValue}</span>
                    <span className="sliderMaxValue">{this.state.maxValue}</span>
                </div>
            </span>
        )
    }
}