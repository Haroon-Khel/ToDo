const express = require('express');

const router = express.Router();

router.get('/logout', (req, res) => {
    console.log(`${req.user.username} has logged out`);
    req.logout();
    res.redirect('/');
});

module.exports = router;