const getPlanetTypeCountsByStarType = require('./aggregate-data-lib/aggregations/planetTypeCountsByStarType');
const getPlanetMatsByPlanetType = require('./aggregate-data-lib/aggregations/planetMatsByPlanetType');
const getGeneralCounts = require('./aggregate-data-lib/aggregations/generalCounts');
const getScanTimes = require('./aggregate-data-lib/aggregations/scanTimes');
const monk = require('monk');
const Promise = require('bluebird');
const jsonfile = require('jsonfile');
let conn = monk('localhost:3000/edexplore');

Promise.props({
    planetTypeByStarType: getPlanetTypeCountsByStarType(conn),
    planetMatsByPlanetType: getPlanetMatsByPlanetType(conn),
    generalCounts: getGeneralCounts(conn),
    scanTimes: getScanTimes(conn)
})
.then((dat) => {
    jsonfile.writeFileSync('public/data/planetTypeByStarType.json',dat.planetTypeByStarType);
    jsonfile.writeFileSync('public/data/planetMatsByPlanetType.json',dat.planetMatsByPlanetType);
    jsonfile.writeFileSync('public/data/generalCounts.json',dat.generalCounts);
    jsonfile.writeFileSync('public/data/scanTimes.json',dat.scanTimes);
    conn.close();
});