const express = require('express')
const cors = require('cors')
const usersRouter = require('./api/routes/users');
const workingtimesRouter = require('./api/routes/workingtimes');
const clocksRouter = require('./api/routes/clocks');
const teamsRouter = require('./api/routes/teams');
const teamsConnectRouter = require('./api/routes/teams_connect');
const app = express()

app.use(express.json())
app.use(cors());

// var db = require('./api/db/connect')
const db = require("./api/db/connect");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utils = require("./api/utils/function");
const jwt_privateKey = process.env.jwt_privateKey || ')k;Pkg6[&2Fd,Pg8KP&U?';

//Middleware de vérification des droits
const myLogger = function (req, res, next) {
    if (req.query.password && (req.query.email || req.query.username)) { //On vérifie le mot de passe
        let condition = "username"
        let param = [req.query.username]
        if (req.query.email) {
            condition = "email"
            param = [req.query.email]
        }
        db.query("SELECT * from users where " + condition + "=?", param, function (err, resultUser) {
            if (err) {
                res.status(500).json({
                    "succes": "false",
                    "msg": "Une erreur s'est produite",
                    "err_code": "1004"
                })
                console.log(err)
            } else if(resultUser.length <= 0) {
                res.status(401).json({
                    "succes": "false",
                    "msg": "Identifiant / Email incorrect",
                    "err_code": "1005"
                })
            } else {
                bcrypt.compare(req.query.password, resultUser[0].password, function (err, result) {
                    if (err) {
                        res.status(500).json({
                            "succes": "false",
                            "msg": "Une erreur s'est produite",
                            "err_code": "1003"
                        })
                        console.log(err)
                    } else if (!result) {
                        res.status(401).json({
                            "succes": "false",
                            "msg": "Mot de passe incorrect",
                            "err_code": "1002"
                        })
                    } else {
                        let date = (new Date((new Date()).getTime() + 24 * 3600 * 1000)).getTime() //24 heure

                        let jwt_token = jwt.sign({
                            role: resultUser[0].role,
                            userID: resultUser[0].userID,
                            exp: date
                        }, jwt_privateKey);
                        db.query("UPDATE `users` SET `jwt_token`=? WHERE userID=?", [jwt_token, resultUser[0].userID], function (err) {
                            if (err) {
                                res.status(500).json({
                                    "succes": "false",
                                    "msg": "Une erreur s'est produite",
                                    "err_code": "1006"
                                })
                                console.log(err)
                            } else {
                                req.role = resultUser[0].role
                                req.userID = resultUser[0].userID
                                next();
                            }
                        })

                    }
                });
            }
        });
    } else if (req.header('authorization')) { //On vérifie le jwt_token
        let jwt_token = req.header('authorization').split(" ")[1]
        jwt.verify(jwt_token, jwt_privateKey, function (err, jwt_token_decoded) {
            if (jwt_token_decoded.exp < (new Date()).getTime()) {
                res.status(401).json({
                    "succes": "false",
                    "msg": "Token expiré, veuillez vous reconnecter",
                    "err_code": "1000"
                })
            } else {
                req.role = jwt_token_decoded.role
                req.userID = jwt_token_decoded.userID
                next();
            }
        });
    } else {
        res.status(401).json({
            "succes": "false",
            "msg": "Veuillez fournir un token ou vos informations de connexions",
            "err_code": "1001"
        })
    }

};


app.use(myLogger);

app.use('/api/users', usersRouter);
app.use('/api/workingtimes', workingtimesRouter);
app.use('/api/clocks', clocksRouter);
app.use('/api/teams', teamsRouter);teamsConnectRouter
app.use('/api/teams_connect', teamsConnectRouter);

let port = 4000
app.listen(port, () => {
    console.log("Serveur à l'écoute sur le port " + port)
})
