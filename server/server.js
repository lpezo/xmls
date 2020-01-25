/**
 * Module dependencies.
 */
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const cors = require('cors');
var User = require('./Models/User')

// var mongoose1 = require('mongoose');

const mongoose = require('./Utilities/mongooseConfig')();

const authRoute = require('./Routes/auth');
const proyectoRoute = require('./Routes/proyecto');
const config = require("./Utilities/config").config;

app.use(express.static(path.join(__dirname, '/dist/')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cors());

app.use((err, req, res, next) => {
  return res.send({
    "statusCode": 401,
    "statusMessage": "Something Went Wrong!"
  });
});

app.use('/auth', authRoute);
app.use('/proy', proyectoRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next();
});


// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname + '/dist/index.html'));
// });

/**
 * Start Express server.
 */
server.listen(config.NODE_SERVER_PORT.port, () => {
  console.log('app listening on port:' + config.NODE_SERVER_PORT.port);
});
