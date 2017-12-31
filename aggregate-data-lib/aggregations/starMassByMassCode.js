const uniq = require('../utils/uniq');

function getStarMassByMassCode(conn) {
    let collection = conn.get('stars');
    let aggQueries = [];


    let filterToThreeWordedMainStars = {
        $match: {
            StarSystem: /\S+\s{1}\S+\s{1}[a-h](\d+\-\d+$|\d+$)/,
            $expr: {
                $eq: ['$StarSystem', '$BodyName']
            }

        }
    }
    aggQueries.push(filterToThreeWordedMainStars);

    let groupByStarNames = {
        $group: {
            _id: '$StarSystem',
            mass: {
                $max:'$StellarMass'
            },
            type: {
                $first: '$StarType'
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

    let unwindPlanets = {
        $unwind: {
            path: '$planets',
            preserveNullAndEmptyArrays: true
        }
    };
    aggQueries.push(unwindPlanets);

    let groupByPlanetType = {
        $group: {
            _id: {
                planetClass: '$planets.PlanetClass',
                starSystem: '$_id'
            },
            count: {
                $sum: 1
            },
            mass: {
                $first: '$mass'
            },
            type: {
                $first: '$type'
            }
        }
    }
    aggQueries.push(groupByPlanetType);

    let groupByStarNameAgain = {
        $group: {
            _id: '$_id.starSystem',
            mass: {
                $first: '$mass'
            },
            type: {
                $first: '$type'
            },
            planetClasses: {
                $push: {
                    planetClass: '$_id.planetClass',
                    count: '$count'
                }
            }
        }
    }
    aggQueries.push(groupByStarNameAgain);

    let sortByType = {
        $sort: {
            type: 1
        }
    }
    aggQueries.push(sortByType);

    return collection.aggregate(aggQueries, {allowDiskUse: true})
    .then((data) => {
        let massCodes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        return Promise.resolve(massCodes.map((massCode) => {
            let filteredSystems = data.filter((system) => {
                return system._id.charAt(system._id.search(/[a-h](?=(\d+\-\d+$|\d+$))/)) === massCode;
            });
            let totalGroupMass = 0;
            let minMass;
            let maxMass = 0;
            let minName;
            let maxName;
            let types = [];
            let planetClasses = [];
            filteredSystems.forEach((system) => {
                totalGroupMass += system.mass;
                minMass = (!minMass || minMass > system.mass) ? system.mass : minMass;
                maxMass = (maxMass < system.mass) ? system.mass : maxMass;
                minName = (minMass === system.mass) ? system._id : minName;
                maxName = (maxMass === system.mass) ? system._id : maxName;
                types.push(system.type);
                planetClasses = planetClasses.concat(system.planetClasses);
            });
            let typeNames = uniq(types);
            let typeTotals = typeNames.map((name) => {
                return {
                    typeName: name,
                    count: types.filter((typeObj) => {
                        return typeObj === name;
                    }).length
                };
            });
            let planetClassNames = uniq(planetClasses.map((planetClass) => {
                return planetClass.planetClass;
            }));
            let planetClassTotals = planetClassNames.map((name) => {
                return {
                    planetClassName: name || 'no planets',
                    count: planetClasses.filter((pclass) => {
                        return pclass.planetClass === name;
                    }).reduce((a, b) => {
                        return a + b.count;
                    }, 0)
                }
            });
            return {
                minName: minName,
                maxName: maxName,
                massCode: massCode,
                minMass: minMass,
                maxMass: maxMass,
                avgMass: totalGroupMass / filteredSystems.length,
                totalMass: totalGroupMass,
                totalSystems: filteredSystems.length,
                typeTotals: typeTotals,
                planetClassTotals: planetClassTotals,
            }
        }));
    });
}

module.exports = getStarMassByMassCode;