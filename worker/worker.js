const { workerData, parentPort } = require('worker_threads')

// You can do any heavy stuff here, in a synchronous way
// without blocking the "main thread"

var suma = parseInt(0);
for (var i = parseInt(1); i < 100000; i++){
    for (var j = 1; j < 100000; j++) {}
    if (i % 10 == 0){
        suma++;
    }
}


console.log('Going to write tons of content on file '+workerData);
parentPort.postMessage({ fileName: workerData, status: 'Done', suma: suma })