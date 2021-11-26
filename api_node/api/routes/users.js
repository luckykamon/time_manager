const express = require('express');
const bcrypt = require("bcrypt");
const validator = require("email-validator");
const router = express.Router();

const utils = require('../utils/function');
const db = require("../db/connect");


const saltRounds = 10;

//users
router.get('', async (req, res) => {
    let email = req.query.email
    let username = req.query.username
    let param = []
    let condition = '0'
    if (email) {
        condition = 'email=?'
        param.push(email)
    }
    if (username) {
        if (condition === '0') {
            condition = 'username=?'
        } else {
            condition += ' AND username=?'
        }
        param.push(username)
    }
    await db.query("SELECT userID, username, email, jwt_token, role from users where " + condition, param, async function (err, result) {
        if (err) {
            res.status(500).json({
                "succes": "false",
                "msg": "Une erreur s'est produite"
            })
            console.log(err)
        } else {
            utils.delete_not_my_team(req, result)
                .then(result_team => {
                    for (let i = 0; i < result_team.length; i++) {
                        delete result_team[i]['password']
                    }
                    res.status(200).json(result_team)
                })
                .catch((err) => {
                    res.status(400).json({
                        "status": "false",
                        "msg": err
                    })
                    console.log(err)
                })
        }
    });
})

