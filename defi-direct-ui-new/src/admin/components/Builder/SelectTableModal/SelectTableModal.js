import React from "react";
import './SelectTableModalStyle.css';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import config from "../../../resources/config.json";

const Switch_Theme = createMuiTheme({
    palette: {
        primary: { main: config.defaultSecondaryClr }
    }
});
export default class SelectTableModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rowcount: 0,
            colcount: 0,
            table: [],
            cells: {},
            toggles: {},
            rowError: false,
            colError: false,
            rowErrorMsg: false,
            colErrorMsg: false
        };
    }

    textChangeHandler = (i, event) => {
        let cell = this.state.cells;
        cell[i] = event.target.value;
        this.setState({ 'cells': cell });
    }

    toggleChangeHandler = (i, event) => {
        let toggles = this.state.toggles;
        toggles[i] = !this.state.toggles[i];
        this.setState({ 'toggles': toggles });

        var rowvalue = this.state.rowcount;
        var colvalue = this.state.colcount;
        let newtable = [];
        let row = [];
        for (let i = 0; i < rowvalue; i++) {
            let children = [];
            for (let j = 0; j < colvalue; j++) {
                children.push(<td key={'Toggle-' + i + ',' + j}><div className="sliderModalTitleBox">
                    <MuiThemeProvider theme={Switch_Theme}>
                              Field: 
                        <Switch className="toggleBtn" defaultChecked={toggles[i + ',' + j]} onChange={this.toggleChangeHandler.bind(this, i + ',' + j)} color="primary" />
                    </MuiThemeProvider>
                </div></td>);
                if (toggles[i + ',' + j] === false) {
                    children.push(<td key={'Cell-' + i + ',' + j}><input type="text" key={i + ',' + j} onChange={this.textChangeHandler.bind(this, i + ',' + j)} /></td>);
                } else {
                    children.push(<td key={'Cell-' + i + ',' + j}><div>
                        <NativeSelect className="selectBox" key={i + ',' + j} onChange={this.textChangeHandler.bind(this, i + ',' + j)} >
                            <option value=""></option>
                            {this.props.fieldList.map((_data, index) => {
                                if (_data.options.readonly === true) {
                                    return <option key={i + ',' + j + ',' + index} value={_data.options.title} >{_data.options.title}</option>
                                }
                            })}
                        </NativeSelect>
                    </div></td>);
                }
            }
            row.push(<tr key={'Row-' + i}>{children}</tr>);
        }
        newtable.push(<table key="Newtable"><tbody>{row}</tbody></table>);
        this.setState({ 'table': newtable });
    }

    handleChange = (event) => {
        var rowvalue = this.state.rowcount;
        var colvalue = this.state.colcount;
        
        if (event.target.name === 'rowcount') {
            rowvalue = event.target.value;
            this.setState({
                rowError: false,
                rowErrorMsg: false
            });
            if (rowvalue === '') {
                this.setState({ rowError: true });
            } 
            else if (rowvalue < 1) {
                this.setState({ rowErrorMsg: true });
            }
        } else {
            colvalue = event.target.value;
            this.setState({
                colError: false,
                colErrorMsg: false
            });
            if (colvalue === '') {
                this.setState({ colError: true });
            } 
            else if (colvalue < 1) {
                this.setState({ colErrorMsg: true });
            }
        }
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.value && event.target.value > 0) {}
        else { return; }

        let oldtoggles = this.state.toggles;
        let toggles = {};
        let newtable = [];
        let row = [];
        for (let i = 0; i < rowvalue; i++) {
            let children = [];
            for (let j = 0; j < colvalue; j++) {
                if (typeof (oldtoggles[i + ',' + j]) === 'undefined' || oldtoggles[i + ',' + j] === null) {
                    toggles[i + ',' + j] = false;
                } else {
                    toggles[i + ',' + j] = oldtoggles[i + ',' + j];
                }
                children.push(<td key={'Toggle-'+i+','+j}><div className="sliderModalTitleBox">
                    <MuiThemeProvider theme={Switch_Theme}>
                              Field: 
                        <Switch className="toggleBtn" defaultChecked={toggles[i + ',' + j]} onChange={this.toggleChangeHandler.bind(this, i + ',' + j)} color="primary" />
                    </MuiThemeProvider>
                </div></td>);
                if (toggles[i + ',' + j] === false) {
                    children.push(<td key={'Cell-'+i+','+j}><input type="text" key={i + ',' + j} onChange={this.textChangeHandler.bind(this, i + ',' + j)} /></td>);
                } else {
                    children.push(<td key={'Cell-' + i + ',' + j}><div>
                        <NativeSelect className="selectBox" key={i + ',' + j} onChange={this.textChangeHandler.bind(this, i + ',' + j)} >
                            <option value=""></option>
                            {this.props.fieldList.map((_data, index) => {
                                if (_data.options.readonly === true) {
                                    return <option key={i+','+j+','+index} value={_data.options.title} >{_data.options.title}</option>
                                }
                            })}
                        </NativeSelect>
                    </div></td>);
                }
            }
            row.push(<tr key={'Row-' + i}>{children}</tr>);
        }
        newtable.push(<table key="Newtable" border='1'><tbody>{row}</tbody></table>);
        this.setState({ 'toggles': toggles });
        this.setState({ 'table': newtable });
    };

    insertTable = () => {
        let error = false;
        if (this.state.rowcount === '' || this.state.rowcount === 0) {
            this.setState({ rowError: true });
            error = true;
        }
        else if (this.state.rowcount < 1) {
            this.setState({ rowErrorMsg: true });
            error = true;
        }
        if (this.state.colcount === '' || this.state.colcount === 0) {
            this.setState({ colError: true });
            error = true;
        }
        else if (this.state.colcount < 1) {
            this.setState({ colErrorMsg: true });
            error = true;
        }
        if (error === true) {
            return;
        }
        this.props.insertTable(this.state.rowcount, this.state.colcount, this.state.toggles, this.state.cells);
        this.setState({
            rowcount: 0,
            colcount: 0,
            table: [],
            toggles: {},
            cells: {},
            rowError: false,
            colError: false,
            rowErrorMsg: false,
            colErrorMsg: false
        });
    }
    
    render() {
        const { classes } = this.props;
        return (
            <Modal aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" open={this.props.showModal} onClose={this.props.closeModal} >
                <div style={{ width: "100%", height: "100vh", overflow: "auto" }}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={10} md={11} lg={10} className="sliderModalWrapper selectTableModalWrapper">
                            <div className="sliderModalContainer">
                                <span className="sliderModalCloseBtn" onClick={this.props.closeModal}>
                                    <i className="material-icons">clear</i>
                                </span>
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <h2 className="sliderModalHeader1">Table Settings</h2>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={0} className="sliderModal-body">
                                            <Grid item xs={6}>
                                                <div className="sliderModalTitleBox">
                                                    <TextField type="number" name="rowcount" label="Row Count" inputProps={{ min: "1" }} InputLabelProps={{ shrink: true }} placeholder="No of rows" fullWidth margin="normal" onChange={this.handleChange} />
                                                    {
                                                        this.state.rowError === true && <span className="errorMessage">Row value required</span>
                                                    }
                                                    {
                                                        this.state.rowErrorMsg === true && <span className="errorMessage">Row count should be greater than 0</span>
                                                    }
                                                </div>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <div className="sliderModalTitleBox">
                                                    <TextField type="number" name="colcount" label="Column Count" inputProps={{ min: "1" }} InputLabelProps={{ shrink: true }} placeholder="No of columns" fullWidth margin="normal" onChange={this.handleChange} />
                                                    {
                                                        this.state.colError === true && <span className="errorMessage">Column value required</span>
                                                    }
                                                    {
                                                        this.state.colErrorMsg === true && <span className="errorMessage">Column count should be greater than 0</span>
                                                    }
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                       <div className="DP-TableCnt">
                                           {this.state.table}
                                       </div>
                                    </Grid>
                                
                                    <Grid item xs={12}>
                                        <Grid container spacing={0}>
                                            {
                                                <Grid item xs={12} md={12}>
                                                    <div className="sliderModalFooter">
                                                        <Button className="cancelFieldBtn appSecondaryClr" onClick={this.props.closeModal}>Cancel</Button>
                                                        <Button className="saveFieldBtn appSecondaryBGClr" onClick={this.insertTable}>Submit</Button>
                                                    </div>
                                                </Grid>
                                            }
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