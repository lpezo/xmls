const getDoc = require("../Utilities/xmlConfig").getDoc;
const parser = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');

let dir = ".";
let file = "XML_UBL_INVOICE_2_885.XML";

extraeDeXml(dir, file).then(dataxml=>{
   fs.writeFileSync(path.join(dir, file + ".json"), JSON.stringify(dataxml));
});

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