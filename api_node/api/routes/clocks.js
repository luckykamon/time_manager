const express = require('express');
const router = express.Router();

const utils = require('../utils/function');
const db = require("../db/connect");

//clocks
router.get('', (req, res) => {
    db.query("SELECT * from clocks where 1", [], function (err, result) {
        if (err) {
            res.status(500).json({
                "succes": "false",
                "msg": "Une erreur s'est produite"
            })
            console.log(err)
        } else {
            utils.delete_not_my_team(req, result)
                .then((result) => {
                    res.status(200).json(result)
                })
                .catch((err) => {
                    res.status(400).json({
                        "status": "false",
                        "msg": err
                    })
                    console.log(err)
                })
            res.status(200).json(result)
        }
    });
})

router.get('/:userID', (req, res) => {
    const userID = parseInt(req.params.userID)
    if (userID) {
        function getClocksInfo() {
            db.query("SELECT * from clocks where userID=?", [userID], function (err, result) {
                if (err) {
                    res.status(500).json({
                        "succes": "false",
                        "msg": "Une erreur s'est produite"
                    })
                    console.log(err)
                } else {
                    res.status(200).json(result)
                }
            });
        }

        utils.authorizeChangeInfoUser(userID, req, res, getClocksInfo)
    } else {
        res.status(400).json({
            "succes": "false",
            "msg": "Veuillez indiquer un userID entier"
        })
    }
})

router.post('/:userID', (req, res) => {
    const userID = parseInt(req.params.userID)
    if (userID) {
        function createClocksInfo() {
            if (!req.body.time) {
                res.status(400).json({
                    "succes": "false",
                    "msg": "Vous devez indiquer un champs time en paramètre"
                })
            } else if (!req.body.status) {
                res.status(400).json({
                    "succes": "false",
                    "msg": "Vous devez indiquer un champs status en paramètre"
                })
            } else {
                db.query("INSERT INTO clocks (time, status, userID) VALUES (?,?,?)", [req.body.time, req.body.status, userID], function (err) {
                    if (err) {
                        res.status(500).json({
                            "succes": "false",
                            "msg": "Une erreur s'est produite"
                        })
                        console.log(err)
                    } else {
                        db.query("SELECT * from clocks WHERE time=? AND status=? AND userID=? ORDER BY clockID DESC LIMIT 1", [req.body.time, req.body.status, userID], function (err, result) {
                            if (err) {
                                res.status(500).json({
                                    "succes": "false",
                                    "msg": "Une erreur s'est produite"
                                })
                                console.log(err)
                            } else {
                                res.status(200).json(result)
                            }
                        });
                    }
                });
            }
        }

        utils.authorizeChangeInfoUser(userID, req, res, createClocksInfo)
    } else {
        res.status(400).json({
            "succes": "false",
            "msg": "Veuillez indiquer un userID entier"
        })
    }
})

router.put('/:clockID', (req, res) => {
    const clockID = parseInt(req.params.clockID)
    if (clockID) {
        function changeInfoClock() {
            if (!req.body.time && !req.body.status && !req.body.userID) {
                res.status(400).json({
                    "succes": "false",
                    "msg": "Vous devez indiquer un champs time, status et/ou userID en paramètre"
                })
            } else {
                let param = []
                let condition = ''
                if (req.body.time) {
                    param.push(req.body.time)
                    condition = 'time=?'
                }
                if (req.body.status) {
                    param.push(req.body.status)
                    if (condition === '') {
                        condition = 'status=?'
                    } else {
                        condition += ', status=?'
                    }
                }
                if (req.body.userID) {
                    param.push(req.body.userID)
                    if (condition === '') {
                        condition = 'userID=?'
                    } else {
                        condition += ', userID=?'
                    }
                }
                param.push(clockID)
                db.query("UPDATE clocks SET " + condition + " WHERE clockID=?", param, function (err) {
                    if (err) {
                        res.status(500).json({
                            "succes": "false",
                            "msg": "Une erreur s'est produite"
                        })
                        console.log(err)
                    } else {
                        db.query("SELECT * from clocks WHERE clockID=?", [clockID], function (err, result) {
                            if (err) {
                                res.status(500).json({
                                    "succes": "false",
                                    "msg": "Une erreur s'est produite"
                                })
                                console.log(err)
                            } else {
                                res.status(200).json(result)
                            }
                        });
                    }
                });
            }
        }

        utils.authorizeChangeInfoClock(clockID, req, res, changeInfoClock)
    } else {
        res.status(400).json({
            "succes": "false",
            "msg": "Veuillez indiquer un clockID entier"
        })
    }
})


module.exports = router;
