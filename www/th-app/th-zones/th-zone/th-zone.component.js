class ThZoneController {
	static $inject = ['$http', '$mdDialog', '$state'];
	
	ENABLE_MANUAL_MODE_FEATURE_TOGGLE = false;
	modeIcon = ['heat', 'cool'];
	modeStatusIcon = ['radiator', 'ac'];

	constructor($http, $mdDialog, $state) {
		this.$http = $http, 
		this.$mdDialog = $mdDialog, 
		this.$state = $state
		this.mode = -1;
	}
	$onInit() {
		this.zoneControlId = this.zoneData.id;
		this.zone = this.zoneData.zone;
		this.sensor = this.zone && this.zone.sensor;
		this.mode = this.zoneData.mode;
		this.schedule = this.zoneData.interval;
		this.temperature = this.zoneData.temperature
		this.zoneImageUrl = undefined;

		const customImageUrl = this.zone && this.zone.id ? `/img/zones/${this.zone.id}.jpg` : undefined;
		this.schedule.temperature = parseFloat(this.schedule.temperature).toFixed(2);

		if (customImageUrl) this.$http.get(customImageUrl)
		.then(response => { if (response.status === 200) this.zoneImageUrl = customImageUrl; }, angular.noop)
		.finally(() => {if (this.zoneImageUrl === undefined) this.zoneImageUrl = '/img/zones/$$default.jpg'});
	}
	changeTemperature(increment) {
		if (!angular.isNumber(increment)) return;
		const newTemp =  (+this.schedule.temperature + increment).toFixed(2);
		this.schedule.temperature = parseFloat(newTemp);

		var postData = {
			id: this.zoneControlId,
			zoneId: this.zone.id,
			temperatureOverride: this.schedule.temperature
		}
		this.$http.post('manual', postData).then(() => this.$state.reload());
	}
	setManualTemperature = function (ev) {
		if (!this.ENABLE_MANUAL_MODE_FEATURE_TOGGLE) return;
		const dialog = this.$mdDialog.prompt()
			.title('What temperature would you like to set?')
			.placeholder('C')
			.ariaLabel('Temperature')
			.initialValue(this.schedule.temperature)
			.targetEvent(ev)
			.required(true)
			.ok('Set')
			.cancel('Cancel');
		
		this.$mdDialog
			.show(dialog)
			.then(function (result) {
				const newTemp = +result;
				if (newTemp === this.schedule.temperature || !angular.isNumber(newTemp)) return;
				else {
					var postData = {
						id: this.zoneControlId,
						zoneId: this.zone.id,
						temperatureOverride: newTemp
					}

					this.schedule.temperature = newTemp;

					$http.post('manual', postData).then(() => {
						//THIS WILL TRIGGER A FACE RELOAD
						this.$state.reload();
					})
				}
		});
	}
	sensorShouldBeActive = function () {
		return this.mode === 0 ?
			(this.sensor.temperature.value < this.schedule.temperature - this.temperature.threshold) :
			(this.sensor.temperature.value > this.schedule.temperature + this.temperature.threshold);
	}
}


export const thZoneName = 'thZone';
export const thZoneComponent = {
	templateUrl: 'th-app/th-zones/th-zone/th-zone.component.html',
	controller: ThZoneController,
	bindings: {
		zoneData: '<zone'
	}
};