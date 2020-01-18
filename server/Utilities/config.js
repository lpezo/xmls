let environment = process.env.NODE_ENV || "dev";

let serverURLs = {
    "dev": {
        "NODE_SERVER": "http://localhost",
        "NODE_SERVER_PORT": "3000",
        "MONGO_DB": "mongodb://localhost:27017/angular-login-register"
    },
    "production": {
        "NODE_SERVER": process.env.HOST || "http://localhost",
        "NODE_SERVER_PORT": process.env.PORT || 3000,
        "MONGO_DB": process.env.MONGO_URI || "mongodb://xmls:ASCiraWyrtSm87Wc7jDOF1NUaoW1cyQ389dl8GFDoyuvowFbPrmbdN5YvwpnYquPhtdWA3OJSM2pYGdZjnLpOw==@xmls.documents.azure.com:10255/?ssl=true&replicaSet=globaldb"
    }
}

let config = {
    "DB_URL": {
        "url": `${serverURLs[environment].MONGO_DB}`
    },
    "NODE_SERVER_PORT": {
        "port": `${serverURLs[environment].NODE_SERVER_PORT}`
    },
    "NODE_SERVER_URL": {
        "url": `${serverURLs[environment].NODE_SERVER}`
    }
};

module.exports = {
    config: config
};
