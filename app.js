const express = require('express');
const connect = require('./src/config/admin');
const router = require('./src/routers/admin');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router.router);

connect();
app.listen(3000, () => {
    console.log(`Server is running `);
});