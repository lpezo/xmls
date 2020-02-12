"use strict";

var Models = require("../Models/Xml");
var mongoose = require('mongoose');

const findById = id => {
    return Models.findById(id);
}

const findByIdAndUpdate = (id, dataToSet, options) => {
    return Models.findOneAndUpdate(id, dataToSet, options);
};
/*
const getXmls = criteria =>
  new Promise((resolve, reject) => {
    Models.find(criteria).sort({created:-1})
      .then(client => resolve(client))
      .catch(err => reject(err));
  });
*/
const getForVerification = idproy => {
  return new Promise((resolve, reject) => {
    Models.find({proy: idproy, status: "ok"}).limit(20).exec((err, res)=>{
      if (err)
        return reject(err);
      resolve(res);
    })
  })
}

const SetVerification = (id, verification) => {
  return new Promise((resolve, reject) => {
    let setdata = verification;
    setdata.status = "ver";
    Models.findOneAndUpdate(id, setdata, (err, res )=>{
      if (err)
        return reject(err);
      resolve(res);
    })
  })
}

const createXml = objToSave =>
  new Promise((resolve, reject) => {
    new Models(objToSave)
      .save()
      .then(client => resolve(client))
      .catch(err => {reject(err);
         console.log(err);
      });
  });

  const saveXml = (idproy, iduser, name, doc) => {
      return new Promise((resolve, reject) => {
        let user = typeof(iduser) == 'string' ? mongoose.Types.ObjectId(iduser) : iduser;
        let criteria = {
          proy: idproy,
          name: name
        };
        Models.findOneAndUpdate(criteria, {user: user, doc: doc}, 
          {new:true, upsert: true, setDefaultsOnInsert: true}, function(err, data, res) {
          if (err)
            return reject(err);
          resolve(data);
        })
      })
  };

  const deleteFor = (criteria) => {
    return new Promise((resolve, reject) => {
      Models.deleteMany(criteria, (err, result)=> {
        if (err)
          return reject(err);
          resolve (res);
      })
    })
  }

  module.exports = {
    findById,
    findByIdAndUpdate,
    createXml,
    saveXml,
    deleteFor,
    getForVerification,
    SetVerification
  };