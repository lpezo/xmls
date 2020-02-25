var Request = require("request");
var {config} = require("./Utilities/config");
//var https = require("https");
//var querystring = require("querystring");
var elapse = config.WAITDAEMON; //30 seg
var elapse_min = 5000;  //2 seg
//var Soap = require("./Utilities/soap");
//Soap.getStatus();
let initloop = () => {
    setTimeout(function tick() {
        runtick();
    }, elapse);
}

let serviciotick = (req, res) => {
    console.log('tick');
    ejecutar().then((data)=>{
        let proyectos = JSON.parse(data);
        if (proyectos.length > 0) {
            //marcar aqui en proceso
            let ids = proyectos.map(item=>{
                return item._id;
            })
            console.log('ids:', ids);
            procesar(ids).then(()=>{
                //marcar aqui fin de proceso
                marcarfin().then( () => {
                    timerId = setTimeout(runtick, elapse_min); 
                }).catch(err=>{
                    timerId = setTimeout(runtick, elapse); 
                })
            })
        }
        else
            res.status(200).json("fin tick");
    }).catch(err=>{
        res.status(403).json({message:"Something went wrong",error:err.message});
    }); 
}

let runtick = () => {
    console.log('tick');
    ejecutar().then((data)=>{
        console.log('ejecutar() data:', data);
        let proyectos = JSON.parse(data);
        if (proyectos.length > 0) {
            //marcar aqui en proceso
            let ids = proyectos.map(item=>{
                return item._id;
            })
            console.log('ids:', ids);
            procesar(ids).then(()=>{
                //marcar aqui fin de proceso
                //marcarfin().then( () => {
                    timerId = setTimeout(runtick, elapse_min); 
                //}).catch(err=>{
                //    timerId = setTimeout(runtick, elapse); 
                //})
            }).catch(err=>{
                //marcarfin().then(()=>{
                    timerId = setTimeout(runtick, elapse); 
                //});
            })
        }
        else
            timerId = setTimeout(runtick, elapse);
    }).catch(err=>{
        console.log(err.message);
    });
}

let marcarfin = () => {
    return new Promise((resolve, reject) => {
        Request.put({
            "headers": { "content-type": "application/json" },
            "url": config.NODE_SERVER + "/proy/marcarfin"
          }, 
            (error, response) => {
            if (error)
                return reject(error);
            resolve(response);
        })
    });
}

let ejecutar = () => {
    return new Promise((resolve, reject) => {
        Request.post({
            "headers": { "content-type": "application/json" },
            "url": config.NODE_SERVER + "/proy/listtoprocess"
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

initloop();

/*
module.exports = {
    initloop,
    serviciotick,
    runtick
};
*/