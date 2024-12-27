const express = require('express');
const cors = require('cors');
const path = require('path');
const planetRouter = require('./routes/planets.router');
const launchRouter = require('./routes/launches.router');
const app = express();

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
})

app.use('/planets', planetRouter)
app.use('/launches', launchRouter)

module.exports = app;