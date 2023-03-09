import React from 'react';

import './FormStepsStyle.css';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

class FormStepsComponent extends React.Component{
    
    render(){
        return (
            <div>
                {
                    this.props.steps.map( (_data, _index) => {
                        return <ListItem key={_index} className={this.props.selectedStep === _index ? "formStepListCnt higlight":"formStepListCnt"}>
                                <Avatar className="iconCnt">
                                    <Button variant="fab" aria-label="add" style={{'background': (this.props.selectedStep === _index ? this.props.primaryColor:'')}} >{_index+1}</Button>
                                </Avatar>
                                <ListItemText primary={_data} className="title" />
                            </ListItem>
                    })
                }
                <ListItem className="formStepListCnt addCnt">
                    <span className="addIconCnt">
                        <i className="material-icons">add_circle</i>
                    </span>
                    <ListItemText primary="Insert Step" className="title" />
                </ListItem>
                <br />
            </div>
        );
    }
}

export default FormStepsComponent;