const express = require('express');
const passport = require('passport');
const DashboardData = require('../models/DashboardData');
const Cred = require('../models/Cred');

const router = express.Router();

router.get('/', (req, res) => {
    console.log(req.user);
    if (req.user !== undefined) {
        res.redirect('/dashboard');
    } else {
        var fl = req.query.fl;
        res.render('login', {
            fl
        });
    }
})

router.get('/dashboard', (req, res) => {
    console.log('/dashboard');
    // console.log(`req.session.items = ${req.session.items}`);
    if (req.isAuthenticated()) {
        const username = req.user.username;
        DashboardData.findOne({ username: username }, (err, data) => {
            if (err) {
                console.log(err);
                res.status(404).json({ msg: "Error loading user data" });
            }
            if (!data) {
                console.log("No such document exists");
                // In dashboard ejs, give the option to add the first item. A basic form
                // Create session variables to save the fact that user has no documents
                req.session.items = "0";
                // console.log(`req.session.items = ${req.session.items}`);
                res.render('dashboard', {
                    items: "0",
                    data: undefined,
                    username
                })
            } else {
                console.log("Document exists");
                req.session.items = "1";
                // console.log(`req.session.items = ${req.session.items}`);
                res.render('dashboard', {
                    items: "1",
                    data,
                    username
                });
            }
        });
    } else {
        res.redirect('/');
        console.log('Not authenticated');
    }
});

router.post('/login', (req, res, next) => {
    if (req.user !== undefined) {
        res.status(404).json({ msg: `User ${req.user.username} is already logged in` });
    } else {
        console.log('/login');
        passport.authenticate('local-login', {
            successRedirect: '/dashboard',
            failureRedirect: '/?fl=true',
        })(req, res, next);
    }
});

router.get('/register', (req, res) => {
    console.log("/register get");
    res.render('register', {
        msg: undefined
    });
});

router.post('/register', (req, res) => {
    console.log("/register post");
    // Expecting a username and password
    const { username, password } = req.body;
    // Check to see if username already exists
    Cred.findOne({ username: username }, (err, cred) => {
        if (err) {
            console.log(err);
            res.status(404).json({ msg: "Error in registration. Go back" });
        } else if (cred) {
            // Username already exists
            res.render('register', {
                msg: "Username is taken"
            });
        }
        else {
            const credential = new Cred({
                username,
                password
            });
            credential.save((err, cred) => {
                if (err) {
                    console.log(err);
                    res.render('register', {
                        msg: "There was an error in registering. Try again"
                    });
                } else {
                    console.log("Credential saved");
                    res.redirect('/');
                }
            });
        }
    });
});

module.exports = router;