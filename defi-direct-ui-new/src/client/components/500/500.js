import React from "react";
import "./PageErrorStyle.css";

export default class PageErrorComponent extends React.Component{
    render(){
        return(
            <div className="errorInfoCnt">
                <h3>Oh no!! Something went wrong!! Please contact your defi administrator.</h3>
            </div>
        )
    }
}