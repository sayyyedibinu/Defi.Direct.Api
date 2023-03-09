import React from 'react';
import './SelectComponentModalStyle.css';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';

export default class SelectComponentModalComponent extends React.Component{
    componentSelected = (_name) =>{
        if(this.props.closeModal) this.props.closeModal();
        if(this.props.componentSelected) this.props.componentSelected(_name);
    }
    render(){
        return(
            <Modal className="SCModal scrollableModal" aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" open={this.props.showModal} onClose={this.props.closeModal} >
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={10} md={9} lg={6} className="modalWrapper">
                        <div className="modalContainer">
                            <span className="modalCloseBtn" onClick={this.props.cancelModal}>
                                <i className="material-icons">clear</i>
                            </span>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <h2 className="modalHeader1">Choose a component</h2>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={0} className="SCModal-body">
                                        <Grid item xs={6} sm={6} md={4} lg={4} xl={4} onClick={() => this.componentSelected('Field')}>
                                            <span className="compCnt">
                                                <span className="iconCnt">
                                                    <img src={require('../../../../assets/img/field_new.png')} alt="Field" />
                                                </span>
                                                <h3>Field</h3>
                                                <p>text fields, dropdowns, multiple choice, date inputs</p>
                                            </span>
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={4} lg={4} xl={4} onClick={() => this.componentSelected('Text')}>
                                            <span className="compCnt">
                                                <span className="iconCnt">
                                                    <img src={require('../../../../assets/img/text_new.png')} alt="Text" />
                                                </span>
                                                <h3>Text</h3>
                                                <p>Write instructional or descriptive text for your users</p>
                                            </span>
                                        </Grid>
                                        <Grid item xs={6} sm={6} md={4} lg={4} xl={4} onClick={() => this.componentSelected('Image')}>
                                            <span className="compCnt">
                                                <span className="iconCnt">
                                                    <img src={require('../../../../assets/img/image_new.png')} alt="Field" />
                                                </span>
                                                <h3>Image</h3>
                                                <p>.jpg, .png, .gif, or .svg</p>
                                            </span>
                                        </Grid>
                                        {this.props.showSlider === true && 
                                        <Grid item xs={6} sm={6} md={4} lg={4} xl={4} onClick={() => this.componentSelected('Slider')}>
                                            <span className="compCnt">
                                                <span className="iconCnt">
                                                    <img src={require('../../../../assets/img/slider_new.png')} alt="Slider" />
                                                </span>
                                                <h3>Slider</h3>
                                                <p>Select a value from slider</p>
                                            </span>
                                        </Grid>
                                        }
                                        {this.props.showButton === true &&
                                        <Grid item xs={6} sm={6} md={4} onClick={() => this.componentSelected('Button')}>
                                            <span className="compCnt">
                                                <span className="iconCnt">
                                                    <img src={require('../../../../assets/img/button_new.png')} alt="Link" />
                                                </span>
                                                <h3>Button</h3>
                                                <p>Pick an action</p>
                                            </span>
                                        </Grid>
                                        }
                                        {this.props.showTable === true && 
                                        <Grid item xs={6} sm={6} md={4} lg={4} xl={4} onClick={() => this.componentSelected('Table')}>
                                            <span className="compCnt">
                                                <span className="iconCnt">
                                                    <img src={require('../../../../assets/img/tableicon.png')} alt="Table" />
                                                </span>
                                                <h3>Table</h3>
                                                <p>Insert a table</p>
                                            </span>
                                        </Grid>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </Modal>
        )
    }
}