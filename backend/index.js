const express = require('express');
const db = require('./db');
const cors = require('cors');

const app = express();
app.use(express.json());

app.listen(3001,console.log('SERVER:3001'));