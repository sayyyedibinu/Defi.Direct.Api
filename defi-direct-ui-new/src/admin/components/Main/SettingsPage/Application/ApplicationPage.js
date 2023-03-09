import React from "react";
import { Link } from "react-router-dom";
import "./ApplicationPageStyle.css";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Draft, { rawToDraft, draftToRaw } from 'react-wysiwyg-typescript';

export default class ApplicationPageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {editorState: '', title: '', settings: {}};
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps.data !== this.props.data) {
            this.setState({settings: this.props.data.settings, editorState: (this.props.data.settings.applicationErrMessage?rawToDraft(this.props.data.settings.applicationErrMessage) : '')});
        }
    }
    onInputChange = (event) => {
        this.props.handleDataChange();
        let _tempVar = this.state.settings;
        _tempVar.applicationErrTitle = event.target.value;
        this.setState(_tempVar);
    }
    
    saveApplicationErr = (event, data) => {
        event.preventDefault();
        let _tempVar = this.state.settings;
        try{
            _tempVar.applicationErrMessage = draftToRaw(this.state.editorState);
            _tempVar.applicationErrMessageTitle = this.state.errtitle;           
        }catch(e){
            console.error(e);
        }
        this.setState(_tempVar, () => {
            this.props.saveSettings(this.props.data.title, this.state.settings);
        });
        
     
    }
    render(){
        return(
            <div className="applicationPage">
                <form autoComplete="off" onSubmit={this.saveApplicationErr}>
                    <TextField label="Error Title" margin="normal" helperText="Please input the error message you would like to display to the end user" fullWidth required={true} name="applicationErrTitle" value={this.state.settings.applicationErrTitle ? this.state.settings.applicationErrTitle:''} onChange={this.onInputChange} />
                   <hr className="divider" />
                    <span>Error Content</span>
                    <Draft id="applicationErrMessage"
                    toolbar ={
                        {
                        options:['inline', 'blockType', 'fontSize', 'list', 'history' ],                         
                        inline:
                        {
                        options:['bold', 'italic', 'underline', 'strikethrough']                         
                        },

                        }
                    }
                        editorState={this.state.editorState}
                        onEditorStateChange={(editorState) => { this.setState({ editorState });this.props.handleDataChange(); }}
                    />
                    <div className="footerBtnCnt">
                        <Button className="cancelBtn appSecondaryClr">
                            <Link to="/main/sites">Cancel</Link>
                        </Button>
                        <Button type="submit" variant="contained" className="saveBtn appSecondaryBGClr">Save Settings</Button>
                    </div>
                </form>
            </div>
        )
    }
}