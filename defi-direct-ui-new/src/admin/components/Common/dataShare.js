import axios from 'axios';
import config from "../../resources/config.json";

let siteList = [];
let siteDetails = {};
let fieldList = [];
let clientList = [];
let versionsList = [];
let ruleList = [];
let userList = [];

let getSiteList = (callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    if (siteList.length > 0) callback(null, siteList);

    axios.get(config.API_BASE_URL + 'Sites').then((response) => {
        siteList = response.data;
        callback(null, response.data);
    }, (error) => {
        callback(error);
    });
};

let getForcedSiteList = (callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};

    document.dispatchEvent(new CustomEvent("showAppLoader"));
    axios.get(config.API_BASE_URL + 'Sites').then((response) => {
        siteList = response.data;
        callback(null, response.data);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
};

let getClientList = (callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    if (clientList.length > 0) callback(null, clientList);
    axios.get(config.API_BASE_URL + 'Clients').then((response) => {
        clientList = response.data;
        callback(null, response.data);
    }, (error) => {
        callback(error);
    });
};

let getSiteDetails = (_id, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    if (siteDetails.Id === _id) callback(null, siteDetails);
    else {
        siteDetails = {};
        document.dispatchEvent(new CustomEvent("showAppLoader"));
    }
    axios.get(config.API_BASE_URL + 'Sites/' + _id).then((response) => {
        siteDetails = response.data;
        callback(null, response.data);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
};

let force_getSiteDetails = (_id, callback) => {
    document.dispatchEvent(new CustomEvent("showAppLoader"));
    axios.get(config.API_BASE_URL + 'Sites/' + _id).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}

let getFieldList = (_force, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    if (fieldList.length > 0 && !_force) callback(null, fieldList);
    else {
        fieldList = [];
        if (!_force) document.dispatchEvent(new CustomEvent("showAppLoader"));
    }
    axios.get(config.API_BASE_URL + 'Fields').then((response) => {
        fieldList = response.data;
        callback(null, response.data);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}

let getRulesList = (_force, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    if (ruleList.length > 0 && !_force) callback(null, ruleList);
    else {
        ruleList = [];
        if (!_force) document.dispatchEvent(new CustomEvent("showAppLoader"));
    }
    axios.get(config.API_BASE_URL + 'rules').then((response) => {
        ruleList = response.data;
        callback(null, response.data);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}

let getRuleByID = (id, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    document.dispatchEvent(new CustomEvent("showAppLoader"));
    axios.get(config.API_BASE_URL + 'rules/' + id).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}
let getVersionsList = (id, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    if (versionsList.length > 0) callback(null, versionsList);

    axios.get(config.API_BASE_URL + 'Sites/Versions/' + id).then((response) => {
        versionsList = response.data;
        callback(null, response.data);
    }, (error) => {
        callback(error);
    });
};
let setVersionToActive = (_data, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    document.dispatchEvent(new CustomEvent("showAppLoader"));
    axios.post(config.API_BASE_URL + 'sites/Versions/' + _data.siteId + '/' + _data.versionId).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}
let getFieldById = (id, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    axios.get(config.API_BASE_URL + 'fields/' + id).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    });
}

let updateField = (data, callback) => {
    axios.put(config.API_BASE_URL + 'Fields', data).then((response) => {
        callback(null, response);
    }, (error) => {
        callback(error, data);
    });
}

let updateRule = (data, callback) => {
    axios.post(config.API_BASE_URL + 'rules', data).then((response) => {
        callback(null, response);
    }, (error) => {
        callback(error, data);
    });
}

let updateApplicationData = (data, _id, startoverflag, callback) => {
    axios.put(config.API_BASE_URL + 'Application/UpdateAppData/' + _id + '/' + startoverflag, data).then((response) => {
        callback(null, response);
    }, (error) => {
        callback(error, data);
    });
}

let getXSD = (id, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    document.dispatchEvent(new CustomEvent("showAppLoader"));
    axios.get(config.API_BASE_URL + 'sites/CreateXsd/' + id).then((response) => {
        callback(null, response);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}
let getUserInfo = (callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    axios.get(config.API_BASE_URL + 'user/UserInfo').then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    })
}
let getFieldListItems = (fieldListId, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    document.dispatchEvent(new CustomEvent("showAppLoader"));
    axios.get(config.API_BASE_URL + 'FieldListItems/' + fieldListId).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}

let getDropdownLists = (callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    document.dispatchEvent(new CustomEvent("showAppLoader"));
    axios.get(config.API_BASE_URL + 'FieldLists').then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}

let getDropdownListsById = (id, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    document.dispatchEvent(new CustomEvent("showAppLoader"));
    axios.get(config.API_BASE_URL + 'FieldLists/' + id).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}

let saveDropdownLists = (_method, _data, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    document.dispatchEvent(new CustomEvent("showAppLoader"));
    axios[_method](config.API_BASE_URL + 'FieldLists', _data).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}

let getFieldNamesById = (id, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    axios.get(config.API_BASE_URL + 'fields/GetFieldNames/' + id).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    });
}
let getOutputFieldsById = (id, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    axios.get(config.API_BASE_URL + 'sites/OutputFields/' + id).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    });
}

let saveCopysite = (_data, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    document.dispatchEvent(new CustomEvent("showAppLoader"));
    axios.post(config.API_BASE_URL + 'sites/copysite/' + _data.id + '/' + _data.title).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}

let postLog = (_url, _data) => {
    if (Object.prototype.toString.call(_url) === '[object Undefined]') _url = 'Log/Error';
    if (Object.prototype.toString.call(_data) !== '[object Object]') _data = {};
    axios.post(config.API_BASE_URL + _url, _data).then((response) => {
        /*console.info(null, response.data);*/
    }, (error) => {
        console.error(error);
    });
}

let refreshSite = (_id, callback) => {
    document.dispatchEvent(new CustomEvent("showAppLoader"));
    axios.put(config.API_BASE_URL + 'Sites/updatedSiteInfo/' + _id).then((response) => {
        callback(null, response);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}

let publishSite = (_data, callback) => {
    document.dispatchEvent(new CustomEvent("showAppLoader"));
    axios.post(config.API_BASE_URL + 'Sites/publish', _data).then((response) => {
        callback(null, response);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}
let saveApplication = (data, callback) => {
    document.dispatchEvent(new CustomEvent("showAppLoader"));
    axios.post(config.API_BASE_URL + 'Application', data).then((response) => {
        callback(null, response);
    }, (error) => {
        callback(error, data);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}
let validateCustomUrl = (url, id, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    axios.get(config.API_BASE_URL + 'sites/ValidateCustomUrl/' + url + '/' + id).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    });
}
let validateSliderName = (slidername, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    axios.get(config.API_BASE_URL + 'sites/validateSliderName/' + slidername).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    });
}

let getAnalyticsUrl = (callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    axios.get(config.API_BASE_URL + 'analytics/geturl').then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    });
}
let getBorrowerAppData = (data, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    axios.post(config.API_BASE_URL + 'Application/GetApplication', data).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    });
}
let getSiteInfo = (id, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    document.dispatchEvent(new CustomEvent("showAppLoader"));
    axios.get(config.API_BASE_URL + 'Application/' + id).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}
