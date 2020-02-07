"use strict";

var Models = require("../Models/Xml");
var mongoose = require('mongoose');

const findById = id => {
    return Models.findById(id);
}

const findByIdAndUpdate = (id, dataToSet, options) => {
    return Models.findOneAndUpdate(id, dataToSet, options);
};

const getXmls = criteria =>
  new Promise((resolve, reject) => {
    Models.find(criteria).sort({created:-1})
      .then(client => resolve(client))
      .catch(err => reject(err));
  });

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
        let criteria = {
          user: typeof(iduser) == 'string' ? mongoose.Types.ObjectId(iduser) : iduser,
          proy: idproy
        };
        Models.findOneAndUpdate(criteria, {name: name, doc: doc}, {new:true, upsert: true}, (err, res)=>{
          if (err)
            return reject(err);
          //return reject(new Error(name));
          resolve(res);
        })
      })
  };

  const deleteProy = (idproy) => {
    return new Promise((resolve, reject) => {
      Models.remove({proy: idproy}, (err, result)=>{
        if (err)
          return reject(err);
        resolve(result);
      })
    })
  }

  module.exports = {
    findById,
    findByIdAndUpdate,
    getXmls,
    createXml,
    saveXml,
    deleteProy
  };