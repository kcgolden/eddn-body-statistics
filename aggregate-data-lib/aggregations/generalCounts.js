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
    return collection.aggregate(aggQueries, {allowDiskUse: true});
}

function getGeneralCounts(conn) {

    return Promise.props({
        starCount: __getGeneralCounts(conn, 'stars'),
        bodyCount: __getGeneralCounts(conn, 'bodies')
    });
}
module.exports = getGeneralCounts;