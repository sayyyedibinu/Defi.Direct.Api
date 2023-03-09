import React from "react";
import { Link } from "react-router-dom";
import "./GeneralPageStyle.css";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
/*import Draft, { rawToDraft, draftToRaw } from 'react-wysiwyg-typescript';*/
import Draft, { /*htmlToDraft, draftToHtml, EmptyState, */rawToDraft, draftToRaw /*, draftStateToHTML*/} from 'react-wysiwyg-typescript';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import config from "../../../../resources/config.json";

const Switch_Theme = createMuiTheme({
    palette: {
        primary: { main: config.defaultSecondaryClr }
    }
});

export default class GeneralPageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {editorState: '', title: '', settings: {}};
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps.data !== this.props.data) {
            this.setState({title: this.props.data.title, settings: this.props.data.settings, editorState: (this.props.data.settings.footerText?rawToDraft(this.props.data.settings.footerText) : '') });
        }
    }
    onInputChange = (event) => {
        this.props.handleDataChange();
        let _tempVar = this.state;
        if(event.target.name === 'title')
            _tempVar.title = event.target.value;
        else 
            _tempVar.settings[event.target.name] = event.target.value;
             this.setState(_tempVar);

    }
    saveGeneral = (event, data) => {
        event.preventDefault();
        let _tempVar = this.state;
        try{
            _tempVar.settings.footerText = draftToRaw(this.state.editorState);
        }catch(e){
            console.error(e);
        }
        this.setState(_tempVar, () => {
            this.props.saveSettings(this.state.title, this.state.settings);
        });
        
        /*console.log(draftToRaw(this.state.editorState));*/
        /*console.log(footerContentObj.innerHTML);*/
        /*try{
            console.log(htmlToDraft(this.state.editorState));
        }catch(e){
            console.error(e)
        }
        try{
            console.log(draftToHtml(this.state.editorState));
        }catch(e){
            console.error(e)
        }
        try{
            console.log(rawToDraft(this.state.editorState));
        }catch(e){
            console.error(e)
        }*/
//        try{
//            console.log(draftToRaw(this.state.editorState));
//            console.log(rawToDraft(draftToRaw(this.state.editorState)));
//            console.log(draftStateToHTML(draftToRaw(this.state.editorState)));
//            console.log(draftToHtml(draftToRaw(this.state.editorState)));
//        }catch(e){
//            console.error(e)
//        }
        /*try{
            console.log(draftStateToHTML(this.state.editorState));
        }catch(e){
            console.error(e)
        }*/
        
        /*console.log(JSON.stringify(this.state.editorState));*/
    }
    render(){
        return(
            <div className="generalPage">
                <form autoComplete="off" onSubmit={this.saveGeneral}>
                    <TextField label="Site Title" margin="normal" fullWidth required={true} name="title" value={this.state.title ? this.state.title:''} onChange={this.onInputChange} />
                    <TextField label="App Submit URL" margin="normal" helperText="Input the URL that your applications will be submitted to" fullWidth required={true} name="submitUrl" value={this.state.settings.submitUrl ? this.state.settings.submitUrl:''} onChange={this.onInputChange} />
                    <TextField label="App Update URL" margin="normal" helperText="Input the URL that your updated applications will be submitted to" fullWidth required={false} name="updateUrl" value={this.state.settings.updateUrl ? this.state.settings.updateUrl:''} onChange={this.onInputChange} />
                    <TextField label="Source System Code" margin="normal" helperText="Input the Source System Code here" fullWidth required={true} name="ssc" value={this.state.settings.ssc ? this.state.settings.ssc:''} onChange={this.onInputChange} />
                    <TextField label="Client Dealer ID" margin="normal" helperText="Input your Client Dealer ID here" fullWidth required={true} name="dealerId" value={this.state.settings.dealerId ? this.state.settings.dealerId:''} onChange={this.onInputChange} />
                    <hr className="divider" />
                    <span>Site Footer Text</span>
                    <Draft id="_draftEditor"
                        editorState={this.state.editorState}
                        onEditorStateChange={(editorState) => { this.props.handleDataChange();this.setState({ editorState }); }}
                        toolbar ={
                            {
                                options:['inline', 'blockType', 'fontSize', 'list', 'history', 'textAlign', 'colorPicker', 'link' ], 

                                fontSize: {
                                    options: ["8", "10", "12", "14", "16", "18", "20", "22", "24", "26", "28", "30", "32", "34", "36", "38", "40", "44", "48", "52", "56", "60", "70", "80", "90"]
                                },
                                link: {defaultTargetOption: '_blank'} 
                            }                                                       
                        }
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