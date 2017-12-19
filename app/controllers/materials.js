import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
    barMapByMatOccurance: Ember.computed.map('model',function(planetTypeMatData) {
        return {
            label: planetTypeMatData.planetType,
            value: planetTypeMatData.materialOccurrencePct,
            group: planetTypeMatData.materialName
        }
    }),
    barMapByMatPct: Ember.computed.map('model', function(planetTypeMatData) {
        return {
            label: planetTypeMatData.planetType,
            value: planetTypeMatData.averageMaterialWeightForPlanetType,
            group: planetTypeMatData.materialName
        }
    })
});
