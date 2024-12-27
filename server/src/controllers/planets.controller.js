const { getAllPlanets } = require("../models/planets");


const httpGetAllPlanets = async (req, res) => {
    const result = await getAllPlanets();
    await res.status(200).json(result);
}

module.exports = {
    httpGetAllPlanets
}