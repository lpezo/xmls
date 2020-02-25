"use strict";

var Models = require("../Models/system");

const isInUse = () => {
    return new Promise( (resolve, reject) => {
        Models.findOne({id:1}, (err, res)=>{
            if (err)
                return reject(err);
            if (res)
                resolve(res.tick);
            else
                resolve(false);
        });
    });
};

const setInit = (tick) => {
    return new Promise( (resolve, reject) => {
        Models.updateOne({id:parseInt(1)}, {tick:tick, time: Date.now() }, {upsert:1}, (err, res)=>{
            if (err)
                return reject(err);
            resolve(res);
        });
    });
}

module.exports = {
    setInit, isInUse
};