router.get('/all', async (req, res) => {
    let condition = ''
    let param = []
    if (req.role === "user") {
        condition = 'userID=?'
        param = [req.userID]
    } else if (req.role === "manager") {
        //TODO: A optimiser
        condition = 1
        param = []
    } else if (req.role === "general_manager") {
        condition = 1
        param = []
    }
    db.query("SELECT userID, username, email, role from users where " + condition, param, async function (err, result) {
        if (err) {
            res.status(500).json({
                "succes": "false",
                "msg": "Une erreur s'est produite"
            })
            console.log(err)
        } else {
            utils.delete_not_my_team(req, result)
                .then((resultfilter) => {
                    res.status(200).json(resultfilter)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    });
})

router.get('/:userID', async (req, res) => {
    const userID = parseInt(req.params.userID)
    if (userID) {
        function getInfoUser() {
            db.query("SELECT userID, username, email, role from users where userID=?", [userID], async function (err, result) {
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

        utils.authorizeChangeInfoUser(userID, req, res, getInfoUser)
    } else {
        res.status(400).json({
            "succes": "false",
            "msg": "Veuillez indiquer un userID"
        })
    }
})

router.post('', (req, res) => {
    if (req.role === "user") {
        res.status(401).json({
            "succes": "false",
            "msg": "Vous devez être manager ou general_manager pour pouvoir créer un utilisateur"
        })
    } else {
        if (!req.body.username) {
            res.status(400).json({
                "succes": "false",
                "msg": "Vous devez indiquer un champs username en paramètre"
            })
        } else if (!req.body.email) {
            res.status(400).json({
                "succes": "false",
                "msg": "Vous devez indiquer un champs email en paramètre"
            })
        } else if (!req.body.password) {
            res.status(400).json({
                "succes": "false",
                "msg": "Vous devez indiquer un champs password en paramètre"
            })
        } else if (req.body.role && (req.role !== 'general_manager' || (req.body.role !== 'user' && req.body.role !== 'manager'))) {
            res.status(401).json({
                "succes": "false",
                "msg": "Vous devez être general_manager pour créer un utilisateur avec le rôle de manager ou de user"
            })
        } else {
            bcrypt.hash(req.body.password, saltRounds, function (err, password) {
                if (err) {
                    res.status(500).json({
                        "succes": "false",
                        "msg": "Une erreur s'est produite"
                    })
                    console.log(err)
                } else {
                    let username = req.body.username
                    let email = req.body.email
                    let role = 'user'
                    if (req.body.role) {
                        role = req.body.role
                    }
                    if (validator.validate(email)) {
                        db.query("INSERT INTO users (username, email, password, role) VALUES (?,?,?,?)", [username, email, password, role], function (err, result) {
                            if (err) {
                                res.status(500).json({
                                    "succes": "false",
                                    "msg": "Une erreur s'est produite"
                                })
                                console.log(err)
                            } else {
                                db.query("SELECT userID, username, email, role from users WHERE userID=?", [result.insertId], function (err, result) {
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
                    } else {
                        res.status(400).json({
                            "succes": "false",
                            "msg": "Veuillez indiquer un email valide"
                        })
                    }
                }
            });
        }
    }
})

router.put('/:userID', async (req, res) => {
    const userID = parseInt(req.params.userID)
    if (userID) {
        async function changeInfoUser() {
            let param = []
            let condition = ''
            if (req.body.username) {
                condition = 'username=?'
                param.push(req.body.username)
            }
            if (req.body.email) {
                if (condition === '') {
                    condition = 'email=?'
                } else {
                    condition += ', email=?'
                }
                param.push(req.body.email)
            }
            if (req.body.role) { //Un general_manager ne peut être rétrogradé
                if (condition === '') {
                    condition = 'role=?'
                } else {
                    condition += ', role=?'
                }
                param.push(req.body.role)
            }
            if (req.body.password) {
                const promise = new Promise(((resolve, reject) => {
                    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(hash)
                        }
                    })
                }))
                await promise
                    .then((hash) => {
                        if (condition === '') {
                            condition = 'password=?'
                        } else {
                            condition += ', password=?'
                        }
                        param.push(hash)
                    })
                    .catch((err) => {
                        res.status(500).json({
                            "succes": "false",
                            "msg": "Une erreur s'est produite"
                        })
                        console.log(err)
                        condition = '' //Pour ne pas exécuter la suite
                    })
            }
            if (condition !== '') {
                param.push(userID)

                if (req.body.role && (req.role !== 'general_manager' || (req.body.role !== 'user' && req.body.role !== 'manager'))) {
                    res.status(401).json({
                        "succes": "false",
                        "msg": "Vous devez être general_manager pour editer un role et il ne peux y avoir qu'un seul general_manager"
                    })
                } else {
                    db.query("UPDATE users SET " + condition + " WHERE userID=?", param, function (err) {
                        if (err) {
                            res.status(500).json({
                                "succes": "false",
                                "msg": "Une erreur s'est produite"
                            })
                            console.log(err)
                        } else {
                            db.query("SELECT userID, username, email, role from users WHERE userID=?", [userID], function (err, result) {
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
            } else {
                res.status(400).json({
                    "succes": "false",
                    "msg": "Vous devez indiquer un champs username, email et/ou role en paramètre"
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

router.delete('/:userID', (req, res) => {
    const userID = parseInt(req.params.userID)
    if (userID) {
        function changeInfoUser() {
            db.query("SELECT userID, username, email, role FROM `users` WHERE userID=?", [userID], function (err, result) {
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
                            "msg": "L'user " + userID + " ne peut pas être supprimé puisqu'il n'existe pas"
                        })
                    } else {
                        db.query("DELETE FROM `users` WHERE userID=?", [userID], function (err) {
                            if (err) {
                                res.status(500).json({
                                    "succes": "false",
                                    "msg": "Une erreur s'est produite"
                                })
                                console.log(err)
                            } else {
                                db.query("DELETE FROM `clocks` WHERE userID=?", [userID], function (err) {
                                    if (err) {
                                        res.status(500).json({
                                            "succes": "false",
                                            "msg": "Une erreur s'est produite"
                                        })
                                        console.log(err)
                                    } else {
                                        db.query("DELETE FROM `teams_connect` WHERE userID=?", [userID], function (err) {
                                            if (err) {
                                                res.status(500).json({
                                                    "succes": "false",
                                                    "msg": "Une erreur s'est produite"
                                                })
                                                console.log(err)
                                            } else {
                                                db.query("DELETE FROM `workingtimes` WHERE userID=?", [userID], function (err) {
                                                    if (err) {
                                                        res.status(500).json({
                                                            "succes": "false",
                                                            "msg": "Une erreur s'est produite"
                                                        })
                                                        console.log(err)
                                                    } else {
                                                        res.status(200).json({
                                                            "succes": "true",
                                                            "msg": "L'user " + userID + " a bien été supprimé"
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        });
                    }
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

module.exports = router;
