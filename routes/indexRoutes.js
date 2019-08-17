const express = require('express');
const passport = require('passport');
const DashboardData = require('../models/DashboardData');

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
    if (req.isAuthenticated()) {
        const username = req.user.username;
        DashboardData.findOne({ username: username }, (err, data) => {
            if (err) {
                console.log(err);
            }
            if (!data) {
                console.log("No such document exists");
                res.render('dashboard', {
                    data: undefined,
                    username
                })
            } else {
                console.log("Document exists");
                res.render('dashboard', {
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

module.exports = router;