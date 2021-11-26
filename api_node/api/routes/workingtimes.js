const express = require('express');
const router = express.Router();

const utils = require('../utils/function');
const db = require("../db/connect");

//workinktime
router.get('', (req, res) => {
    if (req.role === "general_manager") {
        db.query("SELECT * from workingtimes", [], function (err, result) {
            if (err) {
                res.status(500).json({
                    "succes": "false",
                    "msg": "Une erreur s'est produite"
                })
                console.log(err)
            } else {
                res.status(200).json(result)
            }
        })
    } else {
        res.status(401).json({
            "succes": "false",
            "msg": "Vous devez être general_manager pour "
        })
    }
})

router.get('/:userID', (req, res) => {
    const userID = parseInt(req.params.userID)
    if (userID) {
        function changeInfoUser() {
            let start = req.query.start
            let end = req.query.end
            if (!start) {
                start = 0 //1970
            }
            if (!end) {
                end = 10000000000000 //année 2200 et quelque
            }
            db.query("SELECT * from workingtimes where userID=? AND start>=? AND end<=?", [userID, start, end], function (err, result) {
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

        utils.authorizeChangeInfoUser(userID, req, res, changeInfoUser)
    } else {
        res.status(400).json({
            "succes": "false",
            "msg": "Veuillez indiquer un userID"
        })
    }

})

router.get('/:userID/:workingtimeID', (req, res) => {
    const userID = parseInt(req.params.userID)
    if (userID) {
        function changeInfoUser() {
            const workingtimeID = parseInt(req.params.workingtimeID)
            if (workingtimeID) {
                db.query("SELECT * from workingtimes where userID=? && workingtimeID=?", [userID, workingtimeID], function (err, result) {
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
            } else {
                res.status(400).json({
                    "succes": "false",
                    "msg": "Veuillez indiquer un workingtimeID"
                })
            }
        }

        utils.authorizeChangeInfoUser(userID, req, res, changeInfoUser)
    } else {
        res.status(400).json({
            "succes": "false",
            "msg": "Veuillez indiquer un userID"
        })
    }
})

router.post('/:userID', (req, res) => {
    const userID = parseInt(req.params.userID)
    if (userID) {
        function changeInfoUser() {
            if (!req.body.start) {
                res.status(400).json({
                    "succes": "false",
                    "msg": "Vous devez indiquer un champs start en paramètre"
                })
            } else if (!req.body.end) {
                res.status(400).json({
                    "succes": "false",
                    "msg": "Vous devez indiquer un champs end en paramètre"
                })
            } else {
                db.query("INSERT INTO workingtimes (start, end, userID) VALUES (?,?,?)", [req.body.start, req.body.end, userID], function (err) {
                    if (err) {
                        res.status(500).json({
                            "succes": "false",
                            "msg": "Une erreur s'est produite"
                        })
                        console.log(err)
                    } else {
                        db.query("SELECT * from workingtimes WHERE start=? AND end=? AND userID=? ORDER BY workingtimeID DESC LIMIT 1", [req.body.start, req.body.end, userID], function (err, result) {
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

        utils.authorizeChangeInfoUser(userID, req, res, changeInfoUser)
    } else {
        res.status(400).json({
            "succes": "false",
            "msg": "Veuillez indiquer un userID entier"
        })
    }
})

router.put('/:workingtimeID', (req, res) => {
    const workingtimeID = parseInt(req.params.workingtimeID)
    if (workingtimeID) {
        function changeInfoWorkingtime() {
            if (!req.body.start && !req.body.end && !req.body.userID) {
                res.status(400).json({
                    "succes": "false",
                    "msg": "Vous devez indiquer un champs start, end et/ou userID en paramètre"
                })
            } else {
                let param = []
                let condition = ''
                if (req.body.start) {
                    param.push(req.body.start)
                    condition = 'start=?'
                }
                if (req.body.end) {
                    param.push(req.body.end)
                    if (condition === '') {
                        condition = 'end=?'
                    } else {
                        condition += ', end=?'
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
                param.push(workingtimeID)
                db.query("UPDATE workingtimes SET " + condition + " WHERE workingtimeID=?", param, function (err) {
                    if (err) {
                        res.status(500).json({
                            "succes": "false",
                            "msg": "Une erreur s'est produite"
                        })
                        console.log(err)
                    } else {
                        db.query("SELECT * from workingtimes WHERE workingtimeID=?", [workingtimeID], function (err, result) {
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

        utils.authorizeChangeInfoWorkingtime(workingtimeID, req, res, changeInfoWorkingtime)
    } else {
        res.status(400).json({
            "succes": "false",
            "msg": "Veuillez indiquer un workingtimeID entier"
        })
    }
})

router.delete('/:workingtimeID', (req, res) => {
    const workingtimeID = parseInt(req.params.workingtimeID)
    if (workingtimeID) {
        function changeInfoWorkingtime() {
            db.query("SELECT * FROM workingtimes WHERE workingtimeID=?", [workingtimeID], function (err, result) {
                if (err) {
                    res.status(500).json({
                        "succes": "false",
                        "msg": "Une erreur s'est produite"
                    })
                    console.log(err)
                } else {

                    if (result.length === 0) {
                        res.status(200).json({
                            "succes": "false",
                            "msg": "Le workingtime " + workingtimeID + " ne peut pas être supprimé puisqu'il n'existe pas"
                        })
                    } else {
                        db.query("DELETE FROM workingtimes WHERE workingtimeID=?", [workingtimeID], function (err) {
                            if (err) {
                                res.status(500).json({
                                    "succes": "false",
                                    "msg": "Une erreur s'est produite"
                                })
                                console.log(err)
                            } else {
                                res.status(200).json({
                                    "succes": "true",
                                    "msg": "Le workingtime " + workingtimeID + " a bien été supprimé"
                                })
                            }
                        });
                    }
                }
            });
        }
        utils.authorizeChangeInfoWorkingtime(workingtimeID, req, res, changeInfoWorkingtime)
    } else {
        res.status(400).json({
            "succes": "false",
            "msg": "Veuillez indiquer un workingtimeID entier"
        })
    }
})


module.exports = router;
