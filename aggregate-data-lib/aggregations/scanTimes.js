const Promise = require('bluebird');
function __getScanTimesByDay(conn, collectionName) {
    let collection = conn.get(collectionName);
    let aggQueries = [];
    let removeNullTimeStamps = {
        $match: {
            ScanTimestamp: {
                $ne: null
            }
        }
    };
    aggQueries.push(removeNullTimeStamps);

    let groupScansByDay = {
        $group: {
            _id: {
                year:  { $year : '$ScanTimestamp' },   
                month: { $month : '$ScanTimestamp' },                                      
                day:   { $dayOfMonth : '$ScanTimestamp' },
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