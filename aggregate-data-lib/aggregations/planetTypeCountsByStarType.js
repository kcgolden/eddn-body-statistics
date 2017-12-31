const uniq = require('../utils/uniq');

function getPlanetTypeCountsByStarType(conn) {
    let collection = conn.get('stars');
    let aggQueries = [];
    let filterToMainStars = {
        $match: {
            $expr: {
                $eq: ['$StarSystem', '$BodyName']
            }
        }
    };
    aggQueries.push(filterToMainStars);
    let groupByStarNames = {
        $group: {
            _id: '$BodyName',
            type: {
                $first:'$StarType'
            }
        }
    };
    aggQueries.push(groupByStarNames);

    let joinStarsToPlanets = {
        $lookup: {
            from: 'bodies',
            localField: '_id',
            foreignField: 'StarSystem',
            as: 'planets'
        }
    };
    aggQueries.push(joinStarsToPlanets);


    let mapPlanets = {
        $project: {
            _id: '$type',
            types: {
                $map: {
                    input: '$planets',
                    as: 'el',
                    in: {
                            planetType: {
                                $ifNull: ['$$el.PlanetClass', 'Asteroid Belt Cluster']
                            },
                            landable: '$$el.Landable'
                    }
                }
            }
        }
    };
    aggQueries.push(mapPlanets);

    let groupByType = {
        $group: {
            _id: '$_id',
            types: {
                $push: '$types'
            },
            totalStarsOfType: {
                $sum: 1
            }
        }
    }
    aggQueries.push(groupByType);

    let removeSmallSamples = {
        $match: {
            totalStarsOfType: {
                $gt: 50
            }
        }
    }
    aggQueries.push(removeSmallSamples);

    let unWindPlanets = {
        $unwind: '$types'
    };
    aggQueries.push(unWindPlanets);
    aggQueries.push(unWindPlanets);

    let groupByStarType = {
        $group: {
            _id: '$_id',
            types: {
                $push: '$types'
            },
            totalStarsOfType: {
                $first: '$totalStarsOfType'
            },
            totalPlanets: {
                $sum: 1
            }
        }
    };
    aggQueries.push(groupByStarType);
    aggQueries.push(unWindPlanets);

    let groupByStarTypeAndPlanetClass = {
        $group: {
            _id: {
                type: '$_id',
                planetTypes: '$types.planetType'
            },
            totalPlanetsOfType: {
                $sum: 1
            },
            totalPlanets: {
                $first: '$totalPlanets'
            },
            totalStarsOfType: {
                $first: '$totalStarsOfType'
            }
        }
    };
    aggQueries.push(groupByStarTypeAndPlanetClass);

    let flatten = {
        $project: {
            _id: 0,
            type: '$_id.type',
            planetType: '$_id.planetTypes',
            totalPlanetsOfType: 1,
            totalPlanets: '$totalPlanets',
            totalStarsOfType: '$totalStarsOfType',
            pct: {
                $divide: ['$totalPlanetsOfType', '$totalStarsOfType']
            }
        }
    };
    aggQueries.push(flatten);

    let sort = {
        $sort: {
            planetType: 1,
            pct: -1
        }
    }
    aggQueries.push(sort);


    return collection.aggregate(aggQueries, {allowDiskUse: true})
    .then(function(data) {
        let finalArray = [];
        let tracker = {};
        data.forEach((planetTypeDatum) => {
            planetTypeDatum.type = planetTypeDatum.type.charAt(0).toUpperCase();
            if(tracker[planetTypeDatum.type + planetTypeDatum.planetType] !== undefined) {
                finalArray[tracker[planetTypeDatum.type + planetTypeDatum.planetType]].totalPlanetsOfType += planetTypeDatum.totalPlanetsOfType;
            } else {
                tracker[planetTypeDatum.type + planetTypeDatum.planetType] = finalArray.length;
                finalArray.push(planetTypeDatum);
            }
        });
        return Promise.resolve(finalArray);
    });

}

module.exports = getPlanetTypeCountsByStarType;
