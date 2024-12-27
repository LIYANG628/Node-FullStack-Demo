const express = require('express');
const { httpGetAllLaunches, httpAddNewLaunch,httpAbortLaunch } = require('../controllers/launches.controller');

const launchRouter = express.Router();

launchRouter.get('/', httpGetAllLaunches);
launchRouter.post('/', httpAddNewLaunch);
launchRouter.delete('/:id',httpAbortLaunch);

module.exports = launchRouter;