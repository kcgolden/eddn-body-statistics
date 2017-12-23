const Promise = require('bluebird');

function __getGeneralCounts(conn, collectionName) {
    let collection = conn.get(collectionName);
    let aggQueries = [];

    let eliminateDupes = {
        $group: {
            _id: '$BodyName'
        }
    }
    aggQueries.push(eliminateDupes);
    let countRows = {
        $group: {
            _id: null,
            count: {
                $sum: 1
            }
        }
    }
    aggQueries.push(countRows);
    return collection.aggregate(aggQueries, {allowDiskUse: true})
}

function __getKeyCounts(conn, collectionName, key) {
    let collection = conn.get(collectionName);
    let aggQueries = [];

    let countRows = {
        $group: {
            _id: '$' + key,
            count: {
                $sum: 1
            }
        }
    }
    aggQueries.push(countRows);

    return collection.aggregate(aggQueries, {allowDiskUse: true})
}
function getGeneralCounts(conn) {

    return Promise.props({
        starCount: __getGeneralCounts(conn, 'stars'),
        bodyCount: __getGeneralCounts(conn, 'bodies'),
        starSoftwareCount: __getKeyCounts(conn, 'stars', 'softwareName'),
        planetSoftwareCount: __getKeyCounts(conn, 'bodies', 'softwareName'),
        starUploaderCount: __getKeyCounts(conn, 'stars', 'uploaderId'),
        planetUploaderCount: __getKeyCounts(conn, 'bodies', 'uploaderId'),
    });
}
module.exports = getGeneralCounts;