function getPlanetMatsByPlanetType(conn) {
    let collection = conn.get('bodies');
    let aggQueries = [];

    let rawGroupByPlanetName = {
        $group: {
            _id: '$BodyName',
            Materials: {
                $first:'$Materials'
            },
            planetType: {
                $first: '$PlanetClass'
            }
        }
    };
    aggQueries.push(rawGroupByPlanetName);

    let planetsWithMatsOnly = {
        $match: {
            Materials: {
                $exists: true,
                $not: {$size: 0}
            }
        }
    };
    aggQueries.push(planetsWithMatsOnly);

    let unwindMaterials = {
        $unwind: '$Materials'
    };
    aggQueries.push(unwindMaterials);

    let groupByPlanetName = {
        $group: {
            _id: '$_id',
            planetType: {
                $first: '$planetType'
            },
            totalMats: {
                $sum: 1
            },
            Materials: {
                $push: '$Materials'
            }
        }
    }
    aggQueries.push(groupByPlanetName);

    let groupByType = {
        $group: {
            _id: '$planetType',
            totalMatsRecordedForPlanetType: {
                $sum: '$totalMats'
            },
            Materials: {
                $push: '$Materials'
            },
            totalPlanetsOfThisType: {
                $sum: 1
            }
        }
    }
    aggQueries.push(groupByType);
    aggQueries.push(unwindMaterials);
    aggQueries.push(unwindMaterials);

    let filteroutNullMats = {
        $match: {
            'Materials.Name': {
                $ne: null
            }
        }
    };
    aggQueries.push(filteroutNullMats);

    let groupByMatTypeAndPlanetType = {
        $group: {
            _id: {
                planetType: '$_id',
                materialName: '$Materials.Name'
            },
            totalMatsRecordedForPlanetType: {
                $first: '$totalMatsRecordedForPlanetType'
            },
            totalPlanetsOfThisType: {
                $first: '$totalPlanetsOfThisType'
            },
            totalPlanetsOfThisTypeWithThisMaterial: {
                $sum: 1
            },
            averageMaterialWeightForPlanetType: {
                $avg: {
                    $divide: ['$Materials.Percent', 100]
                }
            }
        }
    };
    aggQueries.push(groupByMatTypeAndPlanetType);    
    
    let projectFinalFields = {
        $project: {
            _id: 0,
            planetType: '$_id.planetType',
            materialName: '$_id.materialName',
            totalMatsRecordedForPlanetType: 1,
            totalPlanetsOfThisType: 1,
            totalPlanetsOfThisTypeWithThisMaterial: 1,
            averageMaterialWeightForPlanetType: 1,
            materialOccurrencePct: {
                $divide: ['$totalPlanetsOfThisTypeWithThisMaterial', '$totalPlanetsOfThisType']
            }
        }
    }
    aggQueries.push(projectFinalFields);

    return collection.aggregate(aggQueries, {allowDiskUse: true});
}
module.exports = getPlanetMatsByPlanetType; 