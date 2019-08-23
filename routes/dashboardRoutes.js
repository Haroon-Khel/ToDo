const express = require('express');
const DashboardData = require('../models/DashboardData');

const router = express.Router();

router.get('/logout', (req, res) => {
    console.log(`${req.user.username} has logged out`);
    console.log(`req.session.items = ${req.session.items}`);
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            res.json("Error in logging out. Server may need restarting");
        } else {
            req.logout();
            res.redirect('/');
        }
    });
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
                res.json({ msg: "Error in saving first item" });
            } else {
                console.log("First item saved succesfully");
                res.redirect('/dashboard');
            }
        });
    }
});

router.post('/itemdelete', (req, res) => {
    // Expecting parameters: item id
    // Can only be accessed by users with content
    if (req.session.items === "0") {
        console.log("No items to delete");
        res.json({ msg: "User has no content to delete" });
    } else {
        const id = req.body.id;
        const username = req.user.username;
        DashboardData.findOneAndUpdate({ username: username }, { $pull: { todo: { _id: id } } }, (err, item) => {
            if (err) {
                console.log(err);
                res.json({ msg: "There was an error in removing the item" });
            } else {
                console.log("Todo item removed");
                res.redirect('/dashboard');
            }
        });
    }

});

router.post('/itemedit', (req, res) => {
    // Expecting parameters: item id, new title, new body
    if (req.session.items === "0") {
        console.log("No items to edit");
        res.json({ msg: "User has no content to edit" });
    } else {
        const id = req.body.id;
        const title = req.body.title;
        const body = req.body.body;
        DashboardData.updateOne({ 'todo._id': id }, 
            { $set: {
                'todo.$.title': title,
                'todo.$.body': body
            }}, (err) => {
                if (err) {
                    console.log(err);
                    res.json({ msg: "There was an error in updating the document"});
                } else {
                    console.log("Item editted");
                    res.redirect('/dashboard');
                }
            });
    }
});

module.exports = router;