const axios = require('axios');

const launchDatabase = require('./launches.mongo');

const launches = new Map();
let flightNumber = 100;

const launch = {
    flightNumber: flightNumber,
    mission: 'Kepler Exoplanet X',
    rocket: "Exoplanet IS1",
    launchDate: new Date('2022-12-31'),
    target: 'Kepler-442b',
    customer: ['NASA', 'ZTM'],
    upcoming: true,
    success: true
};

launches.set(launch.flightNumber, launch);

const getAllLaunches = async ({ limit, skip }) => {
    const result = await launchDatabase.find({}, { '__v': 0, '_id': 0 })
        .skip(skip)
        .limit(limit)
        .sort({ flightNumber: 1 });
    return {
        data: result,
        status: 200
    };
}

const getLatestFlightNumber = async () => {
    const currentLatestFlightNumber = await launchDatabase.findOne().sort('-flightNumber');
    return currentLatestFlightNumber.flightNumber + 1;
}

const addNewLaunch = async (req, res) => {
    const { mission, rocket, launchDate, target } = req.body;
    const latestFlightNumber = await getLatestFlightNumber();
    if (!mission) {
        return {
            data: `Please provide mission name`,
            status: 404
        }
    } else if (new Date(launchDate) == 'Invalid Date' || !launchDate) {
        return {
            data: `Please provide valid date`,
            status: 404
        }
    }
    const newLaunchObj = {
        flightNumber: latestFlightNumber,
        mission,
        rocket,
        launchDate: new Date(launchDate),
        target,
        customer: ['NASA', 'ZTM'],
        upcoming: true,
        success: true
    }
    await saveLaunch(newLaunchObj);
    return {
        data: `launch ${latestFlightNumber} is set up`,
        status: 200
    }
}

const saveLaunch = async (launch) => {
    await launchDatabase.updateOne({
        flightNumber: launch.flightNumber,
    }, launch, { upsert: true });
}

const abortLaunch = async (flightNumber) => {
    const aborted = await launchDatabase.updateOne({ flightNumber: parseInt(flightNumber) }, { upcoming: false, success: false });
    if (aborted.mofifiedCount === 1) {
        return {
            data: `Can't find launch with flight number ${flightNumber}`,
            status: 404
        }
    } else {
        return {
            data: `launch ${flightNumber} is aborted`,
            status: 200
        }
    }
}

const SPACEX_API = "https://api.spacexdata.com/v4/launches/query";

const checkIfDataPersists = async () => {
    const res = await launchDatabase.find({
        flightNumber: 1,
        rocket: "Falcon 1"
    });

    return res.length > 0;
}

const loadLaunchesData = async () => {
    const ifPersists = await checkIfDataPersists();
    if (!ifPersists) {
        const result = await axios.post(SPACEX_API, {
            "query": {},
            "options": {
                "pagination": false,
                "populate": [
                    {
                        "path": "rocket",
                        "select": {
                            "name": 1,
                            "country": 1
                        }
                    },
                    {
                        "path": "payloads",
                        "select": {
                            "customers": 1
                        }
                    }
                ]
            }
        });

        const launchDocs = result.data.docs;
        for (launchDoc of launchDocs) {
            const customers = launchDoc["payloads"].flatMap(customerInfo => customerInfo["customers"]);
            const launch = {
                flightNumber: launchDoc['flight_number'],
                mission: launchDoc['name'],
                rocket: launchDoc['rocket']['name'],
                launchDate: launchDoc['date_local'],
                customers,
                upcoming: launchDoc['upcoming'],
                success: launchDoc['success']
            };
            // save launch to database
            await saveLaunch(launch)
        }
    } else {
        console.log("Launch data already loaed!")
    }
}

module.exports = {
    loadLaunchesData,
    getAllLaunches,
    addNewLaunch,
    abortLaunch
};