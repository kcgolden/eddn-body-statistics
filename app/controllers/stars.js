import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
    massInfoMapping: Ember.computed.map('model.planetTypeByMassType', function(massInfo) {
        massInfo.massCode = massInfo.massCode.toUpperCase();
        massInfo.pie = massInfo.typeTotals.map((typeTotal) => {
            return {
                label: typeTotal.typeName,
                value: typeTotal.count / massInfo.totalSystems
            }
        });
        return massInfo;
    }),


    starTypes: Ember.computed.uniqBy('model.planetTypeByStarType', 'type'),
    starScansPie: Ember.computed.map('starTypes', function(typeData) {
        return {
            label: typeData.type,
            value: typeData.totalStarsOfType
        }
    })
});
