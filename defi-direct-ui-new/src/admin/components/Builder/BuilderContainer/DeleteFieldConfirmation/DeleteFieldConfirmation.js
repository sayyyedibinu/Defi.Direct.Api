import React from 'react';
import './DeleteFieldConfirmationStyle.css';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
/*import TextField from '@material-ui/core/TextField';*/

export default class DeleteFieldConfirmationComponent extends React.Component{
    render(){
        return(
            <Modal open={this.props.showDeleteConfirmation} onClose={this.props.closeDeleteConfirmation} >
              <div  style={{width: "100%"}}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={10} md={9} lg={6} className="DFC-Wrapper">
                        <div className="DFC-Container">
                            <span className="DFC-CloseBtn" onClick={this.props.closeDeleteConfirmation}>
                                <i className="material-icons">clear</i>
                            </span>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <h2 className="DFC-Header">Are You Sure to Delete {this.props.deletePopFor === 'Row' ? ' the entire row ' : ''}?</h2>
                                </Grid>
                                <Grid item xs={12}>
                                    <div className="DFC-Footer addPageModalFooter">
                                        <Button variant="contained" className="cancelBtn appSecondaryClr" onClick={this.props.closeDeleteConfirmation}>
                                            Cancel
                                        </Button>
                                        <Button variant="contained" className="deleteBtn" onClick={this.props.confirmDelete}>
                                            Delete
                                        </Button>
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
