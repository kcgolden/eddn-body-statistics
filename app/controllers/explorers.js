import Controller from '@ember/controller';
import Ember from 'ember';

function transformScanTimeData(data, labelString, valueKey) {
    return {
        time: new Date(data._id.year, data._id.month - 1, data._id.day, 10),
        label: labelString,
        value: data[valueKey]
    }
}

export default Controller.extend({
    //pie chart "scan counts by software"
    starSoftwareNameMap: Ember.computed.mapBy('model.generalCounts.starSoftwareCount', '_id'),
    planetSoftwareNameMap: Ember.computed.mapBy('model.generalCounts.planetSoftwareCount', '_id'),
    distinctSoftwareNames: Ember.computed.union('starSoftwareNameMap', 'planetSoftwareNameMap'),
    softwareCounts: Ember.computed.map('distinctSoftwareNames', function(softwareName) {
        let starCount = this.get('model.generalCounts.starSoftwareCount').findBy('_id', softwareName).count;
        let planetCount = this.get('model.generalCounts.planetSoftwareCount').findBy('_id', softwareName).count
        return {
            label: softwareName,
            value: starCount + planetCount
        };
    }),

    //line chart "scan counts by day"
    starScanTimesMapping: Ember.computed.map('model.timeScans.starScanTimes', function(scanTimeData) {
        return transformScanTimeData(scanTimeData, 'star scans', 'scanCount');
    }),
    planetScanTimesMapping: Ember.computed.map('model.timeScans.planetScanTimes', function(scanTimeData) {
        return transformScanTimeData(scanTimeData, 'planet scans', 'scanCount');
    }),
    timeSeriesScan: Ember.computed.union('starScanTimesMapping', 'planetScanTimesMapping'),
    sortedTimeSeriesScan: Ember.computed.sort('timeSeriesScan', 'timeSeriesScanSortingAsc'),
    timeSeriesScanSortingAsc: ['time:asc'],

    //line chart "unique explorers scanning by day"
    starUniqueScannersTimesMapping: Ember.computed.map('model.timeScans.starScanTimes', function(scanTimeData) {
        return transformScanTimeData(scanTimeData, 'star scans', 'uniqueScanners');
    }),
    planetUniqueScannersTimesMapping: Ember.computed.map('model.timeScans.planetScanTimes', function(scanTimeData) {
        return transformScanTimeData(scanTimeData, 'planet scans', 'uniqueScanners');
    }),
    timeSeriesUniqueScanners: Ember.computed.union('starUniqueScannersTimesMapping', 'planetUniqueScannersTimesMapping'),
    sortedTimeSeriesUniqueScanners: Ember.computed.sort('timeSeriesUniqueScanners', 'timeSeriesScanSortingAsc'),
    timeSeriesScanSortingAsc: ['time:asc'],
});
