const express = require('express');
const fs = require('fs');
const passport = require('passport');

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
        let data = JSON.parse(fs.readFileSync(`./items/${username}.json`));
        res.render('dashboard', {
            data,
            username
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
            failureRedirect: '/',
        })(req, res, next);
    }
});

module.exports = router;