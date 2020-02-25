const optxml = require("../Utilities/config").optxml;
const getDoc = require("../Utilities/xmlConfig").getDoc;
const ProyectoDAO = require('../DAO/proyectoDAO');
const XmlDao = require('../DAO/xmlDAO');
const systemDao = require('../DAO/systemDAO');
const Sunat = require('../Utilities/sunat');

const fs = require('fs');
const path = require('path');

const parser = require('fast-xml-parser');
const xlsx = require('node-xlsx');
const zip = require('express-zip');

const mail = require('../Utilities/mail');
//const daemon = require('../daemon');

let get = async(req, res) => {
  let id = req.params.id;
  try {
    let data = await ProyectoDAO.findById(id);
    if (data)
      res.status(200).json(data);
    else
      res.status(401).json({message:'id no existe!'});
  }
  catch (error) {
    res.status(403).json({message:"Something went wrong",error:error.message});
  }
  
}

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
      res.status(403).json({message:"Something went wrong",error:error.message});
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
      res.status(403).json({message:"Something went wrong",error:error.message});
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
      res.status(403).json({message:"Something went wrong",error:error.message});
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
    res.status(403).json({message:"Something went wrong",error:error.message});
  }
}

let listtoprocess = async (req, res) => {
  try {

    /*let estaenuso = await systemDao.isInUse();
    if (estaenuso == true)
      return res.status(200).json([]);
      */
    let criteria = {status: {$in: ["proc", "ver"]}};
    const result = await ProyectoDAO.getProyectos(criteria);
    //if (result.length > 0)
    //  await systemDao.setInit(true);
    if (result) {
      res.status(200).json(result);
    } else {
        res.status(401).json({message:"Something went wrong"})
    }
  } catch (error) {
    res.status(403).json({message:"Something went wrong",error:error.message});
  }
}

let marcarfin = (req, res) => {
  try {
    systemDao.setInit(false).then(()=>{
      res.status(200).json({message:"ok"});
    }).catch(err=>{
      res.status(403).json({message:"Something went wrong",error:err.message});
    })
  } catch (error) {
    res.status(403).json({message:"Something went wrong",error:error.message});
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
    let cant = await CountFiles(criteria);
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

const setok = async(req, res) => {
  let id = req.params.id;
  try {
    let data = await ProyectoDAO.findByIdAndUpdate(id, {status:'ok'});
    res.status(200).json(data);
  }
  catch (error) {
    res.status(403).json({error:error.message});
  }
}

const setproc = async(req, res) => {
  let id = req.params.id;
  try {
    await XmlDao.deleteFor({proy:id});
    let data = await ProyectoDAO.findByIdAndUpdate(id, {status:'proc', excel:'', total:0});
    //daemon.runtick();
    res.status(200).json(data);
  }
  catch (error) {
    res.status(403).json({error:error.message});
  }
}

const deleteAll = (req, res) => {
  let id = req.params.id;
  XmlDao.deleteFor({proy: id}).then(data=>{
    res.status(200).json(data);
  }).catch(err=>{
    res.status(403).json({error:error.message});
  })
  
}

const downloadExcel = (req, res) => {
  let id = req.params.id;
  try {
    ProyectoDAO.findById(id).then(data=>{
      if (data.excel){
        let dir = path.join("xmls", id);
        let filename = path.join(dir, data.excel);
        //res.download(filename);
        res.zip([
          {path: filename, name: data.excel}
        ])
      }
      else
        res.status(403).json({error:"campo excel vacio"});
    })
  }
  catch (error) {
    res.status(403).json({error:error.message});
  }
}

const getPath = (proyecto) => {
  let dir = './xmls';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  dir = path.join(dir,  proyecto._id.toString());
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return dir;
}

const ensureDirBak = (proyecto) => {
  let dir = getPath(proyecto);
  let dirbak = path.join(dir, "bak");
  if (!fs.existsSync(dirbak))
    fs.mkdirSync(dirbak);
  return dirbak;
}

const mueve = (dir, dirbak, file) => {
  let rutafile = path.join(dir, file);
  let rutafilebak = path.join(dirbak, file);
  if (fs.existsSync(rutafilebak))
    fs.unlinkSync(rutafile);
  fs.renameSync(rutafile, rutafilebak);
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
    ObtieneXmls(proyecto, true)
    .then(data=>resolve(data.files.length))
    .catch(err=>reject(err));
  })
}

const ObtieneXmls = (proyecto, todo) => {
  return new Promise((resolve, reject) => {
    let dir = getPath(proyecto);
    fs.readdir(dir, function(err, files) {
      if (err)
        return reject(err);
      var files = files.filter(function(file){
        return path.extname(file).toLowerCase() === '.xml';
      });
      if (!todo && files.length > 20){
        let filesminus = [];
        for (let i = 0; i < 20; i++)
          filesminus.push(files[i]);
        resolve({dir, filesminus});
      }
      else
        resolve({dir, files});
    })
  })
}

const extraeDeXml = (dir, file) => {
  return new Promise((resolve, reject)=>{
    let ruta = path.join(dir, file);
    fs.readFile(ruta, "ascii", function (err, data) {
      if (err)
          return reject(err);
      try{
        var jsonObj = parser.parse(data,optxml, true);
        resolve(jsonObj);
      }catch(error){
        reject(error);
      }
    })
  })
}


