"use strict";

var Models = require("../Models/Proyecto");

const findById = id => {
  new Promise((resolve, reject) => {
    //let idobj = typeof(id) == 'string' ? mongoose.Types.ObjectId(id) : id;
    Models.findById(id)
      .then(client => resolve(client))
      .catch(err => reject(err));
  });
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

  const findByIdAndUpdate = (id, dataToSet, options) =>
  new Promise((resolve, reject) => {
   //let idobj = typeof(id) == 'string' ? mongoose.Types.ObjectId(id) : id;
    Models.findOneAndUpdate(id, dataToSet, options)
      .then(client => resolve(client))
      .catch(err => reject(err));
  });

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