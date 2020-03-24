const express = require("express");
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const configDataBaseFile = require('../config/dataBase')


// router.get('/reg', (req, res) => {
//     res.send('This is a registration page');
// });

router.post('/reg', (req, res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        login: req.body.login,
        password: req.body.password
    });
    User.addUser(newUser, (err, user) => {
        if (err)
            res.json({success: false, msg: "User was not added"});
        else
            res.json({success: true, msg: "User was added"});

    });
});

router.post('/auth', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;
    User.getUserByLogin(login, (err, user) => {
        if (err) throw err;
        if (!user)
            return res.json({success: false, msg: "User whit this login was not found"});
        User.comparePass(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user.toJSON(), configDataBaseFile.secret, {
                    expiresIn: 3600*24
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        login: user.login,
                        email: user.email
                    }
                });
            } else {
                return res.json({success: false, msg: "Passwords are not equal"});
            }
        });
    });

});

router.get('/dashboard', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send('This is a user account page');
});

router.get('/contacts', (req, res) => {
    res.send('This is a contacts page');
});

module.exports = router;

// passport.authenticate('jwt', {session: false}),
