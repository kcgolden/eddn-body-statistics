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

    totalSystemsNumbers: Ember.computed.mapBy('model.planetTypeByMassType', 'totalSystems'),
    totalSystemsWithMassCodes: Ember.computed.sum('totalSystemsNumbers'),

    massDistributionPie: Ember.computed('model.planetTypeByMassType', 'totalSystemsNumbers', function() {
        return this.get('model.planetTypeByMassType').map((massInfo) => {
            return {
                label: massInfo.massCode.toUpperCase(),
                value: massInfo.totalSystems / this.get('totalSystemsWithMassCodes')
            };
        });
    }),


    starTypes: Ember.computed.uniqBy('model.planetTypeByStarType', 'type'),
    starScansPie: Ember.computed.map('starTypes', function(typeData) {
        return {
            label: typeData.type,
            value: typeData.totalStarsOfType
        }
    })
});
