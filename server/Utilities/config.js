let environment = process.env.NODE_ENV || "dev";

let serverURLs = {
    "dev": {
        "NODE_SERVER": "http://localhost",
        "NODE_SERVER_PORT": "3000",
        "MONGO_DB": "mongodb://localhost:27017/angular-login-register"
    },
    "production": {
        "NODE_SERVER": "http://localhost",
        "NODE_SERVER_PORT": process.env.NODE_PORT,
        "MONGO_DB": process.env.CUSTOMCONNSTR_MONGO_DB || "mongodb://localhost:27017/angular-login-register"

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
