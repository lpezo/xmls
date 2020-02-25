var request = require("request");

var list_chars = ["f", "b", "e"];

const getTokenTest = () => {
    return new Promise( (resolve, reject ) => {
        setTimeout( ()=>{
            resolve({access_token:'test'});
        }, 10);
    })
};

const getToken = () => {
    return new Promise( (resolve, reject ) => {
        let url = "https://api-seguridad.sunat.gob.pe/v1/clientesextranet/1491ed63-edcd-451c-98bf-08a12b257de6/oauth2/token/";
        let client_id = "1491ed63-edcd-451c-98bf-08a12b257de6";
        let client_secret = "5h/oVvGdIj4I/6C2/d7XOA==";
        let form = {
            grant_type: "client_credentials",
            scope: "https://api.sunat.gob.pe/v1/contribuyente/contribuyentes",
            client_id: client_id,
            client_secret : client_secret
        };
        let options = {
            url: url,
            form: form
        };
        request.post(options, (err, res, body) => {
            if (err)
                return reject(err);
            //cb(null,JSON.parse(''+ body));
            resolve(JSON.parse(''+ body));
        });
    })
};

const getResponse = (cmp, token) => {
    return new Promise( (resolve, reject) => {

        if (token == "test"){
            let datatest = {
                "estadoCp" : "1",
                "estadoRuc" : "00",
                "condDomiRuc" : "00",
                "observaciones" : [ 
                    "- El comprobante de pago consultado ha sido emitido a otro contribuyente."
                ]
            };
            //setTimeout(() => {
                resolve({data: datatest});
            //}, 3000);
            return;
        }
        let url = "https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/" + cmp.numRuc + "/validarcomprobante";

        //Establecer los parametros que se van a consultar
        var form = {
            "numRuc": cmp.numRuc.toString(),
            "codComp": cmp.codComp,
            "numeroSerie": cmp.numeroSerie,
            "numero": cmp.numero,
            "fechaEmision": cmp.fechaEmision
        }
        if (list_chars.indexOf(cmp.numeroSerie.substring(0,1).toLowerCase()) >= 0){
            form.monto = cmp.monto.toString();
        };
    
        console.log(form);

        header = {
            "cache-control": "no-cache",
            "Connection": "keep-alive",
            "accept-encoding": "gzip, deflate",
            "Host": "api.sunat.gob.pe",
            "authorization": "Bearer " + token,
            "content-type": "application/json"
        };
    
        let options = {
            url: url,
            body: form,
            json: true,
            headers: header
        };
    
        request.post(options, (err, res, body) => {
            if (err)
                return reject(err);
            //cb(null,JSON.parse(''+ body));
            resolve(body);
        });
    
    })

};

module.exports = {
    getToken,
    getResponse,
    getTokenTest
}