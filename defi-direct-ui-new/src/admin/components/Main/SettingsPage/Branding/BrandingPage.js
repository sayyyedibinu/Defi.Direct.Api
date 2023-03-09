import React from "react";
import { Link } from "react-router-dom";
import "./BrandingPageStyle.css";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dropzone from 'react-dropzone';
import Switch from '@material-ui/core/Switch';
import config from "../../../../resources/config.json";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const Switch_Theme = createMuiTheme({
    palette: {
        primary: { main: config.defaultSecondaryClr}
    }
});

/*import ColorPicker from 'rc-color-picker';*/

export default class BrandingPageComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = { logo: '', disabledDrop: false, defaultPrimary: '#7068E2', defaultSecondary: '#83CAFD', defaultBackground: '#FCFCFD', selectedLogo: {}, primaryColorError: false, secondaryColorError: false, customLogoUrl: '', openNewTab: true };
    }
    componentDidUpdate = (prevProps) => {
        if(prevProps.logo !== this.props.logo){
            if(this.props.logo !== '') this.setState({logo: this.props.logo, disabledDrop: true});
        }
        if (prevProps.data !== this.props.data) {
            this.setState({ defaultPrimary: (this.props.data.settings.defaultPrimary ? this.props.data.settings.defaultPrimary : '#7068E2'), defaultSecondary: (this.props.data.settings.defaultSecondary ? this.props.data.settings.defaultSecondary : '#83CAFD'), defaultBackground: (this.props.data.settings.defaultBackground ? this.props.data.settings.defaultBackground : '#FCFCFD'), customLogoUrl: (this.props.data.settings.customLogoUrl ? this.props.data.settings.customLogoUrl : ''), openNewTab: ((Object.prototype.toString.call(this.props.data.settings.openNewTab) !== '[object Undefined]') ? this.props.data.settings.openNewTab : this.state.openNewTab) });
        }
    }
    onDrop = (file) => {
        this.props.handleDataChange();
        /*window.clientLogo = file[0].preview;*/
        this.setState({selectedLogo: file[0], disabledDrop: true}, () => {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.setState({logo: event.target.result});
            };
            reader.readAsDataURL(this.state.selectedLogo);
        });
    }
    removeLogo = () => {
        this.props.handleDataChange();
        /*window.clientLogo = null;*/
        this.setState({logo: '', selectedLogo: {}, disabledDrop: false});
    }
    saveSettings = () => {
        let _postData = this.props.data.settings;
            _postData.defaultPrimary = this.state.defaultPrimary;
            _postData.defaultSecondary = this.state.defaultSecondary;
            _postData.defaultBackground = this.state.defaultBackground;
            _postData.customLogoUrl = this.state.customLogoUrl;
            _postData.openNewTab = this.state.openNewTab;
        
        this.setState({primaryColorError: false, secondaryColorError: false});
        
        let _tempPrimary = this.state.defaultPrimary;
        if(_tempPrimary.indexOf('#') === -1){
            this.setState({primaryColorError: true, secondaryColorError: false});
           return;
        }
        _tempPrimary = _tempPrimary.replace('#', '');
        if(_tempPrimary.length !== 3 && _tempPrimary.length !== 6 ){
            this.setState({primaryColorError: true, secondaryColorError: false});
           return;
        }
        let _tempSecondary = this.state.defaultSecondary;
        if(_tempSecondary.indexOf('#') === -1){
            this.setState({primaryColorError: false, secondaryColorError: true});
           return;
        }
        _tempSecondary = _tempSecondary.replace('#', '');
        if(_tempSecondary.length !== 3 && _tempSecondary.length !== 6 ){
            this.setState({primaryColorError: false, secondaryColorError: true});
           return;
        }
        this.props.saveSettings(this.props.data.title, _postData, this.state.logo);
        /*if(this.state.logo !== {}){
            const reader = new FileReader();
            reader.onload = (event) => {
                console.log(event.target.result);
                this.props.saveSettings(this.props.data.title, _postData, event.target.result);
            };
            reader.readAsDataURL(this.state.selectedLogo);
        }else if(this.props.logo || ) {
                 
         }else{
            this.props.saveSettings(this.props.data.title, _postData);
        }*/
    }
    render(){
        return(
            <div className="brandingPage">
                <div className="firstRow">
                    <span className="headerTxt">Logo</span>
                    <p className="descTxt">This logo will be displayed to your application on the top of the page as they navigate throught your application. (Maximum Width of the logo should be 165px and Maximum Height should be 33px )</p>
                    
                    <Dropzone className="uploadLogoCnt" onDrop={this.onDrop.bind(this)} disabled={this.state.disabledDrop} multiple={false}>
                        {this.state.disabledDrop && <span className="removeImgBtn" onClick={this.removeLogo}><i className="material-icons">delete</i></span>}
                        {this.state.disabledDrop && <img src={this.state.logo !== "" ? this.state.logo : this.state.selectedLogo.preview} alt="Logo" className="seletcedLogo" />}
                        {
                            this.state.disabledDrop === false && 
                                <span className="uploadEmptyCnt">
                                <i className="material-icons uploadPlaceholder">backup</i>
                                <p>Click or Drag and Drop Here.</p> 
                                </span>
                                
                        }
                        
                    </Dropzone>
                    <TextField label="Custom Logo URL" margin="normal" helperText="Please input the URL that you would like users directed to when they click on your logo" fullWidth name="customLogoUrl" value={this.state.customLogoUrl} onChange={(event) => {this.setState({ customLogoUrl: event.target.value });this.props.handleDataChange();}} />
                    <MuiThemeProvider theme={Switch_Theme}>
                        Open in New Tab <Switch className="openNewTab" color="primary" checked={this.state.openNewTab} onChange={() => {this.setState({ openNewTab: !this.state.openNewTab }); this.props.handleDataChange();}} />
                    </MuiThemeProvider>
                </div>
                <hr className="divider" />
                <div className="secondRow">
                    <span className="headerTxt">Colors</span>
                    <p className="descTxt">Customize the colors of the buttons, text and background of your application to match your brand.</p>
                    <div className="colorPickerCnt">
                        <div className="primaryColorWrapper">
                            <span className="colorPickerC-headerTxt">Primary</span>
                            <p className="colorPickerC-descTxt">Used for main interactions. (Deep colors work the best)</p>
                            {
                                this.state.primaryColorError === true && 
                                <p className="errorCnt">Please enter valid color code (eg: #FFF or #FFFFFF)</p>
                                    
                            }
                            <span className="primaryColorCnt">
                                <span className="showColorCnt" style={{background: this.state.defaultPrimary}}></span>
                                <TextField label="" margin="normal" className="showColorTextField" value={this.state.defaultPrimary} onChange={(event) => {window.primaryColor = event.target.value;this.setState({defaultPrimary: event.target.value});this.props.handleDataChange();}}/>
                            </span>
                        </div>
                        <div className="secondaryColorWrapper">
                            <span className="colorPickerC-headerTxt">Secondary</span>
                            <p className="colorPickerC-descTxt">Used as an accent to the primary color</p>
                            {
                                this.state.secondaryColorError === true && 
                                <p className="errorCnt">Please enter valid color code (eg: #FFF or #FFFFFF)</p>
                                    
                            }
                            <span className="secondaryColorCnt">
                                <span className="showColorCnt" style={{background: this.state.defaultSecondary}}></span>
                                <TextField label="" margin="normal" className="showColorTextField" value={this.state.defaultSecondary} onChange={(event) => {window.secondaryColor = event.target.value;this.setState({defaultSecondary: event.target.value});this.props.handleDataChange();}}/>
                            </span>
                        </div>
                        <div className="backgroundColorWrapper">
                            <span className="colorPickerC-headerTxt">Background</span>
                            <p className="colorPickerC-descTxt">Used to fil the background space behind application.</p>
                            <span className="backgroundColorCnt">
                                <span className="showColorCnt" style={{background: this.state.defaultBackground}}></span>
                                <div className="showColorSelectField">
                                    <Select style={{"minWidth": "150px", "maxWidth": "150px","minHeight": "35px", "maxHeight": "35px", "padding": "0", "lineHeight": "0", "textAlign": "left", "marginTop": "10px", "overflow": "hidden"}}value={this.state.defaultBackground} onChange={(event) => {window.backgroundColor = event.target.value;this.setState({defaultBackground: event.target.value});this.props.handleDataChange();}} >
                                        <MenuItem value={'#FCFCFD'}>Very Light Gray</MenuItem>
                                        <MenuItem value={'#E5E5E5'}>Very Light Gray2</MenuItem>
                                        <MenuItem value={'#E8E8E8'}>Very Light Gray3</MenuItem>
                                        <MenuItem value={'#DFDFDF'}>Very Light Gray4</MenuItem>
                                    </Select>
                                </div>
                                
                            </span>
                        </div>
                    </div>
                </div>
                <div className="footerBtnCnt">
                    <Button className="cancelBtn appSecondaryClr">
                        <Link to="/main/sites">Cancel</Link>
                    </Button>
                    <Button type="button" variant="contained" className="saveBtn appSecondaryBGClr" onClick={this.saveSettings}>Save Settings</Button>
                </div>
            </div>
        )
    }
}

/*<div className="uploadLogoCnt">
                        <span className="removeImgBtn"><i className="material-icons">delete</i></span>
                    </div>*/