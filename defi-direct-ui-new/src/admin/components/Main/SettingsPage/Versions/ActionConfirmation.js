import React from 'react';
import './ActionConfirmationStyle.css';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
/*import TextField from '@material-ui/core/TextField';*/

export default class ActionConfirmation extends React.Component{
    render(){
        return(
            <Modal open={this.props.showModal} onClose={this.props.closeModal} >
              <div  style={{width: "100%"}}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={10} md={9} lg={6} className="DFC-Wrapper">
                        <div className="DFC-Container">
                            <span className="DFC-CloseBtn" onClick={this.props.closeModal}>
                                <i className="material-icons">clear</i>
                            </span>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <h2 className="DFC-Header">Are you sure to publish the site?</h2>                                    
                                </Grid>
                                <Grid item xs={12}>
                                    <div className="DFC-Footer addPageModalFooter">
                                        <Button className="cencelBtn appSecondaryClr" onClick={this.props.closeModal}>Cancel</Button>
                                        <Button variant="contained" className="okayBtn appSecondaryBGClr" onClick={this.props.makeVersionActive}>OK</Button>
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
