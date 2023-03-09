import React from "react";
import './HeaderStyle.css';

export default class HeaderComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    render(){
        return(
            <div>
                Header tab
            </div>
        )
    }
}