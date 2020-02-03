// const async = require("async");
const config = require("../Utilities/config").config;
const ProyectoDAO = require('../DAO/proyectoDAO');
const fs = require('fs');
const path = require('path');

/* API to register new proyecto */
let add = async (req, res) => {
  if (!req.body.name || !req.body.user) {
    res.status(401).json({message:'Falta el nombre'})
  } else {
    try {
      let criteria = {
        user: req.body.user,
        name: req.body.name,
      } 
      const check = await ProyectoDAO.getProyectos(criteria);
      if (check && check.length==1) {
        res.status(401).json({message:'nombre ya existe!'})
      } else {
        let proyectoData = {
          id: req.body.id ? req.body.id : 0,
          user: req.body.user,
          name: req.body.name ? req.body.name : "-",
          status: req.body.status ? req.body.status : "ok"
        };
        const addProyecto = await ProyectoDAO.createProyecto(proyectoData);
        // console
        if (addProyecto) {
          res.status(200).json(addProyecto)
        } else {
          res.status(403).json({message:"Something went wrong"});
        }
      }
    } catch (error) {
      res.status(403).json({message:"Something went wrong",error:error});
    }
  }
};

/* API to update proyecto */
let upd = async (req, res) => {
  if (!req.body.name) {
    res.status(401).json({message:'Falta el nombre'})
  } else {
    try {
      let criteria = {
        _id: req.body._id
      } 
      const check = await ProyectoDAO.getProyectos(criteria);
      if (check && check.length==0) {
        res.status(401).json({message:'id no existe!'})
      } else {
        let proyectoData = {
          name: req.body.name ? req.body.name : "-",
        };
        const updProyecto = await ProyectoDAO.updateProyecto(criteria, proyectoData, {});
        // console
        if (updProyecto) {
          res.status(200).json({message:'Proyecto registered successfully!'})
        } else {
          res.status(403).json({message:"Something went wrong"});
        }
      }
    } catch (error) {
      res.status(403).json({message:"Something went wrong",error:error});
    }
  }
};

/* API to delete proyecto */
let del = async (req, res) => {
  if (!req.params.id) {
    res.status(401).json({message:'Falta id'})
  } else {
    try {
      let criteria = {
        _id: req.params.id
      } 
      const check = await ProyectoDAO.deleteProyecto(criteria);
      if (!check) {
        res.status(401).json({message:'id no existe!'})
      } else {
          res.status(200).json({message:'Proyecto deleted successfully!'})
      }
    } catch (error) {
      res.status(403).json({message:"Something went wrong",error:error});
    }
  }
};

/* API to list proyecto */
let list = async (req, res) => {
  try {
    let criteria = req.body ? req.body : {};
    const result = await ProyectoDAO.getProyectos(criteria);
    if (result) {
      res.status(200).json(result);
    } else {
        res.status(401).json({message:"Something went wrong"})
    }
  } catch (error) {
    res.status(403).json({message:"Something went wrong",error:error});
  }
}

let receive = async (req, res) => {
  try {
    SaveFile(req.body).then(data=>{
      res.status(200).json({message: "ok"});
    }).catch(error=>{
      res.status(401).json(error);
    })
  } catch (error) {
    res.status(403).json({message: "Error en send file", error:error});
  }
}

let refresh = async (req, res) => {
  if (!req.params.id)
    return res.status(401).json({message:'Falta id'});
  try {
    console.log('refresh: ', req.params.id);
    let criteria = {_id: req.params.id};
    let cant = await CountFiles(criteria).catch(error=>{
      //return res.status(401).json(error);
      console.log(error);
      return;
    });
    const updProyecto = await ProyectoDAO.updateProyecto(criteria, {total:cant}, {});
    // console
    if (updProyecto) {
      res.status(200).json(updProyecto);
    } else {
      res.status(403).json({message:"Something went wrong"});
    }


  } catch (error) {
    res.status(403).json({message: "Error en refresh file"});
  }
}

const proc = (req, res) => {
  let id = req.params.id;
  procesar(id).then(data=>{
    res.status(200).json(data);
  }).catch(error=>{
    res.status(403).json({error:error.message});
  })
}

const getPath = (proyecto) => {
  let dir = './xmls';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  dir = path.join(dir,  proyecto._id);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return dir;
}

const SaveFile = (data) => {
  return new Promise((resolve, reject) => {
    console.log('creando ', data.avatar.filename);

    let file = path.join(getPath(data.proyecto), data.avatar.filename);
    let buff = new Buffer.from(data.avatar.value, 'base64');
    fs.writeFile(file, buff, function(err){
      if (err)
        return reject(err);
      resolve();
    });
  })
}

const CountFiles = (proyecto) => {
  return new Promise((resolve, reject) => {
    let dir = getPath(proyecto);
    fs.readdir(dir, function(err, files) {
      if (err)
        return reject(err);
      resolve(files.length);
    })
  })
}

const procesar = async(id) => {
  //let proy = await getProyectos(criteria);
  let proy = await ProyectoDAO.findById(id);
  if (proy){
    if (proy.status != 'proc'){
      proy = ProyectoDAO.findByIdAndUpdate(id, {status:'proc'}, {new:true}).catch(err=>{
     //proy = updateProyecto(criteria, {status:'proc'}, {}).catch(err=>{
       throw err;
     });
     return  proy;
    }
    else
     throw new Error('Proyecto esta en Proceso');
  }
  else
   throw new Error("Proyecto no encotrado")
 }

module.exports = {
  add: add,
  upd: upd,
  del: del,
  list: list,
  receive: receive,
  refresh: refresh,
  proc: proc
};