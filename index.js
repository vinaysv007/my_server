const express = require('express');
const cors = require('cors');
const bp = require('body-parser');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const mysql = require('mysql');

const app = express();

app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abc@123',
    database: 'ops_db',
    insecureAuth: true,
    port: 3306
});

connection.connect(err => {
    if (err) {
        console.log('error in connecting db');
        return err;
    }
});

app.get('/', (req, res) => {
    res.send('hello from ops server');
});

app.post('/login', (req, res) => {
    let user = req.body.user;
    let SELECT_ADMIN_QUERY = `select '${user}' from admin where user = '${user}'`;
    connection.query(SELECT_ADMIN_QUERY, (err, results) => {
        if (err) {
            return res.status(500).send();
        }
        if (results.length > 0) {
            let token = jwt.sign({ username: user }, 'keyboard cat 4 ever', { expiresIn: 129600 }); // Sigining the token
            return res.json({
                success: true,
                name: user,
                token
            });
        } else {
            return res.json({
                success: false,
                name: null,
                token: null
            });
        }
    })
});

// Error handling 
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
        res.status(401).send(err);
    }
    else {
        next(err);
    }
});

app.get('/admin/add', (req, res) => {
    const { name, password } = req.query;
    const INSER_ADMIN_INFO_QUERY = `INSERT into admin (user, password) VALUES ('${name}', '${password}')`;
    connection.query(INSER_ADMIN_INFO_QUERY, (err, results) => {
        if (err) {
            console.log('error in adding');
            return res.send(err);
        } else {
            return res.send('successfully added user');
        }
    })
});

app.get('/admin', (req, res) => {
    const INFO_QUERY = `SELECT * from admin`;
    connection.query(INFO_QUERY, (err, results) => {
        if (err) {
            console.log('error in adding');
            return res.send(err);
        } else {
            return res.send(results);
        }
    })
});

app.listen(8000, () => {
    console.log('server started at port 8000');
});