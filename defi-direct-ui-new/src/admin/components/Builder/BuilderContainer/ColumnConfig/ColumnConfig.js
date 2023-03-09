import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import './ColumnConfigStyle.css';

export default class ColumnConfigComponent extends React.Component{
    constructor(props){
        super(props);
        this.state={columnSplit: 1, showWarningMsg: false};
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps.columnSplit === this.props.columnSplit) return;
        this.setState({columnSplit: this.props.columnSplit});
    }
    
    fieldWidthClicked = (width) => {
        this.setState({columnSplit: width, showWarningMsg: (width < this.props.columnSplit? true : false)});
    }
    saveField = () =>{
        this.props.confirmColumnConfiguration(this.state.columnSplit);
    }
    render(){
        return(
            <Modal open={this.props.showColumnConfiguration} onClose={this.props.closeColumnConfiguration} >
              <div  style={{width: "100%"}}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={10} md={9} lg={6} className="CC-Wrapper">
                        <div className="CC-Container">
                            <span className="CC-CloseBtn" onClick={this.props.closeColumnConfiguration}>
                                <i className="material-icons">clear</i>
                            </span>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <h2 className="CC-Header">Row Configuration</h2>
                                </Grid>
            
                                <Grid item xs={12} className="CC-Body">
                                    <Grid container spacing={0}>
                                        <Grid item xs={12}>
                                            <Grid container spacing={0}>
                                                <Grid item sm={12} className="fieldWidthCnt">
                                                    <Button variant="outlined" color="primary" className={this.state.columnSplit === 1 ? "fieldWidthBtn selected" : "fieldWidthBtn"} onClick={() => this.fieldWidthClicked(1)}>1 Column</Button>
                                                    <Button variant="outlined" color="primary" className={this.state.columnSplit === 2 ? "fieldWidthBtn selected" : "fieldWidthBtn"} onClick={() => this.fieldWidthClicked(2)}>2 Column</Button>
                                                    <Button variant="outlined" color="primary" className={this.state.columnSplit === 3 ? "fieldWidthBtn selected" : "fieldWidthBtn"} onClick={() => this.fieldWidthClicked(3)}>3 Column</Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        
                                        {
                                            this.state.showWarningMsg === true && 
                                            <Grid item xs={12} className="columnChangeWarning">
                                                Are you sure? Reducing the no. of columns could delete components.
                                            </Grid>
                                        }
                                        
                                    </Grid>
                                </Grid>
                            
                                <Grid item xs={12}>
                                    <Grid container spacing={0}>
                                        <Grid item sm={12} xs={12}>
                                            <div className="CC-Footer">
                                                <Button variant="contained" className="cancelBtn appSecondaryClr" onClick={this.props.closeColumnConfiguration}>
                                                    Cancel
                                                </Button>
                                                <Button variant="contained" className="saveBtn appSecondaryBGClr" onClick={this.saveField}>
                                                    Save
                                                </Button>
                                            </div>
                                        </Grid>
                                    </Grid>
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
