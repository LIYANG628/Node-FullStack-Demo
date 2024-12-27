const API_URL = 'http://localhost:7788/'

async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  const res = await fetch(`${API_URL}planets`);
  return await res.json();
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
  const res = await fetch(`${API_URL}launches`)
  const launches = await res.json();
  return launches.sort((a, b) => a.flightNumber - b.flightNumber);
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
  const { launchDate, mission, rocket, target, } = launch;
  const res = await fetch(`${API_URL}launches`,
    {
      method: 'post',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(launch),
    }
  );
  return res;;
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
  const res = await fetch(`${API_URL}launches/${id}`, { method: 'DELETE' })
  return res;
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};