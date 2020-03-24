const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const configDataBaseFile = require('../config/dataBase');

const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByLogin = function (login, callback) {
    const qwery = {login: login};
    User.findOne(qwery, callback);
};

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};
module.exports.comparePass = function (passFromUser,userDBPass,callback) {
bcrypt.compare(passFromUser,userDBPass, (err,isMatch)=>{
    if (err) throw err;
    callback(null,isMatch);
});
};
