import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
    mapPlanetsByStarType: Ember.computed.map('model', function(starData) {
        return {
            label: starData.type + ' (' + starData.totalStarsOfType + ')',
            value: starData.pct,
            group: starData.planetType,
            isCommon: this.get('commonPlanetTypes').indexOf(starData.planetType) > -1
        }
    }),
    commonPlanetTypes: ['Icy body', 'High metal content body', 'Rocky body', 'Metal rich body', 'Asteroid Belt'],
    commonPlanetTypeMapping: Ember.computed.filterBy('mapPlanetsByStarType', 'isCommon', true),
    ucommonPlanetTypeMapping: Ember.computed.filterBy('mapPlanetsByStarType', 'isCommon', false),

});
