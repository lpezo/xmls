var Request = require("request");
var elapse = 5000;
var Soap = require("./Utilities/soap");

Soap.getStatus();

/*

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
                timerId = setTimeout(tick, elapse); 
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
            "url": "http://localhost:3000/proy/list",
            "body": JSON.stringify({
                "status": "proc"
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
                "url": "http://localhost:3000/proy/procesa/" + id.toString()
            }, (error, response, body) => {
                procesa(index+1, ids).then(()=>{
                    resolve();
                })
            })
        }
    })

}
*/