import React from 'react';
import './refreshConfirmationStyle.css';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
/*import TextField from '@material-ui/core/TextField';*/

export default class RefreshConfirmation extends React.Component{
    render(){
        return(
            <Modal open={this.props.showDeleteConfirmation} onClose={this.props.closeRefreshConfirmation} >
              <div  style={{width: "100%"}}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={10} md={9} lg={6} className="DFC-Wrapper">
                        <div className="DFC-Container">
                            <span className="DFC-CloseBtn" onClick={this.props.closeRefreshConfirmation}>
                                <i className="material-icons">clear</i>
                            </span>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <h2 className="DFC-Header">Are you sure to refresh the site?</h2>
                                    <div className="DFC-Text" style={{marginLeft: '15px', marginRight: '15px', fontSize: '14px'}}>Refreshing the site will update all the fields and fields lists in this site and any unsaved changes will be discarded. Select Cancel to go back and save your changes. Otherwise, click OK to discard changes and refresh the site.</div>
                                </Grid>
                                <Grid item xs={12}>
                                    <div className="DFC-Footer addPageModalFooter">
                                        <Button className="cencelBtn appSecondaryClr" onClick={this.props.closeRefreshConfirmation}>Cancel</Button>
                                        <Button variant="contained" className="okayBtn appSecondaryBGClr" onClick={this.props.confirmRefresh}>OK</Button>
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
