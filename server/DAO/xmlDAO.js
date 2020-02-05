"use strict";

var Models = require("../Models/Proyecto");

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

  module.exports = {
    findById,
    findByIdAndUpdate,
    getXmls,
    createXml
  };