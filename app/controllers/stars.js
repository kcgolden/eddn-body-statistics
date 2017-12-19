import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
    mapPlanetsByStarType: Ember.computed.map('model', function(starData) {
        return {
            label: starData.type + ' (' + starData.totalStarsOfType + ')',
            value: starData.pct,
            group: starData.planetType
        }
    })
});
