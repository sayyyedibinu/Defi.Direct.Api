import axios from 'axios';
import config from "../../resources/config.json";

let fromLocal = () => {
    return require(`json-loader!../../resources/default.json`)
}
let fromAPI = (_id,flgversion,isActive, queryString, callback) =>{
    if(queryString === "WorkingCopy"){
        try{
            let _previewDataDetails = localStorage.getItem('_previewDataDetails');
            _previewDataDetails = JSON.parse(_previewDataDetails);
            let _siteData = "";
            for(let i = 0; i < _previewDataDetails.length; i++){
                _siteData += localStorage.getItem('_previewData'+_previewDataDetails[i]);
            }
            _siteData = JSON.parse(_siteData);
            /*console.log(_siteData);*/
            callback(null, _siteData);
            return;
        }catch(e){
            console.warn(e);
        }
    }
    
    if(Object.prototype.toString.call(callback) !== '[object Function]') callback = () =>{};
    
    if(!_id || _id === 'local'){
        callback(null, require(`json-loader!../../resources/sampleApplication_new.json`));
        return;
    }
    document.dispatchEvent(new CustomEvent("showAppLoader"));
    if (flgversion)
    {
        axios.get(config.API_BASE_URL+'Sites/siteversion/'+_id+'/active/'+isActive).then( (response) => {
            callback(null, response.data);
        }, (error) => {
            callback(error);
        }).finally(()=>document.dispatchEvent(new CustomEvent("hideAppLoader")));
    }
    else{
    axios.get(config.API_BASE_URL+'Sites/'+_id).then( (response) => {
        callback(null, response.data.site);
    }, (error) => {
        callback(error);
    }).finally(()=>document.dispatchEvent(new CustomEvent("hideAppLoader")));
   }
}

export default {
    fromLocal: fromLocal,
    fromAPI: fromAPI
}
/*export default function fetchClientApplication() {
    // Replace if running against live web service:
    //const request = axios.post(`${ROOT_URL}${PAGES}${id}`);
    const request = require(`json-loader!../../resources/sampleApplication_new.json`);
    return request;
    
}*/