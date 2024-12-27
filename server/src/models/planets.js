const parser = require('csv-parse');
const { createReadStream } = require('fs');
const path = require('path');
const planetModel = require('./planets.mongo');
const planets = [];

const loadPlanetsData = () => {
    const isHabitable = (planet) => {
        return planet['koi_disposition'] === 'CONFIRMED' && planet["koi_insol"] > 0.35 && planet["koi_insol"] < 1.11 && planet["koi_prad"] < 1.6
    }

    return new Promise((resolve, reject) => {
        const dataPath = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv');
        createReadStream(dataPath).pipe(parser.parse({ comment: '#', columns: true }))
            .on('data', (planet) => {
                if (isHabitable(planet)) {
                    planets.push(planet)
                    savePlanet(planet)
                }
            }).on('error', () => reject("Error when getting data"))
            .on('end', () => {
                resolve();
            })
    });
}

const savePlanet = async (planetData) => {
    try {
        await planetModel.updateOne({
            keplerName: planetData.kepler_name
        }, {
            keplerName: planetData.kepler_name
        },
            { upsert: true })
    } catch (error) {
        console.log(error)
    }
}

const getAllPlanets = async () => {
    return await planetModel.find({});
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
};