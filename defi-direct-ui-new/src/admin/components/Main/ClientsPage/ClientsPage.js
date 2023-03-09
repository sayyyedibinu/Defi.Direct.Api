import React from "react";
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import fileDownload from 'js-file-download';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import config from "../../../resources/config.json";
import generateGUID from "../../Common/generateGUID";
import dataShare from "../../Common/dataShare";
import './ClientsPageStyle.css';
import Select from '@material-ui/core/Select';
import CreateModal from '../CreateClientModal/CreateClientModal';
import EditModal from '../EditClientModal/EditClientModal';
import FooterPagination from "../../Common/FooterPagination/FooterPagination";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

const Switch_Theme = createMuiTheme({
    palette: {
        primary: { main: config.defaultSecondaryClr }
    }
});

export default class ClientsPageComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            clientList: [],
            originalClientList: '{}',
            showModal: false,
            showEditModal: false,
            modalError: false,
            modalUrlError: false,
            modalEditError: false,
            anchorEl: null,
            currentClickedID: null,
            currentClickedName: null,
            previewURL: window.location.origin + '?',
            showingClients: "All",
            currentPage: 0,
            recordsPerPage: '10',
            pageCount: 10,
            helperText: "Your URL: https://",
            helperTextChange: false
        };
    }
    
    componentDidMount = () => {
        this.getClientList();
    }
    getClientList = () => {
        dataShare.getClientList((error, response) => {
            this.setState({ isLoading: false });
            if (error) {
                this.props.showNotification('error', 'Internal server error while fetching clients, please try after sometime.');
                return;
            }
            this.setState({ clientList: response, originalClientList: JSON.stringify(response) });
        })
    }
    inputChangeHandler = (event) => {
        let _tempVar = this.state;
        if (event.target.name === "isActive") {
            this.state.isActive = !(this.state.isActive);
            _tempVar[event.target.name] = this.state.isActive;
        } else {
            _tempVar[event.target.name] = event.target.value;
        }
        if (event.target.name === "hostName") {
            _tempVar['helperText'] = "Your URL: https://" + event.target.value;
            if (event.target.value.length > 0) {
                _tempVar['helperTextChange'] = true;
            }
            else 
                _tempVar['helperTextChange'] = false;
        }
        this.setState(_tempVar);
    }
    editChangeHandler = (event) => {
        let _tempVar = this.state;
        if (event.target.name === "isActive") {
            this.state.isActive = !(this.state.isActive);
            _tempVar[event.target.name] = this.state.isActive;
        } else {
            _tempVar[event.target.name] = event.target.value;
        }
        this.setState(_tempVar);
    }
    openModal = () => {
        this.setState({ clientName: '', hostName: '', isActive: true, defaultFrom: 'baseline', showModal: true, modalError: false, modalUrlError: false });
    }
    openEditModal = (_client) => {
        this.setState({ clientId: _client.id, clientName: _client.name, hostName: _client.host, isActive: _client.isActive, showEditModal: true, modalEditError: false });
    }
    closeModal = () => {
        this.setState({ showModal: false });
    }
    closeEditModal = () => {
        this.setState({ showEditModal: false });
    }
    submitBtnClicked = () => {
        console.log(this.state);
        if (this.state.clientName === '' || this.state.hostName === '' || this.state.copyFrom === '') {
            this.setState({ modalError: true });
            return;
        }
        var pattern = /^((http|https|ftp):\/\/)/;
        if (pattern.test(this.state.hostName)) {
            this.setState({ modalUrlError: true });
            return;
        }
        this.createNewClient(this.state.clientName, this.state.hostName, this.state.isActive, this.state.copyFrom ? this.state.copyFrom : this.state.defaultFrom);
    }
    updateBtnClicked = () => {
        if (this.state.clientName === '' || this.state.hostName === '') {
            this.setState({ modalError: true });
            return;
        }
        this.updateClient(this.state.clientId, this.state.clientName, this.state.hostName, this.state.isActive);
    }
    
    filterChanged = (event) => {
        let _tempVar = {};
        _tempVar[event.target.name] = event.target.value;
        _tempVar.recordsPerPage = "All";
        _tempVar.pageCount = 0;
        this.setState(_tempVar, () => this.filterData());
    }

    filterData = () => {
        let _tempVar = {};

        if (this.state.showingClients === "All") _tempVar.clientList = JSON.parse(this.state.originalClientList);
        if (this.state.showingClients === "Active") {
            let originalClientList = JSON.parse(this.state.originalClientList);
            let clientList = [];
            for (let i = 0; i < originalClientList.length; i++) {
                if (originalClientList[i].isActive === true)
                    clientList.push(originalClientList[i]);
            }
            _tempVar.clientList = clientList;
        }
        if (this.state.showingClients === "Inactive") {
            let originalClientList = JSON.parse(this.state.originalClientList);
            let clientList = [];
            for (let i = 0; i < originalClientList.length; i++) {
                if (originalClientList[i].isActive === false)
                    clientList.push(originalClientList[i]);
            }
            _tempVar.clientList = clientList;
        }
        this.setState(_tempVar);
    }

    createNewClient = (clientName, hostName, isActive, copyFrom) => {

        this.setState({ modalError: false, modalUrlError: false });
        document.dispatchEvent(new CustomEvent("showAppLoader"));
        let clientId = generateGUID();
        let newClientData = {
            "id": clientId,
            "name": clientName,
            "host": hostName,
            "isActive": isActive
        };
        axios.post(config.API_BASE_URL + 'Clients', newClientData).then((response) => {
            if (response.status !== 200) {
                this.props.showNotification('error', response.data);
                return;
            }

            let copyClientData = {
                "id": clientId,
                "basename": copyFrom
            };
            axios.post(config.API_BASE_URL + 'Clients/copy', copyClientData).then((response) => {
                if (response.status !== 200) {
                    this.props.showNotification('error', response.data);
                    return;
                }
                this.closeModal();
                this.props.history.push('/main/clients');
            }, (error) => {
                console.error(error.response.data);
                if (error.response.status === 409)
                    this.props.showNotification('error', error.response.data);
                else
                    this.props.showNotification('error', 'Internal server error while creating clients, please try after sometime.');
            });
        }, (error) => {
            console.error(error.response.data);
            if (error.response.status === 409)
                this.props.showNotification('error', error.response.data);
            else
                this.props.showNotification('error', 'Internal server error while creating clients, please try after sometime.');
        }).finally(() => {
            document.dispatchEvent(new CustomEvent("hideAppLoader"));
        });
    }
    updateClient = (clientId, clientName, hostName, isActive) => {
        this.setState({ modalError: false, modalUrlError: false });
        document.dispatchEvent(new CustomEvent("showAppLoader"));
        let clientData = {
            "id": clientId,
            "name": clientName,
            "host": hostName,
            "isActive": isActive
        };
        axios.put(config.API_BASE_URL + 'Clients', clientData).then((response) => {
            if (response.status !== 200) {
                this.props.showNotification('error', response.data);
                return;
            }
            this.closeEditModal();
            this.getClientList();
            this.props.history.push('/main/clients');
        }, (error) => {
            console.error(error.response.data);
            if (error.response.status === 409)
                this.props.showNotification('error', error.response.data);
            else
                this.props.showNotification('error', 'Internal server error while creating clients, please try after sometime.');
        }).finally(() => {
            document.dispatchEvent(new CustomEvent("hideAppLoader"));
        });
    }
    getClientLoader = () => {
        return (
            <Grid item xs={12}>
                <div className="dashboardCards create">
                    <span className="createClientBntCnt">
                        <CircularProgress style={{ color: config.loaderColor }} size={50} />
                    </span>
                </div>
            </Grid>
        );
    }
    getClientsContainer = () => {
        return this.state.clientList
            .map((_client, index) => {
                if (this.state.recordsPerPage !== 'All') {
                    if (index < this.getFrom() || index > this.getTo()) return ""
                }
                return (
                    <Grid item xs={12} sm={12} key={_client.id} className="clientListWrapper">
                        <div className="clientListCnt">
                            <span className="clientName">{_client.name}</span>
                            <span className=".FP-actionCnt">
                                <MuiThemeProvider theme={Switch_Theme}>
                                    <Switch className="toggleBtn" checked={_client.isActive} color="primary" />
                                </MuiThemeProvider>
                                <span className="actionBtn editBtn" onClick={() => this.openEditModal(_client)}>
                                    <i className="material-icons material-icons--outline">edit</i>
                                </span>
                            </span>
                        </div>
                    </Grid>
                )
            })
    }

    searchClient = (event) => {
        let updatedList = JSON.parse(this.state.originalClientList);
        updatedList = updatedList.filter(function (item) {
            return item.name.toLowerCase().search(
                event.target.value.toLowerCase()) !== -1;
        });
        this.setState({ clientList: updatedList, recordsPerPage: "All", pageCount: 0 });
    }
    handlePageChange = (_obj) => {
        console.log(_obj.selected);
        this.setState({ currentPage: _obj.selected });
    }
    changeRecordsPerPage = (event) => {
        let _tempVar = {};
        _tempVar.recordsPerPage = event.target.value;
        if (_tempVar.recordsPerPage === 'All') {
            _tempVar.pageCount = 0;
            _tempVar.currentPage = 0;
        } else _tempVar.pageCount = 10;
        this.setState(_tempVar);
    }
    getFrom = () => {
        return (this.state.recordsPerPage === 'All' ? 0 : this.state.currentPage * this.state.recordsPerPage)
    }
    getTo = () => {
        return (
            (this.state.recordsPerPage === 'All' ? this.state.clientList.length : (this.state.currentPage === 0 ? (1 * this.state.recordsPerPage) : ((this.state.currentPage + 1) * this.state.recordsPerPage))) > this.state.clientList.length ? this.state.clientList.length : (this.state.recordsPerPage === 'All' ? this.state.clientList.length : (this.state.currentPage === 0 ? (1 * this.state.recordsPerPage) : ((this.state.currentPage + 1) * this.state.recordsPerPage))) - 1
        )
    }
    render() {
        const { anchorEl } = this.state;
        return (
            <div className="MainWrapper">
                <CreateModal isActive={this.state.isActive} clientList={this.state.clientList} defaultFrom={this.state.defaultFrom} showModal={this.state.showModal} openModal={this.openModal} closeModal={this.closeModal} submitBtnClicked={this.submitBtnClicked} inputChangeHandler={this.inputChangeHandler} modalError={this.state.modalError} modalUrlError={this.state.modalUrlError} helperText={this.state.helperText} helperTextChange={this.state.helperTextChange} />
                <EditModal clientName={this.state.clientName} hostName={this.state.hostName} clientId={this.state.clientId} isActive={this.state.isActive} showEditModal={this.state.showEditModal} openEditModal={this.openEditModal} closeEditModal={this.closeEditModal} updateBtnClicked={this.updateBtnClicked} editChangeHandler={this.editChangeHandler} modalEditError={this.state.modalEditError} />
                <div className="dashboardContainer">
                    <div className="searchCnt">
                        <Grid container>
                            <Grid item sm={8} xs={12} className="FP-filterCnt">
                                <TextField
                                    className="clientSearchCnt"
                                    placeholder="Search Client..."
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" className="clientSearchIconCnt">
                                                <i className="material-icons blueColor">search</i>
                                            </InputAdornment>
                                        ),
                                    }} onChange={this.searchClient}
                                />
                                <span className="selectBoxCnt">
                                    <span className="FP-label">Showing: </span>
                                    <Select className="selectBox" value={this.state.showingClients} name="showingClients" onChange={this.filterChanged}>
                                        <MenuItem value="All">All Clients</MenuItem>
                                        <MenuItem value="Active">Active</MenuItem>
                                        <MenuItem value="Inactive">Inactive</MenuItem>
                                    </Select>
                                </span> 
                            </Grid>
                            <Grid item sm={4} xs={12} className="FP-actionCnt">
                                <Button variant="contained" className="newClientBtn appSecondaryBGClr" onClick={this.openModal}>
                                    <i className="material-icons">add_circle</i>  New Client
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                    <Grid container spacing={32} className="SP-tableCnt">
                        {
                            this.state.isLoading && this.getClientLoader()
                        }
                        {
                            this.getClientsContainer()
                        }
                    </Grid>
                </div>
                <FooterPagination pageCount={this.state.pageCount} dataSet={this.state.clientList} recordsPerPage={this.state.recordsPerPage} currentPage={this.state.currentPage} handlePageChange={this.handlePageChange} changeRecordsPerPage={this.changeRecordsPerPage} />
            </div>
        )
    }
} 