const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '9421@Satnaam',  // Agar MySQL password set kiya hai to yaha likho
    database: 'HousingHubDB'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL Database');
});

module.exports = db;
