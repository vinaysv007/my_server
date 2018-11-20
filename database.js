const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abc@123',
    database: 'ops_db',
    insecureAuth: true,
    port: 3306
});

//console.log(connection);
connection.connect(err => {
    if (err) {
        console.log('error in connecting db');
        return err;
    }
});