let viewDecision = (data, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    axios.post(config.API_BASE_URL + 'Application/GetDecision', data).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    });
}
let validateStepName = (stepname, id, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    axios.get(config.API_BASE_URL + 'sites/ValidateStepName/' + stepname + '/' + id).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    });
}

let getAllUser = (callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    if (userList.length > 0) callback(null, userList);

    axios.get(config.API_BASE_URL + 'user/getusers').then((response) => {
        userList = response.data;
        callback(null, response.data);
    }, (error) => {
        callback(error);
    });
}

let createUser = (data, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    document.dispatchEvent(new CustomEvent("showAppLoader"));

    axios.post(config.API_BASE_URL + 'user/adduser', data).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}

let resetPassword = (data, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    document.dispatchEvent(new CustomEvent("showAppLoader"));

    axios.post(config.API_BASE_URL + 'user/adminresetpassword', data).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}

let deleteUser = (data, callback) => {
    if (Object.prototype.toString.call(callback) !== '[object Function]') callback = () => {};
    document.dispatchEvent(new CustomEvent("showAppLoader"));

    axios.delete(config.API_BASE_URL + 'user/deleteUser', {data: data}).then((response) => {
        callback(null, response.data);
    }, (error) => {
        callback(error);
    }).finally(() => {
        document.dispatchEvent(new CustomEvent("hideAppLoader"));
    });
}

export default {
    getSiteList: getSiteList,
    getForcedSiteList: getForcedSiteList,
    getClientList: getClientList,
    getSiteDetails: getSiteDetails,
    force_getSiteDetails: force_getSiteDetails,
    getFieldList: getFieldList,
    getRulesList: getRulesList,
    getRuleByID: getRuleByID,
    updateField: updateField,
    updateRule: updateRule,
    getXSD: getXSD,
    getFieldListItems: getFieldListItems,
    getDropdownLists: getDropdownLists,
    saveDropdownLists: saveDropdownLists,
    getDropdownListsById: getDropdownListsById,
    getFieldNamesById: getFieldNamesById,
    getOutputFieldsById: getOutputFieldsById,
    saveCopysite: saveCopysite,
    postLog: postLog,
    getFieldById: getFieldById,
    refreshSite: refreshSite,
    getVersionsList: getVersionsList,
    setVersionToActive: setVersionToActive,
    publishSite: publishSite,
    validateCustomUrl: validateCustomUrl,
    validateSliderName: validateSliderName,
    getUserInfo: getUserInfo,
    getAnalyticsUrl: getAnalyticsUrl,
    saveApplication: saveApplication,
    getBorrowerAppData: getBorrowerAppData,
    updateApplicationData: updateApplicationData,
    viewDecision: viewDecision,
    getSiteInfo: getSiteInfo,
    validateStepName: validateStepName,
    getAllUser: getAllUser,
    createUser: createUser,
    resetPassword: resetPassword,
    deleteUser: deleteUser
}
