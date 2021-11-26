const express = require('express');
const router = express.Router();

const utils = require('../utils/function');
const db = require("../db/connect");


//teams_connect
router.get('', async (req, res) => {
    db.query("SELECT users.userID, teams_connect.teamID, name, username FROM teams_connect LEFT JOIN users ON teams_connect.userID = users.userID LEFT JOIN teams ON teams.teamID = teams_connect.teamID", [], function (err, result) {
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

router.get('/users/:teamID', async (req, res) => {
    const teamID = parseInt(req.params.teamID)
    if (teamID) {
        db.query("SELECT * from teams_connect WHERE teamID=?", [teamID], function (err, result) {
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

router.get('/teams/:userID', async (req, res) => {
    const userID = parseInt(req.params.userID)
    if (userID) {
        db.query("SELECT * from teams_connect WHERE userID=?", [userID], function (err, result) {
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

router.post('', async (req, res) => {
    let teamID = req.body.teamID
    let userID = req.body.userID
    if (teamID && userID) {
        db.query("INSERT INTO `teams_connect`(`teamID`, `userID`) VALUES (?,?)", [teamID, userID], function (err, result) {
            if (err) {
                res.status(500).json({
                    "succes": "false",
                    "msg": "Une erreur s'est produite"
                })
                console.log(err)
            } else {
                db.query("SELECT * from teams_connect where teams_connectID=?", [result.insertId], function (err, result) {
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
    }
})

router.delete('', async (req, res) => {
    let teamID = req.body.teamID
    let userID = req.body.userID
    if (teamID && userID) {
        db.query("SELECT * from teams_connect WHERE teamID=? AND userID=?", [teamID, userID], function (err, result) {
            if (err || result.length <= 0) {
                res.status(500).json({
                    "succes": "false",
                    "msg": "L'utilisateur " + userID + " ne peut pas être supprimé de la team " + teamID + " puisqu'il n'en fait pas parti"
                })
                console.log(err)
            } else {
                db.query("DELETE FROM `teams_connect` WHERE teamID= ? AND userID=?", [teamID, userID], function (err, result) {
                    if (err) {
                        res.status(500).json({
                            "succes": "false",
                            "msg": "Une erreur s'est produite"
                        })
                        console.log(err)
                    } else {
                        res.status(200).json({
                            "status": "true",
                            "msg": "L'utilisateur " + userID + " a bien été supprimé de la team " + teamID
                        })
                    }
                })
            }
        })
    }
})


module.exports = router;
