const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const configDataBaseFile = require('./config/dataBase')
const accountUrlsFile = require('./routes/account')

const app = express();

const port = process.env.PORT || 8080;

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(bodyParser.json());

app.use('/account',accountUrlsFile);

mongoose.connect(configDataBaseFile.db,  { useUnifiedTopology: true,useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    console.log("we successfully connected to the database")
});

mongoose.connection.on('error', (err) => {
    console.log("we did not connect to the database. Error - "+err);
});


app.listen(port, () => {
    console.log("Server was started on port " + port);
});

app.get('/', (req, res) => {
    res.send('This is a main page!!!');
});

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'))
})
