var Request = require("request");

var elapse = 2000;
let timerId = setTimeout(function tick() {
    console.log('tick');
  
    exec().then(data=>{
        timerId = setTimeout(tick, elapse);
    })

}, elapse);


const exec = () => {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve();
        }, 5000);
    })
}