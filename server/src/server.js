const http = require('http');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets');
const { default: mongoose } = require('mongoose');
const { loadLaunchesData } = require('./models/launches');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5566;
const server = http.createServer(app);

const CONNECTION_CRED = process.env.MONGOURL

const startServer = async () => {
    await mongoose.connect(CONNECTION_CRED);
    await loadPlanetsData();
    await loadLaunchesData();
    server.listen(PORT, () => console.log(`server is running on port ${PORT}`))
}

startServer();
