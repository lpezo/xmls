var env = require('dotenv').config();
let environment = process.env.NODE_ENV || "dev";
const he = require('he');

let serverURLs = {
    "dev": {
        "NODE_SERVER": "http://localhost",
        "NODE_SERVER_PORT": "3000",
        "MONGO_DB": "mongodb://localhost:27017/angular-login-register",
        "MONGO_USER": null,
        "MONGO_PWD": null
    },
    "production": {
        "NODE_SERVER": process.env.HOST || "http://localhost",
        "NODE_SERVER_PORT": process.env.PORT || 3000,
        "MONGO_DB": "mongodb://"+process.env.COSMOSDB_HOST+":"+process.env.COSMOSDB_PORT+"/"+process.env.COSMOSDB_DBNAME+"?ssl=true&replicaSet=globaldb",
        "MONGO_USER": process.env.COSMODDB_USER,
        "MONGO_PWD": process.env.COSMOSDB_PASSWORD        
    }
}
        //"mongodb://xmls:ASCiraWyrtSm87Wc7jDOF1NUaoW1cyQ389dl8GFDoyuvowFbPrmbdN5YvwpnYquPhtdWA3OJSM2pYGdZjnLpOw==@xmls.documents.azure.com:10255/?ssl=true&replicaSet=globaldb"

let config = {
    "DB_URL": {
        "url": `${serverURLs[environment].MONGO_DB}`,
        "user": `${serverURLs[environment].MONGO_USER}`,
        "pwd": `${serverURLs[environment].MONGO_PWD}`
    },
    "NODE_SERVER_PORT": {
        "port": `${serverURLs[environment].NODE_SERVER_PORT}`
    },
    "NODE_SERVER_URL": {
        "url": `${serverURLs[environment].NODE_SERVER}`
    }
};

var optxml = {
    attributeNamePrefix : "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName : "#text",
    ignoreAttributes : false,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false, //"strict"
    attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
    tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
    stopNodes: ["ext:UBLExtensions"]
};

module.exports = {
    config: config,
    optxml: optxml
};
