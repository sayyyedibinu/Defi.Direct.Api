import React from 'react';
import './ApplicationErrorComponentstyle.css';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
/*import TextField from '@material-ui/core/TextField';*/
import /*Draft, */{ /*rawToDraft, draftToRaw, */draftToHtml } from 'react-wysiwyg-typescript';
/*import { convertFromRaw, EditorState, convertToRaw } from 'draft-js';*/
import ReactHtmlParser from 'react-html-parser';


export default class ApplicationErrorComponent extends React.Component{
   
    getTextArea = (_obj) =>{
        try{
            if (this.props.AppErrMsg === '') return this.props.ActualError;
            else return ReactHtmlParser( draftToHtml(JSON.parse(this.props.AppErrMsg)) );
        }catch(e){
            console.error('error:::', e);
            return "";
        }        

    }
    render(){
        return(
            <Modal open={this.props.showApplicationMessage} onClose={this.props.closeApplicationMessage} >
              <div  style={{width: "100%"}}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={10} md={9} lg={6} className="AEC-Wrapper">
                        <div className="AEC-Container">
                            <span className="AEC-CloseBtn" onClick={this.props.closeApplicationMessage}>
                                <i className="material-icons">clear</i>
                            </span>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <h2 className="AEC-Header">{this.props.AppErrTitle ? this.props.AppErrTitle : "Oh no"}</h2>
                                </Grid>
                                <Grid item xs={12}>
                                    <div className="AEC-Footer addPageModalFooter">
                                    {
                                        this.props.AppErrMsg &&

                                        <div className="AEC-Header">{(this.props.AppErrMsg)?this.getTextArea(this.props.AppErrMsg):''}</div>
                                    }
                                    { !this.props.AppErrMsg && this.props.ActualError &&
                                         <div className="AEC-Header">{(this.props.ActualError)}</div>

                                    }
                                   
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <div className="AEC-Footer addPageModalFooter">
                                        <Button variant="contained" className="closeBtn" onClick={this.props.closeApplicationMessage}>
                                            Close
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
