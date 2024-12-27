const express = require('express');
const { httpGetAllPlanets } = require('../controllers/planets.controller');

const planetRouter = express.Router();

planetRouter.get('/', httpGetAllPlanets)

module.exports = planetRouter;