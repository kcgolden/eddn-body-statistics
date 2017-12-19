import Controller from '@ember/controller';
import Ember from 'ember';

export default Controller.extend({
    starCount: Ember.computed.alias('model.starCount.firstObject.count'),
    bodyCount: Ember.computed.alias('model.bodyCount.firstObject.count')
});
