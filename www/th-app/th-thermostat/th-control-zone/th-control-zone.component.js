class ThControlZoneController{}

export const thControlZoneName = 'thControlZone';
export const thControlZoneComponent = {
	templateUrl: 'th-app/th-thermostat/th-control-zone/th-control-zone.component.html',
	controller: ThControlZoneController,
	bindings: {
		zone: '<zone'
	}
};