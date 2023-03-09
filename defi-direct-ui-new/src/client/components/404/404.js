import React from "react";

import './404.css';

export default class PageNotFoundComponent extends React.Component{
    render(){
        return(
            <div className="notFoundWrapper">
                <p className="title1"><b>This page is unavailable.</b></p>
                <p className="subTitle1">If you typed in a URL, double-check the spelling.</p>
                <p className="subTitle1">This may also be due to a temporary condition such as an outage, scheduled maintenance or upgrade.</p>
            </div>
        )
    }
}