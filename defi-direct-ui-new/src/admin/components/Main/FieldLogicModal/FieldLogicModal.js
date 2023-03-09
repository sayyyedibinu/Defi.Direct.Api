import React from "react";
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import TextField from '@material-ui/core/TextField';
import Autocomplete from "react-autocomplete";
import NativeSelect from '@material-ui/core/NativeSelect';

import './FieldLogicModalStyle.css';
import dataShare from "../../Common/dataShare";

export default class FieldLogicModalComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {anchorEl: null, logic: [], fields: []};
        setTimeout(this.setDefault, 300);
    }
    componentDidMount = () => {
        this.setDefault();
        dataShare.getFieldList(true, (error, data) => {
            if(error !== null){
                this.props.showNotification('error', 'Internal server error while fetching dropdown information, please try after sometime.');
                return;
            }
            data = data.filter((item) => {
                return (item.options.dataType === 'number' && item.options.isActive === true)
            });
            this.setState({fields: data})
        })
    }
    componentDidUpdate = (prevProps) => {
        if(prevProps.fieldLogic === this.props.fieldLogic) return;
        if(this.props.fieldLogic === ""){
            this.setDefault();
            return;
        }
        try{
            this.setState({logic: JSON.parse(this.props.fieldLogic), logicCopie: this.props.fieldLogic});
        }catch (e){
            console.error(e);
            this.setDefault();
        }
    }
    handleClickMenu = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };
    handleMenuItemClick = (event, selected) => {
        console.log(selected.option);
        let _tempVar = {mandatory: false, text: "", isField: false, isOperator: false};
        if(selected.option === 'Field'){
            _tempVar.isField = true;
            _tempVar.isOperator = false;
            _tempVar.isValid = false;
            _tempVar.text = "";
        }
        if(selected.option === 'Static'){
            _tempVar.isField = false;
            _tempVar.isOperator = false;
            _tempVar.text = 1;
        }
        if(selected.option === '+' || selected.option === '-' || selected.option === '*' || selected.option === '/'){
            _tempVar.isField = false;
            _tempVar.isOperator = true;
            _tempVar.text = selected.option;
        }
        let _existingLogic = this.state.logic;
        _existingLogic.splice(this.state.logic.length-1, 0, _tempVar);
        this.setState({ anchorEl: null, logic: _existingLogic});
    };
    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    setDefault = () => {
        let _defaultValue = [{
            mandatory: true,
            isField: false,
            isOperator: true,
            text: "("
        },{
            mandatory: true,
            isField: false,
            isOperator: true,
            text: ")"
        }];
        this.setState({logic: _defaultValue, logicCopie: _defaultValue});
    };
    removeItem = (index) => {
        let _logic = this.state.logic;
        _logic.splice(index, 1);
        this.setState({logic: _logic});
    };
    cancelFieldLogic = () => {
        try{
            this.setState({logic: JSON.parse(this.state.logicCopie)});
        }catch(e){
            this.setDefault();
        }
        this.props.closeFieldLogicModal()
    }
    saveFieldLogic = () =>{
        if(this.state.logic.length === 2){
            this.props.submitFieldLogic("");
            return;
        }
        for(let i = 0; i < this.state.logic.length; i++){
            if(this.state.logic[i].text === ""){
                this.props.showNotification('error', 'Invalid Field Logic. Please select value for blank field.');
                return;
            }
            if(this.state.logic[i].isField === true && this.state.logic[i].isValid === false){
                this.props.showNotification('error', 'Invalid Field Logic. Please select value for blank field.');
                return;
            }
        }
        if(this.state.logic.length > 2){
            if(this.state.logic[this.state.logic.length -2].isOperator === true){
                this.props.showNotification('error', 'Invalid Field Logic. Please complete the formula.');
                return;
            }
        }
        this.props.submitFieldLogic(this.state.logic);
    };
    getAddContent = (_obj, index) => {
        return (
            <span key={index+1}>
                <span className="tagCnt addCnt" onClick={this.handleClickMenu}>
                    <i className="material-icons">note_add</i>
                </span>
                {
                    this.getTagContent(_obj, index)
                }
            </span>
        )
    };
    onValueChanged = (event, index) => {
        let _logic = this.state.logic;
        _logic[index].text = event.target.value;
        if(event.target.name === "Field")
            _logic[index].isValid = false;
        this.setState({logic: _logic});
    }
    onSelect = (event, index) => {
        let _logic = this.state.logic;
        _logic[index].text = event.target.value;
        _logic[index].isValid = true;
        this.setState({logic: _logic});
    }
    getFieldAutoComplete = (_obj, index) => {
        return (
            <span className="Autocomplete">
                <Autocomplete
                    shouldItemRender={(item, value) => item.options.title.toLowerCase().indexOf(value.toLowerCase()) > -1}
                  getItemValue={(item) => item.options.title}
                  items={this.state.fields}
                  renderItem={(item, isHighlighted, index) => 
                    <div className="sugestions" style={{ background: isHighlighted ? 'lightgray' : 'white', zIndex: 1 }} key={Math.random()}>
                      {item.options.title}
                    </div>
                  }
                  value={_obj.text}
                  onChange={(event) => this.onValueChanged({target: {name: 'Field', value: event.target.value}}, index)}
                  onSelect={(val) => this.onSelect({target: {name: 'Field', value: val}}, index)}
                />
            </span>
        );
    }
    getTagContent = (_obj, index) => {
        return(
            <span className="tagCnt" key={index}>
                {
                    (_obj.isField === false && _obj.isOperator === false) && 
                    <TextField
                        type="number"
                        className="staticField"
                        value={_obj.text}
                        margin="normal"
                        onChange={(event) => this.onValueChanged(event, index)}
                    />
                }
                {
                    _obj.isField === true && this.getFieldAutoComplete(_obj, index)
                }
                {
                    /*_obj.isOperator === true && <span className="textCnt">{_obj.text}</span>*/
                    (_obj.isOperator === true && _obj.text !== "(" && _obj.text !== ")") && 
                    <NativeSelect
                        value={_obj.text}
                        onChange={(event) => {
                            let _tempVar = this.state.logic;
                            _tempVar[index].text = event.target.value;
                            this.setState({logic: _tempVar});
                        }}
                      >
                        <option value="+">+</option>
                        <option value="-">-</option>
                        <option value="*">*</option>
                        <option value="/">/</option>
                      </NativeSelect>
                }
                {
                    (_obj.isOperator === true && (_obj.text === "(" || _obj.text === ")")) && <span className="textCnt">{_obj.text}</span>
                }
                {
                    (_obj.mandatory === false && this.state.logic.length - 2 === index) && 
                    <i className="material-icons close" onClick={() => this.removeItem(index)}>close</i>
                }
            </span>
        )
    };
    getLastItem = () => {
        if(this.state.logic.length === 0) return true;
        return this.state.logic[this.state.logic.length-2].isOperator;
    };
    getMenuItem = () => {
        if(this.getLastItem() === true) return ['Field', 'Static'];
        return ['+', '-', '*', '/'];
    };
    
    render(){
        return(
            <Modal open={this.props.showFieldLogicModal} onClose={this.props.closeFieldLogicModal} >
            
{/*options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={index === 0}
                      selected={index === this.state.selectedIndex}
                      onClick={event => this.handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))*/}

              <div style={{ width: "100%", overflow: "auto", height: "100vh" }}>
                
                <Menu
                      anchorEl={this.state.anchorEl}
                      open={Boolean(this.state.anchorEl)}
                      onClose={this.handleClose}
                    >
                    {
                        this.getMenuItem().map( (option, index) => {
                          return (
                            <MenuItem
                                key={index}
                              onClick={event => this.handleMenuItemClick(event, {option})}
                            >
                              {option}
                            </MenuItem>
                          )
                        })
                    }
                </Menu>

                <Grid container spacing={0}>
                    <Grid item xs={12} sm={10} md={9} lg={6} className="FL-Wrapper">
                        <div className="FL-Container">
                            <span className="FL-CloseBtn" onClick={this.props.closeFieldLogicModal}>
                                <i className="material-icons">clear</i>
                            </span>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <h2 className="FL-Header">Field Logic</h2>
                                </Grid>
                            </Grid>
            
                            <Grid container spacing={0} className="FL-Body">
                                <Grid item xs={12}>
                                    {
                                        this.state.logic.map( (_obj, index) => {
                                            return (
                                                this.state.logic.length - 1 === index ? this.getAddContent(_obj, index) : this.getTagContent(_obj, index)
                                                
                                            )
                                        })
                                    }
                                </Grid>
                            </Grid>
            
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <div className="FC-Footer">
                                        <Button variant="contained" className="cancelBtn appSecondaryClr" onClick={this.cancelFieldLogic}>
                                                Cancel
                                        </Button>
                                        <Button variant="contained" className="saveBtn appSecondaryBGClr" onClick={this.saveFieldLogic}>
                                            Save
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

/*<div className="createModalCnt">
                </div>*/