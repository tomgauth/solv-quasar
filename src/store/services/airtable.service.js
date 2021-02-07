import axios from 'axios';


//for now token later usage of api proxy
var token = "keyKRBU0MXfsukETM";
var baseKey = "app3qY4PvmhbRYcfj";

var airtable = axios.create({
    baseURL:`https://api.airtable.com/v0/${baseKey}/`,
    headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
    }
});

airtable.interceptors.response.use(res => res.data);


//// Wrapper Methods
function getRecordsList(tableName,airOptions){    
    return airtable.get(`${tableName}`,{
        params:{...airOptions}
    });
};


// Key Phrases Table

function getKeyPhrasesList(airParams){
    return getRecordsList("Key Phrases",airParams);
}

//Levels Table

function getLevelsList(airParams){
    return getRecordsList("Levels",airParams);
}

export default {
    getKeyPhrasesList,
    getLevelsList
}

