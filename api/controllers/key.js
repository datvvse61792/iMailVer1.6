'use strict'
let express = require('express'),
    db = require('../models'),
    router = express.Router()

router.get('/', function (req, res) {
    db.Key.find({}, function (err, keys) {
        if (err) {
            return res.status(406).send(JSON.stringify({err}))
        }
        res.json(keys)
    })
})

router.post('/', function (req, res) {
    let email = req.body.email
    db.Key.find({email: email}, (err, keys) => {
        if (err) {
            res.status(406).send(JSON.stringify({err}))
        }
        if (keys.length) {
            keys[0].key = req.body.key
            keys[0].save()
            res.json(keys[0])
        } else {
            let key = db.Key(req.body)
            key.save(function (error, newKey) {
                if (error) {
                    res.status(406).send(JSON.stringify({error}))
                }
                res.json(newKey)
            })
        }
    })
})

module.exports = router
