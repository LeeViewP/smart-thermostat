class ThZoneController {
	static $inject = ['$http', '$mdDialog', '$state', '$scope'];

	ENABLE_MANUAL_MODE_FEATURE_TOGGLE = true;
	modeIcon = ['heat', 'cool'];
	modeStatusIcon = ['radiator', 'ac'];

	constructor($http, $mdDialog, $state, $scope) {
		this.$http = $http;
		this.$mdDialog = $mdDialog;
		this.$state = $state;
		this.mode = -1;
		this.$scope = $scope;
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
		// this.schedule.temperature = +parseFloat(this.schedule.temperature).toFixed(2);

		if (customImageUrl) this.$http.get(customImageUrl)
			.then(response => { if (response.status === 200) this.zoneImageUrl = customImageUrl; }, angular.noop)
			.finally(() => { if (this.zoneImageUrl === undefined) this.zoneImageUrl = '/img/zones/$$default.jpg' });

		this.$scope.$watch(() => this.schedule.temperature, (newValue, oldValue) => {
			if (newValue === oldValue) return;
			this.setTemperature(newValue);
		}
		)
	}
	canChangeTemperature = () => this.zone.relays.length > 0;

	setTemperature = (temperature) => {
		const newTemp = (+temperature).toFixed(2);
		// this.schedule.temperature = parseFloat(newTemp);

		var postData = {
			id: this.zoneControlId,
			zoneId: this.zone.id,
			temperatureOverride: +newTemp
		}
		this.$http.post('manual', postData).then(() => this.$state.reload(),);
	}
	changeTemperature(increment) {
		if (!angular.isNumber(increment)) return;
		// const newTemp = (+this.schedule.temperature + increment).toFixed(2);
		this.schedule.temperature =  +(this.schedule.temperature + increment).toFixed(2);;
		// this.setTemperature(newTemp);
	}
	setManualTemperature = function (ev) {
		if (!this.ENABLE_MANUAL_MODE_FEATURE_TOGGLE || !this.canChangeTemperature()) return;
		const dialog = this.$mdDialog.prompt()
			.title('What temperature would you like to set?')
			.placeholder('C')
			.ariaLabel('Temperature')
			.initialValue(this.schedule.temperature)
			.targetEvent(ev)
			.required(true)
			.ok('Set')
			.cancel('Cancel');
		let $obj = this;
		this.$mdDialog
			.show(dialog)
			.then(function (result) {
				const newTemp = +result;
				if (newTemp === $obj.schedule.temperature || !angular.isNumber(newTemp)) return;
				else {
					$obj.schedule.temperature = newTemp;
					// $obj.setTemperature(newTemp);
				}
			});
	}

	sensorShouldBeActive = function () {

		return this.zone.relays.filter(element => element._channels[0].ison).length > 0;
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