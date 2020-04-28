class ThThermostatModeComponentController {
	static $inject = ['$http', '$state'];
	constructor($http, $state) {
		this.$http = $http;
		this.$state = $state;
	}
	$onInit() {
		this.mode = this.modes.find(m => m.mode === this.search.mode);
	}
	changeMode(newMode) {
		if (newMode === this.mode) return;
		this.search.mode = newMode.mode;
		this.mode = this.modes.find(m => m.mode === this.search.mode);
	}
}
export const thThermostatModesComponentName = 'thThermostatModes';
export const thThermostatModesComponent = {
	templateUrl: 'th-app/th-zones/th-modes/th-modes.component.html',
	controller: ThThermostatModeComponentController,
	bindings: {
		thermostat: '<',
		modes: '<',
		search: '<'
	}
};