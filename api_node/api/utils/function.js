const utils = require('./function');
const db = require('../db/connect')

/**
 * @param req de l'utilisateur
 * @param data Une liste de json où chaque json contient un champs userID
 *
 * @return data en retirant tout les json qui n'appartiennent pas à une team de userID
 */
module.exports.delete_not_my_team = async function (req, data) {
    let userID = req.userID
    let role = req.role
    return (new Promise((resolve, reject) => {
        switch (role) {
            case "user":
                let data_return = []
                for (let dataID = 0; dataID < data.length; dataID++) {
                    if (userID === data[dataID].userID) {
                        data_return.push(data[dataID])
                    }
                }
                resolve(data_return)
                break;
            case "manager":
                db.query("SELECT teamID from teams_connect where userID=?", [userID], async function (err, list_teamID) {
                    if (err) {
                        return []
                    } else {
                        let condition = '1'
                        let param = []
                        for (let i = 0; i < list_teamID.length; i++) {
                            if (condition === '1') {
                                condition = ' teamID=?'
                            } else {
                                condition += ' OR teamID=?'
                            }
                            param.push(list_teamID[i])
                        }
                        db.query("SELECT userID from teams_connect where" + condition, param, function (err, list_userID) {
                            if (err) {
                                return []
                            } else {
                                let list_userID_format = []
                                for (let i = 0; i < list_userID.length; i++) {
                                    list_userID_format.push(list_userID[i].userID)
                                }
                                let data_return = []
                                for (let dataID = 0; dataID < data.length; dataID++) {
                                    if (list_userID_format.includes(data[dataID].userID)) {
                                        data_return.push(data[dataID])
                                    }
                                }
                                for (let i = 0; i < data.length; i++) {
                                    if (data[i]['userID'] === req.userID) {
                                        let already_have_user_data = false
                                        for (let j = 0; j < data_return.length; j++) {
                                            if (data[j] === data_return[i]) {
                                                already_have_user_data = true
                                                break
                                            }
                                        }
                                        if (!already_have_user_data) {
                                            data_return.push(data[i])
                                        }

                                    }
                                }
                                resolve(data_return)
                            }
                        })
                    }
                })
                break;
            case "general_manager":
                resolve(data)
                break;
            default:
                reject("Role: " + role + " invalide")
                break;
        }
    }))
}

/**
 *
 * @param {Number} userID1
 * @param {Number} userID2
 * @param {function} next
 * @return {Boolean} true si les 2 utilisateurs ont une team commune
 */
module.exports.haveCommunTeam = async function (userID1, userID2, next) {
    if (userID1 === userID2) {
        return true
    } else {
        await db.query("SELECT teamID, userID from teams_connect WHERE userID=? OR userID=?", [userID1, userID2], function (err, result) {
            if (err) {
                next(false)
            } else {
                console.log(result)
                let teamID1 = []
                let teamID2 = []
                for (let i = 0; i < result.length; i++) {
                    if (result[i].userID === userID1) {
                        teamID1.push(result[i].teamID)
                    } else {
                        teamID2.push(result[i].teamID)
                    }
                }
                const filteredArray = teamID1.filter(value => teamID2.includes(value))
                next(filteredArray.length > 0)
            }
        })
    }
}

module.exports.authorizeChangeInfoUser = function (userID, req, res, next) {
    if (userID === req.userID || req.role === "general_manager") {
        next()
    } else if (req.role === "manager") {
        utils.haveCommunTeam(userID, req.userID, (isAuthorize) => {
            if (isAuthorize) {
                next()
            } else {
                res.status(401).json({
                    "succes": "false",
                    "msg": "Vous n'avez pas les droits pour modifier/voir les informations de cet utilisateur, vous devez être dans la même team"
                })
            }
        })
    } else {
        res.status(401).json({
            "succes": "false",
            "msg": "Vous n'avez pas les droits pour modifier/voir les informations de cet utilisateur, vous devez être manager ou general_manager"
        })
    }
}

module.exports.authorizeChangeInfoWorkingtime = function (workingtimeID, req, res, changeInfoWorkingtime) {
    db.query("SELECT userID FROM workingtimes WHERE workingtimeID=?", [workingtimeID], function (err, result) {
        if (err) {
            res.status(500).json({
                "succes": "false",
                "msg": "Une erreur s'est produite"
            })
            console.log(err)
        } else if (result.length <= 0) {
            res.status(400).json({
                "succes": "false",
                "msg": "Le workingtimeID indiqué n'as pas été trouvé"
            })
        } else {
            utils.authorizeChangeInfoUser(result[0].userID, req, res, changeInfoWorkingtime)
        }
    })
}

module.exports.authorizeChangeInfoClock = function (clockID, req, res, changeInfoClock) {
    db.query("SELECT userID FROM clocks WHERE clockID=?", [clockID], function (err, result) {
        if (err) {
            res.status(500).json({
                "succes": "false",
                "msg": "Une erreur s'est produite"
            })
            console.log(err)
        } else if (result.length <= 0) {
            res.status(400).json({
                "succes": "false",
                "msg": "Le clockID indiqué n'as pas été trouvé"
            })
        } else {
            utils.authorizeChangeInfoUser(result[0].userID, req, res, changeInfoClock)
        }
    })
}

