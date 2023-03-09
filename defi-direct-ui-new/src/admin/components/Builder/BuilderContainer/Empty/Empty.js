import React from "react";
import './EmptyStyle.css';

import Button from '@material-ui/core/Button';

export default class EmptyComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    render(){
        return(
            <div className="emptyPageWrapper">
                <img src={require('../../../../assets/img/illustration-pagesEmptyState.png')} alt="EmptyState" width="165" height="104" />
                <h2 className="header1">Looks like you haven't added a page yet.</h2>
                <h6 className="header2">Add a page by inserting one from the left side menu or click below</h6>
                <Button variant="contained" className="addPageBtn" onClick={this.props.openModal}>Add Page</Button>
            </div>
        )
    }
}