const express = require('express');
const DashboardData = require('../models/DashboardData');

const router = express.Router();

router.get('/logout', (req, res) => {
    console.log(`${req.user.username} has logged out`);
    console.log(`req.session.items = ${req.session.items}`);
    req.session.destroy((err) => {
        req.logout();
        res.redirect('/');
    })
});

router.post('/itemsave', (req, res) => {
    const username = req.user.username;
    const todoItem = {
        title: req.body.title,
        body: req.body.body
    };
    if (req.session.items === "1") {
        DashboardData.findOneAndUpdate({ username: username }, { $push: { todo: todoItem } }, (err, item) => {
            if (err) {
                console.log(err)
                res.json({ msg: "Error in updating todo document" });
            } else {
                console.log("todo item updated sucessfully");
                res.redirect('/dashboard');
            }
        });
    } else {
        // Create first item in todo collection
        const firstItem = new DashboardData({
            username,
            todo: [todoItem]
        });
        firstItem.save((err, item) => {
            if (err) {
                console.log(err);
                res.json({ msg: "Error in saving first item"});
            } else {
                console.log("First item saved succesfully");
                res.redirect('/dashboard');
            }
        });
    }

});

module.exports = router;