const { getAllLaunches, addNewLaunch, abortLaunch } = require('../models/launches');

const DEFAULT_LIMIT = 5;
const PAGE = 1;

const paginationParams = (queryParams) => {
    const page = Math.abs(queryParams.page) || PAGE;
    const limit = Math.abs(queryParams.limit) || DEFAULT_LIMIT;
    const skip = (page - 1) * 10;
    return { skip, limit };
};

const httpGetAllLaunches = async (req, res) => {
    const { data, status } = await getAllLaunches(paginationParams(req.query));
    return res.status(status).json(data)
}

const httpAddNewLaunch = async (req, res) => {
    const { data, status } = await addNewLaunch(req, res)
    return res.status(status).json(data)
}

const httpAbortLaunch = async (req, res) => {
    const abortFlightNumber = req.params.id;
    const { data, status } = await abortLaunch(abortFlightNumber);
    return res.status(status).json(data)
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}