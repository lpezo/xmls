"use strict";

var Models = require("../Models/Proyecto");

const findById = id => {
    //let idobj = typeof(id) == 'string' ? mongoose.Types.ObjectId(id) : id;
    return Models.findById(id);
}

const getProyectos = criteria =>
  new Promise((resolve, reject) => {
    Models.find(criteria).sort({created:-1})
      .then(client => resolve(client))
      .catch(err => reject(err));
  });

const createProyecto = objToSave =>
  new Promise((resolve, reject) => {
    new Models(objToSave)
      .save()
      .then(client => resolve(client))
      .catch(err => {reject(err);
         console.log(err);
      });
  });

const updateProyecto = (criteria, dataToSet, options) =>
  new Promise((resolve, reject) => {
    options.lean = true;
    options.new = true;
    Models.findOneAndUpdate(criteria, dataToSet, options)
      .then(client => resolve(client))
      .catch(err => reject(err));
  });

  const findByIdAndUpdate = (id, dataToSet, options) => {
    return Models.findOneAndUpdate(id, dataToSet, options);
  };

const deleteProyecto = criteria =>
  new Promise((resolve, reject) => {
    Models.findOneAndRemove(criteria)
      .exec()
      .then(client => resolve(client))
      .catch(err => reject(err));
  });


module.exports = {
  updateProyecto,
  createProyecto,
  deleteProyecto,
  getProyectos,
  findById,
  findByIdAndUpdate
};