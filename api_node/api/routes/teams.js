const express = require('express');
const router = express.Router();

const utils = require('../utils/function');
const db = require("../db/connect");

//teams
router.get('', async (req, res) => {
    db.query("SELECT * from teams WHERE 1", [], function (err, result) {
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

})

router.post('', async (req, res) => {
    if (req.role === "general_manager") {
        let name = req.body.name
        if (name) {
            db.query("INSERT INTO `teams`(`name`) VALUES (?)", [name], function (err, result) {
                if (err) {
                    res.status(500).json({
                        "succes": "false",
                        "msg": "Une erreur s'est produite"
                    })
                    console.log(err)
                } else {
                    db.query("SELECT * from teams WHERE teamID=?", [result.insertId], function (err, result) {
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
                }
            })
        } else {
            res.status(400).json({
                "succes": "false",
                "msg": "Vous devez indiquer un champs name en paramètre"
            })
        }
    } else {
        res.status(401).json({
            "succes": "false",
            "msg": "Vous devez être general_manager pour créer un team"
        })
        console.log(err)
    }
})


router.put('/:teamID', async (req, res) => {
    const teamID = parseInt(req.params.teamID)
    let name = req.body.name
    if (teamID && name) {
        db.query("UPDATE teams SET name=? WHERE teamID=?", [name, teamID], function (err, result) {
            if (err) {
                res.status(500).json({
                    "succes": "false",
                    "msg": "Une erreur s'est produite"
                })
                console.log(err)
            } else {
                db.query("SELECT * from teams WHERE teamID=?", [teamID], function (err, result) {
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

            }
        })
    } else {
        res.status(500).json({
            "status": "false",
            "msg": "Veuillez indiquer un teamID en paramètre"
        })
    }
})

router.delete('/:teamID', async (req, res) => {
    const teamID = parseInt(req.params.teamID)
    if (teamID) {
        db.query("SELECT * from teams WHERE teamID=?", [teamID], function (err, result) {
            if (err || result.length <= 0) {
                res.status(200).json({
                    "succes": "true",
                    "msg": "La team " + teamID + " ne peut pas être supprimé puisqu'elle n'existe pas"
                })
            } else {
                db.query("DELETE FROM `teams` WHERE teamID=?", [teamID], function (err) {
                    if (err) {
                        res.status(500).json({
                            "succes": "false",
                            "msg": "Une erreur s'est produite"
                        })
                        console.log(err)
                    } else {
                        res.status(200).json({
                            "succes": "true",
                            "msg": "La team " + teamID + " a bien été supprimé"
                        })
                    }
                })
            }
        })

    } else {
        res.status(500).json({
            "status": "false",
            "msg": "Veuillez indiquer un teamID en paramètre"
        })
    }
})


module.exports = router;
