class ThZonesComponentController {}
export const thZonesName = 'thZones';
export const thZonesComponent = {
	templateUrl: 'th-app/th-zones/th-zones.component.html',
	controller: ThZonesComponentController,
	bindings: {
		activeZones: '<',
		thermostat: '<',
		settingsModes: '<'
	}
};