'use strict'
var express = require('express'),
    router = express.Router()

router.use('/key', require('./key'))

// nothing for root
router.get('/', function (req, res) {
    res.send(JSON.stringify({}))
})

module.exports = router