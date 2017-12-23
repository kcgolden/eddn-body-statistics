import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
    mapPlanetsByStarType: Ember.computed.map('model', function(starData) {
        return {
            label: starData.type,
            value: starData.pct,
            group: starData.planetType,
            isCommon: this.get('commonPlanetTypes').indexOf(starData.planetType) > -1
        }
    }),
    commonPlanetTypes: ['Icy body', 'High metal content body', 'Rocky body', 'Metal rich body', 'Asteroid Belt Cluster', 'Sudarsky class I gas giant', 'Sudarsky class III gas giant', 'Sudarsky class IV gas giant'],
    commonPlanetTypeMapping: Ember.computed.filterBy('mapPlanetsByStarType', 'isCommon', true),
    ucommonPlanetTypeMapping: Ember.computed.filterBy('mapPlanetsByStarType', 'isCommon', false),
    planetTypes: Ember.computed.uniqBy('model', 'planetType'),
    planetScansPie: Ember.computed.map('planetTypes', function(planetType) {
        return {
            label: planetType.planetType,
            value: this.get('model').filterBy('planetType', planetType.planetType).mapBy('totalPlanetsOfType').reduce(function(a, b) {
                return a + b;
            }, 0)
        }
    })
});
