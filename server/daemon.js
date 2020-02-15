var Request = require("request");
var {config} = require("./Utilities/config");
//var https = require("https");
//var querystring = require("querystring");
var elapse = 30000; //30 seg
var elapse_min = 5000;  //5 seg
//var Soap = require("./Utilities/soap");
//Soap.getStatus();


let timerId = setTimeout(function tick() {
    console.log('tick');
    ejecutar().then((data)=>{
        let proyectos = JSON.parse(data);
        console.log('fin tick');
        if (proyectos.length > 0) {
            let ids = proyectos.map(item=>{
                return item._id;
            })
            console.log('ids:', ids);
            procesar(ids).then(()=>{
                timerId = setTimeout(tick, elapse_min); 
            })
        }
        else
            timerId = setTimeout(tick, elapse);
    }).catch(err=>{
        console.log(err.message);
    })
}, elapse);


let ejecutar = () => {
    return new Promise((resolve, reject) => {
        Request.post({
            "headers": { "content-type": "application/json" },
            "url": config.NODE_SERVER + "/proy/list",
            "body": JSON.stringify({
                "status": {$in: ["proc", "ver"]}
            })
          }, 
            (error, response, body) => {
            if (error)
                return reject(error);
            resolve(body);
        })
    });
}

let procesar = (ids) => {
    return new Promise((resolve, reject) => {
        let index = 0;
        procesa(index, ids).then(()=>{
            resolve();
        })
    })
}

let procesa = (index, ids) => {
    return new Promise((resolve, reject)=>{
        if (index >= ids.length)
            return resolve();
        else {
            let id = ids[index];
            console.log('Procesando ', id);
            Request.post({
                "headers": { "content-type": "application/json" },
                "url": config.NODE_SERVER + "/proy/procesa/" + id.toString()
            }, (error, response, body) => {
                console.log('response ', index, body);
                procesa(index+1, ids).then(()=>{
                    resolve();
                })
            })
        }
    })

}

/*
sunat.getToken( (err, data) => {
    if (err)
        console.log(err.message);
    else {
        console.log(data.access_token);
    }
});

*/