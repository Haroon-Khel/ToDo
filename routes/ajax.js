const express = require('express');

const router = express.Router();

router.get('/ajax', (req, res) => {
    res.json({msg: "Hello"});
});

module.exports = router;