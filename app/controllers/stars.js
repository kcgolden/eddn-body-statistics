import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
    starTypes: Ember.computed.uniqBy('model', 'type'),
    starScansPie: Ember.computed.map('starTypes', (typeData) => {
        return {
            label: typeData.type,
            value: typeData.totalStarsOfType
        }
    })
});
