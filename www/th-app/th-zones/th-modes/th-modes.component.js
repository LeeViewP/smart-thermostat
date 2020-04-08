class ThModeComponentController {
	static $inject = ['$http', '$state'];
	constructor($http, $state) { 
		this.$http = $http;
		this.$state = $state;
	}
	modes = [
		{ mode: 0, name: "Heat", isEnabled: true, icon: "heat" },
		{ mode: 1, name: "Cool", isEnabled: true, icon: "cool" },
		{ mode: 2, name: "Auto", isEnabled: true, icon: "scheduled" },
		{ mode: -1, name: "Off", isEnabled: true, icon: "off" }
	];

	changeMode(newMode) {
		if(newMode === this.thermostat.mode) return;
		const thermostat = { ...this.thermostat, mode: newMode };
		this.$http.post('settings', { thermostat }).then(() => this.$state.reload());
	}
}
export const thModesComponentName = 'thModes';
export const thModesComponent = {
	templateUrl: 'th-app/th-zones/th-modes/th-modes.component.html',
	controller: ThModeComponentController,
	bindings: {
		thermostat: '<'
	}
};