var express = require("express");
var app = express();
var fileUpload = require('express-fileupload');

const port = process.env.PORT || 8000;
var products = require('./routes/products.js');
var stylepick = require('./routes/stylepick.js');
var hotdeal = require('./routes/hotdeal.js');
var user = require('./routes/user.js');
var blogger = require('./routes/blogger.js');
var auth = require('./routes/auth.js');

var passport = require('passport');
var session = require('express-session');

var bodyParser = require('body-parser')
var mongoose = require('mongoose');

var cors = require('cors');



app.use(session({
  secret: 's3cr3t',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());


//app.use(fileUpload());

mongoose.connect('mongodb://127.0.0.1:27017/dbstylester', { useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true });

app.use(express.static('stylster_frontend_design'));


app.use('/', products);
app.use('/', stylepick);
app.use('/', hotdeal);
app.use('/', user);
app.use('/auth', auth);
app.use('/',blogger);

app.listen(port, () => {
    console.log("Server listening on port " + port);

});

