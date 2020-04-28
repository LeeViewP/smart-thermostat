class ThThermostatComponentController {
	$onInit() {
		this.search = {mode:this.thermostat.mode.mode};
	}
	
}

export const thThermostatName = 'thThermostat';
export const thThermostatComponent = {
	templateUrl: 'th-app/th-thermostat/th-thermostat.component.html',
	controller: ThThermostatComponentController,
	bindings: {
		thermostat: '<',
		settingsModes: '<'
	}
};