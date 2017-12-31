import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
    commonPlanetTypes: ['Icy body', 'High metal content body', 'Rocky body', 'Metal rich body', 'Asteroid Belt Cluster', 'Sudarsky class I gas giant', 'Sudarsky class III gas giant', 'Sudarsky class IV gas giant'],

    mapPlanetsByStarType: Ember.computed.map('model.planetTypeByStarType', function(starData) {
        return {
            label: starData.type,
            value: starData.pct,
            group: starData.planetType,
            isCommon: this.get('commonPlanetTypes').indexOf(starData.planetType) > -1
        }
    }),
    starTypeMappingSorting: ['label'],
    sortedPlanetsByStarType: Ember.computed.sort('mapPlanetsByStarType', 'starTypeMappingSorting'),
    commonPlanetTypeMapping: Ember.computed.filterBy('sortedPlanetsByStarType', 'isCommon', true),
    ucommonPlanetTypeMapping: Ember.computed.filterBy('sortedPlanetsByStarType', 'isCommon', false),

    mapPlanetsByMassType: Ember.computed.map('model.planetTypeByMassType', function(data) {
        return data.planetClassTotals.map((pclass) => {
            return {
                group: pclass.planetClassName,
                label: data.massCode,
                value: (pclass.count / data.totalSystems),
                isCommon: this.get('commonPlanetTypes').indexOf(pclass.planetClassName) > -1
            };
        });
    }),
    flattenedPlanetsByMassType: Ember.computed('mapPlanetsByMassType', function() {
        let flattenedList = [];

        this.get('mapPlanetsByMassType').forEach((subArray) => {
            flattenedList = flattenedList.concat(subArray);
        });
        flattenedList.sort((a, b) => {
            if(a.label < b.label) {
                return 1;
            } else if (a.label > b.label) {
                return -1;
            } else {
                return 0;
            }
        });
        return flattenedList;
    }),
    filteredNoPlanetsMassType: Ember.computed.filter('flattenedPlanetsByMassType', function(datum) {
        return datum.group !== 'no planets'
    }),
    commonPlanetMassTypeMapping: Ember.computed.filterBy('filteredNoPlanetsMassType', 'isCommon', true),
    uncommonPlanetMassTypeMapping: Ember.computed.filterBy('filteredNoPlanetsMassType', 'isCommon', false),

    planetTypes: Ember.computed.uniqBy('model.planetTypeByStarType', 'planetType'),
    planetScansPie: Ember.computed.map('planetTypes', function(planetType) {
        return {
            label: planetType.planetType,
            value: this.get('model.planetTypeByStarType').filterBy('planetType', planetType.planetType).mapBy('totalPlanetsOfType').reduce(function(a, b) {
                return a + b;
            }, 0)
        }
    })
});