const procesar = async(id) => {
  //let proy = await getProyectos(criteria);
  let proy = await ProyectoDAO.findById(id);
  if (proy){
    if (proy.status == 'proc'){
      //proy = await ProyectoDAO.findByIdAndUpdate(id, {status:'proc'}, {new:true});
        let dirbak = ensureDirBak(proy);
        let data = await ObtieneXmls(proy);
        let doc = {};
        for (let file of data.files){
          console.log('file:', file);
          let dataxml = await extraeDeXml(data.dir, file);
          //fs.writeFileSync(path.join(data.dir, file + ".json"), JSON.stringify(dataxml));
          doc = getDoc(dataxml);
          let name = path.parse(file).name;
          try {
            if (doc.num)
              await XmlDao.saveXml(proy._id, proy.user, name, doc, {});
            else
              await XmlDao.saveXml(proy._id, proy.user, name, doc, {status:error, message:'Error en leer xml'});
            mueve(data.dir, dirbak, file);
          }
          catch (error) {
            console.log(error.message);
          }
          
        }
        if (data.files.length == 0)
          proy = await ProyectoDAO.findByIdAndUpdate(id, {status:'ver'}, {new:true});
        return data.files;
    }
    else if (proy.status == 'ver') {
      try {
        let listaver = await XmlDao.getForVerification(id);
        let ares = [];
        if (listaver){
          
          let otoken = await Sunat.getToken();
          let token = otoken.access_token;

          for (let cadaxml of listaver){
            try{
              console.log('verificando ', cadaxml.proy, cadaxml.name);
              //let cod = cadaxml.name.split('-')[1];
              let anum = cadaxml.doc.num.split('-');
              let afecha = cadaxml.doc.fecha.split('-');
              let docum = {
                numRuc: cadaxml.doc.doc,
                codComp: cadaxml.doc.tipodoc,
                numeroSerie: anum[0],
                numero: anum[1],
                fechaEmision: afecha[2] + "/" + afecha[1] + "/" + afecha[0],
                monto: cadaxml.doc.total
              };
              let res = await Sunat.getResponse(docum, token);
              await XmlDao.SetVerification(cadaxml._id, res);
              ares.push(res);
            } catch (error){
              await XmlDao.SetError(cadaxml._id, error.message);
            }
          }
          if (listaver.length == 0){
            let fileexcel = await GeneraExcel(proy);
            
            console.log('Excel generado: ', fileexcel);
            proy = await ProyectoDAO.findByIdAndUpdate(id, {status:'fin', excel: fileexcel.name});

            let info = await mail.sendAvisoFin(proy);
            console.log('[Mail]', info);
            return proy;
          }
        }
        return ares;
      } catch(err) {
        console.log('Error getForVerification: ', err.message);

      }

    }
    else
     throw new Error('Proyecto no esta en Proceso');
  }
  else
   throw new Error("Proyecto no encotrado")
 }

const GeneraExcel = async(proy) => {
  return new Promise( (resolve, reject) => {
    try {
      XmlDao.getForSend(proy._id, (err, lista) => {

        if (err)
          return reject(err);

        let dataxls = [
          ["tipodoc", "numero", "doc", "razon", "moneda", "total", "success", "message", "estadoCP", "estadoRuc", "condDomiRuc", "obs1", "obs2"]
        ];

        for (let item of lista){
          let desc = getDataDesc(item);

          dataxls.push( [item.doc.tipodoc, item.doc.num, item.doc.doc, item.doc.razon, item.doc.moneda, item.doc.total, 
            item.success, item.message, desc.cp, desc.ruc, desc.domiruc, desc.obs1, desc.obs2] );
        }

        const buffer = xlsx.build([{name:"mensajes", data: dataxls}]);

        let dir = path.join("xmls", proy._id.toString());
        let name = "respuesta.xlsx";
        let filename = path.join(dir, name);
        console.log('grabando excel en ', filename);

        fs.writeFile (filename, buffer, (err) => {
          if (err)
            return reject(err);
          resolve({filename,name});
        })
      })

    } catch(err) {
      reject(err);
    }
  })
}

const getDataDesc = (item) => {
  let desc = {cp: "", ruc: "",  domiruc: "", obs1: "", obs2: ""};
  if (item.data){
    if (item.data.observaciones){
      if (item.data.observaciones.length > 0){
        desc.obs1 = item.data.observaciones[0];
        if (item.data.observaciones.length > 1)
          desc.obs2 = item.data.observaciones[1];
      }
    }

    switch (item.data.estadoCp) {
      case "0":
        desc.cp = "NO EXISTE";
        break;
      case "1":
        desc.cp = "ACEPTADO";
        break;
      case "2":
        desc.cp = "ANULADO ";
        break;
      case "3":
        desc.cp = "AUTORIZADO";
        break;
      case "4":
        desc.cp = "NO AUTORIZADO";
        break;
    }

    switch (item.data.estadoRuc) {
      case "00":
        desc.ruc = "ACTIVO";
        break;
      case "01":
        desc.ruc = "ACTIVO";
        break;
      case "02":
        desc.ruc = "ACTIVO";
        break;
      case "03":
        desc.ruc = "ACTIVO";
        break;
      case "10":
        desc.ruc = "ACTIVO";
        break;
      case "11":
        desc.ruc = "ACTIVO";
        break;
      case "22":
        desc.ruc = "ACTIVO";
        break;
      }

      switch (item.data.condDomiRuc) {
        case "00":
          desc.domiruc = "HABIDO";
          break;
        case "09":
          desc.domiruc = "PENDIENTE";
          break;
        case "11":
          desc.domiruc = "POR VERIFICAR";
          break;
        case "12":
          desc.domiruc = "NO HABIDO";
          break;
        case "20":
          desc.domiruc = "NO HALLADO";
          break;
      }

  }
  return desc;
}

module.exports = {
  get, add, upd, del, list,
  receive, refresh, proc, 
  setok, setproc,
  deleteAll, downloadExcel,
  listtoprocess, marcarfin
};