const mysql = require('mysql');

// environment variables
const PORT = process.env.MYSQL_PORT || 3306;
const HOST = process.env.MYSQL_HOST || 'localhost';

let db = mysql.createConnection({
    host: HOST,
    port: PORT,
    user: "node",
    password: "root",
    database: "api_time_manager"
});

db.connect(function (err) {
    if (err !== null) {
        throw "Connexion a la bdd échoué"
    }
})


module.exports = db
