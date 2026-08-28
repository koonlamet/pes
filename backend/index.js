const express = require('express');
const cors = require('cors');
const { readdirSync } = require('fs');
const app = express();
app.use(express.json());
app.use(cors());

readdirSync('./route').map(item => app.use('/api',require('./route/'+item)));

app.listen(3001,console.log('SERVER:3001'));