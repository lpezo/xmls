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

const getForSend = (idproy, cb) => {
    Models.find({proy: idproy}, {name:1, doc:1, status:1, message:1, success:1, data:1})
    .sort({"doc.tipodoc":1, "doc.num":1})
    .exec(cb);
}

const SetVerification = (id, verification) => {
  return new Promise((resolve, reject) => {
    let setdata = verification;
    setdata.status = "ver";
    Models.findByIdAndUpdate(id, setdata, (err, res )=>{
      if (err)
        return reject(err);
      resolve(res);
    })
  })
}

const SetError = (id, message) => {
  return new Promise((resolve, reject) => {
    let setdata = {status: 'error', message: message};
    Models.findByIdAndUpdate(id, setdata, (err, res )=>{
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

  const saveXml = (idproy, iduser, name, filename, doc, otro) => {
      return new Promise((resolve, reject) => {
        let user = typeof(iduser) == 'string' ? mongoose.Types.ObjectId(iduser) : iduser;
        let criteria = {
          proy: idproy,
          name: name
        };
        if (!doc.tipodoc){
          let aname = name.split('-');
          doc.tipodoc = aname.length > 1 ? aname[1] : '';
        }
        let toupd = Object.assign({user: user, doc: doc, filename: filename}, otro);
        if (!toupd.status)
          toupd.status = 'ok';

        Models.findOneAndUpdate(criteria, toupd, 
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
          resolve (result);
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
    SetVerification, SetError,
    getForSend
  };