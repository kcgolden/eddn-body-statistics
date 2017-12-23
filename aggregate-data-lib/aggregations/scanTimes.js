const Promise = require('bluebird');
function __getScanTimesByDay(conn, collectionName) {
    let collection = conn.get(collectionName);
    let aggQueries = [];
    let removeNullTimeStamps = {
        $match: {
            ScanTimestamp: {
                $in: [/\d\d\d\d-\d\d-\d\d/]
            }
        }
    };
    aggQueries.push(removeNullTimeStamps);

    let groupScansByDay = {
        $group: {
            _id: {
                year:  { $substr : ["$ScanTimestamp", 0, 4 ] },   
                month: { $substr : ["$ScanTimestamp", 5, 2 ] },                                      
                day:   { $substr : ["$ScanTimestamp", 8, 2 ] },
            },
            scanCount: {
                $sum: 1
            },
            uniqueScanners: {
                $addToSet: '$uploaderId'
            }
        }
    }
    aggQueries.push(groupScansByDay);

    let projectFinalOutput = {
        $project: {
            _id: '$_id',
            scanCount: 1,
            uniqueScanners: {
                $size: '$uniqueScanners'
            }
        }
    }
    aggQueries.push(projectFinalOutput);

    return collection.aggregate(aggQueries, {allowDiskUse: true});
}
function getScanTimesByDay(conn) {
    return Promise.props({
        planetScanTimes: __getScanTimesByDay(conn, 'bodies'),
        starScanTimes: __getScanTimesByDay(conn, 'stars')
    })
}
module.exports = getScanTimesByDay;