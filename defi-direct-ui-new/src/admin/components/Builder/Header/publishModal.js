import React from 'react';
import './publishModalStyle.css';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import dataShare from "../../Common/dataShare";

export default class PublishModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { title:'', comments: '', titleEmpty:false,urlEmpty:false,customUrl:this.props.customUrl,urlCnt:'',previewURL: window.location.origin+'/Application/' };
    }
    componentWillReceiveProps=()=>{
        this.setState({title:this.props.siteTitle,customUrl:this.props.customUrl});
    }
    componentDidUpdate = (prevProps) => {        
        if (prevProps.customUrl !== this.props.customUrl)     
        {
            this.setState({
                customUrl: this.props.customUrl
              });             
        }       
       
    }
    inputChanged = (i, e) => {
        if (i === "title"){
            this.setState({ title: e.value });
            if(e.value.trim() !== "")
                this.setState({titleEmpty:false});
            else
                this.setState({titleEmpty:true});
        }
        else if(i === "comment"){
            this.setState({ comments: e.value });
        }
        else if(i === "url"){          
            this.setState({ customUrl: e.value });
            if(e.value.trim() !== "")
                this.setState({urlEmpty:false});
            else
                this.setState({urlEmpty:true});
           
        }
    }
    btnPublishHandler = () =>{

        if(!this.state.customUrl || this.state.customUrl.trim() === "")
        {  this.setState({urlEmpty:true});
           return;
         }
         if(!this.state.title || this.state.title.trim() === "")
        {   this.setState({titleEmpty:true});
            return;
            }
        dataShare.validateCustomUrl(this.state.customUrl,this.props.siteId, (error, response) => {
            if (error) {
                if (error.response && error.response.status === 409) this.props.showNotification('error', error.response.data);
                else this.props.showNotification('error', 'Internal server error while fetching values.');
                return;
            }
            else
            {
                if(this.state.title && this.state.title.trim() !== "" ){
                    let versionObj = {title:this.state.title,comments:this.state.comments,customUrl:this.state.customUrl};
                    this.setState({ title: '', comments: '', titleEmpty:false ,customUrl:'',urlEmpty:false});
                    this.props.confirmPublish(versionObj);
                }
                else{
                    if(!this.state.title || this.state.title.trim() === "")
                      {   this.setState({titleEmpty:true});
                          return;
                         }
                    if(!this.state.customUrl || this.state.customUrl.trim() === "")
                       {  this.setState({urlEmpty:true});
                          return;
                        }
                }
            }
           // this.setState({FieldNames: response});
        })
    }
    btnCloseHandler = () => {
        this.setState({ title: '', comments: '', titleEmpty:false,urlEmpty:false });
        this.props.closePublishModal();
    }
    render() {
        return (
            <Modal open={this.props.showPublishModal} onClose={this.props.closePublishModal} >
                <div style={{ width: "100%" }}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={10} md={9} lg={6} className="SIM-Wrapper">
                            <div className="SIM-Container">
                                <span className="SIM-CloseBtn" onClick={this.btnCloseHandler}>
                                    <i className="material-icons">clear</i>
                                </span>
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <h2 className="SIM-Header">Publish Site</h2>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className="Text-Section">
                                            <Grid item xs={12}>
                                                <TextField className="inputBox" inputProps={{maxLength: 150}} label="Title" name="title" value={this.state.title} onChange={(e) => this.inputChanged("title", e.target)} helperText="This is just an internal title to review published versions in version history." fullWidth required/>
                                                {
                                                    this.state.titleEmpty && <span className="errorMessage">Title required</span>
                                                }
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField className="inputBox" label="Comments" name="comments" multiline rows="2" rowsMax="4" value={this.state.comments} onChange={(e) => this.inputChanged("comment", e.target)} fullWidth helperText="Add comments on what changes are done in this published version." />
                                            </Grid>
                                            <Grid item xs={12} className="top15px">
                                                {/* <label className="lblUrl"> {this.state.previewURL} </label> */}
                                                <TextField className="lblUrl" label="URL" fullWidth value={this.state.previewURL + this.state.customUrl} helperText="This is a system generated URL that should be used to post applications to this site." disabled/>
                                            </Grid>
                                            <Grid item xs={12} className="top15px">
                                                <TextField className="inputBox" fullWidth label="Customize your URL" name="customurl" value={this.state.customUrl}  onChange={(e) => this.inputChanged("url", e.target)} helperText="The URL can be customized to make it more business friendly." required/>

                                                {
                                                    this.state.urlEmpty && <span className="errorMessage">Custom Url required</span>
                                                }
                                            </Grid>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className="Warning-Section">
                                            <i className="material-icons">warning</i>
                                            <em>Publishing will save your unsaved changes!</em>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className="SIM-Footer">
                                            <Button variant="contained" className="cancelBtn appSecondaryClr" onClick={this.btnCloseHandler}>
                                                Cancel
                                        </Button>
                                            <Button variant="contained" className="insertBtn appSecondaryBGClr" onClick={this.btnPublishHandler}>
                                                Publish
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
