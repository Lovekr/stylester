var express = require("express");
var app = express();
var fileUpload = require('express-fileupload');
const port = process.env.PORT || 8000;
var products = require('./routes/products.js');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');



app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


var cors = require('cors');
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin' , 'http://localhost:4200');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.append('Access-Control-Allow-Credentials', true);
    next();
});

app.use(fileUpload());

mongoose.connect('mongodb://127.0.0.1:27017/db_stylesterdata', { useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true });




app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use('/', products);

app.listen(port, () => {
    console.log("Server listening on port " + port);

});