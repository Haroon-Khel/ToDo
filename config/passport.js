const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Cred = require('../models/Cred');

module.exports = function (passport) {

    passport.use('local-login', 
        new LocalStrategy((username, password, done) => {
            // Find User
            Cred.findOne({ username: username }, (err, cred) => {
                if (err) {
                    console.log(err)
                    return done(err);
                }
                if (!cred) {
                    console.log("Username not registered");
                    return done(null, false);
                }
                if (!(cred.password === password)) {
                    console.log("Incorrect password");
                    return done(null, false);
                }
                console.log("Correct username and password");
                return done(null, cred);
            });
        }
        )
    );

    passport.serializeUser((user, done) => {
        console.log(user.id);
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        Cred.findById(id, (err, user) => {
            console.log(user.id);
            done(err, user);
        });
    });

}