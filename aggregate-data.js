const getPlanetTypeCountsByStarType = require('./aggregate-data-lib/aggregations/planetTypeCountsByStarType');
const getPlanetMatsByPlanetType = require('./aggregate-data-lib/aggregations/planetMatsByPlanetType');
const monk = require('monk');
const Promise = require('bluebird');
const jsonfile = require('jsonfile');
let conn = monk('localhost:3000/edexplore');

Promise.props({
    planetTypeByStarType: getPlanetTypeCountsByStarType(conn),
    planetMatsByPlanetType: getPlanetMatsByPlanetType(conn)
})
.then((dat) => {
    jsonfile.writeFileSync('public/data/planetTypeByStarType.json',dat.planetTypeByStarType);
    jsonfile.writeFileSync('public/data/planetMatsByPlanetType.json',dat.planetMatsByPlanetType);
    conn.close();
});